import { SaveIcon } from "lucide-react";
import { Button } from "../ui/button";
import GoToHomeScreenButton from "./GoToHomeScreenButton";
import { PropsWithChildren } from "react";

interface HeaderActionsProps extends PropsWithChildren {
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
  children,
}: HeaderActionsProps) {
  return (
    <div className="flex gap-4">
      <GoToHomeScreenButton variant="text" />
      {/* TODO: className: disabled:opacity-50 may be needed */}
      <Button type="submit" disabled={isSubmitting} onClick={handleAction}>
        <SaveIcon />{" "}
        {isSubmitting ? (submittingText ?? "Saving...") : actionButtonText}
      </Button>
      {children}
    </div>
  );
}

export default HeaderActions;
