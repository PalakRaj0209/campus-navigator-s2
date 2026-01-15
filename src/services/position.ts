import { useState, useEffect } from 'react';
import { Magnetometer } from 'expo-sensors';

export const useMagnetometer = () => {
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    let subscription: any;

    const subscribe = () => {
      subscription = Magnetometer.addListener(data => {
        // Convert magnetometer data to degrees (0-360)
        let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
        if (angle < 0) angle += 360;
        setHeading(Math.round(angle));
      });
      
      // Update rate for smooth arrow movement
      Magnetometer.setUpdateInterval(100);
    };

    subscribe();
    return () => subscription && subscription.remove();
  }, []);

  return heading;
};