import WebSocket from "ws";

const PORTS = {
  miami: {
    name: "Miami",
    center: [25.7748, -80.2022],
    aisBox: [[25.835, -80.208], [25.603, -79.879]],
    openWatersBox: [25.603, -80.208, 25.835, -79.879]
  },
  singapore: {
    name: "Singapore",
    center: [1.28, 103.85],
    aisBox: [[1.48, 103.60], [1.12, 104.08]],
    openWatersBox: [1.12, 103.60, 1.48, 104.08]
  },
  rotterdam: {
    name: "Rotterdam",
    center: [51.95, 4.10],
    aisBox: [[52.12, 3.80], [51.78, 4.55]],
    openWatersBox: [51.78, 3.80, 52.12, 4.55]
  },
  shanghai: {
    name: "Shanghai",
    center: [31.20, 121.55],
    aisBox: [[31.65, 121.00], [30.75, 122.20]],
    openWatersBox: [30.75, 121.00, 31.65, 122.20]
  },
  jebelali: {
    name: "Jebel Ali",
    center: [25.05, 55.05],
    aisBox: [[25.45, 54.75], [24.75, 55.45]],
    openWatersBox: [24.75, 54.75, 25.45, 55.45]
  },
  losangeles: {
    name: "Los Angeles / Long Beach",
    center: [33.73, -118.26],
    aisBox: [[34.10, -118.60], [33.40, -117.90]],
    openWatersBox: [33.40, -118.60, 34.10, -117.90]
  },
  newyork: {
    name: "New York / New Jersey",
    center: [40.67, -74.02],
    aisBox: [[40.85, -74.30], [40.45, -73.75]],
    openWatersBox: [40.45, -74.30, 40.85, -73.75]
  },
  savannah: {
    name: "Savannah",
    center: [32.08, -81.09],
    aisBox: [[32.35, -81.35], [31.85, -80.80]],
    openWatersBox: [31.85, -81.35, 32.35, -80.80]
  },
  houston: {
    name: "Houston",
    center: [29.73, -95.27],
    aisBox: [[30.05, -95.55], [29.40, -94.95]],
    openWatersBox: [29.40, -95.55, 30.05, -94.95]
  },
  portsaid: {
    name: "Port Said / Suez",
    center: [31.26, 32.30],
    aisBox: [[31.55, 32.00], [30.90, 32.70]],
    openWatersBox: [30.90, 32.00, 31.55, 32.70]
  },
  colombo: {
    name: "Colombo",
    center: [6.93, 79.84],
    aisBox: [[7.15, 79.60], [6.70, 80.10]],
    openWatersBox: [6.70, 79.60, 7.15, 80.10]
  },
  busan: {
    name: "Busan",
    center: [35.10, 129.04],
    aisBox: [[35.40, 128.75], [34.80, 129.40]],
    openWatersBox: [34.80, 128.75, 35.40, 129.40]
  }
};

// AIS ShipType -> category (same buckets MarineTraffic-style maps use)
export function classifyShip(shipType) {
  const t = Number(shipType);
  if (!Number.isFinite(t) || t === 0) return "UNKNOWN";
  if (t >= 30 && t <= 39) return "FISHING";
  if (t >= 40 && t <= 49) return "HIGH_SPEED";
  if (t >= 60 && t <= 69) return "PASSENGER";
  if (t >= 70 && t <= 79) return "CARGO";
  if (t >= 80 && t <= 89) return "TANKER";
  if (t >= 50 && t <= 59) return "OTHER";   // SAR / military / pilot / law enforcement
  if (t >= 90 && t <= 99) return "OTHER";
  return "OTHER";
}

function makeStats(provider) {
  return {
    provider,
    status: "connecting",
    messages: 0,
    rawMessages: 0,
    firstRaw: null,
    positionMessages: 0,
    staticMessages: 0,
    uniqueVessels: 0,
    vessels: new Map(),
    staticData: new Map(),
    staticDebug: null,
    errors: [],
    startedAt: new Date().toISOString(),
    endedAt: null
  };
}

