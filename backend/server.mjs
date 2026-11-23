import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const databasePath = process.env.EVENTPASS_DB ??
  fileURLToPath(new URL("./eventpass.sqlite", import.meta.url));
const db = new DatabaseSync(databasePath);

db.exec("BEGIN IMMEDIATE");
try {
  db.exec(readFileSync(new URL("./schema.sql", import.meta.url), "utf8"));
  if (db.prepare("PRAGMA user_version").get().user_version === 0) {
    db.exec(readFileSync(new URL("./seed.sql", import.meta.url), "utf8"));
    db.exec("PRAGMA user_version = 1");
  }
  db.exec("COMMIT");
} catch (error) {
  db.exec("ROLLBACK");
  throw error;
}

const routes = new Map([
  ["/api/health", db.prepare("SELECT 1 AS ok")],
  ["/api/categories", db.prepare("SELECT * FROM Categories ORDER BY CategoryID")],
  ["/api/venues", db.prepare("SELECT * FROM Venues ORDER BY VenueID")],
  ["/api/events", db.prepare("SELECT * FROM Events WHERE Status = 'Active' ORDER BY EventID")],
  ["/api/tickettypes", db.prepare(`
    SELECT t.TicketTypeID, t.EventID, t.Name, t.PriceCents / 100.0 AS Price,
           t.QuantityTotal, t.QuantityAvailable
    FROM TicketTypes AS t JOIN Events AS e ON e.EventID = t.EventID
    WHERE e.Status = 'Active'
    ORDER BY t.TicketTypeID
  `)]
]);

function sendJson(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

const server = createServer((request, response) => {
  const path = request.url.split("?", 1)[0];
  const statement = routes.get(path);
  if (!statement) {
    sendJson(response, 404, { message: "Endpoint not found." });
    return;
  }
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    sendJson(response, 405, { message: "Use GET for this endpoint." });
    return;
  }
  try {
    const rows = statement.all();
    sendJson(response, 200, path === "/api/health" ? { ok: rows[0].ok === 1 } : rows);
  } catch (error) {
    console.error(error);
    sendJson(response, 500, { message: "Database request failed." });
  }
});

const port = Number(process.env.PORT ?? 3000);
server.listen(port, "127.0.0.1", () => {
  console.log(`EventPass API listening at http://127.0.0.1:${server.address().port}`);
});
