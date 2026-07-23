import { WorkspaceConfig } from "@/types/models";
import WorkspaceCard from "./WorkspaceCard";

interface WorkspacesListProps {
  readonly workspaces: WorkspaceConfig[];
}

function WorkspacesList({ workspaces }: WorkspacesListProps) {
  return workspaces.length > 0 ? (
    <div className="flex flex-col gap-4">
      {workspaces.map((workspaceConfig) => (
        <WorkspaceCard key={workspaceConfig.id} workspaceConfig={workspaceConfig} />
      ))}
    </div>
  ) : (
    <p>No workspaces available.</p>
  );
}

export default WorkspacesList;
