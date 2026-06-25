// GenreRepository.java
package com.gestion_mp3.api.repository;
import com.gestion_mp3.api.model.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Integer> {}