function getMmsi(value) {
  if (value === undefined || value === null) return null;
  const s = String(value).trim();
  return /^\d{7,9}$/.test(s) ? s : null;
}

function addVessel(stats, mmsiValue, name, latValue, lonValue, speedValue, headingValue) {
  const mmsi = getMmsi(mmsiValue);
  if (!mmsi) return;

  const lat = Number(latValue);
  const lon = Number(lonValue);
  const hasPosition = Number.isFinite(lat) && Number.isFinite(lon)
    && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;

  stats.messages += 1;
  if (hasPosition) stats.positionMessages += 1;

  const previous = stats.vessels.get(mmsi) || {
    mmsi,
    name: "Unknown vessel",
    lat: null,
    lon: null,
    speed: null,
    heading: null,
    updates: 0,
    firstSeen: new Date().toISOString(),
    lastSeen: null
  };

  previous.name = (name && String(name).trim()) || previous.name;
  if (hasPosition) {
    previous.lat = lat;
    previous.lon = lon;
  }
  const speed = Number(speedValue);
  if (Number.isFinite(speed)) previous.speed = speed;
  const heading = Number(headingValue);
  if (Number.isFinite(heading) && heading >= 0 && heading <= 360) previous.heading = heading;
  previous.updates += 1;
  previous.lastSeen = new Date().toISOString();

  stats.vessels.set(mmsi, previous);
  stats.uniqueVessels = stats.vessels.size;
}

function addStatic(stats, mmsiValue, fields) {
  const mmsi = getMmsi(mmsiValue);
  if (!mmsi) return;
  const prev = stats.staticData.get(mmsi) || {
    mmsi, name: null, shipType: null, shipTypeText: null,
    destination: null, draught: null, length_m: null, beam_m: null
  };
  for (const [k, v] of Object.entries(fields)) {
    if (v !== null && v !== undefined && v !== "") prev[k] = v;
  }
  prev.shipClass = classifyShip(prev.shipType);
  stats.staticData.set(mmsi, prev);
}

function consumeAisStream(stats, raw) {
  let event;
  try {
    event = JSON.parse(raw.toString());
  } catch {
    return;
  }

  if (!event || event.MessageType === "SubscriptionConfirmation") return;

  // static data messages: ship type, dimensions, destination
  if (event.MessageType === "ShipStaticData") {
    const meta = event.MetaData || {};
    const msg = event.Message || {};
    const r = msg.ShipStaticData || {};
    const dim = r.Dimension || {};
    const length = (Number(dim.A) || 0) + (Number(dim.B) || 0);
    const beam = (Number(dim.C) || 0) + (Number(dim.D) || 0);
    if (!stats.staticDebug) {
      stats.staticDebug = {
        messageKeys: Object.keys(r),
        metaKeys: Object.keys(meta),
        sample: JSON.stringify({ meta, r }).slice(0, 800)
      };
    }
    addStatic(stats, meta.MMSI ?? r.UserID, {
      name: (r.Name || r.ShipName || meta.ShipName || "").trim() || null,
      shipType: r.Type ?? r.ShipType ?? meta.ShipType ?? null,
      shipTypeText: r.ShipTypeText || meta.ShipTypeText || null,
      destination: (r.Destination || "").trim() || null,
      draught: r.MaximumStaticDraught ?? r.MaximumDraught ?? null,
      length_m: length > 0 ? length : null,
      beam_m: beam > 0 ? beam : null
    });
    return;
  }

  if (event.MessageType !== "PositionReport"
      && event.MessageType !== "ExtendedClassBPositionReport"
      && event.MessageType !== "StandardClassBPositionReport") return;

  const meta = event.MetaData || {};
  const message = event.Message || {};
  const report = message.PositionReport
    || message.ExtendedClassBPositionReport
    || message.StandardClassBPositionReport
    || {};

  addVessel(
    stats,
    meta.MMSI ?? report.UserID,
    meta.ShipName,
    meta.Latitude ?? meta.latitude ?? report.Latitude,
    meta.Longitude ?? meta.longitude ?? report.Longitude,
    report.Sog,
    report.Cog ?? report.TrueHeading
  );
}

