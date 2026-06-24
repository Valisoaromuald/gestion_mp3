package com.gestion_mp3;

public class Mp3Metadata {
    private String cheminFichier;
    private String titre;
    private String artiste;
    private String album;
    private String annee;
    private String genre;
    private long duree;
    private long bitrate;
    private int frequence;

    // Getters
    public String getCheminFichier() { return cheminFichier; }
    public String getTitre()         { return titre; }
    public String getArtiste()       { return artiste; }
    public String getAlbum()         { return album; }
    public String getAnnee()         { return annee; }
    public String getGenre()         { return genre; }
    public long getDuree()           { return duree; }
    public long getBitrate()         { return bitrate; }
    public int getFrequence()        { return frequence; }

    // Setters
    public void setCheminFichier(String cheminFichier) { this.cheminFichier = cheminFichier; }
    public void setTitre(String titre)                 { this.titre = titre; }
    public void setArtiste(String artiste)             { this.artiste = artiste; }
    public void setAlbum(String album)                 { this.album = album; }
    public void setAnnee(String annee)                 { this.annee = annee; }
    public void setGenre(String genre)                 { this.genre = genre; }
    public void setDuree(long duree)                   { this.duree = duree; }
    public void setBitrate(long bitrate)               { this.bitrate = bitrate; }
    public void setFrequence(int frequence)            { this.frequence = frequence; }

    @Override
    public String toString() {
        return "Mp3Metadata{" +
            "fichier='"  + cheminFichier + '\'' +
            ", titre='"  + titre         + '\'' +
            ", artiste='" + artiste      + '\'' +
            ", album='"  + album         + '\'' +
            ", annee='"  + annee         + '\'' +
            ", genre='"  + genre         + '\'' +
            ", duree="   + duree         +
            ", bitrate=" + bitrate       +
            ", frequence=" + frequence   +
            '}';
    }
}