import { Launcher } from "@/types/models";
import GoogleChromeLauncher from "./GoogleChromeLauncher";
import VisualStudioCodeLauncher from "./VisualStudioCodeLauncher";

interface AppLauncherInfoProps {
  launcher: Launcher;
}

function AppLauncherInfo({ launcher }: AppLauncherInfoProps) {
  switch (launcher.appName) {
    case "chrome":
      return <GoogleChromeLauncher launcher={launcher} />;
    case "vs-code":
      return <VisualStudioCodeLauncher launcher={launcher} />;
  }
}

export default AppLauncherInfo;
