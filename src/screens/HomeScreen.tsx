import LaunchersList from "@/components/app/LaunchersList";
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
      <h1 className="border-b border-border px-6 py-4 font-heading text-base font-medium">
        Launchers
      </h1>
      {mainContent}
    </main>
  );
}

export default HomeScreen;
