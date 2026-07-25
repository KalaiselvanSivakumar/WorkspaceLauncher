import { Launcher } from "@/types/models";

export function getActionsCountFromLaunchers(launchers: Launcher[]) {
  return launchers.reduce((previousValue, launcher) => {
    switch (launcher.appName) {
      case "chrome":
        return previousValue + launcher.links.length;
      case "vs-code":
        return previousValue + (launcher.path ? 1 : 0);
    }
  }, 0);
}

export function getUserFriendlyAppName(launcher: Launcher) {
  switch (launcher.appName) {
    case "chrome":
      return "Google Chrome";
    case "vs-code":
      return "Visual Studio Code";
  }
}
