// Booking confirmation & e-tickets (Feature 4), with cancel (Feature 5).
const user = requireLogin(["Customer"]);
const params = new URLSearchParams(window.location.search);
const bookingId = Number(params.get("id"));
const isNew = params.get("new") === "1";

function render() {
  const b = find("Bookings", bookingId);
  const page = document.getElementById("booking-page");
  if (!b || b.UserID !== user.UserID) {
    page.innerHTML = `<div class="empty-state"><strong>Booking not found.</strong><br><a class="btn" href="my-bookings.html">My bookings</a></div>`;
    return;
  }
  const pay = paymentForBooking(b.BookingID);
  const items = itemsForBooking(b.BookingID);

  page.innerHTML = `
    ${isNew && b.Status === "Confirmed" ? `<div class="success-banner">You're booked! Your tickets are below — show the code at the door.</div>` : ""}
    <div class="two-pane">
      <div>
        <h1>Booking #${b.BookingID}</h1>
        <p class="page-sub">Booked ${fmtDate(b.BookingDate)} · ${badgeHtml(b.Status)}</p>
        ${bookingEvents(b.BookingID).map(ev => {
          const venue = find("Venues", ev.VenueID);
          const evItems = items.filter(i => (find("TicketTypes", i.TicketTypeID) || {}).EventID === ev.EventID);
          return `
          <h2 style="font-size:18px;margin-top:18px">${esc(ev.Title)}</h2>
          <div class="event-meta">${fmtDate(ev.EventDate) + " · " + fmtTime(ev.StartTime) + " · " + esc(venue ? venue.Name : "")}</div>
          <div class="ticket-cards">
            ${evItems.map(i => { const type = find("TicketTypes", i.TicketTypeID); return ticketsForItem(i.BookingItemID).map((t, n) => `
              <div class="e-ticket" style="${b.Status === "Cancelled" ? "opacity:.45" : ""}">
                <div class="e-ticket-top"><small>${esc(type ? type.Name.toUpperCase() : "")} TICKET ${n + 1} OF ${i.Quantity}</small><br><strong>${esc(ev ? ev.Title : "")}</strong></div>
                <div class="e-ticket-body">
                  <div><div class="event-meta">Ticket code</div><div class="code">${esc(t.TicketCode)}</div></div>
                  ${b.Status === "Cancelled" ? badgeHtml("Cancelled") : t.IsCheckedIn ? badgeHtml("Attended") : ""}
                </div>
              </div>`).join(""); }).join("")}
          </div>`;
        }).join("")}
      </div>

      <div class="panel-box">
        <h2>Summary</h2>
        ${items.map(i => {
          const type = find("TicketTypes", i.TicketTypeID), ev = type && find("Events", type.EventID);
          return `<div class="summary-line"><span>${i.Quantity} × ${esc(type ? type.Name : "")} — ${esc(ev ? ev.Title : "")}</span>
            <span>${i.UnitPrice === 0 ? "Free" : "$" + (i.UnitPrice * i.Quantity).toFixed(2)}</span></div>`;
        }).join("")}
        <div class="total-row"><span>Total</span><span>$${Number(b.TotalAmount).toFixed(2)}</span></div>
        <div class="summary-line"><span>Payment</span><span>${pay ? esc(pay.PaymentMethod) + " " + badgeHtml(pay.Status) : "Free — no payment"}</span></div>
        ${canCancel(b) ? `<button class="btn btn-danger" id="cancel-btn" style="margin-top:14px">Cancel booking</button>
          <p class="ticket-left" style="text-align:center;margin-top:8px">You can cancel any time before the event starts${pay ? " for a full refund" : ""}.</p>` : ""}
        <a class="btn btn-outline" href="index.html" style="text-align:center;margin-top:10px">Browse more events</a>
      </div>
    </div>`;
}

function badgeHtml(s) { return `<span class="badge badge-${s.toLowerCase()}">${esc(s)}</span>`; }

document.addEventListener("click", e => {
  if (e.target.id !== "cancel-btn") return;
  const b = find("Bookings", bookingId);
  askConfirm("Cancel this booking?",
    `All ${bookingTicketCount(b.BookingID)} ticket(s) will be released${paymentForBooking(b.BookingID) ? " and $" + Number(b.TotalAmount).toFixed(2) + " refunded to your card" : ""}.`,
    "Yes, cancel", async () => {
      await cancelBooking(bookingId);
      await loadAll();
      render();
      toast("Booking cancelled.");
    });
});

if (user) loadAll().then(render);
