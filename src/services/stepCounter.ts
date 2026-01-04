import { useAppStore } from '../stores/appStore';
import { Accelerometer } from 'expo-sensors';

let stepCount = 0;
let prevZ = 0;

export const startStepCounter = (callback: (steps: number) => void) => {
  Accelerometer.setUpdateInterval(100);
  Accelerometer.addListener(({ z }) => {
    if (z > 1.2 && prevZ < 0.8) {
      stepCount++;
      callback(stepCount);
      
      // Position update here:
      const store = useAppStore.getState();
      store.setPosition({ x: stepCount * 0.5, y: stepCount * 0.3, floor: 1 });
      console.log('POSITION:', stepCount * 0.5, stepCount * 0.3);
    }
    prevZ = z;
  });
};
