package org.example;

import java.io.IOException;
import java.util.*;

public class TopologicalSort {
    public List<String> sort(Map<String, Set<String>> dependencies) throws IOException {
        Map<String, Integer> inDegree = new HashMap<>();
        Queue<String> zeroInDegreeQueue = new LinkedList<>();
        List<String> sortedList = new ArrayList<>();

        for (String node : dependencies.keySet()) {
            inDegree.put(node, 0);
        }
        for (Set<String> deps : dependencies.values()) {
            for (String dep : deps) {
                inDegree.put(dep, inDegree.getOrDefault(dep, 0) + 1);
            }
        }
        for (Map.Entry<String, Integer> entry : inDegree.entrySet()) {
            if (entry.getValue() == 0) {
                zeroInDegreeQueue.add(entry.getKey());
            }
        }
        while (!zeroInDegreeQueue.isEmpty()) {
            String node = zeroInDegreeQueue.poll();
            sortedList.add(node);
            for (String neighbor : dependencies.getOrDefault(node, Collections.emptySet())) {
                int degree = inDegree.get(neighbor) - 1;
                inDegree.put(neighbor, degree);
                if (degree == 0) {
                    zeroInDegreeQueue.add(neighbor);
                }
            }
        }
        if (sortedList.size() != dependencies.size()) {
            throw new IOException("Cycle detected");
        }
        return sortedList;
    }
}
