import { create } from "zustand";

export type EditScreen = { type: "edit"; launcherName: string };

type Screen = { type: "home" } | { type: "create" } | EditScreen;

interface UIStoreState {
  screen: Screen;
}

interface UIStoreActions {
  showHome(): void;
  showCreate(): void;
  showEdit(launcherName: string): void;
}

type UIState = UIStoreState & UIStoreActions;

export const useUIStore = create<UIState>((set) => ({
  screen: { type: "home" },

  showHome: () => set({ screen: { type: "home" } }),
  showCreate: () => set({ screen: { type: "create" } }),
  showEdit: (launcherName: string) =>
    set({ screen: { type: "edit", launcherName } }),
}));
