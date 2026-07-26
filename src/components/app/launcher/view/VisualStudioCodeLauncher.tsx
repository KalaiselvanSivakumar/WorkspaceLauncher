import { VsCodeLauncher } from "@/types/models";
import ViewFieldValuePair from "./ViewFieldValuePair";

interface VisualStudioCodeLauncherProps {
  launcher: VsCodeLauncher;
}

function VisualStudioCodeLauncher({ launcher }: VisualStudioCodeLauncherProps) {
  return (
    <div>
      <ViewFieldValuePair fieldName="Action" value={launcher.action} />
    </div>
  );
}

export default VisualStudioCodeLauncher;
