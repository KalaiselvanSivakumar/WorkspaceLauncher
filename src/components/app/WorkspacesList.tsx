import { WorkspaceConfig } from "@/types/models";
import WorkspaceCard from "./WorkspaceCard";

interface WorkspacesListProps {
  readonly workspaces: WorkspaceConfig[];
  readonly filterWorkspaceName: string;
}

function WorkspacesList({ workspaces, filterWorkspaceName }: WorkspacesListProps) {
  const filteredWorkspaces = workspaces.filter((workspace) =>
    workspace.name.toLowerCase().includes(filterWorkspaceName.toLowerCase())
  );

  if (filteredWorkspaces.length > 0) {
    return (
      <div className="flex flex-col gap-4">
        {filteredWorkspaces.map((workspaceConfig) => (
          <WorkspaceCard key={workspaceConfig.id} workspaceConfig={workspaceConfig} />
        ))}
      </div>
    );
  } else if (workspaces.length === 0) {
    return <p>No workspaces available.</p>;
  } else {
    return <p>No workspaces match the search criteria.</p>;
  }
}

export default WorkspacesList;
