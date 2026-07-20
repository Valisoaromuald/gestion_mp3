package com.gestion_mp3.api.service;

import org.springframework.stereotype.Service;
import com.gestion_mp3.api.model.Playlist;
import com.gestion_mp3.api.model.Utilisateur;
import com.gestion_mp3.api.repository.PlaylistRepository;

@Service
public class PlaylistService {
    private final PlaylistRepository repository;

    public PlaylistService(PlaylistRepository repository) {
        this.repository = repository;
    }

    public Integer creerPlaylist(String nom, Integer idUtilisateur) {
        Playlist playlist = Playlist.builder()
                .nom(nom)
                .utilisateur(Utilisateur.builder().id(idUtilisateur).build())
                .build();
        Playlist playlistEnregistree = repository.save(playlist);
        return playlistEnregistree.getId();
    }
}
