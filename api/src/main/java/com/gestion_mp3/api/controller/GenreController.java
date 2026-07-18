// GenreController.java
package com.gestion_mp3.api.controller;

import com.gestion_mp3.api.model.Genre;
import com.gestion_mp3.api.model.Langue;
import com.gestion_mp3.api.service.GenreService;

import java.util.List;
import java.util.Optional;

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

    @GetMapping("/libelle/{libelle}")
    public ResponseEntity<Genre> findByLibelle(@PathVariable(name = "libelle") String libelle) {
        return service.findByLibelle(libelle) // renvoie un Optional<Album>
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Genre>> findAll() {
        List<Genre> genres = service.findAll(); 
        return ResponseEntity.ok(genres);
    }

}