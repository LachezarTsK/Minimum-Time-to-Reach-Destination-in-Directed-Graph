
// const {PriorityQueue} = require('@datastructures-js/priority-queue');
/*
 PriorityQueue is internally included in the solution file on leetcode.
 When running the code on leetcode it should stay commented out. 
 It is mentioned here just for information about the external library 
 that is applied for this data structure.
 */

function minTime(numberOfNodes: number, edges: number[][]): number {
    const start = 0;
    const destination = numberOfNodes - 1;
    const directedGraph = createDirectedGraph(numberOfNodes, edges);

    return findMinTimeToReachDestination(directedGraph, start, destination);
};

class Util {
    static CAN_NOT_REACH_DESTINATION = -1;
    static INACCESSIBLE_TIME = Number.MAX_SAFE_INTEGER;
}

class Point {

    node: number;
    startTime: number;
    endTime: number;

    constructor(node: number, startTime: number, endTime: number) {
        this.node = node;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}

class Step {

    node: number;
    timeFromStart: number;

    constructor(node: number, timeFromStart: number) {
        this.node = node;
        this.timeFromStart = timeFromStart;
    }
}

function findMinTimeToReachDestination(directedGraph: Point[][], start: number, destination: number): number {
    const minHeapTimeFromStart = new PriorityQueue<Step>((x, y) => x.timeFromStart - y.timeFromStart);
    const minTimeFromStart = new Array(directedGraph.length).fill(Util.INACCESSIBLE_TIME);

    minHeapTimeFromStart.enqueue(new Step(start, 0));
    minTimeFromStart[start] = 0;

    while (!minHeapTimeFromStart.isEmpty()) {

        const current = minHeapTimeFromStart.dequeue();
        if (current.node === destination) {
            return current.timeFromStart;
        }

        for (let next of directedGraph[current.node]) {
            if (minTimeFromStart[next.node] > getTimeToNextNode(current, next)) {
                minTimeFromStart[next.node] = getTimeToNextNode(current, next);
                minHeapTimeFromStart.enqueue(new Step(next.node, minTimeFromStart[next.node]));
            }
        }
    }

    return Util.CAN_NOT_REACH_DESTINATION;
}

function createDirectedGraph(numberOfNodes: number, edges: number[][]): Point[][] {
    const directedGraph = Array.from(new Array(numberOfNodes), () => new Array());
    for (let [from, to, startTime, endTime] of edges) {
        directedGraph[from].push(new Point(to, startTime, endTime));
    }
    return directedGraph;
}

function getTimeToNextNode(current: Step, next: Point): number {
    if (current.timeFromStart > next.endTime) {
        return Util.INACCESSIBLE_TIME;
    }
    return Math.max(current.timeFromStart + 1, next.startTime + 1);
}
