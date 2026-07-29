import { SaveIcon } from "lucide-react";
import { Button } from "../ui/button";
import GoToHomeScreenButton from "./GoToHomeScreenButton";

interface HeaderActionsProps {
  actionButtonText: string;
  isSubmitting?: boolean;
  submittingText?: string;
  handleAction: () => void;
}

function HeaderActions({
  actionButtonText,
  isSubmitting,
  submittingText,
  handleAction,
}: HeaderActionsProps) {
  return (
    <div className="flex gap-4">
      <GoToHomeScreenButton variant="text" />
      {/* TODO: className: disabled:opacity-50 may be needed */}
      <Button type="submit" disabled={isSubmitting} onClick={handleAction}>
        <SaveIcon />{" "}
        {isSubmitting ? (submittingText ?? "Saving...") : actionButtonText}
      </Button>
    </div>
  );
}

export default HeaderActions;
