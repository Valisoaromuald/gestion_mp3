// logger.js
const fs = require('fs');

function writeInLogFile(logFilePath, content) {
    try {
        const now = new Date();

        const dt = now.getFullYear()                          +
            '-' + String(now.getMonth() + 1).padStart(2, '0') +
            '-' + String(now.getDate()).padStart(2, '0')       +
            ' ' + String(now.getHours()).padStart(2, '0')      +
            ':' + String(now.getMinutes()).padStart(2, '0')    +
            ':' + String(now.getSeconds()).padStart(2, '0')    +
            '.' + String(now.getMilliseconds()).padStart(3, '0');

        const ligne = `[${dt}]> ${content}\n`;

        fs.appendFileSync(logFilePath, ligne, 'utf-8');

    } catch (error) {
        console.error(`Erreur écriture log : ${error.message}`);
    }
}

module.exports = { writeInLogFile };