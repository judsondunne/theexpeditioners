import { defineConfig, devices } from "@playwright/test";

/**
 * Tests run against a production build served locally (`npm test` builds
 * first). Set BASE_URL to test an already-running server or a preview deploy.
 */
const PORT = 3311;
const baseURL = process.env.BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  // Hosted runners share CPU/software graphics; avoid competing WebGL scenes.
  workers: process.env.CI ? 1 : undefined,
  timeout: process.env.CI ? 60_000 : 30_000,
  expect: { timeout: process.env.CI ? 10_000 : 5_000 },
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
    launchOptions: process.env.CI ? { args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] } : undefined,
  },
  projects: [
    { name: "unit", testMatch: /unit\/.*\.spec\.ts/ },
    { name: "desktop", testMatch: /e2e\/.*\.spec\.ts/, use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", testMatch: /e2e\/(layout|navigation|refinements|purchase)\.spec\.ts/, use: { ...devices["Pixel 7"], ...(process.env.CI ? { deviceScaleFactor: 1 } : {}) } },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : { command: `npm run start -- --port ${PORT}`, url: baseURL, reuseExistingServer: !process.env.CI, timeout: 60_000 },
});
