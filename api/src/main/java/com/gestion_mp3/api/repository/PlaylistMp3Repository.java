package com.gestion_mp3.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.gestion_mp3.api.model.PlaylistMp3;
import com.gestion_mp3.dto.MorceauPlaylistDto;

public interface PlaylistMp3Repository extends JpaRepository<PlaylistMp3, Integer> {
    @Query("""
                SELECT pm.mp3.id
                FROM PlaylistMp3 pm
                WHERE pm.playlist.id = :playlistId
            """)
    List<Integer> findMp3IdsByPlaylistId(@Param("playlistId") Integer playlistId);
    // PlaylistMp3Repository.java — requête à ajouter
@Query("""
    SELECT new com.gestion_mp3.dto.MorceauPlaylistDto(
        m.id, a.nom, g.libelle, l.libelle, md.duree, md.titre,
        CONCAT('/api/mp3/stream/', m.id)
    )
    FROM PlaylistMp3 pm
    JOIN pm.mp3 m
    JOIN m.metadata md
    JOIN m.artiste a
    JOIN m.genre g
    LEFT JOIN m.langue l
    WHERE pm.playlist.id = :playlistId
""")
List<MorceauPlaylistDto> findMorceauxByPlaylistId(@Param("playlistId") Integer playlistId);
}
