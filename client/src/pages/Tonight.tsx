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

const romanianCities = [
  { id: "bucuresti", name: "București", latitude: 44.4268, longitude: 26.1025 },
  {
    id: "cluj-napoca",
    name: "Cluj-Napoca",
    latitude: 46.7712,
    longitude: 23.6236,
  },
  { id: "timisoara", name: "Timișoara", latitude: 45.7489, longitude: 21.2087 },
  { id: "iasi", name: "Iași", latitude: 47.1585, longitude: 27.6014 },
  { id: "craiova", name: "Craiova", latitude: 44.3302, longitude: 23.7949 },
  { id: "brasov", name: "Brașov", latitude: 45.6579, longitude: 25.6012 },
  { id: "constanta", name: "Constanța", latitude: 44.1598, longitude: 28.6348 },
  { id: "sibiu", name: "Sibiu", latitude: 45.7983, longitude: 24.1256 },
];
const formatCoordinate = (value: number) =>
  (Math.round(value * 10) / 10).toLocaleString("ro-RO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
const tonightGuidance = tonightObject.tonight!;

function Tonight() {
  const [locationState, setLocationState] = useState<
    "choice" | "city" | "approximate" | "curated" | "denied"
  >("choice");
  const [locationError, setLocationError] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [approximateCoordinates, setApproximateCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const selectedCity = romanianCities.find(city => city.id === selectedCityId);

  const requestApproximateLocation = () => {
    setLocationError("");
    if (!navigator.geolocation) {
      setLocationState("denied");
      setLocationError("Acest navigator nu oferă acces la locație.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        setApproximateCoordinates({
          latitude: Math.round(position.coords.latitude * 10) / 10,
          longitude: Math.round(position.coords.longitude * 10) / 10,
        });
        setLocationState("approximate");
      },
      error => {
        setLocationState("denied");
        setLocationError(
          error.code === 1
            ? "Accesul la locație a fost refuzat. Poți continua fără locație."
            : "Locația nu este disponibilă acum. Poți continua fără ea."
        );
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  };

  const resetLocation = () => {
    setLocationState("choice");
    setLocationError("");
    setSelectedCityId("");
    setApproximateCoordinates(null);
  };

  const description =
    locationState === "choice"
      ? "Locația poate orienta sugestia pentru această seară, dar Asteria funcționează și fără ea."
      : locationState === "city"
        ? "Alege un oraș pentru coordonate orientative. Această opțiune nu solicită acces la locația dispozitivului."
        : locationState === "approximate"
          ? "Coordonatele aproximative sunt folosite numai în memoria acestei sesiuni și nu sunt salvate."
          : locationState === "denied"
            ? locationError ||
              "Accesul la locație nu a fost permis. Asteria funcționează în continuare fără el."
            : "Păstrăm povestea aleasă și renunțăm complet la locație.";

  return (
    <section className="page-section tonight-page">
      <SectionIntro
        kicker="02 / În seara asta"
        title="Un loc de unde să începi să privești."
        dek="O sugestie atent aleasă pentru observație, cu locație doar dacă dorești."
      />
      <div className="tonight-grid">
        <div className="tonight-copy">
          <span className="tonight-sun">Sugestia serii</span>
          <h2>{tonightObject.name}</h2>
          <p className="tonight-common">{tonightObject.commonName}</p>
          <p>{tonightObject.summary}</p>
          <div className="tonight-facts">
            <div>
              <span>Cel mai bine prin</span>
              <strong>{tonightGuidance.bestWith}</strong>
            </div>
            <div>
              <span>Privește după</span>
              <strong>{tonightGuidance.lookFor}</strong>
            </div>
            <div>
              <span>Modul sursei</span>
              <strong>Alegere editorială, nu date în timp real</strong>
            </div>
          </div>
          <Link
            className="button button-brass"
            href={`/object/${tonightObject.slug}`}
          >
            Deschide exponatul serii <ArrowRight size={16} />
          </Link>
        </div>
        <div className="tonight-card">
          <div className="tonight-card-top">
            <span className="eyebrow">Alege cum începi</span>
            <span className="optional-tag">Opțional</span>
          </div>
          <h3>Lasă cerul să întâlnească locul tău — doar dacă este util.</h3>
          <p>{description}</p>
          {locationState === "choice" ? (
            <div className="choice-buttons">
              <button
                onClick={() => {
                  setLocationState("city");
                  setSelectedCityId("");
                  setApproximateCoordinates(null);
                }}
              >
                <Compass size={16} />
                Alege un oraș <ArrowRight size={14} />
              </button>
              <button onClick={requestApproximateLocation}>
                <Compass size={16} />
                Permite acces aproximativ <ArrowRight size={14} />
              </button>
              <button onClick={() => setLocationState("curated")}>
                <Sparkles size={16} />
                Rămâi la povestea aleasă <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="choice-success">
              <div className="success-check">
                {locationState === "denied" ? (
                  <CircleHelp size={17} />
                ) : (
                  <Check size={17} />
                )}
              </div>
              <strong>
                {locationState === "curated"
                  ? "Povestea aleasă a fost selectată."
                  : locationState === "denied"
                    ? "Poți continua fără locație."
                    : locationState === "city"
                      ? "Coordonatele orașului sunt orientative."
                      : "Locația aproximativă este disponibilă pentru această sesiune."}
              </strong>
              {locationState === "city" && (
                <div className="city-selector">
                  <label htmlFor="tonight-city">Oraș din România</label>
                  <select
                    id="tonight-city"
                    value={selectedCityId}
                    onChange={event => setSelectedCityId(event.target.value)}
                  >
                    <option value="">Alege orașul</option>
                    {romanianCities.map(city => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  {selectedCity && (
                    <div className="location-result">
                      <span>
                        Latitudine {formatCoordinate(selectedCity.latitude)}° ·
                        longitudine {formatCoordinate(selectedCity.longitude)}°
                      </span>
                      <p>
                        Din {selectedCity.name}, Orion este vizibil iarna, spre
                        sud.
                      </p>
                    </div>
                  )}
                </div>
              )}
              {locationState === "approximate" && approximateCoordinates && (
                <div className="location-result">
                  <span>
                    Latitudine{" "}
                    {formatCoordinate(approximateCoordinates.latitude)}° ·
                    longitudine{" "}
                    {formatCoordinate(approximateCoordinates.longitude)}°
                  </span>
                  <p>
                    Din apropierea acestor coordonate, Orion este vizibil iarna,
                    spre sud.
                  </p>
                </div>
              )}
              {locationState === "denied" && locationError && (
                <p className="location-error">{locationError}</p>
              )}
              <button className="text-link" onClick={resetLocation}>
                Schimbă alegerea <RotateCcw size={13} />
              </button>
            </div>
          )}
          <p className="privacy-copy">
            <CircleHelp size={14} />
            {privacyNote}
          </p>
        </div>
      </div>
    </section>
  );
}

export default Tonight;
