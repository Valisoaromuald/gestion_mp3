// cleaner.js
const fs = require('fs');

function supprimerFichier(cheminFichier) {
    try {
        fs.unlinkSync(cheminFichier);
        writeInLogFile(LOG_FILE_PATH,`[✓] Fichier supprimé : ${cheminFichier}`);
    } catch (error) {
        writeInLogFile(LOG_FILE_PATH,`[!] Erreur suppression : ${error.message}`);
    }
}

module.exports = { supprimerFichier };