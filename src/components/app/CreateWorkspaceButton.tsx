import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useUIStore } from "@/stores/ui-store";

function CreateWorkspaceButton() {
  const showCreate = useUIStore((state) => state.showCreate);

  return (
    <Button type="button" className="gap-1" onClick={() => showCreate()}>
      <PlusIcon /> New Workspace
    </Button>
  );
}

export default CreateWorkspaceButton;