function consumeOpenWaters(stats, raw) {
  let event;
  try {
    event = JSON.parse(raw.toString());
  } catch {
    return;
  }

  if (!event || event.type !== "event") return;

  if (!stats.staticDebug) {
    stats.staticDebug = {
      eventKeys: Object.keys(event),
      sample: JSON.stringify(event).slice(0, 800)
    };
  }

  // Open Waters: for AIS message type 5 (ShipStaticData) the decoded fields
  // live inside "message" (Name / Type / MaximumStaticDraught, same naming as AISStream)
  const m = (event.message && typeof event.message === "object") ? event.message : {};
  if (event.msg_type === 5 && !stats.staticDebug.owMsg5Keys) {
    stats.staticDebug.owMsg5Keys = Object.keys(m);
    stats.staticDebug.owMsg5Sample = JSON.stringify(m).slice(0, 500);
  }
  // nav data lives in "message" for position reports — capture keys once for diagnosis
  if ([1,2,3,18,19].includes(Number(event.msg_type)) && !stats.staticDebug.owPosKeys) {
    stats.staticDebug.owPosKeys = Object.keys(m);
    stats.staticDebug.owPosSample = JSON.stringify(m).slice(0, 400);
  }

  const sog = event.sog ?? event.speed ?? m.Sog ?? m.sog ?? m.SOG ?? m.SpeedOverGround ?? null;
  const cog = event.cog ?? event.heading ?? m.Cog ?? m.cog ?? m.COG ?? m.CourseOverGround ?? null;

  addStatic(stats, event.mmsi, {
    name: event.name || event.ship_name || event.vessel_name || m.Name || m.ShipName || null,
    shipType: event.ship_type ?? event.shipType ?? m.Type ?? m.ShipType ?? null,
    shipTypeText: event.ship_type_text || event.shipTypeText || null,
    destination: (m.Destination || "").trim() || null,
    draught: m.MaximumStaticDraught ?? m.MaximumDraught ?? null
  });

  addVessel(
    stats,
    event.mmsi,
    event.name || event.ship_name || event.vessel_name,
    event.lat,
    event.lon,
    sog,
    cog
  );
}

function summarize(stats, durationSec) {
  const vessels = [...stats.vessels.values()];
  const elapsed = Math.max(1, durationSec);

  // join static data onto vessel records (same MMSI)
  const withType = vessels.map(v => {
    const s = stats.staticData.get(v.mmsi);
    return s ? { ...v, ...s, name: v.name !== "Unknown vessel" ? v.name : (s.name || v.name) } : v;
  });

  return {
    provider: stats.provider,
    status: stats.status,
    messages: stats.messages,
    positionMessages: stats.positionMessages,
    staticMessages: stats.staticData.size,
    rawMessages: stats.rawMessages,
    firstRaw: stats.firstRaw,
    uniqueVessels: stats.uniqueVessels,
    vesselsWithType: withType.filter(v => v.shipClass && v.shipClass !== "UNKNOWN").length,
    messagesPerSecond: Number((stats.messages / elapsed).toFixed(2)),
    vesselsPerMinute: Number((stats.uniqueVessels / elapsed * 60).toFixed(2)),
    errors: stats.errors,
    startedAt: stats.startedAt,
    endedAt: stats.endedAt,
    vessels: withType.slice(0, 1000),
    staticData: [...stats.staticData.values()].slice(0, 3000),
    staticDebug: stats.staticDebug
  };
}

