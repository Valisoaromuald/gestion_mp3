// Mp3Repository.java
package com.gestion_mp3.api.repository;
import com.gestion_mp3.api.model.Mp3;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface Mp3Repository extends JpaRepository<Mp3, Integer> {
    @Query(value="""
        SELECT m FROM Mp3 m
        LEFT JOIN FETCH m.metadata
        LEFT JOIN FETCH m.artiste
        LEFT JOIN FETCH m.album
        LEFT JOIN FETCH m.genre
        LEFT JOIN FETCH m.langue
        """,
    countQuery = "SELECT COUNT(m) FROM Mp3 m")
    Page<Mp3> findAllWithDetails(Pageable pageable);
}