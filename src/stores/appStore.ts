import { create } from 'zustand';

interface AppState {
  building: string;
  currentFloor: number;
  position: { x: number; y: number; floor: number };
  // ✅ Change route to store the node IDs from Dijkstra
  activePath: string[]; 
  setBuilding: (building: string) => void;
  setPosition: (pos: { x: number; y: number; floor: number }) => void;
  // ✅ Update this function
  setActivePath: (path: string[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  building: '',
  currentFloor: 1,
  position: { x: 200, y: 500, floor: 0 },
  activePath: [], // Start with no path
  setBuilding: (building) => set({ building }),
  setPosition: (pos) => set({ position: pos, currentFloor: pos.floor }),
  setActivePath: (path) => set({ activePath: path }),
}));