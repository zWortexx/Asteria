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

function About() {
  return (
    <section className="page-section about-page">
      <SectionIntro
        kicker="Despre Asteria"
        title="O interfață mai calmă pentru un subiect foarte vast."
        dek="Produsul este un ghid, nu un panou de control: fiecare idee primește suficient spațiu pentru a se contura."
      />
      <div className="about-lede">
        <span className="about-mark">A</span>
        <div>
          <p className="eyebrow">Direcția de design Asteria</p>
          <h2>Arhivă de la miezul nopții.</h2>
          <p>
            Bleumarin profund, alamă caldă, turcoaz de sticlă marină. Puțin
            etichetă de muzeu, puțin instrument de navigație și o preferință
            clară pentru a spune ce face de fapt fiecare vizualizare.
          </p>
        </div>
      </div>
      <div className="about-sections">
        {aboutSections.map((section, index) => (
          <article key={section.id} id={section.id}>
            <span className="about-index">0{index + 1}</span>
            <div>
              <p className="eyebrow">{section.label}</p>
              <h3>{section.heading}</h3>
              <p>{section.body}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="about-columns">
        <div>
          <p className="eyebrow">Trei promisiuni</p>
          {methodBullets.map(bullet => (
            <p className="promise-line" key={bullet}>
              <Check size={14} />
              {bullet}
            </p>
          ))}
        </div>
        <div>
          <p className="eyebrow">Politica surselor</p>
          {sourcePolicy.map(bullet => (
            <p className="promise-line" key={bullet}>
              <ArrowUpRight size={14} />
              {bullet}
            </p>
          ))}
        </div>
      </div>
      <div id="contact" className="about-contact">
        <p className="eyebrow">Contact și responsabilitate</p>
        <p>{aboutContact}</p>
        <a className="text-link" href="mailto:hello@asteria.guide">
          hello@asteria.guide <ExternalLink size={13} />
        </a>
      </div>
    </section>
  );
}

export default About;
