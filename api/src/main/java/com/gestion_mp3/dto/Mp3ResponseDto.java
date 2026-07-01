package com.gestion_mp3.dto;

import com.gestion_mp3.api.model.Mp3;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Mp3ResponseDto {
    private Integer id;
    private Integer idArtiste;
    private Integer idAlbum;
    private Integer idGenre;
    private Integer idLangue;

    public Mp3ResponseDto(Mp3 mp3) {
        this.id       = mp3.getId();
        this.idArtiste = mp3.getArtiste() != null ? mp3.getArtiste().getId() : null;
        this.idAlbum   = mp3.getAlbum()   != null ? mp3.getAlbum().getId()   : null;
        this.idGenre   = mp3.getGenre()   != null ? mp3.getGenre().getId()   : null;
        this.idLangue  = mp3.getLangue()  != null ? mp3.getLangue().getId()  : null;
    }

    // getters
    public Integer getId()        { return id; }
    public Integer getIdArtiste() { return idArtiste; }
    public Integer getIdAlbum()   { return idAlbum; }
    public Integer getIdGenre()   { return idGenre; }
    public Integer getIdLangue()  { return idLangue; }
}
