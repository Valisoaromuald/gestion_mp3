// GenreRepository.java
package com.gestion_mp3.api.repository;
import com.gestion_mp3.api.model.Genre;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Integer> {
    @Query(value="SELECT * FROM genre WHERE LOWER(libelle) = LOWER(?)",nativeQuery=true)
    public Optional<Genre>findByLabel(@Param("libelle") String libelle);
}