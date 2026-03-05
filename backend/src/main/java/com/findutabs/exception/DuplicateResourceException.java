package com.findutabs.exception;

import org.springframework.http.HttpStatus;

public class DuplicateResourceException extends AppException {
    public DuplicateResourceException(String internalDetail) {
        super(AppErrorCode.DUPLICATE_RESOURCE, HttpStatus.CONFLICT,
              "The resource already exists", internalDetail);
    }
}
