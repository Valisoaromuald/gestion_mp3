// Mp3Repository.java
package com.gestion_mp3.api.repository;
import com.gestion_mp3.api.model.Mp3;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface Mp3Repository extends JpaRepository<Mp3, Integer> {
    @Query("""
        SELECT m FROM Mp3 m
        LEFT JOIN FETCH m.metadata
        LEFT JOIN FETCH m.artiste
        LEFT JOIN FETCH m.album
        LEFT JOIN FETCH m.genre
        LEFT JOIN FETCH m.langue
        """)
    List<Mp3> findAllWithDetails();
}