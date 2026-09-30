import { Link } from "wouter";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  BookmarkCheck,
  RotateCcw,
} from "lucide-react";
import { memo, useMemo, useRef, useState } from "react";
import CelestialGlobe from "./CelestialGlobe";
import { LazyCelestialGlobe } from "./LazyScene";
import { cx } from "../lib/utils";
import {
  getRouteObjects,
  objects,
  sceneInstruction,
  isPlanetObject,
  type AstroObject,
  type AstroRoute,
} from "../lib/asteria-data";

const atlas3DIds = new Set([
  "orion",
  "orion-nebula",
  "crab-nebula",
  "sirius",
  "andromeda",
]);
const atlasExcludedIds = new Set(["light-travel-time", "scale-in-space"]);
const atlasLayout: Record<string, { left: string; top: string; size: string }> =
  {
    mercury: { left: "8%", top: "16%", size: "clamp(58px, 6.5vw, 72px)" },
    venus: { left: "24%", top: "16%", size: "clamp(58px, 6.5vw, 72px)" },
    earth: { left: "40%", top: "16%", size: "clamp(62px, 7vw, 78px)" },
    mars: { left: "56%", top: "16%", size: "clamp(64px, 7.5vw, 82px)" },
    jupiter: { left: "72%", top: "16%", size: "clamp(58px, 6.5vw, 72px)" },
    saturn: { left: "88%", top: "16%", size: "clamp(58px, 6.5vw, 72px)" },
    moon: { left: "8%", top: "50%", size: "clamp(58px, 6.5vw, 72px)" },
    uranus: { left: "28%", top: "50%", size: "clamp(58px, 6.5vw, 72px)" },
    neptune: { left: "48%", top: "50%", size: "clamp(58px, 6.5vw, 72px)" },
    sirius: { left: "68%", top: "50%", size: "clamp(58px, 6.5vw, 72px)" },
    orion: { left: "88%", top: "50%", size: "clamp(54px, 6vw, 66px)" },
    "orion-nebula": {
      left: "27%",
      top: "76%",
      size: "clamp(64px, 7.5vw, 82px)",
    },
    andromeda: {
      left: "50%",
      top: "76%",
      size: "clamp(64px, 7.5vw, 82px)",
    },
    "crab-nebula": {
      left: "73%",
      top: "76%",
      size: "clamp(64px, 7.5vw, 82px)",
    },
    "black-hole": {
      left: "91%",
      top: "76%",
      size: "clamp(56px, 6.5vw, 70px)",
    },
  };
export function SectionIntro({
  kicker,
  title,
  dek,
  action,
}: {
  kicker: string;
  title: string;
  dek?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="section-intro">
      <div>
        <p className="eyebrow">{kicker}</p>
        <h1>{title}</h1>
        {dek && <p className="intro-dek">{dek}</p>}
      </div>
      {action}
    </div>
  );
}

export function ObjectOrb({
  item,
  selected = false,
  onClick,
  staticView = false,
}: {
  item: AstroObject;
  selected?: boolean;
  onClick?: () => void;
  staticView?: boolean;
}) {
  const isAtlas3D = atlas3DIds.has(item.id);
  const atlasPosition = atlasLayout[item.id] ?? item.coordinates;
  return (
    <button
      onClick={onClick}
      className={cx(
        "object-orb",
        selected && "is-selected",
        staticView && "is-static",
        isAtlas3D && "is-3d"
      )}
      style={
        {
          "--orb-color": item.color,
          "--orb-accent": item.accent,
          "--orb-left": atlasPosition.left,
          "--orb-top": atlasPosition.top,
          "--orb-size": atlasPosition.size,
        } as React.CSSProperties
      }
      aria-label={`Deschide exponatul ${item.name}`}
    >
      {isAtlas3D ? (
        <CelestialGlobe
          color={item.color}
          accent={item.accent}
          planetId={item.id}
          globeKind={item.globeKind}
          motionEnabled={!staticView}
          size="step"
          textureAlt={`${item.name}, model 3D`}
        />
      ) : (
        <>
          <span className="orb-glow" />
          <span className="orb-body" />
        </>
      )}
      <span className="orb-label">
        <b>{item.name}</b>
        <small>{item.family}</small>
      </span>
    </button>
  );
}

