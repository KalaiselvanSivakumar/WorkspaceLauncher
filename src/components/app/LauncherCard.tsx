import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { LauncherConfig } from "@/types/models";

interface LauncherCardProps {
  readonly launcherConfig: LauncherConfig;
}

function LauncherCard({ launcherConfig }: LauncherCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between px-6">
        <h3 className="text-base font-medium">{launcherConfig.name}</h3>
        <div className="flex gap-2">
          <Button type="button">Launch</Button>
        </div>
      </div>
    </Card>
  );
}

export default LauncherCard;
