package com.findutabs.controller;

import com.findutabs.dto.request.CreateTranscriptionRequest;
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
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transcriptions")
@RequiredArgsConstructor
@Tag(name = "Transcriptions", description = "Transcription management endpoints")
public class TranscriptionController {

    private final TranscriptionService transcriptionService;

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Request a new transcription")
    public ResponseEntity<TranscriptionResponse> requestTranscription(
            @Valid @RequestBody CreateTranscriptionRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(transcriptionService.requestTranscription(request, username));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get transcription by ID")
    public ResponseEntity<TranscriptionResponse> getTranscription(@PathVariable Long id) {
        return ResponseEntity.ok(transcriptionService.getTranscription(id));
    }

    @GetMapping("/library")
    @Operation(summary = "Get public song library")
    public ResponseEntity<Page<LibrarySongResponse>> getPublicLibrary(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "playCount"));
        return ResponseEntity.ok(transcriptionService.getPublicLibrary(pageable));
    }

    @GetMapping("/my-library")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get current user's personal library")
    public ResponseEntity<Page<LibrarySongResponse>> getMyLibrary(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        String username = authentication.getName();
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(transcriptionService.getUserLibrary(username, pageable));
    }
}
