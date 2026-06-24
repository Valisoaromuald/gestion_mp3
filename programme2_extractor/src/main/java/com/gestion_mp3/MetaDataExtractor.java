package com.gestion_mp3;
import org.jaudiotagger.audio.AudioFile;
import org.jaudiotagger.audio.AudioFileIO;
import org.jaudiotagger.audio.AudioHeader;
import org.jaudiotagger.tag.FieldKey;
import org.jaudiotagger.tag.Tag;

import java.io.File;

public class MetaDataExtractor {

    public Mp3Metadata extraire(String cheminFichier) throws Exception {
        File fichier = new File(cheminFichier);
        AudioFile audioFile = AudioFileIO.read(fichier);

        Tag tag = audioFile.getTag();
        AudioHeader header = audioFile.getAudioHeader();

        Mp3Metadata metadata = new Mp3Metadata();
        metadata.setCheminFichier(cheminFichier);
        metadata.setTitre(tag.getFirst(FieldKey.TITLE));
        metadata.setArtiste(tag.getFirst(FieldKey.ARTIST));
        metadata.setAlbum(tag.getFirst(FieldKey.ALBUM));
        metadata.setAnnee(tag.getFirst(FieldKey.YEAR));
        metadata.setGenre(tag.getFirst(FieldKey.GENRE));
        metadata.setDuree(header.getTrackLength());         // en secondes
        metadata.setBitrate(header.getBitRateAsNumber());   // en kbps
        metadata.setFrequence(header.getSampleRateAsNumber()); // en Hz

        return metadata;
    }
} 