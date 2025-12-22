package com.findutabs.controller;

import com.findutabs.dto.request.CreateTabRequest;
import com.findutabs.dto.response.TabResponse;
import com.findutabs.service.TabService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tabs")
@RequiredArgsConstructor
@Tag(name = "Tabs", description = "Tab management endpoints")
public class TabController {

    private final TabService tabService;

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create a new tab")
    public ResponseEntity<TabResponse> createTab(@Valid @RequestBody CreateTabRequest request,
                                                  Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.status(HttpStatus.CREATED).body(tabService.createTab(request, username));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get tab by ID")
    public ResponseEntity<TabResponse> getTabById(@PathVariable Long id) {
        return ResponseEntity.ok(tabService.incrementViews(id));
    }

    @GetMapping
    @Operation(summary = "Get all tabs with pagination")
    public ResponseEntity<Page<TabResponse>> getAllTabs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        return ResponseEntity.ok(tabService.getAllTabs(pageable));
    }

    @GetMapping("/search/artist")
    @Operation(summary = "Search tabs by artist")
    public ResponseEntity<Page<TabResponse>> searchByArtist(
            @RequestParam String artist,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(tabService.searchTabsByArtist(artist, pageable));
    }

    @GetMapping("/search/title")
    @Operation(summary = "Search tabs by title")
    public ResponseEntity<Page<TabResponse>> searchByTitle(
            @RequestParam String title,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(tabService.searchTabsByTitle(title, pageable));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get tabs by user ID")
    public ResponseEntity<Page<TabResponse>> getTabsByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(tabService.getTabsByUserId(userId, pageable));
    }

    @GetMapping("/top")
    @Operation(summary = "Get top 10 most viewed tabs")
    public ResponseEntity<List<TabResponse>> getTopTabs() {
        return ResponseEntity.ok(tabService.getTopTabs());
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete a tab")
    public ResponseEntity<Void> deleteTab(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        tabService.deleteTab(id, username);
        return ResponseEntity.noContent().build();
    }
}
