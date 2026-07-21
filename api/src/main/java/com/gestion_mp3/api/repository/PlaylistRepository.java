package com.gestion_mp3.api.repository;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gestion_mp3.api.model.Playlist;
import com.gestion_mp3.dto.MorceauPlaylistDto;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Integer> {
    
}
