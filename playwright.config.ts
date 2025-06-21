import { defineConfig } from '@playwright/test';
import path from 'path';

export default defineConfig({
  use: {
    headless: false,
    baseURL: 'https://my.haleon-rewards.d-rive.net',
    viewport: { width: 1280, height: 800 },
    // Only load login state if NOT running the login test
    storageState: process.env.NO_AUTH === '1' ? undefined : 'auth/atika-login.json',
  },
});