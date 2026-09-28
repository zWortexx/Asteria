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
import CelestialGlobe from "../components/CelestialGlobe";
import RocketMission from "../components/RocketMission";
import {
  Atlas,
  ObjectCard,
  RouteCard,
  SectionIntro,
} from "../components/exhibit";
import { useLocalState } from "../hooks/useLocalState";
import { useMotion } from "../contexts/MotionContext";
import { cx } from "../lib/utils";
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

const familyList = ["Toate", ...Object.keys(categoryDescription)] as const;
function Library() {
  const [family, setFamily] = useState("Toate");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useLocalState<string[]>(localSaveKey, []);
  const filtered = getFamilyObjects(family).filter(item =>
    getSearchText(item).includes(normalizeText(query.trim()))
  );
  const toggleSave = (item: AstroObject) =>
    setSaved(current =>
      current.includes(item.id)
        ? current.filter(id => id !== item.id)
        : [...current, item.id]
    );
  return (
    <section className="page-section library-page">
      <SectionIntro
        kicker="04 / Colecție"
        title="Colecția"
        dek="Suficient de compactă pentru răsfoire. Suficient de bogată pentru a continua."
        action={
          <div className="collection-stat">
            <span>{objects.length}</span>
            <small>
              exponate
              <br />
              verificate
            </small>
          </div>
        }
      />
      <div className="library-toolbar">
        <div className="family-filters">
          {familyList.map(item => (
            <button
              key={item}
              onClick={() => setFamily(item)}
              className={cx("filter-chip", family === item && "is-active")}
            >
              {item === "Lumi și luni" ? "Lumi" : item}
              {item !== "Toate" && <small>{getFamilyCount(item)}</small>}
            </button>
          ))}
        </div>
        <label className="library-search">
          <Search size={15} />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Caută în colecție"
          />
        </label>
      </div>
      {filtered.length ? (
        <div className="object-grid object-grid-library">
          {filtered.map(item => (
            <ObjectCard
              key={item.id}
              item={item}
              saved={saved.includes(item.id)}
              onToggleSave={toggleSave}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <CircleHelp size={20} />
          <h3>{emptySearchTitle}</h3>
          <p>{emptySearchBody}</p>
          <button
            className="button button-outline"
            onClick={() => {
              setFamily("Toate");
              setQuery("");
            }}
          >
            Resetează filtrele
          </button>
        </div>
      )}
      <div className="library-note">
        <div>
          <span className="note-number">05</span>
          <div>
            <p className="eyebrow">Metoda</p>
            <h3>
              Fiecare obiect vine cu o etichetă pentru perspectiva folosită.
            </h3>
          </div>
        </div>
        <p>{collectionNote}</p>
        <Link href="/about" className="text-link">
          Citește metoda și sursele <ArrowUpRight size={14} />
        </Link>
      </div>
    </section>
  );
}

export default Library;
