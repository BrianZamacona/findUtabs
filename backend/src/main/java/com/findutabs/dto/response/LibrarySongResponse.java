package com.findutabs.dto.response;

import com.findutabs.model.Song;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class LibrarySongResponse {

    private Long id;
    private String title;
    private String artist;
    private Song.SourceType sourceType;
    private String sourceUrl;
    private Integer playCount;
    private Boolean isPublic;
    private long transcriptionCount;
    private LocalDateTime createdAt;
}
