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

To unlock the app locally, copy `.env.example` to `.env.local` and set your own `VITE_APP_PASSWORD`.

### Build

```bash
npm run build
```

### Deploying to GitHub Pages

The `.github/workflows/deploy-pages.yml` workflow builds and deploys on every push to `main`. One-time setup:

1. In repo **Settings → Pages**, set "Build and deployment" source to **GitHub Actions**.
2. In repo **Settings → Secrets and variables → Actions**, add a secret named `APP_PASSWORD` with the team password.
3. Push to `main` (or run the workflow manually from the Actions tab).

The site will be published at `https://bojankocijan.github.io/basketball/`.

### About the password

The password screen is a **casual deterrent, not real security**. GitHub Pages only serves static files — there's no server to check the password against, so it gets baked into the JavaScript bundle and is visible to anyone who opens their browser's dev tools. It's enough to keep the link from being casually stumbled on, but not to protect anything sensitive.

Real access control needs a backend: a database to store exercise ratings/history centrally (instead of per-device `localStorage`, as it does now) and proper authentication (e.g. via Supabase, which handles both). That's a planned next step, not yet built.
