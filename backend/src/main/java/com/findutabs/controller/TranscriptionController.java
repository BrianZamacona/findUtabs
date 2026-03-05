package com.findutabs.controller;

import com.findutabs.dto.request.CreateTranscriptionRequest;
import com.findutabs.dto.response.ApiResponse;
import com.findutabs.dto.response.ApiResponse.PaginationMeta;
import com.findutabs.dto.response.LibrarySongResponse;
import com.findutabs.dto.response.TranscriptionResponse;
import com.findutabs.service.TranscriptionService;
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
@RequestMapping("/api/transcriptions")
@RequiredArgsConstructor
@Tag(name = "Transcriptions", description = "Transcription management endpoints")
public class TranscriptionController {

    private final TranscriptionService transcriptionService;

    @PostMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Request a new transcription")
    public ApiResponse<TranscriptionResponse> requestTranscription(
            @Valid @RequestBody CreateTranscriptionRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        return ApiResponse.ok(transcriptionService.requestTranscription(request, username),
                "Transcription request accepted");
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get transcription by ID")
    public ApiResponse<TranscriptionResponse> getTranscription(@PathVariable Long id) {
        return ApiResponse.ok(transcriptionService.getTranscription(id));
    }

    @GetMapping("/library")
    @Operation(summary = "Get public song library")
    public ApiResponse<List<LibrarySongResponse>> getPublicLibrary(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "playCount"));
        Page<LibrarySongResponse> result = transcriptionService.getPublicLibrary(pageable);
        return ApiResponse.paginated(result.getContent(), PaginationMeta.of(result));
    }

    @GetMapping("/my-library")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get current user's personal library")
    public ApiResponse<List<LibrarySongResponse>> getMyLibrary(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        String username = authentication.getName();
        Pageable pageable = PageRequest.of(page, size);
        Page<LibrarySongResponse> result = transcriptionService.getUserLibrary(username, pageable);
        return ApiResponse.paginated(result.getContent(), PaginationMeta.of(result));
    }
}
