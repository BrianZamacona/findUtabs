package com.findutabs.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "dmca_reports")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DmcaReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reporter_name", nullable = false)
    private String reporterName;

    @Column(name = "reporter_email", nullable = false)
    private String reporterEmail;

    @Column(name = "reporter_company")
    private String reporterCompany;

    @Column(name = "content_url", length = 1000, nullable = false)
    private String contentUrl;

    @Column(name = "original_work_description", nullable = false, columnDefinition = "TEXT")
    private String originalWorkDescription;

    @Column(name = "ownership_statement", nullable = false, columnDefinition = "TEXT")
    private String ownershipStatement;

    @Column(name = "good_faith_statement", nullable = false)
    private Boolean goodFaithStatement;

    @Column(name = "accuracy_statement", nullable = false)
    private Boolean accuracyStatement;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private DmcaStatus status = DmcaStatus.PENDING;

    @Column(name = "actioned_at")
    private LocalDateTime actionedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actioned_by")
    private User actionedBy;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum DmcaStatus {
        PENDING, REVIEWED, ACTIONED, REJECTED
    }
}
