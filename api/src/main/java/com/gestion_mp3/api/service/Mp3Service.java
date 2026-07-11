// Mp3Service.java
package com.gestion_mp3.api.service;

import com.gestion_mp3.api.model.Mp3;
import com.gestion_mp3.api.repository.Mp3Repository;
import com.gestion_mp3.dto.Mp3Dto;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class Mp3Service {
    private final Mp3Repository repository;

    public Mp3Service(Mp3Repository repository) {
        this.repository = repository;
    }

    public Mp3 inserer(Mp3 mp3) {
        return repository.save(mp3);
    }

    public Optional<Mp3> findById(Integer id) {
        return repository.findById(id);
    }

    public List<Mp3> findAll() {
        return repository.findAll();
    }

    public List<Mp3Dto> findAllByDto() {
        return repository.findAll()
                .stream()
                .map(mp3 -> new Mp3Dto(
                        mp3.getId(),
                        mp3.getMetadata().getTitre(),
                        mp3.getMetadata().getAnnee(),
                        mp3.getMetadata().getDuree(),
                        mp3.getMetadata().getFrequence(),
                        mp3.getMetadata().getBitrate()))
                .toList();
    }
}