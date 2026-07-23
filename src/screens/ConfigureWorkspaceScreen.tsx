import HeaderActions from "@/components/app/HeaderActions";
import PageHeader from "@/components/app/PageHeader";
import { ConfigureScreen, useUIStore } from "@/stores/ui-store";
import { useCallback } from "react";

function ConfigureWorkspaceScreen() {
  const screen = useUIStore((state) => state.screen) as ConfigureScreen;

  const handlePrimaryAction = useCallback(function () {
    console.log("Primary Action is clicked");
  }, []);

  return (
    <main>
      <PageHeader
        title={`Configure ${screen.workspaceName} Workspace`}
        showBackAction
      >
        <HeaderActions
          actionButtonText="Save"
          handleAction={handlePrimaryAction}
        />
      </PageHeader>
    </main>
  );
}

export default ConfigureWorkspaceScreen;
