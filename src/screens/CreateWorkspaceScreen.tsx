import { Launcher } from "@/types/models";
import { useCallback, useState } from "react";
import WorkspaceForm from "@/components/app/workspace/configure/WorkspaceForm";

function CreateWorkspaceScreen() {
  const [launchers, setLaunchers] = useState<Launcher[]>([]);

  const handlePrimaryAction = useCallback(function () {
    console.log("Primary Action is clicked");
  }, []);

  return (
    // <WorkspaceConfiguration text={{ pageTitle: "Create Workspace", primaryActionText: "Create" }} launchers={launchers} handlePrimaryAction={handlePrimaryAction} />
    <WorkspaceForm
      text={{
        pageTitle: "Create Workspace",
        primaryActionText: "Create",
        pageDescription: "Configure launchers and paths for your workspace.",
        submittingFormText: "Creating workspace...",
      }}
      onCancel={function () {}}
      onSuccess={function () {}}
    />
  );
}

export default CreateWorkspaceScreen;
