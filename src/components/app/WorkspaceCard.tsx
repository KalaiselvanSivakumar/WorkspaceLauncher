import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Launcher, WorkspaceConfig } from "@/types/models";
import { InfoIcon, PencilIcon, RocketIcon } from "lucide-react";
import { useState } from "react";
import { useUIStore } from "@/stores/ui-store";

interface WorkspaceCardProps {
  readonly workspaceConfig: WorkspaceConfig;
}

async function handleLaunch(name: string) {
  try {
    await invoke("launch_workspace", { name });
  } catch (error) {
    console.error("Error launching workspace:", error);
  }
}

function getActionsCount(launchers: Launcher[]) {
  return launchers.reduce((previousValue, launcher) => {
    switch (launcher.appName) {
      case "chrome":
        return previousValue + launcher.links.length;
      case "vs-code":
        return previousValue + (launcher.path ? 1 : 0);
    }
  }, 0);
}

function WorkspaceCard({ workspaceConfig }: WorkspaceCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const showConfigure = useUIStore((state) => state.showConfigure);

  return (
    <Card>
      <div className="flex items-center justify-between px-6">
        <div className="flex items-start flex-col gap-2">
          <h3 className="text-base font-medium">{workspaceConfig.name}</h3>
          <div className="flex items-center gap-2">
            <Badge variant={"secondary"}>
              Launchers: {workspaceConfig.launchers.length}
            </Badge>
            <Badge variant={"secondary"}>
              Actions: {getActionsCount(workspaceConfig.launchers)}
            </Badge>
          </div>
        </div>
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="gap-1"
            onClick={() => setShowDetails(!showDetails)}
          >
            <InfoIcon /> {showDetails ? "Hide" : "Show"} Details
          </Button>
          <Button
            type="button"
            variant="outline"
            className="gap-1"
            onClick={() => showConfigure(workspaceConfig.name)}
          >
            <PencilIcon /> Configure
          </Button>
          <Button
            type="button"
            onClick={() => handleLaunch(workspaceConfig.name)}
            className="gap-1"
          >
            <RocketIcon /> Launch Workspace
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default WorkspaceCard;
