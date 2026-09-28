import { useEffect, useState } from "react";
import { isValidStoredValue } from "../lib/utils";

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    return isValidStoredValue(parsed, fallback) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function useLocalState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readStorage(key, fallback));
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage is optional: private mode and quota limits must not break the app.
    }
  }, [key, value]);
  return [value, setValue] as const;
}
