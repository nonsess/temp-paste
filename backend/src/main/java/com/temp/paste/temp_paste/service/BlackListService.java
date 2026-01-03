package com.temp.paste.temp_paste.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.*;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class BlackListService {

    @Value("${app.blacklist.path}")
    private String filePath;

    private Set<String> forbiddenWords = new HashSet<>();

    @PostConstruct
    public void init() {
        loadWords();
    }

    public void loadWords() {
        File file = new File(filePath);
        if (!file.exists()) {
            System.err.println("CRITICAL: Blacklist file not found at " + filePath);
            return;
        }

        // Используем явную кодировку UTF-8, чтобы русские буквы не превратились в знаки вопроса
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(new FileInputStream(file), java.nio.charset.StandardCharsets.UTF_8))) {

            forbiddenWords = reader.lines()
                    .map(String::trim)
                    .filter(line -> !line.isEmpty())
                    .map(String::toLowerCase) // ПРИВОДИМ К НИЖНЕМУ РЕГИСТРУ ПРИ ЗАГРУЗКЕ
                    .collect(Collectors.toSet());

            System.out.println("Blacklist loaded: " + forbiddenWords.size() + " words.");
        } catch (IOException e) {
            System.err.println("Error reading file: " + e.getMessage());
        }
    }

    public String censor(String text) {
        if (text == null || text.isBlank() || forbiddenWords.isEmpty()) {
            return text;
        }

        String censoredText = text;
        // Приводим весь текст к нижнему регистру ОДИН РАЗ для быстрой проверки
        String lowerText = text.toLowerCase();

        for (String word : forbiddenWords) {
            // word уже в нижнем регистре (мы сделали это в loadWords)
            if (lowerText.contains(word)) {
                // (?iu) -> i = ignore case, u = unicode case (обязательно для русского языка)
                censoredText = censoredText.replaceAll("(?iu)" + Pattern.quote(word), "***");
            }
        }
        return censoredText;
    }

    public boolean containsBadWords(String text) {
        if (text == null) return false;
        String lowerText = text.toLowerCase();
        return forbiddenWords.stream().anyMatch(lowerText::contains);
    }
}