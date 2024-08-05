package org.example;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;

public class DependencyGraph {
    private final Map<String, Set<String>> dependencies = new HashMap<>();
    private final Map<String, Set<String>> reverseDependencies = new HashMap<>();

    public void addFile(File file, String content) {
        String filePath = file.getPath();
        Set<String> fileDependencies = new HashSet<>();
        String[] lines = content.split("\n");

        for (String line : lines) {
            if (line.startsWith("*require ")) {
                String dependencyPath = line.substring(10, line.length() - 2);
                fileDependencies.add(dependencyPath);
                reverseDependencies.computeIfAbsent(dependencyPath, k -> new HashSet<>()).add(filePath);
            }
        }
        dependencies.put(filePath, fileDependencies);
    }

    public Map<String, Set<String>> getDependencies() {
        return dependencies;
    }

    public Map<String, Set<String>> getReverseDependencies() {
        return reverseDependencies;
    }
}
