import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run preview -- --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
  // Three viewport tiers matching the app's breakpoints (mobile default < 768px, tablet
  // 768-1024px, desktop > 1024px — see the Players/Groups screens' md:/lg: classes) so a
  // layout regression at any tier fails CI, not just the mobile-shaped default. All three stay
  // on Chromium (CI's ci.yml only installs that engine) — 'Pixel 7' gives real mobile-viewport
  // + touch emulation without needing WebKit/Firefox installed alongside it.
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'tablet', use: { viewport: { width: 820, height: 1180 } } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  ],
})
