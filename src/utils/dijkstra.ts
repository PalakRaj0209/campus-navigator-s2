// Ensure the path to graph is correct based on your folder structure
import { GraphData } from '../data/graph';

interface DistanceMap {
  [key: string]: number;
}

interface PreviousNodeMap {
  [key: string]: string | null;
}

/**
 * Updated Dijkstra to support travel preferences
 * @param preference - 'lift' or 'stair'
 */
export const findShortestPath = (
  graph: GraphData,
  startNodeId: string,
  endNodeId: string,
  preference: 'lift' | 'stair'
): string[] => {
  const distances: DistanceMap = {};
  const previous: PreviousNodeMap = {};
  
  // Create a set of all node IDs
  const nodes = new Set<string>(graph.nodes.map((n) => n.id));

  for (const node of graph.nodes) {
    distances[node.id] = Infinity;
    previous[node.id] = null;
  }
  distances[startNodeId] = 0;

  while (nodes.size > 0) {
    // Find the node with the smallest distance
    const currentNodeId = Array.from(nodes).reduce((minNode: string, nodeId: string) =>
      distances[nodeId] < distances[minNode] ? nodeId : minNode
    );

    if (currentNodeId === endNodeId || distances[currentNodeId] === Infinity) {
      break;
    }

    nodes.delete(currentNodeId);

    // Get neighbors of the current node
    const neighbors = graph.edges.filter(e => e.from === currentNodeId || e.to === currentNodeId);

    for (const edge of neighbors) {
      const neighborId = edge.from === currentNodeId ? edge.to : edge.from;
      if (!nodes.has(neighborId)) continue;

      const neighborNode = graph.nodes.find(n => n.id === neighborId);
      
      // LOGIC: Apply a massive weight penalty to the mode the user did NOT choose
      let weight = edge.weight;
      if (neighborNode?.type === 'lift' && preference === 'stair') weight += 5000;
      if (neighborNode?.type === 'stair' && preference === 'lift') weight += 5000;

      const alt = distances[currentNodeId] + weight;
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