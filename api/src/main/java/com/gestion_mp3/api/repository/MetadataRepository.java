// MetadataRepository.java
package com.gestion_mp3.api.repository;
import com.gestion_mp3.api.model.Metadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MetadataRepository extends JpaRepository<Metadata, Integer> {}