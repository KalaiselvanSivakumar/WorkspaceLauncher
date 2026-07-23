import { SaveIcon } from "lucide-react";
import { Button } from "../ui/button";
import GoToHomeScreenButton from "./GoToHomeScreenButton";

interface HeaderActionsProps {
  actionButtonText: string;
  handleAction: () => void;
}

function HeaderActions({ actionButtonText, handleAction }: HeaderActionsProps) {
  return (
    <div className="flex gap-4">
      <GoToHomeScreenButton variant="text" />
      <Button type="button" onClick={handleAction}>
        <SaveIcon /> {actionButtonText}
      </Button>
    </div>
  );
}

export default HeaderActions;
