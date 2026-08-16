import { ChromeLauncher } from "@/types/models";
import ViewFieldValuePair from "./ViewFieldValuePair";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { CHROME_MAX_LINKS } from "@/utils/launchers";
import { Link2Icon } from "lucide-react";
import { SYSTEM_DEFAULT_PROFILE } from "../launcher-constants";

interface GoogleChromeLauncherProps {
  launcher: ChromeLauncher;
}

function GoogleChromeLauncher({ launcher }: GoogleChromeLauncherProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-1 w-full">
        <ViewFieldValuePair fieldName="Action" value={launcher.action} />
        <ViewFieldValuePair
          fieldName="Chrome Profile"
          value={launcher.profile ?? SYSTEM_DEFAULT_PROFILE}
        />
      </div>
      <Item className="p-0">
        <ItemContent className="flex-row">
          <ItemTitle>Target URLs</ItemTitle>
          <ItemDescription>
            ({launcher.links.length} / {CHROME_MAX_LINKS})
          </ItemDescription>
        </ItemContent>
        {launcher.links.map((link) => (
          <Item key={link.url} variant={"outline"} className="p-2">
            <ItemMedia variant={"icon"}>
              <Link2Icon />
            </ItemMedia>
            <ItemContent>{link.url}</ItemContent>
          </Item>
        ))}
      </Item>
    </div>
  );
}

export default GoogleChromeLauncher;
