package com.findutabs.controller;

import com.findutabs.dto.request.CreateTabRequest;
import com.findutabs.dto.request.TabRatingRequest;
import com.findutabs.dto.request.UpdateTabRequest;
import com.findutabs.dto.response.TabRatingResponse;
import com.findutabs.dto.response.TabResponse;
import com.findutabs.dto.response.TabVersionResponse;
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
import java.util.Map;

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

    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update a tab (owner only)")
    public ResponseEntity<TabResponse> updateTab(@PathVariable Long id,
                                                  @Valid @RequestBody UpdateTabRequest request,
                                                  Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(tabService.updateTab(id, request, username));
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

    @GetMapping("/{id}/versions")
    @Operation(summary = "Get version history of a tab")
    public ResponseEntity<List<TabVersionResponse>> getTabVersions(@PathVariable Long id) {
        return ResponseEntity.ok(tabService.getTabVersions(id));
    }

    @PostMapping("/{id}/ratings")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Rate a tab")
    public ResponseEntity<TabRatingResponse> rateTab(@PathVariable Long id,
                                                      @Valid @RequestBody TabRatingRequest request,
                                                      Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(tabService.rateTab(id, request, username));
    }

    @GetMapping("/{id}/ratings")
    @Operation(summary = "Get ratings for a tab")
    public ResponseEntity<List<TabRatingResponse>> getTabRatings(@PathVariable Long id) {
        return ResponseEntity.ok(tabService.getTabRatings(id));
    }

    @PostMapping("/{id}/favorite")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Toggle favorite for a tab")
    public ResponseEntity<Map<String, Boolean>> toggleFavorite(@PathVariable Long id,
                                                               Authentication authentication) {
        String username = authentication.getName();
        boolean isFavorite = tabService.toggleFavorite(id, username);
        return ResponseEntity.ok(Map.of("favorite", isFavorite));
    }

    @GetMapping("/favorites")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get current user's favorite tabs")
    public ResponseEntity<Page<TabResponse>> getUserFavorites(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {
        String username = authentication.getName();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(tabService.getUserFavorites(username, pageable));
    }
}
