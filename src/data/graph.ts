// src/data/graph.ts

export interface GraphNode {
  id: string;
  x: number;
  y: number;
  floor: number;
}

/**
 * These values MUST match your SVG corridor & entrance.
 */
export const CORRIDOR_X = 250;

// Entrance/Starting points
export const ENTRANCE_Y_F0 = 840; // Main Entrance Ground Floor
export const STAIRS_Y_F1 = 835;   // Starting point if coming from stairs on Floor 1
export const ENTRANCE_Y_F1 = 840; // Alternate entrance for Floor 1

const localGraphNodes: GraphNode[] = [
    // FLOOR 0 (GROUND FLOOR)
    { id: 'f0_gents_toilet', x: 120, y: 70, floor: 0 },
    { id: 'f0_hod_1', x: 120, y: 150, floor: 0 },
    { id: 'f0_hod_2', x: 120, y: 195, floor: 0 },
    { id: 'f0_hod_3', x: 120, y: 240, floor: 0 },
    { id: 'f0_hod_4', x: 120, y: 285, floor: 0 },
    { id: 'f0_principal', x: 120, y: 360, floor: 0 },
    { id: 'f0_store_2', x: 120, y: 430, floor: 0 },
    { id: 'f0_store_1', x: 120, y: 470, floor: 0 },
    { id: 'f0_store_big', x: 120, y: 560, floor: 0 },
    { id: 'f0_animal_house', x: 120, y: 700, floor: 0 },
    { id: 'f0_ladies_toilet', x: 120, y: 825, floor: 0 },
    { id: 'f0_stairs_top', x: 320, y: 70, floor: 0 },
    { id: 'f0_instrument_room', x: 320, y: 200, floor: 0 },
    { id: 'f0_main_office', x: 320, y: 340, floor: 0 },
    { id: 'f0_lifts', x: 320, y: 445, floor: 0 },
    { id: 'f0_model_pharmacy', x: 320, y: 555, floor: 0 },
    { id: 'f0_machine_room', x: 320, y: 700, floor: 0 },
    { id: 'f0_stairs_bottom', x: 320, y: 825, floor: 0 },

    // FLOOR 1 (FIRST FLOOR)
    { id: 'f1_gents_toilet', x: 120, y: 70, floor: 1 },
    { id: 'f1_classroom_7', x: 120, y: 200, floor: 1 },
    { id: 'f1_classroom_6', x: 120, y: 350, floor: 1 },
    { id: 'f1_store', x: 120, y: 455, floor: 1 },
    { id: 'f1_classroom_5', x: 120, y: 540, floor: 1 },
    { id: 'f1_girls_common', x: 120, y: 670, floor: 1 },
    { id: 'f1_ladies_toilet', x: 120, y: 805, floor: 1 },
    { id: 'f1_stairs_top', x: 320, y: 70, floor: 1 },
    { id: 'f1_classroom_1', x: 320, y: 200, floor: 1 },
    { id: 'f1_classroom_2', x: 320, y: 350, floor: 1 },
    { id: 'f1_lifts', x: 320, y: 465, floor: 1 },
    { id: 'f1_classroom_3', x: 320, y: 580, floor: 1 },
    { id: 'f1_classroom_4', x: 320, y: 720, floor: 1 },
    { id: 'f1_stairs_bottom', x: 320, y: 835, floor: 1 }
];

export const campusGraph: { nodes: GraphNode[] } = {
  nodes: localGraphNodes,
};

export const getLocalGraphNodes = () => localGraphNodes;

export const setRemoteGraphNodes = (nodes: GraphNode[]) => {
  if (!nodes.length) return;
  campusGraph.nodes = nodes;
};
