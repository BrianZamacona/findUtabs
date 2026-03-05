package com.findutabs.exception;

import org.springframework.http.HttpStatus;

public class ForbiddenException extends AppException {
    public ForbiddenException(String internalDetail) {
        super(AppErrorCode.FORBIDDEN, HttpStatus.FORBIDDEN,
              "You do not have permission to perform this action", internalDetail);
    }
}
