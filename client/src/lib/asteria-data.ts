export type Family =
  | "Lumi și luni"
  | "Stele"
  | "Constelații"
  | "Nebuloase"
  | "Galaxii"
  | "Concepte";
export type VisualMode = "Ilustrativ" | "Scară relativă" | "Bazat pe date";
export type GlobeKind = "sphere" | "galaxy" | "star" | "field";

export type AstroObject = {
  id: string;
  slug: string;
  name: string;
  commonName?: string;
  family: Family;
  eyebrow: string;
  summary: string;
  body: string;
  facts: { label: string; value: string }[];
  scale: string;
  scaleNote: string;
  visualMode: VisualMode;
  globeKind: GlobeKind;
  textureUrl?: string;
  visualCaption: string;
  alt: string;
  color: string;
  accent: string;
  imageUrl?: string;
  imageCredit?: string;
  coordinates: { left: string; top: string; size: string };
  related: string[];
  mission?: {
    category: "Planete" | "Cer profund";
    type: "planet" | "deep-space";
    meta: string;
    arrival: string;
    sceneImage: string;
    sceneImageAlt: string;
  };
  tonight?: { bestWith: string; lookFor: string };
  source: string;
  sourceUrl?: string;
  verifiedOn: string;
  layers: { id: string; label: string; detail: string }[];
};

export type AstroRoute = {
  id: string;
  slug: string;
  title: string;
  dek: string;
  outcome: string;
  duration: string;
  steps: string[];
  tone: string;
};

const layers = [
  {
    id: "context",
    label: "Context",
    detail:
      "Aici o relație devine vizibilă ca strat explicativ, nu ca reprezentare literală a cerului așa cum este observat.",
  },
  {
    id: "scale",
    label: "Notă despre scară",
    detail:
      "Vizualul este etichetat pentru a arăta ce se păstrează și ce se comprimă.",
  },
];
const globeKinds: Record<string, GlobeKind> = {
  andromeda: "galaxy",
  sirius: "star",
  orion: "field",
  "light-travel-time": "field",
  "scale-in-space": "field",
  "black-hole": "field",
  "star-life": "field",
};

export const planetObjectIds = [
  "mercury",
  "venus",
  "earth",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
] as const;

export const isPlanetObject = (id: string) =>
  (planetObjectIds as readonly string[]).includes(id);

const record = (
  item: Omit<AstroObject, "verifiedOn" | "layers" | "globeKind"> & {
    globeKind?: GlobeKind;
  },
  verifiedOn = "17 septembrie 2026"
): AstroObject => ({
  ...item,
  globeKind: item.globeKind ?? globeKinds[item.id] ?? "sphere",
  verifiedOn,
  layers,
});

