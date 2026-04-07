import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173/',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: '..\\mvnw.cmd -f ..\\pom.xml spring-boot:run',
      url: 'http://localhost:8080/',
      reuseExistingServer: !process.env.CI,
      timeout: 180000,
    },
    {
      command: 'npm run dev -- --host localhost --port 5173',
      url: 'http://localhost:5173/',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    }
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
