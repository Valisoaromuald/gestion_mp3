package com.gestion_mp3.api.service;

import java.util.List;

import org.springframework.stereotype.Service;
import com.gestion_mp3.api.model.PlaylistMp3;
import com.gestion_mp3.api.repository.PlaylistMp3Repository;

@Service
public class PlaylistMp3Service {

    private final PlaylistMp3Repository playlistMp3Repository;

    public PlaylistMp3Service(PlaylistMp3Repository playlistMp3Repository) {
        this.playlistMp3Repository = playlistMp3Repository;
    }

    public Integer ajouterMp3(Integer idMp3, Integer idPlaylist) {
        PlaylistMp3 playlistMp3 = PlaylistMp3.builder()
            .idMp3(idMp3)
            .idPlaylist(idPlaylist)
            .build();

        PlaylistMp3 enregistre = playlistMp3Repository.save(playlistMp3);
        return enregistre.getId();
    }

    public List<Integer> ajouterPlusieursMp3(List<Integer> idsMp3, Integer idPlaylist) {
        List<PlaylistMp3> playlistMp3s = idsMp3.stream()
            .map(idMp3 -> PlaylistMp3.builder()
                .idMp3(idMp3)
                .idPlaylist(idPlaylist)
                .build())
            .toList();

        List<PlaylistMp3> enregistres = playlistMp3Repository.saveAll(playlistMp3s);

        return enregistres.stream()
            .map(PlaylistMp3::getId)
            .toList();
    }
}