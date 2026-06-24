package com.gestion_mp3;

import io.github.cdimascio.dotenv.Dotenv;

public class Config {
    private static final Dotenv dotenv = Dotenv.configure()
            .directory("../") // Racine du projet
            .load();
    public static final String HOST = dotenv.get("RABBITMQ_HOST");
    public static final int PORT = Integer.parseInt(dotenv.get("RABBITMQ_PORT"));
    public static final String LOGIN = dotenv.get("RABBITMQ_LOGIN");
    public static final String PASSWORD = dotenv.get("RABBITMQ_MOT_DE_PASSE");
    public static final String QUEUE_IN = dotenv.get("RABBITMQ_QUEUE_MP3");
    public static final String QUEUE_OUT = dotenv.get("RABBITMQ_QUEUE_METADATA");
    public static final String LOG_FILE_PATH = dotenv.get("LOG_FILE_PATH");
}
