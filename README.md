# METIS // MISSION CONTROL

Private personal command center for Jordan Burton. Companion to the War Room
(`metis-warroom.netlify.app`). Single user. Never public. 13 panels, dark only.

## Files

```
metis-mission-control/
├── index.html                  ← entire dashboard (one file, no build step)
├── netlify/functions/notion.js ← server-side Notion proxy (CORS bypass)
├── netlify.toml                ← Netlify config + security headers
└── README.md
```

## Run / deploy

```bash
# local
npm install -g netlify-cli
netlify dev          # http://localhost:8888

# deploy: push to a new repo `metis-mission-control`, connect on Netlify,
# auto-deploys on every push to main. No env vars needed.
```

Opening `index.html` directly also works — it loads in **DEMO MODE** with full
fictional data, no token required.

## Going live (DEMO → LIVE)

1. Click **CONFIG** (sidebar) → paste Notion integration token + DB IDs → SAVE.
1. Token is stored in this browser’s `localStorage` only (`metis_mc_v1`).
   It is never in source and only travels browser → Netlify function → Notion.
1. **DEMO toggle** in the sidebar flips back to safe demo data anytime.

### Notion databases to create first

Per the build brief — create these and drop their IDs into CONFIG:
`Health Log`, `Protocols`, `Projects`, `Finance Log`, `Habit Log`.
Existing: Daily Logs `32e1c1ef-7923-812b-8671-ea895c6266d9`,
War Room Persons (read-only) `3231c1ef-7923-8144-8173-d83db466d2a3`.

Phase 1 ships demo-first; the live data layer (`getData()` / `notion()`) is wired
and hydrates the same render layer as each DB schema is mapped in.

## Bermuda deadline — resolved

Confirmed by Operator: **September 2026**. Default countdown is set to **2026-09-01**.
Adjust the exact day anytime in CONFIG → “Bermuda Deadline”. One field, one source of truth.

## Notes on the spec

- **Lottie**: `lottie-web` is loaded; the four key animations (boot, streak flame,
  alert pulse, success check) run as lightweight CSS so nothing breaks if an external
  Lottie JSON 404s. Drop real Lottie JSON into the same hooks anytime.
- **Moon sign** is computed as an approximation (`≈`) — precise transiting sign is an
  Orion manual drop, consistent with horoscope micro-reads being manual.
- **Venus/Mars retrograde** windows are best-effort/editable; both are **DIRECT** for the
  current window. Mercury retrograde dates are per the brief (active now → clears Jun 22).
- Day-of-week, numerology, moon phase, retrograde state, and all countdowns are computed
  live — the brief’s “SATURDAY · JUN 14” was off (Jun 14 2026 is a **Sunday**); the app
  shows the correct day.

*METIS MISSION CONTROL v1 — Eyes Only · Operator: Jordan Burton · Life Path 6 · Year 8*