package com.gestion_mp3.dto;

import java.util.List;
public record AjouterMp3sRequestDto(List<Integer> idsMp3, Integer idPlaylist) {}
