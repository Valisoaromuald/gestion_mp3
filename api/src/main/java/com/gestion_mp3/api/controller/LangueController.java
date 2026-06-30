package com.gestion_mp3.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.gestion_mp3.api.model.Langue;
import com.gestion_mp3.api.service.LangueService;

@RestController
@RequestMapping("/api/langues")
public class LangueController {
    private final LangueService service;

    public LangueController(LangueService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Langue> inserer(@RequestBody Langue langue) {
        return ResponseEntity.ok(service.inserer(langue));
    }
}
