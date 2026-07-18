package com.gestion_mp3.api.repository;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.gestion_mp3.dto.MorceauPlaylistDto;

@Repository
public class PlaylistJdbcRepository {

    private final JdbcTemplate jdbcTemplate;

    public PlaylistJdbcRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<MorceauPlaylistDto> genererPlaylist(
        Integer dureeTotale,
        Integer[] idsArtistes,
        Integer[] idsLangues,
        Integer[] idsGenres
    ) {
        String sql = "SELECT * FROM generer_playlist(?, ?, ?, ?)";

        return jdbcTemplate.query(sql, ps -> {
            ps.setInt(1, dureeTotale);
            ps.setArray(2, ps.getConnection().createArrayOf("integer", idsArtistes));
            ps.setArray(3, ps.getConnection().createArrayOf("integer", idsLangues));
            ps.setArray(4, ps.getConnection().createArrayOf("integer", idsGenres));
        }, (rs, rowNum) -> MorceauPlaylistDto.builder()
            .id(rs.getInt("id"))
            .nomArtiste(rs.getString("nom_artiste"))
            .libelleGenre(rs.getString("libelle_genre"))
            .libelleLangue(rs.getString("libelle_langue"))
            .duree(rs.getInt("duree")).build());
    }
}