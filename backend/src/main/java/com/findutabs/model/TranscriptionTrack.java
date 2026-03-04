package com.findutabs.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "transcription_tracks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TranscriptionTrack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transcription_id", nullable = false)
    private Transcription transcription;

    @Enumerated(EnumType.STRING)
    @Column(name = "track_type", nullable = false, length = 30)
    private TrackType trackType;

    @Column(name = "instrument_detail")
    private String instrumentDetail;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "tabs_data", columnDefinition = "jsonb")
    private Map<String, Object> tabsData;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "staff_data", columnDefinition = "jsonb")
    private Map<String, Object> staffData;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "chords_data", columnDefinition = "jsonb")
    private Map<String, Object> chordsData;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "lyrics_data", columnDefinition = "jsonb")
    private Map<String, Object> lyricsData;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "groove_data", columnDefinition = "jsonb")
    private Map<String, Object> grooveData;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "sync_points", columnDefinition = "jsonb")
    private Map<String, Object> syncPoints;

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private Integer displayOrder = 0;

    @Column(name = "is_dmca_removed", nullable = false)
    @Builder.Default
    private Boolean isDmcaRemoved = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dmca_report_id")
    private DmcaReport dmcaReport;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum TrackType {
        GUITAR_LEAD, GUITAR_RHYTHM, BASS, PIANO, VIOLIN, WINDS, VOCALS, DRUMS, OTHER
    }
}
