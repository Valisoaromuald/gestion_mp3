package com.gestion_mp3.api.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.gestion_mp3.api.model.PlaylistMp3;
public interface PlaylistMp3Repository extends JpaRepository<PlaylistMp3, Integer> {    
}
