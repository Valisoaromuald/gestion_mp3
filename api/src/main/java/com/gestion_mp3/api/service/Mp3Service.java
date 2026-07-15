// Mp3Service.java
package com.gestion_mp3.api.service;

import com.gestion_mp3.api.model.Album;
import com.gestion_mp3.api.model.Artiste;
import com.gestion_mp3.api.model.Genre;
import com.gestion_mp3.api.model.Langue;
import com.gestion_mp3.api.model.Metadata;
import com.gestion_mp3.api.model.Mp3;
import com.gestion_mp3.api.model.Mp3Fichier;
import com.gestion_mp3.api.repository.AlbumRepository;
import com.gestion_mp3.api.repository.ArtisteRepository;
import com.gestion_mp3.api.repository.GenreRepository;
import com.gestion_mp3.api.repository.LangueRepository;
import com.gestion_mp3.api.repository.MetadataRepository;
import com.gestion_mp3.api.repository.Mp3FichierRepository;
import com.gestion_mp3.api.repository.Mp3Repository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class Mp3Service {

    private final Mp3Repository repository;
    private final Mp3FichierRepository mp3fichierRepository;
    private final MetadataRepository metadataRepository;
    private final ArtisteRepository artisteRepository;
    private final GenreRepository genreRepository;
    private final AlbumRepository albumRepository;
    private final LangueRepository langueRepository;


    public Mp3Service(Mp3Repository repository, Mp3FichierRepository mp3fichierRepository,
            MetadataRepository metadataRepository,ArtisteRepository artisteRepository,GenreRepository genreRepository,AlbumRepository albumRepository,LangueRepository langueRepository) {
        this.repository = repository;
        this.mp3fichierRepository = mp3fichierRepository;
        this.metadataRepository = metadataRepository;
        this.artisteRepository = artisteRepository;
        this.genreRepository =  genreRepository;
        this.albumRepository = albumRepository;
        this.langueRepository = langueRepository;
    }

    @Transactional
    public Mp3 inserer(Mp3 mp3, byte[] fichierBytes) {
        Mp3 savedMp3 = repository.save(mp3);
        Mp3Fichier mp3Fichier = Mp3Fichier.builder()
                .fichier(fichierBytes)
                .mp3(savedMp3) // @MapsId remplit automatiquement l'id
                .build();
        mp3fichierRepository.save(mp3Fichier);
        return savedMp3;

    }

    public byte[] getFichierByMp3Id(Integer id) {
        Mp3Fichier mp3Fichier = mp3fichierRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fichier introuvable"));
        return mp3Fichier.getFichier();
    }

    public Optional<Mp3> findById(Integer id) {
        return repository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Mp3> findAll() {
        return repository.findAllWithDetails();
    }

    @Transactional
    public Mp3 modifier(Integer id, String titre, Integer annee,
            String nomArtiste, String libelleAlbum, String libelleGenre, String libelleLangue,
            byte[] fichierBytes) {

        Mp3 mp3 = repository.findById(id)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Mp3 introuvable avec l'id : " + id));

        if (nomArtiste != null && !nomArtiste.isBlank()) {
            Artiste artiste = artisteRepository.findByName(nomArtiste)
                    .orElseGet(() -> artisteRepository.save(new Artiste(null, nomArtiste, null)));
            mp3.setArtiste(artiste);
        }

        if (libelleAlbum != null && !libelleAlbum.isBlank()) {
            Album album = albumRepository.findByLabel(libelleAlbum)
                    .orElseGet(() -> albumRepository.save(new Album(null, libelleAlbum, null)));
            mp3.setAlbum(album);
        }

        if (libelleGenre != null && !libelleGenre.isBlank()) {
            Genre genre = genreRepository.findByLabel(libelleGenre)
                    .orElseGet(() -> genreRepository.save(new Genre(null, libelleGenre, null)));
            mp3.setGenre(genre);
        }

        if (libelleLangue != null && !libelleLangue.isBlank()) {
            Langue langue = langueRepository.findByLabel(libelleLangue)
                    .orElseGet(() -> langueRepository.save(new Langue(null, libelleLangue, null)));
            mp3.setLangue(langue);
        }

        Metadata metadata = mp3.getMetadata();
        if (metadata != null) {
            if (titre != null)
                metadata.setTitre(titre);
            if (annee != null)
                metadata.setAnnee(annee);
            metadataRepository.save(metadata);
        }

        Mp3 mp3Sauvegarde = repository.save(mp3);

        if (fichierBytes != null) {
            Mp3Fichier mp3Fichier = mp3fichierRepository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Fichier introuvable"));
            mp3Fichier.setFichier(fichierBytes);
            mp3fichierRepository.save(mp3Fichier);
        }

        return mp3Sauvegarde;
    }
}