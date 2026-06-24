package com.gestion_mp3;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Logger {
    private static final DateTimeFormatter FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");

    public static void writeInLogFile(String logFilePath, String content) {
        LocalDateTime dateHeure = LocalDateTime.now();

        String dt = dateHeure.format(FORMAT);

        try (BufferedWriter writer = new BufferedWriter(
                new FileWriter(logFilePath, true))) {

            writer.write("[" + dt + "]> " + content);
            writer.newLine();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
