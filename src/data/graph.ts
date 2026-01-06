export interface Node {
  id: string;
  x: number;
  y: number;
  floor: number;
  connections: string[]; // Connected node IDs
}

export const graph: Node[] = [
  // Hallway Nodes (Walkable path)
  { id: 'n1', x: 0, y: 0, floor: 1, connections: ['n2'] },
  { id: 'n2', x: 2, y: 0, floor: 1, connections: ['n1', 'n3', 'room101'] },
  { id: 'n3', x: 4, y: 0, floor: 1, connections: ['n2', 'stairs_up'] },

  // Destination Nodes (Rooms)
  { id: 'room101', x: 2, y: 1, floor: 1, connections: ['n2'] }, // Admin Block Room 101

  // Connectors
  { id: 'stairs_up', x: 4, y: 1, floor: 1, connections: ['n3'] }
];
