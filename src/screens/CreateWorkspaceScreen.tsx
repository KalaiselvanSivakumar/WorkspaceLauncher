import { Launcher } from "@/types/models";
import { useCallback, useState } from "react";
import WorkspaceConfiguration from "@/components/app/workspace/configure/WorkspaceConfiguration";

function CreateWorkspaceScreen() {
  const [launchers, setLaunchers] = useState<Launcher[]>([]);

  const handlePrimaryAction = useCallback(function () {
    console.log("Primary Action is clicked");
  }, []);

  return (
    <WorkspaceConfiguration text={{ pageTitle: "Create Workspace", primaryActionText: "Create" }} launchers={launchers} handlePrimaryAction={handlePrimaryAction} />
  );
}

export default CreateWorkspaceScreen;
