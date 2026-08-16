import { useForm, useFieldArray } from "react-hook-form";
import { invoke } from "@tauri-apps/api/core";
import { Trash2 } from "lucide-react";
import PageHeader from "../../PageHeader";
import HeaderActions from "../../HeaderActions";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { JSX, useEffect, useState } from "react";
import { ChromeProfileDto, Launcher, WorkspaceConfig } from "@/types/models";
import { MAX_LAUNCHERS_PER_WORKSPACE } from "@/utils/launchers";
import { Badge } from "@/components/ui/badge";
import { ButtonGroup } from "@/components/ui/button-group";
import { Chrome, VisualStudioCode } from "@dev.icons/react";
import LauncherCard from "../../launcher/view/LauncherCard";
import GoogleChromeLauncherConfigure from "../../launcher/configure/GoogleChromeLauncherConfigure";
import VisualStudioCodeLauncherConfigure from "../../launcher/configure/VisualStudioCodeLauncherConfigure";
import { AppError } from "@/types/AppErrorExt";
import { toast } from "sonner";
import {
  navigateToHomeAndScrollToWorkspace,
  showRedirectSuccessToast,
} from "@/components/ui/helperFunctions";
import { useRedirectStore } from "@/stores/redirect-store";
import { useAppStore } from "@/stores/app-store";
import { useUIStore } from "@/stores/ui-store";
import { SYSTEM_DEFAULT_PROFILE } from "../../launcher/launcher-constants";

export interface WorkspaceFormData {
  id?: string;
  name: string;
  launchers: Launcher[];
}

interface WorkspaceFormProps {
  text: {
    pageTitle: string;
    pageDescription?: string;
    primaryActionText: string;
    submittingFormText: string;
  };
  isCreate: boolean;
  initialData?: WorkspaceFormData;
  additionalActions?: JSX.Element;
  onSubmit: (data: WorkspaceFormData) => Promise<WorkspaceConfig>;

  onCancelRedirection: (workspaceId: WorkspaceConfig["id"]) => void;
}

