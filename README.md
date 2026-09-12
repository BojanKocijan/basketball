# basketball
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

### Deploying to GitHub Pages

The `.github/workflows/deploy-pages.yml` workflow builds and deploys on every push to `main`. One-time setup:

1. In repo **Settings → Pages**, set "Build and deployment" source to **GitHub Actions**.
2. Push to `main` (or run the workflow manually from the Actions tab).

The site will be published at `https://bojankocijan.github.io/basketball/`, publicly accessible to anyone with the link.

Exercise ratings and history are stored per-device in `localStorage` for now. A backend (e.g. Supabase) would let that data — and any future login — be shared across devices; that's a planned next step, not yet built.
