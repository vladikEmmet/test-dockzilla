package org.example;

import java.io.*;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class FileConcatenator {
    public static void concatenateFiles(List<String> filePaths, OutputStream outputStream) throws IOException {
        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(outputStream));
        Pattern pattern = Pattern.compile("\\*?require ‘[^’]+’\\*?");

        for (String path : filePaths) {
            File file = new File(path);
            BufferedReader reader = new BufferedReader(new FileReader(file));
            String line;
            while ((line = reader.readLine()) != null) {
                Matcher matcher = pattern.matcher(line);
                if (matcher.find()) {
                    writer.write(line);
                    writer.newLine();
                }
            }
            reader.close();
        }
        writer.close();
    }
}
