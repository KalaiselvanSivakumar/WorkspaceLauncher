import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import HeaderActions from "../../HeaderActions";
import PageHeader from "../../PageHeader";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Chrome, VisualStudioCode } from "@dev.icons/react";
import { Launcher, WorkspaceConfig } from "@/types/models";
import { useState } from "react";

interface WorkspaceConfigurationProps {
  text: {
    pageTitle: string;
    primaryActionText: string;
  }
  handlePrimaryAction: () => void;
  workspaceConfig?: WorkspaceConfig;
}

function WorkspaceConfiguration({ text, handlePrimaryAction, workspaceConfig }: WorkspaceConfigurationProps) {
  const [newWorkspaceConfig, setNewWorkspaceConfig] = useState<WorkspaceConfig>(workspaceConfig || { id: "", name: "", launchers: [] as Launcher[] });

  return (
    <main>
      <PageHeader title={text.pageTitle} showBackAction>
        <HeaderActions
          actionButtonText={text.primaryActionText}
          handleAction={handlePrimaryAction}
        />
      </PageHeader>
      <form className="flex gap-6 flex-col w-full p-6">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="workspaceName">Workspace Name</FieldLabel>
            <Input id="workspaceName" placeholder="Workspace Name (e.g., Trading & Investment, Hobby project)" name="workspaceName" type="text" required />
          </Field>
        </FieldGroup>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>
              <div className="flex gap-2 items-center">
                Configured Launchers
                <Badge variant="secondary">{newWorkspaceConfig.launchers.length} / 20 configured</Badge>
              </div>
            </FieldLegend>
            <ButtonGroup>
              <Button variant={"outline"}>
                <PlusIcon />
                <Chrome className="w-4 h-4 mx-1" />
                Google Chrome
              </Button>
              <Button variant={"outline"}>
                <PlusIcon />
                <VisualStudioCode className="w-4 h-4 mx-1" />
                VS Code
              </Button>
            </ButtonGroup>
          </FieldSet>
        </FieldGroup>
      </form>
    </main>
  );
}

export default WorkspaceConfiguration;