export default function WorkspaceForm({
  text,
  isCreate,
  initialData,
  additionalActions,
  onSubmit,
  onCancelRedirection,
}: WorkspaceFormProps) {
  const [chromeProfiles, setChromeProfiles] = useState<ChromeProfileDto[]>([]);

  const { startRedirect, clearRedirect } = useRedirectStore();
  const showHome = useUIStore((state) => state.showHome);
  const updateDataInStore = useAppStore((state) => state.updateData);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    setError,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<WorkspaceFormData>({
    defaultValues: initialData || {
      name: "",
      launchers: [],
    },
  });

  const {
    fields: launcherFields,
    append: appendLauncher,
    remove: removeLauncher,
  } = useFieldArray({
    control,
    name: "launchers",
    rules: {
      required: "At least one launcher is required",
      minLength: {
        value: 1,
        message: "At least one launcher is required",
      },
      maxLength: {
        value: MAX_LAUNCHERS_PER_WORKSPACE,
        message: `Maximum ${MAX_LAUNCHERS_PER_WORKSPACE} launchers allowed per workspace`,
      },
    },
  });

  // Fetch dynamic Chrome profiles on mount
  useEffect(() => {
    async function loadProfiles() {
      try {
        const profiles = await invoke<ChromeProfileDto[]>(
          "fetch_chrome_profiles",
        );
        setChromeProfiles(profiles);
      } catch (err) {
        console.error("Failed to load Chrome profiles:", err);
      }
    }
    loadProfiles();
  }, []);

  useEffect(() => {
    return () => clearRedirect();
  }, []);

  const watchedLaunchers = watch("launchers");

  // Helper functions for dynamic URLs
  const handleAddUrl = (launcherIndex: number) => {
    const currentUrls =
      getValues(`launchers.${launcherIndex}.links` as const) || [];
    setValue(
      `launchers.${launcherIndex}.links` as const,
      [...currentUrls, { url: "" }],
      {
        shouldDirty: true,
      },
    );
  };

  const handleRemoveUrl = (launcherIndex: number, urlIdx: number) => {
    const currentUrls =
      getValues(`launchers.${launcherIndex}.links` as const) || [];
    setValue(
      `launchers.${launcherIndex}.links` as const,
      currentUrls.filter((_, i) => i !== urlIdx),
      { shouldDirty: true },
    );
  };

  const handleFolderSelect = async (
    launcherIndex: number,
    path: string | null,
  ) => {
    if (path) {
      setValue(`launchers.${launcherIndex}.path` as const, path, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  // Helper functions for dynamic Paths
  const handleAddPath = (launcherIndex: number) => {
    setValue(`launchers.${launcherIndex}.path` as const, "", {
      shouldDirty: true,
    });
  };

  const handleRemovePath = (launcherIndex: number) => {
    setValue(`launchers.${launcherIndex}.path` as const, null, {
      shouldDirty: true,
    });
  };

  const onSubmitHandler = async (data: WorkspaceFormData) => {
    console.log(data);
    try {
      const response = await onSubmit(data);

      startRedirect(`workspace-${isCreate ? "create" : "edit"}-${response.id}`);

      showRedirectSuccessToast({
        message: isCreate
          ? "Workspace created successfully!"
          : "Workspace updated successfully!",
        onRedirect: () => {
          console.log("Redirectinggggggg....");
          showHome();
          navigateToHomeAndScrollToWorkspace(response.id);
        },
        onCancel: () => {
          clearRedirect();
          onCancelRedirection(response.id);
        },
      });
      updateDataInStore(response);
    } catch (err) {
      console.error("Operation failed:", err);
      clearRedirect();
      const error = err as AppError;
      if (error.type) {
        toast.error(error.message);
      }
      if (error.type === "InvalidConfiguration") {
        setError(error.field as any, {
          type: "server",
          message: error.reason,
        });

        setFocus(error.field as any);
      }
    }
  };

  const launchersCount = launcherFields.length;
  const disableAddLauncherAction =
    launchersCount >= MAX_LAUNCHERS_PER_WORKSPACE;

  return (
    <main>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <PageHeader
          title={text.pageTitle}
          showBackAction
          description={text.pageDescription}
        >
          <HeaderActions
            actionButtonText={text.primaryActionText}
            isSubmitting={isSubmitting}
            submittingText={text.submittingFormText}
            handleAction={() => {}}
          >
            {additionalActions}
          </HeaderActions>
        </PageHeader>

        <div className="flex gap-6 flex-col w-full px-12 py-8">
          {/* Workspace Name Input */}
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="workspaceName">Workspace Name</FieldLabel>
              <Input
                id="workspaceName"
                placeholder="e.g. Morning Standup & Dev Env"
                type="text"
                {...register("name", {
                  required: "Workspace name is required",
                  minLength: {
                    value: 5,
                    message: "Name should be at least 5 characters long",
                  },
                  maxLength: {
                    value: 50,
                    message: "Name should not be more than 50 characters long",
                  },
                })}
              />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>
          </FieldGroup>

          {/* Launchers Section Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex gap-2 items-center font-medium">
                  Configured Launchers
                </div>
                <p className="text-xs text-muted-foreground">
                  Add up to {MAX_LAUNCHERS_PER_WORKSPACE} applications to run
                  simultaneously.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {launchersCount} / {MAX_LAUNCHERS_PER_WORKSPACE} configured
                </Badge>
                <ButtonGroup className="flex justify-center w-full">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={disableAddLauncherAction}
                    onClick={() =>
                      appendLauncher({
                        appName: "chrome",
                        profile: SYSTEM_DEFAULT_PROFILE,
                        tab_group: null,
                        links: [],
                        action: "open",
                      })
                    }
                  >
                    +
                    <Chrome className="w-4 h-4 mx-1" />
                    Google Chrome
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={disableAddLauncherAction}
                    onClick={() =>
                      appendLauncher({
                        appName: "vs-code",
                        path: null,
                        action: "open",
                      })
                    }
                  >
                    +
                    <VisualStudioCode className="w-4 h-4 mx-1" />
                    VS Code
                  </Button>
                </ButtonGroup>
              </div>
            </div>

            {errors.launchers && (
              <FieldError>
                {errors.launchers.root?.message || errors.launchers.message}
              </FieldError>
            )}

            {/* Dynamic Launcher Cards */}
            <div className="grid grid-cols-1 gap-4">
              {launcherFields.map((field, index) => {
                const currentLauncher = watchedLaunchers[index];
                if (!currentLauncher) return null;

                return (
                  <LauncherCard
                    key={field.id}
                    // className="rounded-xl border bg-card shadow-sm overflow-hidden"
                    launcher={currentLauncher}
                    position={index + 1}
                    action={
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeLauncher(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    }
                  >
                    {currentLauncher.appName === "chrome" && (
                      <GoogleChromeLauncherConfigure
                        chromeProfiles={chromeProfiles}
                        control={control}
                        launcherIndex={index}
                        launcher={currentLauncher}
                        handleAddUrl={handleAddUrl}
                        handleRemoveUrl={handleRemoveUrl}
                        register={register}
                      />
                    )}
                    {currentLauncher.appName === "vs-code" && (
                      <VisualStudioCodeLauncherConfigure
                        launcherIndex={index}
                        launcher={currentLauncher}
                        handleAddPath={handleAddPath}
                        handleRemovePath={handleRemovePath}
                        handleFolderSelect={handleFolderSelect}
                        register={register}
                      />
                    )}
                  </LauncherCard>
                );
              })}
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
