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
    // Vérifier si l'artiste existe déjà en base via l'API
    try {
        const recherche = await axios.get(`${config.api.url}/api/artistes/nom/${encodeURIComponent(artiste)}`);

        // Artiste trouvé (200 OK) → on le met en cache et on le retourne directement
        cacheArtistes.set(artiste, recherche.data.id);
        writeInLogFile(LOG_FILE_PATH, `[~] Artiste déjà existant en base : ${artiste}`);
        return recherche.data;

    } catch (erreur) {
        // 404 = artiste non trouvé → on le crée
        if (erreur.response && erreur.response.status === 404) {
            const creation = await axios.post(
                `${config.api.url}/api/artistes`,
                { nom: artiste },
                { headers: { 'Content-Type': 'application/json' } }
            );

            cacheArtistes.set(artiste, creation.data.id);
            writeInLogFile(LOG_FILE_PATH, `[✓] Artiste créé : ${artiste}`);
            return creation.data;
        }

        // Toute autre erreur (500, réseau...) → on la remonte
        writeInLogFile(LOG_FILE_PATH, `[✗] Erreur lors de l'envoi de l'artiste ${artiste} : ${erreur.message}`);
        throw erreur;
    }
}


async function envoyerAlbum(album) {
    // Vérifier si l'album existe déjà en base via l'API
    try {
        const recherche = await axios.get(`${config.api.url}/api/albums/libelle/${encodeURIComponent(album)}`);

        // Album trouvé (200 OK) → on le retourne directement
        writeInLogFile(LOG_FILE_PATH, `[~] Album déjà existant en base : ${album}`);
        return recherche.data;

    } catch (erreur) {
        // 404 = album non trouvé → on le crée
        if (erreur.response && erreur.response.status === 404) {
            const creation = await axios.post(
                `${config.api.url}/api/albums`,
                { libelle: album },
                { headers: { 'Content-Type': 'application/json' } }
            );

            writeInLogFile(LOG_FILE_PATH, `[✓] Album créé : ${album}`);
            return creation.data;
        }

        // Toute autre erreur (500, réseau...) → on la remonte
        writeInLogFile(LOG_FILE_PATH, `[✗] Erreur lors de l'envoi de l'album ${album} : ${erreur.message}`);
        throw erreur;
    }
}

async function envoyerGenre(genre) {
    try {
        const recherche = await axios.get(`${config.api.url}/api/genres/libelle/${encodeURIComponent(genre)}`);

        writeInLogFile(LOG_FILE_PATH, `[~] Genre déjà existant en base : ${genre}`);
        return recherche.data;

    } catch (erreur) {
        if (erreur.response && erreur.response.status === 404) {
            const creation = await axios.post(
                `${config.api.url}/api/genres`,
                { libelle: genre },
                { headers: { 'Content-Type': 'application/json' } }
            );

            writeInLogFile(LOG_FILE_PATH, `[✓] Genre créé : ${genre}`);
            return creation.data;
        }

        writeInLogFile(LOG_FILE_PATH, `[✗] Erreur lors de l'envoi du genre ${genre} : ${erreur.message}`);
        throw erreur;
    }
}

async function envoyerLangue(langue) {
    try {
        const recherche = await axios.get(`${config.api.url}/api/langues/libelle/${encodeURIComponent(langue)}`);

        writeInLogFile(LOG_FILE_PATH, `[~] Langue déjà existante en base : ${genre}`);
        return recherche.data;

    } catch (erreur) {
        if (erreur.response && erreur.response.status === 404) {
            const creation = await axios.post(
                `${config.api.url}/api/langues`,
                { libelle: genre },
                { headers: { 'Content-Type': 'application/json' } }
            );

            writeInLogFile(LOG_FILE_PATH, `[✓] Langue créé : ${genre}`);
            return creation.data;
        }

        writeInLogFile(LOG_FILE_PATH, `[✗] Erreur lors de l'envoi de la langue ${langue} : ${erreur.message}`);
        throw erreur;
    }
}


async function envoyerMp3Fichier(cheminFichier, idArtiste, idAlbum, idGenre,idLangue) {
    if (cacheMp3.has(cheminFichier)) {
        writeInLogFile(LOG_FILE_PATH, `[~] MP3 déjà existant : ${cheminFichier}`);
        return { id: cacheMp3.get(cheminFichier) };
    }

    const form = new FormData();
    form.append('fichier', fs.createReadStream(cheminFichier));
    if (idArtiste) form.append('id_artiste', idArtiste);
    if (idAlbum) form.append('id_album', idAlbum);
    if (idGenre) form.append('id_genre', idGenre);
    if (idLangue) form.append('id_langue', idLangue);


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
        const { cheminFichier, titre, artiste, genre, album,langue, annee, duree, bitrate, frequence } = metadata;

        const [dataArtiste, dataAlbum, dataGenre,dataLangue] = await Promise.all([
            artiste ? envoyerArtiste(artiste) : null,
            album ? envoyerAlbum(album) : null,
            genre ? envoyerGenre(genre) : null,
            langue ? envoyerLangue(langue) : null
        ]);

        let dataMp3 = null;
        if (cheminFichier) {
            dataMp3 = await envoyerMp3Fichier(
                cheminFichier,
                dataArtiste?.id,
                dataAlbum?.id,
                dataGenre?.id,
                dataLangue?.id
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