export function Atlas({
  selectedId,
  onSelect,
  staticView,
}: {
  selectedId?: string;
  onSelect?: (item: AstroObject) => void;
  staticView?: boolean;
}) {
  const markers = objects.filter(item => !atlasExcludedIds.has(item.id));
  const selectedItem =
    markers.find(item => item.id === selectedId) ?? markers[0];
  const canvasRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    vx: 0,
    vy: 0,
  });
  const suppressClickRef = useRef(false);
  const clamp = (value: number) => Math.max(-150, Math.min(150, value));
  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (
      staticView ||
      (event.target instanceof Element && event.target.closest(".object-orb"))
    ) {
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startY: event.clientY,
      originX: offset.x,
      originY: offset.y,
      lastX: event.clientX,
      lastY: event.clientY,
      lastTime: performance.now(),
      vx: 0,
      vy: 0,
    };
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    const now = performance.now();
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    drag.moved = drag.moved || Math.hypot(dx, dy) > 5;
    drag.vx =
      ((event.clientX - drag.lastX) / Math.max(1, now - drag.lastTime)) * 16;
    drag.vy =
      ((event.clientY - drag.lastY) / Math.max(1, now - drag.lastTime)) * 16;
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    drag.lastTime = now;
    setOffset({ x: clamp(drag.originX + dx), y: clamp(drag.originY + dy) });
  };
  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    drag.active = false;
    if (drag.moved) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 80);
      let x = offset.x;
      let y = offset.y;
      const decay = () => {
        drag.vx *= 0.9;
        drag.vy *= 0.9;
        x = clamp(x + drag.vx);
        y = clamp(y + drag.vy);
        setOffset({ x, y });
        if (Math.abs(drag.vx) + Math.abs(drag.vy) > 0.2)
          requestAnimationFrame(decay);
      };
      requestAnimationFrame(decay);
    }
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };
  return (
    <section
      className={cx("atlas-wrap", staticView && "atlas-static")}
      aria-label="Atlas ceresc interactiv"
    >
      <div className="atlas-toolbar">
        <span className="atlas-status">
          <span className="status-dot" />{" "}
          {staticView ? "Câmp static" : "Câmp îmbunătățit"}
        </span>
        <span className="atlas-toolbar-note">
          {staticView
            ? "Selectează un reper"
            : "Trage pentru a explora · selectează un reper"}
        </span>
        <button
          className="atlas-recenter"
          onClick={() => setOffset({ x: 0, y: 0 })}
          disabled={staticView}
        >
          <RotateCcw size={12} /> Recentrează
        </button>
      </div>
      <div
        ref={canvasRef}
        className={cx("atlas-canvas", staticView && "atlas-canvas-static")}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          cursor: staticView
            ? "default"
            : dragRef.current.active
              ? "grabbing"
              : "grab",
        }}
      >
        <div
          className="atlas-pan-layer"
          style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
        >
          <div className="atlas-grid-lines" />
          <div className="atlas-nebula nebula-one" />
          <div className="atlas-nebula nebula-two" />
          <div className="atlas-orbit orbit-one" />
          <div className="atlas-orbit orbit-two" />
          <div className="atlas-orbit orbit-three" />
          {markers.map(item => (
            <ObjectOrb
              key={item.id}
              item={item}
              selected={item.id === selectedId}
              staticView={staticView}
              onClick={() => {
                if (!suppressClickRef.current) onSelect?.(item);
              }}
            />
          ))}
        </div>
        <div className="atlas-coordinates">
          <span>RA 05h 35m</span>
          <span>DEC −05° 27′</span>
        </div>
        <div className="atlas-caption">
          <span className="caption-line" />
          {sceneInstruction}
        </div>
      </div>
      <div className="atlas-info-card" aria-live="polite">
        <div>
          <p className="eyebrow">Reper selectat · {selectedItem.family}</p>
          <h3>{selectedItem.name}</h3>
          <p>{selectedItem.summary}</p>
        </div>
        <div className="atlas-info-fact">
          <span>{selectedItem.facts[0]?.label ?? "Tip"}</span>
          <strong>
            {selectedItem.facts[0]?.value ?? selectedItem.eyebrow}
          </strong>
        </div>
      </div>
      <div className="atlas-legend">
        <span>
          <i className="legend-dot legend-teal" /> Lumi
        </span>
        <span>
          <i className="legend-dot legend-brass" /> Lumină stelară
        </span>
        <span>
          <i className="legend-dot legend-coral" /> Concepte și nori
        </span>
      </div>
    </section>
  );
}

