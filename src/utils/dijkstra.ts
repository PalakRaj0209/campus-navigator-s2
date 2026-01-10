// ✅ FIX 1: Go up one level (..) to find data folder
import { GraphData } from '../data/graph';

interface DistanceMap {
  [key: string]: number;
}

interface PreviousNodeMap {
  [key: string]: string | null;
}

export const findShortestPath = (
  graph: GraphData,
  startNodeId: string,
  endNodeId: string
): string[] => {
  const distances: DistanceMap = {};
  const previous: PreviousNodeMap = {};
  
  // ✅ FIX 2: Explicitly type 'n' to fix implicit any error
  const nodes = new Set<string>(graph.nodes.map((n) => n.id));

  for (const node of graph.nodes) {
    distances[node.id] = Infinity;
    previous[node.id] = null;
  }
  distances[startNodeId] = 0;

  while (nodes.size > 0) {
    // ✅ FIX 3: Explicitly type minNode and nodeId as strings
    const currentNodeId = Array.from(nodes).reduce((minNode: string, nodeId: string) =>
      distances[nodeId] < distances[minNode] ? nodeId : minNode
    );

    if (currentNodeId === endNodeId || distances[currentNodeId] === Infinity) {
      break;
    }

    nodes.delete(currentNodeId);

    // ✅ FIX 4: Explicitly type 'e' for edge
    const neighbors = graph.edges.filter(e => e.from === currentNodeId || e.to === currentNodeId);

    for (const edge of neighbors) {
      const neighborId = edge.from === currentNodeId ? edge.to : edge.from;
      if (!nodes.has(neighborId)) continue;

      const alt = distances[currentNodeId] + edge.weight;
      if (alt < distances[neighborId]) {
        distances[neighborId] = alt;
        previous[neighborId] = currentNodeId;
      }
    }
  }

  const path: string[] = [];
  let current: string | null = endNodeId;

  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  return path[0] === startNodeId ? path : [];
};