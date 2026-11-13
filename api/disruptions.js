import { fetchUsgsEarthquakes } from "../lib/sources/usgs.js";
import { fetchGdacsEvents } from "../lib/sources/gdacs.js";
import { fetchCuratedDisruptions } from "../lib/sources/conflicts.js";
import { normalizeAndDeduplicate } from "../lib/normalize.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  const days = Math.min(90, Math.max(1, Number(req.query?.days) || 30));
  const feed = req.query?.usgsFeed === "significant" ? "significant" : "magnitude45";

  const [usgsResult, gdacsResult, curatedResult] = await Promise.allSettled([
    fetchUsgsEarthquakes({ feed }),
    fetchGdacsEvents({ days }),
    fetchCuratedDisruptions()
  ]);

  const sources = {
    USGS: usgsResult.status === "fulfilled"
      ? { status: "ok", count: usgsResult.value.count, fetched_at: usgsResult.value.fetched_at, url: usgsResult.value.source_url }
      : { status: "error", error: usgsResult.reason?.message || "Unknown USGS error" },
    GDACS: gdacsResult.status === "fulfilled"
      ? { status: "ok", count: gdacsResult.value.count, fetched_at: gdacsResult.value.fetched_at, url: gdacsResult.value.source_url }
      : { status: "error", error: gdacsResult.reason?.message || "Unknown GDACS error" },
    B2G_CURATED: curatedResult.status === "fulfilled"
      ? { status: "ok", count: curatedResult.value.count, fetched_at: curatedResult.value.fetched_at, url: null }
      : { status: "error", error: curatedResult.reason?.message || "Unknown curated-source error" }
  };

  const collected = [
    ...(usgsResult.status === "fulfilled" ? usgsResult.value.events : []),
    ...(gdacsResult.status === "fulfilled" ? gdacsResult.value.events : []),
    ...(curatedResult.status === "fulfilled" ? curatedResult.value.events : [])
  ];

  const events = normalizeAndDeduplicate(collected);

  res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=300");
  return res.status(200).json({
    success: Object.values(sources).some(s => s.status === "ok"),
    generated_at: new Date().toISOString(),
    query: { gdacs_days: days, usgs_feed: feed },
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
