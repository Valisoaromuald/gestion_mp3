package com.gestion_mp3.api.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import com.gestion_mp3.api.model.Langue;
import com.gestion_mp3.api.repository.LangueRepository;

@Service
public class LangueService {
    private final LangueRepository repository;

    public LangueService(LangueRepository repository) {
        this.repository = repository;
    }

    public Langue inserer(Langue langue) {
        return repository.save(langue);
    }
    public Optional<Langue> findByLibelle(String libelle){
        return repository.findByLabel(libelle);
    }
}
