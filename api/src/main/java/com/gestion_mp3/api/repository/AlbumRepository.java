// AlbumRepository.java
package com.gestion_mp3.api.repository;

import com.gestion_mp3.api.model.Album;
import com.gestion_mp3.api.model.Genre;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AlbumRepository extends JpaRepository<Album, Integer> {
        @Query(value="SELECT * FROM album WHERE LOWER(libelle) = LOWER(:libelle)",nativeQuery=true)
    public Optional<Album>findByLabel(@Param("libelle") String libelle);
}