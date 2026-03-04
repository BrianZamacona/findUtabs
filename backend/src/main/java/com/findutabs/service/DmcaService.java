package com.findutabs.service;

import com.findutabs.dto.request.DmcaReportRequest;
import com.findutabs.model.DmcaReport;
import com.findutabs.repository.DmcaReportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class DmcaService {

    private final DmcaReportRepository dmcaReportRepository;

    @Transactional
    public DmcaReport submitReport(DmcaReportRequest request) {
        DmcaReport report = DmcaReport.builder()
                .reporterName(request.getReporterName())
                .reporterEmail(request.getReporterEmail())
                .reporterCompany(request.getReporterCompany())
                .contentUrl(request.getContentUrl())
                .originalWorkDescription(request.getOriginalWorkDescription())
                .ownershipStatement(request.getOwnershipStatement())
                .goodFaithStatement(request.getGoodFaithStatement())
                .accuracyStatement(request.getAccuracyStatement())
                .status(DmcaReport.DmcaStatus.PENDING)
                .build();

        report = dmcaReportRepository.save(report);

        log.warn("DMCA report submitted: id={}, reporter={}, email={}, contentUrl={}",
                report.getId(),
                report.getReporterName(),
                report.getReporterEmail(),
                report.getContentUrl());

        // TODO: Send confirmation email to reporter

        return report;
    }
}
