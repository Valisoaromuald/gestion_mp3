// AlbumController.java
package com.gestion_mp3.api.controller;

import com.gestion_mp3.api.model.Album;
import com.gestion_mp3.api.model.Genre;
import com.gestion_mp3.api.service.AlbumService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/albums")
public class AlbumController {
    private final AlbumService service;

    public AlbumController(AlbumService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Album> inserer(@RequestBody Album album) {
        return ResponseEntity.ok(service.inserer(album));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<Album> findById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/libelle/{libelle}")
    public ResponseEntity<Album> findByLibelle(@PathVariable String libelle) {
        return service.findByLibelle(libelle) // renvoie un Optional<Album>
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}