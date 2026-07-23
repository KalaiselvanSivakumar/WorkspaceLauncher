import { useUIStore } from "@/stores/ui-store";
import { Button } from "../ui/button";
import { ArrowLeftIcon } from "lucide-react";

type ButtonVariant = "text" | "icon" | "all";

interface GoToHomeScreenButtonProps {
  text?: string;
  variant: ButtonVariant;
}

function GoToHomeScreenButton({
  text = "Cancel",
  variant,
}: GoToHomeScreenButtonProps) {
  const showHome = useUIStore((state) => state.showHome);

  return (
    <Button type="button" variant={"outline"} onClick={showHome}>
      {variant != "text" && <ArrowLeftIcon />}
      {variant != "icon" && text}
    </Button>
  );
}

export default GoToHomeScreenButton;
