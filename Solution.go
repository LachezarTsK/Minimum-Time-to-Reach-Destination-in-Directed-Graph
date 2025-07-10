
package main
import (
    "container/heap"
    "math"
)

const CAN_NOT_REACH_DESTINATION = -1
const INACCESSIBLE_TIME = math.MaxInt

func minTime(numberOfNodes int, edges [][]int) int {
    start := 0
    destination := numberOfNodes - 1
    var directedGraph [][]Point = createDirectedGraph(numberOfNodes, edges)

    return findMinTimeToReachDestination(directedGraph, start, destination)
}

type Point struct {
    node      int
    startTime int
    endTime   int
}

func NewPoint(node int, startTime int, endTime int) Point {
    point := Point{
        node:      node,
        startTime: startTime,
        endTime:   endTime,
    }
    return point
}

type Step struct {
    node          int
    timeFromStart int
}

func NewStep(node int, timeFromStart int) Step {
    step := Step{
        node:          node,
        timeFromStart: timeFromStart,
    }
    return step
}

func findMinTimeToReachDestination(directedGraph [][]Point, start int, destination int) int {
    minHeapTimeFromStart := PriorityQueue{}
    minTimeFromStart := make([]int, len(directedGraph))
    for i := range minTimeFromStart {
        minTimeFromStart[i] = INACCESSIBLE_TIME
    }

    heap.Push(&minHeapTimeFromStart, NewStep(start, 0))
    minTimeFromStart[start] = 0

    for minHeapTimeFromStart.Len() > 0 {

        current := heap.Pop(&minHeapTimeFromStart).(Step)
        if current.node == destination {
            return current.timeFromStart
        }

        for _, next := range directedGraph[current.node] {
            if minTimeFromStart[next.node] > getTimeToNextNode(&current, &next) {
                minTimeFromStart[next.node] = getTimeToNextNode(&current, &next)
                heap.Push(&minHeapTimeFromStart, NewStep(next.node, minTimeFromStart[next.node]))
            }
        }
    }

    return CAN_NOT_REACH_DESTINATION
}

func createDirectedGraph(numberOfNodes int, edges [][]int) [][]Point {
    directedGraph := make([][]Point, numberOfNodes)
    for i := range directedGraph {
        directedGraph[i] = make([]Point, 0)
    }

    for _, edge := range edges {
        from := edge[0]
        to := edge[1]
        startTime := edge[2]
        endTime := edge[3]
        directedGraph[from] = append(directedGraph[from], NewPoint(to, startTime, endTime))
    }

    return directedGraph
}

func getTimeToNextNode(current *Step, next *Point) int {
    if current.timeFromStart > next.endTime {
        return INACCESSIBLE_TIME
    }
    return max(current.timeFromStart + 1, next.startTime + 1)
}

type PriorityQueue []Step

func (pq PriorityQueue) Len() int {
    return len(pq)
}

func (pq PriorityQueue) Less(first int, second int) bool {
    return pq[first].timeFromStart < pq[second].timeFromStart
}

func (pq PriorityQueue) Swap(first int, second int) {
    pq[first], pq[second] = pq[second], pq[first]
}

func (pq *PriorityQueue) Push(object any) {
    *pq = append(*pq, object.(Step))
}

func (pq *PriorityQueue) Pop() any {
    step := (*pq)[pq.Len() - 1]
    *pq = (*pq)[0 : pq.Len() - 1]
    return step
}
