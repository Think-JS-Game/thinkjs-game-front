import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false, // Isolamento determinístico por worker/teste
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Worker determinístico sem colisão de banco
  reporter: [['html', { open: 'never' }], ['list']],
  globalSetup: './e2e/global-setup.ts',

  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium-critical',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['**/*.spec.ts'],
    },
    {
      name: 'firefox-smoke',
      use: { ...devices['Desktop Firefox'] },
      testMatch: ['**/auth.spec.ts', '**/code-runner.spec.ts'],
    },
    {
      name: 'webkit-smoke',
      use: { ...devices['Desktop Safari'] },
      testMatch: ['**/auth.spec.ts', '**/code-runner.spec.ts'],
    },
    {
      name: 'mobile-viewport',
      use: { ...devices['Pixel 5'] },
      testMatch: ['**/accessibility.spec.ts', '**/auth.spec.ts'],
    },
  ],

  webServer: [
    {
      command: process.env.CI
        ? 'npm run preview -- --port 4173'
        : 'npm run build && npm run preview -- --port 4173',
      url: 'http://localhost:4173',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      command: 'PYTHONPATH=. .venv/bin/uvicorn app.main:app --port 8000',
      url: 'http://localhost:8000/health',
      cwd: './backend',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
  ],
});
