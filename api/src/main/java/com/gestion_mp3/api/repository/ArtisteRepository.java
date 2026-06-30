
// ArtisteRepository.java
package com.gestion_mp3.api.repository;
import com.gestion_mp3.api.model.Album;
import com.gestion_mp3.api.model.Artiste;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface ArtisteRepository extends JpaRepository<Artiste, Integer> {
    Optional<Artiste> findByNom(String nom);
}