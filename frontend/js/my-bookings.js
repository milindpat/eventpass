// Booking history & cancellation (Feature 5). Students only.
const user = requireLogin(["Customer"]);
let view = "upcoming";

function eventDateOf(b) {
  const evs = bookingEvents(b.BookingID);
  return evs.length ? evs.map(e => e.EventDate).sort()[0] : b.BookingDate;
}

function inView(b) {
  if (view === "cancelled") return b.Status === "Cancelled";
  if (b.Status === "Cancelled") return false;
  const past = bookingEvents(b.BookingID).every(isPast);
  return view === "past" ? past : !past;
}

function render() {
  const mine = db.Bookings.filter(b => b.UserID === user.UserID && inView(b))
    .sort((a, b) => view === "upcoming" ? eventDateOf(a).localeCompare(eventDateOf(b)) : eventDateOf(b).localeCompare(eventDateOf(a)));

  const empty = {
    upcoming: `<strong>No upcoming bookings.</strong><br>Find something to do this week.<br><a class="btn" href="index.html">Browse events</a>`,
    past: `<strong>No past events yet.</strong>`,
    cancelled: `<strong>No cancelled bookings.</strong>`
  };

  document.getElementById("booking-list").innerHTML = mine.map(b => {
    const evs = bookingEvents(b.BookingID);
    const first = evs[0];
    const items = itemsForBooking(b.BookingID);
    const attended = items.some(i => ticketsForItem(i.BookingItemID).some(t => t.IsCheckedIn));
    const status = b.Status === "Cancelled" ? "Cancelled" : view === "past" ? (attended ? "Attended" : "Confirmed") : "Confirmed";
    return `
      <div class="booking-card">
        ${first ? `<img src="${esc(eventImage(first))}" alt="">` : ""}
        <div class="booking-card-info">
          <h3>${esc(evs.map(e => e.Title).join(", ") || "Event")}</h3>
          <div class="event-meta">${first ? fmtDate(first.EventDate) + " · " + fmtTime(first.StartTime) + " · " + esc((find("Venues", first.VenueID) || {}).Name || "") : ""}</div>
          <div class="event-meta">${items.map(i => i.Quantity + " × " + esc((find("TicketTypes", i.TicketTypeID) || {}).Name || "")).join(", ")}
            · ${Number(b.TotalAmount) === 0 ? "Free" : "$" + Number(b.TotalAmount).toFixed(2)} · Booking #${b.BookingID}</div>
          <div style="margin-top:6px"><span class="badge badge-${status.toLowerCase()}">${status}</span>
            ${first && first.Status === "Cancelled" && b.Status === "Confirmed" ? `<span class="badge badge-cancelled">Event cancelled</span>` : ""}</div>
        </div>
        <div class="booking-actions">
          <a class="btn btn-outline" href="booking.html?id=${b.BookingID}">View tickets</a>
          ${canCancel(b) ? `<button class="btn btn-danger" data-cancel="${b.BookingID}">Cancel</button>` : ""}
        </div>
      </div>`;
  }).join("") || `<div class="empty-state">${empty[view]}</div>`;
}

document.querySelectorAll(".tabs button").forEach(btn => btn.addEventListener("click", () => {
  document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  view = btn.dataset.view;
  render();
}));

document.addEventListener("click", e => {
  const btn = e.target.closest("[data-cancel]");
  if (!btn) return;
  const b = find("Bookings", Number(btn.dataset.cancel));
  const paid = paymentForBooking(b.BookingID);
  askConfirm("Cancel this booking?",
    `${bookingTicketCount(b.BookingID)} ticket(s) will be released${paid ? " and $" + Number(b.TotalAmount).toFixed(2) + " refunded" : ""}.`,
    "Yes, cancel", async () => {
      await cancelBooking(b.BookingID);
      await loadAll();
      render();
      toast("Booking cancelled.");
    });
});

if (user) loadAll().then(render);
