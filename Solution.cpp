
#include <span>
#include <queue>
#include <vector>
#include <limits>
#include <algorithm>
using namespace std;

class Solution {

    struct Point {
        int node{};
        int startTime{};
        int endTime{};

        Point() = default;
        Point(int node, int startTime, int endTime) :node{ node }, startTime{ startTime }, endTime{ endTime } {}
    };

    struct Step {
        int node{};
        int timeFromStart{};

        Step() = default;
        Step(int node, int timeFromStart) :node{ node }, timeFromStart{ timeFromStart } {}
    };

    struct ComparatorStep {
        bool operator()(const Step& x, const Step& y) {
            return x.timeFromStart > y.timeFromStart;
        }
    };

    static const int CAN_NOT_REACH_DESTINATION = -1;
    inline static const int INACCESSIBLE_TIME = numeric_limits<int>::max();

public:
    int minTime(int numberOfNodes, const vector<vector<int>>& edges) const {
        int start = 0;
        int destination = numberOfNodes - 1;
        vector<vector<Point>> directedGraph = createDirectedGraph(numberOfNodes, edges);

        return findMinTimeToReachDestination(directedGraph, start, destination);
    }

private:
    int findMinTimeToReachDestination(span<const vector<Point>> directedGraph, int start, int destination) const {
        priority_queue<Step, vector<Step>, ComparatorStep> minHeapTimeFromStart;
        vector<int> minTimeFromStart(directedGraph.size(), INACCESSIBLE_TIME);


        minHeapTimeFromStart.emplace(start, 0);
        minTimeFromStart[start] = 0;

        while (!minHeapTimeFromStart.empty()) {

            Step current = minHeapTimeFromStart.top();
            if (current.node == destination) {
                return current.timeFromStart;
            }
            minHeapTimeFromStart.pop();

            for (Point next : directedGraph[current.node]) {
                if (minTimeFromStart[next.node] > getTimeToNextNode(current, next)) {
                    minTimeFromStart[next.node] = getTimeToNextNode(current, next);
                    minHeapTimeFromStart.emplace(next.node, minTimeFromStart[next.node]);
                }
            }
        }

        return CAN_NOT_REACH_DESTINATION;
    }

    vector<vector<Point>> createDirectedGraph(int numberOfNodes, span<const vector<int>> edges) const {
        vector<vector<Point>> directedGraph(numberOfNodes);

        for (const auto& edge : edges) {
            int from = edge[0];
            int to = edge[1];
            int startTime = edge[2];
            int endTime = edge[3];

            directedGraph[from].emplace_back(to, startTime, endTime);
        }

        return directedGraph;
    }

    int getTimeToNextNode(const Step& current, const Point& next) const {
        if (current.timeFromStart > next.endTime) {
            return INACCESSIBLE_TIME;
        }
        return max(current.timeFromStart + 1, next.startTime + 1);
    }
};
