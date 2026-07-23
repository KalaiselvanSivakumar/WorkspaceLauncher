import PageHeader from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";

function CreateWorkspaceScreen() {
  return (
    <main>
      <PageHeader title="Create Workspace">
        <div className="flex gap-4">
          <Button type="button" variant={"outline"}>
            Cancel
          </Button>
          <Button type="button">
            <SaveIcon /> Save Workspace
          </Button>
        </div>
      </PageHeader>
    </main>
  );
}

export default CreateWorkspaceScreen;
