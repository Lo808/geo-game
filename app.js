const COUNTRIES_URL = "https://raw.githubusercontent.com/mledoze/countries/master/countries.json";
const GEOJSON_URL = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson";
const ROUND_COUNT = 10;
const MAX_ATTEMPTS = 3;
const palette = ["#f1c75b", "#e58f65", "#74ad91", "#6da6bf", "#cf8590", "#9bb875", "#d9aa62", "#82a7a0"];
const LINK_CHALLENGES = [
  { title: "Terres du tigre", prompt: "Trouve 3 pays où vivent des tigres sauvages", required: 3, codes: ["BGD", "BTN", "CHN", "IND", "IDN", "MYS", "MMR", "NPL", "RUS", "THA"] },
  { title: "Le G7", prompt: "Trouve 5 pays membres du G7", required: 5, codes: ["CAN", "FRA", "DEU", "ITA", "JPN", "GBR", "USA"] },
  { title: "Mundo hispano", prompt: "Trouve 4 pays où l’espagnol est langue officielle", required: 4, language: "spa" },
  { title: "Pays nordiques", prompt: "Trouve les 5 pays nordiques", required: 5, codes: ["DNK", "FIN", "ISL", "NOR", "SWE"] },
  { title: "Forêt amazonienne", prompt: "Trouve 4 pays traversés par l’Amazonie", required: 4, codes: ["BOL", "BRA", "COL", "ECU", "GUY", "PER", "SUR", "VEN"] },
  { title: "Pays mégadivers", prompt: "Trouve 5 pays parmi les plus riches en biodiversité", required: 5, codes: ["AUS", "BRA", "CHN", "COL", "COD", "ECU", "IND", "IDN", "MDG", "MEX", "MYS", "PER", "PHL", "PNG", "USA", "VEN", "ZAF"] },
  { title: "Le Sahara", prompt: "Trouve 5 pays traversés par le désert du Sahara", required: 5, codes: ["DZA", "TCD", "EGY", "LBY", "MLI", "MRT", "MAR", "NER", "SDN", "TUN"] },
  { title: "L’Himalaya", prompt: "Trouve 4 pays dont le territoire touche l’Himalaya", required: 4, codes: ["BTN", "CHN", "IND", "NPL", "PAK"] },
  { title: "La cordillère des Andes", prompt: "Trouve 5 pays traversés par les Andes", required: 5, codes: ["ARG", "BOL", "CHL", "COL", "ECU", "PER", "VEN"] },
  { title: "L’arc alpin", prompt: "Trouve 5 pays possédant une partie des Alpes", required: 5, codes: ["AUT", "FRA", "DEU", "ITA", "LIE", "MCO", "SVN", "CHE"] },
  { title: "Ceinture de feu", prompt: "Trouve 5 pays de la ceinture de feu du Pacifique", required: 5, codes: ["CAN", "CHL", "COL", "ECU", "IDN", "JPN", "MEX", "NZL", "PNG", "PER", "PHL", "RUS", "USA"] },
  { title: "Triangle de corail", prompt: "Trouve 4 pays du Triangle de corail", required: 4, codes: ["IDN", "MYS", "PHL", "PNG", "TLS", "SLB"] },
  { title: "Sur l’équateur", prompt: "Trouve 5 pays traversés par l’équateur", required: 5, codes: ["BRA", "COL", "ECU", "GAB", "COG", "COD", "UGA", "KEN", "SOM", "IDN"] },
  { title: "Le bassin du Nil", prompt: "Trouve 5 pays du bassin ou du cours du Nil", required: 5, codes: ["BDI", "COD", "EGY", "ERI", "ETH", "KEN", "RWA", "SSD", "SDN", "TZA", "UGA"] },
  { title: "Le Danube", prompt: "Trouve 5 pays traversés ou bordés par le Danube", required: 5, codes: ["AUT", "BGR", "HRV", "DEU", "HUN", "MDA", "ROU", "SRB", "SVK", "UKR"] },
  { title: "Le Mékong", prompt: "Trouve 4 pays traversés ou bordés par le Mékong", required: 4, codes: ["CHN", "MMR", "LAO", "THA", "KHM", "VNM"] },
  { title: "Le Rhin", prompt: "Trouve 4 pays traversés ou bordés par le Rhin", required: 4, codes: ["CHE", "LIE", "AUT", "DEU", "FRA", "NLD"] },
  { title: "Le fleuve Niger", prompt: "Trouve les 5 pays traversés par le fleuve Niger", required: 5, codes: ["GIN", "MLI", "NER", "BEN", "NGA"] },
  { title: "Le Zambèze", prompt: "Trouve 5 pays du bassin du Zambèze", required: 5, codes: ["AGO", "BWA", "MWI", "MOZ", "NAM", "TZA", "ZMB", "ZWE"] },
  { title: "Le Congo", prompt: "Trouve 5 pays appartenant au bassin du fleuve Congo", required: 5, codes: ["AGO", "BDI", "CMR", "CAF", "COD", "COG", "RWA", "TZA", "ZMB"] },
  { title: "Le Gange et le Brahmapoutre", prompt: "Trouve 4 pays du système Gange-Brahmapoutre", required: 4, codes: ["BGD", "BTN", "CHN", "IND", "NPL"] },
  { title: "Le Tigre et l’Euphrate", prompt: "Trouve 4 pays du bassin Tigre-Euphrate", required: 4, codes: ["IRN", "IRQ", "SYR", "TUR"] },
  { title: "Le Paraná", prompt: "Trouve 3 pays traversés par le Paraná", required: 3, codes: ["ARG", "BRA", "PRY"] },
  { title: "Forêt du bassin du Congo", prompt: "Trouve 5 pays couverts par la forêt du bassin du Congo", required: 5, codes: ["CMR", "CAF", "COD", "COG", "GNQ", "GAB"] },
  { title: "Forêts de Bornéo", prompt: "Trouve les 3 pays qui se partagent l’île et les forêts de Bornéo", required: 3, codes: ["BRN", "IDN", "MYS"] },
  { title: "La taïga", prompt: "Trouve 5 pays possédant de vastes forêts boréales", required: 5, codes: ["CAN", "USA", "RUS", "FIN", "SWE", "NOR"] },
  { title: "Les Sundarbans", prompt: "Trouve les 2 pays qui se partagent les Sundarbans", required: 2, codes: ["BGD", "IND"] },
  { title: "Forêt valdivienne", prompt: "Trouve les 2 pays abritant la forêt tempérée valdivienne", required: 2, codes: ["ARG", "CHL"] },
  { title: "Les montagnes Rocheuses", prompt: "Trouve les 2 pays traversés par les montagnes Rocheuses", required: 2, codes: ["CAN", "USA"] },
  { title: "Les montagnes de l’Atlas", prompt: "Trouve les 3 pays traversés par le massif de l’Atlas", required: 3, codes: ["DZA", "MAR", "TUN"] },
  { title: "Le Caucase", prompt: "Trouve 4 pays du massif du Caucase", required: 4, codes: ["ARM", "AZE", "GEO", "RUS"] },
  { title: "Les Carpates", prompt: "Trouve 5 pays traversés par les Carpates", required: 5, codes: ["CZE", "HUN", "POL", "ROU", "SRB", "SVK", "UKR"] },
  { title: "Le Tian Shan", prompt: "Trouve 4 pays du massif du Tian Shan", required: 4, codes: ["CHN", "KAZ", "KGZ", "UZB"] },
  { title: "La vallée du Grand Rift", prompt: "Trouve 5 pays traversés par la vallée du Grand Rift", required: 5, codes: ["ETH", "KEN", "UGA", "RWA", "BDI", "TZA", "MWI", "MOZ"] },
  { title: "Les Pyrénées", prompt: "Trouve les 2 grands pays traversés par les Pyrénées", required: 2, codes: ["ESP", "FRA"] },
  { title: "Les chutes Victoria", prompt: "Trouve les 2 pays séparés par les chutes Victoria", required: 2, codes: ["ZMB", "ZWE"] },
  { title: "Les chutes d’Iguazú", prompt: "Trouve les 2 pays qui se partagent les chutes d’Iguazú", required: 2, codes: ["ARG", "BRA"] },
  { title: "Les chutes du Niagara", prompt: "Trouve les 2 pays qui se partagent les chutes du Niagara", required: 2, codes: ["CAN", "USA"] },
  { title: "Le mont Everest", prompt: "Trouve les 2 pays situés de part et d’autre de l’Everest", required: 2, codes: ["CHN", "NPL"] },
  { title: "Le Serengeti-Mara", prompt: "Trouve les 2 pays de l’écosystème Serengeti-Mara", required: 2, codes: ["KEN", "TZA"] },
  { title: "La Patagonie", prompt: "Trouve les 2 pays qui se partagent la Patagonie", required: 2, codes: ["ARG", "CHL"] },
  { title: "Le Pantanal", prompt: "Trouve les 3 pays qui se partagent le Pantanal", required: 3, codes: ["BOL", "BRA", "PRY"] },
  { title: "Le delta de l’Okavango", prompt: "Trouve 3 pays liés au bassin et au delta de l’Okavango", required: 3, codes: ["AGO", "BWA", "NAM"] },
  { title: "Le lac Victoria", prompt: "Trouve les 3 pays qui bordent le lac Victoria", required: 3, codes: ["KEN", "TZA", "UGA"] },
  { title: "La mer Caspienne", prompt: "Trouve les 5 pays qui bordent la mer Caspienne", required: 5, codes: ["AZE", "IRN", "KAZ", "RUS", "TKM"] },
  { title: "La mer d’Aral", prompt: "Trouve les 2 pays qui se partagent la mer d’Aral", required: 2, codes: ["KAZ", "UZB"] },
  { title: "Autour de la Méditerranée", prompt: "Trouve 6 pays possédant une côte méditerranéenne", required: 6, codes: ["ALB", "DZA", "BIH", "HRV", "CYP", "EGY", "FRA", "GRC", "ISR", "ITA", "LBN", "LBY", "MLT", "MNE", "MAR", "PSE", "SVN", "ESP", "SYR", "TUN", "TUR"] },
  { title: "Autour de la Baltique", prompt: "Trouve 5 pays bordant la mer Baltique", required: 5, codes: ["DNK", "EST", "FIN", "DEU", "LVA", "LTU", "POL", "RUS", "SWE"] },
  { title: "Sans accès à la mer", prompt: "Trouve 5 pays entièrement enclavés", required: 5, matches: (country) => country.landlocked === true },
  { title: "Géants du monde", prompt: "Trouve 5 pays dépassant un million de km²", required: 5, matches: (country) => country.area > 1000000 },
  { title: "Deux continents", prompt: "Trouve 4 pays considérés comme transcontinentaux", required: 4, codes: ["EGY", "FRA", "GEO", "IDN", "KAZ", "RUS", "ESP", "TUR"] },
  { title: "Grands archipels", prompt: "Trouve 4 États constitués de grands archipels", required: 4, codes: ["IDN", "JPN", "PHL", "NZL", "FJI", "MDG", "PNG", "GBR"] },
  { title: "Mundo lusófono", prompt: "Trouve 4 pays où le portugais est langue officielle", required: 4, language: "por" },
  { title: "Monde arabe", prompt: "Trouve 5 pays où l’arabe est langue officielle", required: 5, language: "ara" },
  { title: "Conduite à gauche", prompt: "Trouve 5 pays où l’on roule à gauche", required: 5, codes: ["AUS", "BGD", "BWA", "CYP", "IND", "IDN", "IRL", "JAM", "JPN", "KEN", "MYS", "MLT", "NAM", "NPL", "NZL", "PAK", "SGP", "ZAF", "LKA", "THA", "GBR", "ZMB", "ZWE"] },
  { title: "La croix sur le drapeau", prompt: "Trouve 4 pays dont le drapeau arbore une grande croix", required: 4, codes: ["DNK", "DOM", "FIN", "GEO", "ISL", "NOR", "SWE", "CHE", "GBR"] },
  { title: "Les BRICS fondateurs", prompt: "Trouve les 5 membres fondateurs des BRICS", required: 5, codes: ["BRA", "RUS", "IND", "CHN", "ZAF"] },
];
const LEARNING_LANDMARK_TITLES = new Set([
  "Forêt amazonienne", "Pays mégadivers", "Le Sahara", "L’Himalaya", "La cordillère des Andes", "L’arc alpin",
  "Ceinture de feu", "Triangle de corail", "Le bassin du Nil", "Le Danube", "Le Mékong", "Le Rhin", "Le fleuve Niger",
  "Le Zambèze", "Le Congo", "Le Gange et le Brahmapoutre", "Le Tigre et l’Euphrate", "Le Paraná",
  "Forêt du bassin du Congo", "Forêts de Bornéo", "La taïga", "Les Sundarbans", "Forêt valdivienne",
  "Les montagnes Rocheuses", "Les montagnes de l’Atlas", "Le Caucase", "Les Carpates", "Le Tian Shan",
  "La vallée du Grand Rift", "Les Pyrénées", "Les chutes Victoria", "Les chutes d’Iguazú", "Les chutes du Niagara",
  "Le mont Everest", "Le Serengeti-Mara", "La Patagonie", "Le Pantanal", "Le delta de l’Okavango", "Le lac Victoria",
]);

