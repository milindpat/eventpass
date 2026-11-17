// Browse & search events (Feature 2). Everyone must be logged in.
const user = requireLogin();

const els = {
  search: document.getElementById("search"),
  category: document.getElementById("category"),
  venue: document.getElementById("venue"),
  date: document.getElementById("date"),
  pickDate: document.getElementById("pick-date"),
  priceMin: document.getElementById("price-min"),
  priceMax: document.getElementById("price-max"),
  freeOnly: document.getElementById("free-only")
};

function addDays(iso, n) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d + n);
  return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
}

function matchesDate(ev) {
  const t = today();
  switch (els.date.value) {
    case "today": return ev.EventDate === t;
    case "week": return ev.EventDate <= addDays(t, 7);
    case "month": return ev.EventDate.slice(0, 7) === t.slice(0, 7);
    case "pick": return !els.pickDate.value || ev.EventDate === els.pickDate.value;
    default: return true;
  }
}

// An event matches the price range if any of its ticket types does
function matchesPrice(ev) {
  const prices = ticketsForEvent(ev.EventID).map(t => t.Price);
  const min = els.priceMin.value === "" ? 0 : Number(els.priceMin.value);
  const max = els.priceMax.value === "" ? Infinity : Number(els.priceMax.value);
  if (els.freeOnly.checked && !prices.includes(0)) return false;
  return prices.some(p => p >= min && p <= max);
}

function cardHtml(ev) {
  const cat = find("Categories", ev.CategoryID);
  const venue = find("Venues", ev.VenueID);
  const left = seatsLeft(ev.EventID);
  const low = minPrice(ev.EventID);
  const prices = ticketsForEvent(ev.EventID).map(t => t.Price);
  const priceText = Math.max(...prices) === 0 ? "Free" : (prices.length > 1 && low !== Math.max(...prices) ? "From " : "") + money(low);
  return `
    <a class="event-card" href="event.html?id=${ev.EventID}">
      <img src="${esc(eventImage(ev))}" alt="${esc(ev.Title)}">
      <div class="event-card-body">
        <span class="chip">${esc(cat ? cat.Name : "Event")}</span>
        <h3>${esc(ev.Title)}</h3>
        <div class="event-meta">${fmtDate(ev.EventDate)} · ${fmtTime(ev.StartTime)}</div>
        <div class="event-meta">${esc(venue ? venue.Name : "")}</div>
        <div class="event-card-foot">
          <span class="price">${priceText}</span>
          ${left === 0 ? `<span class="sold-out">Sold out</span>`
            : `<span class="seats ${left <= 20 ? "low" : ""}">${left <= 20 ? "Only " + left + " left" : left + " seats left"}</span>`}
        </div>
      </div>
    </a>`;
}

function render() {
  const q = els.search.value.trim().toLowerCase();
  const list = db.Events
    .filter(isBookable)
    .filter(ev => ticketsForEvent(ev.EventID).length > 0)
    .filter(ev => !q || ev.Title.toLowerCase().includes(q) || (ev.Description || "").toLowerCase().includes(q))
    .filter(ev => !els.category.value || ev.CategoryID === Number(els.category.value))
    .filter(ev => !els.venue.value || ev.VenueID === Number(els.venue.value))
    .filter(matchesDate)
    .filter(matchesPrice)
    .sort((a, b) => (a.EventDate + a.StartTime).localeCompare(b.EventDate + b.StartTime));

  document.getElementById("result-count").textContent = list.length + (list.length === 1 ? " event" : " events");

  // How many filters are on (shown on the phone "Filters" button)
  const active = [els.category.value, els.venue.value, els.date.value, els.priceMin.value || els.priceMax.value, els.freeOnly.checked]
    .filter(Boolean).length;
  const countEl = document.getElementById("filter-count");
  countEl.textContent = active;
  countEl.style.display = active ? "inline-block" : "none";
  document.getElementById("event-grid").innerHTML = list.map(cardHtml).join("") ||
    `<div class="empty-state" style="grid-column:1/-1">
       <strong>No events match your filters.</strong><br>Try a different date or price range.
       <br><button class="btn" onclick="clearFilters()">Clear filters</button>
     </div>`;
}

function clearFilters() {
  els.search.value = ""; els.category.value = ""; els.venue.value = ""; els.date.value = "";
  els.pickDate.value = ""; els.priceMin.value = ""; els.priceMax.value = ""; els.freeOnly.checked = false;
  document.getElementById("pick-date-wrap").classList.add("hidden");
  render();
}

Object.values(els).forEach(el => el.addEventListener("input", render));
els.date.addEventListener("change", () => {
  document.getElementById("pick-date-wrap").classList.toggle("hidden", els.date.value !== "pick");
  render();
});
document.getElementById("clear").addEventListener("click", clearFilters);

// Phones: filters fold away behind a "Filters" button
document.getElementById("filter-toggle").addEventListener("click", e => {
  const open = document.getElementById("filters").classList.toggle("open");
  e.currentTarget.classList.toggle("open", open);
  e.currentTarget.setAttribute("aria-expanded", open);
});

if (user) {
  loadAll().then(() => {
    els.category.innerHTML += db.Categories.map(c => `<option value="${c.CategoryID}">${esc(c.Name)}</option>`).join("");
    els.venue.innerHTML += db.Venues.map(v => `<option value="${v.VenueID}">${esc(v.Name)}</option>`).join("");
    render();
  });
}
