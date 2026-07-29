import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Launcher } from "@/types/models";
import { getUserFriendlyAppName } from "@/utils/launchers";
import LauncherAppIcon from "./LauncherAppIcon";
import { JSX, PropsWithChildren } from "react";

interface LauncherCardProps extends PropsWithChildren {
  launcher: Launcher;
  position: number;
  action?: JSX.Element;
}

function LauncherCard({
  launcher,
  position,
  children,
  action,
}: LauncherCardProps) {
  return (
    <Card className="overflow-hidden pt-0">
      <CardHeader className="bg-muted/50 border-b p-4 [--card-spacing:1rem]">
        <CardTitle className="flex items-center gap-1">
          <LauncherAppIcon launcher={launcher} />
          {getUserFriendlyAppName(launcher)}
          <Badge variant={"outline"}>Launcher #{position}</Badge>
        </CardTitle>
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default LauncherCard;
