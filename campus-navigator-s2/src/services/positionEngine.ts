import beaconRegistry from '../../assets/beacons.json';

export interface BeaconObservation {
  key: string;    // "uuid:major:minor"
  rssi: number;   // Signal strength
  timestamp: number;
}

export interface CalculatedPosition {
  x: number;
  y: number;
  floor: number;
  confidence: number;
}

/**
 * Computes a weighted centroid based on beacon signal strengths.
 */
export const calculateWeightedPosition = (
  observations: BeaconObservation[]
): CalculatedPosition | null => {
  if (observations.length === 0) return null;

  let totalWeight = 0;
  let weightedX = 0;
  let weightedY = 0;
  const floorWeights: Record<number, number> = {};

  observations.forEach((obs) => {
    const beacon = beaconRegistry.find((b) => b.key === obs.key);
    if (!beacon) return;

    // weight = 1 / (abs(rssi) ^ 2)
    const weight = 1 / Math.pow(Math.abs(obs.rssi), 2);
    
    weightedX += beacon.x * weight;
    weightedY += beacon.y * weight;
    totalWeight += weight;

    floorWeights[beacon.floorId] = (floorWeights[beacon.floorId] || 0) + weight;
  });

  if (totalWeight === 0) return null;

  const bestFloor = Object.keys(floorWeights).reduce((a, b) => 
    floorWeights[Number(a)] > floorWeights[Number(b)] ? a : b
  );

  return {
    x: weightedX / totalWeight,
    y: weightedY / totalWeight,
    floor: Number(bestFloor),
    confidence: Math.min(1, totalWeight * 10000)
  };
};