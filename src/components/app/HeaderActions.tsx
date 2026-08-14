import { SaveIcon } from "lucide-react";
import { Button } from "../ui/button";
import GoToHomeScreenButton from "./GoToHomeScreenButton";
import { PropsWithChildren } from "react";
import { useRedirectStore } from "@/stores/redirect-store";

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
  const isRedirecting = useRedirectStore((state) => state.isRedirecting);

  return (
    <div className="flex gap-4">
      <GoToHomeScreenButton variant="text" isDisabled={isRedirecting} />
      {/* TODO: className: disabled:opacity-50 may be needed */}
      <Button
        type="submit"
        disabled={isSubmitting || isRedirecting}
        onClick={handleAction}
      >
        <SaveIcon />{" "}
        {isSubmitting ? (submittingText ?? "Saving...") : actionButtonText}
      </Button>
      {children}
    </div>
  );
}

export default HeaderActions;
