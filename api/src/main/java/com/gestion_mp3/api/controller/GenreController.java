// GenreController.java
package com.gestion_mp3.api.controller;
import com.gestion_mp3.api.model.Genre;
import com.gestion_mp3.api.service.GenreService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/genres")
public class GenreController {
    private final GenreService service;

    public GenreController(GenreService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Genre> inserer(@RequestBody Genre genre) {
        return ResponseEntity.ok(service.inserer(genre));
    }
}