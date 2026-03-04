package com.findutabs.controller;

import com.findutabs.dto.request.DmcaReportRequest;
import com.findutabs.model.DmcaReport;
import com.findutabs.service.DmcaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dmca")
@RequiredArgsConstructor
@Tag(name = "DMCA", description = "DMCA report endpoints")
public class DmcaController {

    private final DmcaService dmcaService;

    @PostMapping("/report")
    @Operation(summary = "Submit a DMCA takedown report")
    public ResponseEntity<Map<String, Object>> submitReport(
            @Valid @RequestBody DmcaReportRequest request) {
        DmcaReport report = dmcaService.submitReport(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Your DMCA report has been submitted and will be reviewed shortly.",
                "reportId", report.getId(),
                "status", report.getStatus().name()
        ));
    }
}
