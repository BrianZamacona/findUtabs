package com.findutabs.repository;

import com.findutabs.model.UserSong;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserSongRepository extends JpaRepository<UserSong, Long> {

    Page<UserSong> findByUserIdOrderBySavedAtDesc(Long userId, Pageable pageable);

    Optional<UserSong> findByUserIdAndSongId(Long userId, Long songId);

    boolean existsByUserIdAndSongId(Long userId, Long songId);

    void deleteByUserIdAndSongId(Long userId, Long songId);
}
