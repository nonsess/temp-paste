package com.temp.paste.temp_paste.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class PasteSerializationException extends RuntimeException {
    public PasteSerializationException(String message, Throwable cause) {
        super(message, cause);
    }
}
