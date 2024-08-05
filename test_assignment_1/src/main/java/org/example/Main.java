package org.example;
import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) {
        File rootDir = new File("test-root");

        List<File> textFiles = FileFinder.findTextFiles(rootDir);

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

        TopologicalSort sorter = new TopologicalSort();
        try {
            List<String> sortedFiles = sorter.sort(graph.getDependencies());

            try (FileOutputStream fos = new FileOutputStream("output.txt")) {
                FileConcatenator.concatenateFiles(sortedFiles, fos);
            }

        } catch (IOException e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
}
