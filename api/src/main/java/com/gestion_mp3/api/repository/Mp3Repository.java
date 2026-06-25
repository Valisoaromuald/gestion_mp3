// Mp3Repository.java
package com.gestion_mp3.api.repository;
import com.gestion_mp3.api.model.Mp3;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Mp3Repository extends JpaRepository<Mp3, Integer> {}