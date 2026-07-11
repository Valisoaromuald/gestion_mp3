package com.gestion_mp3.dto;

import com.gestion_mp3.api.model.Mp3;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
public class Mp3Dto {
    private Integer id;
    private String titre;
    private Integer annee;
    private Long duree;
    private Long frequence;
    private Integer bitrate;
    private String url; // 👈 IMPORTANT
}
