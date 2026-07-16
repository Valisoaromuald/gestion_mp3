package com.gestion_mp3.api.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Mp3 {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(mappedBy = "mp3", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Metadata metadata;

    @OneToOne(mappedBy = "mp3", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Mp3Fichier mp3Fichier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_album")
    private Album album;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_artiste")
    private Artiste artiste;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_genre")
    private Genre genre;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_langue")
    private Langue langue;
}