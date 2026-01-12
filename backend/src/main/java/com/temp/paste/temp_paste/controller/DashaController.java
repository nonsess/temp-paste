package com.temp.paste.temp_paste.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@RestController
public class DashaController {

    private final String BOT_TOKEN = "8491969259:AAGksjry_tTDdJHBhHmQnGAgq2WzVMqgHPI";
    private final String CHAT_ID = "709590810";
    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/sos")
    public String sendSos() {
        return sendMessage("🆘 НУЖНА ПОМОЩЬ!");
    }

    @GetMapping("/g")
    public String sendDanger() {
        return sendMessage("⚠️ ШУХЕР! ПРЕПОД РЯДОМ, НЕ ПИШИ!");
    }

    private String sendMessage(String text) {
        try {
            String url = UriComponentsBuilder
                    .fromUri(URI.create("https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage"))
                    .queryParam("chat_id", CHAT_ID)
                    .queryParam("text", text)
                    .toUriString();

            restTemplate.getForObject(url, String.class);
            return "Message sent: " + text;
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
}