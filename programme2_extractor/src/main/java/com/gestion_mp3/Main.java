// Main.java
package com.gestion_mp3;

public class Main {
    public static void main(String[] args) {
        Producer producer = new Producer();
        Consumer consumer = new Consumer();
        MetaDataExtractor extractor = new MetaDataExtractor();

        try {
            producer.connecter();
            consumer.connecter();
            consumer.initRabbit();
            consumer.consommer(extractor, producer);
            Thread.sleep(Long.MAX_VALUE);
        } catch (Exception e) {
            System.out.println("Erreur : " + e.getMessage());

        } finally {
            try {
                System.out.println("Déconnexion");
                consumer.deconnecter();
                producer.deconnecter();
            } catch (Exception e) {
                System.out.println("Erreur lors de la déconnexion : " + e.getMessage());
            }
        }
    }
}