// AlbumRepository.java
package com.gestion_mp3.api.repository;

import com.gestion_mp3.api.model.Album;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlbumRepository extends JpaRepository<Album, Integer> {
    Optional<Album> findByLibelle(String libelle);
}