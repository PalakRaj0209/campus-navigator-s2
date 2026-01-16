import { campusGraph, CORRIDOR_X } from '../data/graph';

export const getRoutePoints = (
  startX: number,
  startY: number,
  targetNodeId: string
): string => {
  const target = campusGraph.nodes.find(n => n.id === targetNodeId);
  if (!target) return '';

  return [
    `${startX},${startY}`,
    `${CORRIDOR_X},${startY}`,
    `${CORRIDOR_X},${target.y}`,
    `${target.x},${target.y}`
  ].join(' ');
};

// ✅ Updated return type to include isTurningPoint
export const getPositionAtDistance = (
  route: string, 
  distance: number
): { x: number; y: number; isFinished: boolean; isTurningPoint: boolean } => {
  const points = route.split(' ').map(p => {
    const [x, y] = p.split(',').map(Number);
    return { x, y };
  });

  if (points.length < 1) return { x: 0, y: 0, isFinished: true, isTurningPoint: false };
  if (points.length < 2) return { ...points[0], isFinished: true, isTurningPoint: false };

  let remaining = distance;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const segmentDist = Math.hypot(b.x - a.x, b.y - a.y);

    if (remaining <= segmentDist) {
      const t = remaining / segmentDist;
      
      // ✅ Detect if we are near the end of a corridor segment
      const isTurningPoint = (segmentDist - remaining) < 15 && i < points.length - 2;

      return {
        x: a.x + t * (b.x - a.x),
        y: a.y + t * (b.y - a.y),
        isFinished: false,
        isTurningPoint: i == 1 // ✅ Now officially allowed
      };
    }
    remaining -= segmentDist;
  }
  return { x: points[points.length-1].x, y: points[points.length-1].y, isFinished: true, isTurningPoint: false };
};