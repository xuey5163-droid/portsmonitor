import { collectEvents } from "../lib/collect-events.js";
import { computeExposureForEvents } from "../lib/port-exposure.js";
import { WORLD_PORTS } from "../lib/data/world-ports.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  const days = Math.min(90, Math.max(1, Number(req.query?.days) || 30));
  const feed = req.query?.usgsFeed === "significant" ? "significant" : "magnitude45";

  const { sources, events, query } = await collectEvents({ days, feed });
  const exposures = computeExposureForEvents(events, WORLD_PORTS);

  const exposedPortIds = new Set();
  exposures.forEach(ex => ex.ports.forEach(p => exposedPortIds.add(p.id)));

  res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=300");
  return res.status(200).json({
    success: Object.values(sources).some(s => s.status === "ok"),
    generated_at: new Date().toISOString(),
    query,
    summary: {
      events_with_exposure: exposures.length,
      unique_exposed_ports: exposedPortIds.size,
      total_events: events.length,
      ports_in_dataset: WORLD_PORTS.length
    },
    sources,
    exposures,
    ports: WORLD_PORTS
  });
}
