package com.gestion_mp3.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Mp3Dto {
    private Integer id;
    private String titre;
    private Integer annee;
    private Long duree;
    private Long frequence;
    private Long bitrate;
    private String artiste;
    private String album;
    private String genre;
    private String langue;
    private String url;
}