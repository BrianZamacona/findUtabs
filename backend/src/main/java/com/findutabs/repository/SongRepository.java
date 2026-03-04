package com.findutabs.repository;

import com.findutabs.model.Song;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SongRepository extends JpaRepository<Song, Long> {

    Page<Song> findByUserId(Long userId, Pageable pageable);

    List<Song> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Song> findBySourceFingerprint(String sourceFingerprint);

    Page<Song> findByIsPublicTrueOrderByPlayCountDesc(Pageable pageable);

    @Query("SELECT s FROM Song s WHERE LOWER(s.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.artist) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Song> searchByTitleOrArtist(@Param("query") String query, Pageable pageable);
}
