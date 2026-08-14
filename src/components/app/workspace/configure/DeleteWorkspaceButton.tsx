import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRedirectStore } from "@/stores/redirect-store";
import { invoke } from "@tauri-apps/api/core";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface DeleteWorkspaceButtonProps {
  workspaceId: string;
}

function DeleteWorkspaceButton({ workspaceId }: DeleteWorkspaceButtonProps) {
  const isRedirecting = useRedirectStore((state) => state.isRedirecting);

  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const isActionsDisabled = isDeleting || isRedirecting;

  async function handleDeleteWorkspace() {
    setIsDeleting(true);
    try {
      await invoke("delete_workspace", {
        workspaceId: workspaceId,
      });
      setOpen(false);
    } catch (err) {
      console.error("Failed to delete workspace:", err);
      // TODO: Show failure toast message or dialog
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant="destructive"
            disabled={isActionsDisabled}
          >
            <Trash2 /> Delete
          </Button>
        }
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2 />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete workspace?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this workspace.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" disabled={isActionsDisabled}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDeleteWorkspace}
            disabled={isActionsDisabled}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteWorkspaceButton;
