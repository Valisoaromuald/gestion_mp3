// cleaner.js
const fs = require('fs');
const config = require('./config');
const LOG_FILE_PATH = config.logs.log_file_path;
const { writeInLogFile } = require('./logger');
function supprimerFichier(cheminFichier) {
    try {
        fs.unlinkSync(cheminFichier);
        writeInLogFile(LOG_FILE_PATH,`[✓] Fichier supprimé : ${cheminFichier}`);
    }  
    catch (error) {
    console.error(`[!] Erreur gestion retry : ${error.message}`);
    writeInLogFile(LOG_FILE_PATH, `[!] Erreur suppression : ${error.message}`);
}
}

module.exports = { supprimerFichier };