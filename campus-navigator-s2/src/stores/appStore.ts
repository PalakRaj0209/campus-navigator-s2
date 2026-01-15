import { create } from 'zustand';

interface AppState {
  building: string;
  currentFloor: number;
  position: { x: number; y: number; floor: number };
  setBuilding: (building: string) => void;
  setPosition: (pos: { x: number; y: number; floor: number }) => void;
}

export const useAppStore = create<AppState>((set) => ({
  building: 'Pharmacy Block',
  currentFloor: 0,
  position: { x: 250, y: 770, floor: 0 }, // Starting at Entrance
  setBuilding: (building) => set({ building }),
  setPosition: (pos) => set({ position: pos, currentFloor: pos.floor }),
}));