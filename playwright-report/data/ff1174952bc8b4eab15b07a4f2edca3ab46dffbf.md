# Test info

- Name: Successful Login and Save Storage State
- Location: C:\Users\LENOVO\haleonplay\tests\autologin.spec.ts:5:5

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "https://my.haleon-rewards.d-rive.net/login", waiting until "load"

    at C:\Users\LENOVO\haleonplay\tests\autologin.spec.ts:6:14
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 | import fs from 'fs';
   3 | import path from 'path';
   4 |
   5 | test('Successful Login and Save Storage State', async ({ page, context }) => {
>  6 |   await page.goto('https://my.haleon-rewards.d-rive.net/login');
     |              ^ Error: page.goto: Target page, context or browser has been closed
   7 |   await expect(page).toHaveURL(/.*login/);
   8 |
   9 |   await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
  10 |   await page.getByPlaceholder('Your phone number').fill('137336651');
  11 |   await page.getByRole('button', { name: 'Send OTP Code' }).click();
  12 |
  13 |   // ⏸ Pause for manual OTP input
  14 |   await page.pause();
  15 |
  16 |   await page.getByRole('button', { name: 'Verify' }).click();
  17 |   await page.getByRole('button', { name: 'Done' }).click();
  18 |
  19 |   // Ensure `auth/` folder exists
  20 |   const authDir = path.join(__dirname, '..', 'auth');
  21 |   if (!fs.existsSync(authDir)) {
  22 |     fs.mkdirSync(authDir);
  23 |   }
  24 |
  25 |   // 💾 Save login session to file
  26 |   const statePath = path.join(authDir, 'atika-login.json');
  27 |   await context.storageState({ path: statePath });
  28 |
  29 |   console.log(`✅ Login session saved to: ${statePath}`);
  30 | });
  31 |
```