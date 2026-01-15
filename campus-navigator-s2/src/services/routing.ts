// src/services/routing.ts

export const getRoutePoints = (nodeId: string): string => {
  const corridorX = 250; // Center of the yellow corridor
  const entranceY = 850; // Updated to your bottom entrance coordinate
  
  const roomCoords: { [key: string]: { x: number, y: number } } = {
    // --- GROUND FLOOR (Floor 0) ---
    "f0_principal": { x: 140, y: 375 },
    "f0_hod1": { x: 155, y: 150 },
    "f0_hod2": { x: 155, y: 195 },
    "f0_hod3": { x: 155, y: 240 },
    "f0_hod4": { x: 155, y: 285 },
    "f0_office": { x: 360, y: 305 },
    "f0_machine": { x: 360, y: 640 },
    "f0_model_pharm": { x: 360, y: 500 },
    "f0_instrumental": { x: 360, y: 180 },
    "f0_lifts": { x: 345, y: 400 },

    // --- 1st FLOOR ---
    "f1_class1": { x: 365, y: 195 },
    "f1_class2": { x: 365, y: 295 },
    "f1_class3": { x: 365, y: 530 },
    "f1_class4": { x: 365, y: 680 },
    "f1_girls_common": { x: 130, y: 670 },
    "f1_boys_common": { x: 130, y: 530 },

    // --- 2nd FLOOR ---
    "f2_library": { x: 370, y: 610 },
    "f2_computer": { x: 365, y: 200 },
    "f2_faculty": { x: 135, y: 310 },

    // --- 3rd FLOOR ---
    "f3_pceutics3": { x: 135, y: 205 },
    "f3_pchem1": { x: 135, y: 480 },
    "f3_analysis": { x: 365, y: 220 },
    "f3_pcology1": { x: 365, y: 610 },
  };

  const target = roomCoords[nodeId];
  
  if (target) {
    // Generates: Entrance -> Pivot point -> Room center
    return `${corridorX},${entranceY} ${corridorX},${target.y} ${target.x},${target.y}`;
  }

  return `${corridorX},${entranceY} ${corridorX},100`;
};

/**
 * NEW: Path Snapping Logic
 * Forces the blue arrow to stay on the route points
 */
export const getClosestPointOnPath = (userX: number, userY: number, nodeId: string) => {
  const corridorX = 250;
  const pathString = getRoutePoints(nodeId);
  const points = pathString.split(' ').map(p => {
    const [px, py] = p.split(',').map(Number);
    return { x: px, y: py };
  });

  // The 'Turn Point' is always the second point in your path
  const turnPoint = points[1]; 
  const endPoint = points[2];

  // Logic: If user is still below the turn point, lock them to the corridor
  if (userY > turnPoint.y) {
    return { x: corridorX, y: userY };
  } 
  
  // Logic: Once they reach or pass the turn point, lock them to the horizontal path
  if (endPoint) {
    return { x: userX, y: turnPoint.y };
  }

  return { x: corridorX, y: userY };
};