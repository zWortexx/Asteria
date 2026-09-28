import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");

export function isValidStoredValue<T>(value: unknown, fallback: T): value is T {
  if (Array.isArray(fallback)) {
    return (
      Array.isArray(value) && value.every(entry => typeof entry === "string")
    );
  }
  if (fallback && typeof fallback === "object") {
    return (
      Boolean(value) &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.values(value as Record<string, unknown>).every(
        entry => typeof entry === "number" && Number.isFinite(entry)
      )
    );
  }
  return typeof value === typeof fallback;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
