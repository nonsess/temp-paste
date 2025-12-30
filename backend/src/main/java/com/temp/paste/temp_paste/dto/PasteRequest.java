package com.temp.paste.temp_paste.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record PasteRequest(
        @NotBlank(message = "Текст пасты не может быть пустым")
        String text,
        @Min(value = 1, message = "TTL должен быть не меньше 1 минуты")
        @Max(value = 1440, message = "Максимальный срок хранения — 1 дней (1440 мин)")
        Integer ttl) {

}