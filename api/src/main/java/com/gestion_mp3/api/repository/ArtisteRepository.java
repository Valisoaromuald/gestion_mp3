
// ArtisteRepository.java
package com.gestion_mp3.api.repository;
import com.gestion_mp3.api.model.Artiste;
import com.gestion_mp3.api.model.Langue;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
@Repository
public interface ArtisteRepository extends JpaRepository<Artiste, Integer> {
    @Query(value="SELECT * FROM artiste WHERE  LOWER(nom) = LOWER(:nom)",nativeQuery=true)
    public Optional<Artiste>findByName(@Param("nom") String nom);
}