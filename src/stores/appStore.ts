import { create } from 'zustand';

interface AppState {
  building: string;
  currentFloor: number;
  position: { x: number; y: number; floor: number };
  route: Array<{ instruction: string; distance: number }>;
  setBuilding: (building: string) => void;
  setPosition: (pos: { x: number; y: number; floor: number }) => void;
  setRoute: (route: Array<{ instruction: string; distance: number }>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  building: '',
  currentFloor: 1,
  position: { x: 0, y: 0, floor: 1 },
  route: [],
  setBuilding: (building) => set({ building }),
  setPosition: (pos) => set({ position: pos, currentFloor: pos.floor }),
  setRoute: (route) => set({ route }),
}));
