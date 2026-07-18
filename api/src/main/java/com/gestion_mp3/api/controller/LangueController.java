package com.gestion_mp3.api.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @GetMapping("/libelle/{libelle}")
    public ResponseEntity<Langue> findByLibelle(@PathVariable(name = "libelle") String libelle) {
        return service.findByLibelle(libelle) // renvoie un Optional<Album>
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Langue>> findAll() {
        List<Langue> langues = service.findAll(); // retourne directement une List, jamais null
        return ResponseEntity.ok(langues);
    }
}
