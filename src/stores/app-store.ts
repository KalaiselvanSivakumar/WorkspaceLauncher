import { AppStateData, WorkspaceConfig } from "@/types/models";
import { invoke } from "@tauri-apps/api/core";
import { create } from "zustand";

interface AppStoreState {
  isLoading: boolean;
  data: AppStateData;
  error: string | null;
}

type AppStoreActions = {
  loadData: () => Promise<void>;

  updateData: (workspace: WorkspaceConfig) => void;
};

type AppState = AppStoreState & AppStoreActions;

export const useAppStore = create<AppState>((set, get) => ({
  isLoading: true,
  data: { app_version: "", data: [] },
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

  updateData: (workspace) => {
    const state = get();

    if (state.isLoading || state.error) {
      return;
    }
    const workspaces = state.data.data;
    const exists = workspaces.some(
      (workspaceConfig) => workspaceConfig.id === workspace.id,
    );
    const updatedWorkspaces: WorkspaceConfig[] = exists
      ? workspaces.map((workspaceConfig) =>
          workspaceConfig.id === workspace.id ? workspace : workspaceConfig,
        )
      : [...workspaces, workspace];
    console.log("Updating data in store");
    set({ data: { ...state.data, data: updatedWorkspaces } });
  },
}));
