const VALID_TYPES = new Set([
  "EARTHQUAKE", "TROPICAL_CYCLONE", "FLOOD", "VOLCANO",
  "DROUGHT", "WILDFIRE", "OTHER"
]);

function firstDefined(...values) {
  return values.find(v => v !== undefined && v !== null && v !== "");
}

function asNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function toIso(value) {
  if (value === null || value === undefined || value === "") return null;
  const date = typeof value === "number" ? new Date(value) : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function flattenCoordinates(coords, output = []) {
  if (!Array.isArray(coords)) return output;
  if (coords.length >= 2 && typeof coords[0] === "number" && typeof coords[1] === "number") {
    output.push(coords);
    return output;
  }
  for (const item of coords) flattenCoordinates(item, output);
  return output;
}

function geometryPoint(geometry) {
  if (!geometry || !geometry.coordinates) return { longitude: null, latitude: null };
  const points = flattenCoordinates(geometry.coordinates);
  if (!points.length) return { longitude: null, latitude: null };
  const sum = points.reduce((acc, p) => {
    acc.longitude += p[0];
    acc.latitude += p[1];
    return acc;
  }, { longitude: 0, latitude: 0 });
  return {
    longitude: sum.longitude / points.length,
    latitude: sum.latitude / points.length
  };
}

function severityFromGdacs(level) {
  const normalized = String(level || "").toLowerCase();
  if (normalized === "red") return "HIGH";
  if (normalized === "orange") return "MEDIUM";
  if (normalized === "green") return "LOW";
  return "UNKNOWN";
}

function normalizeGdacsType(type) {
  const value = String(type || "").toUpperCase();
  const map = {
    EQ: "EARTHQUAKE", TC: "TROPICAL_CYCLONE", FL: "FLOOD",
    VO: "VOLCANO", DR: "DROUGHT", WF: "WILDFIRE"
  };
  return map[value] || (VALID_TYPES.has(value) ? value : "OTHER");
}

export function normalizeUsgsFeature(feature) {
  const p = feature?.properties || {};
  const coordinates = feature?.geometry?.coordinates || [];
  const magnitude = asNumber(p.mag);
  const id = String(feature?.id || p.code || `usgs-${p.time || "unknown"}`);

  return {
    event_id: `USGS-${id}`,
    source: "USGS",
    source_event_id: id,
    event_type: "EARTHQUAKE",
    title: p.title || p.place || "Earthquake",
    description: p.place || null,
    latitude: asNumber(coordinates[1]),
    longitude: asNumber(coordinates[0]),
    depth_km: asNumber(coordinates[2]),
    magnitude,
    magnitude_type: p.magType || null,
    source_alert_level: p.alert || null,
    severity: magnitude >= 6 ? "HIGH" : magnitude >= 5 ? "MEDIUM" : magnitude !== null ? "LOW" : "UNKNOWN",
    occurred_at: toIso(p.time),
    updated_at: toIso(p.updated),
    detected_at: new Date().toISOString(),
    status: p.status || "REPORTED",
    verification: p.status === "reviewed" ? "REVIEWED_BY_SOURCE" : "SOURCE_REPORTED",
    geometry: feature?.geometry || null,
    source_url: p.url || null,
    tsunami: p.tsunami === 1,
    felt_reports: asNumber(p.felt),
    significance: asNumber(p.sig)
  };
}

export function normalizeGdacsFeature(feature) {
  const p = feature?.properties || {};
  const geom = feature?.geometry || p.geometry || null;
  const point = geometryPoint(geom);
  const typeRaw = firstDefined(p.eventtype, p.eventType, p.type, p.event_type);
  const eventType = normalizeGdacsType(typeRaw);
  const sourceId = String(firstDefined(
    p.eventid, p.eventID, p.event_id, p.id, feature?.id, "unknown"
  ));
  const episode = firstDefined(p.episodeid, p.episodeID, p.episode_id);
  const alert = firstDefined(p.alertlevel, p.alertLevel, p.alert, p.alert_level);
  const latitude = asNumber(firstDefined(p.latitude, p.lat, point.latitude));
  const longitude = asNumber(firstDefined(p.longitude, p.lon, point.longitude));

  return {
    event_id: `GDACS-${eventType}-${sourceId}${episode !== undefined ? `-${episode}` : ""}`,
    source: "GDACS",
    source_event_id: sourceId,
    source_episode_id: episode ?? null,
    event_type: eventType,
    title: firstDefined(p.name, p.title, p.description, `${eventType} event`),
    description: firstDefined(p.description, p.htmldescription, p.summary) || null,
    latitude,
    longitude,
    depth_km: null,
    magnitude: asNumber(firstDefined(p.magnitude, p.mag, p.maxwind)),
    magnitude_type: firstDefined(p.magnitudetype, p.magnitudeType) || null,
    source_alert_level: alert || null,
    severity: severityFromGdacs(alert),
    occurred_at: toIso(firstDefined(p.fromdate, p.fromDate, p.eventdate, p.date)),
    updated_at: toIso(firstDefined(p.todate, p.toDate, p.updated)),
    detected_at: new Date().toISOString(),
    status: "ACTIVE",
    verification: "SOURCE_REPORTED",
    geometry: geom,
    source_url: firstDefined(p.url, p.htmllink, p.link) || null,
    affected_countries: firstDefined(p.country, p.countryname, p.countryName) || null
  };
}

export function normalizeAndDeduplicate(events) {
  const byId = new Map();
  for (const event of events) {
    if (!event?.event_id) continue;
    const previous = byId.get(event.event_id);
    if (!previous || Date.parse(event.updated_at || event.detected_at) >= Date.parse(previous.updated_at || previous.detected_at)) {
      byId.set(event.event_id, event);
    }
  }
  return [...byId.values()].sort((a, b) =>
    Date.parse(b.occurred_at || b.detected_at) - Date.parse(a.occurred_at || a.detected_at)
  );
}
