import { WORLD_PORTS } from "../lib/data/world-ports.js";
import {
  fetchPortWatchPorts,
  matchPorts,
  fetchDailySeries,
  computePortStatus
} from "../lib/sources/portwatch.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  try {
    const pwPorts = await fetchPortWatchPorts();
    const { matched, unmatched } = matchPorts(WORLD_PORTS, pwPorts);
    const seriesByPort = await fetchDailySeries(matched.map(p => p.pw_portid), 80);
    const { ports, data_last_date } = computePortStatus(matched, seriesByPort, 90);

    const count = (s) => ports.filter(p => p.status === s).length;
    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=3600");
    return res.status(200).json({
      success: true,
      generated_at: new Date().toISOString(),
      source: {
        name: "IMF PortWatch",
        url: "https://portwatch.imf.org/",
        license_note: "IMF PortWatch terms of use apply; weekly update cadence, ~1 week data lag.",
        fetched_at: new Date().toISOString(),
        pw_ports_in_database: pwPorts.length,
        matched_ports: matched.length,
        unmatched_ports: unmatched.map(p => p.id)
      },
      summary: {
        ports_in_dataset: WORLD_PORTS.length,
        matched: matched.length,
        normal: count("NORMAL"),
        busy: count("BUSY"),
        elevated: count("ELEVATED"),
        suppressed: count("SUPPRESSED"),
        unknown: count("UNKNOWN"),
        data_last_date
      },
      ports
    });
  } catch (err) {
    return res.status(502).json({
      success: false,
      error: String(err.message || err),
      source: { name: "IMF PortWatch" }
    });
  }
}
