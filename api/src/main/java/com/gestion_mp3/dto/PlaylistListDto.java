package com.gestion_mp3.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaylistListDto {
    private Integer id;
    private String nom;
    private Long nombreMorceaux;
    private Long dureeTotale;
}