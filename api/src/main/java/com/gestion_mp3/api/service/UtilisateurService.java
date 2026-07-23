package com.gestion_mp3.api.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.gestion_mp3.api.model.Utilisateur;
import com.gestion_mp3.api.repository.UtilisateurRepository;
import com.gestion_mp3.dto.UtilisateurDto;

@Service
public class UtilisateurService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UtilisateurDto authentifier(String login, String motDePasse) {

        Optional<Utilisateur> utilisateur = utilisateurRepository.findByLogin(login);
        if (utilisateur.isPresent()
                && passwordEncoder.matches(motDePasse, utilisateur.get().getMotDePasse())) {

            return UtilisateurDto.builder().login(utilisateur.get().getLogin()).id(utilisateur.get().getId()).build();
        }

        return new UtilisateurDto();
    }
}