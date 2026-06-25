// apiSender.js
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const config = require('./config');

async function envoyerMp3(metadata) {
    const form = new FormData();

    // Ajouter le fichier MP3
    form.append('fichier', fs.createReadStream(metadata.cheminFichier));

    // Ajouter les métadonnées
    form.append('titre',     metadata.titre     || '');
    form.append('artiste',   metadata.artiste   || '');
    form.append('album',     metadata.album     || '');
    form.append('annee',     metadata.annee     || '');
    form.append('genre',     metadata.genre     || '');
    form.append('duree',     metadata.duree     || 0);
    form.append('bitrate',   metadata.bitrate   || 0);
    form.append('frequence', metadata.frequence || 0);

    const response = await axios.post(`${config.api.url}/api/mp3`, form, {
        headers: { ...form.getHeaders() }
    });

    console.log(`[✓] Envoyé avec succès : ${metadata.titre} — status ${response.status}`);

    return response.data;
}

module.exports = { envoyerMp3 };