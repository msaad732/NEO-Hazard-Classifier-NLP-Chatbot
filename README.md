# Neo-Sentinel

**Empowering planetary defence.** A mission-console for near-Earth objects: browse the
catalogue, model what a given impactor would do on arrival, classify its risk, and ask
an analyst questions in plain language. Installable as a PWA and usable offline.

## Features

- **Catalogue** - characterised near-Earth objects with diameter, encounter speed, miss
  distance and close-approach date, plus derived summary telemetry and charts.
- **Impact simulator** - yield, crater diameter, fireball radius, seismic magnitude and
  recurrence interval, computed from published scaling relations rather than invented
  formulas. Validated against Barringer Crater (models 1.13 km vs ~1.2 km actual) and
  Chelyabinsk (0.54 Mt vs 0.4-0.5 Mt published).
- **Risk predictor** - threat classification from physical and orbital parameters.
- **Defence analyst** - retrieval-backed assistant for questions about the catalogue and
  deflection strategy.
- **Live geophysical data** - earthquake and tsunami feeds from USGS.

## Quick start

Requires Node 20 or newer. No API keys, no database, no environment setup.

```bash
npm install
npm run dev
```

Open **http://localhost:5000**.

A single server hosts both the API and the client. In development it runs Vite in
middleware mode, so edits hot-reload; there is no separate front-end port.

### Production

```bash
npm run build
npm start
```

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload on port 5000 |
| `npm run build` | Builds client to `dist/public`, server to `dist/` |
| `npm start` | Serves the production build |
| `npm run check` | TypeScript typecheck |
| `npm run db:push` | Pushes the Drizzle schema |

### Configuration

Everything is optional:

| Variable | Default | Used for |
| --- | --- | --- |
| `PORT` | `5000` | Server port |
| `DATABASE_URL` | none | Only `npm run db:push`. The app stores feed data in memory, so it runs without a database. |

## Tech stack

React 18 + TypeScript, Vite, Tailwind, shadcn/ui (Radix), Wouter, TanStack Query,
Chart.js and Recharts on the front end. Express + TypeScript on the back, with Drizzle
and Zod contracts shared across both sides.

## Project layout

```
client/src/
  components/       Panel, Starfield, RiskChip and the five views
  components/ui/    shadcn/ui primitives
  lib/impact.ts     Impact scaling relations (Collins, Melosh & Marcus 2005)
  lib/format.ts     Shared number formatting
  pages/            Routes
server/
  routes.ts         API endpoints and external service proxies
  storage.ts        In-memory store for feed data
  vite.ts           Dev middleware and production static serving
shared/schema.ts    Drizzle tables and Zod contracts used by client and server
```

## API

| Endpoint | Purpose |
| --- | --- |
| `GET /api/earthquakes` | Recent seismic events (USGS) |
| `GET /api/tsunami-alerts` | Tsunami alerts derived from those events |
| `POST /api/ml/predict` | Risk classification for a set of object parameters |
| `POST /api/chatbot` | Analyst question answering |

`/api/ml/predict` proxies the trained model and falls back to a local heuristic derived
from the request parameters if that service is unavailable. The response carries a
`source` field (`"model"` or `"fallback"`) and the UI labels the result accordingly, so
a heuristic is never shown as a model output.

## Design system

Visual rules live in [design_guidelines.md](design_guidelines.md). The palette, shape
scale, theme and motion budget are locked deliberately - read it before changing
anything visual.

## Offline support

The service worker is registered in production builds only. Documents are fetched
network-first so a new deploy is picked up immediately, fingerprinted assets are served
cache-first, and `/api` is never cached. If you edit `client/public/sw.js`, bump its
`CACHE_NAME`.

## Data sources

- [NASA JPL](https://api.nasa.gov/) - near-Earth object data
- [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/earthquakes/feed/) -
  seismic and tsunami feeds
- Collins, Melosh & Marcus (2005), *Earth Impact Effects Program*, Meteoritics &
  Planetary Science 40, 817-840 - impact scaling relations

Impact figures are order-of-magnitude estimates for comparing scenarios, not
operational planning tools.
