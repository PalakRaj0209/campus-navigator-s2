import { Accelerometer } from 'expo-sensors';

let stepCount = 0;
let lastUpdate = 0;

// ✅ Named export - matches your import in FloorMapScreen
export const startStepCounter = (callback: (steps: number) => void) => {
  Accelerometer.setUpdateInterval(100);
  
  // @ts-ignore - Expo sensor event type
  const subscription = Accelerometer.addListener(({ x, y, z }) => {
    // Calculate total acceleration force
    const totalForce = Math.sqrt(x * x + y * y + z * z);
    
    // Step threshold (tune if needed)
    if (totalForce > 1.2) {
      const now = Date.now();
      
      // Debounce to prevent multiple triggers per step
      if (now - lastUpdate > 500) {
        stepCount++;
        lastUpdate = now;
        callback(stepCount);
        
        console.log('✅ STEP DETECTED:', stepCount);
      }
    }
  });
  
  // Cleanup function
  return () => {
    subscription.remove();
  };
};

// Reset function (for testing)
export const resetSteps = () => {
  stepCount = 0;
};

// Get current count (for debugging)
export const getSteps = () => stepCount;
