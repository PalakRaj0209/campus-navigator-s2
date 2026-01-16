// src/services/stepSensor.ts
import { Pedometer, Accelerometer } from 'expo-sensors';

let _subscription: any = null;
let _lastStepTime = 0; 

export const initPedometer = async (onStep: (steps: number) => void) => {
  if (_subscription) {
      _subscription.remove();
      _subscription = null;
  }

  try {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (isAvailable) {
          const { status } = await Pedometer.requestPermissionsAsync();
          if (status === 'granted') {
             let startSteps = -1;
             _subscription = Pedometer.watchStepCount(result => {
                 if (startSteps === -1) startSteps = result.steps;
                 const diff = result.steps - startSteps;
                 if (diff > 0) {
                     onStep(diff);
                     startSteps = result.steps;
                 }
             });
             return; 
          } 
      }
  } catch (e) { console.log("Pedometer failed, using fallback..."); }

  Accelerometer.setUpdateInterval(200); 
  _subscription = Accelerometer.addListener(({ x, y, z }) => {
      const totalForce = Math.sqrt(x * x + y * y + z * z);
      if (totalForce > 1.3) {
          const now = Date.now();
          if (now - _lastStepTime > 500) { 
              onStep(1);
              _lastStepTime = now;
          }
      }
  });
};

export const stopPedometer = () => {
  if (_subscription) {
      _subscription.remove();
      _subscription = null;
  }
};