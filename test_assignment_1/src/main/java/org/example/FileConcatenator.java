package org.example;

import java.io.*;
import java.util.List;

public class FileConcatenator {
    public static void concatenateFiles(List<String> filePaths, OutputStream outputStream) throws IOException {
        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(outputStream));
        for (String path : filePaths) {
            File file = new File(path);
            BufferedReader reader = new BufferedReader(new FileReader(file));
            String line;
            while ((line = reader.readLine()) != null) {
                writer.write(line);
                writer.newLine();
            }
            reader.close();
        }
        writer.close();
    }
}
