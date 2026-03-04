package com.findutabs.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_songs", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "song_id"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;

    @Column(name = "custom_name")
    private String customName;

    @Column(name = "saved_at", nullable = false)
    @Builder.Default
    private LocalDateTime savedAt = LocalDateTime.now();
}
