package com.gestion_mp3;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.DeliverCallback;

public class Consumer {
    private Connection connexion;
    private Channel channel;
    private static final String HOST = Config.HOST;
    private static final int PORT = Config.PORT;
    private static final String LOGIN = Config.LOGIN;
    private static final String MOT_DE_PASSE = Config.PASSWORD;
    private static final String QUEUE_ENTREE = Config.QUEUE_IN;
    private static final String LOG_FILE_PATH = Config.LOG_FILE_PATH;

    public void initRabbit() throws Exception {

        // 1. Exchange DLX
        channel.exchangeDeclare("mp3_dlx", "direct", true);

        // 2. Queue principale
        channel.queueDeclare(
                QUEUE_ENTREE,
                true,
                false,
                false,
                Map.of(
                        "x-dead-letter-exchange", "mp3_dlx",
                        "x-dead-letter-routing-key", "retry"));

        // 3. Retry queue (attente avant retry)
        channel.queueDeclare(
                "mp3_retry_queue",
                true,
                false,
                false,
                Map.of(
                        "x-dead-letter-exchange", "",
                        "x-dead-letter-routing-key", QUEUE_ENTREE,
                        "x-message-ttl", 5000 // 5 secondes
                ));

        channel.queueBind(
                "mp3_retry_queue",
                "mp3_dlx",
                "retry");

        // 4. Dead Letter Queue finale
        channel.queueDeclare(
                "mp3_dlq",
                true,
                false,
                false,
                null);

        channel.queueBind(
                "mp3_dlq",
                "mp3_dlx",
                "final");

        Logger.writeInLogFile(LOG_FILE_PATH, "[*] RabbitMQ configuré");
    }

    public void connecter() throws Exception {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost(HOST);
        factory.setPort(PORT);
        factory.setUsername(LOGIN);
        factory.setPassword(MOT_DE_PASSE);

        connexion = factory.newConnection();
        channel = connexion.createChannel();

        channel.basicQos(1); // Prefetch count = 1

        Logger.writeInLogFile(LOG_FILE_PATH, "[*] En attente de messages sur : " + QUEUE_ENTREE);
    }

    public void consommer(MetaDataExtractor extractor, Producer producer) {

        DeliverCallback callback = (tag, delivery) -> {

            String path = new String(delivery.getBody(), StandardCharsets.UTF_8);

            try {

                Logger.writeInLogFile(LOG_FILE_PATH, "Reçu: " + path);

                Mp3Metadata metadata = extractor.extraire(path);

                producer.publier(metadata);

                channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);

            } catch (Exception e) {
                try {

                    Map<String, Object> headers = delivery.getProperties().getHeaders();

                    long retryCount = 0;

                    if (headers != null && headers.containsKey("x-retry")) {
                        retryCount = ((Number) headers.get("x-retry")).longValue();
                    }

                    if (retryCount < 3) {

                        AMQP.BasicProperties props = new AMQP.BasicProperties.Builder()
                                .headers(Map.of(
                                        "x-retry",
                                        retryCount + 1))
                                .build();

                        // envoyer dans le DLX avec routing key retry
                        channel.basicPublish(
                                "mp3_dlx",
                                "retry",
                                props,
                                delivery.getBody());

                        // supprimer le message actuel
                        channel.basicAck(
                                delivery.getEnvelope().getDeliveryTag(),
                                false);

                    } else {

                        // envoyer dans la DLQ finale
                        channel.basicPublish(
                                "mp3_dlx",
                                "final",
                                null,
                                delivery.getBody());

                        channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
                    }

                } catch (Exception ex) {
                    ex.printStackTrace();
                }
            }
        };

        try {
            channel.basicConsume(
                    QUEUE_ENTREE,
                    false,
                    callback,
                    consumerTag -> {
                    });
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void deconnecter() throws Exception {
        if (channel != null)
            channel.close();
        if (connexion != null)
            connexion.close();
    }

}
