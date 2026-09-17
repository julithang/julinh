(function () {
  const country = document.body.dataset.country;
  const baseActivities = country === "iceland" ? ICELAND_ACTIVITIES : GERMANY_ACTIVITIES;
  const tripConfig = TRIP_CONFIG[country];
  const storageKey = `trip-planner-${country}`;

  let state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      /* fall through to defaults */
    }
    return {
      startDate: tripConfig.defaultStart,
      days: tripConfig.days,
      placements: {},
      customActivities: [],
      nextInstanceId: 1,
    };
  }

  function saveState() {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function allActivities() {
    return baseActivities.concat(state.customActivities);
  }

  function findActivity(activityId) {
    return allActivities().find((a) => a.id === activityId);
  }

  function dayDate(index) {
    const d = new Date(state.startDate + "T00:00:00");
    d.setDate(d.getDate() + index);
    return d;
  }

  function formatDayLabel(index) {
    const d = dayDate(index);
    return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  }

  // ---------- Sidebar ----------

  let activeCategory = "All";

  function renderSidebar() {
    const pool = document.getElementById("activity-pool");
    const filters = document.getElementById("category-filters");

    const categories = ["All", ...new Set(allActivities().map((a) => a.category))];
    filters.innerHTML = "";
    categories.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "pill" + (cat === activeCategory ? " active" : "");
      btn.textContent = cat;
      btn.addEventListener("click", () => {
        activeCategory = cat;
        renderSidebar();
      });
      filters.appendChild(btn);
    });

    pool.innerHTML = "";
    allActivities()
      .filter((a) => activeCategory === "All" || a.category === activeCategory)
      .forEach((a) => {
        const card = document.createElement("div");
        card.className = "activity-card";
        card.draggable = true;
        card.innerHTML = `
          <div class="a-title">${a.title}</div>
          <div class="a-meta">${a.duration}h</div>
          <div class="a-desc">${a.desc || ""}</div>
          <span class="tag">${a.category}</span>
        `;
        card.addEventListener("dragstart", (e) => {
          card.classList.add("dragging");
          e.dataTransfer.setData(
            "text/plain",
            JSON.stringify({ type: "template", activityId: a.id })
          );
        });
        card.addEventListener("dragend", () => card.classList.remove("dragging"));
        pool.appendChild(card);
      });
  }

  document.getElementById("custom-activity-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("custom-activity-input");
    const title = input.value.trim();
    if (!title) return;
    state.customActivities.push({
      id: "custom-" + Date.now(),
      title,
      category: "Custom",
      duration: 2,
      desc: "",
    });
    input.value = "";
    saveState();
    renderSidebar();
  });

  // ---------- Day columns ----------

  function renderDays() {
    const container = document.getElementById("day-columns");
    container.innerHTML = "";

    for (let i = 0; i < state.days; i++) {
      const col = document.createElement("div");
      col.className = "day-column";

      const head = document.createElement("div");
      head.className = "day-column-head";
      head.innerHTML = `Day ${i + 1}<span class="day-sub">${formatDayLabel(i)}</span>`;
      col.appendChild(head);

      const dropZone = document.createElement("div");
      dropZone.className = "day-drop-zone";
      dropZone.dataset.day = i;

      (state.placements[i] || []).forEach((instance) => {
        dropZone.appendChild(renderPlacedCard(instance, i));
      });

      dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("drag-over");
      });
      dropZone.addEventListener("dragleave", () => dropZone.classList.remove("drag-over"));
      dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("drag-over");
        const raw = e.dataTransfer.getData("text/plain");
        if (!raw) return;
        const data = JSON.parse(raw);

        if (data.type === "template") {
          const instanceId = state.nextInstanceId++;
          state.placements[i] = state.placements[i] || [];
          state.placements[i].push({ instanceId, activityId: data.activityId });
        } else if (data.type === "placed") {
          const fromDay = data.fromDay;
          state.placements[fromDay] = (state.placements[fromDay] || []).filter(
            (p) => p.instanceId !== data.instanceId
          );
          state.placements[i] = state.placements[i] || [];
          state.placements[i].push({ instanceId: data.instanceId, activityId: data.activityId });
        }
        saveState();
        renderDays();
      });

      col.appendChild(dropZone);
      container.appendChild(col);
    }
  }

  function renderPlacedCard(instance, dayIndex) {
    const activity = findActivity(instance.activityId);
    const card = document.createElement("div");
    card.className = "placed-card";
    card.draggable = true;
    card.innerHTML = `
      <button class="remove-btn" aria-label="Remove">&times;</button>
      <div class="p-title">${activity ? activity.title : "Activity"}</div>
      <div class="p-meta">${activity ? activity.duration + "h" : ""}</div>
    `;
    card.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData(
        "text/plain",
        JSON.stringify({ type: "placed", instanceId: instance.instanceId, activityId: instance.activityId, fromDay: dayIndex })
      );
    });
    card.querySelector(".remove-btn").addEventListener("click", () => {
      state.placements[dayIndex] = (state.placements[dayIndex] || []).filter(
        (p) => p.instanceId !== instance.instanceId
      );
      saveState();
      renderDays();
    });
    return card;
  }

  // ---------- Controls ----------

  const startDateInput = document.getElementById("start-date-input");
  startDateInput.value = state.startDate;
  startDateInput.addEventListener("change", () => {
    state.startDate = startDateInput.value;
    saveState();
    renderDays();
  });

  document.getElementById("add-day-btn").addEventListener("click", () => {
    state.days += 1;
    saveState();
    renderDays();
  });

  document.getElementById("remove-day-btn").addEventListener("click", () => {
    if (state.days <= 1) return;
    const removedIndex = state.days - 1;
    delete state.placements[removedIndex];
    state.days -= 1;
    saveState();
    renderDays();
  });

  document.getElementById("clear-plan-btn").addEventListener("click", () => {
    if (!confirm("Clear this trip's plan? Custom activities will be kept.")) return;
    state.placements = {};
    saveState();
    renderDays();
  });

  renderSidebar();
  renderDays();
})();
