# Test info

- Name: unsuccessful redemption
- Location: C:\Users\LENOVO\haleonplay\tests\pointshopredemption.spec.ts:3:5

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "https://my.haleon-rewards.d-rive.net/login", waiting until "load"

    at C:\Users\LENOVO\haleonplay\tests\pointshopredemption.spec.ts:4:14
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test('unsuccessful redemption', async ({ page }) => {
>  4 |   await page.goto('https://my.haleon-rewards.d-rive.net/login');
     |              ^ Error: page.goto: Target page, context or browser has been closed
   5 |   await expect(page).toHaveURL(/.*login/);
   6 |
   7 |   await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
   8 |   await page.getByPlaceholder('Your phone number').fill('183234651');
   9 |   await page.getByRole('button', { name: 'Send OTP Code' }).click();
  10 |   await page.pause();
  11 |   await page.getByRole('button', { name: 'Verify' }).click();
  12 |   await page.getByRole('button', { name: 'Done' }).click();
  13 |   await page.locator('div').filter({ hasText: /^Rewards$/ }).locator('img').click();
  14 |   await page.getByRole('button', { name: 'Point Shop' }).click();
  15 |   await page.locator('div:nth-child(9) > .d-flex > img').click();
  16 |   await page.getByRole('button', { name: 'Add To Cart' }).click();
  17 |   await page.pause();
  18 |   await page.getByLabel('').nth(1).check();
  19 |   await page.getByText('Insufficient Points.').click();
  20 | });
  21 |
  22 | test('Successful redeem pointshop', async ({ page }) => {
  23 |   await page.goto('https://my.haleon-rewards.d-rive.net/login');
  24 |   await expect(page).toHaveURL(/.*login/);
  25 |
  26 |   await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
  27 |   await page.getByPlaceholder('Your phone number').fill('137336651');
  28 |   await page.getByRole('button', { name: 'Send OTP Code' }).click();
  29 |   await page.pause();
  30 |   await page.getByRole('button', { name: 'Verify' }).click();
  31 |   await page.getByRole('button', { name: 'Done' }).click();
  32 |   await page.locator('div').filter({ hasText: /^Rewards$/ }).locator('img').click();
  33 |   await page.getByRole('button', { name: 'Point Shop' }).click();
  34 |   await page.locator('div:nth-child(8) > .d-flex').click();
  35 |   await page.getByRole('button', { name: 'Add To Cart' }).click();
  36 |   await page.pause();
  37 |   await page.getByLabel('', { exact: true }).check();
  38 |   await page.getByRole('button', { name: 'Proceed to Checkout' }).click();
  39 |   await page.getByRole('button', { name: 'Confirm' }).click();
  40 |   await page.getByRole('button', { name: 'Go To Rewards' }).click();
  41 |   //test
  42 | });
```