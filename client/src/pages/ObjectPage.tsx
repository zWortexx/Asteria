import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  BookmarkCheck,
  Check,
  CircleHelp,
  Compass,
  ExternalLink,
  Moon,
  Pause,
  Play,
  RotateCcw,
  Search,
  Settings2,
  Sparkles,
  Telescope,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { LazyCelestialGlobe as CelestialGlobe } from "../components/LazyScene";
import {
  Atlas,
  ObjectCard,
  RouteCard,
  SectionIntro,
} from "../components/exhibit";
import { useLocalState } from "../hooks/useLocalState";
import { useMotion } from "../contexts/MotionContext";
import { cx } from "../lib/utils";
import "../detail.css";
import "../responsive.css";
import {
  aboutContact,
  aboutSections,
  astronomyDisclaimer,
  categoryDescription,
  collectionNote,
  emptySavedBody,
  emptySavedTitle,
  emptySearchBody,
  emptySearchTitle,
  getCitation,
  getDefaultLayer,
  getFamilyCount,
  getFamilyObjects,
  getObject,
  getRelatedObjects,
  getRouteObjects,
  getRouteProgress,
  getSearchText,
  heroCopy,
  localProgressKey,
  localSaveKey,
  methodBullets,
  normalizeText,
  objects,
  privacyNote,
  routes,
  sourcePolicy,
  tonightObject,
  type AstroObject,
  type AstroRoute,
} from "../lib/asteria-data";

function ObjectPage({ item }: { item: AstroObject }) {
  const [saved, setSaved] = useLocalState<string[]>(localSaveKey, []);
  const { staticMode: staticView, setStaticMode } = useMotion();
  const [activeLayer, setActiveLayer] = useState(getDefaultLayer(item));
  const related = getRelatedObjects(item);
  const isSaved = saved.includes(item.id);
  const toggle = () => {
    setSaved(current =>
      isSaved ? current.filter(id => id !== item.id) : [...current, item.id]
    );
    toast(isSaved ? "Eliminat din salvate" : "Salvat local");
  };
  return (
    <section className="detail-page">
      <div className="detail-breadcrumb">
        <Link href="/library">Colecție</Link>
        <ChevronRight size={13} />
        <span>{item.family}</span>
        <ChevronRight size={13} />
        <strong>{item.name}</strong>
      </div>
      <div className="detail-hero">
        <div className="detail-copy">
          <p className="eyebrow">
            <span className="eyebrow-rule" />
            {item.eyebrow}
          </p>
          <h1>{item.name}</h1>
          {item.commonName && (
            <p className="detail-common">{item.commonName}</p>
          )}
          <p className="detail-summary">{item.summary}</p>
          <div className="detail-actions">
            <button
              className={cx(
                "button",
                isSaved ? "button-saved" : "button-brass"
              )}
              onClick={toggle}
            >
              {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
              {isSaved ? "Salvat local" : "Salvează exponatul"}
            </button>
            <span className="detail-meta">
              Verificat {item.verifiedOn} · {item.visualMode}
            </span>
          </div>
        </div>
        <div className="detail-visual">
          <div className="detail-visual-label">
            <span className="status-dot" /> Studiu de teren 3D /{" "}
            {item.visualMode}
          </div>
          <div
            className="detail-object-stage"
            style={
              {
                "--stage-color": item.color,
                "--stage-accent": item.accent,
              } as React.CSSProperties
            }
          >
            <CelestialGlobe
              color={item.color}
              accent={item.accent}
              textureUrl={item.textureUrl}
              planetId={item.id}
              textureAlt={item.alt}
              globeKind={item.globeKind}
              motionEnabled={!staticView}
              size="detail"
            />
            {item.imageUrl && (
              <img
                className="detail-exhibit-photo"
                src={item.imageUrl}
                alt={item.alt}
                width={600}
                height={420}
                loading="lazy"
                decoding="async"
              />
            )}
            <span className="stage-caption">
              {item.alt}
              {item.imageCredit ? ` · Imagine: ${item.imageCredit}` : ""}
            </span>
          </div>
          <div className="detail-visual-footer">
            <span>Contextul scării</span>
            <strong>{item.scale}</strong>
          </div>
        </div>
      </div>
      <div className="detail-layout">
        <article className="detail-article">
          <p className="detail-lead">{item.body}</p>
          <div className="facts-grid">
            {item.facts.map(fact => (
              <div className="fact" key={fact.label}>
                <span>{fact.label}</span>
                <strong>{fact.value}</strong>
              </div>
            ))}
          </div>
          <div className="detail-section">
            <p className="eyebrow">O notă despre perspectivă</p>
            <h2>Ce păstrează acest vizual și ce lasă deoparte.</h2>
            <p>{item.scaleNote}</p>
            <div className="lens-switcher">
              {item.layers.map(layer => (
                <button
                  className={cx(activeLayer === layer.id && "is-active")}
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                >
                  {layer.label}
                </button>
              ))}
            </div>
            <div className="lens-note">
              <Settings2 size={16} />
              <p>
                {item.layers.find(layer => layer.id === activeLayer)?.detail}
              </p>
            </div>
          </div>
          <div className="detail-section source-section">
            <p className="eyebrow">Sursă și notă vizuală</p>
            <p>{item.visualCaption}</p>
            <div className="citation">
              <span>Sursă verificată</span>
              <strong>
                {item.sourceUrl ? (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {getCitation(item)}
                  </a>
                ) : (
                  getCitation(item)
                )}
              </strong>
              <ExternalLink size={14} />
            </div>
          </div>
        </article>
        <aside className="detail-aside">
          <div className="aside-card">
            <p className="eyebrow">Strat de ghid</p>
            <h3>Păstrează firul vizibil.</h3>
            <p>{astronomyDisclaimer}</p>
            <button
              className="atlas-toggle"
              onClick={() => setStaticMode(!staticView)}
            >
              {staticView ? <Play size={13} /> : <Pause size={13} />}{" "}
              {staticView
                ? "Folosește Universul"
                : "Folosește Universul static"}
            </button>
          </div>
          <div className="aside-card related-card">
            <p className="eyebrow">Continuă firul</p>
            {related.map(entry => (
              <Link
                key={entry.id}
                href={`/object/${entry.slug}`}
                className="related-link"
              >
                <span
                  className="mini-orb"
                  style={{ "--mini-color": entry.color } as React.CSSProperties}
                />
                <span>
                  <strong>{entry.name}</strong>
                  <small>{entry.family}</small>
                </span>
                <ArrowUpRight size={14} />
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

export default ObjectPage;
