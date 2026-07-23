import PageHeader from "@/components/app/PageHeader";
import { ConfigureScreen, useUIStore } from "@/stores/ui-store";

function ConfigureWorkspaceScreen() {
  const screen = useUIStore((state) => state.screen) as ConfigureScreen;

  return (
    <main>
      <PageHeader title={`Edit ${screen.workspaceName} Workspace`} />
    </main>
  );
}

export default ConfigureWorkspaceScreen;
