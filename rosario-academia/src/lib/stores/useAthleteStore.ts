import { create } from "zustand";

interface AthleteStore {
  currentItem: any | null;
  setCurrentItem: (item: any) => void;
}

export const useAthleteModalStore = create<AthleteStore>((set) => ({
  currentItem: null,
  setCurrentItem: (item) => set({ currentItem: item }),
}));

