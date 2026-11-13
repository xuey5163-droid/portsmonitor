# PortsMonitor — AIS Data Benchmark

A Vercel-deployable benchmark that compares AISStream and Open Waters live AIS feeds for five selected port regions.

## What it does

- Connects to AISStream and Open Waters in parallel.
- Tests Miami, Singapore, Rotterdam, Shanghai and Jebel Ali.
- Runs a 60- or 120-second sample.
- Counts received position messages and unique MMSIs per provider.
- Displays latest received vessel positions on a Leaflet map.
- Exports received vessel samples to CSV.
- Keeps the AISStream API key on the server, not in browser code.

This is a short-duration regional benchmark, not a global vessel census or a permanent AIS ingestion service.

## Files

```text
portsmonitor/
├── api/
│   └── benchmark.js
├── public/
│   └── index.html
├── .gitignore
├── package.json
├── vercel.json
└── README.md
```

## Deploy without installing Node.js locally

1. Download this project ZIP and extract it.
2. Open your GitHub repository: https://github.com/xuey5163-droid/portsmonitor
3. Upload the project files and folders using **Add file → Upload files**. Keep the folder structure exactly as shown.
4. Commit the files to the repository.
5. In Vercel, choose **Add New → Project**, import `xuey5163-droid/portsmonitor`, and deploy.
6. In Vercel Project → **Settings → Environment Variables**, add:
   - Name: `AISSTREAM_API_KEY`
   - Value: your newly generated AISStream API key
   - Environments: Production (and Preview if desired)
7. Redeploy after adding the environment variable.
8. Open the deployed Vercel URL and run a benchmark.

Open Waters anonymous streaming does not require an API key. Its anonymous service has geographic-area and throughput limits; check its current terms before relying on it for a commercial product.

## Important: rotate the API key previously pasted into chat/code

An AISStream API key that has been placed in browser-side JavaScript or shared source should be treated as exposed. Disable/revoke it and create a replacement. Store the replacement only as the Vercel environment variable above. Never commit it to GitHub.

## How to use

1. Select a port region.
2. Select 60 or 120 seconds.
3. Click **Start benchmark**.
4. Wait for the server-side collection to finish.
5. Compare the provider cards and inspect the map/table.
6. Click **Export CSV** to download the vessel sample.

Keep the browser tab open while the request is running.

## Interpreting results

- `Messages`: position events accepted by this benchmark parser.
- `Unique MMSI`: distinct MMSI identifiers observed during this test window.
- `Messages/sec`: received messages divided by the requested test duration.
- `Position messages`: messages with valid latitude/longitude.
- The map plots the latest position received for each MMSI.

AIS messages are event-driven. Results vary with vessel activity, receiver coverage, provider limits and upstream availability. A zero count does not prove there are no vessels in the region.

The two providers may share upstream data sources. Do not treat their counts as independent coverage or add their vessel totals to estimate the number of real vessels without deduplicating MMSIs across providers.

This initial version does not calculate source-to-browser latency or AIS broadcast age because timestamp fields and semantics differ by feed. It measures server receipt counts and positions only.

## Vercel runtime notes

The API function runs for at most 150 seconds and the UI offers 60- or 120-second tests. Function duration and availability depend on the Vercel plan and current runtime limits. This design is for finite benchmark runs, not an always-on WebSocket collector.

If Vercel returns a function timeout, reduce the test to 60 seconds or check the project's Function Max Duration and Fluid Compute settings.

## Data rights

Before using either feed in a client-facing or commercial service, confirm the provider's current commercial-use, redistribution and attribution terms. Free access does not automatically grant unrestricted commercial redistribution.

## Official references

- AISStream documentation: https://aisstream.io/documentation/
- AISStream GitHub: https://github.com/aisstream/aisstream
- Open Waters AIS API: https://openwaters.io/api/ais/
- Open Waters limits and source code: https://github.com/openwatersio/aiscast
- Vercel Functions: https://vercel.com/docs/functions
- Vercel Function duration: https://vercel.com/docs/functions/configuring-functions/duration
