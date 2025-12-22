package com.findutabs.dto.response;

import com.findutabs.model.Tab;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TabResponse {
    private Long id;
    private String title;
    private String artist;
    private Tab.Difficulty difficulty;
    private String tuning;
    private Long userId;
    private String username;
    private String fileUrl;
    private Integer views;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
