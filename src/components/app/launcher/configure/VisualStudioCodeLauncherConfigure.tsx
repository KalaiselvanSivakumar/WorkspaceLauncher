import { UseFormRegister } from "react-hook-form";
import { VsCodeLauncher } from "@/types/models";
import SelectLauncherAction from "./SelectLauncherAction";
import { VS_CODE_MAX_PROJECTS } from "@/utils/launchers";
import { Button } from "@/components/ui/button";
import { FolderOpen, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { WorkspaceFormData } from "../../workspace/configure/WorkspaceForm";
import { invoke } from "@tauri-apps/api/core";

interface VisualStudioCodeLauncherConfigureProps {
  launcher: VsCodeLauncher;
  launcherIndex: number;
  handleAddPath: (launcherIndex: number) => void;
  handleRemovePath: (launcherIndex: number) => void;
  handleFolderSelect: (launcherIndex: number, path: string | null) => void;
  register: UseFormRegister<WorkspaceFormData>;
}

async function handleBrowseFolderAction() {
  try {
    return await invoke<string | null>("pick_folder");
  } catch (err) {
    console.error("Failed to pick folder:", err);
    return null;
  }
}

function VisualStudioCodeLauncherConfigure({
  launcher,
  launcherIndex,
  handleAddPath,
  handleRemovePath,
  handleFolderSelect,
  register,
}: VisualStudioCodeLauncherConfigureProps) {
  const selectedProjectsCount = launcher.path != null ? 1 : 0;
  const currentProjectsCount = launcher.path ? 1 : 0;

  return (
    <div className="flex flex-col gap-4">
      <SelectLauncherAction />
      <div className="flex items-center justify-between border-t pt-2 h-6">
        <span className="text-xs font-medium">
          Project Folders ({currentProjectsCount} / {VS_CODE_MAX_PROJECTS})
        </span>
        {selectedProjectsCount < VS_CODE_MAX_PROJECTS && (
          <Button
            type="button"
            variant="link"
            size="sm"
            className="p-0 text-xs"
            onClick={() => handleAddPath(launcherIndex)}
          >
            <Plus className="w-3 h-3 mr-1" /> Add Folder
          </Button>
        )}
      </div>
      {launcher.path != null && (
        <div className="flex gap-2">
          <Input
            type="text"
            readOnly
            placeholder="Select folder..."
            value={launcher.path}
            className="bg-muted text-muted-foreground cursor-not-allowed"
            {...register(`launchers.${launcherIndex}.path` as const, {
              required: true,
            })}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={async () => {
              const selectedPath = await handleBrowseFolderAction();
              handleFolderSelect(launcherIndex, selectedPath);
            }}
            className="shrink-0"
          >
            <FolderOpen className="w-3.5 h-3.5 mr-1.5" />
            Browse
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleRemovePath(launcherIndex)}
            className="text-muted-foreground hover:text-destructive focus:text-destructive shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default VisualStudioCodeLauncherConfigure;
