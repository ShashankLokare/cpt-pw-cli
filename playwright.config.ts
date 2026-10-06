import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for ParaBank End-to-End Test Automation
 * Grounded in app-inventory.json and TEST_PLAN.md
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // banking flows have shared state; sequential per file ensures determinism
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // run single worker to avoid session collision on public demo bank
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],
  use: {
    baseURL: 'https://parabank.parasoft.com/parabank/',
    headless: true,
    actionTimeout: 15000,
    navigationTimeout: 30000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ]
});
