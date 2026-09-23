# Iceland & Germany Trip

A small static site for planning the trip — Dec 1 – Dec 14, 2026.

- **index.html** — landing page, pick a section
- **travel.html** — every leg: JFK → KEF, KEF → HAM via Amsterdam, the Hamburg ↔ Berlin train, and HAM → JFK via Helsinki
- **iceland.html** — the whole Iceland itinerary on one calendar, plus what each tour covers
- **germany.html** — the whole Hamburg/Berlin itinerary on one calendar

## The calendar

`js/itinerary.js` renders the calendar on the Iceland and Germany pages: one
column per day of that leg against a time grid from 6 AM to midnight, hours down
the left. Nothing to click — the entire leg is on the page. Narrow screens scroll
sideways and the time gutter stays pinned.

Each page supplies its own data in an inline `window.ITINERARY` block at the
bottom of the file:

```js
{ date: "2026-12-03", start: "08:30", end: "18:30", kind: "travel",
  timeLabel: "optional override", title: "…", sub: "…" }
```

- Leave out `start` and the event goes in the **all-day** band at the top — that
  is where the loose Germany plans live until they have times.
- `kind` is one of `travel`, `plan`, `night`, `open`, or omitted for a tour.
- The days shown come from `start`/`end`, so only trip days appear.

Everything else is plain HTML. No build step — open `index.html` or serve the
folder with any static file server.

Source of truth for dates, times and confirmations is the trip spreadsheet.

## Mobile

The calendar has two layouts and CSS picks one, so there is no resize logic:

- **Above 760px** — the time grid, one column per day. Between 760px and full
  width it scrolls sideways with the hour gutter pinned.
- **760px and below** — the same events as a day-by-day list (`.agenda`),
  because a nine-column time grid cannot work on a phone.

Both are rendered by `js/itinerary.js` from the same `window.ITINERARY` data, so
adding an event updates both.
