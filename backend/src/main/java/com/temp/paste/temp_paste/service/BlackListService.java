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

        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            forbiddenWords = reader.lines()
                    .map(String::trim)
                    .filter(line -> !line.isEmpty())
                    .map(String::toLowerCase)
                    .collect(Collectors.toSet());
            System.out.println("Blacklist loaded: " + forbiddenWords.size() + " words.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Метод для полной блокировки (как мы хотели сначала)
    public boolean containsBadWords(String text) {
        if (text == null) return false;
        String lowerText = text.toLowerCase();
        return forbiddenWords.stream().anyMatch(lowerText::contains);
    }

    // Метод для цензуры (замена слов на ***)
    public String censor(String text) {
        if (text == null || forbiddenWords.isEmpty()) return text;

        String censoredText = text;
        for (String word : forbiddenWords) {
            // Используем регулярку, чтобы заменить слово без учета регистра
            censoredText = censoredText.replaceAll("(?i)" + Pattern.quote(word), "***");
        }
        return censoredText;
    }
}