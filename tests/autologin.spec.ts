import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('Successful Login and Save Storage State', async ({ page, context }) => {
  await page.goto('https://my.haleon-rewards.d-rive.net/login');
  await expect(page).toHaveURL(/.*login/);

  await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
  await page.getByPlaceholder('Your phone number').fill('137336651');
  await page.getByRole('button', { name: 'Send OTP Code' }).click();

  // ⏸ Pause for manual OTP input
  await page.pause();

  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Done' }).click();

  // Ensure `auth/` folder exists
  const authDir = path.join(__dirname, '..', 'auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir);
  }

  // 💾 Save login session to file
  const statePath = path.join(authDir, 'atika-login.json');
  await context.storageState({ path: statePath });

  console.log(`✅ Login session saved to: ${statePath}`);
});
