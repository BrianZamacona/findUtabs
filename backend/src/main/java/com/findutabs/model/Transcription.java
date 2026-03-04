package com.findutabs.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "transcriptions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transcription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TranscriptionStatus status = TranscriptionStatus.PENDING;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "tabs_data", columnDefinition = "jsonb")
    private Map<String, Object> tabsData;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "staff_data", columnDefinition = "jsonb")
    private Map<String, Object> staffData;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "chords_data", columnDefinition = "jsonb")
    private Map<String, Object> chordsData;

    @Column(name = "ai_provider", length = 100)
    private String aiProvider;

    @Column(name = "ai_model_version", length = 50)
    private String aiModelVersion;

    @Column(name = "error_message")
    private String errorMessage;

    @Column(name = "processing_started_at")
    private LocalDateTime processingStartedAt;

    @Column(name = "processing_completed_at")
    private LocalDateTime processingCompletedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public enum TranscriptionStatus {
        PENDING, PROCESSING, COMPLETED, FAILED
    }
}
