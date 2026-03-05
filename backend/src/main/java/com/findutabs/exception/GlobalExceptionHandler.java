package com.findutabs.exception;

import com.findutabs.dto.response.ApiError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.async.AsyncRequestTimeoutException;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // ── Helpers ──────────────────────────────────────────────────

    private String traceId() {
        return Optional.ofNullable(MDC.get("traceId")).orElse("no-trace");
    }

    private long durationMs() {
        String start = MDC.get("requestStart");
        if (start == null) return -1;
        return System.currentTimeMillis() - Long.parseLong(start);
    }

    private String requestContext(HttpServletRequest req) {
        String clientIp = MDC.get("clientIp");
        String username = MDC.get("username");
        return String.format("method=%s path=%s ip=%s user=%s traceId=%s durationMs=%d",
                req.getMethod(),
                req.getRequestURI(),
                clientIp != null ? clientIp : "unknown",
                username != null ? username : "anonymous",
                traceId(),
                durationMs());
    }

    // ── 4xx handlers (log.warn — client's fault, no stack trace) ─

    @ExceptionHandler(AppException.class)
    public ApiError handleAppException(AppException ex, HttpServletRequest req, HttpServletResponse res) {
        res.setStatus(ex.getHttpStatus().value());
        log.warn("[{}] {} | errorCode={} | internalDetail={}",
                ex.getHttpStatus().value(),
                requestContext(req),
                ex.getErrorCode(),
                ex.getInternalDetail());

        return ApiError.of(
                ex.getHttpStatus().value(),
                ex.getErrorCode(),
                ex.getMessage(),
                traceId());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiError handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req) {
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String field = ((FieldError) error).getField();
            fieldErrors.put(field, error.getDefaultMessage());
        });

        log.warn("[400] {} | errorCode=VALIDATION_ERROR | fields={}",
                requestContext(req), fieldErrors);

        return ApiError.validation(fieldErrors, traceId());
    }

    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ApiError handleBadCredentials(BadCredentialsException ex, HttpServletRequest req) {
        log.warn("[401] {} | errorCode=UNAUTHORIZED | internalDetail=Bad credentials for attempted login",
                requestContext(req));

        return ApiError.of(401, AppErrorCode.UNAUTHORIZED,
                "Invalid username or password", traceId());
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ApiError handleAccessDenied(AccessDeniedException ex, HttpServletRequest req) {
        log.warn("[403] {} | errorCode=FORBIDDEN | internalDetail={}",
                requestContext(req), ex.getMessage());

        return ApiError.of(403, AppErrorCode.FORBIDDEN,
                "You do not have permission to perform this action", traceId());
    }

    @ExceptionHandler({AsyncRequestTimeoutException.class, RequestTimeoutException.class})
    @ResponseStatus(HttpStatus.REQUEST_TIMEOUT)
    public ApiError handleTimeout(Exception ex, HttpServletRequest req) {
        log.warn("[408] {} | errorCode=REQUEST_TIMEOUT | internalDetail={}",
                requestContext(req), ex.getMessage());

        return ApiError.of(408, AppErrorCode.REQUEST_TIMEOUT,
                "The request timed out, please try again", traceId());
    }

    // ── 5xx handler (log.error — our fault, WITH full stack trace) ─

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiError handleUnexpected(Exception ex, HttpServletRequest req) {
        log.error("[500] {} | errorCode=INTERNAL_SERVER_ERROR | exceptionClass={} | message={}",
                requestContext(req),
                ex.getClass().getName(),
                ex.getMessage(),
                ex);

        return ApiError.of(500, AppErrorCode.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred. Please try again later.", traceId());
    }
}
