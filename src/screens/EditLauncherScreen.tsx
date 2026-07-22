import PageHeader from "@/components/app/PageHeader";
import { EditScreen, useUIStore } from "@/stores/ui-store";

function EditLauncherScreen() {
  const screen = useUIStore((state) => state.screen) as EditScreen;

  return (
    <main>
      <PageHeader title={`Edit ${screen.launcherName} Launcher`} />
    </main>
  );
}

export default EditLauncherScreen;
