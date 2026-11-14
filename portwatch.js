// IMF PortWatch public data client (Step 4 — port activity baseline).
//
// ENDPOINTS (public ArcGIS FeatureServer, no key or sign-in required):
//   PortWatch_ports_database  — ~2,065 world ports with coordinates
//   Daily_Ports_Data          — daily port calls per port since 2019
//                               (updated weekly, ~1 week lag)
//
// TERMS: IMF PortWatch terms of use apply — keep the "PortWatch" attribution
// visible (footer + tooltips) wherever this data is displayed.

const ARCGIS_BASE =
  "https://services9.arcgis.com/weJ1QsnbMYJlCHdG/arcgis/rest/services";

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function normName(value) {
  return String(value || "").toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\b(port|of|the|terminal|city|harbour|harbor)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const COUNTRY_SYNONYMS = {
  "uae": "united arab emirates",
  "uk": "united kingdom",
  "usa": "united states",
  "us": "united states",
  "netherlands": "the netherlands",
  "korea, republic of": "south korea",
  "korea south": "south korea",
  "republic of korea": "south korea",
  "viet nam": "vietnam",
  "iran, islamic republic of": "iran",
  "taiwan, province of china": "taiwan",
  "tanzania, united republic of": "tanzania",
  "russian federation": "russia",
  "hong kong sar": "hong kong",
  "turkiye": "turkey",
  "cote divoire": "ivory coast"
};

function normCountry(value) {
  const s = String(value || "").toLowerCase()
    .replace(/[^a-z' ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return COUNTRY_SYNONYMS[s] || s;
}

// non-berth offshore facilities — never match these unless the name matches exactly
const OFFSHORE_FACILITY = /offshore|single buoy|sbm|fpso|fs[ot]\d/i;

async function queryFeatureLayer(service, layer, where, outFields, extra = "") {
  const url = `${ARCGIS_BASE}/${service}/FeatureServer/${layer}/query` +
    `?where=${encodeURIComponent(where)}` +
    `&outFields=${encodeURIComponent(outFields)}` +
    `&f=json${extra}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`${service} query failed: HTTP ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(`${service} query error: ${data.error.message || "unknown"}`);
  return data;
}

// Paginated fetch of the full PortWatch port reference (~2,065 rows).
export async function fetchPortWatchPorts() {
  const all = [];
  let offset = 0;
  const pageSize = 1000;
  for (let page = 0; page < 6; page++) {
    const data = await queryFeatureLayer(
      "PortWatch_ports_database", 0,
      "1=1",
      "portid,portname,country,lat,lon",
      `&resultOffset=${offset}&resultRecordCount=${pageSize}`
    );
    const feats = data.features || [];
    all.push(...feats.map(f => f.attributes));
    if (feats.length < pageSize) break;
    offset += pageSize;
  }
  return all;
}

// Match our curated port list to PortWatch ports:
//  1) candidates within 80 km (coordinate proximity is the primary key —
//     PortWatch names vary, e.g. "Puerto San Antonio", "Bahia De Valparaiso")
//  2) same-country candidates preferred (guards against cross-border picks,
//     e.g. Tanjung Pelepas accidentally matching a Singapore offshore terminal)
//  3) exact normalized-name matches preferred; offshore facilities excluded
//     unless their name matches exactly
//  4) fall back to the nearest candidate overall.
export function matchPorts(ourPorts, pwPorts) {
  const matched = [];
  const unmatched = [];
  for (const p of ourPorts) {
    const candidates = [];
    for (const q of pwPorts) {
      const d = haversineKm(p.lat, p.lon, q.lat, q.lon);
      if (d <= 80) candidates.push({ q, d });
    }
    if (!candidates.length) { unmatched.push(p); continue; }
    const target = normName(p.name);
    const pCountry = normCountry(p.country);

    let pool = candidates.filter(c => normCountry(c.q.country) === pCountry);
    if (!pool.length) pool = candidates;

    const exact = pool.filter(c => normName(c.q.portname) === target);
    const commercial = exact.length ? exact
      : pool.filter(c => !OFFSHORE_FACILITY.test(c.q.portid) && !OFFSHORE_FACILITY.test(c.q.portname));
    const finalPool = commercial.length ? commercial : pool;

    finalPool.sort((a, b) => a.d - b.d);
    const best = finalPool[0];
    matched.push({ ...p, pw_portid: best.q.portid, pw_portname: best.q.portname, match_distance_km: Math.round(best.d) });
  }
  return { matched, unmatched };
}

function isoDateDaysAgo(days) {
  const d = new Date(Date.now() - days * 86400000);
  return d.toISOString().slice(0, 10);
}

// Daily port-call series for the given PortWatch port ids.
// Paginates at 1,000 rows/page (server maxRecordCount).
export async function fetchDailySeries(pwPortIds, days = 110) {
  if (!pwPortIds.length) return new Map();
  const from = isoDateDaysAgo(days);
  const idList = pwPortIds.map(id => `'${id}'`).join(",");
  const byPort = new Map(pwPortIds.map(id => [id, []]));

  let offset = 0;
  const pageSize = 1000;
  for (let page = 0; page < 30; page++) {
    const data = await queryFeatureLayer(
      "Daily_Ports_Data", 0,
      `portid IN (${idList}) AND date >= '${from}'`,
      "date,portid,portname,portcalls,portcalls_container",
      `&orderByFields=date ASC&resultOffset=${offset}&resultRecordCount=${pageSize}`
    );
    const feats = data.features || [];
    for (const f of feats) {
      const a = f.attributes;
      if (byPort.has(a.portid)) byPort.get(a.portid).push(a);
    }
    if (feats.length < pageSize) break;
    offset += pageSize;
  }
  return byPort;
}

const median = (vals) => {
  if (!vals.length) return null;
  const s = [...vals].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
};
const mean = (vals) => vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;

// Baseline comparison: activity vs its own history (PortWatch-style).
// baseline = median of all days except the last 7; current = mean of last 7 days.
export function computePortStatus(matchedPorts, seriesByPort, sparkDays = 90) {
  let lastDateGlobal = null;
  const ports = matchedPorts.map(p => {
    const rows = seriesByPort.get(p.pw_portid) || [];
    const byDate = new Map();
    for (const r of rows) byDate.set(r.date, r.portcalls ?? 0);
    const dates = [...byDate.keys()].sort();
    if (dates.length) {
      const last = dates[dates.length - 1];
      if (!lastDateGlobal || last > lastDateGlobal) lastDateGlobal = last;
    }
    const hist = dates.slice(0, -7).map(d => byDate.get(d));
    const recent = dates.slice(-7);
    const baseline = hist.length >= 14 ? median(hist) : null;
    const current = recent.length ? mean(recent.map(d => byDate.get(d))) : null;
    const ratio = (baseline !== null && baseline > 0 && current !== null)
      ? current / baseline : null;
    let status = "UNKNOWN";
    if (ratio !== null) {
      if (ratio >= 1.35) status = "ELEVATED";       // far busier than usual
      else if (ratio >= 1.15) status = "BUSY";
      else if (ratio > 0.65) status = "NORMAL";
      else status = "SUPPRESSED";                    // activity collapse — possible disruption
    }
    const series = dates.slice(-sparkDays).map(d => ({ date: d, portcalls: byDate.get(d) }));
    return {
      ...p,
      status,
      ratio: ratio !== null ? Number(ratio.toFixed(2)) : null,
      baseline_median: baseline !== null ? Number(baseline.toFixed(1)) : null,
      current_7d_avg: current !== null ? Number(current.toFixed(1)) : null,
      data_days: dates.length,
      data_last_date: dates.length ? dates[dates.length - 1] : null,
      series
    };
  });
  return { ports, data_last_date: lastDateGlobal };
}