const elements = {
  score: document.querySelector("#score"),
  streak: document.querySelector("#streak"),
  round: document.querySelector("#round"),
  roundTotal: document.querySelector("#round-total"),
  questionArea: document.querySelector("#question-area"),
  question: document.querySelector("#question"),
  detail: document.querySelector("#question-detail"),
  prompt: document.querySelector("#prompt-label"),
  flagFrame: document.querySelector("#flag-frame"),
  flag: document.querySelector("#flag-image"),
  feedback: document.querySelector("#feedback"),
  attempts: document.querySelector("#attempt-dots"),
  attemptsRow: document.querySelector("#attempts-row"),
  foundCount: document.querySelector("#found-count"),
  goalCount: document.querySelector("#goal-count"),
  hint: document.querySelector("#hint-button"),
  learningControls: document.querySelector("#learning-controls"),
  regionSelect: document.querySelector("#region-select"),
  mapStatus: document.querySelector("#map-status"),
  burst: document.querySelector("#result-burst"),
  modal: document.querySelector("#end-modal"),
  finalScore: document.querySelector("#final-score"),
  endMessage: document.querySelector("#end-message"),
  gamePanel: document.querySelector(".game-panel"),
  learningHub: document.querySelector("#learning-hub"),
  learningHome: document.querySelector("#learning-home"),
  learningRegion: document.querySelector("#learning-region"),
  learningSession: document.querySelector("#learning-map-session"),
  learningSessionRound: document.querySelector("#learning-session-round"),
  learningSessionScore: document.querySelector("#learning-session-score"),
  learningSessionLives: document.querySelector("#learning-session-lives"),
  learningSessionFeedback: document.querySelector("#learning-session-feedback"),
  learningSessionPrompt: document.querySelector("#learning-session-prompt"),
  learningSessionKind: document.querySelector("#learning-session-kind"),
  learningSessionQuestion: document.querySelector("#learning-session-question"),
  learningSessionFlag: document.querySelector("#learning-session-flag"),
  learningResult: document.querySelector("#learning-session-result"),
  learningResultScore: document.querySelector("#learning-result-score"),
  learningResultMessage: document.querySelector("#learning-result-message"),
};

