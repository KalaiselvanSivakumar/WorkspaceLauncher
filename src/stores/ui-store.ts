import { create } from "zustand";

export type ConfigureScreen = { type: "configure"; id: string };

export type Screen = { type: "home" } | { type: "create" } | ConfigureScreen;

interface UIStoreState {
  screen: Screen;
}

interface UIStoreActions {
  showHome(): void;
  showCreate(): void;
  showConfigure(id: string): void;
}

type UIState = UIStoreState & UIStoreActions;

export const useUIStore = create<UIState>((set) => ({
  screen: { type: "home" },

  showHome: () => set({ screen: { type: "home" } }),
  showCreate: () => set({ screen: { type: "create" } }),
  showConfigure: (id: string) => set({ screen: { type: "configure", id } }),
}));
