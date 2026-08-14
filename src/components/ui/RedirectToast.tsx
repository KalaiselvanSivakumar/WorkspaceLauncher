import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TOAST_CLASSES } from "./StyledToast";

export interface RedirectToastConfig {
  seconds?: number;
  message: string;
  onRedirect: () => void;
  onCancel: () => void;
}

interface RedirectToastProps extends RedirectToastConfig {
  toastId: string | number;
}

function RedirectToast({
  toastId,
  seconds: initialSeconds = 5,
  message,
  onRedirect,
  onCancel,
}: RedirectToastProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      toast.dismiss(toastId);
      onRedirect();
      return;
    }
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [toastId, remainingSeconds, onRedirect]);

  const handleCancel = () => {
    toast.dismiss(toastId);
    onCancel();
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`${TOAST_CLASSES.success} flex items-center justify-between gap-4 w-full`}
    >
      <div className="flex flex-col gap-0.5 flex-1">
        <span>{message}</span>
        <span className="text-xs opacity-80">
          Redirecting to Home in {remainingSeconds}s...
        </span>
      </div>

      <button
        onClick={handleCancel}
        className="shrink-0 bg-emerald-200/60 hover:bg-emerald-200 text-emerald-950 dark:bg-emerald-800 dark:hover:bg-emerald-700 dark:text-emerald-100 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}

export default RedirectToast;