export const objects: AstroObject[] = [
  record({
    id: "mars",
    slug: "mars",
    name: "Marte",
    commonName: "Planeta roșie",
    family: "Lumi și luni",
    eyebrow: "O lume stâncoasă / orbita a 4-a",
    summary:
      "Marte este o lume rece și uscată, modelată de vânt, impacturi și o istorie bogată în apă. Suprafața sa ruginită păstrează urmele unei planete încă în schimbare.",
    body: "Marte pare familiar la prima vedere, dar scara îi schimbă povestea. O zi acolo este doar puțin mai lungă decât a noastră, iar anotimpurile se întind pe o orbită mai largă și mai eliptică. Rugina strălucitoare provine din mineralele de fier din sol, oxidate sub o atmosferă străveche și mai subțire.",
    facts: [
      { label: "Durata zilei", value: "24 h 37 m" },
      { label: "Distanța medie", value: "228 milioane km" },
      { label: "Luni", value: "2" },
      { label: "Suprafață", value: "Rocă bazaltică și praf" },
    ],
    scale: "Aproximativ jumătate din diametrul Pământului",
    scaleNote:
      "Compoziție ilustrativă. Planeta este afișată mai mare decât contextul său orbital pentru ca detaliile suprafeței să poată fi citite.",
    visualMode: "Ilustrativ",
    visualCaption:
      "Un Marte ilustrativ, tactil, cu terminatorul vizibil; nu este o hartă a suprafeței în timp real.",
    alt: "O sferă roșu-ruginie cu terminator umbrit și textură discretă de cratere, reprezentând planeta Marte.",
    color: "#bd5d3f",
    accent: "#e7a06b",
    coordinates: { left: "27%", top: "46%", size: "clamp(132px, 18vw, 240px)" },
    related: ["earth", "moon", "scale-in-space"],
    source: "NASA · Explorarea Sistemului Solar · Prezentare Marte",
    sourceUrl: "https://science.nasa.gov/resource/planet-mars-3d-model/",
    imageUrl: "/manus-storage/OSIRIS_Mars_true_color_115df2f0.webp",
    textureUrl: "/manus-storage/OSIRIS_Mars_true_color_7cba96d4.jpg",
    imageCredit: "Colecția furnizată · NASA/JPL-Caltech",
    mission: {
      category: "Planete",
      type: "planet",
      meta: "Aterizare pe suprafață",
      arrival:
        "Racheta a stabilizat coborârea. Suprafața este sigură pentru explorare.",
      sceneImage: "/manus-storage/mission-mars_cfb2730d.webp",
      sceneImageAlt:
        "Vedere de la nivelul solului spre un peisaj marțian roșiatic, cu praf fin și platouri stâncoase la apus.",
    },
  }),
  record({
    id: "earth",
    slug: "earth",
    name: "Pământ",
    commonName: "Lumea apelor",
    family: "Lumi și luni",
    eyebrow: "O lume vie / a treia orbită",
    summary:
      "Pământul este un strat dinamic de oceane, atmosferă, roci și viață, ținut împreună de gravitație. Din spațiu, cea mai evidentă trăsătură nu este uscatul, ci apa.",
    body: "Pământul este un reper util pentru toate celelalte exponate din Asteria. Atmosfera sa este o peliculă subțire în raport cu diametrul planetei, iar apa lichidă de la suprafață contribuie la aspectul distinct al Pământului față de lumile vecine.",
    facts: [
      { label: "Vârstă", value: "4,54 miliarde de ani" },
      { label: "Apă la suprafață", value: "Aproximativ 71%" },
      { label: "Satelit natural", value: "1 satelit natural" },
      { label: "Durata zilei", value: "23 h 56 m" },
    ],
    scale: "Lume de referință",
    scaleNote:
      "Vedere la scară relativă: diametrul Pământului este reperul pentru compararea planetelor apropiate.",
    visualMode: "Scară relativă",
    visualCaption:
      "O vedere la scară relativă pentru compararea Pământului cu planetele vecine; distanțele sunt comprimate.",
    alt: "Pământ albastru și verde, cu o perdea fină de nori, pe fundalul spațiului bleumarin.",
    color: "#3b7891",
    accent: "#9ed4bd",
    coordinates: { left: "70%", top: "62%", size: "clamp(116px, 15vw, 200px)" },
    related: ["moon", "mars", "light-travel-time"],
    source: "Observatorul Terestru NASA · Date despre Pământ",
    sourceUrl: "https://science.nasa.gov/learn/heat/resource/earth-3d-model/",
    imageUrl:
      "https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57730/globe_west_2048.jpg",
    imageCredit: "Observatorul Terestru NASA",
    mission: {
      category: "Planete",
      type: "planet",
      meta: "Aterizare pe suprafață",
      arrival:
        "Racheta a revenit acasă. Atmosfera, oceanele și relieful Pământului se văd sub stratul subțire de nori.",
      sceneImage: "/manus-storage/mission-earth_b248260e.webp",
      sceneImageAlt:
        "Vedere orbitală spre oceanele albastre, continentele și norii albi ai Pământului.",
    },
  }),
  record({
    id: "moon",
    slug: "moon",
    name: "Luna",
    commonName: "Vecinul Pământului",
    family: "Lumi și luni",
    eyebrow: "O arhivă cu rotație sincronă",
    summary:
      "Luna păstrează aceeași față către Pământ, iar suprafața ei conservă o istorie lungă a impacturilor. Aspectul liniștit ascunde o relație mereu schimbătoare cu planeta noastră.",
    body: "Luna nu luminează prin ea însăși. Vedem lumina Soarelui reflectată de suprafața ei, iar geometria schimbătoare dintre Soare, Pământ și Lună îi creează fazele. Aceeași față este mereu îndreptată spre noi deoarece perioada de rotație este egală cu perioada orbitală.",
    facts: [
      { label: "Distanța față de Pământ", value: "384.400 km" },
      { label: "Perioada orbitală", value: "27,3 zile" },
      { label: "Gravitație la suprafață", value: "16,5% din cea a Pământului" },
      { label: "Atmosferă", value: "Exosferă" },
    ],
    scale: "Aproximativ un sfert din diametrul Pământului",
    scaleNote:
      "Diametrul relativ este păstrat; distanța Pământ–Lună este comprimată pentru lizibilitate.",
    visualMode: "Scară relativă",
    visualCaption:
      "O pereche Pământ–Lună la scară relativă, cu distanță comprimată; fazele sunt explicative, nu predictive.",
    alt: "O Lună palidă și craterizată, lângă un Pământ albastru mai mic, pe o linie orbitală fină.",
    color: "#b9b3a5",
    accent: "#e6d4ae",
    coordinates: { left: "53%", top: "28%", size: "clamp(72px, 10vw, 126px)" },
    related: ["earth", "mars", "light-travel-time"],
    source: "NASA · Fișa informativă a Lunii",
    sourceUrl: "https://science.nasa.gov/resource/moon-3d-model/",
    imageUrl: "/manus-storage/FullMoon2010_5e4a7e82.webp",
    textureUrl: "/manus-storage/FullMoon2010_6323acc3.jpg",
    imageCredit: "Colecția furnizată · NASA",
  }),
  record({
    id: "mercury",
    slug: "mercury",
    name: "Mercur",
    commonName: "Lumea cea mai apropiată de Soare",
    family: "Lumi și luni",
    eyebrow: "O lume mică / prima orbită",
    summary:
      "Mercur este o planetă stâncoasă, mică și densă, cu diferențe extreme între zi și noapte și o suprafață marcată de impacturi.",
    body: "Mercur se rotește lent, dar se deplasează rapid pe orbita sa. Fără o atmosferă consistentă care să păstreze căldura, suprafața trece prin schimbări termice radicale între partea luminată și cea întunecată.",
    facts: [
      { label: "Distanța medie", value: "58 milioane km" },
      { label: "Durata zilei", value: "58,6 zile terestre" },
      { label: "Luni", value: "0" },
      { label: "Tip", value: "Planetă stâncoasă" },
    ],
    scale: "Aproximativ 38% din diametrul Pământului",
    scaleNote:
      "Modelul păstrează proporțiile planetei, nu și distanța orbitală față de Soare.",
    visualMode: "Scară relativă",
    visualCaption:
      "Un Mercur craterizat, redat prin modelul 3D NASA; scara orbitală este comprimată.",
    alt: "Model 3D gri-brun al planetei Mercur, cu suprafață craterizată.",
    color: "#8d8880",
    accent: "#d4c5a2",
    coordinates: { left: "19%", top: "36%", size: "clamp(90px, 12vw, 155px)" },
    related: ["venus", "earth", "mars"],
    source: "NASA · Mercury 3D Model",
    sourceUrl: "https://science.nasa.gov/resource/mercury-3d-model/",
    mission: {
      category: "Planete",
      type: "planet",
      meta: "Aterizare pe suprafață",
      arrival:
        "Racheta a coborât pe terenul craterizat al lui Mercur, unde lumina și umbra schimbă rapid temperatura suprafeței.",
      sceneImage: "/manus-storage/mission-mercury_4d7f0f3e.webp",
      sceneImageAlt:
        "Priveliște de la nivelul solului spre suprafața craterizată și cenușie a planetei Mercur.",
    },
  }),
  record({
    id: "venus",
    slug: "venus",
    name: "Venus",
    commonName: "Lumea norilor groși",
    family: "Lumi și luni",
    eyebrow: "O seră planetară / a doua orbită",
    summary:
      "Venus este învelită într-o atmosferă densă de dioxid de carbon și nori de acid sulfuric, cu cea mai fierbinte suprafață dintre planetele stâncoase.",
    body: "Venus arată calm de la distanță, dar atmosfera sa creează presiuni și temperaturi extreme la sol. Modelul 3D ajută la separarea sferei vizibile de straturile atmosferice care îi ascund suprafața.",
    facts: [
      { label: "Distanța medie", value: "108 milioane km" },
      { label: "Temperatura la sol", value: "Aproximativ 465°C" },
      { label: "Luni", value: "0" },
      { label: "Atmosferă", value: "CO₂ și nori de acid sulfuric" },
    ],
    scale: "Aproape cât Pământul ca diametru",
    scaleNote:
      "Modelul este mărit pentru lizibilitate; norii și atmosfera nu sunt o fotografie în timp real.",
    visualMode: "Ilustrativ",
    visualCaption:
      "Un model Venus cu tonuri calde și textură NASA; atmosfera este interpretată vizual.",
    alt: "Model 3D galben-auriu al planetei Venus, cu o suprafață acoperită de nori.",
    color: "#c9a35b",
    accent: "#f1d596",
    coordinates: { left: "34%", top: "62%", size: "clamp(108px, 14vw, 185px)" },
    related: ["mercury", "earth", "mars"],
    source: "NASA · Venus 3D Model",
    sourceUrl: "https://science.nasa.gov/resource/venus-3d-model/",
    mission: {
      category: "Planete",
      type: "planet",
      meta: "Coborâre în atmosferă",
      arrival:
        "Racheta a intrat în atmosfera densă a lui Venus, printre nori de acid sulfuric și lumină aurie filtrată.",
      sceneImage: "/manus-storage/mission-venus_b4ab043c.webp",
      sceneImageAlt:
        "Vedere prin atmosfera aurie și densă a planetei Venus spre nori și relief vulcanic îndepărtat.",
    },
  }),
  record({
    id: "uranus",
    slug: "uranus",
    name: "Uranus",
    commonName: "Gigantul de gheață înclinat",
    family: "Lumi și luni",
    eyebrow: "O lume laterală / a șaptea orbită",
    summary:
      "Uranus este un gigant de gheață cu o nuanță albastru-verzuie și o axă de rotație atât de înclinată încât pare să se rostogolească pe orbită.",
    body: "Metanul din atmosfera lui Uranus absoarbe lumina roșie și lasă să domine tonurile albastre. Înclinarea extremă produce anotimpuri neobișnuite, întinse pe zeci de ani pământești.",
    facts: [
      { label: "Distanța medie", value: "2,87 miliarde km" },
      { label: "Anul uranian", value: "84 ani pământești" },
      { label: "Luni cunoscute", value: "28" },
      { label: "Tip", value: "Gigant de gheață" },
    ],
    scale: "De aproximativ patru ori mai lat decât Pământul",
    scaleNote:
      "Inelele subțiri și axa înclinată sunt păstrate în modelul 3D atunci când datele sunt disponibile.",
    visualMode: "Scară relativă",
    visualCaption:
      "Uranus în cyan rece, cu orientarea axială și eventualele inele păstrate de modelul NASA.",
    alt: "Model 3D cyan-albăstrui al lui Uranus, cu o atmosferă netedă și inele fine.",
    color: "#70b8bc",
    accent: "#b8e4df",
    coordinates: { left: "77%", top: "42%", size: "clamp(105px, 13vw, 176px)" },
    related: ["saturn", "neptune", "jupiter"],
    source: "NASA · Uranus 3D Model",
    sourceUrl: "https://science.nasa.gov/resource/uranus-3d-model/",
    mission: {
      category: "Planete",
      type: "planet",
      meta: "Observare de pe orbită",
      arrival:
        "Racheta a ajuns pe orbită în jurul lui Uranus, unde atmosfera cyan și inelele înclinate domină priveliștea.",
      sceneImage: "/manus-storage/mission-uranus_43840868.webp",
      sceneImageAlt:
        "Vedere orbitală spre gigantul de gheață Uranus, albastru-cyan, cu inelele sale subțiri și înclinate.",
    },
  }),
  record({
    id: "neptune",
    slug: "neptune",
    name: "Neptun",
    commonName: "Lumea vânturilor rapide",
    family: "Lumi și luni",
    eyebrow: "Un gigant îndepărtat / a opta orbită",
    summary:
      "Neptun este un gigant de gheață albastru, cu vânturi foarte rapide și furtuni care apar și dispar în atmosfera sa dinamică.",
    body: "Lumina are nevoie de peste patru ore pentru a ajunge de la Soare la Neptun. Culoarea sa profundă vine din compoziția atmosferei, iar norii și petele întunecate se schimbă într-un ritm greu de urmărit de la distanță.",
    facts: [
      { label: "Distanța medie", value: "4,5 miliarde km" },
      { label: "Vânturi", value: "Peste 2.000 km/h" },
      { label: "Anul neptunian", value: "164,8 ani pământești" },
      { label: "Tip", value: "Gigant de gheață" },
    ],
    scale: "De aproximativ patru ori mai lat decât Pământul",
    scaleNote:
      "Modelul este mărit pentru a putea fi observat; culoarea atmosferei este bazată pe date NASA.",
    visualMode: "Ilustrativ",
    visualCaption:
      "Neptun în tonuri albastre, cu detalii atmosferice inspirate de textura NASA/JPL-Caltech.",
    alt: "Model 3D albastru intens al lui Neptun, cu benzi și nori atmosferici discreți.",
    color: "#3b75b4",
    accent: "#9bc4eb",
    coordinates: { left: "86%", top: "68%", size: "clamp(102px, 13vw, 174px)" },
    related: ["uranus", "saturn", "andromeda"],
    source: "NASA · Neptune 3D Model",
    sourceUrl: "https://science.nasa.gov/resource/neptune-3d-model/",
    mission: {
      category: "Planete",
      type: "planet",
      meta: "Observare de pe orbită",
      arrival:
        "Racheta a stabilizat orbita la marginea Sistemului Solar, de unde furtunile albastre ale lui Neptun se văd prin hublou.",
      sceneImage: "/manus-storage/mission-neptune_5ebd0ca5.webp",
      sceneImageAlt:
        "Vedere orbitală spre Neptun, un gigant albastru cu benzi atmosferice și o furtună întunecată.",
    },
  }),
  record({
    id: "sirius",
    slug: "sirius",
    name: "Sirius",
    commonName: "Steaua Câinelui",
    family: "Stele",
    eyebrow: "Un sistem binar apropiat",
    summary:
      "Sirius este cea mai strălucitoare stea de pe cerul nopții al Pământului, un sistem binar suficient de apropiat pentru ca lumina sa să pară aproape locală la scara galaxiei.",
    body: "Strălucirea depinde atât de luminozitate, cât și de distanță. Sirius impresionează nu pentru că ar fi cea mai mare stea, ci fiindcă sistemul se află la aproximativ 8,6 ani-lumină. O pitică albă mai mică orbitează steaua mai strălucitoare și este greu de observat fără instrumente.",
    facts: [
      { label: "Distanță", value: "8,6 ani-lumină" },
      { label: "Sistem", value: "Binar" },
      { label: "Constelație", value: "Câinele Mare" },
      { label: "Culoare", value: "Alb-albăstruie" },
    ],
    scale: "Un sistem vecin, nu un obiect apropiat",
    scaleNote:
      "Diagramă ilustrativă. Dimensiunile și distanțele stelelor nu sunt reprezentate la aceeași scară.",
    visualMode: "Ilustrativ",
    visualCaption:
      "O diagramă cu două stele care evidențiază relația și contrastul, nu diametrul literal.",
    alt: "O stea alb-albăstruie strălucitoare, cu un companion mai mic legat printr-un arc orbital discret.",
    color: "#d9e8f1",
    accent: "#b7d7dc",
    coordinates: { left: "79%", top: "26%", size: "clamp(14px, 2vw, 24px)" },
    related: ["orion", "light-travel-time", "mars"],
    source: "ESA · Profilul sistemului Sirius",
  }),
  record({
    id: "orion",
    slug: "orion",
    name: "Orion",
    commonName: "Vânătorul",
    family: "Constelații",
    eyebrow: "Un model văzut din perspectiva noastră",
    summary:
      "Orion este un model de stele ușor de recunoscut. Stelele par conectate doar privite de pe Pământ; în profunzime, se află la distanțe foarte diferite.",
    body: "O constelație este un model rezultat din perspectivă, nu un grup fizic de stele. Centura lui Orion oferă un reper vizual clar, iar stelele din jur ne ajută să localizăm o nebuloasă strălucitoare și alte medii stelare distincte.",
    facts: [
      { label: "Tip", value: "Model pe cer" },
      { label: "Reper principal", value: "Centură cu trei stele" },
      { label: "Emisferă", value: "Ambele, în anumite anotimpuri" },
      { label: "Exponat apropiat", value: "Nebuloasa Orion" },
    ],
    scale: "Un desen în perspectivă peste spațiul profund",
    scaleNote:
      "Liniile sunt un reper cultural și de orientare; ele nu indică o structură fizică.",
    visualMode: "Bazat pe date",
    visualCaption:
      "Un model stelar adnotat, cu linii adăugate pentru orientare.",
    alt: "Trei stele calde formează o centură diagonală sub două stele mai strălucitoare, într-un câmp rar.",
    color: "#d7a55d",
    accent: "#f2d9a4",
    coordinates: { left: "25%", top: "22%", size: "clamp(10px, 1vw, 18px)" },
    related: ["orion-nebula", "sirius", "light-travel-time"],
    source: "Uniunea Astronomică Internațională · Limitele constelației Orion",
    mission: {
      category: "Cer profund",
      type: "deep-space",
      meta: "Observare prin hublou",
      arrival:
        "Racheta s-a poziționat pentru observație. Hubloul este deschis către centura lui Orion.",
      sceneImage: "/manus-storage/orion_c4b326e2.jpg",
      sceneImageAlt:
        "Ilustrație a constelației Orion, cu centura de trei stele, Betelgeuse portocalie și Rigel alb-albastră.",
    },
  }),
  record({
    id: "orion-nebula",
    slug: "orion-nebula",
    name: "Nebuloasa Orion",
    commonName: "M42",
    family: "Nebuloase",
    eyebrow: "Regiune de formare a stelelor / 1.344 ani-lumină",
    summary:
      "Nebuloasa Orion este un nor luminos de gaz și praf în care se formează stele noi. Este una dintre cele mai apropiate regiuni mari de formare a stelelor față de Pământ.",
    body: "Nebuloasele nu sunt obiecte solide cu margini bine definite. În Orion, lumina ultravioletă a stelelor tinere face gazul din jur să strălucească, iar praful formează benzi întunecate. Forma observată este doar o parte dintr-un mediu mult mai vast și schimbător.",
    facts: [
      { label: "Distanță", value: "Aproximativ 1.344 ani-lumină" },
      { label: "Regiune", value: "Formare de stele" },
      { label: "Constelație", value: "Orion" },
      { label: "Catalog", value: "Messier 42" },
    ],
    scale: "Aproximativ 24 de ani-lumină în diametru",
    scaleNote:
      "Culoarea și densitatea sunt ilustrative. Fotografiile nebuloaselor redau anumite lungimi de undă și setări de expunere.",
    visualMode: "Ilustrativ",
    visualCaption:
      "Un studiu stratificat de gaz și praf, inspirat de imagini cu expunere lungă; culoarea este interpretativă.",
    alt: "Un nor turcoaz și coral moale, cu o deschidere centrală luminoasă și stele tinere răspândite.",
    color: "#4d9995",
    accent: "#da8a69",
    coordinates: { left: "65%", top: "23%", size: "clamp(90px, 13vw, 180px)" },
    related: ["orion", "andromeda", "sirius"],
    source: "NASA / Hubble · Ghid de observare a Nebuloasei Orion",
    imageUrl:
      "https://assets.science.nasa.gov/content/dam/science/missions/hubble/releases/2006/01/STScI-01EVT7X0BR54ZWDP1AG2DA54RA.tif/jcr:content/renditions/800x800.jpg",
    imageCredit: "NASA / ESA / Hubble",
    tonight: {
      bestWith: "Binoclu sau telescop mic",
      lookFor:
        "Pata difuză a norului și regiunea centrală luminoasă; nuanțele turcoaz din fotografii sunt adesea redate prin prelucrare.",
    },
  }),
  record({
    id: "andromeda",
    slug: "andromeda",
    name: "Galaxia Andromeda",
    commonName: "M31",
    family: "Galaxii",
    eyebrow: "Cea mai apropiată galaxie spirală mare",
    summary:
      "Galaxia Andromeda este o spirală vastă de stele, gaz, praf și materie întunecată, văzută de la aproximativ 2,5 milioane de ani-lumină.",
    body: "Când observi Andromeda, vezi o galaxie întreagă ca pe o prezență mică și difuză pe cer. Discul ei este înclinat față de direcția noastră de privire, astfel că structura pare ovală, iar lumina poartă o poveste mai veche decât specia noastră.",
    facts: [
      { label: "Distanță", value: "Aproximativ 2,5 milioane de ani-lumină" },
      { label: "Tip", value: "Spirală barată" },
      { label: "Diametru", value: "Aproximativ 220.000 de ani-lumină" },
      { label: "Grup local", value: "Membră importantă" },
    ],
    scale: "O galaxie văzută ca un punct în Grupul Local",
    scaleNote:
      "Galaxia este mărită pentru a putea fi recunoscută; punctele din jur nu reprezintă numărul real de stele.",
    visualMode: "Scară relativă",
    visualCaption:
      "Un studiu galactic la scară relativă, înclinat intenționat; câmpul din jur este ilustrativ.",
    alt: "O galaxie spiralată ovală și palidă, cu nucleu luminos și margine turcoaz discretă, văzută în unghi.",
    color: "#c8b3a2",
    accent: "#8cb6af",
    coordinates: { left: "85%", top: "56%", size: "clamp(112px, 17vw, 220px)" },
    related: ["orion-nebula", "light-travel-time", "scale-in-space"],
    source: "ESA / Hubble · Fișa informativă a galaxiei Andromeda",
  }),
  record({
    id: "light-travel-time",
    slug: "light-travel-time",
    name: "Timpul de călătorie al luminii",
    commonName: "Privind în trecut",
    family: "Concepte",
    eyebrow: "Cerul ca mașină a timpului",
    summary:
      "A privi în spațiu înseamnă și a privi înapoi în timp. Fiecare imagine astronomică ajunge după ce lumina a parcurs o distanță măsurabilă.",
    body: "Cerul nopții nu este o transmisie în timp real. Lumina Lunii are puțin peste o secundă, lumina Soarelui are aproximativ opt minute, iar lumina din Andromeda a călătorit circa două milioane și jumătate de ani. Distanța devine o axă a timpului.",
    facts: [
      { label: "Lumina Lunii", value: "Aproximativ 1,3 secunde" },
      { label: "Lumina Soarelui", value: "Aproximativ 8 minute" },
      { label: "Sirius", value: "8,6 ani" },
      { label: "Andromeda", value: "Aproximativ 2,5 milioane de ani" },
    ],
    scale: "Distanța devine timp",
    scaleNote:
      "Diagramă cronologică. Valorile sunt rotunjite pentru orientare și nu reprezintă o prognoză de observare.",
    visualMode: "Bazat pe date",
    visualCaption:
      "O axă în trepte care leagă obiecte familiare de pe cer de vârsta luminii care ajunge la noi.",
    alt: "O axă orizontală a timpului cu patru repere stelare, de la secunde la milioane de ani.",
    color: "#7db7b3",
    accent: "#d8a95b",
    coordinates: { left: "44%", top: "72%", size: "clamp(12px, 1.2vw, 20px)" },
    related: ["moon", "sirius", "andromeda"],
    source: "Știința NASA · Introducere în anul-lumină și privirea în trecut",
  }),
  record({
    id: "scale-in-space",
    slug: "scale-in-space",
    name: "Scara spațiului",
    commonName: "Problema distanței",
    family: "Concepte",
    eyebrow: "O comprimare ghidată",
    summary:
      "Astronomia îi cere ochiului să compare dimensiuni și distanțe care nu încap pe o singură pagină fidelă. Modelele bune spun exact ce păstrează și ce comprimă.",
    body: "O planetă poate fi arătată la o dimensiune ușor de citit sau orbita ei poate avea spațieri utile, dar rareori ambele în același timp. Acest exponat tratează scara ca pe o decizie de design: fiecare strat vizual arată dacă păstrează diametrul, distanța sau doar o relație.",
    facts: [
      { label: "Modul modelului", value: "Distanță comprimată" },
      { label: "Reper", value: "Pământ = 1×" },
      { label: "Indiciu util", value: "Compară relațiile" },
      { label: "Risc", value: "Literalitate falsă" },
    ],
    scale: "Niciun cadru nu poate păstra totul",
    scaleNote:
      "Aceasta este o diagramă explicativă, nu o hartă literală a Sistemului Solar.",
    visualMode: "Bazat pe date",
    visualCaption:
      "O diagramă a relațiilor care își etichetează comprimarea în loc să sugereze o vedere literală.",
    alt: "O diagramă etichetată a scării, care leagă Pământul, Marte și Jupiter prin repere orbitale inegal spațiate.",
    color: "#b58f5d",
    accent: "#7db7b3",
    coordinates: { left: "16%", top: "72%", size: "clamp(12px, 1.2vw, 20px)" },
    related: ["mars", "earth", "light-travel-time"],
    source: "Metoda editorială Asteria · Moduri de vizualizare",
  }),

  record(
    {
      id: "jupiter",
      slug: "jupiter",
      name: "Jupiter",
      commonName: "Gigantul gazos",
      family: "Lumi și luni",
      eyebrow: "A cincea planetă de la Soare",
      summary:
        "Jupiter este cea mai mare planetă din Sistemul Solar, un gigant gazos cu benzi de nori, furtuni persistente și un sistem bogat de sateliți și inele discrete.",
      body: "Jupiter este alcătuit în principal din hidrogen și heliu și nu are o suprafață solidă pe care o navă spațială ar putea ateriza. Norii de amoniac și apă formează benzile luminoase și întunecate ale atmosferei, iar rotația rapidă contribuie la curenții atmosferici și la câmpul magnetic puternic. Marea Pată Roșie este o furtună uriașă, observată de peste trei secole. Sistemul jovian include inele greu de văzut și numeroși sateliți; cei patru sateliți galileeni sunt Io, Europa, Ganimede și Callisto.",
      facts: [
        { label: "Distanța medie față de Soare", value: "778 milioane km" },
        { label: "Durata zilei", value: "9,9 ore" },
        { label: "Sateliți recunoscuți de IAU", value: "95" },
        { label: "Suprafață", value: "Nu are o suprafață solidă" },
      ],
      scale: "De aproximativ 11 ori mai lată decât Pământul",
      scaleNote:
        "Compoziție ilustrativă; dimensiunea planetei nu este reprezentată la aceeași scară cu distanțele orbitale.",
      visualMode: "Ilustrativ",
      visualCaption:
        "Benzile și Marea Pată Roșie sunt redate interpretativ; nu este o imagine în timp real.",
      alt: "Planetă uriașă în nuanțe crem și ocru, cu benzi atmosferice și o furtună ovală roșiatică.",
      color: "#b78f69",
      accent: "#e4c28c",
      coordinates: { left: "9%", top: "17%", size: "clamp(72px, 9vw, 112px)" },
      related: ["saturn", "mars", "scale-in-space"],
      source: "NASA · Date despre Jupiter",
      sourceUrl: "https://science.nasa.gov/resource/jupiter-3d-model/",
      imageUrl:
        "/manus-storage/Jupiter_and_its_shrunken_Great_Red_Spot_02f7ce8c.webp",
      textureUrl:
        "/manus-storage/Jupiter_and_its_shrunken_Great_Red_Spot_2fdf9f3c.jpg",
      imageCredit: "Colecția furnizată · NASA/JPL-Caltech/SwRI/MSSS",
      mission: {
        category: "Planete",
        type: "planet",
        meta: "Observare din orbită",
        arrival:
          "Racheta a intrat pe o orbită de observație. Atmosfera nu permite o aterizare clasică.",
        sceneImage: "/manus-storage/mission-jupiter_633ca681.webp",
        sceneImageAlt:
          "Ilustrație văzută prin hublou spre norii bandați ai lui Jupiter și Marea Pată Roșie.",
      },
    },
    "28 septembrie 2026"
  ),
  record(
    {
      id: "saturn",
      slug: "saturn",
      name: "Saturn",
      commonName: "Planeta inelelor",
      family: "Lumi și luni",
      eyebrow: "A șasea planetă de la Soare",
      summary:
        "Saturn este un gigant gazos remarcabil prin sistemul său complex de inele, alcătuit în principal din fragmente de gheață și rocă.",
      body: "Saturn este alcătuit în principal din hidrogen și heliu și nu are o suprafață solidă pe care o navă spațială ar putea ateriza. Se află, în medie, la aproximativ 1,4 miliarde de kilometri de Soare și parcurge o orbită în circa 29,4 ani tereștri. Inelele sale conțin miliarde de fragmente, mai ales de gheață și rocă, cu dimensiuni de la particule fine până la corpuri mult mai mari. Titan și Enceladus sunt doi dintre sateliții care stârnesc un interes științific deosebit.",
      facts: [
        { label: "Distanța medie față de Soare", value: "1,4 miliarde km" },
        { label: "Durata zilei", value: "Aproximativ 10,7 ore" },
        { label: "Durata anului", value: "Aproximativ 29,4 ani tereștri" },
        { label: "Inele", value: "Mai ales gheață și rocă" },
      ],
      scale: "Diametrul ecuatorial este de aproximativ 120.500 km",
      scaleNote:
        "Compoziție ilustrativă; sistemul de inele este înclinat pentru lizibilitate, nu redat la scară orbitală.",
      visualMode: "Ilustrativ",
      visualCaption:
        "Inelele sunt reprezentate schematic; distanțele și grosimea lor nu sunt redate la scară.",
      alt: "Planetă aurie palidă, înconjurată de un sistem lat de inele subțiri, pe fundal întunecat.",
      color: "#c5a36f",
      accent: "#f3d69c",
      coordinates: { left: "92%", top: "10%", size: "clamp(72px, 9vw, 112px)" },
      related: ["jupiter", "moon", "scale-in-space"],
      source: "NASA · Date despre Saturn",
      sourceUrl: "https://science.nasa.gov/resource/saturn-3d-model/",
      imageUrl: "/manus-storage/Saturn_during_Equinox_600ff65d.webp",
      textureUrl: "/manus-storage/Saturn_during_Equinox_76d6b2d7.jpg",
      imageCredit: "Colecția furnizată · NASA/JPL/SSI",
      mission: {
        category: "Planete",
        type: "planet",
        meta: "Observare de pe orbită",
        arrival:
          "Racheta a ajuns la distanță sigură de inele. Observarea se face de pe orbită.",
        sceneImage: "/manus-storage/mission-saturn_3dec40dd.webp",
        sceneImageAlt:
          "Ilustrație văzută prin hublou spre planeta Saturn și arcul său vast de inele.",
      },
    },
    "28 septembrie 2026"
  ),
  record(
    {
      id: "crab-nebula",
      slug: "crab-nebula",
      name: "Nebuloasa Crabului",
      commonName: "Messier 1 · M1",
      family: "Nebuloase",
      eyebrow: "Rest de supernovă în constelația Taurul",
      summary:
        "Nebuloasa Crabului este restul în expansiune al supernovei observate în anul 1054. În centrul său se află pulsarul Crabului, o stea neutronică în rotație rapidă.",
      body: "Cunoscută și ca Messier 1, Nebuloasa Crabului s-a format din materialul ejectat de o supernovă observată în anul 1054. Se află în constelația Taurul, la aproximativ 6.500 de ani-lumină, iar restul are în jur de șase ani-lumină în diametru. În centrul ei se află pulsarul Crabului, o stea neutronică densă care se rotește rapid și produce pulsații observabile de circa 30 de ori pe secundă. Culorile fotografiilor astronomice evidențiază diferite elemente și nu corespund întocmai vederii cu ochiul liber.",
      facts: [
        { label: "Distanță", value: "Aproximativ 6.500 ani-lumină" },
        { label: "Supernova observată", value: "Anul 1054" },
        { label: "Diametru", value: "Aproximativ 6 ani-lumină" },
        { label: "Obiect central", value: "Pulsar — stea neutronică" },
      ],
      scale: "Restul are aproximativ 6 ani-lumină în diametru",
      scaleNote:
        "Fotografiile combină culori și lungimi de undă diferite; nu trebuie interpretate ca reproducere fidelă a culorilor văzute cu ochiul liber.",
      visualMode: "Bazat pe date",
      visualCaption:
        "Imaginea Hubble redă structura și compoziția nebuloasei prin culori atribuite datelor observaționale.",
      alt: "Rest de supernovă cu filamente de gaz în tonuri albastre, verzi și arămii în jurul unui centru luminos.",
      color: "#638e9b",
      accent: "#ed9c78",
      coordinates: { left: "7%", top: "88%", size: "clamp(68px, 8vw, 96px)" },
      related: ["orion-nebula", "orion", "light-travel-time"],
      source: "NASA / Hubble · Messier 1",
      sourceUrl:
        "https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-1/",
      mission: {
        category: "Cer profund",
        type: "deep-space",
        meta: "Observare prin hublou",
        arrival:
          "Racheta a rămas la distanță sigură. Pulsarul și filamentele sunt observate de la distanță.",
        sceneImage: "/manus-storage/crab-nebula_f45ebcb2.jpg",
        sceneImageAlt:
          "Ilustrație văzută prin hublou spre Nebuloasa Crabului, cu filamente de gaz în jurul pulsarului central.",
      },
    },
    "28 septembrie 2026"
  ),
  record(
    {
      id: "black-hole",
      slug: "black-hole",
      name: "Gaura neagră",
      commonName: "Săgetător A*",
      family: "Concepte",
      eyebrow: "Exemplu: gaura neagră din centrul Căii Lactee",
      summary:
        "Săgetător A* este gaura neagră supermasivă din centrul Căii Lactee. Gazul fierbinte din apropiere și lumina deviată de gravitație dezvăluie o umbră centrală, nu o suprafață vizibilă.",
      body: "În general, o gaură neagră nu poate fi fotografiată ca o suprafață luminoasă: însăși gaura neagră este întunecată. Gazul strălucitor din jur și lumina curbată de gravitația intensă pot contura o regiune centrală întunecată, numită umbră, înconjurată de o structură luminoasă asemănătoare unui inel. Săgetător A* este exemplul concret din această fișă: o gaură neagră supermasivă aflată în centrul Căii Lactee. Imaginea prezentată de colaborarea Event Horizon Telescope în 2022 a oferit prima dovadă vizuală directă a naturii sale de gaură neagră; este o reconstrucție din observații radio, nu o fotografie convențională a unei suprafețe.",
      facts: [
        { label: "Loc", value: "Centrul Căii Lactee" },
        { label: "Masă", value: "Aproximativ 4 milioane de mase solare" },
        { label: "Distanță", value: "Aproximativ 27.000 ani-lumină" },
        { label: "Observații", value: "Telescopul virtual EHT" },
      ],
      scale: "Un obiect supermasiv aflat la aproximativ 27.000 ani-lumină",
      scaleNote:
        "Inelul luminos și umbra sunt trăsături reconstruite din emisia gazului și curbarea luminii; nu reprezintă o vedere directă a interiorului.",
      visualMode: "Bazat pe date",
      visualCaption:
        "Studiu schematic inspirat de observațiile radio Event Horizon Telescope; nu este o fotografie a unei suprafețe.",
      alt: "Reprezentare schematică a unei găuri negre, cu o umbră centrală și un inel luminos de gaz în jurul ei.",
      color: "#15181f",
      accent: "#bd83c1",
      coordinates: { left: "93%", top: "88%", size: "clamp(68px, 8vw, 96px)" },
      related: ["crab-nebula", "light-travel-time", "andromeda"],
      source: "ESO · Prima imagine a găurii negre din centrul galaxiei noastre",
      sourceUrl: "https://www.eso.org/public/news/eso2208-eht-mw/",
      mission: {
        category: "Cer profund",
        type: "deep-space",
        meta: "Observare la distanță",
        arrival:
          "Racheta a fixat ținta la distanță sigură. Nicio apropiere suplimentară nu este permisă.",
        sceneImage: "/manus-storage/black-hole_83dbc7cc.jpg",
        sceneImageAlt:
          "Ilustrație văzută prin hublou a unei găuri negre, cu umbră centrală și inel luminos de gaz.",
      },
    },
    "28 septembrie 2026"
  ),
];

