# sports-training-ui
Trainers

## U8 Training App

A mobile-first React app for running the U8 basketball training session:

- **Setup** — pre-session equipment checklist, coach roles, coaching principles
- **Exercises** — the exercise library: filter by category (dribbling, passing, shooting, defense & movement, agility, team play, warm-up), rate how much the kids liked each one, and build a focused custom training or start the full 60-minute session
- **Session** — live timer that runs through whichever training you built, with bilingual coaching cues and quick jump/prev/next controls
- **Words** — searchable bilingual (Dutch/English) coaching vocabulary

### Run it

```bash
npm install
npm run dev
```

Open the printed local URL on your phone (same network) or in a mobile-width browser window.

### Build

```bash
npm run build
```

### Deploying

Deployed via Netlify, connected to this repo's GitHub App integration — every push to `main` builds and deploys automatically (see `netlify.toml`; the build runs the unit suite before `vite build`, so a failing test blocks a bad deploy). No GitHub Pages — this repo previously also deployed there, but that's been dropped in favor of Netlify only.

Exercise ratings and history are stored per-device in `localStorage`. Shared, dated training plans, club info, and the trainer passcode check go through [`sports-training-api`](https://github.com/BojanKocijan/sports-training-api) (`src/lib/apiClient.ts`) — the browser never talks to Supabase directly. Set `VITE_API_URL` (see `.env.example`) to point at your API deployment.
