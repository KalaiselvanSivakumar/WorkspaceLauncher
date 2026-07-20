import { create } from "zustand";

type Screen =
  | { type: "home" }
  | { type: "create" }
  | { type: "edit"; configId: string };

interface UIStoreState {
  screen: Screen;
}

interface UIStoreActions {
  showHome(): void;
  showCreate(): void;
  showEdit(configId: string): void;
}

type UIState = UIStoreState & UIStoreActions;

export const useUIStore = create<UIState>((set) => ({
  screen: { type: "home" },

  showHome: () => set({ screen: { type: "home" } }),
  showCreate: () => set({ screen: { type: "create" } }),
  showEdit: (configId: string) => set({ screen: { type: "edit", configId } }),
}));
