package com.findutabs.controller;

import com.findutabs.dto.request.DmcaReportRequest;
import com.findutabs.dto.response.ApiResponse;
import com.findutabs.model.DmcaReport;
import com.findutabs.service.DmcaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dmca")
@RequiredArgsConstructor
@Tag(name = "DMCA", description = "DMCA report endpoints")
public class DmcaController {

    private final DmcaService dmcaService;

    @PostMapping("/report")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Submit a DMCA takedown report")
    public ApiResponse<DmcaReport> submitReport(
            @Valid @RequestBody DmcaReportRequest request) {
        return ApiResponse.created(dmcaService.submitReport(request), "DMCA report submitted successfully");
    }
}
