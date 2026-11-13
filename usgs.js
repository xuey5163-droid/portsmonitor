import { normalizeUsgsFeature } from "../normalize.js";

const USGS_FEEDS = {
  significant: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson",
  magnitude45: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"
};

export async function fetchUsgsEarthquakes({ feed = "magnitude45" } = {}) {
  const url = USGS_FEEDS[feed] || USGS_FEEDS.magnitude45;
  const response = await fetch(url, {
    headers: { "Accept": "application/geo+json, application/json" },
    signal: AbortSignal.timeout(15000)
  });

  if (!response.ok) {
    throw new Error(`USGS request failed: HTTP ${response.status}`);
  }

  const payload = await response.json();
  if (!Array.isArray(payload.features)) {
    throw new Error("USGS response did not contain a GeoJSON features array");
  }

  return {
    source: "USGS",
    source_url: url,
    fetched_at: new Date().toISOString(),
    count: payload.features.length,
    events: payload.features.map(normalizeUsgsFeature)
  };
}
