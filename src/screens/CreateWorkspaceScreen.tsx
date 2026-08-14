import WorkspaceForm from "@/components/app/workspace/configure/WorkspaceForm";
import { useUIStore } from "@/stores/ui-store";
import { CreateWorkspacePayload, WorkspaceConfig } from "@/types/models";
import { invoke } from "@tauri-apps/api/core";

async function onSubmit(data: CreateWorkspacePayload) {
  const response: WorkspaceConfig = await invoke("create_workspace", {
    payload: data,
  });
  return response;
}

function CreateWorkspaceScreen() {
  const showConfigure = useUIStore((state) => state.showConfigure);

  function onCancelRedirection(workspaceId: WorkspaceConfig["id"]) {
    console.log("Create wizard success cancelling...");
    showConfigure(workspaceId);
  }

  return (
    <WorkspaceForm
      text={{
        pageTitle: "Create Workspace",
        primaryActionText: "Create",
        pageDescription: "Configure launchers and paths for your workspace.",
        submittingFormText: "Creating workspace...",
      }}
      isCreate={true}
      onSubmit={onSubmit}
      onCancelRedirection={onCancelRedirection}
    />
  );
}

export default CreateWorkspaceScreen;
