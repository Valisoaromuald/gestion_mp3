package com.gestion_mp3.api.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gestion_mp3.api.repository.PlaylistJdbcRepository;
import com.gestion_mp3.dto.MorceauPlaylistDto;

@RestController
@RequestMapping("/api/playlist")
public class PlaylistController {
    private PlaylistJdbcRepository playlistJdbcRepository; 
    public PlaylistController(PlaylistJdbcRepository playlistJdbcRepository){
        this.playlistJdbcRepository = playlistJdbcRepository;
    } 
    @GetMapping("/generation")
    public ResponseEntity<List<MorceauPlaylistDto>> getPlaylistGenere(
            @RequestParam Integer dureeTotale,
            @RequestParam Integer[] idsArtistes,
            @RequestParam Integer[] idsLangues,
            @RequestParam Integer[] idsGenres) {
            return ResponseEntity.ok(playlistJdbcRepository.genererPlaylist(dureeTotale, idsArtistes, idsLangues, idsGenres));    
    }

}
