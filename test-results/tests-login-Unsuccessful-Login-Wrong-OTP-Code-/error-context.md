# Test info

- Name: Unsuccessful Login (Wrong OTP Code)
- Location: C:\Users\LENOVO\haleonplay\tests\login.spec.ts:16:5

# Error details

```
Error: locator.click: Target page, context or browser has been closed
Call log:
  - waiting for getByRole('textbox', { name: 'Please enter verification' })

    at C:\Users\LENOVO\haleonplay\tests\login.spec.ts:21:74
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test('Successful Login', async ({ page }) => {
   4 |
   5 |   await page.goto('https://my.haleon-rewards.d-rive.net/login');
   6 |   await expect(page).toHaveURL(/.*login/);
   7 |
   8 |   await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
   9 |   await page.getByPlaceholder('Your phone number').fill('137336651');
  10 |   await page.getByRole('button', { name: 'Send OTP Code' }).click();
  11 |   await page.pause();
  12 |   await page.getByRole('button', { name: 'Verify' }).click();
  13 |   await page.getByRole('button', { name: 'Done' }).click();
  14 | });
  15 |
  16 | test('Unsuccessful Login (Wrong OTP Code)', async ({ page }) => {
  17 |   await page.goto('https://my.haleon-rewards.d-rive.net/login');
  18 |   await page.getByRole('textbox', { name: 'Your phone number' }).click();
  19 |   await page.getByRole('textbox', { name: 'Your phone number' }).fill('137336651');
  20 |   await page.getByRole('button', { name: 'Send OTP Code' }).click();
> 21 |   await page.getByRole('textbox', { name: 'Please enter verification' }).click();
     |                                                                          ^ Error: locator.click: Target page, context or browser has been closed
  22 |   await page.getByRole('textbox', { name: 'Please enter verification' }).fill('1');
  23 |   await page.getByRole('textbox', { name: 'Digit 2' }).fill('1');
  24 |   await page.getByRole('textbox', { name: 'Digit 3' }).fill('1');
  25 |   await page.getByRole('textbox', { name: 'Digit 4' }).fill('1');
  26 |   await page.getByRole('button', { name: 'Verify' }).click();
  27 |   await page.getByText('Expired or invalid token').click();
  28 | });
  29 |
  30 | test('Resend Code', async ({ page }) => {
  31 |   await page.goto('https://my.haleon-rewards.d-rive.net/login');
  32 |   await page.getByRole('textbox', { name: 'Your phone number' }).click();
  33 |   await page.getByRole('textbox', { name: 'Your phone number' }).fill('137336651');
  34 |   await page.getByRole('button', { name: 'Send OTP Code' }).click();
  35 |   await page.getByText('Resend Code').click();
  36 | });
  37 |
  38 | test('Invalid Phone Number', async ({ page }) => {
  39 |   await page.goto('https://my.haleon-rewards.d-rive.net/login');
  40 |   await page.getByRole('textbox', { name: 'Your phone number' }).click();
  41 |   await page.getByRole('textbox', { name: 'Your phone number' }).fill('19383744444');
  42 |   await page.getByRole('button', { name: 'Send OTP Code' }).click();
  43 |   await page.getByText('Invalid phone number format!').click();
  44 | });
```