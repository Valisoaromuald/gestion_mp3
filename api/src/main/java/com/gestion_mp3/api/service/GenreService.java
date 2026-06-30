// GenreService.java
package com.gestion_mp3.api.service;

import com.gestion_mp3.api.model.Album;
import com.gestion_mp3.api.model.Genre;
import com.gestion_mp3.api.repository.GenreRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GenreService {
    private final GenreRepository repository;

    public GenreService(GenreRepository repository) {
        this.repository = repository;
    }

    public Genre inserer(Genre genre) {
        return repository.save(genre);
    }

    public Optional<Genre> findById(Integer id) {
        return repository.findById(id);
    }
    public Optional<Album> findByLibelle(String libelle) {
        return repository.findByLibelle(libelle);
    }
    public List<Genre> findAll(){
        return repository.findAll();
    }
}