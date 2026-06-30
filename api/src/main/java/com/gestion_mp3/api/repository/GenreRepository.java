// GenreRepository.java
package com.gestion_mp3.api.repository;
import com.gestion_mp3.api.model.Album;
import com.gestion_mp3.api.model.Genre;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Integer> {
    Optional<Album> findByLibelle(String libelle);
}