function runProvider({ provider, url, subscribe, apiKey, durationSec, consume }) {
  return new Promise((resolve) => {
    const stats = makeStats(provider);
    let socket;
    let finished = false;
    let durationTimer;
    let connectTimer;

    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(durationTimer);
      clearTimeout(connectTimer);
      stats.endedAt = new Date().toISOString();
      try {
        if (socket && socket.readyState === WebSocket.OPEN) socket.close(1000, "Benchmark complete");
        else if (socket && socket.readyState === WebSocket.CONNECTING) socket.terminate();
      } catch {}
      if (stats.status === "connecting") stats.status = "no_connection";
      resolve(summarize(stats, durationSec));
    };

    try {
      socket = new WebSocket(url, {
        perMessageDeflate: provider === "AISStream"
      });

      connectTimer = setTimeout(() => {
        stats.errors.push("Connection timed out after 10 seconds.");
        stats.status = "connection_timeout";
        finish();
      }, 10000);

      socket.on("open", () => {
        clearTimeout(connectTimer);
        try {
          socket.send(JSON.stringify(subscribe(apiKey)));
          stats.status = "receiving";
          durationTimer = setTimeout(finish, durationSec * 1000);
        } catch (err) {
          stats.errors.push(err.message || "Subscription failed.");
          stats.status = "subscription_error";
          finish();
        }
      });

      socket.on("message", (data) => {
        if (finished) return;
        stats.rawMessages += 1;
        if (!stats.firstRaw) {
          try { stats.firstRaw = data.toString().slice(0, 300); } catch {}
        }
        try {
          consume(stats, data);
        } catch (err) {
          if (stats.errors.length < 5) stats.errors.push(err.message || "Message parsing error.");
        }
      });

      socket.on("error", (err) => {
        if (stats.errors.length < 5) stats.errors.push(err.message || "WebSocket error.");
        if (stats.status === "connecting") stats.status = "connection_error";
      });

      socket.on("close", (code, reason) => {
        if (finished) return;
        if (stats.status === "receiving") stats.status = "disconnected";
        const detail = reason?.toString();
        if (code !== 1000 && stats.errors.length < 5) {
          stats.errors.push(`Socket closed: ${code}${detail ? ` (${detail})` : ""}`);
        }
        finish();
      });
    } catch (err) {
      stats.status = "connection_error";
      stats.errors.push(err.message || "Could not create WebSocket.");
      finish();
    }
  });
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const body = req.body || {};
  const portKey = String(body.port || "miami").toLowerCase();
  const durationSec = Number(body.durationSec || 60);

  if (!PORTS[portKey]) {
    return res.status(400).json({ error: "Unknown port. Choose one of the listed ports." });
  }
  if (![60, 120].includes(durationSec)) {
    return res.status(400).json({ error: "durationSec must be 60 or 120." });
  }

  const port = PORTS[portKey];
  const tasks = [];

  if (process.env.AISSTREAM_API_KEY) {
    tasks.push(runProvider({
      provider: "AISStream",
      url: "wss://stream.aisstream.io/v0/stream",
      apiKey: process.env.AISSTREAM_API_KEY,
      durationSec,
      subscribe: (apiKey) => ({
        APIKey: apiKey,
        BoundingBoxes: [port.aisBox],
        FilterMessageTypes: [
          "PositionReport",
          "ExtendedClassBPositionReport",
          "StandardClassBPositionReport",
          "ShipStaticData"
        ]
      }),
      consume: consumeAisStream
    }));
  } else {
    tasks.push(Promise.resolve({
      provider: "AISStream",
      status: "not_configured",
      messages: 0,
      positionMessages: 0,
      staticMessages: 0,
      uniqueVessels: 0,
      vesselsWithType: 0,
      messagesPerSecond: 0,
      vesselsPerMinute: 0,
      errors: ["Set AISSTREAM_API_KEY in Vercel Environment Variables."],
      vessels: [],
      staticData: []
    }));
  }

  tasks.push(runProvider({
    provider: "Open Waters",
    url: "wss://ais.openwaters.io/v1/stream",
    durationSec,
    subscribe: () => ({
      type: "subscribe",
      bbox: [port.openWatersBox]
    }),
    consume: consumeOpenWaters
  }));

  const results = await Promise.all(tasks);

  return res.status(200).json({
    success: true,
    port: port.name,
    portKey,
    center: port.center,
    durationSec,
    generatedAt: new Date().toISOString(),
    results
  });
}
