import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { ComponentProps, CSSProperties } from "react";

const CelestialGlobe = lazy(() => import("./CelestialGlobe"));
const RocketMission = lazy(() => import("./RocketMission"));

type GlobeProps = ComponentProps<typeof CelestialGlobe>;

function useNearViewport<T extends HTMLElement>(rootMargin = "240px") {
  const ref = useRef<T>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      setActive(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, active };
}

export function LazyCelestialGlobe(props: GlobeProps) {
  const { ref, active } = useNearViewport<HTMLDivElement>();
  const fallbackStyle = {
    "--globe-color": props.color,
    "--globe-accent": props.accent,
  } as CSSProperties;
  return (
    <div ref={ref} className="lazy-scene-shell" aria-busy={!active}>
      {active ? (
        <Suspense
          fallback={
            <div
              className="celestial-globe-fallback"
              style={fallbackStyle}
              aria-hidden="true"
            />
          }
        >
          <CelestialGlobe {...props} lazy={false} />
        </Suspense>
      ) : (
        <div
          className="celestial-globe-fallback"
          style={fallbackStyle}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export function LazyRocketMission() {
  const { ref, active } = useNearViewport<HTMLDivElement>("320px");
  return (
    <div ref={ref} className="lazy-mission-shell" aria-busy={!active}>
      {active ? (
        <Suspense
          fallback={
            <div
              className="mission-section mission-loading"
              aria-hidden="true"
            />
          }
        >
          <RocketMission />
        </Suspense>
      ) : (
        <div className="mission-section mission-loading" aria-hidden="true" />
      )}
    </div>
  );
}
