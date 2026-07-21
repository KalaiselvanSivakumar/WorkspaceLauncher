import LaunchersList from "@/components/app/LaunchersList";
import PageHeader from "@/components/app/PageHeader";
import { useAppStore } from "@/stores/app-store";
import { useEffect } from "react";

function HomeScreen() {
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
      <LaunchersList launchers={data.data} />
    </section>
  );

  return (
    <main>
      <PageHeader title="Available Launchers" />
      {mainContent}
    </main>
  );
}

export default HomeScreen;
