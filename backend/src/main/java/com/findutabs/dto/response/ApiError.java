package com.findutabs.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.findutabs.exception.AppErrorCode;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.Map;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiError {

    private final boolean success;          // always false
    private final int status;               // HTTP status code (400, 404, 500...)
    private final AppErrorCode errorCode;   // machine-readable code
    private final String message;           // generic, safe for client
    private final Map<String, String> fieldErrors; // only for VALIDATION_ERROR
    private final String traceId;           // from MDC, helps correlate with logs
    @Builder.Default
    private final Instant timestamp = Instant.now();

    public static ApiError of(int status, AppErrorCode errorCode, String message, String traceId) {
        return ApiError.builder()
                .success(false)
                .status(status)
                .errorCode(errorCode)
                .message(message)
                .traceId(traceId)
                .build();
    }

    public static ApiError validation(Map<String, String> fieldErrors, String traceId) {
        return ApiError.builder()
                .success(false)
                .status(400)
                .errorCode(AppErrorCode.VALIDATION_ERROR)
                .message("Validation failed. Please check the submitted fields.")
                .fieldErrors(fieldErrors)
                .traceId(traceId)
                .build();
    }
}
