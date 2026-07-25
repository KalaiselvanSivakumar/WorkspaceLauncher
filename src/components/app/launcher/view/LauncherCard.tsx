import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Launcher } from "@/types/models";
import { getUserFriendlyAppName } from "@/utils/launchers";
import LauncherAppIcon from "./LauncherAppIcon";
import AppLauncherInfo from "./AppLauncherInfo";

interface LauncherCardProps {
  launcher: Launcher;
  position: number;
}

function LauncherCard({ launcher, position }: LauncherCardProps) {
  return (
    <Card className="overflow-hidden pt-0">
      <CardHeader className="bg-muted/50 border-b p-4 [--card-spacing:1rem]">
        <CardTitle className="flex items-center gap-1">
          <LauncherAppIcon launcher={launcher} />
          {getUserFriendlyAppName(launcher)}
          <Badge variant={"outline"}>Launcher #{position}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AppLauncherInfo launcher={launcher} />
      </CardContent>
    </Card>
  );
}

export default LauncherCard;
