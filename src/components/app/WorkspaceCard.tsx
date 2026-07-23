import { invoke } from "@tauri-apps/api/core";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { WorkspaceConfig } from "@/types/models";
import { InfoIcon, PencilIcon, PlayIcon } from "lucide-react";
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

function WorkspaceCard({ workspaceConfig }: WorkspaceCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const showEdit = useUIStore((state) => state.showEdit);

  return (
    <Card>
      <div className="flex items-center justify-between px-6">
        <h3 className="text-base font-medium">{workspaceConfig.name}</h3>
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
            onClick={() => showEdit(workspaceConfig.name)}
          >
            <PencilIcon /> Edit
          </Button>
          <Button
            type="button"
            onClick={() => handleLaunch(workspaceConfig.name)}
            className="gap-1"
          >
            <PlayIcon /> Launch
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default WorkspaceCard;
