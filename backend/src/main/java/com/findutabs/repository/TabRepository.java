package com.findutabs.repository;

import com.findutabs.model.Tab;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TabRepository extends JpaRepository<Tab, Long> {
    Page<Tab> findByArtistContainingIgnoreCase(String artist, Pageable pageable);
    Page<Tab> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    Page<Tab> findByUserId(Long userId, Pageable pageable);
    List<Tab> findTop10ByOrderByViewsDesc();
}
