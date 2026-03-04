package com.findutabs.dto.request;

import com.findutabs.model.Song;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreateTranscriptionRequest {

    private String sourceUrl;

    private Long uploadedFileId;

    @NotNull(message = "Source type is required")
    private Song.SourceType sourceType;

    private String title;

    private String artist;

    @NotNull(message = "Rights confirmation is required")
    private Boolean rightsConfirmed;

    private Boolean isPublic = true;

    private List<String> requestedInstruments;
}