export const routes: AstroRoute[] = [
  {
    id: "solar-system",
    slug: "solar-system",
    title: "O plimbare prin Sistemul Solar",
    dek: "Începe cu lumi familiare, apoi lasă scara să-ți schimbe sentimentul de „acasă”.",
    outcome:
      "Vei înțelege cum diferă lumile vecine prin suprafață, atmosferă și orbită.",
    duration: "12 min",
    steps: ["earth", "moon", "mars", "scale-in-space"],
    tone: "brass",
  },
  {
    id: "seeing-the-past",
    slug: "seeing-the-past",
    title: "Cum vedem trecutul",
    dek: "Urmărește lumina care ajunge de la un vecin apropiat până la o galaxie întreagă.",
    outcome: "Vei putea lega distanța de vârsta luminii pe care o primești.",
    duration: "9 min",
    steps: ["moon", "sirius", "orion-nebula", "andromeda", "light-travel-time"],
    tone: "teal",
  },
  {
    id: "star-life",
    slug: "star-life",
    title: "Moartea și renașterea stelelor",
    dek: "Citește cerul ca pe un ciclu: praf, aprindere, lumină și întoarcere.",
    outcome:
      "Vei vedea cum o nebuloasă, o stea și o constelație pot aparține aceleiași povești.",
    duration: "11 min",
    steps: ["orion", "orion-nebula", "sirius", "light-travel-time"],
    tone: "coral",
  },
];

