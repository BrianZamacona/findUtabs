package com.findutabs.repository;

import com.findutabs.model.TabRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TabRatingRepository extends JpaRepository<TabRating, Long> {
    List<TabRating> findByTabIdOrderByCreatedAtDesc(Long tabId);
    Optional<TabRating> findByTabIdAndUserId(Long tabId, Long userId);

    @Query("SELECT AVG(r.rating) FROM TabRating r WHERE r.tab.id = :tabId")
    Double findAverageRatingByTabId(@Param("tabId") Long tabId);

    long countByTabId(Long tabId);
}
