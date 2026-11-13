import { normalizeGdacsFeature } from "../normalize.js";

const GDACS_SEARCH_URL = "https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH";

function dateOnly(date) {
  return date.toISOString().slice(0, 10);
}

export async function fetchGdacsEvents({ days = 30 } = {}) {
  const safeDays = Math.min(90, Math.max(1, Number(days) || 30));
  const to = new Date();
  const from = new Date(to.getTime() - safeDays * 24 * 60 * 60 * 1000);

  const url = new URL(GDACS_SEARCH_URL);
  url.searchParams.set("eventlist", "EQ;TC;FL;VO;DR;WF");
  url.searchParams.set("fromdate", dateOnly(from));
  url.searchParams.set("todate", dateOnly(to));
  url.searchParams.set("alertlevel", "red;orange;green");

  const response = await fetch(url, {
    headers: { "Accept": "application/geo+json, application/json" },
    signal: AbortSignal.timeout(20000)
  });

  if (!response.ok) {
    throw new Error(`GDACS request failed: HTTP ${response.status}`);
  }

  const payload = await response.json();
  const features = Array.isArray(payload?.features)
    ? payload.features
    : Array.isArray(payload?.data?.features)
      ? payload.data.features
      : Array.isArray(payload)
        ? payload
        : null;

  if (!features) {
    throw new Error("GDACS response format was not recognized; expected GeoJSON features");
  }

  return {
    source: "GDACS",
    source_url: url.toString(),
    fetched_at: new Date().toISOString(),
    count: features.length,
    events: features.map(normalizeGdacsFeature)
  };
}
