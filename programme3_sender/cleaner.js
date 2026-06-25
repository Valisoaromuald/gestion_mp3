// cleaner.js
const fs = require('fs');

function supprimerFichier(cheminFichier) {
    try {
        fs.unlinkSync(cheminFichier);
        console.log(`[✓] Fichier supprimé : ${cheminFichier}`);
    } catch (error) {
        console.error(`[!] Erreur suppression : ${error.message}`);
    }
}

module.exports = { supprimerFichier };