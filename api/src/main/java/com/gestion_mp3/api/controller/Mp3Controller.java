// Mp3Controller.java
package com.gestion_mp3.api.controller;
import com.gestion_mp3.api.model.Mp3;
import com.gestion_mp3.api.service.Mp3Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mp3")
public class Mp3Controller {
    private final Mp3Service service;

    public Mp3Controller(Mp3Service service) {
        this.service = service;
    }
    @PostMapping
    public ResponseEntity<Mp3> inserer(@RequestBody Mp3 mp3) {
        return ResponseEntity.ok(service.inserer(mp3));
    }
}