package com.gestion_mp3.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gestion_mp3.api.service.UtilisateurService;
import com.gestion_mp3.dto.LoginRequestDto;
import com.gestion_mp3.dto.UtilisateurDto;

@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {
    @Autowired
    private UtilisateurService utilisateurService;

    @PostMapping("/login")
    public ResponseEntity<UtilisateurDto> login(@RequestBody LoginRequestDto request) {
        UtilisateurDto dto = utilisateurService.authentifier(request.login(), request.motDePasse());
        return ResponseEntity.ok(dto);
    }
}
