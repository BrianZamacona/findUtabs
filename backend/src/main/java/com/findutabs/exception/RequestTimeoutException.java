package com.findutabs.exception;

import org.springframework.http.HttpStatus;

public class RequestTimeoutException extends AppException {
    public RequestTimeoutException(String internalDetail) {
        super(AppErrorCode.REQUEST_TIMEOUT, HttpStatus.REQUEST_TIMEOUT,
              "The request timed out, please try again", internalDetail);
    }
}
