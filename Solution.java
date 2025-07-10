
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.PriorityQueue;

public class Solution {

    private record Point(int node, int startTime, int endTime) {}
    private record Step(int node, int timeFromStart) {}

    private static final int CAN_NOT_REACH_DESTINATION = -1;
    private static final int INACCESSIBLE_TIME = Integer.MAX_VALUE;

    public int minTime(int numberOfNodes, int[][] edges) {
        int start = 0;
        int destination = numberOfNodes - 1;
        List<Point>[] directedGraph = createDirectedGraph(numberOfNodes, edges);

        return findMinTimeToReachDestination(directedGraph, start, destination);
    }

    private int findMinTimeToReachDestination(List<Point>[] directedGraph, int start, int destination) {
        PriorityQueue<Step> minHeapTimeFromStart = new PriorityQueue<>((x, y) -> x.timeFromStart - y.timeFromStart);

        int[] minTimeFromStart = new int[directedGraph.length];
        Arrays.fill(minTimeFromStart, INACCESSIBLE_TIME);

        minHeapTimeFromStart.add(new Step(start, 0));
        minTimeFromStart[start] = 0;

        while (!minHeapTimeFromStart.isEmpty()) {

            Step current = minHeapTimeFromStart.poll();
            if (current.node == destination) {
                return current.timeFromStart;
            }

            for (Point next : directedGraph[current.node]) {
                if (minTimeFromStart[next.node] > getTimeToNextNode(current, next)) {
                    minTimeFromStart[next.node] = getTimeToNextNode(current, next);
                    minHeapTimeFromStart.add(new Step(next.node, minTimeFromStart[next.node]));
                }
            }
        }

        return CAN_NOT_REACH_DESTINATION;
    }

    private List<Point>[] createDirectedGraph(int numberOfNodes, int[][] edges) {
        List<Point>[] directedGraph = new ArrayList[numberOfNodes];
        for (int node = 0; node < numberOfNodes; ++node) {
            directedGraph[node] = new ArrayList<>();
        }

        for (int[] edge : edges) {
            int from = edge[0];
            int to = edge[1];
            int startTime = edge[2];
            int endTime = edge[3];

            directedGraph[from].add(new Point(to, startTime, endTime));
        }

        return directedGraph;
    }

    private int getTimeToNextNode(Step current, Point next) {
        if (current.timeFromStart > next.endTime) {
            return INACCESSIBLE_TIME;
        }
        return Math.max(current.timeFromStart + 1, next.startTime + 1);
    }
}
