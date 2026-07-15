package com.gestion_mp3.api.controller;

import com.gestion_mp3.api.model.Album;
import com.gestion_mp3.api.model.Artiste;
import com.gestion_mp3.api.model.Genre;
import com.gestion_mp3.api.model.Langue;
import com.gestion_mp3.api.model.Mp3;
import com.gestion_mp3.api.service.AlbumService;
import com.gestion_mp3.api.service.ArtisteService;
import com.gestion_mp3.api.service.GenreService;
import com.gestion_mp3.api.service.Mp3Service;
import com.gestion_mp3.dto.Mp3Dto;
import com.gestion_mp3.dto.Mp3ResponseDto;
import java.io.IOException;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;

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
        if (idArtiste != null)
            mp3.setArtiste(new Artiste(idArtiste, null, null));
        if (idAlbum != null)
            mp3.setAlbum(new Album(idAlbum, null, null));
        if (idGenre != null)
            mp3.setGenre(new Genre(idGenre, null, null));
        if (idLangue != null)
            mp3.setLangue(new Langue(idLangue, null, null));

        Mp3 mp3Insere = service.inserer(mp3, fichier.getBytes());

        return ResponseEntity.ok(new Mp3ResponseDto(mp3Insere));
    }

    @GetMapping
    public ResponseEntity<List<Mp3Dto>> findAll() {
        List<Mp3Dto> result = service.findAll().stream()
                .map(this::toDto)
                .toList();

        return ResponseEntity.ok(result);
    }

    private Mp3Dto toDto(Mp3 mp3) {
        var metadata = mp3.getMetadata();

        return Mp3Dto.builder()
                .id(mp3.getId())
                .titre(metadata != null ? metadata.getTitre() : null)
                .annee(metadata != null ? metadata.getAnnee() : null)
                .duree(metadata != null ? metadata.getDuree() : null)
                .frequence(metadata != null ? metadata.getFrequence() : null)
                .bitrate(metadata != null ? metadata.getBitrate() : null)
                .artiste(mp3.getArtiste() != null ? mp3.getArtiste().getNom() : null)
                .album(mp3.getAlbum() != null ? mp3.getAlbum().getLibelle() : null)
                .genre(mp3.getGenre() != null ? mp3.getGenre().getLibelle() : null)
                .url("/api/mp3/stream/" + mp3.getId())
                .build();
    }

    @GetMapping("/stream/{id}")
    public ResponseEntity<byte[]> stream(@PathVariable Integer id) {

        byte[] fichier = service.getFichierByMp3Id(id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "audio/mpeg")
                .body(fichier);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Mp3ResponseDto> modifier(
            @PathVariable Integer id,
            @RequestParam(value = "fichier", required = false) MultipartFile fichier,
            @RequestParam(value = "titre", required = false) String titre,
            @RequestParam(value = "annee", required = false) Integer annee,
            @RequestParam(value = "id_artiste", required = false) Integer idArtiste,
            @RequestParam(value = "id_album", required = false) Integer idAlbum,
            @RequestParam(value = "id_genre", required = false) Integer idGenre,
            @RequestParam(value = "id_langue", required = false) Integer idLangue) throws IOException {

        Mp3 mp3Existant = new Mp3();
        mp3Existant.setId(id);

        if (idArtiste != null)
            mp3Existant.setArtiste(new Artiste(idArtiste, null, null));
        if (idAlbum != null)
            mp3Existant.setAlbum(new Album(idAlbum, null, null));
        if (idGenre != null)
            mp3Existant.setGenre(new Genre(idGenre, null, null));
        if (idLangue != null)
            mp3Existant.setLangue(new Langue(idLangue, null, null));

        byte[] fichierBytes = (fichier != null && !fichier.isEmpty()) ? fichier.getBytes() : null;

        Mp3 mp3Modifie = service.modifier(id, mp3Existant, titre, annee, fichierBytes);

        return ResponseEntity.ok(new Mp3ResponseDto(mp3Modifie));
    }
}