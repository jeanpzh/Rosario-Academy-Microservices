import { create } from "zustand";

interface AssistantStore {
  currentItem: any | null;
  setCurrentItem: (item: any) => void;
}

export const useAssistantStore = create<AssistantStore>((set) => ({
  currentItem: null,
  setCurrentItem: (item) => set({ currentItem: item }),
}));
