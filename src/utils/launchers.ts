import { Launcher } from "@/types/models";

export const CHROME_MAX_LINKS = 20;

export const VS_CODE_MAX_PROJECTS = 1;

export const MAX_LAUNCHERS_PER_WORKSPACE = 5;

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
