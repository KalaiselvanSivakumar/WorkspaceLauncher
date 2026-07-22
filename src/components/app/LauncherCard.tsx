import { invoke } from "@tauri-apps/api/core";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { LauncherConfig } from "@/types/models";
import { InfoIcon, PencilIcon, PlayIcon } from "lucide-react";
import { useState } from "react";
import { useUIStore } from "@/stores/ui-store";

interface LauncherCardProps {
  readonly launcherConfig: LauncherConfig;
}

async function handleLaunch(name: string) {
  try {
    await invoke("launch_workspace", { name });
  } catch (error) {
    console.error("Error launching workspace:", error);
  }
}

function LauncherCard({ launcherConfig }: LauncherCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const showEdit = useUIStore((state) => state.showEdit);

  return (
    <Card>
      <div className="flex items-center justify-between px-6">
        <h3 className="text-base font-medium">{launcherConfig.name}</h3>
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="gap-1"
            onClick={() => setShowDetails(!showDetails)}
          >
            <InfoIcon /> {showDetails ? "Hide" : "Show"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="gap-1"
            onClick={() => showEdit(launcherConfig.name)}
          >
            <PencilIcon /> Edit
          </Button>
          <Button
            type="button"
            onClick={() => handleLaunch(launcherConfig.name)}
            className="gap-1"
          >
            <PlayIcon /> Launch
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default LauncherCard;
