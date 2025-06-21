# Test info

- Name: successful tap to reveal redeem voucher code
- Location: C:\Users\LENOVO\haleonplay\tests\rewardredemption.spec.ts:3:5

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "https://my.haleon-rewards.d-rive.net/login", waiting until "load"

    at C:\Users\LENOVO\haleonplay\tests\rewardredemption.spec.ts:4:14
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test('successful tap to reveal redeem voucher code', async ({ page }) => {
>  4 |   await page.goto('https://my.haleon-rewards.d-rive.net/login');
     |              ^ Error: page.goto: Target page, context or browser has been closed
   5 |   await expect(page).toHaveURL(/.*login/);
   6 |   await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
   7 |   await page.getByPlaceholder('Your phone number').fill('137336651');
   8 |   await page.getByRole('button', { name: 'Send OTP Code' }).click();
   9 |   await page.pause();
  10 |   await page.getByRole('button', { name: 'Verify' }).click();
  11 |   await page.getByRole('button', { name: 'Done' }).click();
  12 |   await page.locator('div').filter({ hasText: /^Rewards$/ }).locator('img').click();
  13 |   await page.getByText('How to Redeem?').first().click();
  14 |   await page.getByRole('button', { name: 'DONE' }).nth(2).click();
  15 |   await page.getByText('Terms & Conditions').first().click();
  16 |   await page.getByRole('button', { name: 'DONE' }).nth(2).click();
  17 |   //await page.getByText('Tap to Reveal').first().click();
  18 |   //await page.getByRole('paragraph').filter({ hasText: 'TEST_CODES' }).locator('img').click();
  19 |   //await page.locator('div').filter({ hasText: /^Rewards$/ }).locator('img').click();
  20 |   await page.getByText('TEST_CODES').first().click();
  21 | });
```