import WorkspaceForm from "@/components/app/workspace/configure/WorkspaceForm";
import { CreateWorkspacePayload } from "@/types/models";
import { invoke } from "@tauri-apps/api/core";

function CreateWorkspaceScreen() {
  async function onSubmit(data: CreateWorkspacePayload) {
    console.log(data);
    try {
      await invoke("create_workspace", { payload: data });
      // TODO: Return back to home screen, show success message toast, scroll to newly created workspace
    } catch (err) {
      console.error("Failed to save workspace:", err);
      // TODO: Show failure toast message or dialog
    }
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
