package com.findutabs.service;

import com.findutabs.dto.request.CreateTranscriptionRequest;
import com.findutabs.dto.response.LibrarySongResponse;
import com.findutabs.dto.response.TranscriptionResponse;
import com.findutabs.exception.BusinessException;
import com.findutabs.exception.ResourceNotFoundException;
import com.findutabs.model.Song;
import com.findutabs.model.Transcription;
import com.findutabs.model.User;
import com.findutabs.model.UserSong;
import com.findutabs.repository.SongRepository;
import com.findutabs.repository.TranscriptionRepository;
import com.findutabs.repository.UserRepository;
import com.findutabs.repository.UserSongRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class TranscriptionService {

    private final SongRepository songRepository;
    private final TranscriptionRepository transcriptionRepository;
    private final UserRepository userRepository;
    private final UserSongRepository userSongRepository;

    @Transactional
    public TranscriptionResponse requestTranscription(CreateTranscriptionRequest request, String username) {
        if (!Boolean.TRUE.equals(request.getRightsConfirmed())) {
            throw new BusinessException("Rights confirmation is required to submit a transcription request",
                    "RIGHTS_NOT_CONFIRMED");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        String fingerprint = generateFingerprint(request);

        Optional<Song> existingSong = fingerprint != null
                ? songRepository.findBySourceFingerprint(fingerprint)
                : Optional.empty();

        Song song;
        Transcription transcription;

        if (existingSong.isPresent()) {
            song = existingSong.get();
            // Reuse the most recently created transcription to avoid duplication
            transcription = song.getTranscriptions().stream()
                    .max(java.util.Comparator.comparing(t -> t.getCreatedAt() != null ? t.getCreatedAt() : java.time.LocalDateTime.MIN))
                    .orElse(null);

            if (transcription == null) {
                transcription = createNewTranscription(song, request);
                transcription = transcriptionRepository.save(transcription);
            }
            log.info("Reusing existing song (id={}) for fingerprint={}", song.getId(), fingerprint);
        } else {
            song = Song.builder()
                    .title(request.getTitle())
                    .artist(request.getArtist())
                    .sourceUrl(request.getSourceUrl())
                    .sourceType(request.getSourceType())
                    .sourceFingerprint(fingerprint)
                    .isPublic(Boolean.TRUE.equals(request.getIsPublic()))
                    .playCount(0)
                    .user(user)
                    .build();
            song = songRepository.save(song);

            transcription = createNewTranscription(song, request);
            transcription = transcriptionRepository.save(transcription);
        }

        if (!userSongRepository.existsByUserIdAndSongId(user.getId(), song.getId())) {
            UserSong userSong = UserSong.builder()
                    .user(user)
                    .song(song)
                    .build();
            userSongRepository.save(userSong);
        }

        return mapToTranscriptionResponse(transcription);
    }

    public TranscriptionResponse getTranscription(Long id) {
        Transcription transcription = transcriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transcription not found with id: " + id));
        return mapToTranscriptionResponse(transcription);
    }

    public Page<LibrarySongResponse> getPublicLibrary(Pageable pageable) {
        return songRepository.findByIsPublicTrueOrderByPlayCountDesc(pageable)
                .map(this::mapToLibrarySongResponse);
    }

    public Page<LibrarySongResponse> getUserLibrary(String username, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return userSongRepository.findByUserIdOrderBySavedAtDesc(user.getId(), pageable)
                .map(userSong -> mapToLibrarySongResponse(userSong.getSong()));
    }

    private Transcription createNewTranscription(Song song, CreateTranscriptionRequest request) {
        return Transcription.builder()
                .song(song)
                .status(Transcription.TranscriptionStatus.PENDING)
                .transcriptionType(Transcription.TranscriptionType.AI_GENERATED)
                .build();
    }

    private String generateFingerprint(CreateTranscriptionRequest request) {
        if (request.getSourceUrl() == null || request.getSourceUrl().isBlank()) {
            return null;
        }
        String normalized = request.getSourceUrl().trim().toLowerCase();
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(normalized.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            log.error("SHA-256 algorithm not available", e);
            return null;
        }
    }

    private TranscriptionResponse mapToTranscriptionResponse(Transcription transcription) {
        Song song = transcription.getSong();
        List<TranscriptionResponse.TrackSummary> trackSummaries = transcription.getTracks().stream()
                .map(track -> TranscriptionResponse.TrackSummary.builder()
                        .id(track.getId())
                        .trackType(track.getTrackType().name())
                        .instrumentDetail(track.getInstrumentDetail())
                        .hasTabs(track.getTabsData() != null)
                        .hasStaff(track.getStaffData() != null)
                        .hasChords(track.getChordsData() != null)
                        .hasLyrics(track.getLyricsData() != null)
                        .hasGroove(track.getGrooveData() != null)
                        .isDmcaRemoved(Boolean.TRUE.equals(track.getIsDmcaRemoved()))
                        .build())
                .toList();

        return TranscriptionResponse.builder()
                .id(transcription.getId())
                .songId(song.getId())
                .songTitle(song.getTitle())
                .songArtist(song.getArtist())
                .status(transcription.getStatus())
                .transcriptionType(transcription.getTranscriptionType())
                .bpm(transcription.getBpm())
                .timeSignature(transcription.getTimeSignature())
                .musicalKey(transcription.getMusicalKey())
                .durationMs(transcription.getDurationMs())
                .aiProvider(transcription.getAiProvider())
                .errorMessage(transcription.getErrorMessage())
                .tracks(trackSummaries)
                .createdAt(transcription.getCreatedAt())
                .processingCompletedAt(transcription.getProcessingCompletedAt())
                .build();
    }

    private LibrarySongResponse mapToLibrarySongResponse(Song song) {
        return LibrarySongResponse.builder()
                .id(song.getId())
                .title(song.getTitle())
                .artist(song.getArtist())
                .sourceType(song.getSourceType())
                .sourceUrl(song.getSourceUrl())
                .playCount(song.getPlayCount())
                .isPublic(song.getIsPublic())
                .transcriptionCount(song.getTranscriptions().size())
                .createdAt(song.getCreatedAt())
                .build();
    }
}
