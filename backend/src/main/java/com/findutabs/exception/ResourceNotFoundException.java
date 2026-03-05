package com.findutabs.exception;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends AppException {
    public ResourceNotFoundException(String internalDetail) {
        super(AppErrorCode.RESOURCE_NOT_FOUND, HttpStatus.NOT_FOUND,
              "The requested resource was not found", internalDetail);
    }
}
