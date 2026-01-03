package com.temp.paste.temp_paste.service;

import com.temp.paste.temp_paste.dto.PasteRequest;
import com.temp.paste.temp_paste.exception.NotFoundException;
import com.temp.paste.temp_paste.exception.PasteSerializationException;
import com.temp.paste.temp_paste.model.Paste;
import com.temp.paste.temp_paste.utild.IdGenerator;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class PasteService {

    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;
    private final BlackListService blackListService;

    private String redisPrefix = "paste:";
    private Integer lenghtOfPaste = 6;

    public PasteService(StringRedisTemplate stringRedisTemplate, ObjectMapper objectMapper, BlackListService blackListService) {
        this.stringRedisTemplate = stringRedisTemplate;
        this.objectMapper = objectMapper;
        this.blackListService = blackListService;
    }

    public Paste save(PasteRequest paste) {
        String cleanText = blackListService.censor(paste.text());
        String id;
        do {
            id = IdGenerator.generate(lenghtOfPaste);
        } while ((Boolean.TRUE.equals(stringRedisTemplate.hasKey(redisPrefix + id))));

        Paste newPaste = new Paste(id, cleanText, paste.ttl());

        String json;
        try {
            json = objectMapper.writeValueAsString(newPaste);
        } catch(Exception e) {
            throw new PasteSerializationException("Failed to serialize paste to json", e);
        }

        stringRedisTemplate.opsForValue().set(
                redisPrefix + newPaste.getId(),
                json,
                newPaste.getTtl(),
                TimeUnit.MINUTES
        );

        return newPaste;
    }

    public Paste get(String id) {
        String json = stringRedisTemplate.opsForValue().get(redisPrefix + id);
        if (json == null) {
            throw new NotFoundException("Paste with id " + id + " not found");
        }

        try {
            return objectMapper.readValue(json, Paste.class);
        } catch (Exception e) {
            throw new PasteSerializationException("Internal error reading data from storage", e);        }
    }






}
