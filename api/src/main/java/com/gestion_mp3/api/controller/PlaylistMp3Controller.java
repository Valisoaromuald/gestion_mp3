package com.gestion_mp3.api.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gestion_mp3.api.service.PlaylistMp3Service;
import com.gestion_mp3.dto.AjouterMp3sRequestDto;

@RestController
@RequestMapping("/api/playlist_mp3")
public class PlaylistMp3Controller {
    private final PlaylistMp3Service playlistMp3Service;

    public PlaylistMp3Controller(PlaylistMp3Service playlistMp3Service) {
        this.playlistMp3Service = playlistMp3Service;
    }

    @PostMapping("/save")
    public ResponseEntity<Integer> inserer(
            @RequestParam(name = "idMp3") Integer idMp3,
            @RequestParam(name = "idPlaylist") Integer idPlaylist) {
        Integer id = playlistMp3Service.ajouterMp3(idMp3, idPlaylist);
        return ResponseEntity.ok(id);
    }

    @PostMapping("/save-batch")
    public ResponseEntity<List<Integer>> insererPlusieurs(@RequestBody AjouterMp3sRequestDto requete) {
        List<Integer> ids = playlistMp3Service.ajouterPlusieursMp3(requete.idsMp3(), requete.idPlaylist());
        return ResponseEntity.ok(ids);
    }
}
