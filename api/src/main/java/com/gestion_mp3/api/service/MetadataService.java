// MetadataService.java
package com.gestion_mp3.api.service;
import com.gestion_mp3.api.model.Metadata;
import com.gestion_mp3.api.repository.MetadataRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class MetadataService {
    private final MetadataRepository repository;

    public MetadataService(MetadataRepository repository) {
        this.repository = repository;
    }

    public Metadata inserer(Metadata metadata) {
        return repository.save(metadata);
    }

    public Optional<Metadata> findById(Integer id) {
        return repository.findById(id);
    }
}