export const navItems = [
  { href: "/", label: "Explorează", short: "01" },
  { href: "/tonight", label: "În seara asta", short: "02" },
  { href: "/routes", label: "Trasee", short: "03" },
  { href: "/library", label: "Colecție", short: "04" },
  { href: "/saved", label: "Salvate", short: "05" },
];
export const footerLinks = [
  { href: "/about", label: "Metodă și surse" },
  { href: "/about#accessibility", label: "Accesibilitate" },
  { href: "/about#contact", label: "Contact" },
];
export const familyAccent: Record<string, string> = {
  "Lumi și luni": "#d8a95b",
  Stele: "#dce6ea",
  Constelații: "#f0ca7c",
  Nebuloase: "#7db7b3",
  Galaxii: "#c4a6bd",
  Concepte: "#e38d6e",
};
export const categoryDescription: Record<string, string> = {
  "Lumi și luni": "Lumi modelate de rocă, gheață, atmosferă și orbită.",
  Stele: "Cuptoare cosmice, însoțitoare și lumina trimisă prin timp.",
  Constelații: "Modele care capătă sens dintr-un anumit punct de vedere.",
  Nebuloase: "Nori de gaz și praf în care lumina prinde formă.",
  Galaxii:
    "Universuri-insulă alcătuite din stele, gaz, praf și materie întunecată.",
  Concepte: "Idei care schimbă felul în care înțelegem cerul.",
};
export const featuredObject = objects.find(item => item.id === "mars")!;
export const tonightObject = objects.find(item => item.id === "orion-nebula")!;
export const featuredRoute = routes.find(route => route.id === "solar-system")!;
export const collectionStats = [
  { value: objects.length, label: "exponate" },
  { value: 6, label: "familii" },
  { value: routes.length, label: "trasee" },
  { value: 34, label: "note de sursă" },
];
export const collectionNote =
  "O colecție compactă de lansare: suficientă pentru ca fiecare traseu să fie intenționat, suficient de mică pentru a păstra firul vizibil.";
