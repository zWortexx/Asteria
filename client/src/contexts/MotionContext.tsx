import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { localFallbackKey } from "../lib/asteria-data";

type MotionContextValue = {
  staticMode: boolean;
  reducedMotion: boolean;
  motionEnabled: boolean;
  setStaticMode: (value: boolean) => void;
};

const MotionContext = createContext<MotionContextValue | null>(null);

function getStoredMode() {
  try {
    const raw = localStorage.getItem(localFallbackKey);
    return raw === null ? null : (JSON.parse(raw) as boolean);
  } catch {
    return null;
  }
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [staticMode, setStaticModeState] = useState(
    () => getStoredMode() ?? false
  );
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const setStaticMode = (value: boolean) => {
    setStaticModeState(value);
    try {
      localStorage.setItem(localFallbackKey, JSON.stringify(value));
    } catch {}
  };
  const value = useMemo(
    () => ({
      staticMode,
      reducedMotion,
      motionEnabled: !staticMode && !reducedMotion,
      setStaticMode,
    }),
    [reducedMotion, staticMode]
  );
  return (
    <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
  );
}

export function useMotion() {
  const context = useContext(MotionContext);
  if (!context) throw new Error("useMotion trebuie folosit în MotionProvider");
  return context;
}
