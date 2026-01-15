export type NodeType = 'corridor' | 'stair' | 'lift' | 'room';

export interface Node {
  id: string;
  x: number;
  y: number;
  floor: number;
  type: NodeType;
  label?: string;
}

export interface Edge {
  from: string;
  to: string;
  weight: number;
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

// --- Helper to create bidirectional edges ---
const createEdge = (id1: string, id2: string, weight: number) => [
  { from: id1, to: id2, weight },
  { from: id2, to: id1, weight }
];

export const campusGraph: GraphData = {
  nodes: [
    // ================= FLOOR 0 (Ground) =================
    { id: 'f0_entry', x: 200, y: 550, floor: 0, type: 'corridor' },
    { id: 'f0_c1', x: 200, y: 400, floor: 0, type: 'corridor' },
    { id: 'f0_c2', x: 200, y: 200, floor: 0, type: 'corridor' },
    { id: 'f0_stairs', x: 350, y: 300, floor: 0, type: 'stair', label: 'Stairs Up' },
    
    // Rooms
    { id: 'f0_dir', x: 100, y: 200, floor: 0, type: 'room', label: 'Director' },
    { id: 'f0_r002', x: 300, y: 200, floor: 0, type: 'room', label: 'Dean Acad' },
    { id: 'f0_sec', x: 100, y: 400, floor: 0, type: 'room', label: 'Security' },

    // ================= FLOOR 1 (CSE) =================
    { id: 'f1_stairs', x: 350, y: 300, floor: 1, type: 'stair', label: 'Stairs' },
    { id: 'f1_c1', x: 200, y: 300, floor: 1, type: 'corridor' },
    { id: 'f1_c2', x: 200, y: 150, floor: 1, type: 'corridor' },

    // Rooms
    { id: 'f1_r101', x: 100, y: 300, floor: 1, type: 'room', label: 'HOD CSE' },
    { id: 'f1_lab1', x: 100, y: 150, floor: 1, type: 'room', label: 'AI Lab' },
    { id: 'f1_r102', x: 300, y: 150, floor: 1, type: 'room', label: 'Prof. Anjali' },

    // ================= FLOOR 2 (EEE) =================
    { id: 'f2_stairs', x: 350, y: 300, floor: 2, type: 'stair', label: 'Stairs' },
    { id: 'f2_c1', x: 200, y: 300, floor: 2, type: 'corridor' },
    { id: 'f2_c2', x: 200, y: 100, floor: 2, type: 'corridor' },

    // Rooms
    { id: 'f2_r201', x: 100, y: 300, floor: 2, type: 'room', label: 'HOD EEE' },
    { id: 'f2_conf', x: 100, y: 100, floor: 2, type: 'room', label: 'Conf Hall' },

    // ================= FLOOR 3 (Library) =================
    { id: 'f3_stairs', x: 350, y: 300, floor: 3, type: 'stair', label: 'Stairs Down' },
    { id: 'f3_c1', x: 200, y: 300, floor: 3, type: 'corridor' },
    { id: 'f3_lib_main', x: 200, y: 150, floor: 3, type: 'room', label: 'Library' },
    { id: 'f3_cafe', x: 100, y: 300, floor: 3, type: 'room', label: 'Cafeteria' },
  ],

  edges: [
    // --- Floor 0 Connections ---
    ...createEdge('f0_entry', 'f0_c1', 15),
    ...createEdge('f0_c1', 'f0_c2', 20),
    ...createEdge('f0_c1', 'f0_sec', 10),
    ...createEdge('f0_c2', 'f0_dir', 10),
    ...createEdge('f0_c2', 'f0_r002', 10),
    ...createEdge('f0_c1', 'f0_stairs', 30), // Path to stairs

    // --- Floor 1 Connections ---
    ...createEdge('f1_stairs', 'f1_c1', 15),
    ...createEdge('f1_c1', 'f1_r101', 10),
    ...createEdge('f1_c1', 'f1_c2', 15),
    ...createEdge('f1_c2', 'f1_lab1', 10),
    ...createEdge('f1_c2', 'f1_r102', 10),

    // --- Floor 2 Connections ---
    ...createEdge('f2_stairs', 'f2_c1', 15),
    ...createEdge('f2_c1', 'f2_r201', 10),
    ...createEdge('f2_c1', 'f2_c2', 20),
    ...createEdge('f2_c2', 'f2_conf', 10),

    // --- Floor 3 Connections ---
    ...createEdge('f3_stairs', 'f3_c1', 15),
    ...createEdge('f3_c1', 'f3_cafe', 10),
    ...createEdge('f3_c1', 'f3_lib_main', 20),

    // === STAIR CONNECTORS (Vertical Travel) ===
    // This allows the algorithm to move between floors
    ...createEdge('f0_stairs', 'f1_stairs', 50),
    ...createEdge('f1_stairs', 'f2_stairs', 50),
    ...createEdge('f2_stairs', 'f3_stairs', 50),
  ]
};
