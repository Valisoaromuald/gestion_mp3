// index.js
const { connecter, initRabbit, consommer } = require('./consumer');
const { envoyerMp3, readBlackList }                       = require('./apiSender');
const { supprimerFichier }                 = require('./cleaner');

async function main() {
    const { connexion, channel } = await connecter();

    await initRabbit(channel);
    const blacklist = await readBlackList()
    await consommer(channel, async (metadata) => {
        await envoyerMp3(metadata,blacklist);
        supprimerFichier(metadata.cheminFichier);
    });

    // Fermeture propre sur Ctrl+C
    process.on('SIGINT', async () => {
        console.log('\n[*] Arrêt du programme...');
        await channel.close();
        await connexion.close();
        process.exit(0);
    });
}

main().catch(console.error);