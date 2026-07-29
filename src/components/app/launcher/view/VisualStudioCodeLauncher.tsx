import { VsCodeLauncher } from "@/types/models";
import ViewFieldValuePair from "./ViewFieldValuePair";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { VS_CODE_MAX_PROJECTS } from "@/utils/launchers";
import { FolderIcon } from "lucide-react";

interface VisualStudioCodeLauncherProps {
  launcher: VsCodeLauncher;
}

function VisualStudioCodeLauncher({ launcher }: VisualStudioCodeLauncherProps) {
  return (
    <div className="flex flex-col gap-4">
      <ViewFieldValuePair fieldName="Action" value={launcher.action} />
      <Item className="p-0">
        <ItemContent className="flex-row">
          <ItemTitle>Project Folders</ItemTitle>
          <ItemDescription>
            ({launcher.path ? 1 : 0} / {VS_CODE_MAX_PROJECTS})
          </ItemDescription>
        </ItemContent>
        <Item variant={"outline"} className="p-2">
          {launcher.path ? (
            <>
              <ItemMedia variant={"icon"}>
                <FolderIcon />
              </ItemMedia>
              <ItemContent>{launcher.path}</ItemContent>
            </>
          ) : (
            <ItemContent>No Projects Configured</ItemContent>
          )}
        </Item>
      </Item>
    </div>
  );
}

export default VisualStudioCodeLauncher;
