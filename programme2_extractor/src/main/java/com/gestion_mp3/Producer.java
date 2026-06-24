package com.gestion_mp3;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

public class Producer {
    private Connection connexion;
    private Channel channel;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final String LOG_FILE_PATH = Config.LOG_FILE_PATH;
    
    public void connecter() throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost(Config.HOST);
        factory.setPort(Config.PORT);
        factory.setUsername(Config.LOGIN);
        factory.setPassword(Config.PASSWORD);

        connexion = factory.newConnection();
        channel = connexion.createChannel();

        channel.queueDeclare(Config.QUEUE_OUT, false, false, false, null);

        Logger.writeInLogFile(LOG_FILE_PATH,"[*] Producer connecté, queue : " + Config.QUEUE_OUT);
    }

    public void publier(Mp3Metadata metadata) throws Exception {
        // Convertir l'objet en JSON avant d'envoyer
        String message = objectMapper.writeValueAsString(metadata);

        channel.basicPublish(
                "", // Default exchange
                Config.QUEUE_OUT,
                null,
                message.getBytes("UTF-8"));

        Logger.writeInLogFile(LOG_FILE_PATH,"[x] Métadonnées envoyées : " + message);
    }

    public void deconnecter() throws Exception {
        if (channel != null)
            channel.close();
        if (connexion != null)
            connexion.close();
    }
}
