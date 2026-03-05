package com.findutabs.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "tab_versions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TabVersion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tab_id", nullable = false)
    private Tab tab;

    @Column(name = "version_number", nullable = false)
    private Integer versionNumber;

    @Column(name = "alpha_tex_data", columnDefinition = "TEXT")
    private String alphaTexData;

    @Column(name = "change_notes", length = 500)
    private String changeNotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
