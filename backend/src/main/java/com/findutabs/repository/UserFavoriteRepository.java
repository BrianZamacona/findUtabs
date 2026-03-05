package com.findutabs.repository;

import com.findutabs.model.UserFavorite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserFavoriteRepository extends JpaRepository<UserFavorite, Long> {
    Optional<UserFavorite> findByUserIdAndTabId(Long userId, Long tabId);
    Page<UserFavorite> findByUserId(Long userId, Pageable pageable);
    boolean existsByUserIdAndTabId(Long userId, Long tabId);
}
