package com.findutabs.repository;

import com.findutabs.model.Transcription;
import com.findutabs.model.Transcription.TranscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TranscriptionRepository extends JpaRepository<Transcription, Long> {
    List<Transcription> findBySongId(Long songId);
    Optional<Transcription> findBySongIdAndStatus(Long songId, TranscriptionStatus status);
    List<Transcription> findByStatus(TranscriptionStatus status);
}
