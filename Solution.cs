
using System;
using System.Collections.Generic;

public class Solution
{
    private record Point(int node, int startTime, int endTime) { }
    private record Step(int node, int timeFromStart) { }

    private static readonly int CAN_NOT_REACH_DESTINATION = -1;
    private static readonly int INACCESSIBLE_TIME = int.MaxValue;

    public int MinTime(int numberOfNodes, int[][] edges)
    {
        int start = 0;
        int destination = numberOfNodes - 1;
        List<Point>[] directedGraph = CreateDirectedGraph(numberOfNodes, edges);

        return FindMinTimeToReachDestination(directedGraph, start, destination);
    }

    private int FindMinTimeToReachDestination(List<Point>[] directedGraph, int start, int destination)
    {
        PriorityQueue<Step, int> minHeapTimeFromStart = new PriorityQueue<Step, int>(
            Comparer<int>.Create((xTimeFromStart, yTimeFromStart) => xTimeFromStart.CompareTo(yTimeFromStart)));

        int[] minTimeFromStart = new int[directedGraph.Length];
        Array.Fill(minTimeFromStart, INACCESSIBLE_TIME);

        minHeapTimeFromStart.Enqueue(new Step(start, 0), 0);
        minTimeFromStart[start] = 0;

        while (minHeapTimeFromStart.Count > 0)
        {

            Step current = minHeapTimeFromStart.Dequeue();
            if (current.node == destination)
            {
                return current.timeFromStart;
            }

            foreach (Point next in directedGraph[current.node])
            {
                if (minTimeFromStart[next.node] > GetTimeToNextNode(current, next))
                {
                    minTimeFromStart[next.node] = GetTimeToNextNode(current, next);
                    minHeapTimeFromStart.Enqueue(new Step(next.node, minTimeFromStart[next.node]), minTimeFromStart[next.node]);
                }
            }
        }

        return CAN_NOT_REACH_DESTINATION;
    }

    private List<Point>[] CreateDirectedGraph(int numberOfNodes, int[][] edges)
    {
        List<Point>[] directedGraph = new List<Point>[numberOfNodes];
        for (int node = 0; node < numberOfNodes; ++node)
        {
            directedGraph[node] = new List<Point>();
        }

        foreach (int[] edge in edges)
        {
            int from = edge[0];
            int to = edge[1];
            int startTime = edge[2];
            int endTime = edge[3];

            directedGraph[from].Add(new Point(to, startTime, endTime));
        }

        return directedGraph;
    }

    private int GetTimeToNextNode(Step current, Point next)
    {
        if (current.timeFromStart > next.endTime)
        {
            return INACCESSIBLE_TIME;
        }
        return Math.Max(current.timeFromStart + 1, next.startTime + 1);
    }
}
