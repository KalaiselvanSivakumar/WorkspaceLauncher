import WorkspaceForm, {
  WorkspaceFormData,
} from "@/components/app/workspace/configure/WorkspaceForm";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/app-store";
import { ConfigureScreen, useUIStore } from "@/stores/ui-store";
import { invoke } from "@tauri-apps/api/core";
import { Trash2 } from "lucide-react";
import { useState } from "react";

function ConfigureWorkspaceScreen() {
  const screen = useUIStore((state) => state.screen) as ConfigureScreen;
  const appData = useAppStore((state) => state.data.data);

  const clonedWorkspaceConfig = structuredClone(
    appData?.find((workspace) => workspace.id === screen.id),
  );

  const [isDeleting, setIsDeleting] = useState(false);

  async function onSubmit(data: WorkspaceFormData) {
    await invoke("update_workspace", { payload: data });
  }

  async function handleDeleteWorkspace() {
    setIsDeleting(true);
    try {
      await invoke("delete_workspace", {
        workspaceId: clonedWorkspaceConfig?.id,
      });
    } catch (err) {
      console.error("Failed to delete workspace:", err);
      // TODO: Show failure toast message or dialog
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <WorkspaceForm
      text={{
        pageTitle: `Configure "${clonedWorkspaceConfig?.name ?? "NAME MISSING"}" Workspace`,
        pageDescription: "Modify your launcher configurations.",
        primaryActionText: "Update",
        submittingFormText: "Updating...",
      }}
      initialData={clonedWorkspaceConfig}
      onSubmit={onSubmit}
      additionalActions={
        <Button
          type="button"
          variant="destructive"
          disabled={isDeleting}
          onClick={handleDeleteWorkspace}
        >
          <Trash2 /> {isDeleting ? "Deleting..." : "Delete Workspace"}
        </Button>
      }
    />
  );
}

export default ConfigureWorkspaceScreen;
