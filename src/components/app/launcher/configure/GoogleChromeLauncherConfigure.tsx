import { ChromeLauncher, ChromeProfileDto } from "@/types/models";
import SelectLauncherAction from "./SelectLauncherAction";
import { FieldLabel } from "@/components/ui/field";
import { Control, Controller, UseFormRegister } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorkspaceFormData } from "../../workspace/configure/WorkspaceForm";
import { CHROME_MAX_LINKS } from "@/utils/launchers";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import TargetsConfigureSectionHeader from "./TargetsConfigureSectionHeader";
import { Input } from "@/components/ui/input";

interface GoogleChromeLauncherConfigureProps {
  chromeProfiles: ChromeProfileDto[];
  control: Control<WorkspaceFormData, any, WorkspaceFormData>;
  launcherIndex: number;
  launcher: ChromeLauncher;
  handleAddUrl: (launcherIndex: number) => void;
  handleRemoveUrl: (launcherIndex: number, urlIdx: number) => void;
  register: UseFormRegister<WorkspaceFormData>;
}

function GoogleChromeLauncherConfigure({
  chromeProfiles,
  control,
  launcherIndex,
  launcher,
  handleAddUrl,
  handleRemoveUrl,
  register,
}: GoogleChromeLauncherConfigureProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-1 w-full">
        <SelectLauncherAction />
        <div className="space-y-1.5">
          <FieldLabel className="text-xs">Chrome Profile</FieldLabel>
          <Controller
            control={control}
            name={`launchers.${launcherIndex}.profile` as const}
            defaultValue={chromeProfiles[0]?.profile_name || "Default"}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Profile" />
                </SelectTrigger>
                <SelectContent>
                  {chromeProfiles.length > 0 ? (
                    chromeProfiles.map((prof) => (
                      <SelectItem key={prof.full_name} value={prof.full_name}>
                        {prof.full_name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="Default">Default</SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
      <TargetsConfigureSectionHeader
        sectionTitle={`Target URLs (${launcher.links?.length || 0} / ${CHROME_MAX_LINKS})`}
        showAddTargetButton={(launcher.links?.length || 0) < CHROME_MAX_LINKS}
        addTargetButtonText="Add URL"
        handleAddTargetAction={() => handleAddUrl(launcherIndex)}
      />
      <div className="space-y-2">
        {launcher.links?.map((_, urlIdx) => (
          <div key={urlIdx} className="flex items-center gap-2">
            <Input
              type="url"
              placeholder="https://example.com"
              {...register(
                `launchers.${launcherIndex}.links.${urlIdx}.url` as const,
                { required: true },
                // TODO: URL validation is needed here
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveUrl(launcherIndex, urlIdx)}
              className="text-muted-foreground hover:text-destructive focus:text-destructive shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GoogleChromeLauncherConfigure;
