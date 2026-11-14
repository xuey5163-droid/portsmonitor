import { fetchUsgsEarthquakes } from "./sources/usgs.js";
import { fetchGdacsEvents } from "./sources/gdacs.js";
import { fetchCuratedDisruptions } from "./sources/conflicts.js";
import { normalizeAndDeduplicate } from "./normalize.js";

// Shared event collection used by /api/disruptions and /api/port-exposure.
// Extracted in Step 3 so both endpoints fetch, normalize and deduplicate
// exactly the same way (previously this logic lived inside api/disruptions.js).
export async function collectEvents({ days = 30, feed = "magnitude45" } = {}) {
  const safeDays = Math.min(90, Math.max(1, Number(days) || 30));
  const safeFeed = feed === "significant" ? "significant" : "magnitude45";

  const [usgsResult, gdacsResult, curatedResult] = await Promise.allSettled([
    fetchUsgsEarthquakes({ feed: safeFeed }),
    fetchGdacsEvents({ days: safeDays }),
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
  return { sources, events, query: { gdacs_days: safeDays, usgs_feed: safeFeed } };
}
