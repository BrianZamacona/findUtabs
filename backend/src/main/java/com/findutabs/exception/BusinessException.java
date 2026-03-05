package com.findutabs.exception;

import org.springframework.http.HttpStatus;

public class BusinessException extends AppException {
    public BusinessException(String message) {
        super(AppErrorCode.BUSINESS_RULE_VIOLATION, HttpStatus.BAD_REQUEST, message);
    }

    // Handles both (clientMessage, internalDetail) and legacy (message, errorCode) callers
    public BusinessException(String clientMessage, String internalDetail) {
        super(AppErrorCode.BUSINESS_RULE_VIOLATION, HttpStatus.BAD_REQUEST, clientMessage, internalDetail);
    }

    // Returns the error code name as a String for legacy compatibility.
    // Use getErrorCode().name() on AppException for new code.
    public String getErrorCodeName() { return AppErrorCode.BUSINESS_RULE_VIOLATION.name(); }
}
