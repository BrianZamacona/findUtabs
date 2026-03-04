package com.findutabs.repository;

import com.findutabs.model.TranscriptionTrack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TranscriptionTrackRepository extends JpaRepository<TranscriptionTrack, Long> {

    List<TranscriptionTrack> findByTranscriptionIdOrderByDisplayOrder(Long transcriptionId);

    List<TranscriptionTrack> findByTranscriptionIdAndTrackType(Long transcriptionId,
            TranscriptionTrack.TrackType trackType);
}
