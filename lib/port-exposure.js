// Port Exposure engine — Step 3 (geographic screening only).
//
// PRINCIPLE: this module answers "which ports are NEAR this event", never
// "which ports are operationally impacted". Impact confirmation requires AIS
// traffic analysis / port authority notices (later phases).

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function flattenGeometryPoints(geometry, output = []) {
  if (!geometry) return output;
  if (geometry.type === "Point") {
    if (Array.isArray(geometry.coordinates) && geometry.coordinates.length >= 2) {
      output.push(geometry.coordinates);
    }
  } else if (geometry.type === "Polygon" || geometry.type === "MultiPolygon" ||
             geometry.type === "LineString" || geometry.type === "MultiLineString") {
    const walk = (coords) => {
      if (!Array.isArray(coords)) return;
      if (coords.length >= 2 && typeof coords[0] === "number" && typeof coords[1] === "number") {
        output.push(coords);
        return;
      }
      coords.forEach(walk);
    };
    walk(geometry.coordinates);
  } else if (geometry.type === "GeometryCollection") {
    (geometry.geometries || []).forEach(g => flattenGeometryPoints(g, output));
  }
  return output;
}

// Screening radius (km) by event type — coarse mockup defaults, tune later.
export function radiusForKm(event) {
  switch (event.event_type) {
    case "EARTHQUAKE": {
      const m = event.magnitude;
      if (m == null) return 100;
      if (m >= 7) return 400;
      if (m >= 6) return 250;
      if (m >= 5) return 120;
      return 60;
    }
    case "TROPICAL_CYCLONE": return 200;
    case "FLOOD": return 150;
    case "WILDFIRE": return 100;
    case "VOLCANO": return 150;
    case "CONFLICT": return 200;
    case "SHIPPING_INCIDENT": return 150;
    case "PORT_DISRUPTION": return 150;
    default: return 100;
  }
}

function exposureLabel(distanceKm, radiusKm) {
  if (distanceKm <= radiusKm * 0.4) return "CRITICAL";
  if (distanceKm <= radiusKm * 0.75) return "HIGH";
  return "WATCH";
}

function distanceToEventKm(port, event) {
  const geomPoints = flattenGeometryPoints(event.geometry);
  if (geomPoints.length) {
    // distance to nearest vertex of the source-provided geometry
    // (good approximation at mockup scale; proper polygon-distance later)
    return Math.min(...geomPoints.map(p => haversineKm(port.lat, port.lon, p[1], p[0])));
  }
  if (event.latitude != null && event.longitude != null) {
    return haversineKm(port.lat, port.lon, event.latitude, event.longitude);
  }
  return null;
}

const SEV_RANK = { HIGH: 3, MEDIUM: 2, LOW: 1, UNKNOWN: 0 };

// Returns one entry per event that has at least one port inside its radius.
// Ports sorted by distance; events sorted by severity then nearest port.
export function computeExposureForEvents(events, ports) {
  const result = [];
  for (const event of events) {
    const radiusKm = radiusForKm(event);
    const matched = ports
      .map(port => ({ port, distance: distanceToEventKm(port, event) }))
      .filter(x => x.distance !== null && x.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance)
      .map(({ port, distance }) => ({
        id: port.id,
        name: port.name,
        country: port.country,
        lat: port.lat,
        lon: port.lon,
        distance_km: Math.round(distance),
        exposure: exposureLabel(distance, radiusKm)
      }));
    if (matched.length) {
      result.push({
        event_id: event.event_id,
        title: event.title,
        event_type: event.event_type,
        severity: event.severity,
        status: event.status,
        radius_km: radiusKm,
        ports: matched
      });
    }
  }
  result.sort((a, b) =>
    (SEV_RANK[b.severity] - SEV_RANK[a.severity]) ||
    (a.ports[0].distance_km - b.ports[0].distance_km));
  return result;
}
