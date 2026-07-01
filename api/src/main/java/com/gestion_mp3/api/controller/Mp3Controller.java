// Mp3Controller.java
package com.gestion_mp3.api.controller;

import com.gestion_mp3.api.model.Album;
import com.gestion_mp3.api.model.Artiste;
import com.gestion_mp3.api.model.Genre;
import com.gestion_mp3.api.model.Langue;
import com.gestion_mp3.api.model.Mp3;
import com.gestion_mp3.api.service.Mp3Service;
import com.gestion_mp3.dto.Mp3ResponseDto;

import java.io.IOException;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/mp3")
public class Mp3Controller {
    private final Mp3Service service;

    public Mp3Controller(Mp3Service service) {
        this.service = service;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Mp3ResponseDto> inserer(
            @RequestParam("fichier") MultipartFile fichier,
            @RequestParam(value = "id_artiste", required = false) Integer idArtiste,
            @RequestParam(value = "id_album", required = false) Integer idAlbum,
            @RequestParam(value = "id_genre", required = false) Integer idGenre,
            @RequestParam(value = "id_langue", required = false) Integer idLangue) throws IOException {

        Mp3 mp3 = new Mp3();
        mp3.setFichier(fichier.getBytes());
        if (idArtiste != null)
            mp3.setArtiste(new Artiste(idArtiste, null, null));
        if (idAlbum != null)
            mp3.setAlbum(new Album(idAlbum, null, null));
        if (idGenre != null)
            mp3.setGenre(new Genre(idGenre, null, null));
        if (idLangue != null)
            mp3.setLangue(new Langue(idLangue, null, null));

        Mp3 mp3Insere = service.inserer(mp3);

        return ResponseEntity.ok(new Mp3ResponseDto(mp3Insere));
    }
}