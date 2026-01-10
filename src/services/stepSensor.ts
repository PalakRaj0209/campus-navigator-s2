import { Pedometer, Accelerometer } from 'expo-sensors';

let _subscription: any = null;
let _lastStepTime = 0; // ⏱️ Cooldown timer

export const initPedometer = async (
  onStep: (steps: number) => void
) => {
  // Clean up old listeners first
  if (_subscription) {
      _subscription.remove();
      _subscription = null;
  }

  console.log("🚀 Starting Sensor Service...");

  // 1. Try Pedometer First
  let useFallback = false;
  try {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (isAvailable) {
          const { status } = await Pedometer.requestPermissionsAsync();
          if (status === 'granted') {
             console.log("✅ Pedometer Active");
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
      useFallback = true;
  } catch (e) {
      useFallback = true;
  }

  // 2. Accelerometer Fallback (Crash-Proof Version)
  if (useFallback) {
      console.log("⚠️ Using Shake-to-Walk Fallback");
      
      // Update slower (200ms) to save CPU
      Accelerometer.setUpdateInterval(200); 

      _subscription = Accelerometer.addListener(({ x, y, z }) => {
          // Calculate total shake force (Gravity = 1.0)
          const totalForce = Math.sqrt(x * x + y * y + z * z);
          
          // Threshold: 1.3 is a firm shake/step
          if (totalForce > 1.3) {
              const now = Date.now();
              
              // 🛡️ CRASH PROTECTION: Only allow 1 step every 500ms
              if (now - _lastStepTime > 500) {
                  console.log("👟 Step Detected!"); 
                  onStep(1);
                  _lastStepTime = now;
              }
          }
      });
  }
};

export const stopPedometer = () => {
  if (_subscription) {
      _subscription.remove();
      _subscription = null;
  }
}
