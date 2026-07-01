package com.gestion_mp3.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
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
    @Lob
    @JsonIgnore
    @Column(name = "fichier")
    private byte[] fichier;
    @OneToOne(mappedBy = "mp3", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Metadata metadata;
    @ManyToOne
    @JoinColumn(name = "id_album")
    private Album album;
    @ManyToOne
    @JoinColumn(name = "id_artiste")
    private Artiste artiste;
    @ManyToOne
    @JoinColumn(name = "id_genre")
    private Genre genre;
    @ManyToOne
    @JoinColumn(name = "id_langue")
    private Langue langue;
}
