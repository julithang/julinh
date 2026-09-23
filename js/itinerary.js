// Itinerary calendar. A page defines window.ITINERARY = { start, end, events }
// and includes <div id="itinerary"></div>; this renders every day of the leg as
// a column against a time grid. Events without a `start` land in the all-day band.

(function () {
  "use strict";

  var HOUR_PX = 40;
  var DAY_START_H = 6;
  var DAY_END_H = 24;
  var DAY_START = DAY_START_H * 60;
  var DAY_END = DAY_END_H * 60;
  var SPAN = DAY_END - DAY_START;

  var DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  var MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function parseDate(iso) { var p = iso.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function key(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function addDays(d, n) { var c = new Date(d.getTime()); c.setDate(c.getDate() + n); return c; }
  function dowName(d) { return DOW[(d.getDay() + 6) % 7]; }
  function toMin(t) { var p = t.split(":"); return +p[0] * 60 + +p[1]; }

  function fmt12(t) {
    var m = toMin(t), h = Math.floor(m / 60), mm = m % 60;
    var ampm = h >= 12 && h < 24 ? "PM" : "AM";
    var hh = h % 12;
    if (hh === 0) hh = 12;
    return hh + (mm ? ":" + pad(mm) : "") + " " + ampm;
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  // Greedy lane assignment so overlapping events sit side by side.
  function layout(list) {
    list.sort(function (a, b) { return a._s - b._s; });
    var laneEnds = [];
    list.forEach(function (ev) {
      for (var i = 0; i < laneEnds.length; i++) {
        if (ev._s >= laneEnds[i]) { laneEnds[i] = ev._e; ev._lane = i; return; }
      }
      ev._lane = laneEnds.length;
      laneEnds.push(ev._e);
    });
    var total = laneEnds.length || 1;
    list.forEach(function (ev) { ev._lanes = total; });
  }

  function evBody(node, ev, timeText) {
    if (timeText) node.appendChild(el("span", "ev-time", timeText));
    node.appendChild(el("span", "ev-title", ev.title));
    if (ev.sub) {
      var sub = el("span", "ev-sub");
      sub.innerHTML = ev.sub;
      node.appendChild(sub);
    }
  }

  function init() {
    var cfg = window.ITINERARY;
    var mount = document.getElementById("itinerary");
    if (!cfg || !mount) return;

    var end = parseDate(cfg.end);
    var days = [];
    for (var d = parseDate(cfg.start); d <= end; d = addDays(d, 1)) days.push(new Date(d.getTime()));

    var byDay = {};
    cfg.events.forEach(function (ev) {
      var bucket = byDay[ev.date] || (byDay[ev.date] = { allDay: [], timed: [] });
      if (ev.start) {
        var copy = Object.create(ev);
        copy._s = Math.max(toMin(ev.start), DAY_START);
        copy._e = Math.min(toMin(ev.end || ev.start), DAY_END);
        if (copy._e - copy._s < 30) copy._e = Math.min(copy._s + 30, DAY_END);
        bucket.timed.push(copy);
      } else {
        bucket.allDay.push(ev);
      }
    });
    Object.keys(byDay).forEach(function (k) { layout(byDay[k].timed); });

    var hasAllDay = days.some(function (d) {
      var b = byDay[key(d)];
      return b && b.allDay.length;
    });

    var wrap = el("div", "wv");
    var scroll = el("div", "wv-scroll");
    var grid = el("div", "wv-grid");
    grid.style.setProperty("--hour-px", HOUR_PX + "px");
    grid.style.setProperty("--cols", days.length);
    scroll.appendChild(grid);
    wrap.appendChild(scroll);
    mount.appendChild(wrap);

    grid.appendChild(el("div", "wv-corner"));
    days.forEach(function (d) {
      var head = el("div", "wv-dayhead");
      head.appendChild(el("span", "wv-dow", dowName(d)));
      head.appendChild(el("span", "wv-daynum", String(d.getDate())));
      grid.appendChild(head);
    });

    if (hasAllDay) {
      grid.appendChild(el("div", "wv-allday-label", "all-day"));
      days.forEach(function (d) {
        var cell = el("div", "wv-allday-cell");
        var bucket = byDay[key(d)];
        if (bucket) {
          bucket.allDay.forEach(function (ev) {
            var chip = el("div", "ev " + (ev.kind || ""));
            evBody(chip, ev, ev.timeLabel);
            cell.appendChild(chip);
          });
        }
        grid.appendChild(cell);
      });
    }

    var gutter = el("div", "wv-gutter");
    gutter.style.height = (SPAN / 60) * HOUR_PX + "px";
    for (var h = DAY_START_H; h < DAY_END_H; h++) {
      // The first label sits flush with the top edge so it is not clipped.
      var label = el("div", "wv-hour" + (h === DAY_START_H ? " first" : ""), fmt12(pad(h) + ":00"));
      label.style.top = (h * 60 - DAY_START) / 60 * HOUR_PX + "px";
      gutter.appendChild(label);
    }
    grid.appendChild(gutter);

    days.forEach(function (d) {
      var col = el("div", "wv-col");
      col.style.height = (SPAN / 60) * HOUR_PX + "px";
      var bucket = byDay[key(d)];
      if (bucket) {
        bucket.timed.forEach(function (ev) {
          var node = el("div", "wv-ev " + (ev.kind || ""));
          node.style.top = (ev._s - DAY_START) / 60 * HOUR_PX + "px";
          node.style.height = Math.max((ev._e - ev._s) / 60 * HOUR_PX - 2, 26) + "px";
          node.style.left = "calc(" + (ev._lane * 100 / ev._lanes) + "% + 3px)";
          node.style.width = "calc(" + (100 / ev._lanes) + "% - 6px)";
          var t = ev.timeLabel || (fmt12(ev.start) + (ev.end ? " – " + fmt12(ev.end) : ""));
          evBody(node, ev, t);
          col.appendChild(node);
        });
      }
      grid.appendChild(col);
    });

    mount.appendChild(buildAgenda(days, byDay));
  }

  // Phone layout: the same events as a day-by-day list. CSS shows one or the
  // other, so there is no resize handling to get wrong.
  function buildAgenda(days, byDay) {
    var list = el("ol", "agenda");

    days.forEach(function (d) {
      var bucket = byDay[key(d)] || { allDay: [], timed: [] };
      var item = el("li", "agenda-day");

      var date = el("div", "agenda-date");
      date.appendChild(el("span", "agenda-dow", dowName(d)));
      date.appendChild(el("span", "agenda-num", MONTH_SHORT[d.getMonth()] + " " + d.getDate()));
      item.appendChild(date);

      var items = el("div", "agenda-items");
      bucket.allDay.forEach(function (ev) {
        var chip = el("div", "ev " + (ev.kind || ""));
        evBody(chip, ev, ev.timeLabel);
        items.appendChild(chip);
      });
      bucket.timed.forEach(function (ev) {
        var chip = el("div", "ev " + (ev.kind || ""));
        var t = ev.timeLabel || (fmt12(ev.start) + (ev.end ? " – " + fmt12(ev.end) : ""));
        evBody(chip, ev, t);
        items.appendChild(chip);
      });
      if (!items.children.length) {
        items.appendChild(el("div", "agenda-empty", "Nothing planned"));
      }
      item.appendChild(items);

      list.appendChild(item);
    });

    return list;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
