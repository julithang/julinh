function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function formatDateHeading(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}

function renderSchedule() {
  const container = document.getElementById("schedule-container");
  const byDate = {};
  FLIGHTS.forEach((f) => {
    (byDate[f.date] = byDate[f.date] || []).push(f);
  });
  const dates = Object.keys(byDate).sort();

  dates.forEach((date) => {
    const flights = byDate[date];

    const startMin = Math.max(0, Math.min(...flights.map((f) => timeToMinutes(f.from.time))) - 90);
    const endMinRaw = Math.max(...flights.map((f) => (f.to.nextDay ? 24 * 60 : timeToMinutes(f.to.time))));
    const endMin = Math.min(24 * 60, endMinRaw + 60);
    const span = endMin - startMin;

    const dayEl = document.createElement("div");
    dayEl.className = "schedule-day";

    const head = document.createElement("div");
    head.className = "schedule-day-head";
    head.innerHTML = `<span>${formatDateHeading(date)}</span><span class="date-sub">${date}</span>`;
    dayEl.appendChild(head);

    const body = document.createElement("div");
    body.className = "schedule-body";
    body.style.setProperty("--span", span);

    const hours = document.createElement("div");
    hours.className = "schedule-hours";
    hours.style.height = "220px";
    for (let m = Math.ceil(startMin / 120) * 120; m <= endMin; m += 120) {
      const pct = ((m - startMin) / span) * 100;
      const tick = document.createElement("div");
      tick.className = "schedule-hour-tick";
      tick.style.top = pct + "%";
      const hh = Math.floor(m / 60) % 24;
      tick.textContent = String(hh).padStart(2, "0") + ":00";
      hours.appendChild(tick);
    }

    const track = document.createElement("div");
    track.className = "schedule-track";
    track.style.height = "220px";

    flights.forEach((f) => {
      const depMin = timeToMinutes(f.from.time);
      const arrMin = f.to.nextDay ? 24 * 60 : timeToMinutes(f.to.time);
      const top = ((depMin - startMin) / span) * 100;
      const height = Math.max(((arrMin - depMin) / span) * 100, 12);

      const block = document.createElement("div");
      block.className = "flight-block";
      block.style.top = top + "%";
      block.style.height = height + "%";

      const arrivalLabel = f.to.nextDay ? `${f.to.time} (+1 day)` : f.to.time;
      block.innerHTML = `
        <div class="flight-title">${f.label}: ${f.from.code} &rarr; ${f.to.code}</div>
        <div class="flight-meta">${f.airline} ${f.flightNumber} &middot; ${f.from.time} &rarr; ${arrivalLabel}</div>
      `;
      track.appendChild(block);
    });

    body.appendChild(hours);
    body.appendChild(track);
    dayEl.appendChild(body);

    flights.forEach((f) => {
      const arrivalLabel = f.to.nextDay ? `${f.to.time} (+1 day)` : f.to.time;
      const grid = document.createElement("dl");
      grid.className = "flight-detail-grid";
      grid.innerHTML = `
        <div><dt>Flight</dt><dd>${f.airline} ${f.flightNumber}</dd></div>
        <div><dt>Route</dt><dd>${f.from.city} (${f.from.code}) &rarr; ${f.to.city} (${f.to.code})</dd></div>
        <div><dt>Departs</dt><dd>${f.from.time}</dd></div>
        <div><dt>Arrives</dt><dd>${arrivalLabel}</dd></div>
        <div><dt>Confirmation</dt><dd>${f.confirmation}</dd></div>
        <div><dt>Notes</dt><dd>${f.notes || "—"}</dd></div>
      `;
      dayEl.appendChild(grid);
    });

    container.appendChild(dayEl);
  });
}

document.addEventListener("DOMContentLoaded", renderSchedule);
