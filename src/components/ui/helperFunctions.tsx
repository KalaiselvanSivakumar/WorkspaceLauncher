import { toast } from "sonner";
import RedirectToast, { RedirectToastConfig } from "./RedirectToast";

export function showRedirectSuccessToast(config: RedirectToastConfig) {
  return toast.custom((id) => <RedirectToast toastId={id} {...config} />, {
    duration: Infinity,
  });
}

export function getWorkspaceCardId(workspaceId: string) {
  return `workspace-card-${workspaceId}`;
}

function findWorkspaceCardElement(workspaceId: string): HTMLElement | null {
  return document.getElementById(getWorkspaceCardId(workspaceId));
}

export function navigateToHomeAndScrollToWorkspace(workspaceId: string): void {
  requestAnimationFrame(() => {
    setTimeout(() => {
      const targetElement = findWorkspaceCardElement(workspaceId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      } else {
        console.warn(
          `[WorkspaceScrollNavigation] Workspace entry with ID "${workspaceId}" not found in DOM.`,
        );
      }
    }, 50); // Short delay allows React layout paint to complete
  });
}
