// src/services/routing.ts
import { campusGraph, Node } from '../data/graph';

export function findShortestPath(startNodeId: string, endNodeId: string): Node[] {
  const nodes = campusGraph.nodes;
  const edges = campusGraph.edges;

  const distances: { [key: string]: number } = {};
  const previous: { [key: string]: string | null } = {};
  const queue: string[] = [];

  nodes.forEach(node => {
    distances[node.id] = node.id === startNodeId ? 0 : Infinity;
    previous[node.id] = null;
    queue.push(node.id);
  });

  while (queue.length > 0) {
    queue.sort((a, b) => distances[a] - distances[b]);
    const u = queue.shift()!;

    if (u === endNodeId) break;

    const neighbors = edges.filter(e => e.from === u || e.to === u);
    neighbors.forEach(edge => {
      const v = edge.from === u ? edge.to : edge.from;
      if (!queue.includes(v)) return;

      const alt = distances[u] + edge.weight;
      if (alt < distances[v]) {
        distances[v] = alt;
        previous[v] = u;
      }
    });
  }

  const path: Node[] = [];
  let curr: string | null = endNodeId;
  while (curr) {
    const node = nodes.find(n => n.id === curr);
    if (node) path.unshift(node);
    curr = previous[curr];
  }

  return path;
}