import WorkspacesList from "@/components/app/WorkspacesList";
import PageHeader from "@/components/app/PageHeader";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useAppStore } from "@/stores/app-store";
import { useEffect } from "react";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/ui-store";

function HomeScreen() {
  const showCreate = useUIStore((state) => state.showCreate);
  const appStore = useAppStore();
  const { isLoading, data, error, loadData } = appStore;

  useEffect(() => {
    loadData();
  }, []);

  // TODO: Replace this with a proper loading spinner or skeleton component
  const mainContent = isLoading ? (
    <div className="loading">Loading application data...</div>
  ) : (
    <section className="px-6 py-4">
      <WorkspacesList workspaces={data.data} />
    </section>
  );

  return (
    <main>
      <PageHeader title="Available Workspaces" />
      <div className="flex justify-between px-6 py-4">
        <InputGroup className="w-3/5 max-w-md">
          <InputGroupInput placeholder="Search Workspace..." />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
        </InputGroup>
        <Button type="button" className="gap-1"
          onClick={() => showCreate()}
          >
          <PlusIcon /> Create Workspace
        </Button>
        </div>
      {mainContent}
    </main>
  );
}

export default HomeScreen;
