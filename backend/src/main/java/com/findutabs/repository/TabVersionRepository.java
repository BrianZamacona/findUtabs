package com.findutabs.repository;

import com.findutabs.model.TabVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TabVersionRepository extends JpaRepository<TabVersion, Long> {
    List<TabVersion> findByTabIdOrderByVersionNumberDesc(Long tabId);
    Optional<TabVersion> findTopByTabIdOrderByVersionNumberDesc(Long tabId);
}
