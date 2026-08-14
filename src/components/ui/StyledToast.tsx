import { Toaster, ToasterProps } from "sonner";

export const TOAST_CLASSES = {
  toast:
    "group toast flex items-center gap-3 w-full rounded-lg border shadow-md transition-all text-sm font-medium [&>[data-content]]:w-full [&>[data-content]>[data-title]]:w-full",
  description: "text-xs opacity-90",
  actionButton:
    "bg-primary text-primary-foreground font-medium rounded-md px-2.5 py-1 text-xs hover:bg-primary/90 transition-colors",
  cancelButton:
    "bg-muted text-muted-foreground font-medium rounded-md px-2.5 py-1 text-xs hover:bg-muted/80 transition-colors",
  success:
    "p-4 bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-800",
  warning:
    "p-4 bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-800",
  error:
    "p-4 bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-800",
  info: "p-4 bg-sky-50 text-sky-900 border-sky-200 dark:bg-sky-950/80 dark:text-sky-200 dark:border-sky-800",
};

function StyledToaster(props: ToasterProps) {
  return (
    <Toaster
      {...props}
      toastOptions={{
        unstyled: true,
        classNames: TOAST_CLASSES,
      }}
    />
  );
}

export default StyledToaster;
