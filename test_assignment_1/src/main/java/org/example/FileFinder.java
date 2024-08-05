package org.example;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class FileFinder {
    public static List<File> findTextFiles(File rootDir) {
        List<File> textFiles = new ArrayList<>();
        findTextFilesRecursively(rootDir, textFiles);
        return textFiles;
    }

    private static void findTextFilesRecursively(File dir, List<File> textFiles) {
        if (dir.isFile() && dir.getName().endsWith(".txt")) {
            textFiles.add(dir);
        } else if (dir.isDirectory()) {
            for (File file : dir.listFiles()) {
                findTextFilesRecursively(file, textFiles);
            }
        }
    }
}
