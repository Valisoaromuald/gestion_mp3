package com.gestion_mp3.api.controller;
import com.gestion_mp3.api.model.Artiste;
import com.gestion_mp3.api.service.ArtisteService;

import java.util.List;
import java.util.Optional;

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

    @GetMapping
    public ResponseEntity<?> findArtistes(@RequestParam(required = false) String nom) {

        boolean nomFourni = nom != null && !nom.isEmpty();

        if (nomFourni) {
            Optional<Artiste> artisteTrouve = service.findByNom(nom);

            if (artisteTrouve.isPresent()) {
                Artiste artiste = artisteTrouve.get();
                return ResponseEntity.ok(artiste);
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            List<Artiste> artistes = service.findAll();
            return ResponseEntity.ok(artistes);
        }
    }

    @GetMapping("/nom/{name}")
    public ResponseEntity<Artiste> findByName(@PathVariable(name = "name") String name) {
        System.out.println("Recherche de : " + name);
        return service.findByNom(name) // renvoie un Optional<Album>
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