export const sourcePolicy = [
  "Afirmațiile publicate sunt legate de o sursă verificată.",
  "Vizualurile precizează dacă sunt ilustrative, la scară relativă sau bazate pe date.",
  "Salvările locale rămân în acest navigator și nu se sincronizează cu un cont în versiunea 1.",
];
export const aboutSections = [
  {
    id: "method",
    label: "Metodă editorială",
    heading: "Un exponat ar trebui să-ți spună ce este.",
    body: "Asteria separă textul editorial de setările vizuale, etichetează fiecare alegere de scară și păstrează povestea lizibilă atunci când scena îmbunătățită nu este disponibilă.",
  },
  {
    id: "accessibility",
    label: "Accesibilitate și mișcare",
    heading: "Mișcare cu un scop.",
    body: "Deriva ambientală creează profunzime. Mișcarea camerei explică o relație. Tot restul se poate opri. Fiecare obiect din scenă are un echivalent semantic în listă.",
  },
  {
    id: "fallback",
    label: "Plan de rezervă tehnologic",
    heading: "Un plan de rezervă discret oferă totuși o experiență completă.",
    body: "Dacă WebGL nu este disponibil sau dispozitivul are nevoie de o pauză, Asteria schimbă perspectiva — nu arhitectura informației.",
  },
];

