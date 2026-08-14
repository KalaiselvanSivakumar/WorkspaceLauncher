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
