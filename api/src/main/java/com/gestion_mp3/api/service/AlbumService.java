// AlbumService.java
package com.gestion_mp3.api.service;
import com.gestion_mp3.api.model.Album;
import com.gestion_mp3.api.model.Genre;
import com.gestion_mp3.api.repository.AlbumRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlbumService {
    private final AlbumRepository repository;

    public AlbumService(AlbumRepository repository) {
        this.repository = repository;
    }

    public Album inserer(Album album) {
        return repository.save(album);
    }

    public Optional<Album> findById(Integer id) {
        return repository.findById(id);
    }
      public Optional<Album> findByLibelle(String libelle) {
        return repository.findByLabel(libelle);
    }
}
