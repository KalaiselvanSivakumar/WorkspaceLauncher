import { LauncherConfig } from "@/types/models";
import LauncherCard from "./LauncherCard";

interface LaunchersListProps {
  readonly launchers: LauncherConfig[];
}

function LaunchersList({ launchers }: LaunchersListProps) {
  return launchers.length > 0 ? (
    <div className="flex flex-col gap-4">
      {launchers.map((launcherConfig) => (
        <LauncherCard key={launcherConfig.id} launcherConfig={launcherConfig} />
      ))}
    </div>
  ) : (
    <p>No launchers available.</p>
  );
}

export default LaunchersList;
