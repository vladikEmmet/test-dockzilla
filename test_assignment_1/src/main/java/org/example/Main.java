package org.example;
import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) {
        File rootDir = new File("test-root");

        // Шаг 1: Найти все текстовые файлы
        List<File> textFiles = FileFinder.findTextFiles(rootDir);

        // Шаг 2: Построить граф зависимостей
        DependencyGraph graph = new DependencyGraph();
        for (File file : textFiles) {
            try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
                StringBuilder content = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    content.append(line).append("\n");
                }
                graph.addFile(file, content.toString());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        // Шаг 3: Выполнить топологическую сортировку
        TopologicalSort sorter = new TopologicalSort();
        try {
            List<String> sortedFiles = sorter.sort(graph.getDependencies());

            // Шаг 4: Конкатенировать файлы
            try (FileOutputStream fos = new FileOutputStream("output.txt")) {
                FileConcatenator.concatenateFiles(sortedFiles, fos);
            }

        } catch (IOException e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
}
