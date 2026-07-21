// Mp3Repository.java
package com.gestion_mp3.api.repository;

import com.gestion_mp3.api.model.Mp3;
import com.gestion_mp3.dto.MorceauPlaylistDto;

import org.springframework.data.domain.Pageable;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface Mp3Repository extends JpaRepository<Mp3, Integer> {
    @Query(value = """
            SELECT m FROM Mp3 m
            LEFT JOIN FETCH m.metadata
            LEFT JOIN FETCH m.artiste
            LEFT JOIN FETCH m.album
            LEFT JOIN FETCH m.genre
            LEFT JOIN FETCH m.langue
            """, countQuery = "SELECT COUNT(m) FROM Mp3 m")
    Page<Mp3> findAllWithDetails(Pageable pageable);

    @Query("""
                SELECT new com.gestion_mp3.dto.MorceauPlaylistDto(
                    m.id, a.nom, g.libelle, l.libelle, md.duree, md.titre,
                    CONCAT('/api/mp3/stream/', m.id)
                )
                FROM Mp3 m
                JOIN m.metadata md
                JOIN m.artiste a
                JOIN m.genre g
                LEFT JOIN m.langue l
                WHERE (:genreId IS NULL OR g.id = :genreId)
                AND (:langueId IS NULL OR l.id = :langueId)
                AND m.id NOT IN :excludedIds
                ORDER BY ABS(md.duree - :dureeReference) ASC
            """)
    List<MorceauPlaylistDto> findCandidates(
            @Param("genreId") Integer genreId,
            @Param("langueId") Integer langueId,
            @Param("excludedIds") List<Integer> excludedIds,
            @Param("dureeReference") Integer dureeReference,
            Pageable pageable);
}