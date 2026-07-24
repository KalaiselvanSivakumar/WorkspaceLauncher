import HeaderActions from "@/components/app/HeaderActions";
import PageHeader from "@/components/app/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Launcher } from "@/types/models";
import { useCallback, useState } from "react";
import { VisualStudioCode, Chrome } from "@dev.icons/react";
import { PlusIcon } from "lucide-react";

function CreateWorkspaceScreen() {
  const [launchers, setLaunchers] = useState<Launcher[]>([]);

  const handlePrimaryAction = useCallback(function () {
    console.log("Primary Action is clicked");
  }, []);

  return (
    <main>
      <PageHeader title="Create Workspace" showBackAction>
        <HeaderActions
          actionButtonText="Create"
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
                <Badge variant="secondary">{launchers.length} / 20 configured</Badge>
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

export default CreateWorkspaceScreen;
