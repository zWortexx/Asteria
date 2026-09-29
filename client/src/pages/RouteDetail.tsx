import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Check, ChevronRight, Telescope } from "lucide-react";
import { LazyCelestialGlobe as CelestialGlobe } from "../components/LazyScene";
import { useLocalState } from "../hooks/useLocalState";
import { useMotion } from "../contexts/MotionContext";
import { cx } from "../lib/utils";
import "../detail.css";
import "../responsive.css";
import {
  getRouteObjects,
  getRouteProgress,
  localProgressKey,
  type AstroRoute,
} from "../lib/asteria-data";

function RouteDetail({ route }: { route: AstroRoute }) {
  const { staticMode: staticView } = useMotion();
  const [progress, setProgress] = useLocalState<Record<string, number>>(
    localProgressKey,
    {}
  );
  const stepIndex = Math.min(progress[route.id] ?? 0, route.steps.length - 1);
  const [activeIndex, setActiveIndex] = useState(stepIndex);
  useEffect(() => {
    setActiveIndex(Math.min(progress[route.id] ?? 0, route.steps.length - 1));
  }, [route.id, route.steps.length]);
  const active = getRouteObjects(route)[activeIndex];
  const advance = () => {
    const completed = Math.min(route.steps.length, activeIndex + 1);
    setActiveIndex(Math.min(completed, route.steps.length - 1));
    setProgress(current => ({
      ...current,
      [route.id]: completed,
    }));
  };
  return (
    <section className="route-detail-page">
      <div className="detail-breadcrumb">
        <Link href="/routes">Trasee</Link>
        <ChevronRight size={13} />
        <strong>{route.title}</strong>
      </div>
      <div className="route-detail-head">
        <p className="eyebrow">Traseu ghidat · {route.duration}</p>
        <h1>{route.title}</h1>
        <p>{route.dek}</p>
        <div className="route-detail-meta">
          <span>
            <Telescope size={15} />
            {route.steps.length} exponate
          </span>
          <span>
            <Check size={15} />
            {progress[route.id] ?? 0} finalizate
          </span>
        </div>
      </div>
      <div className="route-progress-bar">
        <span style={{ width: `${getRouteProgress(route, progress)}%` }} />
      </div>
      <div className="route-detail-body">
        <aside className="route-index">
          <p className="eyebrow">Indexul traseului</p>
          {getRouteObjects(route).map((item, index) => (
            <button
              key={item.id}
              className={cx(
                index === activeIndex && "is-active",
                index < (progress[route.id] ?? 0) && "is-complete"
              )}
              onClick={() => setActiveIndex(index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.name}</strong>
              <small>{item.family}</small>
              {index < (progress[route.id] ?? 0) && <Check size={14} />}
            </button>
          ))}
        </aside>
        <article className="route-step">
          <div
            className="route-step-visual"
            style={
              {
                "--step-color": active.color,
                "--step-accent": active.accent,
              } as React.CSSProperties
            }
          >
            <CelestialGlobe
              color={active.color}
              accent={active.accent}
              textureUrl={active.textureUrl}
              planetId={active.id}
              textureAlt={active.alt}
              globeKind={active.globeKind}
              motionEnabled={!staticView}
              size="step"
            />
            <span>{active.visualMode} · referință NASA acolo unde există</span>
          </div>
          <p className="eyebrow">
            Pasul {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(route.steps.length).padStart(2, "0")}
          </p>
          <h2>{active.name}</h2>
          <p className="route-step-common">{active.commonName}</p>
          <p className="route-step-copy">{active.summary}</p>
          <div className="route-step-fact">
            <span>De ce este aici</span>
            <strong>{active.scaleNote}</strong>
          </div>
          <div className="route-step-actions">
            <Link href={`/object/${active.slug}`} className="text-link">
              Deschide exponatul complet <ArrowUpRight size={14} />
            </Link>
            <button className="button button-brass" onClick={advance}>
              {activeIndex === route.steps.length - 1
                ? "Finalizează traseul"
                : "Marchează și continuă"}
              <ChevronRight size={15} />
            </button>
          </div>
        </article>
      </div>
      <div className="route-outcome">
        <span className="route-number">→</span>
        <div>
          <p className="eyebrow">La ce răspunde traseul</p>
          <h3>{route.outcome}</h3>
        </div>
      </div>
    </section>
  );
}

export default RouteDetail;
