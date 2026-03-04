package com.findutabs.dto.response;

import com.findutabs.model.Transcription;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class TranscriptionResponse {

    private Long id;
    private Long songId;
    private String songTitle;
    private String songArtist;
    private Transcription.TranscriptionStatus status;
    private Transcription.TranscriptionType transcriptionType;
    private BigDecimal bpm;
    private String timeSignature;
    private String musicalKey;
    private Integer durationMs;
    private String aiProvider;
    private String errorMessage;
    private List<TrackSummary> tracks;
    private LocalDateTime createdAt;
    private LocalDateTime processingCompletedAt;

    @Data
    @Builder
    public static class TrackSummary {
        private Long id;
        private String trackType;
        private String instrumentDetail;
        private boolean hasTabs;
        private boolean hasStaff;
        private boolean hasChords;
        private boolean hasLyrics;
        private boolean hasGroove;
        private boolean isDmcaRemoved;
    }
}
