package com.findutabs.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private final boolean success;
    private final String message;
    private final T data;
    private final PaginationMeta pagination;
    @Builder.Default
    private final Instant timestamp = Instant.now();

    // ── Factory methods ──────────────────────────────────────────
    public static <T> ApiResponse<T> ok(T data) {
        return ApiResponse.<T>builder().success(true).message("OK").data(data).build();
    }

    public static <T> ApiResponse<T> ok(T data, String message) {
        return ApiResponse.<T>builder().success(true).message(message).data(data).build();
    }

    public static <T> ApiResponse<T> created(T data) {
        return ApiResponse.<T>builder().success(true).message("Created successfully").data(data).build();
    }

    public static <T> ApiResponse<T> created(T data, String message) {
        return ApiResponse.<T>builder().success(true).message(message).data(data).build();
    }

    public static <T> ApiResponse<T> paginated(T data, PaginationMeta pagination) {
        return ApiResponse.<T>builder().success(true).message("OK").data(data).pagination(pagination).build();
    }

    // ── Inner record for pagination ───────────────────────────────
    @Builder
    @Getter
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class PaginationMeta {
        private final int page;
        private final int size;
        private final long totalElements;
        private final int totalPages;

        public static PaginationMeta of(org.springframework.data.domain.Page<?> page) {
            return PaginationMeta.builder()
                    .page(page.getNumber())
                    .size(page.getSize())
                    .totalElements(page.getTotalElements())
                    .totalPages(page.getTotalPages())
                    .build();
        }
    }
}
