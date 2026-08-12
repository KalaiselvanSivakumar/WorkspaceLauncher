import WorkspaceForm from "@/components/app/workspace/configure/WorkspaceForm";
import { CreateWorkspacePayload } from "@/types/models";
import { invoke } from "@tauri-apps/api/core";

function CreateWorkspaceScreen() {
  async function onSubmit(data: CreateWorkspacePayload) {
    await invoke("create_workspace", { payload: data });
    // TODO: Return back to home screen, show success message toast, scroll to newly created workspace
  }

  return (
    <WorkspaceForm
      text={{
        pageTitle: "Create Workspace",
        primaryActionText: "Create",
        pageDescription: "Configure launchers and paths for your workspace.",
        submittingFormText: "Creating workspace...",
      }}
      onSubmit={onSubmit}
    />
  );
}

export default CreateWorkspaceScreen;
