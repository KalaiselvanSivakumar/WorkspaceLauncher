import { Launcher } from "@/types/models";
import { Chrome, VisualStudioCode } from "@dev.icons/react";

interface LauncherAppIconProps {
  launcher: Launcher;
}

function LauncherAppIcon({ launcher }: LauncherAppIconProps) {
  switch (launcher.appName) {
    case "chrome":
      return <Chrome />;
    case "vs-code":
      return <VisualStudioCode />;
  }
}

export default LauncherAppIcon;
