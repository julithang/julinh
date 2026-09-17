// Trip data — edit these values with your real details.
// Dates use ISO format "YYYY-MM-DD". Times are 24h "HH:MM".

const TRIP_CONFIG = {
  iceland: {
    label: "Iceland",
    defaultStart: "2026-10-13",
    days: 5,
    theme: "iceland",
  },
  germany: {
    label: "Germany",
    defaultStart: "2026-10-17",
    days: 6,
    theme: "germany",
  },
};

// SAMPLE flights — replace with your actual confirmed itinerary.
const FLIGHTS = [
  {
    id: "f1",
    label: "Outbound",
    airline: "Icelandair",
    flightNumber: "FI 615",
    date: "2026-10-12",
    from: { code: "JFK", city: "New York", time: "22:30" },
    to: { code: "KEF", city: "Reykjavík", time: "06:40", nextDay: true },
    confirmation: "ABC123",
    notes: "Overnight flight — arrives next morning.",
  },
  {
    id: "f2",
    label: "Iceland → Germany",
    airline: "Icelandair",
    flightNumber: "FI 5698",
    date: "2026-10-17",
    from: { code: "KEF", city: "Reykjavík", time: "14:15" },
    to: { code: "FRA", city: "Frankfurt", time: "19:55" },
    confirmation: "DEF456",
    notes: "Short hop, mind the time zone change (+2h).",
  },
  {
    id: "f3",
    label: "Return",
    airline: "Lufthansa",
    flightNumber: "LH 400",
    date: "2026-10-23",
    from: { code: "FRA", city: "Frankfurt", time: "11:20" },
    to: { code: "JFK", city: "New York", time: "14:05" },
    confirmation: "GHI789",
    notes: "Long-haul westbound — local arrival time is earlier than departure.",
  },
];

const ICELAND_ACTIVITIES = [
  { id: "is1", title: "Blue Lagoon", category: "Relax", duration: 3, desc: "Geothermal spa, easy add-on near Keflavík airport." },
  { id: "is2", title: "Sky Lagoon", category: "Relax", duration: 3, desc: "Oceanfront geothermal spa just outside Reykjavík." },
  { id: "is3", title: "Golden Circle Loop", category: "Nature", duration: 8, desc: "Þingvellir, Geysir hot springs, and Gullfoss waterfall." },
  { id: "is4", title: "Seljalandsfoss & Skógafoss", category: "Nature", duration: 6, desc: "Two of the South Coast's most iconic waterfalls." },
  { id: "is5", title: "Reynisfjara Black Sand Beach", category: "Nature", duration: 2, desc: "Basalt columns and dramatic sea stacks." },
  { id: "is6", title: "Jökulsárlón & Diamond Beach", category: "Nature", duration: 4, desc: "Glacier lagoon with icebergs washing ashore." },
  { id: "is7", title: "Silfra Fissure Snorkeling", category: "Adventure", duration: 4, desc: "Snorkel between two tectonic plates in glacial water." },
  { id: "is8", title: "Glacier Hike / Ice Cave", category: "Adventure", duration: 5, desc: "Guided walk onto or inside a real glacier." },
  { id: "is9", title: "Northern Lights Tour", category: "Adventure", duration: 4, desc: "Evening hunt for the aurora away from city lights." },
  { id: "is10", title: "Reykjavík Walking Tour", category: "City", duration: 3, desc: "Hallgrímskirkja, harbor, and downtown streets." },
  { id: "is11", title: "Whale Watching", category: "Adventure", duration: 3, desc: "Boat tour from Reykjavík's old harbor." },
  { id: "is12", title: "Fagradalsfjall Volcano Hike", category: "Adventure", duration: 6, desc: "Trek near the recent volcanic eruption site." },
  { id: "is13", title: "Icelandic Food Tour", category: "Food", duration: 2, desc: "Hot dogs, langoustine soup, and local snacks." },
  { id: "is14", title: "Kerið Crater", category: "Nature", duration: 1, desc: "Compact volcanic crater with a striking red-and-blue lake." },
  { id: "is15", title: "Fjaðrárgljúfur Canyon", category: "Nature", duration: 2, desc: "Winding mossy canyon, short easy walk." },
];

const GERMANY_ACTIVITIES = [
  { id: "de1", title: "Brandenburg Gate & Reichstag", category: "City", duration: 3, desc: "Berlin's iconic landmark and government quarter." },
  { id: "de2", title: "Berlin Wall Memorial & East Side Gallery", category: "Culture", duration: 3, desc: "History and street art along the former wall." },
  { id: "de3", title: "Museum Island", category: "Culture", duration: 4, desc: "Five major museums on a UNESCO World Heritage island." },
  { id: "de4", title: "Neuschwanstein Castle", category: "Culture", duration: 8, desc: "Fairy-tale castle day trip from Munich." },
  { id: "de5", title: "Munich Old Town & Marienplatz", category: "City", duration: 3, desc: "Glockenspiel, Frauenkirche, and pedestrian streets." },
  { id: "de6", title: "Hofbräuhaus Beer Hall", category: "Food", duration: 3, desc: "Classic Bavarian beer hall experience." },
  { id: "de7", title: "Cologne Cathedral", category: "Culture", duration: 2, desc: "Gothic masterpiece towering over the Rhine." },
  { id: "de8", title: "Rhine Valley River Cruise", category: "Nature", duration: 4, desc: "Castles and vineyards along the Rhine gorge." },
  { id: "de9", title: "Black Forest & Triberg Waterfalls", category: "Nature", duration: 6, desc: "Germany's tallest waterfalls and forest trails." },
  { id: "de10", title: "Rothenburg ob der Tauber", category: "City", duration: 4, desc: "Best-preserved medieval walled town in Germany." },
  { id: "de11", title: "Dachau Memorial Site", category: "Culture", duration: 4, desc: "Former concentration camp, now a memorial and museum." },
  { id: "de12", title: "Local Market Crawl", category: "Food", duration: 2, desc: "Farmers markets, pretzels, and street food stalls." },
  { id: "de13", title: "Zugspitze Cable Car", category: "Adventure", duration: 6, desc: "Ride to Germany's highest peak in the Bavarian Alps." },
  { id: "de14", title: "Currywurst & Döner Crawl", category: "Food", duration: 2, desc: "Berlin's two most iconic street foods." },
  { id: "de15", title: "Heidelberg Old Town & Castle", category: "City", duration: 4, desc: "Riverside university town with a hilltop ruin." },
];
