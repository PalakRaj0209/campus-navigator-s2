import { campusGraph, Node } from '../data/graph';

const METERS_PER_STEP = 1.5; // Increased stride for demo visibility
const PIXELS_PER_METER = 5; 

export interface Position {
  x: number;
  y: number;
  floor: number;
  heading: number;
  nodeId?: string;
}

const getDistance = (n1: Node, n2: Node) => {
  return Math.sqrt(Math.pow(n2.x - n1.x, 2) + Math.pow(n2.y - n1.y, 2));
};

export const calculateProgressAlongPath = (
  currentPos: Position,
  pathNodeIds: string[],
  stepsTaken: number
): Position => {
  
  // 1. Validation
  if (!pathNodeIds || pathNodeIds.length < 2) {
      console.log("❌ Engine: No path to follow");
      return currentPos;
  }

  // 2. Initialize Starting Node if missing
  let lastNodeId = currentPos.nodeId;
  if (!lastNodeId) {
      lastNodeId = pathNodeIds[0]; // Snap to start
      console.log("⚠️ Engine: Snapped to start node", lastNodeId);
  }

  // 3. Find where we are in the list
  let currentIndex = pathNodeIds.indexOf(lastNodeId);
  if (currentIndex === -1) {
      // User wandered off path? Snap to nearest node in path
      // For now, just reset to start to keep it simple
      currentIndex = 0;
      lastNodeId = pathNodeIds[0];
  }

  // If we are at the very end, stop.
  if (currentIndex >= pathNodeIds.length - 1) {
      console.log("✅ Engine: Reached Destination!");
      return currentPos;
  }

  // 4. Calculate Movement
  let pixelsToTravel = stepsTaken * METERS_PER_STEP * PIXELS_PER_METER;
  
  let newX = currentPos.x;
  let newY = currentPos.y;
  let newFloor = currentPos.floor;
  let nextNodeId = pathNodeIds[currentIndex + 1]; // Target node

  // Get current segment details
  const startNode = campusGraph.nodes.find(n => n.id === lastNodeId)!;
  const targetNode = campusGraph.nodes.find(n => n.id === nextNodeId)!;

  // Handle Floor Change (Instant Teleport)
  if (startNode.floor !== targetNode.floor) {
      console.log("🔼 Engine: Switching Floor");
      return { ...currentPos, x: targetNode.x, y: targetNode.y, floor: targetNode.floor, nodeId: targetNode.id };
  }

  // Distance to next node
  const distToTarget = Math.sqrt(Math.pow(targetNode.x - newX, 2) + Math.pow(targetNode.y - newY, 2));

  // MOVE!
  if (pixelsToTravel >= distToTarget) {
      // We overshoot the target -> Snap to it and update ID
      console.log(`➡️ Engine: Arrived at ${targetNode.id}`);
      return { 
          x: targetNode.x, 
          y: targetNode.y, 
          floor: targetNode.floor, 
          heading: currentPos.heading, 
          nodeId: targetNode.id 
      };
  } else {
      // We move partially towards target
      const ratio = pixelsToTravel / distToTarget;
      newX = newX + (targetNode.x - newX) * ratio;
      newY = newY + (targetNode.y - newY) * ratio;
      
      console.log(`walking... ${pixelsToTravel.toFixed(1)}px towards ${targetNode.id}`);
      
      return { 
          x: newX, 
          y: newY, 
          floor: currentPos.floor, 
          heading: currentPos.heading, 
          nodeId: lastNodeId // ID stays same until we fully reach the next node
      };
  }
};
