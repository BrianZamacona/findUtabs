package com.findutabs.controller;

import com.findutabs.dto.response.ApiResponse;
import com.findutabs.dto.response.ApiResponse.PaginationMeta;
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
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
    public ApiResponse<Map<String, Long>> getStats() {
        return ApiResponse.ok(adminService.getStats());
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all users (paginated)")
    public ApiResponse<List<UserResponse>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<UserResponse> result = adminService.getUsers(pageable);
        return ApiResponse.paginated(result.getContent(), PaginationMeta.of(result));
    }

    @DeleteMapping("/users/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a user")
    public void deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
    }

    @PutMapping("/users/{id}/ban")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Ban or unban a user")
    public ApiResponse<UserResponse> banUser(@PathVariable Long id) {
        return ApiResponse.ok(adminService.banUser(id));
    }

    @GetMapping("/dmca-reports")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get DMCA reports (paginated)")
    public ApiResponse<List<DmcaReport>> getDmcaReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<DmcaReport> result = adminService.getDmcaReports(pageable);
        return ApiResponse.paginated(result.getContent(), PaginationMeta.of(result));
    }

    @PutMapping("/dmca-reports/{id}/action")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Take action on a DMCA report")
    public ApiResponse<DmcaReport> actionDmcaReport(@PathVariable Long id,
                                                     @RequestParam String action) {
        return ApiResponse.ok(adminService.actionDmcaReport(id, action));
    }

    @DeleteMapping("/tabs/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a tab (admin moderation)")
    public void deleteTab(@PathVariable Long id) {
        adminService.deleteTab(id);
    }
}
