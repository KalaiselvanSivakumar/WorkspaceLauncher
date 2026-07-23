import WorkspacesList from "@/components/app/WorkspacesList";
import PageHeader from "@/components/app/PageHeader";

import { useAppStore } from "@/stores/app-store";
import { useEffect, useState } from "react";
import HomeActionToolbar from "@/components/app/HomeActionToolbar";
import CreateWorkspaceButton from "@/components/app/CreateWorkspaceButton";

function HomeScreen() {
  const appStore = useAppStore();
  const { isLoading, data, error, loadData } = appStore;
  const [filterWorkspaceName, setFilterWorkspaceName] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  // TODO: Replace this with a proper loading spinner or skeleton component
  const mainContent = isLoading ? (
    <div className="loading">Loading application data...</div>
  ) : (
    <section className="px-6 py-4">
      <WorkspacesList
        workspaces={data.data}
        filterWorkspaceName={filterWorkspaceName}
      />
    </section>
  );

  return (
    <main>
      <PageHeader title="Available Workspaces">
        <CreateWorkspaceButton />
      </PageHeader>
      <HomeActionToolbar setFilterWorkspaceName={setFilterWorkspaceName} />
      {mainContent}
    </main>
  );
}

export default HomeScreen;
