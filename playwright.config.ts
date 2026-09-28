import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.DOCS_PORT || 4242);
const baseURL = process.env.DOCS_BASE_URL || `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './smoke',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry'
  },
  webServer: process.env.DOCS_BASE_URL
    ? undefined
    : {
        command: `npx ng serve ngx-stripe-docs --host 127.0.0.1 --port ${port}`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000
      },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
});
