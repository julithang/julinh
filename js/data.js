// Trip data — sourced from the trip planning sheet. Edit as details firm up.
// Dates use ISO format "YYYY-MM-DD". Times are 24h "HH:MM".

const TRIP_CONFIG = {
  iceland: {
    label: "Iceland",
    defaultStart: "2026-12-02",
    days: 7,
    theme: "iceland",
  },
  germany: {
    label: "Germany",
    defaultStart: "2026-12-09",
    days: 5,
    theme: "germany",
  },
};

// A Google Maps list of saved places for the trip. Shown as a link-out button
// on the Iceland and Germany pages until individual places are imported below.
const SAVED_PLACES_MAP_URL = "https://maps.app.goo.gl/7ZZvMnzvFcStVFDi8";

const FLIGHTS = [
  {
    id: "f1",
    label: "Leg 1: New York → Reykjavík",
    airline: "Icelandair",
    flightNumber: "FI 614",
    date: "2026-12-01",
    from: { code: "JFK", city: "New York", time: "19:25" },
    to: { code: "KEF", city: "Reykjavík", time: "06:10", nextDay: true },
    confirmation: null,
    notes: "Nonstop, 5h 45m — arrives next day.",
  },
  {
    id: "f2",
    label: "Leg 2: Reykjavík → Amsterdam",
    airline: "KLM",
    flightNumber: "KL 2746",
    date: "2026-12-09",
    from: { code: "KEF", city: "Reykjavík", time: "14:45" },
    to: { code: "AMS", city: "Amsterdam", time: "18:55" },
    confirmation: null,
    notes: "3h 10m.",
  },
  {
    id: "f3",
    label: "Leg 2: Amsterdam → Hamburg",
    airline: "KLM",
    flightNumber: "KL 1759",
    date: "2026-12-09",
    from: { code: "AMS", city: "Amsterdam", time: "20:55" },
    to: { code: "HAM", city: "Hamburg", time: "21:55" },
    confirmation: null,
    notes: "2h layover in Amsterdam, then 1h flight.",
  },
  {
    id: "f4",
    label: "Leg 3: Hamburg → Helsinki",
    airline: "Finnair",
    flightNumber: "AY 1424",
    date: "2026-12-14",
    from: { code: "HAM", city: "Hamburg", time: "12:25" },
    to: { code: "HEL", city: "Helsinki", time: "15:20" },
    confirmation: null,
    notes: "1h 55m.",
  },
  {
    id: "f5",
    label: "Leg 3: Helsinki → New York",
    airline: "Finnair",
    flightNumber: "AY 15",
    date: "2026-12-14",
    from: { code: "HEL", city: "Helsinki", time: "16:50" },
    to: { code: "JFK", city: "New York", time: "19:05" },
    confirmation: null,
    notes: "1h 30m layover in Helsinki, then 9h 15m flight.",
  },
];

const ICELAND_ACTIVITIES = [
  { id: "is1", title: "Blue Lagoon", category: "Relax", duration: 3, desc: "Geothermal spa, easy add-on near Keflavík airport." },
  { id: "is2", title: "Sky Lagoon", category: "Relax", duration: 3, desc: "Oceanfront geothermal spa just outside Reykjavík." },
  { id: "is3", title: "Golden Circle Loop", category: "Nature", duration: 8, desc: "Þingvellir, Geysir hot springs, and Gullfoss waterfall." },
  { id: "is4", title: "Seljalandsfoss & Skógafoss", category: "Nature", duration: 6, desc: "Two of the South Coast's most iconic waterfalls." },
  { id: "is5", title: "Reynisfjara Black Sand Beach", category: "Nature", duration: 2, desc: "Basalt columns and dramatic sea stacks." },
  { id: "is6", title: "Jökulsárlón & Diamond Beach", category: "Nature", duration: 4, desc: "Glacier lagoon with icebergs washing ashore." },
  { id: "is7", title: "Ice Cave Tour", category: "Adventure", duration: 5, desc: "Guided walk inside a real glacier — a December specialty." },
  { id: "is8", title: "Northern Lights Tour", category: "Adventure", duration: 4, desc: "Evening hunt for the aurora away from city lights — prime season." },
  { id: "is9", title: "Reykjavík Walking Tour", category: "City", duration: 3, desc: "Hallgrímskirkja, harbor, and downtown streets." },
  { id: "is10", title: "Whale Watching", category: "Adventure", duration: 3, desc: "Boat tour from Reykjavík's old harbor." },
  { id: "is11", title: "Icelandic Food Tour", category: "Food", duration: 2, desc: "Hot dogs, langoustine soup, and local snacks." },
  { id: "is12", title: "Kerið Crater", category: "Nature", duration: 1, desc: "Compact volcanic crater with a striking red-and-blue lake." },
  { id: "is13", title: "Fjaðrárgljúfur Canyon", category: "Nature", duration: 2, desc: "Winding mossy canyon, short easy walk." },
  { id: "is14", title: "Reykjavík Christmas Market", category: "Food", duration: 2, desc: "Seasonal market stalls, mulled wine, and lights downtown." },
  { id: "is15", title: "Sundhöllin / Local Geothermal Pool", category: "Relax", duration: 2, desc: "A cheaper, more local alternative to the big lagoons." },
];

const GERMANY_ACTIVITIES = [
  { id: "de1", title: "Miniatur Wunderland", category: "City", duration: 3, desc: "The world's largest model railway, in the Speicherstadt." },
  { id: "de2", title: "Speicherstadt & HafenCity Walk", category: "City", duration: 2, desc: "UNESCO warehouse district and the modern harbor quarter." },
  { id: "de3", title: "Elbphilharmonie Plaza", category: "Culture", duration: 2, desc: "Iconic concert hall with a free public viewing platform." },
  { id: "de4", title: "Hamburg Harbor Boat Tour", category: "Adventure", duration: 2, desc: "See the port and Speicherstadt from the water." },
  { id: "de5", title: "Fischmarkt (Fish Market)", category: "Food", duration: 2, desc: "Historic Sunday-morning market with live music." },
  { id: "de6", title: "St. Michael's Church (Michel)", category: "Culture", duration: 1, desc: "Climb the tower for panoramic views over Hamburg." },
  { id: "de7", title: "Reeperbahn & St. Pauli Walk", category: "City", duration: 3, desc: "Hamburg's famous nightlife and entertainment district." },
  { id: "de8", title: "Planten un Blomen", category: "Nature", duration: 2, desc: "City park, in winter home to festive lights and markets." },
  { id: "de9", title: "Hamburg Christmas Markets", category: "Food", duration: 2, desc: "Mulled wine and stalls at Rathausmarkt and around the Alster." },
  { id: "de10", title: "Alster Lakes Walk", category: "Nature", duration: 2, desc: "Stroll or cruise the Binnenalster and Außenalster." },
  { id: "de11", title: "Chilehaus & Kontorhaus District", category: "Culture", duration: 1, desc: "Landmark 1920s brick Expressionist office buildings." },
  { id: "de12", title: "International Maritime Museum", category: "Culture", duration: 2, desc: "Nine floors on the history of seafaring." },
  { id: "de13", title: "Lübeck Day Trip", category: "City", duration: 6, desc: "Medieval Hanseatic old town, ~45 min from Hamburg by train." },
  { id: "de14", title: "Bremen Day Trip", category: "City", duration: 7, desc: "Town Musicians statue and old town, ~1h by train." },
  { id: "de15", title: "Currywurst & Fischbrötchen Crawl", category: "Food", duration: 2, desc: "Hamburg's classic street food, curry sausage and fish rolls." },
];