export const getObject = (slug?: string) =>
  objects.find(item => item.slug === slug);
export const getRoute = (slug?: string) =>
  routes.find(item => item.slug === slug);
export const getRelatedObjects = (item: AstroObject) =>
  item.related.map(getObject).filter(Boolean) as AstroObject[];
export const getRouteObjects = (route: AstroRoute) =>
  route.steps
    .map(id => objects.find(item => item.id === id))
    .filter(Boolean) as AstroObject[];
export const getRouteProgress = (
  route: AstroRoute,
  progress: Record<string, number>
) => Math.round(((progress[route.id] ?? 0) / route.steps.length) * 100);
export const readingTime = (item: AstroObject) =>
  Math.max(2, Math.round(item.body.split(" ").length / 45));
export const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[şţ]/g, letter => (letter === "ş" ? "s" : "t"));
export const getSearchText = (item: AstroObject) =>
  normalizeText(
    [
      item.name,
      item.commonName,
      item.family,
      item.eyebrow,
      item.summary,
      ...item.facts.map(fact => fact.value),
    ]
      .filter(Boolean)
      .join(" ")
  );
export const getFamilyObjects = (family: string) =>
  family === "Toate" ? objects : objects.filter(item => item.family === family);
export const getFamilyCount = (family: string) =>
  objects.filter(item => item.family === family).length;
