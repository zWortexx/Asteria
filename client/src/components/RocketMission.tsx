import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  DoorOpen,
  Flame,
  Orbit,
  Rocket,
  Sparkles,
  Telescope,
} from "lucide-react";
import { objects, type AstroObject } from "../lib/asteria-data";
import { useMotion } from "../contexts/MotionContext";
import "../mission.css";

type MissionObject = AstroObject & {
  mission: NonNullable<AstroObject["mission"]>;
};
type MissionCategory = NonNullable<AstroObject["mission"]>["category"];
type MissionPhase = "idle" | "transit" | "arrived";

const missionCategories: MissionCategory[] = ["Planete", "Cer profund"];
const destinations = objects.filter(
  (item): item is MissionObject => item.mission !== undefined
);
const starPositions = Array.from({ length: 34 }, (_, index) => ({
  left: `${(index * 37) % 97}%`,
  top: `${(index * 61) % 94}%`,
  delay: `${(index % 8) * -0.4}s`,
  size: index % 7 === 0 ? "3px" : "2px",
}));

export default function RocketMission() {
  const { motionEnabled } = useMotion();
  const [category, setCategory] = useState<MissionCategory>("Planete");
  const [selectedId, setSelectedId] = useState("mars");
  const [phase, setPhase] = useState<MissionPhase>("idle");
  const [exploring, setExploring] = useState(false);
  const [showMenu, setShowMenu] = useState(true);
  const [failedImageId, setFailedImageId] = useState<string | null>(null);
  const selected = useMemo(
    () =>
      destinations.find(destination => destination.id === selectedId) ??
      destinations.find(destination => destination.id === "mars")!,
    [selectedId]
  );
  const mission = selected.mission;
  const visibleDestinations = destinations.filter(
    destination => destination.mission.category === category
  );

  useEffect(() => {
    if (phase !== "transit") return;
    if (!motionEnabled) {
      setPhase("arrived");
      return;
    }
    const timer = window.setTimeout(() => setPhase("arrived"), 3900);
    return () => window.clearTimeout(timer);
  }, [motionEnabled, phase, selectedId]);

  const chooseDestination = (destination: MissionObject) => {
    setSelectedId(destination.id);
    setPhase(motionEnabled ? "transit" : "arrived");
    setExploring(false);
    setShowMenu(false);
  };
  const returnToMenu = () => {
    setPhase("idle");
    setExploring(false);
    setShowMenu(true);
  };
  const openExploration = () => setExploring(true);

  return (
    <section
      id="misiune"
      className={`mission-section ${exploring ? "mission-is-exploring" : ""} ${motionEnabled ? "mission-motion-enabled" : "mission-static"}`}
      aria-labelledby="mission-title"
    >
      <div className="mission-heading">
        <div>
          <p className="eyebrow mission-eyebrow">Misiune spațială</p>
          <h2 id="mission-title">
            Alege o destinație.
            <br />
            <em>Lasă racheta să te ducă.</em>
          </h2>
        </div>
        <p className="mission-intro">
          O călătorie interactivă prin sistemul nostru cosmic. Planetele primesc
          o aterizare; obiectele îndepărtate se deschid ca o fereastră către
          necunoscut.
        </p>
      </div>
      <div
        className={`mission-console mission-phase-${phase} mission-type-${mission.type} ${exploring ? "mission-exploring" : ""}`}
      >
        <div className="mission-sky">
          {failedImageId === selected.id && phase === "arrived" && (
            <div
              className="mission-scene-fallback"
              role="img"
              aria-label={`Scenă indisponibilă pentru ${selected.name}`}
              style={{
                background: `radial-gradient(ellipse at 72% 38%, ${selected.accent} 0%, ${selected.color} 44%, #081311 100%)`,
              }}
            >
              <span>Scenă indisponibilă</span>
            </div>
          )}
          <img
            className={`mission-scene-image${failedImageId === selected.id ? " is-unavailable" : ""}`}
            src={mission.sceneImage}
            alt={mission.sceneImageAlt}
            width={1600}
            height={900}
            loading="eager"
            decoding="async"
            onError={() => setFailedImageId(selected.id)}
          />
          {starPositions.map((star, index) => (
            <span
              key={index}
              className="mission-star"
              style={
                {
                  left: star.left,
                  top: star.top,
                  animationDelay: star.delay,
                  width: star.size,
                  height: star.size,
                } as React.CSSProperties
              }
            />
          ))}
          <div className="mission-nebula mission-nebula-a" />
          <div className="mission-nebula mission-nebula-b" />
          <div className="mission-orbit-ring ring-a" />
          <div className="mission-orbit-ring ring-b" />
          <div
            className="mission-target"
            style={
              {
                "--mission-color": selected.color,
                "--mission-accent": selected.accent,
              } as React.CSSProperties
            }
          >
            <span />
            <b>{selected.name}</b>
          </div>
          <div className="mission-rocket" aria-hidden="true">
            <span className="rocket-window" />
            <span className="rocket-fin rocket-fin-left" />
            <span className="rocket-fin rocket-fin-right" />
            <Rocket size={62} strokeWidth={1.1} />
            <span className="rocket-flame">
              <Flame size={31} />
            </span>
          </div>
          <div className="mission-cockpit" aria-hidden="true">
            <div className="cockpit-glass">
              <span className="cockpit-reticle" />
              <span className="cockpit-label">OBSERVARE / DISTANȚĂ SIGURĂ</span>
            </div>
          </div>
        </div>
        <div className="mission-hud">
          <span>
            <span className="hud-dot" /> SISTEM DE NAVIGAȚIE ONLINE
          </span>
          <span aria-live="polite">
            {phase === "transit"
              ? "TRANZIT ACTIV"
              : phase === "arrived"
                ? "DESTINAȚIE FIXATĂ"
                : "AȘTEAPTĂ DESTINAȚIA"}
          </span>
          <span className="hud-coordinates">RA 05h 35m · ΔV 12,4 km/s</span>
        </div>
        {showMenu && (
          <div className="mission-selector">
            <div className="selector-top">
              <div>
                <p className="eyebrow">Panou de navigație</p>
                <h3>Unde zburăm?</h3>
              </div>
              <span className="selector-status">
                <Orbit size={14} /> {destinations.length} ținte cartografiate
              </span>
            </div>
            <div
              className="mission-tabs"
              role="tablist"
              aria-label="Categorii de destinații"
            >
              {missionCategories.map(tab => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={category === tab}
                  className={category === tab ? "is-active" : ""}
                  onClick={() => setCategory(tab)}
                >
                  {tab}
                  <small>
                    {
                      destinations.filter(
                        destination => destination.mission.category === tab
                      ).length
                    }
                  </small>
                </button>
              ))}
            </div>
            <div className="destination-grid">
              {visibleDestinations.map(destination => (
                <button
                  key={destination.id}
                  className={`destination-chip ${destination.id === selected.id ? "is-selected" : ""}`}
                  onClick={() => chooseDestination(destination)}
                >
                  <span
                    className="destination-glyph"
                    style={
                      {
                        "--mission-color": destination.color,
                        "--mission-accent": destination.accent,
                      } as React.CSSProperties
                    }
                  >
                    <span />
                  </span>
                  <span>
                    <strong>{destination.name}</strong>
                    <small>{destination.mission.meta}</small>
                  </span>
                  <ArrowRight size={15} />
                </button>
              ))}
            </div>
            <p className="selector-note">
              <Sparkles size={14} /> Selectează o destinație pentru a iniția
              procedura de zbor.
            </p>
          </div>
        )}
        {phase === "transit" && (
          <div className="mission-transit-card">
            <div className="transit-icon">
              <Rocket size={22} />
            </div>
            <div>
              <p className="eyebrow">Tranzit către {selected.name}</p>
              <h3>Motorul principal este activ.</h3>
              <p>
                Racheta traversează câmpul de stele și ajustează traiectoria.
              </p>
            </div>
            <div className="transit-progress">
              <span />
              <small>
                CALIBRARE {mission.type === "planet" ? "ORBITĂ" : "OBSERVAȚIE"}
              </small>
            </div>
          </div>
        )}
        {phase === "arrived" && !exploring && (
          <div className="mission-arrival-card">
            <div className="arrival-top">
              <span className="arrival-badge">
                <span /> SOSIRE CONFIRMATĂ
              </span>
              <span className="arrival-mode">
                {mission.type === "planet" ? (
                  <>
                    <DoorOpen size={14} /> PROCEDURĂ DE ATERIZARE
                  </>
                ) : (
                  <>
                    <Telescope size={14} /> MODUL OBSERVATOR
                  </>
                )}
              </span>
            </div>
            <div className="arrival-content">
              <div>
                <p className="eyebrow">{selected.eyebrow}</p>
                <h3>{selected.name}</h3>
                <p className="arrival-description">
                  {mission.arrival} {selected.summary}
                </p>
              </div>
              <div className="arrival-facts">
                {selected.facts.map(fact => (
                  <div key={fact.label}>
                    <span>{fact.label}</span>
                    <strong>{fact.value}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div className="arrival-actions">
              <button
                className="mission-action mission-action-primary"
                onClick={openExploration}
              >
                {mission.type === "planet" ? (
                  <>
                    <DoorOpen size={16} /> Deschide trapa și explorează
                  </>
                ) : (
                  <>
                    <Telescope size={16} /> Deschide hubloul de observație
                  </>
                )}
              </button>
              <Link
                className="mission-action"
                href={`/object/${selected.slug}`}
              >
                Vezi exponatul complet <ArrowRight size={15} />
              </Link>
              <button className="mission-action" onClick={returnToMenu}>
                <ArrowLeft size={15} /> Înapoi la selecție
              </button>
            </div>
          </div>
        )}
        {phase === "arrived" && exploring && (
          <div className="mission-exploration-card">
            <div className="arrival-top">
              <span className="arrival-badge">
                <span />{" "}
                {mission.type === "planet"
                  ? "TRAPA ESTE DESCHISĂ"
                  : "HUBLOUL ESTE DESCHIS"}
              </span>
              <span className="arrival-mode">
                {mission.type === "planet" ? (
                  <>
                    <DoorOpen size={14} /> PANORAMĂ DE SUPRAFAȚĂ
                  </>
                ) : (
                  <>
                    <Telescope size={14} /> VIZOR ACTIV
                  </>
                )}
              </span>
            </div>
            <div className="exploration-body">
              <div>
                <p className="eyebrow">Jurnal de bord · {selected.name}</p>
                <h3>
                  {mission.type === "planet"
                    ? "Privește dincolo de rampă."
                    : "Privește prin hublou."}
                </h3>
                <p>
                  {mission.type === "planet"
                    ? "Senzorii au stabilizat rampa. Acum poți examina peisajul și compara fiecare observație cu datele din fișa de misiune."
                    : "Liniile HUD marchează ținta fără să o transforme într-o hartă literală. Observă relația, distanța și lumina care ajunge la noi."}
                </p>
              </div>
              <div className="exploration-facts">
                {selected.facts.map(fact => (
                  <div key={fact.label}>
                    <span>{fact.label}</span>
                    <strong>{fact.value}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div className="arrival-actions">
              <button
                className="mission-action mission-action-primary"
                onClick={() => setExploring(false)}
              >
                <ArrowLeft size={15} /> Înapoi la informații
              </button>
              <Link
                className="mission-action"
                href={`/object/${selected.slug}`}
              >
                Vezi exponatul complet <ArrowRight size={15} />
              </Link>
              <button className="mission-action" onClick={returnToMenu}>
                <ArrowLeft size={15} /> Alege altă destinație
              </button>
            </div>
          </div>
        )}
      </div>
      {!showMenu && phase !== "arrived" && (
        <button className="mission-back-button" onClick={returnToMenu}>
          <ArrowLeft size={14} /> Înapoi la meniu
        </button>
      )}
    </section>
  );
}
