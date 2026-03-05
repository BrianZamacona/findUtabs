package com.findutabs.exception;

public enum AppErrorCode {
    // 400
    VALIDATION_ERROR,
    BUSINESS_RULE_VIOLATION,
    DUPLICATE_RESOURCE,
    INVALID_REQUEST,
    // 401
    UNAUTHORIZED,
    INVALID_TOKEN,
    // 403
    FORBIDDEN,
    // 404
    RESOURCE_NOT_FOUND,
    // 408
    REQUEST_TIMEOUT,
    // 409
    CONFLICT,
    // 500
    INTERNAL_SERVER_ERROR
}
