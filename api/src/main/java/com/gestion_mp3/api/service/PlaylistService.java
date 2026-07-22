package com.gestion_mp3.api.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.gestion_mp3.api.model.Mp3;
import com.gestion_mp3.api.model.Playlist;
import com.gestion_mp3.api.model.Utilisateur;
import com.gestion_mp3.api.repository.Mp3FichierRepository;
import com.gestion_mp3.api.repository.PlaylistMp3Repository;
import com.gestion_mp3.api.repository.PlaylistRepository;
import com.gestion_mp3.dto.MorceauPlaylistDto;
import com.gestion_mp3.dto.PlaylistListDto;


@Service
public class PlaylistService {
    private final PlaylistRepository repository;
    private final Mp3Service mp3Service;
    private final Mp3FichierRepository mp3FichierRepository;
    private final PlaylistMp3Repository playlistMp3Repository;

    public PlaylistService(PlaylistRepository playlistRepository,
            PlaylistMp3Repository playlistMp3Repository,
            Mp3FichierRepository mp3FichierRepository,
            Mp3Service mp3Service) {
        this.repository = playlistRepository;
        this.playlistMp3Repository = playlistMp3Repository;
        this.mp3FichierRepository = mp3FichierRepository;
        this.mp3Service = mp3Service;
    }

    public Integer creerPlaylist(String nom, Integer idUtilisateur) {
        Playlist playlist = Playlist.builder()
                .nom(nom)
                .utilisateur(Utilisateur.builder().id(idUtilisateur).build())
                .build();
        Playlist playlistEnregistree = repository.save(playlist);
        return playlistEnregistree.getId();
    }

    public List<PlaylistListDto> findAll() {
        return repository.findAllWithStats();
    }

    public byte[] genererZip(Integer playlistId) {
        var playlist = repository.findById(playlistId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Playlist introuvable"));

        List<Integer> mp3Ids = playlistMp3Repository.findMp3IdsByPlaylistId(playlistId);
        if (mp3Ids.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Playlist vide");
        }

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
                ZipOutputStream zos = new ZipOutputStream(baos)) {

            for (Integer mp3Id : mp3Ids) {
                byte[] contenu = mp3Service.getFichierByMp3Id(mp3Id);
                Mp3 mp3 = mp3Service.findById(mp3Id)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fichier introuvable"));
                // Nom de fichier basé sur le titre pour un zip lisible
                String nomFichier = mp3.getMetadata().getTitre() + "-" + mp3.getArtiste().getNom() + ".mp3";
                zos.putNextEntry(new ZipEntry(nomFichier));
                zos.write(contenu);
                zos.closeEntry();
            }
            zos.finish();
            return baos.toByteArray();

        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erreur lors de la génération du ZIP",
                    e);
        }
    }

    // PlaylistService.java — méthode à ajouter
    public List<MorceauPlaylistDto> getMorceaux(Integer playlistId) {
        return playlistMp3Repository.findMorceauxByPlaylistId(playlistId);
    }

}
