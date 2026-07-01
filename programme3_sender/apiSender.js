const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const config = require('./config');
const { writeInLogFile } = require('./logger');

const LOG_FILE_PATH = config.logs.log_file_path;
const cacheMp3 = new Map();
const cacheMetadata = new Map();

async function envoyerArtiste(artiste) {
    try {
        const recherche = await axios.get(`${config.api.url}/api/artistes/nom/${encodeURIComponent(artiste)}`);
        writeInLogFile(LOG_FILE_PATH, `[~] Artiste déjà existant en base : ${artiste}`);
        return recherche.data;
    } catch (erreur) {
        if (erreur.response?.status === 404) {
            try {
                const creation = await axios.post(`${config.api.url}/api/artistes`, { nom: artiste }, { headers: { 'Content-Type': 'application/json' } });
                writeInLogFile(LOG_FILE_PATH, `[✓] Artiste créé : ${artiste}`);
                return creation.data;
            } catch (erreurCreation) {
                if (erreurCreation.response?.status === 500) {
                    writeInLogFile(LOG_FILE_PATH, `[~] Race condition artiste, récupération : ${artiste}`);
                    const recuperation = await axios.get(`${config.api.url}/api/artistes/nom/${encodeURIComponent(artiste)}`);
                    return recuperation.data;
                }
                throw erreurCreation;
            }
        }
        writeInLogFile(LOG_FILE_PATH, `[✗] Erreur artiste ${artiste} : ${erreur.message}`);
        throw erreur;
    }
}

async function envoyerAlbum(album) {
    try {
        const recherche = await axios.get(`${config.api.url}/api/albums/libelle/${encodeURIComponent(album)}`);
        writeInLogFile(LOG_FILE_PATH, `[~] Album déjà existant en base : ${album}`);
        return recherche.data;
    } catch (erreur) {
        if (erreur.response?.status === 404) {
            try {
                const creation = await axios.post(`${config.api.url}/api/albums`, { libelle: album }, { headers: { 'Content-Type': 'application/json' } });
                writeInLogFile(LOG_FILE_PATH, `[✓] Album créé : ${album}`);
                return creation.data;
            } catch (erreurCreation) {
                if (erreurCreation.response?.status === 500) {
                    writeInLogFile(LOG_FILE_PATH, `[~] Race condition album, récupération : ${album}`);
                    const recuperation = await axios.get(`${config.api.url}/api/albums/libelle/${encodeURIComponent(album)}`);
                    return recuperation.data;
                }
                throw erreurCreation;
            }
        }
        writeInLogFile(LOG_FILE_PATH, `[✗] Erreur album ${album} : ${erreur.message}`);
        throw erreur;
    }
}

async function envoyerGenre(genre) {
    try {
        const recherche = await axios.get(`${config.api.url}/api/genres/libelle/${encodeURIComponent(genre)}`);
        writeInLogFile(LOG_FILE_PATH, `[~] Genre déjà existant en base : ${genre}`);
        return recherche.data;
    } catch (erreur) {
        if (erreur.response?.status === 404) {
            try {
                const creation = await axios.post(`${config.api.url}/api/genres`, { libelle: genre }, { headers: { 'Content-Type': 'application/json' } });
                writeInLogFile(LOG_FILE_PATH, `[✓] Genre créé : ${genre}`);
                return creation.data;
            } catch (erreurCreation) {
                if (erreurCreation.response?.status === 500) {
                    writeInLogFile(LOG_FILE_PATH, `[~] Race condition genre, récupération : ${genre}`);
                    const recuperation = await axios.get(`${config.api.url}/api/genres/libelle/${encodeURIComponent(genre)}`);
                    return recuperation.data;
                }
                throw erreurCreation;
            }
        }
        writeInLogFile(LOG_FILE_PATH, `[✗] Erreur genre ${genre} : ${erreur.message}`);
        throw erreur;
    }
}

async function envoyerLangue(langue) {
    try {
        const recherche = await axios.get(`${config.api.url}/api/langues/libelle/${encodeURIComponent(langue)}`);
        writeInLogFile(LOG_FILE_PATH, `[~] Langue déjà existante en base : ${langue}`);
        return recherche.data;
    } catch (erreur) {
        if (erreur.response?.status === 404) {
            try {
                // ✅ langue (et non genre) partout
                const creation = await axios.post(`${config.api.url}/api/langues`, { libelle: langue }, { headers: { 'Content-Type': 'application/json' } });
                writeInLogFile(LOG_FILE_PATH, `[✓] Langue créée : ${langue}`);
                return creation.data;
            } catch (erreurCreation) {
                if (erreurCreation.response?.status === 500) {
                    writeInLogFile(LOG_FILE_PATH, `[~] Race condition langue, récupération : ${langue}`);
                    const recuperation = await axios.get(`${config.api.url}/api/langues/libelle/${encodeURIComponent(langue)}`);
                    return recuperation.data;
                }
                throw erreurCreation;
            }
        }
        writeInLogFile(LOG_FILE_PATH, `[✗] Erreur langue ${langue} : ${erreur.message}`);
        throw erreur;
    }
}

async function envoyerMp3Fichier(cheminFichier, idArtiste, idAlbum, idGenre, idLangue) {
    if (cacheMp3.has(cheminFichier)) {
        writeInLogFile(LOG_FILE_PATH, `[~] MP3 déjà envoyé : ${cheminFichier}`);
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
        writeInLogFile(LOG_FILE_PATH, `[~] Metadata déjà envoyée : ${titre}`);
        return { id: cacheMetadata.get(titre) };
    }

    const response = await axios.post(
        `${config.api.url}/api/metadata`,
        {
            titre,
            annee,
            duree,
            bitrate,
            frequence,
            mp3: { id: idMp3 }
        },
        {
            headers: { 'Content-Type': 'application/json' }
        }
    );

    cacheMetadata.set(titre, response.data.id);
    writeInLogFile(LOG_FILE_PATH, `[✓] Metadata envoyée : ${titre}`);
    return response.data;
}

async function envoyerMp3(metadata) {
    try {
        const { cheminFichier, titre, annee, duree, bitrate, frequence } = metadata;
        //  Nettoyage de toutes les valeurs texte
        const artistePropre = metadata.artiste?.trim() || null;
        const albumPropre = metadata.album?.trim() || null;
        const genrePropre = metadata.genre?.trim() || null;
        const languePropre = metadata.langue?.trim() || null;
        
        const [dataArtiste, dataAlbum, dataGenre, dataLangue] = await Promise.all([
            artistePropre ? envoyerArtiste(artistePropre) : null,
            albumPropre ? envoyerAlbum(albumPropre) : null,
            genrePropre ? envoyerGenre(genrePropre) : null,
            languePropre ? envoyerLangue(languePropre) : null
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