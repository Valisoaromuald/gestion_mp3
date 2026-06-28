// apiSender.js
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const config = require('./config');
const { writeInLogFile } = require('./logger');

const LOG_FILE_PATH = config.logs.log_file_path;

// Cache en mémoire pour éviter les doublons
const cacheArtistes = new Map();  // nom → id
const cacheAlbums = new Map();  // libelle → id
const cacheGenres = new Map();  // libelle → id
const cacheMp3 = new Map();  // cheminFichier → id
const cacheMetadata = new Map();

async function envoyerArtiste(artiste) {
    // Si déjà envoyé, retourner l'id depuis le cache
    if (cacheArtistes.has(artiste)) {
        writeInLogFile(LOG_FILE_PATH, `[~] Artiste déjà existant : ${artiste}`);
        return { id: cacheArtistes.get(artiste) };
    }

    const response = await axios.post(`${config.api.url}/api/artistes`,
        { nom: artiste },
        { headers: { 'Content-Type': 'application/json' } }
    );

    // Stocker dans le cache
    cacheArtistes.set(artiste, response.data.id);

    writeInLogFile(LOG_FILE_PATH, `[✓] Artiste envoyé : ${artiste}`);
    return response.data;
}

async function envoyerAlbum(album) {
    if (cacheAlbums.has(album)) {
        writeInLogFile(LOG_FILE_PATH, `[~] Album déjà existant : ${album}`);
        return { id: cacheAlbums.get(album) };
    }

    const response = await axios.post(`${config.api.url}/api/albums`,
        { libelle: album },
        { headers: { 'Content-Type': 'application/json' } }
    );

    cacheAlbums.set(album, response.data.id);

    writeInLogFile(LOG_FILE_PATH, `[✓] Album envoyé : ${album}`);
    return response.data;
}

async function envoyerGenre(genre) {
    if (cacheGenres.has(genre)) {
        writeInLogFile(LOG_FILE_PATH, `[~] Genre déjà existant : ${genre}`);
        return { id: cacheGenres.get(genre) };
    }

    const response = await axios.post(`${config.api.url}/api/genres`,
        { libelle: genre },
        { headers: { 'Content-Type': 'application/json' } }
    );

    cacheGenres.set(genre, response.data.id);

    writeInLogFile(LOG_FILE_PATH, `[✓] Genre envoyé : ${genre}`);
    return response.data;
}


async function envoyerMp3Fichier(cheminFichier, idArtiste, idAlbum, idGenre) {
    if (cacheMp3.has(cheminFichier)) {
        writeInLogFile(LOG_FILE_PATH, `[~] MP3 déjà existant : ${cheminFichier}`);
        return { id: cacheMp3.get(cheminFichier) };
    }

    const form = new FormData();
    form.append('fichier', fs.createReadStream(cheminFichier));
    if (idArtiste) form.append('id_artiste', idArtiste);
    if (idAlbum) form.append('id_album', idAlbum);
    if (idGenre) form.append('id_genre', idGenre);

    const response = await axios.post(`${config.api.url}/api/mp3`, form, {
        headers: { ...form.getHeaders() }
    });

    cacheMp3.set(cheminFichier, response.data.id);

    writeInLogFile(LOG_FILE_PATH, `[✓] MP3 envoyé : ${cheminFichier}`);
    return response.data;
}

async function envoyerMetadata(titre, annee, duree, bitrate, frequence, idMp3) {
    if (cacheMetadata.has(titre)) {
        writeInLogFile(LOG_FILE_PATH, `[~] Metadata déjà existante : ${titre}`);
        return { id: cacheMetadata.get(titre) };
    }

    const response = await axios.post(`${config.api.url}/api/metadata`,
        { titre, annee, duree, bitrate, frequence, id_mp3: idMp3 },
        { headers: { 'Content-Type': 'application/json' } }
    );

    cacheMetadata.set(titre, response.data.id);

    writeInLogFile(LOG_FILE_PATH, `[✓] Metadata envoyée : ${titre}`);
    return response.data;
}

async function envoyerMp3(metadata) {
    try {
        const { cheminFichier, titre, artiste, genre, album, annee, duree, bitrate, frequence } = metadata;

        const [dataArtiste, dataAlbum, dataGenre] = await Promise.all([
            artiste ? envoyerArtiste(artiste) : null,
            album ? envoyerAlbum(album) : null,
            genre ? envoyerGenre(genre) : null,
        ]);

        let dataMp3 = null;
        if (cheminFichier) {
            dataMp3 = await envoyerMp3Fichier(
                cheminFichier,
                dataArtiste?.id,
                dataAlbum?.id,
                dataGenre?.id
            );
        }

        if (titre && duree && bitrate && frequence && dataMp3?.id) {
            await envoyerMetadata(titre, annee, duree, bitrate, frequence, dataMp3.id);
        }

        writeInLogFile(LOG_FILE_PATH, `[✓] Traitement complet : ${titre}`);

    } catch (error) {
        writeInLogFile(LOG_FILE_PATH, `[!] Echec envoi : ${error.message}`);
        throw error;
    }
}

module.exports = { envoyerMp3 };