export const ObjectCard = memo(function ObjectCard({
  item,
  saved,
  onToggleSave,
  eager = false,
}: {
  item: AstroObject;
  saved?: boolean;
  onToggleSave?: (item: AstroObject) => void;
  eager?: boolean;
}) {
  const objectIndex = useMemo(
    () => objects.findIndex(entry => entry.id === item.id) + 1,
    [item.id]
  );
  const Globe = eager ? CelestialGlobe : LazyCelestialGlobe;
  return (
    <article
      className="object-card"
      style={
        {
          "--card-accent": item.accent,
          "--card-color": item.color,
        } as React.CSSProperties
      }
    >
      <div className="card-visual">
        {isPlanetObject(item.id) || item.globeKind ? (
          <Globe
            color={item.color}
            accent={item.accent}
            planetId={item.id}
            globeKind={item.globeKind}
            motionEnabled={false}
            size="step"
            textureAlt={`${item.name}, model 3D NASA`}
          />
        ) : (
          <span className="card-visual-orb" />
        )}
        <span className="card-index">
          {String(objectIndex).padStart(2, "0")}
        </span>
        <button
          className="save-button"
          aria-label={
            saved ? `Elimină ${item.name} din salvate` : `Salvează ${item.name}`
          }
          onClick={() => onToggleSave?.(item)}
        >
          {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        </button>
      </div>
      <div className="card-body">
        <p className="eyebrow">{item.family}</p>
        <h3>{item.name}</h3>
        {item.commonName && <p className="card-common">{item.commonName}</p>}
        <p className="card-summary">{item.summary}</p>
        <Link className="text-link" href={`/object/${item.slug}`}>
          Citește exponatul <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
});

export const RouteCard = memo(function RouteCard({
  route,
  progress,
}: {
  route: AstroRoute;
  progress: Record<string, number>;
}) {
  const finalizate = progress[route.id] ?? 0;
  return (
    <article
      className="route-card"
      style={
        {
          "--route-accent":
            route.tone === "teal"
              ? "#7db7b3"
              : route.tone === "coral"
                ? "#e38d6e"
                : "#d8a95b",
        } as React.CSSProperties
      }
    >
      <div className="route-card-top">
        <span className="eyebrow">Traseu ghidat</span>
        <span className="route-time">{route.duration}</span>
      </div>
      <h3>{route.title}</h3>
      <p>{route.dek}</p>
      <div className="route-steps">
        {getRouteObjects(route).map((item, index) => (
          <span
            key={item.id}
            className={cx(index < finalizate && "is-complete")}
          >
            <i />
            {item.name}
          </span>
        ))}
      </div>
      <div className="route-card-bottom">
        <span>
          {finalizate
            ? `${finalizate} din ${route.steps.length} exponate vizitate`
            : `${route.steps.length} exponate`}
        </span>
        <Link
          href={`/routes/${route.slug}`}
          className="round-arrow"
          aria-label={`Deschide ${route.title}`}
        >
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
});
