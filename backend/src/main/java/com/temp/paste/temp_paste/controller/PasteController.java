package com.temp.paste.temp_paste.controller;

import com.temp.paste.temp_paste.dto.PasteRequest;
import com.temp.paste.temp_paste.model.Paste;
import com.temp.paste.temp_paste.service.PasteService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/pastes")
public class PasteController {

    private final PasteService pasteService;

    public PasteController(PasteService pasteService) {
        this.pasteService = pasteService;
    }

    @PostMapping
    public Paste save(@Valid @RequestBody PasteRequest pasteRequest) {
        return pasteService.save(pasteRequest);

    }

    @GetMapping("/{id}")
    public Paste get(@PathVariable String id) {
        return pasteService.get(id);
    }

}