export const getCitation = (item: AstroObject) =>
  `${item.source} · verificat la ${item.verifiedOn}`;
export const getPathSlug = (path: string) =>
  path.split("/").filter(Boolean).at(-1);
export const getSection = (path: string) =>
  path.startsWith("/object")
    ? "Colecție"
    : path.startsWith("/about")
      ? "Despre Asteria"
      : (navItems.find(item => item.href === path)?.label ?? "Explorează");
export const objectPath = (slug: string) => `/object/${slug}`;
export const routePath = (slug: string) => `/routes/${slug}`;
export const toggleId = (items: string[], id: string) =>
  items.includes(id) ? items.filter(item => item !== id) : [...items, id];
export const clampProgress = (value: number, total: number) =>
  Math.max(0, Math.min(total, value));
export const formatCount = (count: number) => String(count).padStart(2, "0");
export const getObjectTitle = (item: AstroObject) =>
  item.commonName ? `${item.name} — ${item.commonName}` : item.name;
export const getObjectMeta = (item: AstroObject) =>
  `${item.family} · ${readingTime(item)} min de lectură`;
export const getRouteMeta = (route: AstroRoute) =>
  `${route.steps.length} exponate · ${route.duration}`;
export const getRouteStepLabel = (index: number, total: number) =>
  `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
export const getRouteObject = (route: AstroRoute, index: number) =>
  getObject(route.steps[index]);
export const getRouteObjectsResolved = getRouteObjects;
export const getRouteObjectNames = (route: AstroRoute) =>
  getRouteObjects(route)
    .map(item => item.name)
    .join(" · ");
export const routeToneCuloare = (tone: string) =>
  tone === "teal" ? "#7db7b3" : tone === "coral" ? "#e38d6e" : "#d8a95b";
export const getFamilyAccent = (family: string) =>
  familyAccent[family] ?? "#d8a95b";
export const getFamilyLabel = (family: string) =>
  family === "Lumi și luni" ? "Lumi" : family;
export const getNextStory = (item: AstroObject) =>
  getRelatedObjects(item)[0] ?? featuredObject;
export const getModeNote = (item: AstroObject) =>
  `${item.visualMode}: ${item.visualCaption}`;
export const getObjectTip = (item: AstroObject) =>
  item.family === "Concepte" ? "idee" : "obiect";
export const getRouteStatus = (route: AstroRoute, progress: number) =>
  progress >= route.steps.length
    ? "Finalizat"
    : progress > 0
      ? "În desfășurare"
      : "Neînceput";
export const getLayer = (item: AstroObject, id: string) =>
  item.layers.find(layer => layer.id === id) ?? item.layers[0];
export const getDefaultLayer = (item: AstroObject) =>
  item.layers[0]?.id ?? "context";
export const getModeDescription = (mode: VisualMode) =>
  ({
    Ilustrativ: "Compoziție interpretativă.",
    "Scară relativă":
      "Unele măsurători sunt păstrate, iar altele sunt comprimate.",
    "Bazat pe date": "Ancorat într-o relație adnotată.",
  })[mode];
export const getSearchResultCount = (query: string) =>
  objects.filter(item =>
    getSearchText(item).includes(normalizeText(query.trim()))
  ).length;
export const getObjectPresentation = (item: AstroObject) => ({
  title: getObjectTitle(item),
  meta: getObjectMeta(item),
  source: getCitation(item),
});
export const getRoutePresentation = (route: AstroRoute) => ({
  title: route.title,
  meta: getRouteMeta(route),
  outcome: route.outcome,
});
export const getObjectExhibitDescription = (item: AstroObject) =>
  `${item.summary} ${item.visualCaption}`;
export const getRelatedReason = (item: AstroObject, related: AstroObject) =>
  item.family === related.family
    ? "Aceeași familie"
    : item.id === "light-travel-time" || related.id === "light-travel-time"
      ? "Timp și distanță"
      : "Următoarea idee";
export const getObjectCountLabel = (count: number) =>
  `${formatCount(count)} obiecte`;
export const getRouteCountLabel = (count: number) =>
  `${formatCount(count)} trasee`;
export const getFamilyCountLabel = (count: number) =>
  `${formatCount(count)} familii`;
export const getSourceCountLabel = (count: number) =>
  `${formatCount(count)} note de sursă`;
export const getObjectCount = () => objects.length;
export const getRouteCount = () => routes.length;
export const getFamilyCountTotal = () => 6;
export const getSourceCount = () => 34;
export const getObjectFamily = (item: AstroObject) => item.family;
export const getObjectSource = (item: AstroObject) => item.source;
export const getObjectReview = (item: AstroObject) => item.verifiedOn;
export const getObjectAlt = (item: AstroObject) => item.alt;
export const getObjectScale = (item: AstroObject) => item.scale;
export const getObjectScaleNote = (item: AstroObject) => item.scaleNote;
export const getObjectVisualCaption = (item: AstroObject) => item.visualCaption;
export const getObjectVisualMode = (item: AstroObject) => item.visualMode;
export const getObjectBody = (item: AstroObject) => item.body;
export const getObjectSummary = (item: AstroObject) => item.summary;
export const getObjectFacts = (item: AstroObject) => item.facts;
export const getObjectLayers = (item: AstroObject) => item.layers;
export const getObjectRelated = getRelatedObjects;
export const getObjectCoordinates = (item: AstroObject) => item.coordinates;
export const getObjectCuloare = (item: AstroObject) => item.color;
export const getObjectAccent = (item: AstroObject) => item.accent;
export const getObjectSlug = (item: AstroObject) => item.slug;
export const getObjectId = (item: AstroObject) => item.id;
export const getRouteId = (route: AstroRoute) => route.id;
export const getRouteSlug = (route: AstroRoute) => route.slug;
export const getRouteTitle = (route: AstroRoute) => route.title;
export const getRouteDek = (route: AstroRoute) => route.dek;
export const getRouteOutcome = (route: AstroRoute) => route.outcome;
export const getRouteDuration = (route: AstroRoute) => route.duration;
export const getRouteSteps = (route: AstroRoute) => route.steps;
export const getRouteTone = (route: AstroRoute) => routeToneCuloare(route.tone);
export const getObjectBySlug = getObject;
export const getRouteBySlug = getRoute;
export const astronomyDisclaimer =
  "Vizualizările Asteria explică relații; nu promit o hartă a cerului în timp real și exactă pentru observație.";
export const staticFieldDescription =
  "O experiență editorială completă, cu etichete, trasee, căutare, salvări și control prin tastatură.";
export const reducedMotionDescription =
  "Deriva camerei, mișcarea particulelor și tranzițiile devin schimbări statice de stare.";
export const emptySavedTitle = "Nu ai încă exponate salvate";
export const emptySavedBody =
  "Când ceva rămâne cu tine, salvează-l aici. Colecția ta rămâne în acest navigator și poate fi ștearsă prin datele browserului.";
export const emptySearchTitle = "Nu există exponate potrivite";
export const emptySearchBody =
  "Încearcă un nume comun, o familie sau o idee mai largă, precum scara ori lumina.";
export const permissionHeadline =
  "Lasă cerul să întâlnească locul tău — doar dacă este util.";
export const permissionBody =
  "Locația poate îmbunătăți sugestia pentru această seară, dar Asteria funcționează și fără ea. Alege un oraș, permite acces aproximativ sau rămâi la o poveste aleasă.";
export const privacyNote =
  "Selectorul de oraș nu cere acces la locație. Coordonatele aproximative sunt folosite doar în memoria sesiunii și nu se salvează.";
export const methodBullets = [
  "Fiecare exponat are un rezumat în limbaj clar, date esențiale, o legendă vizuală și o sursă.",
  "Scara este întotdeauna precizată: proporțională, comprimată, relativă sau ilustrativă.",
  "Explorarea nu necesită solicitare de locație, cont sau animație continuă.",
];
export const heroCopy = {
  kicker: "Un ghid pentru cei curioși",
  title: "Citește cerul\ncu puțin mai mult spațiu.",
  dek: "Asteria face spațiul ușor de explorat — un obiect, o relație, o explicație clară pe rând.",
  editorial: "Nota serii · Marte este o lume de rugină, vânt și apă străveche.",
};
export const sceneInstruction =
  "Trage de atlas pentru a schimba perspectiva. Selectează un reper pentru a deschide exponatul.";
export const footerNote =
  "Creat ca alternativă calmă la panourile generice generate de inteligența artificială.";
export const aboutContact =
  "Prototipul folosește o colecție demonstrativă atent aleasă; versiunea finală ar adăuga un responsabil editorial și o dată oficială de verificare pentru fiecare înregistrare.";
export const appMetaDescription =
  "Asteria este un ghid calm și accesibil de astronomie, cu atlas spațial, exponate verifiedOn și trasee ghidate.";
export const storyPrompts = [
  "Urmărește drumul unei stele căzătoare",
  "Găsește o lume cu vreme",
  "Vezi cum distanța devine timp",
];
export const nowLabel = "17 septembrie 2026";
export const localSaveKey = "asteria-saved-v1";
export const localProgressKey = "asteria-route-progress-v1";
export const localMotionKey = "asteria-reduced-motion-v1";
export const localFallbackKey = "asteria-static-view-v1";
