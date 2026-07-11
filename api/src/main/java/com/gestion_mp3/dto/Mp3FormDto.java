package com.gestion_mp3.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Mp3FormDto {

    private String fichier; 
    private Integer idArtiste;
    private Integer idAlbum;
    private Integer idGenre;
}

