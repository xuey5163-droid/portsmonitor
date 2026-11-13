// Curated conflict / shipping-incident layer (mockup data for Phase 1).
//
// WHY THIS EXISTS:
// USGS and GDACS only cover natural hazards. For the Phase 1 mockup we also need
// war/conflict and vessel-incident events on the map. Live news APIs (e.g. GDELT)
// are the planned production source (see roadmap); for the Monday client mockup a
// small hand-curated set of well-documented real events is more stable and honest.
//
// IMPORTANT: verification is "CURATED_STATIC". These records are manually maintained
// snapshots, NOT live verified alerts. Review and refresh them before any
// client-facing use, and replace with an automated feed (GDELT / official notices)
// in a later phase.

export async function fetchCuratedDisruptions() {
  const now = new Date().toISOString();
  const events = [
    {
      event_id: "B2G-CONFLICT-REDSEA",
      source: "B2G_CURATED",
      source_event_id: "redsea-commercial-shipping",
      event_type: "CONFLICT",
      title: "Red Sea / Gulf of Aden attacks on commercial shipping",
      description: "Attacks on merchant vessels in the southern Red Sea and Bab el-Mandeb strait have rerouted container traffic around the Cape of Good Hope, extending Asia-Europe transit times and affecting Suez Canal throughput.",
      latitude: 12.65, longitude: 45.2,
      depth_km: null, magnitude: null, magnitude_type: null,
      source_alert_level: null,
      severity: "HIGH",
      occurred_at: "2023-12-15T00:00:00Z",
      updated_at: "2026-11-01T00:00:00Z",
      detected_at: now,
      status: "ACTIVE",
      verification: "CURATED_STATIC",
      geometry: {
        type: "Polygon",
        coordinates: [[
          [43.3, 12.3], [43.5, 11.7], [44.6, 11.4], [46.2, 11.6],
          [47.2, 12.2], [46.8, 13.2], [45.2, 13.6], [43.8, 13.3], [43.3, 12.3]
        ]]
      },
      source_url: "https://unctad.org/news/red-sea-black-sea-disruptions-dont-underestimate-trade-challenges-says-unctad"
    },
    {
      event_id: "B2G-CONFLICT-BLACKSEA",
      source: "B2G_CURATED",
      source_event_id: "blacksea-ukraine-ports",
      event_type: "CONFLICT",
      title: "Black Sea conflict affecting Ukrainian export ports",
      description: "Military activity around Ukrainian Black Sea ports (incl. Odesa) has periodically disrupted grain and container exports and increased war-risk insurance premiums for the region.",
      latitude: 46.3, longitude: 31.0,
      depth_km: null, magnitude: null, magnitude_type: null,
      source_alert_level: null,
      severity: "MEDIUM",
      occurred_at: "2022-02-24T00:00:00Z",
      updated_at: "2026-11-01T00:00:00Z",
      detected_at: now,
      status: "ACTIVE",
      verification: "CURATED_STATIC",
      geometry: {
        type: "Polygon",
        coordinates: [[
          [29.5, 45.2], [32.5, 45.2], [33.5, 46.5], [32.0, 47.5],
          [29.8, 47.0], [28.8, 46.0], [29.5, 45.2]
        ]]
      },
      source_url: "https://unctad.org/news/red-sea-black-sea-disruptions-dont-underestimate-trade-challenges-says-unctad"
    },
    {
      event_id: "B2G-CONFLICT-SUDAN",
      source: "B2G_CURATED",
      source_event_id: "sudan-port-sudan",
      event_type: "CONFLICT",
      title: "Sudan conflict — Port Sudan operations under stress",
      description: "Ongoing armed conflict in Sudan has displaced shipping activity toward Port Sudan, straining berths, inland logistics and humanitarian cargo handling.",
      latitude: 19.61, longitude: 37.21,
      depth_km: null, magnitude: null, magnitude_type: null,
      source_alert_level: null,
      severity: "HIGH",
      occurred_at: "2023-04-15T00:00:00Z",
      updated_at: "2026-11-01T00:00:00Z",
      detected_at: now,
      status: "ACTIVE",
      verification: "CURATED_STATIC",
      geometry: null,
      source_url: "https://www.unocha.org/sudan"
    },
    {
      event_id: "B2G-INCIDENT-BALTIMORE",
      source: "B2G_CURATED",
      source_event_id: "baltimore-key-bridge",
      event_type: "SHIPPING_INCIDENT",
      title: "Baltimore Key Bridge collapse — container ship Dali",
      description: "MV Dali struck the Francis Scott Key Bridge, collapsing it and blocking the main shipping channel into the Port of Baltimore for weeks. Fully reopened June 2024.",
      latitude: 39.209, longitude: -76.535,
      depth_km: null, magnitude: null, magnitude_type: null,
      source_alert_level: null,
      severity: "HIGH",
      occurred_at: "2024-03-26T00:00:00Z",
      updated_at: "2024-06-10T00:00:00Z",
      detected_at: now,
      status: "RESOLVED",
      verification: "CURATED_STATIC",
      geometry: {
        type: "LineString",
        coordinates: [[-76.58, 39.19], [-76.50, 39.23]]
      },
      source_url: "https://www.nsb.gov/investigations/Pages/DCA24SS047.aspx"
    },
    {
      event_id: "B2G-INCIDENT-SUEZ-EVERGIVEN",
      source: "B2G_CURATED",
      source_event_id: "suez-evergiven-2021",
      event_type: "SHIPPING_INCIDENT",
      title: "Suez Canal blockage — Ever Given (historical reference)",
      description: "Ever Given ran aground and blocked the Suez Canal for six days, holding up ~12% of global trade. Kept as a historical reference event for impact analysis.",
      latitude: 30.45, longitude: 32.36,
      depth_km: null, magnitude: null, magnitude_type: null,
      source_alert_level: null,
      severity: "HIGH",
      occurred_at: "2021-03-23T00:00:00Z",
      updated_at: "2021-03-29T00:00:00Z",
      detected_at: now,
      status: "RESOLVED",
      verification: "CURATED_STATIC",
      geometry: null,
      source_url: "https://www.bbc.com/news/world-middle-east-56567985"
    },
    {
      event_id: "B2G-DISRUPTION-PANAMA",
      source: "B2G_CURATED",
      source_event_id: "panama-canal-drought",
      event_type: "PORT_DISRUPTION",
      title: "Panama Canal drought transit restrictions",
      description: "Prolonged drought cut Gatun Lake water levels, forcing draft limits and reduced daily transits (from ~36 to 22-24 slots), congesting one of the world's key container corridors.",
      latitude: 9.08, longitude: -79.68,
      depth_km: null, magnitude: null, magnitude_type: null,
      source_alert_level: null,
      severity: "HIGH",
      occurred_at: "2023-05-01T00:00:00Z",
      updated_at: "2026-11-01T00:00:00Z",
      detected_at: now,
      status: "ACTIVE",
      verification: "CURATED_STATIC",
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-79.95, 8.95], [-79.45, 8.95], [-79.40, 9.15],
          [-79.55, 9.20], [-79.95, 9.10], [-79.95, 8.95]
        ]]
      },
      source_url: "https://www.pancanal.com/"
    },
    {
      event_id: "B2G-INCIDENT-SINGSTRAIT",
      source: "B2G_CURATED",
      source_event_id: "singapore-strait-collisions",
      event_type: "SHIPPING_INCIDENT",
      title: "Singapore Strait — repeated vessel collisions in TSS",
      description: "The Singapore Strait Traffic Separation Scheme sees recurring collision/incident reports among high traffic density; individual incidents can temporarily disrupt one of the world's busiest lanes.",
      latitude: 1.19, longitude: 103.85,
      depth_km: null, magnitude: null, magnitude_type: null,
      source_alert_level: null,
      severity: "MEDIUM",
      occurred_at: "2025-01-01T00:00:00Z",
      updated_at: "2026-11-01T00:00:00Z",
      detected_at: now,
      status: "ACTIVE",
      verification: "CURATED_STATIC",
      geometry: {
        type: "LineString",
        coordinates: [[103.75, 1.08], [104.05, 1.30]]
      },
      source_url: "https://www.straitstimes.com/tags/singapore-strait"
    },
    {
      event_id: "B2G-INCIDENT-FUJAIRAH",
      source: "B2G_CURATED",
      source_event_id: "fujairah-anchorage-incident",
      event_type: "SHIPPING_INCIDENT",
      title: "Fujairah anchorage — vessel incident reports",
      description: "The Gulf of Oman / Fujairah anchorage area periodically reports vessel seizures, collisions and tanker incidents affecting crude and product tanker scheduling.",
      latitude: 25.28, longitude: 56.36,
      depth_km: null, magnitude: null, magnitude_type: null,
      source_alert_level: null,
      severity: "MEDIUM",
      occurred_at: "2024-01-01T00:00:00Z",
      updated_at: "2026-11-01T00:00:00Z",
      detected_at: now,
      status: "ACTIVE",
      verification: "CURATED_STATIC",
      geometry: null,
      source_url: "https://www.reuters.com/business/energy/"
    }
  ];

  return {
    source: "B2G_CURATED",
    source_url: null,
    fetched_at: now,
    count: events.length,
    events
  };
}
