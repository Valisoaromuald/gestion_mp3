package com.gestion_mp3.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MorceauPlaylistDto {
    // id mp3
    private Integer id;
    private String nomArtiste;
    private String libelleGenre;
    private String libelleLangue;
    private Integer duree;
    private String titre;
    private String url;
}
