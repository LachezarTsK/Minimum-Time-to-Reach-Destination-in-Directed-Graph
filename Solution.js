
// const {PriorityQueue} = require('@datastructures-js/priority-queue');
/*
 PriorityQueue is internally included in the solution file on leetcode.
 When running the code on leetcode it should stay commented out. 
 It is mentioned here just for information about the external library 
 that is applied for this data structure.
 */

/**
 * @param {number} numberOfNodes
 * @param {number[][]} edges
 * @return {number}
 */
var minTime = function (numberOfNodes, edges) {
    this.CAN_NOT_REACH_DESTINATION = -1;
    this.INACCESSIBLE_TIME = Number.MAX_SAFE_INTEGER;

    const start = 0;
    const destination = numberOfNodes - 1;
    const directedGraph = createDirectedGraph(numberOfNodes, edges);

    return findMinTimeToReachDestination(directedGraph, start, destination);
};

/**
 * @param {number} node
 * @param {number} startTime
 * @param {number} endTime
 */
function Point(node, startTime, endTime) {
    this.node = node;
    this.startTime = startTime;
    this.endTime = endTime;
}

/**
 * @param {number} node
 * @param {number} timeFromStart
 */
function Step(node, timeFromStart) {
    this.node = node;
    this.timeFromStart = timeFromStart;
}

/**
 * @param {Point[][]} directedGraph
 * @param {number} start
 * @param {number} destination
 * @return {number}
 */
function findMinTimeToReachDestination(directedGraph, start, destination) {
    // PriorityQueue<Step>
    const minHeapTimeFromStart = new PriorityQueue((x, y) => x.timeFromStart - y.timeFromStart);
    const minTimeFromStart = new Array(directedGraph.length).fill(this.INACCESSIBLE_TIME);

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

    return this.CAN_NOT_REACH_DESTINATION;
}

/**
 * @param {number} numberOfNodes
 * @param {number[][]} edges
 * @return {Point[][]}
 */
function  createDirectedGraph(numberOfNodes, edges) {
    const directedGraph = Array.from(new Array(numberOfNodes), () => new Array());
    for (let [from, to, startTime, endTime] of edges) {
        directedGraph[from].push(new Point(to, startTime, endTime));
    }
    return directedGraph;
}

/**
 * @param {Step} current
 * @param {Point} next
 * @return {number}
 */
function getTimeToNextNode(current, next) {
    if (current.timeFromStart > next.endTime) {
        return this.INACCESSIBLE_TIME;
    }
    return Math.max(current.timeFromStart + 1, next.startTime + 1);
}
