package com.gestion_mp3.api.repository;

import org.springframework.stereotype.Repository;

import com.gestion_mp3.api.model.Mp3Fichier;
import org.springframework.data.jpa.repository.JpaRepository;
@Repository
public interface Mp3FichierRepository extends JpaRepository<Mp3Fichier,Integer>{}
