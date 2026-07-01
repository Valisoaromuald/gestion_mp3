// ArtisteService.java
package com.gestion_mp3.api.service;
import com.gestion_mp3.api.model.Album;
import com.gestion_mp3.api.model.Artiste;
import com.gestion_mp3.api.repository.ArtisteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ArtisteService {
    private final ArtisteRepository repository;

    public ArtisteService(ArtisteRepository repository) {
        this.repository = repository;
    }

    public Artiste inserer(Artiste artiste) {
        return repository.save(artiste);
    }

    public Optional<Artiste> findById(Integer id) {
        return repository.findById(id);
    }
    public Optional<Artiste> findByNom(String nom) {
        return repository.findByName(nom);
    }
}