package com.findutabs.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class AppException extends RuntimeException {

    private final AppErrorCode errorCode;
    private final HttpStatus httpStatus;
    // internalDetail: detailed message ONLY for logs, never sent to client
    private final String internalDetail;

    public AppException(AppErrorCode errorCode, HttpStatus httpStatus, String clientMessage, String internalDetail) {
        super(clientMessage);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
        this.internalDetail = internalDetail != null ? internalDetail : clientMessage;
    }

    // Convenience constructor when clientMessage == internalDetail
    public AppException(AppErrorCode errorCode, HttpStatus httpStatus, String message) {
        this(errorCode, httpStatus, message, message);
    }
}
