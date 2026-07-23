import PageHeader from "@/components/app/PageHeader";
import { EditScreen, useUIStore } from "@/stores/ui-store";

function EditWorkspaceScreen() {
  const screen = useUIStore((state) => state.screen) as EditScreen;

  return (
    <main>
      <PageHeader title={`Edit ${screen.workspaceName} Workspace`} />
    </main>
  );
}

export default EditWorkspaceScreen;
