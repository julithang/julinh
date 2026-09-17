# Iceland & Germany Trip

A small static site for planning the trip.

- **index.html** — landing page, pick a section
- **flights.html** — flight schedule, timeline-style. Edit the `FLIGHTS` array in `js/data.js` with real flight details.
- **iceland.html** / **germany.html** — drag-and-drop activity planners. Drag a suggestion from the sidebar onto a day to add it to your itinerary. Use the date picker and +/- Day buttons to match your real trip length. Plans are saved in your browser (localStorage), per device.

## Editing content

All trip data lives in `js/data.js`:

- `TRIP_CONFIG` — default start dates and number of days for each leg
- `FLIGHTS` — flight legs shown on the flights page
- `ICELAND_ACTIVITIES` / `GERMANY_ACTIVITIES` — suggested activities shown in each planner

No build step — just open `index.html` or serve the folder with any static file server.
