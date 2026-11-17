// Event details page (Feature 3) + choosing tickets for the cart (Feature 4).
const user = requireLogin();
const eventId = Number(new URLSearchParams(window.location.search).get("id"));
const picked = {}; // TicketTypeID -> quantity chosen on this page

function inCart(ticketTypeId) {
  const line = getCart().find(c => c.TicketTypeID === ticketTypeId);
  return line ? line.Quantity : 0;
}

// Most a student can still add of one ticket type
function maxFor(t) {
  return Math.max(0, Math.min(t.QuantityAvailable, MAX_PER_TICKET) - inCart(t.TicketTypeID));
}

function whyNotBookable(ev) {
  if (ev.Status === "Cancelled") return "This event was cancelled.";
  if (ev.Status === "Pending") return "This event is waiting for admin approval.";
  if (isPast(ev)) return "This event has already happened.";
  return "";
}

function ticketPanel(ev) {
  const types = ticketsForEvent(ev.EventID);
  const reason = whyNotBookable(ev);
  if (reason) return `<div class="panel-box"><h2>Tickets</h2><div class="notice warn">${reason}</div></div>`;
  if (user.Role !== "Customer") {
    return `<div class="panel-box"><h2>Tickets</h2>
      ${types.map(t => `<div class="ticket-row"><div><div class="ticket-name">${esc(t.Name)}</div>
        <div class="ticket-left">${t.QuantityAvailable} of ${t.QuantityTotal} left</div></div><strong>${money(t.Price)}</strong></div>`).join("")}
      <div class="notice">Only student accounts can book tickets.</div></div>`;
  }

  const total = types.reduce((s, t) => s + t.Price * (picked[t.TicketTypeID] || 0), 0);
  const count = Object.values(picked).reduce((s, n) => s + n, 0);
  return `
    <div class="panel-box">
      <h2>Choose tickets</h2>
      ${types.map(t => {
        const q = picked[t.TicketTypeID] || 0, max = maxFor(t), cartQ = inCart(t.TicketTypeID);
        return `
        <div class="ticket-row">
          <div>
            <div class="ticket-name">${esc(t.Name)} · ${money(t.Price)}</div>
            <div class="ticket-left ${t.QuantityAvailable <= 20 ? "low" : ""}">
              ${t.QuantityAvailable === 0 ? "Sold out" : t.QuantityAvailable + " left"}${cartQ ? " · " + cartQ + " in your cart" : ""}
            </div>
          </div>
          <div class="qty">
            <button type="button" data-step="-1" data-id="${t.TicketTypeID}" ${q === 0 ? "disabled" : ""} aria-label="Fewer">−</button>
            <span>${q}</span>
            <button type="button" data-step="1" data-id="${t.TicketTypeID}" ${q >= max ? "disabled" : ""} aria-label="More">+</button>
          </div>
        </div>`;
      }).join("")}
      <div class="total-row"><span>Total</span><span>${total === 0 && count ? "Free" : "$" + total.toFixed(2)}</span></div>
      <button class="btn" id="add-to-cart" ${count === 0 ? "disabled" : ""}>Add ${count || ""} ticket${count === 1 ? "" : "s"} to cart</button>
      <p class="ticket-left" style="text-align:center;margin-top:10px">Max ${MAX_PER_TICKET} per ticket type per order.</p>
    </div>
    ${count ? `
    <div class="sticky-bar">
      <div><small>${count} ticket${count === 1 ? "" : "s"}</small><strong>${total === 0 ? "Free" : "$" + total.toFixed(2)}</strong></div>
      <button class="btn" data-add>Add to cart</button>
    </div>` : ""}`;
}

function render() {
  const ev = find("Events", eventId);
  const page = document.getElementById("event-page");
  // Students can't open events that aren't approved yet
  if (!ev || (user.Role === "Customer" && ev.Status === "Pending")) {
    page.innerHTML = `<div class="empty-state"><strong>Event not found.</strong><br><a class="btn" href="index.html">Browse events</a></div>`;
    return;
  }
  document.title = ev.Title + " | EventPass";
  const cat = find("Categories", ev.CategoryID), venue = find("Venues", ev.VenueID), org = find("Users", ev.OrganizerID);

  page.innerHTML = `
    <div class="detail">
      <div>
        <img class="detail-img" src="${esc(eventImage(ev))}" alt="${esc(ev.Title)}">
        <div class="detail-info">
          <span class="chip">${esc(cat ? cat.Name : "Event")}</span>
          <h1>${esc(ev.Title)}</h1>
          <div class="info-row"><span class="info-label">DATE</span><span>${fmtDate(ev.EventDate)}</span></div>
          <div class="info-row"><span class="info-label">TIME</span><span>${fmtTime(ev.StartTime)}</span></div>
          <div class="info-row"><span class="info-label">VENUE</span><span>${esc(venue ? venue.Name : "")}<br>
            <small class="event-meta">${esc(venue ? venue.Address + ", " + venue.City + ", " + venue.State : "")}</small></span></div>
          <div class="info-row"><span class="info-label">SEATS</span><span>${seatsLeft(ev.EventID)} of ${capacityForEvent(ev.EventID)} available</span></div>
          <div class="info-row"><span class="info-label">HOSTED BY</span><span>${esc(fullName(org))}</span></div>
          <p class="description">${esc(ev.Description || "")}</p>
        </div>
      </div>
      <div id="ticket-panel">${ticketPanel(ev)}</div>
    </div>`;
}

document.addEventListener("click", e => {
  const step = e.target.closest("[data-step]");
  if (step) {
    const id = Number(step.dataset.id);
    const t = find("TicketTypes", id);
    picked[id] = Math.max(0, Math.min(maxFor(t), (picked[id] || 0) + Number(step.dataset.step)));
    document.getElementById("ticket-panel").innerHTML = ticketPanel(find("Events", eventId));
    return;
  }
  if (e.target.id === "add-to-cart" || e.target.closest("[data-add]")) {
    let added = 0;
    Object.entries(picked).forEach(([id, q]) => { if (q > 0) { addToCart(Number(id), q); added += q; } });
    Object.keys(picked).forEach(k => delete picked[k]);
    toast(added + " ticket" + (added === 1 ? "" : "s") + " added to your cart.");
    document.getElementById("ticket-panel").innerHTML = ticketPanel(find("Events", eventId)) +
      `<a class="btn" href="cart.html" style="margin-top:12px;text-align:center">Go to cart (${cartCount()})</a>`;
  }
});

if (user) loadAll().then(render);
