package com.findutabs.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

/**
 * Servlet filter that runs BEFORE any request processing.
 * Populates SLF4J MDC with:
 * - traceId:    unique UUID per request, returned in X-Trace-Id response header
 * - requestStart: epoch millis, used to compute response duration in the exception handler
 * - method / path: for structured logging
 *
 * User info (userId, username) is added by JwtAuthenticationFilter AFTER JWT validation.
 */
@Component
@Order(1)
public class MdcContextFilter extends OncePerRequestFilter {

    private static final int MAX_USER_AGENT_LENGTH = 120;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String traceId = UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        try {
            MDC.put("traceId", traceId);
            MDC.put("requestStart", String.valueOf(System.currentTimeMillis()));
            MDC.put("method", request.getMethod());
            MDC.put("path", request.getRequestURI());
            MDC.put("clientIp", getClientIp(request));
            MDC.put("userAgent", truncate(request.getHeader("User-Agent"), MAX_USER_AGENT_LENGTH));

            response.setHeader("X-Trace-Id", traceId);

            filterChain.doFilter(request, response);
        } finally {
            MDC.clear(); // CRITICAL: prevent MDC leaks in thread pool
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            return xff.split(",")[0].trim(); // first IP in chain
        }
        return request.getRemoteAddr();
    }

    private String truncate(String value, int maxLength) {
        if (value == null) return "unknown";
        return value.length() > maxLength ? value.substring(0, maxLength) + "..." : value;
    }
}
