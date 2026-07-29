import WorkspaceForm from "@/components/app/workspace/configure/WorkspaceForm";
import { useAppStore } from "@/stores/app-store";
import { ConfigureScreen, useUIStore } from "@/stores/ui-store";
import { useCallback } from "react";

function ConfigureWorkspaceScreen() {
  const screen = useUIStore((state) => state.screen) as ConfigureScreen;
  const appData = useAppStore((state) => state.data.data);
  const clonedWorkspaceConfig = structuredClone(
    appData?.find((workspace) => workspace.name === screen.workspaceName),
  );

  const handlePrimaryAction = useCallback(function () {
    console.log("Primary Action is clicked");
  }, []);

  return (
    // <WorkspaceConfiguration text={{ pageTitle: `Configure "${screen.workspaceName}" Workspace`, primaryActionText: "Save" }} handlePrimaryAction={handlePrimaryAction} workspaceConfig={clonedWorkspaceConfig} />
    <WorkspaceForm
      text={{
        pageTitle: `Configure "${screen.workspaceName}" Workspace`,
        pageDescription: "Modify your launcher configurations.",
        primaryActionText: "Update",
        submittingFormText: "Updating workspace...",
      }}
      initialData={{ id: "sdfhaksdjfh", name: "sdkakhjfadgi", launchers: [] }}
      onCancel={() => {}}
      onSuccess={() => {}}
    />
  );
}

export default ConfigureWorkspaceScreen;
