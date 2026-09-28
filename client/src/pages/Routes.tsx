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
  featuredRoute,
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

function RoutesPage() {
  const [progress] = useLocalState<Record<string, number>>(
    localProgressKey,
    {}
  );
  return (
    <section className="page-section routes-page">
      <SectionIntro
        kicker="03 / Trasee"
        title="Urmează o întrebare."
        dek="Trasee ghidate pentru momentele în care o listă este prea plată, iar un cer gol este prea mult."
      />
      <div className="routes-hero">
        <div>
          <span className="route-number">03</span>
          <p className="eyebrow">Trasee din colecție</p>
          <h2>Spațiul este mai ușor de simțit când traseul are o formă.</h2>
        </div>
        <p>{featuredRoute.outcome}</p>
      </div>
      <div className="route-grid route-grid-page">
        {routes.map(route => (
          <RouteCard key={route.id} route={route} progress={progress} />
        ))}
      </div>
      <div className="routes-promise">
        <div className="promise-icon">
          <Telescope size={22} />
        </div>
        <div>
          <p className="eyebrow">Ce promite un traseu</p>
          <h3>Nu mai multe fapte. O succesiune mai bună.</h3>
          <p>
            Fiecare traseu trece de la familiar la surprinzător și se încheie cu
            o idee pe care o poți lua cu tine în următoarea noapte senină.
          </p>
        </div>
      </div>
    </section>
  );
}

export default RoutesPage;
