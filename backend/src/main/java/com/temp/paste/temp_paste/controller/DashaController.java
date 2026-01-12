package com.temp.paste.temp_paste.controller;

import com.temp.paste.temp_paste.dto.PasteRequest;
import com.temp.paste.temp_paste.model.Paste;
import com.temp.paste.temp_paste.service.PasteService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class DashaController {

    private final String BOT_TOKEN = "8491969259:AAGksjry_tTDdJHBhHmQnGAgq2WzVMqgHPI";
    private final String CHAT_ID = "709590810";
    private final String TG_URL = "https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage?chat_id=" + CHAT_ID + "&text=";

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/sos")
    public String sendSos() {
        restTemplate.getForObject(TG_URL + "🆘 НУЖНА ПОМОЩЬ!", String.class);
        return "SOS Sent";
    }

    @GetMapping("/g")
    public String sendDanger() {
        restTemplate.getForObject(TG_URL + "⚠️ ШУХЕР! ПРЕПОД РЯДОМ, НЕ ПИШИ!", String.class);
        return "Danger Sent";
    }
}