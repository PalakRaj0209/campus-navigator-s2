// src/services/stepCounter.ts
import { Accelerometer } from 'expo-sensors';
import { useAppStore } from '../stores/appStore';

let stepCount = 0;
let prevZ = 0;

export const startStepCounter = (callback: (steps: number) => void) => {
  // Sets the speed of the IMU sensor updates
  Accelerometer.setUpdateInterval(100);

  const subscription = Accelerometer.addListener(({ z }) => {
    // Your winning threshold logic from Day 1
    if (z > 1.2 && prevZ < 0.8) {
      stepCount++;
      callback(stepCount);
      
      // Instantly update the global position in Zustand
      const store = useAppStore.getState();
      const currentPos = store.position;
      
      // Move the dot forward on the SVG map (adjust values as needed)
      store.setPosition({ 
        x: currentPos.x, 
        y: currentPos.y - 5, // Moves "up" the corridor
        floor: currentPos.floor 
      });
    }
    prevZ = z;
  });

  return () => subscription.remove();
};