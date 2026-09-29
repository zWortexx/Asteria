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

function Saved() {
  const [saved, setSaved] = useLocalState<string[]>(localSaveKey, []);
  const items = saved.map(getObject).filter(Boolean) as AstroObject[];
  return (
    <section className="page-section saved-page">
      <SectionIntro
        kicker="05 / Salvate"
        title="Colecția ta locală"
        dek="Câteva exponate la care să revii. Salvate în acest navigator, fără cont."
        action={
          <div className="saved-count">
            <BookmarkCheck size={18} />
            <span>{saved.length}</span>
          </div>
        }
      />
      {items.length ? (
        <>
          <div className="object-grid object-grid-library">
            {items.map(item => (
              <ObjectCard
                key={item.id}
                item={item}
                saved
                onToggleSave={entry =>
                  setSaved(current => current.filter(id => id !== entry.id))
                }
              />
            ))}
          </div>
          <button
            className="text-link clear-saved"
            onClick={() => {
              setSaved([]);
              toast("Colecția locală a fost ștearsă");
            }}
          >
            Șterge colecția locală <RotateCcw size={13} />
          </button>
        </>
      ) : (
        <div className="empty-state saved-empty">
          <Bookmark size={24} />
          <h3>{emptySavedTitle}</h3>
          <p>{emptySavedBody}</p>
          <Link href="/library" className="button button-brass">
            Răsfoiește colecția <ArrowRight size={15} />
          </Link>
        </div>
      )}
    </section>
  );
}

export default Saved;
