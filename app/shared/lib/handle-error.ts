import { toast } from "vue-sonner";

export function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return fallback;
}

export function handleError(error: unknown, fallback = "Something went wrong"): string {
  const message = getErrorMessage(error, fallback);
  console.error("[Error]", error);
  return message;
}

export function handleErrorWithToast(error: unknown, fallback = "Something went wrong"): string {
  const message = handleError(error, fallback);
  toast.error(message);
  return message;
}
