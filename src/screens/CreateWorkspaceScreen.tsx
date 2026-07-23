import HeaderActions from "@/components/app/HeaderActions";
import PageHeader from "@/components/app/PageHeader";
import { useCallback } from "react";

function CreateWorkspaceScreen() {
  const handlePrimaryAction = useCallback(function () {
    console.log("Primary Action is clicked");
  }, []);

  return (
    <main>
      <PageHeader title="Create Workspace" showBackAction>
        <HeaderActions
          actionButtonText="Create"
          handleAction={handlePrimaryAction}
        />
      </PageHeader>
    </main>
  );
}

export default CreateWorkspaceScreen;
