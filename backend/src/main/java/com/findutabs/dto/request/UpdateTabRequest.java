package com.findutabs.dto.request;

import com.findutabs.model.Tab;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTabRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Artist is required")
    private String artist;

    private Tab.Difficulty difficulty;

    private String tuning;

    private String alphaTexData;

    private String changeNotes;
}
