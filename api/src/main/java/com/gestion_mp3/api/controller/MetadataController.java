// MetadataController.java
package com.gestion_mp3.api.controller;
import com.gestion_mp3.api.model.Metadata;
import com.gestion_mp3.api.service.MetadataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/metadata")
public class MetadataController {
    private final MetadataService service;

    public MetadataController(MetadataService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Metadata> inserer(@RequestBody Metadata metadata) {
        return ResponseEntity.ok(service.inserer(metadata));
    }
}