package com.temp.paste.temp_paste.controller;

import com.temp.paste.temp_paste.exception.NotFoundException;
import com.temp.paste.temp_paste.exception.PasteSerializationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handleNotFound(NotFoundException e) {
        return e.getMessage();
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleValidation(MethodArgumentNotValidException e) {
        // Достаем только первое сообщение об ошибке из списка всех нарушений
        return "Ошибка валидации: " + e.getBindingResult().getFieldError().getDefaultMessage();
    }

    @ExceptionHandler(PasteSerializationException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public String handleSerialization(PasteSerializationException e) {
        return "Внутренняя ошибка сервера при обработке данных";
    }
}
