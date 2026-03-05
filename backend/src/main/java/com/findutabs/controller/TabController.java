package com.findutabs.controller;

import com.findutabs.dto.request.CreateTabRequest;
import com.findutabs.dto.request.TabRatingRequest;
import com.findutabs.dto.request.UpdateTabRequest;
import com.findutabs.dto.response.ApiResponse;
import com.findutabs.dto.response.ApiResponse.PaginationMeta;
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
    @ResponseStatus(HttpStatus.CREATED)
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create a new tab")
    public ApiResponse<TabResponse> createTab(@Valid @RequestBody CreateTabRequest request,
                                               Authentication authentication) {
        String username = authentication.getName();
        return ApiResponse.created(tabService.createTab(request, username));
    }

    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update a tab (owner only)")
    public ApiResponse<TabResponse> updateTab(@PathVariable Long id,
                                               @Valid @RequestBody UpdateTabRequest request,
                                               Authentication authentication) {
        String username = authentication.getName();
        return ApiResponse.ok(tabService.updateTab(id, request, username));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get tab by ID")
    public ApiResponse<TabResponse> getTabById(@PathVariable Long id) {
        return ApiResponse.ok(tabService.incrementViews(id));
    }

    @GetMapping
    @Operation(summary = "Get all tabs with pagination")
    public ApiResponse<List<TabResponse>> getAllTabs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<TabResponse> result = tabService.getAllTabs(pageable);
        return ApiResponse.paginated(result.getContent(), PaginationMeta.of(result));
    }

    @GetMapping("/search/artist")
    @Operation(summary = "Search tabs by artist")
    public ApiResponse<List<TabResponse>> searchByArtist(
            @RequestParam String artist,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<TabResponse> result = tabService.searchTabsByArtist(artist, pageable);
        return ApiResponse.paginated(result.getContent(), PaginationMeta.of(result));
    }

    @GetMapping("/search/title")
    @Operation(summary = "Search tabs by title")
    public ApiResponse<List<TabResponse>> searchByTitle(
            @RequestParam String title,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<TabResponse> result = tabService.searchTabsByTitle(title, pageable);
        return ApiResponse.paginated(result.getContent(), PaginationMeta.of(result));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get tabs by user ID")
    public ApiResponse<List<TabResponse>> getTabsByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<TabResponse> result = tabService.getTabsByUserId(userId, pageable);
        return ApiResponse.paginated(result.getContent(), PaginationMeta.of(result));
    }

    @GetMapping("/top")
    @Operation(summary = "Get top 10 most viewed tabs")
    public ApiResponse<List<TabResponse>> getTopTabs() {
        return ApiResponse.ok(tabService.getTopTabs());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete a tab")
    public void deleteTab(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        tabService.deleteTab(id, username);
    }

    @GetMapping("/{id}/versions")
    @Operation(summary = "Get version history of a tab")
    public ApiResponse<List<TabVersionResponse>> getTabVersions(@PathVariable Long id) {
        return ApiResponse.ok(tabService.getTabVersions(id));
    }

    @PostMapping("/{id}/ratings")
    @ResponseStatus(HttpStatus.CREATED)
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Rate a tab")
    public ApiResponse<TabRatingResponse> rateTab(@PathVariable Long id,
                                                   @Valid @RequestBody TabRatingRequest request,
                                                   Authentication authentication) {
        String username = authentication.getName();
        return ApiResponse.created(tabService.rateTab(id, request, username));
    }

    @GetMapping("/{id}/ratings")
    @Operation(summary = "Get ratings for a tab")
    public ApiResponse<List<TabRatingResponse>> getTabRatings(@PathVariable Long id) {
        return ApiResponse.ok(tabService.getTabRatings(id));
    }

    @PostMapping("/{id}/favorite")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Toggle favorite for a tab")
    public ApiResponse<Boolean> toggleFavorite(@PathVariable Long id,
                                                Authentication authentication) {
        String username = authentication.getName();
        boolean isFavorite = tabService.toggleFavorite(id, username);
        return ApiResponse.ok(isFavorite);
    }

    @GetMapping("/favorites")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get current user's favorite tabs")
    public ApiResponse<List<TabResponse>> getUserFavorites(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {
        String username = authentication.getName();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<TabResponse> result = tabService.getUserFavorites(username, pageable);
        return ApiResponse.paginated(result.getContent(), PaginationMeta.of(result));
    }
}
