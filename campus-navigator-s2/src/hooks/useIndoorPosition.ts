import { useCallback } from 'react';
import { useAppStore } from '../stores/appStore';
import { BeaconObservation, calculateWeightedPosition } from '../services/positionEngine';
import { positionSmoother } from '../positioning/smoother';

export const useIndoorPosition = () => {
  const { setPosition } = useAppStore();

  /**
   * Function to feed new beacon data into the system.
   * This will be called by your BLE scanner or simulation logic.
   */
  const updateObservations = useCallback((newObs: BeaconObservation[]) => {
    // 1. Calculate the raw position from the beacons
    const rawPos = calculateWeightedPosition(newObs);

    if (rawPos) {
      // 2. Smooth the movement to prevent jumping
      const smoothed = positionSmoother.smooth(rawPos);

      // 3. Update the global blue dot position in the Zustand store
      // This will automatically move the arrow on the FloorMapScreen
      setPosition({
        x: smoothed.x,
        y: smoothed.y,
        floor: smoothed.floor
      });
    }
  }, [setPosition]);

  return {
    updateObservations
  };
};