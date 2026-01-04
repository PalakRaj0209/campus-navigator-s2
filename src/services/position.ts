import { useAppStore } from '../stores/appStore';

interface Position {
  x: number;
  y: number;
  floor: number;
}

let currentPos: Position = { x: 5, y: 5, floor: 1 };

export const updatePosition = (accelData: any, steps: number) => {
  // Simple: Move based on steps + shake direction
  currentPos.x += Math.sin(steps * 0.1) * 0.5;
  currentPos.y += Math.cos(steps * 0.1) * 0.5;
  
  const store = useAppStore.getState();
  store.setPosition(currentPos);
  
  console.log('POSITION:', currentPos);
};

export const getPosition = () => currentPos;
