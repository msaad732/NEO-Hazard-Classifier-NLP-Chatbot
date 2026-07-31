# Neo-Sentinel

A planetary-defence console: browse tracked near-Earth objects, model a hypothetical
impact, classify risk, and ask an analyst questions in plain language. Ships as an
installable PWA.

## Running locally

Requires Node 20 or newer.

```bash
npm install
npm run dev
```

Then open **http://localhost:5000**.

One server handles both the API and the client. In development it runs Vite in
middleware mode, so edits hot-reload; there is no separate front-end port.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR on port 5000 |
| `npm run build` | Builds the client to `dist/public` and the server to `dist/` |
| `npm start` | Serves the production build |
| `npm run check` | TypeScript typecheck |
| `npm run db:push` | Pushes the Drizzle schema (needs `DATABASE_URL`) |

### Configuration

No environment variables are required to run. Optional:

- `PORT` - defaults to `5000`.
- `DATABASE_URL` - only needed for `npm run db:push`. The running app keeps
  earthquake and tsunami data in memory (`server/storage.ts`), so it boots without
  a database.

To serve the production build:

```bash
npm run build
npm start
```

## External services

| Service | Used for | Status |
| --- | --- | --- |
| USGS earthquake feed | `/api/earthquakes`, `/api/tsunami-alerts` | Public, no key |
| Chatbot API | `/api/chatbot` | Live |
| Streamlit ML model | `/api/ml/predict` | **Not a JSON API** - see below |

The ML endpoint at `nasa-hackathon-ml-model.streamlit.app` returns a Streamlit app
shell (HTTP 303), not JSON. Until it is replaced with a real JSON API, every
prediction is answered by the local heuristic in `buildFallbackPrediction`
(`server/routes.ts`), which derives its figures deterministically from the request
parameters. Responses are tagged `source: "fallback"` and the UI labels them, so a
heuristic is never presented as a model output.

## Layout

```
client/src/
  components/       Panel, Starfield, RiskChip and the five views
  components/ui/    shadcn/ui primitives
  lib/impact.ts     Impact scaling relations (Collins, Melosh & Marcus 2005)
  lib/format.ts     Shared number formatting
server/             Express API, Vite middleware, in-memory storage
shared/schema.ts    Drizzle tables and Zod contracts shared by both sides
```

Design rules live in [design_guidelines.md](design_guidelines.md). Read them before
changing anything visual: the palette, shape scale, theme, and motion budget are
locked deliberately.

## Service worker

Registered only in production builds (`client/src/main.tsx`), and any worker left
over from a previous run is unregistered in development - otherwise it would cache
Vite's unhashed module URLs and break hot reloading.

Documents are fetched network-first so a new build is picked up immediately;
fingerprinted assets are cache-first; `/api` is never cached. Bump `CACHE_NAME` in
`client/public/sw.js` whenever you change that file.

## Notes

This project was originally scaffolded on Replit. It no longer depends on it - the
Replit Vite plugins have been removed and nothing in the code path requires the
Replit runtime. The `.replit` file is retained so the project can still be deployed
there; delete it if you do not intend to.
