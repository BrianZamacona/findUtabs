package com.findutabs.exception;

import org.springframework.http.HttpStatus;

public class UnauthorizedException extends AppException {
    public UnauthorizedException(String internalDetail) {
        super(AppErrorCode.UNAUTHORIZED, HttpStatus.UNAUTHORIZED,
              "Authentication is required to access this resource", internalDetail);
    }
}
