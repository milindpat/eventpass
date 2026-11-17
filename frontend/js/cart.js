// Shopping cart (Feature 4). Students only.
const user = requireLogin(["Customer"]);

// Joins each cart line with its ticket type and event, and checks it can still be booked.
// Also used by checkout.js.
function cartLines() {
  return getCart().map(c => {
    const type = find("TicketTypes", c.TicketTypeID);
    const ev = type && find("Events", type.EventID);
    let problem = "";
    if (!type || !ev) problem = "This ticket is no longer available.";
    else if (!isBookable(ev)) problem = ev.Status === "Cancelled" ? "This event was cancelled." : "This event is no longer available.";
    else if (type.QuantityAvailable === 0) problem = "Sold out.";
    else if (c.Quantity > type.QuantityAvailable) problem = `Only ${type.QuantityAvailable} left — lower the quantity.`;
    return { ...c, type, ev, problem, lineTotal: type ? type.Price * c.Quantity : 0 };
  });
}

function cartTotal(lines) { return lines.reduce((s, l) => s + l.lineTotal, 0); }

function renderCart() {
  const lines = cartLines();
  const page = document.getElementById("cart-page");
  if (!lines.length) {
    page.innerHTML = `<div class="empty-state"><strong>Your cart is empty.</strong><br>Find an event and add some tickets.
      <br><a class="btn" href="index.html">Browse events</a></div>`;
    return;
  }
  const total = cartTotal(lines);
  const hasProblem = lines.some(l => l.problem);
  const count = lines.reduce((s, l) => s + l.Quantity, 0);

  page.innerHTML = `
    <div class="two-pane">
      <div>
        ${lines.map(l => l.ev ? `
          <div class="cart-item">
            <img src="${esc(eventImage(l.ev))}" alt="">
            <div class="cart-item-info">
              <h3><a href="event.html?id=${l.ev.EventID}">${esc(l.ev.Title)}</a></h3>
              <div class="event-meta">${fmtDate(l.ev.EventDate)} · ${fmtTime(l.ev.StartTime)} · ${esc((find("Venues", l.ev.VenueID) || {}).Name || "")}</div>
              <div class="event-meta">${esc(l.type.Name)} ticket · ${money(l.type.Price)} each</div>
              ${l.problem ? `<div class="line-error">${l.problem}</div>` : ""}
            </div>
            <div class="cart-item-side">
              <div class="qty">
                <button type="button" data-step="-1" data-id="${l.TicketTypeID}" aria-label="Fewer">−</button>
                <span>${l.Quantity}</span>
                <button type="button" data-step="1" data-id="${l.TicketTypeID}"
                  ${l.Quantity >= Math.min(l.type.QuantityAvailable, MAX_PER_TICKET) ? "disabled" : ""} aria-label="More">+</button>
              </div>
              <strong>${l.lineTotal === 0 ? "Free" : "$" + l.lineTotal.toFixed(2)}</strong>
              <button class="remove-btn" data-remove="${l.TicketTypeID}">Remove</button>
            </div>
          </div>` : `
          <div class="cart-item"><div class="cart-item-info"><div class="line-error">${l.problem}</div></div>
            <div class="cart-item-side"><button class="remove-btn" data-remove="${l.TicketTypeID}">Remove</button></div></div>`
        ).join("")}
      </div>
      <div class="panel-box">
        <h2>Order summary</h2>
        ${lines.filter(l => l.ev).map(l => `
          <div class="summary-line"><span>${l.Quantity} × ${esc(l.type.Name)} — ${esc(l.ev.Title)}</span><span>${l.lineTotal === 0 ? "Free" : "$" + l.lineTotal.toFixed(2)}</span></div>`).join("")}
        <div class="total-row"><span>Total (${count} ticket${count === 1 ? "" : "s"})</span><span>$${total.toFixed(2)}</span></div>
        ${hasProblem ? `<div class="notice warn" style="margin-bottom:12px">Fix the items marked in red before checking out.</div>` : ""}
        <a class="btn ${hasProblem ? "disabled-link" : ""}" id="checkout-btn" href="${hasProblem ? "#" : "checkout.html"}"
           style="text-align:center;${hasProblem ? "opacity:.5;pointer-events:none" : ""}">Continue to checkout</a>
        <a href="index.html" class="back-link" style="display:block;text-align:center;margin-top:12px">Keep browsing</a>
      </div>
    </div>`;
}

if (document.getElementById("cart-page")) {
  document.addEventListener("click", e => {
    const step = e.target.closest("[data-step]");
    const remove = e.target.closest("[data-remove]");
    if (!step && !remove) return;
    const cart = getCart();
    if (remove) {
      saveCart(cart.filter(c => c.TicketTypeID !== Number(remove.dataset.remove)));
      toast("Removed from cart.");
    } else {
      const line = cart.find(c => c.TicketTypeID === Number(step.dataset.id));
      const type = find("TicketTypes", line.TicketTypeID);
      line.Quantity = Math.max(0, Math.min(Math.min(type.QuantityAvailable, MAX_PER_TICKET), line.Quantity + Number(step.dataset.step)));
      saveCart(cart);
    }
    renderCart();
  });
  if (user) loadAll().then(renderCart);
}
