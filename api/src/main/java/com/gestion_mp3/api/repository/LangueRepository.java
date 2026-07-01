package com.gestion_mp3.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gestion_mp3.api.model.Langue;
@Repository
public interface LangueRepository extends JpaRepository<Langue, Integer> {
    @Query(value="SELECT * FROM langue WHERE LOWER(libelle) = LOWER(?)",nativeQuery=true)
    public Optional<Langue>findByLabel(@Param("libelle") String libelle);
}