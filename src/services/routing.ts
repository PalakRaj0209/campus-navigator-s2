import { campusGraph, CORRIDOR_X } from '../data/graph';

export const getRoutePoints = (
  startNodeId: string,
  targetNodeId: string
): string => {
  const start = campusGraph.nodes.find(n => n.id === startNodeId);
  const target = campusGraph.nodes.find(n => n.id === targetNodeId);

  if (!start || !target) return '';

  return [
    `${start.x},${start.y}`,          // entrance
    `${CORRIDOR_X},${target.y}`,      // straight corridor
    `${target.x},${target.y}`         // into room
  ].join(' ');
};

/**
 * Move forward ONLY along the polyline
 */
export const moveAlongRoute = (
  step: number,
  route: string,
  progress: number
) => {
  const points = route.split(' ').map(p => {
    const [x, y] = p.split(',').map(Number);
    return { x, y };
  });

  if (points.length < 2) {
    return { x: 0, y: 0, progress };
  }

  let remaining = step;

  for (let i = progress; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const dist = Math.hypot(b.x - a.x, b.y - a.y);

    if (remaining <= dist) {
      const t = remaining / dist;
      return {
        x: a.x + t * (b.x - a.x),
        y: a.y + t * (b.y - a.y),
        progress: i
      };
    }

    remaining -= dist;
  }

  return {
    x: points[points.length - 1].x,
    y: points[points.length - 1].y,
    progress: points.length - 1
  };
};
