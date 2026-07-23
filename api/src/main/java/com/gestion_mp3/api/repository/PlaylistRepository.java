package com.gestion_mp3.api.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.gestion_mp3.api.model.Playlist;
import com.gestion_mp3.dto.PlaylistListDto;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Integer> {
    @Query("""
        SELECT new com.gestion_mp3.dto.PlaylistListDto(
            p.id, p.nom, COUNT(pm.id), COALESCE(SUM(md.duree), 0)
        )
        FROM Playlist p
        LEFT JOIN PlaylistMp3 pm ON pm.playlist = p
        LEFT JOIN pm.mp3 m
        LEFT JOIN m.metadata md
        WHERE p.utilisateur.id= :id_utilisateur
        GROUP BY p.id, p.nom
        ORDER BY p.id DESC
    """)
    List<PlaylistListDto> findAllWithStatsByUserId(@Param("id_utilisateur")Integer userId);    
}
