// AlbumController.java
package com.gestion_mp3.api.controller;

import com.gestion_mp3.api.model.Album;
import com.gestion_mp3.api.service.AlbumService;

import java.util.List;
import java.util.Optional;

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

    @GetMapping
    public ResponseEntity<?> findAlbums(@RequestParam(required = false) String libelle) {

        boolean libelleFourni = libelle != null && !libelle.isEmpty();

        if (libelleFourni) {
            Optional<Album> albumTrouve = service.findByLibelle(libelle);

            if (albumTrouve.isPresent()) {
                Album album = albumTrouve.get();
                return ResponseEntity.ok(album);
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            List<Album> tousLesAlbums = service.findAll();
            return ResponseEntity.ok(tousLesAlbums);
        }
    }

}