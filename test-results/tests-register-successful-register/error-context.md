# Test info

- Name: successful register
- Location: C:\Users\LENOVO\haleonplay\tests\register.spec.ts:3:5

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "https://my.haleon-rewards.d-rive.net/login", waiting until "load"

    at C:\Users\LENOVO\haleonplay\tests\register.spec.ts:4:14
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test('successful register', async ({ page }) => {
>  4 |   await page.goto('https://my.haleon-rewards.d-rive.net/login');
     |              ^ Error: page.goto: Target page, context or browser has been closed
   5 |   await expect(page).toHaveURL(/.*login/);
   6 |
   7 |   await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
   8 |   await page.getByPlaceholder('Your phone number').fill('148594474');
   9 |   await page.getByRole('button', { name: 'Send OTP Code' }).click();
  10 |   await page.pause();
  11 |   await page.getByRole('button', { name: 'Verify' }).click();
  12 |   await page.getByRole('button', { name: 'Done' }).click();
  13 |   await page.getByRole('textbox', { name: 'Full Name' }).click();
  14 |   await page.getByRole('textbox', { name: 'Full Name' }).fill('viva');
  15 |   await page.getByRole('textbox', { name: 'Email' }).click();
  16 |   await page.getByRole('textbox', { name: 'Email' }).fill('viva@mail.com');
  17 |   await page.locator('#gender').selectOption('Female');
  18 |   await page.getByRole('textbox', { name: 'Month of Birth' }).fill('1997-05-12');
  19 |   await page.getByRole('checkbox', { name: 'I agree to the Haleon’s Terms' }).check();
  20 |   await page.getByRole('checkbox', { name: 'I authorize Haleon to share' }).check();
  21 |   await page.getByRole('button', { name: 'Submit' }).click();
  22 |   await page.getByRole('button', { name: 'Proceed' }).click();
  23 | });
  24 |
  25 | test('Unsuccessful Register', async ({ page }) => {
  26 |   await page.goto('https://my.haleon-rewards.d-rive.net/login');
  27 |   await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
  28 |   await page.getByPlaceholder('Your phone number').fill('122883933');
  29 |   await page.getByRole('button', { name: 'Send OTP Code' }).click();
  30 |   await page.pause();
  31 |   await page.getByRole('button', { name: 'Verify' }).click();
  32 |   await page.getByRole('button', { name: 'Done' }).click();
  33 |   await page.getByRole('textbox', { name: 'Full Name' }).click();
  34 |   await page.getByRole('textbox', { name: 'Full Name' }).fill('test123');
  35 |   await page.getByRole('button', { name: 'Submit' }).click();
  36 |   await page.getByText('Invalid name format!').click();
  37 |   await page.getByRole('textbox', { name: 'Email' }).click();
  38 |   await page.getByRole('textbox', { name: 'Email' }).fill('testtt');
  39 |   await page.getByText('Invalid email format!').click();
  40 |   await page.locator('div').filter({ hasText: /^Submit$/ }).nth(4).click();
  41 | });
```