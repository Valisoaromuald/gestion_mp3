// AlbumController.java
package com.gestion_mp3.api.controller;
import com.gestion_mp3.api.model.Album;
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

    @GetMapping("/{id}")
    public ResponseEntity<Album> findById(@PathVariable Integer id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}