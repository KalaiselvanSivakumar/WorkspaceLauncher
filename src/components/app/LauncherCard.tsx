import { invoke } from "@tauri-apps/api/core";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { LauncherConfig } from "@/types/models";
import { PlayIcon } from "lucide-react";

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
  return (
    <Card>
      <div className="flex items-center justify-between px-6">
        <h3 className="text-base font-medium">{launcherConfig.name}</h3>
        <div className="flex gap-2">
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
