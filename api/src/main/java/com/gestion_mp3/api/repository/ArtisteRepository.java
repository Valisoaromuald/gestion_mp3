
// ArtisteRepository.java
package com.gestion_mp3.api.repository;
import com.gestion_mp3.api.model.Artiste;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface ArtisteRepository extends JpaRepository<Artiste, Integer> {}