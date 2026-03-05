package com.findutabs.controller;

import com.findutabs.dto.response.UserResponse;
import com.findutabs.model.DmcaReport;
import com.findutabs.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get admin statistics")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all users (paginated)")
    public ResponseEntity<Page<UserResponse>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(adminService.getUsers(pageable));
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a user")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/users/{id}/ban")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Ban or unban a user")
    public ResponseEntity<UserResponse> banUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.banUser(id));
    }

    @GetMapping("/dmca-reports")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get DMCA reports (paginated)")
    public ResponseEntity<Page<DmcaReport>> getDmcaReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(adminService.getDmcaReports(pageable));
    }

    @PutMapping("/dmca-reports/{id}/action")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Take action on a DMCA report")
    public ResponseEntity<DmcaReport> actionDmcaReport(@PathVariable Long id,
                                                        @RequestParam String action) {
        return ResponseEntity.ok(adminService.actionDmcaReport(id, action));
    }

    @DeleteMapping("/tabs/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a tab (admin moderation)")
    public ResponseEntity<Void> deleteTab(@PathVariable Long id) {
        adminService.deleteTab(id);
        return ResponseEntity.noContent().build();
    }
}