const state = {
  countries: [],
  geoData: null,
  layersByCode: new Map(),
  mode: "country",
  target: null,
  score: 0,
  streak: 0,
  round: 1,
  attempts: MAX_ATTEMPTS,
  locked: true,
  usedCodes: new Set(),
  hintUsed: false,
  route: null,
  challenge: null,
  learning: null,
  progress: 0,
};

const map = L.map("map", {
  center: [18, 8],
  zoom: 2,
  minZoom: 1.45,
  maxZoom: 7,
  zoomSnap: 0.25,
  worldCopyJump: false,
  maxBounds: [[-75, -190], [88, 190]],
  maxBoundsViscosity: 0.8,
  attributionControl: true,
});
map.attributionControl.setPrefix(false);

function geoCode(feature) {
  const properties = feature.properties;
  return [properties.ADM0_A3, properties.ISO_A3, properties.SOV_A3].find((code) => code && code !== "-99");
}

function colorForCode(code = "") {
  const hash = [...code].reduce((total, character) => total + character.charCodeAt(0), 0);
  return palette[hash % palette.length];
}

function baseStyle(feature) {
  return {
    className: "country-shape",
    color: "#fffdf8",
    fillColor: colorForCode(geoCode(feature)),
    fillOpacity: 0.78,
    opacity: 1,
    weight: 0.8,
  };
}

