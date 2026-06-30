package com.gestion_mp3.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestion_mp3.api.model.Langue;

@Repository
public interface LangueRepository extends JpaRepository<Langue, Integer> {}