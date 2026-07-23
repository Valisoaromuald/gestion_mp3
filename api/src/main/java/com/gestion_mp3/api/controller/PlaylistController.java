package com.gestion_mp3.api.controller;

import java.util.List;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gestion_mp3.api.repository.PlaylistJdbcRepository;
import com.gestion_mp3.api.service.PlaylistService;
import com.gestion_mp3.dto.CreerPlaylistRequestDto;
import com.gestion_mp3.dto.MorceauPlaylistDto;
import com.gestion_mp3.dto.PlaylistListDto;

@RestController
@RequestMapping("/api/playlists")
public class PlaylistController {
    private PlaylistJdbcRepository playlistJdbcRepository;
    private PlaylistService playlistService;

    public PlaylistController(PlaylistJdbcRepository playlistJdbcRepository, PlaylistService playlistService) {
        this.playlistJdbcRepository = playlistJdbcRepository;
        this.playlistService = playlistService;
    }

    @GetMapping("/generation")
    public ResponseEntity<List<MorceauPlaylistDto>> getPlaylistGenere(
            @RequestParam Integer dureeTotale,
            @RequestParam Integer[] idsArtistes,
            @RequestParam Integer[] idsLangues,
            @RequestParam Integer[] idsGenres) {
        return ResponseEntity
                .ok(playlistJdbcRepository.genererPlaylist(dureeTotale, idsArtistes, idsLangues, idsGenres));
    }

    // PlaylistController.java — méthode à ajouter
    @GetMapping("/{id}/morceaux")
    public ResponseEntity<List<MorceauPlaylistDto>> getMorceaux(@PathVariable Integer id) {
        return ResponseEntity.ok(playlistService.getMorceaux(id));
    }

    @PostMapping("/save")
    public ResponseEntity<Integer> inserer(@RequestBody CreerPlaylistRequestDto requete) {
        Integer idPlaylistCree = playlistService.creerPlaylist(
                requete.nom(),
                requete.idUtilisateur());
        return ResponseEntity.ok(idPlaylistCree);
    }

    @GetMapping("/utilisateurs/{id}")
    public ResponseEntity<List<PlaylistListDto>> findAllByUserId(@PathVariable("id") Integer userId) {
        return ResponseEntity.ok(playlistService.findAllByUserId(userId));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> download(@PathVariable Integer id) {
        byte[] zip = playlistService.genererZip(id);

        ContentDisposition disposition = ContentDisposition.attachment()
                .filename("playlist_" + id + ".zip")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(zip);
    }
}
