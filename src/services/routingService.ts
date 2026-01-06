import { graph, Node } from '../data/graph';

export const findRoute = (startId: string, targetId: string): string[] => {
  // Simple BFS (Breadth First Search) for shortest path
  const queue: { node: string; path: string[] }[] = [{ node: startId, path: [startId] }];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const { node, path } = queue.shift()!;
    
    if (node === targetId) return path;
    if (visited.has(node)) continue;
    visited.add(node);

    const currentNode = graph.find(n => n.id === node);
    currentNode?.connections.forEach(neighbor => {
      queue.push({ node: neighbor, path: [...path, neighbor] });
    });
  }

  return []; // No path found
};

// Test function
export const getRouteToDean = (): string[] => {
  return findRoute('n1', 'room101'); // Entrance → Dr. Aris Office
};
