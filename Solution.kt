
import kotlin.math.max

class Solution {

    private data class Point(val node: Int, val startTime: Int, val endTime: Int) {}
    private data class Step(val node: Int, val timeFromStart: Int) {}

    private companion object {
        const val CAN_NOT_REACH_DESTINATION = -1
        const val INACCESSIBLE_TIME = Int.MAX_VALUE
    }

    fun minTime(numberOfNodes: Int, edges: Array<IntArray>): Int {
        val start = 0
        val destination = numberOfNodes - 1
        val directedGraph: Array<MutableList<Point>> = createDirectedGraph(numberOfNodes, edges)

        return findMinTimeToReachDestination(directedGraph, start, destination)
    }

    private fun findMinTimeToReachDestination(directedGraph: Array<MutableList<Point>>, start: Int, destination: Int): Int {
        val minHeapTimeFromStart = java.util.PriorityQueue<Step>() { x, y -> x.timeFromStart - y.timeFromStart }

        val minTimeFromStart = IntArray(directedGraph.size)
        minTimeFromStart.fill(INACCESSIBLE_TIME)

        minHeapTimeFromStart.add(Step(start, 0))
        minTimeFromStart[start] = 0

        while (!minHeapTimeFromStart.isEmpty()) {

            val current = minHeapTimeFromStart.poll()
            if (current.node == destination) {
                return current.timeFromStart
            }

            for (next in directedGraph[current.node]) {
                if (minTimeFromStart[next.node] > getTimeToNextNode(current, next)) {
                    minTimeFromStart[next.node] = getTimeToNextNode(current, next)
                    minHeapTimeFromStart.add(Step(next.node, minTimeFromStart[next.node]))
                }
            }
        }

        return CAN_NOT_REACH_DESTINATION
    }

    private fun createDirectedGraph(numberOfNodes: Int, edges: Array<IntArray>): Array<MutableList<Point>> {
        val directedGraph = Array(numberOfNodes) { mutableListOf<Point>() }
        for ((from, to, startTime, endTime) in edges) {
            directedGraph[from].add(Point(to, startTime, endTime))
        }

        return directedGraph
    }

    private fun getTimeToNextNode(current: Step, next: Point): Int {
        if (current.timeFromStart > next.endTime) {
            return INACCESSIBLE_TIME
        }
        return max(current.timeFromStart + 1, next.startTime + 1)
    }
}
