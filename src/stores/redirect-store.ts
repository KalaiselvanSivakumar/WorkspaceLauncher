import { create } from "zustand";

interface RedirectStoreState {
  isRedirecting: boolean;
  redirectContext: string | null;
}

interface RedirectStoreActions {
  startRedirect: (context?: string) => void;
  clearRedirect: () => void;
}

type RedirectState = RedirectStoreState & RedirectStoreActions;

export const useRedirectStore = create<RedirectState>((set) => ({
  isRedirecting: false,
  redirectContext: null,

  startRedirect: (context) =>
    set({
      isRedirecting: true,
      redirectContext: context || null,
    }),

  clearRedirect: () =>
    set({
      isRedirecting: false,
      redirectContext: null,
    }),
}));
