package com.gestion_mp3.api.controller;
import com.gestion_mp3.api.model.Artiste;
import com.gestion_mp3.api.service.ArtisteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/artistes")
public class ArtisteController {
    private final ArtisteService service;

    public ArtisteController(ArtisteService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Artiste> inserer(@RequestBody Artiste artiste) {
        return ResponseEntity.ok(service.inserer(artiste));
    }

} 