async function loadGame() {
  try {
    const [countriesResponse, geoResponse] = await Promise.all([fetch(COUNTRIES_URL), fetch(GEOJSON_URL)]);
    if (!countriesResponse.ok || !geoResponse.ok) throw new Error("Une source de données ne répond pas.");

    const [countries, geoData] = await Promise.all([countriesResponse.json(), geoResponse.json()]);
    if (!Array.isArray(countries)) {
      throw new Error(countries.message || "La base des pays a renvoyé un format inattendu.");
    }
    if (!Array.isArray(geoData.features)) {
      throw new Error("Les frontières ont renvoyé un format inattendu.");
    }
    const featureCodes = new Set(geoData.features.map(geoCode));
    state.countries = countries
      .filter((country) => country.cca3 && country.cca2 && featureCodes.has(country.cca3) && country.capital?.length)
      .map((country) => ({
        ...country,
        flags: {
          svg: `https://flagcdn.com/${country.cca2.toLowerCase()}.svg`,
          alt: `Drapeau de ${country.translations?.fra?.common || country.name.common}`,
        },
      }));
    state.geoData = geoData;

    L.geoJSON(geoData, {
      style: baseStyle,
      onEachFeature: (feature, layer) => {
        const code = geoCode(feature);
        if (code) state.layersByCode.set(code, layer);
        layer.on({
          click: () => handleGuess(code, layer),
          mouseover: () => !state.locked && layer.bringToFront(),
        });
      },
    }).addTo(map);

    map.attributionControl.addAttribution('Frontières <a href="https://www.naturalearthdata.com/">Natural Earth</a>');
    elements.mapStatus.classList.add("ready");
    state.locked = false;
    startRound();
  } catch (error) {
    elements.mapStatus.classList.add("error");
    elements.mapStatus.innerHTML = "Impossible de charger les données. Vérifie ta connexion puis recharge la page.";
    setFeedback("error", "Connexion impossible", error.message);
  }
}

function startRound() {
  resetMapStyles();
  setLearningUi(state.mode === "learning");
  if (state.mode === "learning") return startLearningRound();
  if (state.mode === "route") return startRouteRound();
  if (state.mode === "links") return startLinkRound();
  if (state.usedCodes.size >= state.countries.length) state.usedCodes.clear();
  const available = state.countries.filter((country) => !state.usedCodes.has(country.cca3));
  state.target = available[Math.floor(Math.random() * available.length)];
  state.usedCodes.add(state.target.cca3);
  state.attempts = MAX_ATTEMPTS;
  state.progress = 0;
  state.hintUsed = false;
  state.locked = false;
  elements.hint.disabled = false;
  updateQuestion();
  updateHud();
  hideFeedback();
}

function startLearningRound() {
  state.learning = null;
  elements.learningHome.classList.remove("hidden");
  elements.learningSession.classList.add("hidden");
  elements.learningResult.classList.add("hidden");
  resetMapStyles();
  map.setView([18, 8], 2);
  hideFeedback();
}

function setLearningUi(active) {
  document.body.classList.toggle("learning-mode", active);
  elements.learningHub.classList.toggle("hidden", !active);
  elements.gamePanel.classList.toggle("hidden", active);
  elements.roundTotal.textContent = active ? 10 : ROUND_COUNT;
}

function buildLearningItems(category, region = "all") {
  if (category === "landmarks") {
    return LINK_CHALLENGES
      .filter((challenge) => LEARNING_LANDMARK_TITLES.has(challenge.title))
      .map((challenge) => ({ title: challenge.title, codes: challenge.codes.filter((code) => state.layersByCode.has(code)) }))
      .filter((item) => item.codes.length);
  }
  return state.countries
    .filter((country) => region === "all" || country.region === region)
    .sort((first, second) => displayName(first).localeCompare(displayName(second), "fr"))
    .map((country) => ({
      title: category === "capitals" ? country.capital[0] : displayName(country),
      country,
      codes: [country.cca3],
    }));
}

function startLearningSession(category) {
  const region = elements.learningRegion.value;
  const items = shuffleItems(buildLearningItems(category, region)).slice(0, 10);
  state.learning = {
    category,
    region,
    items,
    index: 0,
    score: 0,
    attempts: MAX_ATTEMPTS,
    locked: false,
  };
  state.locked = false;
  elements.learningHome.classList.add("hidden");
  elements.learningResult.classList.add("hidden");
  elements.learningSession.classList.remove("hidden");
  showLearningSessionQuestion();
}

