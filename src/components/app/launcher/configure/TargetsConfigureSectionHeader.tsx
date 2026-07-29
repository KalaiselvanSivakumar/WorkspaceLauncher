import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PropsWithChildren } from "react";

interface TargetsConfigureSectionHeaderProps extends PropsWithChildren {
  sectionTitle: string;
  showAddTargetButton: boolean;
  addTargetButtonText: string;
  handleAddTargetAction: () => void;
}

function TargetsConfigureSectionHeader({
  sectionTitle,
  showAddTargetButton,
  addTargetButtonText,
  handleAddTargetAction,
}: TargetsConfigureSectionHeaderProps) {
  return (
    <div className="flex items-center justify-between border-t pt-2 h-6">
      <span className="text-xs font-medium">{sectionTitle}</span>
      {showAddTargetButton && (
        <Button
          type="button"
          variant="link"
          size="sm"
          className="p-0 text-xs"
          onClick={handleAddTargetAction}
        >
          <Plus className="w-3 h-3 mr-1" /> {addTargetButtonText}
        </Button>
      )}
    </div>
  );
}

export default TargetsConfigureSectionHeader;
