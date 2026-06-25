// consumer.js
const amqp = require('amqplib');
const config = require('./config');
const { writeInLogFile } = require('./logger');

const LOG_FILE_PATH = config.logFilePath;
const MAX_RETRY = 3;

const QUEUE_ENTREE    = config.rabbitmq.queue;       // mp3_metadata
const DLX             = 'mp3_sender_dlx';
const RETRY_QUEUE     = 'mp3_sender_retry_queue';
const DLQ             = 'mp3_sender_dlq';
const TTL             = 5000;   

async function initRabbit(channel) {

    // 1. Exchange DLX
    await channel.assertExchange(DLX, 'direct', { durable: true });

    // 2. Queue principale
    await channel.assertQueue(QUEUE_ENTREE, {
        durable: true,
        arguments: {
            'x-dead-letter-exchange'    : DLX,
            'x-dead-letter-routing-key' : 'retry'
        }
    });

    // 3. Retry queue (attente avant retry)
    await channel.assertQueue(RETRY_QUEUE, {
        durable: true,
        arguments: {
            'x-dead-letter-exchange'    : '',
            'x-dead-letter-routing-key' : QUEUE_ENTREE,
            'x-message-ttl'             : TTL
        }
    });

    await channel.bindQueue(RETRY_QUEUE, DLX, 'retry');

    // 4. Dead Letter Queue finale
    await channel.assertQueue(DLQ, { durable: true });

    await channel.bindQueue(DLQ, DLX, 'final');

    writeInLogFile(LOG_FILE_PATH, '[*] RabbitMQ configuré');
    console.log('[*] RabbitMQ configuré');
}

async function connecter() {
    const { host, port, login, password, queue } = config.rabbitmq;

    const connexion = await amqp.connect(`amqp://${login}:${password}@${host}:${port}`);
    const channel = await connexion.createChannel();

    await channel.assertQueue(queue, { durable: false });
    channel.prefetch(1);

    writeInLogFile(LOG_FILE_PATH,`[*] En attente de messages sur : ${queue}`);

    return { connexion, channel };
}

async function consommer(channel, callback) {
    const { queue } = config.rabbitmq;

    channel.consume(queue, async (message) => {
        if (message === null) return;

        const contenu = message.content.toString();

        try {
            writeInLogFile(LOG_FILE_PATH, `Reçu: ${contenu}`);

            const metadata = JSON.parse(contenu);

            await callback(metadata);

            channel.ack(message);

        } catch (error) {
            try {
                // Récupérer le nombre de tentatives
                const headers = message.properties.headers || {};
                const retryCount = headers['x-retry'] ? Number(headers['x-retry']) : 0;

                if (retryCount < MAX_RETRY) {
                    // Renvoyer dans le DLX avec routing key retry
                    channel.publish(
                        'mp3_dlx',
                        'retry',
                        message.content,
                        {
                            headers: { 'x-retry': retryCount + 1 }
                        }
                    );

                    writeInLogFile(LOG_FILE_PATH, `Retry ${retryCount + 1}/${MAX_RETRY} : ${contenu}`);

                } else {
                    // Envoyer dans la DLQ finale
                    channel.publish(
                        'mp3_dlx',
                        'final',
                        message.content,
                        {}
                    );

                    writeInLogFile(LOG_FILE_PATH, `Echec final, envoyé en DLQ : ${contenu}`);
                }

                // Acquitter le message original dans les deux cas
                channel.ack(message);

            } catch (ex) {
                console.error(`[!] Erreur gestion retry : ${ex.message}`);
            }
        }
    });
}

module.exports = { connecter, consommer };