function shuffleItems(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

function showLearningSessionQuestion() {
  const session = state.learning;
  const item = session.items[session.index];
  session.attempts = MAX_ATTEMPTS;
  session.locked = false;
  resetMapStyles();
  map.setView([18, 8], 2);
  elements.learningSessionRound.textContent = session.index + 1;
  elements.learningSessionScore.textContent = session.score;
  elements.learningSessionFeedback.classList.add("hidden");
  elements.learningSessionKind.textContent = ({ countries: "PAYS", capitals: "CAPITALE", flags: "DRAPEAU", landmarks: "LANDMARK" })[session.category];
  elements.learningSessionFlag.classList.toggle("hidden", session.category !== "flags");
  if (session.category === "flags") {
    elements.learningSessionFlag.src = item.country.flags.svg;
    elements.learningSessionQuestion.textContent = "Clique sur le pays de ce drapeau";
  } else if (session.category === "capitals") {
    elements.learningSessionQuestion.textContent = item.title;
  } else if (session.category === "landmarks") {
    elements.learningSessionQuestion.textContent = item.title;
  } else {
    elements.learningSessionQuestion.textContent = displayName(item.country);
  }
  updateLearningSessionLives();
}

function answerLearningSession(code, layer) {
  const session = state.learning;
  if (!session || session.locked) return;
  const item = session.items[session.index];
  if (item.codes.includes(code)) {
    session.locked = true;
    session.score += 1;
    styleResult(layer, true);
    elements.learningSessionScore.textContent = session.score;
    showLearningSessionFeedback(true, item);
    window.setTimeout(advanceLearningSession, 1100);
    return;
  }
  session.attempts -= 1;
  styleResult(layer, false);
  updateLearningSessionLives();
  if (session.attempts === 0) {
    session.locked = true;
    item.codes.forEach((validCode) => {
      const validLayer = state.layersByCode.get(validCode);
      if (validLayer) styleResult(validLayer, true);
    });
    showLearningSessionFeedback(false, item);
    window.setTimeout(advanceLearningSession, 1500);
  }
}

function showLearningSessionFeedback(correct, item) {
  const names = item.codes.map((code) => displayName(state.countries.find((country) => country.cca3 === code))).join(" · ");
  elements.learningSessionFeedback.textContent = correct ? "Bonne réponse" : `Réponse : ${names}`;
  elements.learningSessionFeedback.className = `learning-session-feedback ${correct ? "success" : "error"}`;
}

function updateLearningSessionLives() {
  [...elements.learningSessionLives.children].forEach((life, index) => life.classList.toggle("used", index >= state.learning.attempts));
}

function advanceLearningSession() {
  state.learning.index += 1;
  if (state.learning.index >= state.learning.items.length) {
    finishLearningSession();
    return;
  }
  showLearningSessionQuestion();
}

function finishLearningSession() {
  elements.learningSession.classList.add("hidden");
  elements.learningResult.classList.remove("hidden");
  elements.learningResultScore.textContent = state.learning.score;
  elements.learningResultMessage.textContent = state.learning.score >= 8
    ? "Très solide. Tes repères sont précis."
    : state.learning.score >= 5
      ? "Bonne base. Une nouvelle session consolidera tes acquis."
      : "Continue à explorer la carte puis retente cette catégorie.";
}

function closeLearningSession() {
  elements.learningSession.classList.add("hidden");
  elements.learningResult.classList.add("hidden");
  elements.learningHome.classList.remove("hidden");
  state.learning = null;
  resetMapStyles();
  map.setView([18, 8], 2);
}

function startRouteRound() {
  const playable = state.countries.filter((country) => country.borders?.some((code) => state.layersByCode.has(code)));
  let route = null;
  for (let attempt = 0; attempt < 150 && !route; attempt += 1) {
    const start = playable[Math.floor(Math.random() * playable.length)];
    const goal = playable[Math.floor(Math.random() * playable.length)];
    const shortest = findShortestRoute(start.cca3, goal.cca3);
    if (shortest && shortest.length >= 4 && shortest.length <= 7) {
      route = { start, goal, shortest, selected: [start.cca3], mistakes: 0 };
    }
  }
  if (!route) throw new Error("Impossible de générer un trajet frontalier.");
  state.route = route;
  state.target = route.goal;
  prepareSpecialRound();
  styleRouteMap();
  hideFeedback();
}

function startLinkRound() {
  const definition = LINK_CHALLENGES[Math.floor(Math.random() * LINK_CHALLENGES.length)];
  const validCodes = state.countries
    .filter((country) => definition.matches?.(country)
      || (definition.language && country.languages?.[definition.language])
      || definition.codes?.includes(country.cca3))
    .map((country) => country.cca3);
  state.challenge = { ...definition, validCodes: new Set(validCodes), selected: new Set(), mistakes: 0 };
  state.target = null;
  prepareSpecialRound();
  hideFeedback();
}

function prepareSpecialRound() {
  state.attempts = MAX_ATTEMPTS;
  state.hintUsed = false;
  state.locked = false;
  elements.hint.disabled = false;
  updateQuestion();
  updateHud();
}

function findShortestRoute(startCode, goalCode) {
  if (startCode === goalCode) return [startCode];
  const countriesByCode = new Map(state.countries.map((country) => [country.cca3, country]));
  const queue = [[startCode]];
  const visited = new Set([startCode]);
  while (queue.length) {
    const path = queue.shift();
    const current = countriesByCode.get(path[path.length - 1]);
    for (const neighbor of current?.borders || []) {
      if (visited.has(neighbor) || !countriesByCode.has(neighbor) || !state.layersByCode.has(neighbor)) continue;
      const nextPath = [...path, neighbor];
      if (neighbor === goalCode) return nextPath;
      visited.add(neighbor);
      queue.push(nextPath);
    }
  }
  return null;
}

function updateQuestion() {
  elements.questionArea.classList.toggle("hidden", !["flag", "learning"].includes(state.mode));
  if (state.mode === "learning") {
    const languages = Object.values(state.target.languages || {}).slice(0, 3).join(", ");
    const area = new Intl.NumberFormat("fr-FR").format(state.target.area);
    elements.flagFrame.classList.remove("hidden");
    elements.flag.src = state.target.flags.svg;
    elements.flag.alt = state.target.flags.alt;
    elements.prompt.textContent = `APPRENDRE · ${regionName(state.target.region).toUpperCase()}`;
    elements.question.textContent = displayName(state.target);
    elements.detail.textContent = `Capitale : ${state.target.capital[0]} · ${area} km²${languages ? ` · ${languages}` : ""}`;
    animateQuestion();
    return;
  }
  if (state.mode === "route") {
    elements.flagFrame.classList.add("hidden");
    elements.prompt.textContent = `MINIMUM : ${state.route.shortest.length - 1} FRONTIÈRES`;
    elements.question.textContent = `${displayName(state.route.start)} → ${displayName(state.route.goal)}`;
    elements.detail.textContent = `Relie ${displayName(state.route.start)} à ${displayName(state.route.goal)} uniquement par des pays adjacents.`;
    animateQuestion();
    return;
  }
  if (state.mode === "links") {
    elements.flagFrame.classList.add("hidden");
    elements.prompt.textContent = `DÉFI THÉMATIQUE · ${state.challenge.required} PAYS`;
    elements.question.textContent = state.challenge.title;
    elements.detail.textContent = state.challenge.prompt;
    animateQuestion();
    return;
  }

  const countryName = displayName(state.target);
  elements.flagFrame.classList.toggle("hidden", state.mode !== "flag");
  elements.flag.src = state.target.flags.svg;
  elements.flag.alt = `Drapeau à identifier : ${state.target.flags.alt || "pays mystère"}`;

  if (state.mode === "flag") {
    elements.prompt.textContent = "À QUEL PAYS APPARTIENT CE DRAPEAU ?";
    elements.question.textContent = "Pays mystère";
    elements.detail.textContent = "Trouve sur la carte le pays de ce drapeau.";
  } else if (state.mode === "capital") {
    elements.prompt.textContent = "SITUE LE PAYS DE CETTE CAPITALE";
    elements.question.textContent = state.target.capital[0];
    elements.detail.textContent = `Trouve le pays dont la capitale est ${state.target.capital[0]}.`;
  } else {
    elements.prompt.textContent = "TROUVE CE PAYS";
    elements.question.textContent = countryName;
    const emphasizedCountry = document.createElement("strong");
    emphasizedCountry.textContent = countryName;
    elements.detail.replaceChildren("Trouve ", emphasizedCountry, " sur la carte.");
  }

  animateQuestion();
}

function animateQuestion() {
  elements.questionArea.style.animation = "none";
  requestAnimationFrame(() => { elements.questionArea.style.animation = ""; });
}

function handleGuess(code, layer) {
  if (state.locked || !code) return;
  if (state.mode === "learning") return answerLearningSession(code, layer);
  if (state.mode === "route") return handleRouteGuess(code, layer);
  if (state.mode === "links") return handleLinkGuess(code, layer);
  if (!state.target) return;
  if (code === state.target.cca3) {
    state.locked = true;
    state.progress = 1;
    const earned = Math.max(300, 1000 - (MAX_ATTEMPTS - state.attempts) * 250 - (state.hintUsed ? 100 : 0));
    state.score += earned;
    state.streak += 1;
    styleResult(layer, true);
    burstConfetti();
    setFeedback("success", `Bien vu ! +${earned}`, `${displayName(state.target)} · ${state.target.capital[0]}`);
    updateHud();
    window.setTimeout(advanceRound, 1100);
    return;
  }

  state.attempts -= 1;
  state.streak = 0;
  styleResult(layer, false);
  const guessedCountry = state.countries.find((country) => country.cca3 === code);
  setFeedback("error", "Pas tout à fait", guessedCountry ? `Tu as cliqué sur ${displayName(guessedCountry)}.` : "Essaie un autre pays.");
  updateHud();

  if (state.attempts === 0) {
    state.locked = true;
    revealTarget();
    setFeedback("error", `C’était ${displayName(state.target)}`, `Capitale : ${state.target.capital[0]}`);
    window.setTimeout(advanceRound, 1500);
  }
}

function handleRouteGuess(code, layer) {
  const currentCode = state.route.selected[state.route.selected.length - 1];
  const current = state.countries.find((country) => country.cca3 === currentCode);
  if (state.route.selected.includes(code)) {
    styleResult(layer, false);
    setFeedback("error", "Pays déjà traversé", "Poursuis avec un nouveau pays frontalier.");
    return;
  }
  if (!current?.borders?.includes(code)) {
    state.attempts -= 1;
    state.route.mistakes += 1;
    state.streak = 0;
    styleResult(layer, false);
    setFeedback("error", "Pas de frontière commune", state.attempts ? "Ce pays ne touche pas la dernière étape de ton trajet." : "Le chemin optimal apparaît en vert.");
    updateHud();
    if (state.attempts === 0) {
      state.locked = true;
      state.route.shortest.forEach((routeCode) => {
        state.layersByCode.get(routeCode)?.setStyle({ fillColor: "#176b4d", fillOpacity: 1, color: "#0b5b3d", weight: 3 });
      });
      window.setTimeout(advanceRound, 1800);
    }
    return;
  }
  state.route.selected.push(code);
  styleRouteMap();
  updateHud();
  if (code === state.route.goal.cca3) return finishRouteRound();
  const country = state.countries.find((candidate) => candidate.cca3 === code);
  setFeedback("success", `${displayName(country)} rejoint`, "Continue depuis ce pays vers un voisin.");
}

function finishRouteRound() {
  state.locked = true;
  const moves = state.route.selected.length - 1;
  const minimum = state.route.shortest.length - 1;
  const optimal = moves === minimum;
  const earned = Math.max(300, 1400 - (moves - minimum) * 150 - state.route.mistakes * 100 - (state.hintUsed ? 100 : 0));
  state.score += earned;
  state.streak = optimal ? state.streak + 1 : 0;
  burstConfetti();
  setFeedback("success", optimal ? `Chemin parfait ! +${earned}` : `Destination atteinte ! +${earned}`, `${moves} frontières traversées, minimum ${minimum}.`);
  updateHud();
  window.setTimeout(advanceRound, 1600);
}

function handleLinkGuess(code, layer) {
  if (state.challenge.selected.has(code)) {
    setFeedback("neutral", "Déjà trouvé", "Ce pays compte déjà dans tes réponses.");
    return;
  }
  if (!state.challenge.validCodes.has(code)) {
    state.attempts -= 1;
    state.challenge.mistakes += 1;
    state.streak = 0;
    styleResult(layer, false);
    setFeedback("error", "Ce pays ne correspond pas", state.attempts ? "Observe le thème et essaie ailleurs." : "Les réponses possibles apparaissent en vert.");
    updateHud();
    if (state.attempts === 0) {
      state.locked = true;
      revealChallengeAnswers();
      window.setTimeout(advanceRound, 1800);
    }
    return;
  }
  state.challenge.selected.add(code);
  layer.setStyle({ fillColor: "#176b4d", fillOpacity: 1, color: "#0b5b3d", weight: 3 });
  layer.getElement()?.classList.add("country-correct");
  const found = state.challenge.selected.size;
  updateHud();
  if (found >= state.challenge.required) return finishLinkRound();
  setFeedback("success", `Bonne réponse · ${found}/${state.challenge.required}`, "Continue, il en reste encore.");
}

function finishLinkRound() {
  state.locked = true;
  const earned = Math.max(400, state.challenge.required * 300 - state.challenge.mistakes * 100 - (state.hintUsed ? 100 : 0));
  state.score += earned;
  state.streak += 1;
  burstConfetti();
  setFeedback("success", `Défi réussi ! +${earned}`, `${state.challenge.required} pays reliés par le même thème.`);
  updateHud();
  window.setTimeout(advanceRound, 1500);
}

function revealChallengeAnswers() {
  state.challenge.validCodes.forEach((code) => {
    state.layersByCode.get(code)?.setStyle({ fillColor: "#176b4d", fillOpacity: 1, color: "#0b5b3d", weight: 2 });
  });
}

function routeProgressText() {
  const names = state.route.selected.map((code) => displayName(state.countries.find((country) => country.cca3 === code)));
  return `Ton trajet : ${names.join(" → ")}`;
}

function styleRouteMap() {
  resetMapStyles();
  state.route.selected.forEach((code, index) => {
    const layer = state.layersByCode.get(code);
    layer?.setStyle({ fillColor: index === 0 ? "#f0bd4b" : "#176b4d", fillOpacity: 1, color: "#fffdf8", weight: 3 });
    layer?.getElement()?.classList.add("country-route");
  });
  const goalLayer = state.layersByCode.get(state.route.goal.cca3);
  goalLayer?.setStyle({ fillColor: "#e96342", fillOpacity: 1, color: "#8f2f1c", weight: 3 });
  goalLayer?.getElement()?.classList.add("country-goal");
}

function styleResult(layer, correct) {
  const element = layer.getElement();
  layer.setStyle({
    fillColor: correct ? "#22a06b" : "#e14f34",
    fillOpacity: 1,
    color: correct ? "#0b5b3d" : "#9d2a18",
    weight: 3,
  });
  element?.classList.add(correct ? "country-correct" : "country-wrong");
  if (!correct) window.setTimeout(() => layer.setStyle(baseStyle(layer.feature)), 650);
}

function revealTarget() {
  const targetLayer = state.layersByCode.get(state.target.cca3);
  if (targetLayer) styleResult(targetLayer, true);
}

function advanceRound() {
  if (state.round >= ROUND_COUNT) {
    showEndModal();
    return;
  }
  state.round += 1;
  startRound();
}

function resetGame() {
  state.score = 0;
  state.streak = 0;
  state.round = 1;
  state.usedCodes.clear();
  state.route = null;
  state.challenge = null;
  state.learning = null;
  elements.modal.classList.add("hidden");
  if (state.countries.length) startRound();
}

function resetMapStyles() {
  state.layersByCode.forEach((layer) => {
    layer.setStyle(baseStyle(layer.feature));
    layer.getElement()?.classList.remove("country-correct", "country-wrong", "country-route", "country-goal");
  });
}

function updateHud() {
  elements.score.textContent = state.score.toLocaleString("fr-FR");
  elements.streak.textContent = state.streak;
  elements.round.textContent = state.mode === "learning" && state.learning ? state.learning.index + 1 : state.round;
  elements.roundTotal.textContent = state.mode === "learning" ? 10 : ROUND_COUNT;
  if (state.mode === "links") {
    elements.foundCount.textContent = state.challenge.selected.size;
    elements.goalCount.textContent = state.challenge.required;
  } else if (state.mode === "route") {
    elements.foundCount.textContent = Math.max(0, state.route.selected.length - 1);
    elements.goalCount.textContent = state.route.shortest.length - 1;
  } else if (state.mode === "learning" && state.learning) {
    elements.foundCount.textContent = state.learning.score;
    elements.goalCount.textContent = 10;
  } else {
    elements.foundCount.textContent = state.progress;
    elements.goalCount.textContent = 1;
  }
  [...elements.attempts.children].forEach((dot, index) => {
    dot.classList.toggle("used", index >= state.attempts);
  });
}

function setFeedback(type, title, message) {
  elements.feedback.className = `feedback${type === "neutral" ? "" : ` ${type}`}`;
  const icon = type === "success" ? "circle-check" : type === "error" ? "x" : "mouse-pointer-2";
  elements.feedback.innerHTML = `<span class="feedback-icon"><i data-lucide="${icon}"></i></span><p><strong>${title}</strong><span>${message}</span></p>`;
  lucide.createIcons({ nodes: [elements.feedback] });
}

function hideFeedback() {
  elements.feedback.classList.add("hidden");
}

function displayName(country) {
  return country.translations?.fra?.common || country.name.common;
}

function useHint() {
  if (state.locked || state.hintUsed) return;
  state.hintUsed = true;
  elements.hint.disabled = true;
  if (state.mode === "route") {
    const currentCode = state.route.selected[state.route.selected.length - 1];
    const remaining = findShortestRoute(currentCode, state.route.goal.cca3);
    const nextCountry = state.countries.find((country) => country.cca3 === remaining?.[1]);
    if (nextCountry) {
      setFeedback("neutral", "Étape possible", `${displayName(nextCountry)} te rapproche de la destination.`);
      state.layersByCode.get(nextCountry.cca3)?.setStyle({ fillColor: "#68a7c5", fillOpacity: 1, color: "#28627e", weight: 3 });
    }
    return;
  }
  if (state.mode === "links") {
    const available = [...state.challenge.validCodes].filter((code) => !state.challenge.selected.has(code));
    const country = state.countries.find((candidate) => candidate.cca3 === available[0]);
    if (country) {
      setFeedback("neutral", "Une réponse possible", `${displayName(country)} correspond à ce thème.`);
      state.layersByCode.get(country.cca3)?.setStyle({ fillColor: "#68a7c5", fillOpacity: 1, color: "#28627e", weight: 3 });
    }
    return;
  }
  const area = new Intl.NumberFormat("fr-FR").format(state.target.area);
  setFeedback("neutral", `Indice : ${regionName(state.target.region)}`, `Superficie : environ ${area} km².`);
  const layer = state.layersByCode.get(state.target.cca3);
  if (layer) map.fitBounds(layer.getBounds(), { padding: [80, 80], maxZoom: 3 });
}

function regionName(region) {
  return ({ Africa: "Afrique", Americas: "Amériques", Asia: "Asie", Europe: "Europe", Oceania: "Océanie" })[region] || region;
}

function burstConfetti() {
  elements.burst.replaceChildren();
  for (let index = 0; index < 22; index += 1) {
    const piece = document.createElement("i");
    piece.className = "confetti";
    piece.style.background = palette[index % palette.length];
    piece.style.setProperty("--x", `${(Math.random() - 0.5) * 480}px`);
    piece.style.setProperty("--y", `${(Math.random() - 0.7) * 380}px`);
    piece.style.setProperty("--r", `${Math.random() * 720 - 360}deg`);
    elements.burst.append(piece);
  }
  window.setTimeout(() => elements.burst.replaceChildren(), 1000);
}

function showEndModal() {
  state.locked = true;
  elements.finalScore.textContent = state.score.toLocaleString("fr-FR");
  const correctEstimate = Math.round(state.score / 700);
  elements.endMessage.textContent = correctEstimate >= 8
    ? "Tes repères géographiques sont excellents."
    : correctEstimate >= 5
      ? "Beau voyage. Encore une partie pour battre ton score ?"
      : "Le monde est vaste : chaque partie affine tes repères.";
  elements.modal.classList.remove("hidden");
}

document.querySelectorAll(".mode-button").forEach((button) => {
  button.addEventListener("click", () => {
    state.mode = button.dataset.mode;
    document.querySelector("#current-mode-label").textContent = button.querySelector("span").textContent;
    document.querySelector("#mode-menu").removeAttribute("open");
    document.querySelectorAll(".mode-button").forEach((candidate) => {
      const active = candidate === button;
      candidate.classList.toggle("active", active);
      candidate.setAttribute("aria-selected", String(active));
    });
    resetGame();
  });
});

document.addEventListener("click", (event) => {
  const menu = document.querySelector("#mode-menu");
  if (menu.open && !menu.contains(event.target)) menu.removeAttribute("open");
});

elements.hint.addEventListener("click", useHint);
document.querySelectorAll("[data-start-learning]").forEach((button) => {
  button.addEventListener("click", () => startLearningSession(button.dataset.startLearning));
});
document.querySelector("#close-learning-session").addEventListener("click", closeLearningSession);
document.querySelector("#back-learning-home").addEventListener("click", closeLearningSession);
document.querySelector("#replay-learning-session").addEventListener("click", () => startLearningSession(state.learning.category));
document.querySelector("#reset-button").addEventListener("click", resetGame);
document.querySelector("#play-again").addEventListener("click", resetGame);
lucide.createIcons();
loadGame();