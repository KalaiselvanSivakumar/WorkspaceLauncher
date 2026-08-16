import DeleteWorkspaceButton from "@/components/app/workspace/configure/DeleteWorkspaceButton";
import WorkspaceForm, {
  WorkspaceFormData,
} from "@/components/app/workspace/configure/WorkspaceForm";
import { useAppStore } from "@/stores/app-store";
import { ConfigureScreen, useUIStore } from "@/stores/ui-store";
import { WorkspaceConfig } from "@/types/models";
import { invoke } from "@tauri-apps/api/core";

function ConfigureWorkspaceScreen() {
  const screen = useUIStore((state) => state.screen) as ConfigureScreen;
  const appData = useAppStore((state) => state.data.data);

  const clonedWorkspaceConfig = structuredClone(
    appData?.find((workspace) => workspace.id === screen.id),
  );

  async function onSubmit(data: WorkspaceFormData) {
    let response: WorkspaceConfig = await invoke("update_workspace", {
      payload: data,
    });
    return response;
  }

  function onCancelRedirection(_: WorkspaceConfig["id"]) {}

  return (
    <WorkspaceForm
      text={{
        pageTitle: `Configure "${clonedWorkspaceConfig?.name ?? "NAME MISSING"}" Workspace`,
        pageDescription: "Modify your launcher configurations.",
        primaryActionText: "Update",
        submittingFormText: "Updating...",
      }}
      isCreate={false}
      initialData={clonedWorkspaceConfig}
      onSubmit={onSubmit}
      additionalActions={
        <DeleteWorkspaceButton workspaceId={clonedWorkspaceConfig?.id ?? ""} />
      }
      onCancelRedirection={onCancelRedirection}
    />
  );
}

export default ConfigureWorkspaceScreen;
