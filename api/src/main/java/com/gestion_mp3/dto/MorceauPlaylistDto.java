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
    private Integer mp3Id;
    private String nomArtiste;
    private String libelleGenre;
    private String libelleLangue;
    private Long duree;
    private String titre;
    private String url;
}
