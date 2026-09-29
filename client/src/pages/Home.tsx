import { useState } from "react";
import { Link } from "wouter";
import {
  Accessibility,
  ArrowRight,
  ArrowUpRight,
  Compass,
  Moon,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { LazyCelestialGlobe as CelestialGlobe } from "../components/LazyScene";
import { LazyRocketMission as RocketMission } from "../components/LazyScene";
import { Atlas, ObjectCard, RouteCard } from "../components/exhibit";
import { useLocalState } from "../hooks/useLocalState";
import { useMotion } from "../contexts/MotionContext";
import { cx } from "../lib/utils";
import "../atlas.css";
import {
  featuredObject,
  getObject,
  heroCopy,
  isPlanetObject,
  localProgressKey,
  localSaveKey,
  objects,
  routes,
  type AstroObject,
} from "../lib/asteria-data";

const planetOrder = [
  "mercury",
  "venus",
  "earth",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
];

function Home() {
  const [selectedId, setSelectedId] = useState("mars");
  const { staticMode: staticView, setStaticMode } = useMotion();
  const [saved, setSaved] = useLocalState<string[]>(localSaveKey, []);
  const [progress] = useLocalState<Record<string, number>>(
    localProgressKey,
    {}
  );
  const selected = getObject(selectedId) ?? featuredObject;
  const heroPlanet = isPlanetObject(selected.id)
    ? selected
    : (getObject("earth") ?? featuredObject);
  const planets = planetOrder
    .map(id => getObject(id))
    .filter((item): item is AstroObject => Boolean(item));
  const toggleSave = (item: AstroObject) => {
    setSaved(current =>
      current.includes(item.id)
        ? current.filter(id => id !== item.id)
        : [...current, item.id]
    );
    toast(
      saved.includes(item.id)
        ? `${item.name} eliminat din salvate`
        : `${item.name} salvat local`
    );
  };
  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow hero-kicker">
            <span className="eyebrow-rule" />
            {heroCopy.kicker}
          </p>
          <h1>
            {heroCopy.title.split("\n").map(line => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </h1>
          <p className="hero-dek">{heroCopy.dek}</p>
          <div className="hero-actions">
            <Link href="/library" className="button button-brass">
              Intră în colecție <ArrowRight size={16} />
            </Link>
            <Link href="/routes/solar-system" className="button button-ghost">
              Urmează un traseu de 12 min <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        <div className="hero-aside">
          <div className="hero-orbit-card">
            <span className="eyebrow">Orientare curentă / studiu 3D</span>
            <div className="hero-orbit-graphic">
              <CelestialGlobe
                color={heroPlanet.color}
                accent={heroPlanet.accent}
                textureUrl={heroPlanet.textureUrl}
                planetId={heroPlanet.id}
                globeKind={heroPlanet.globeKind}
                motionEnabled={!staticView}
                textureAlt={`${heroPlanet.name}, model 3D NASA interactiv`}
                size="hero"
                defer
              />
            </div>
            <div className="hero-card-footer">
              <span>{heroPlanet.name} · model 3D NASA</span>
              <span>rotește</span>
            </div>
            <div className="hero-planet-switcher" aria-label="Alege planeta">
              {planets.map(planet => (
                <button
                  key={planet.id}
                  type="button"
                  className={cx(
                    "hero-planet-button",
                    planet.id === heroPlanet.id && "is-active"
                  )}
                  onClick={() => setSelectedId(planet.id)}
                  aria-label={`Arată modelul 3D pentru ${planet.name}`}
                >
                  {planet.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      <RocketMission />
      <section className="home-section atlas-section">
        <div className="section-kicker-row">
          <div>
            <p className="eyebrow">Atlas viu</p>
            <h2>Găsește-ți punctul de pornire.</h2>
          </div>
          <p className="section-aside-copy">
            Un index spațial pentru cei curioși. Selectează un reper pentru a
            deschide exponatul sau răsfoiește colecția de mai jos.
          </p>
        </div>
        <Atlas
          selectedId={selected.id}
          onSelect={item => setSelectedId(item.id)}
          staticView={staticView}
          onToggleStatic={() => setStaticMode(!staticView)}
        />
        <div className="atlas-selected">
          <div>
            <p className="eyebrow"></p>
            <h3>
              {selected.name} <span>{selected.commonName}</span>
            </h3>
            <p>{selected.summary}</p>
          </div>
          <Link
            href={`/object/${selected.slug}`}
            className="button button-dark"
          >
            Deschide exponatul <ArrowRight size={15} />
          </Link>
        </div>
      </section>
      <section className="home-section selected-section">
        <div className="section-kicker-row">
          <div>
            <p className="eyebrow">Începe aici</p>
            <h2>Câteva întrebări bune pentru început.</h2>
          </div>
          <Link href="/library" className="text-link">
            Vezi toate {objects.length} exponate <ArrowRight size={14} />
          </Link>
        </div>
        <div className="object-grid object-grid-featured">
          {objects.slice(0, 3).map(item => (
            <ObjectCard
              key={item.id}
              item={item}
              saved={saved.includes(item.id)}
              onToggleSave={toggleSave}
            />
          ))}
        </div>
      </section>
      <section className="home-section route-section">
        <div className="section-kicker-row">
          <div>
            <p className="eyebrow">Trasee ghidate</p>
            <h2>Lasă o idee să te conducă.</h2>
          </div>
          <Link href="/routes" className="text-link">
            Răsfoiește traseele <ArrowRight size={14} />
          </Link>
        </div>
        <div className="route-grid">
          {routes.map(route => (
            <RouteCard key={route.id} route={route} progress={progress} />
          ))}
        </div>
      </section>
      <section className="trust-strip">
        <div>
          <Sparkles size={16} />
          <span>Creat pentru curiozitate liniștită</span>
        </div>
        <div>
          <Accessibility size={16} />
          <span>Alternativă semantică pentru fiecare vizual</span>
        </div>
        <div>
          <Compass size={16} />
          <span>Surse verificate</span>
        </div>
        <div>
          <Moon size={16} />
          <span>Mișcare și locație opționale</span>
        </div>
      </section>
    </>
  );
}

export default Home;
