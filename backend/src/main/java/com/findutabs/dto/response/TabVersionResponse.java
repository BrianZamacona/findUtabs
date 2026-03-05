package com.findutabs.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TabVersionResponse {
    private Long id;
    private Long tabId;
    private Integer versionNumber;
    private String alphaTexData;
    private String changeNotes;
    private Long createdById;
    private String createdByUsername;
    private LocalDateTime createdAt;
}
