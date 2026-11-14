import { collectEvents } from "../lib/collect-events.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  const days = Math.min(90, Math.max(1, Number(req.query?.days) || 30));
  const feed = req.query?.usgsFeed === "significant" ? "significant" : "magnitude45";

  const { sources, events, query } = await collectEvents({ days, feed });

  res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=300");
  return res.status(200).json({
    success: Object.values(sources).some(s => s.status === "ok"),
    generated_at: new Date().toISOString(),
    query,
    summary: {
      total_events: events.length,
      by_source: {
        USGS: events.filter(e => e.source === "USGS").length,
        GDACS: events.filter(e => e.source === "GDACS").length,
        B2G_CURATED: events.filter(e => e.source === "B2G_CURATED").length
      },
      by_type: events.reduce((acc, event) => {
        acc[event.event_type] = (acc[event.event_type] || 0) + 1;
        return acc;
      }, {})
    },
    sources,
    events
  });
}
