package com.findutabs.repository;

import com.findutabs.model.DmcaReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DmcaReportRepository extends JpaRepository<DmcaReport, Long> {

    Page<DmcaReport> findByStatus(DmcaReport.DmcaStatus status, Pageable pageable);

    long countByStatus(DmcaReport.DmcaStatus status);
}
