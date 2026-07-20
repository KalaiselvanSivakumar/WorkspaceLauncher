import { AppStateData } from "@/types/models";
import { invoke } from "@tauri-apps/api/core";
import { create } from "zustand";

interface AppStoreState {
  isLoading: boolean;
  data: AppStateData;
  error: string | null;
}

type AppStoreActions = {
  loadData: () => Promise<void>;
};

type AppState = AppStoreState & AppStoreActions;

export const useAppStore = create<AppState>((set) => ({
  isLoading: true,
  data: { data: [] },
  error: null,

  loadData: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await invoke<AppStateData>("get_application_data");
      set({ data, isLoading: false });
    } catch (error) {
      console.error("Error fetching application data:", error);
      set({ error: String(error), isLoading: false });
    }
  },
}));
