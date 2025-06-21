# Test info

- Name: update delivery address
- Location: C:\Users\LENOVO\haleonplay\tests\deliveryaddress.spec.ts:60:5

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "https://my.haleon-rewards.d-rive.net/login", waiting until "load"

    at C:\Users\LENOVO\haleonplay\tests\deliveryaddress.spec.ts:61:14
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test('Successful Add Address', async ({ page }) => {
   4 |   await page.goto('https://my.haleon-rewards.d-rive.net/login');
   5 |   await expect(page).toHaveURL(/.*login/);
   6 |   await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
   7 |   await page.getByPlaceholder('Your phone number').fill('137336651');
   8 |   await page.getByRole('button', { name: 'Send OTP Code' }).click();
   9 |   await page.pause();
   10 |   await page.getByRole('button', { name: 'Verify' }).click();
   11 |   await page.getByRole('button', { name: 'Done' }).click();
   12 |   await page.locator('div').filter({ hasText: /^Profile$/ }).locator('img').click();
   13 |   await page.locator('div').filter({ hasText: /^Delivery Address$/ }).nth(1).click();
   14 |   await page.getByText('Add New Address').click();
   15 |   await page.getByRole('textbox', { name: 'Name' }).click();
   16 |   await page.getByRole('textbox', { name: 'Name' }).press('CapsLock');
   17 |   await page.getByRole('textbox', { name: 'Name' }).fill('A');
   18 |   await page.getByRole('textbox', { name: 'Name' }).press('CapsLock');
   19 |   await page.getByRole('textbox', { name: 'Name' }).fill('Atika');
   20 |   await page.getByRole('spinbutton', { name: 'Mobile Number' }).click();
   21 |   await page.getByRole('spinbutton', { name: 'Mobile Number' }).fill('60137336651');
   22 |   await page.getByRole('textbox', { name: 'Address line 1' }).click();
   23 |   await page.getByRole('textbox', { name: 'Address line 1' }).press('CapsLock');
   24 |   await page.getByRole('textbox', { name: 'Address line 1' }).fill('N');
   25 |   await page.getByRole('textbox', { name: 'Address line 1' }).press('CapsLock');
   26 |   await page.getByRole('textbox', { name: 'Address line 1' }).fill('No 4 ');
   27 |   await page.getByRole('textbox', { name: 'Address line 1' }).press('CapsLock');
   28 |   await page.getByRole('textbox', { name: 'Address line 1' }).fill('No 4 J');
   29 |   await page.getByRole('textbox', { name: 'Address line 1' }).press('CapsLock');
   30 |   await page.getByRole('textbox', { name: 'Address line 1' }).fill('No 4 Jalan ');
   31 |   await page.getByRole('textbox', { name: 'Address line 1' }).press('CapsLock');
   32 |   await page.getByRole('textbox', { name: 'Address line 1' }).fill('No 4 Jalan A');
   33 |   await page.getByRole('textbox', { name: 'Address line 1' }).press('CapsLock');
   34 |   await page.getByRole('textbox', { name: 'Address line 1' }).fill('No 4 Jalan Anders 2');
   35 |   await page.getByRole('textbox', { name: 'Address line 2' }).click();
   36 |   await page.getByRole('textbox', { name: 'Address line 2' }).press('CapsLock');
   37 |   await page.getByRole('textbox', { name: 'Address line 2' }).fill('T');
   38 |   await page.getByRole('textbox', { name: 'Address line 2' }).press('CapsLock');
   39 |   await page.getByRole('textbox', { name: 'Address line 2' }).fill('Taman ');
   40 |   await page.getByRole('textbox', { name: 'Address line 2' }).press('CapsLock');
   41 |   await page.getByRole('textbox', { name: 'Address line 2' }).fill('Taman A');
   42 |   await page.getByRole('textbox', { name: 'Address line 2' }).press('CapsLock');
   43 |   await page.getByRole('textbox', { name: 'Address line 2' }).fill('Taman Adersons');
   44 |   await page.getByRole('textbox', { name: 'City' }).click();
   45 |   await page.getByRole('textbox', { name: 'City' }).press('CapsLock');
   46 |   await page.getByRole('textbox', { name: 'City' }).fill('K');
   47 |   await page.getByRole('textbox', { name: 'City' }).press('CapsLock');
   48 |   await page.getByRole('textbox', { name: 'City' }).fill('Kuala ');
   49 |   await page.getByRole('textbox', { name: 'City' }).press('CapsLock');
   50 |   await page.getByRole('textbox', { name: 'City' }).fill('Kuala L');
   51 |   await page.getByRole('textbox', { name: 'City' }).press('CapsLock');
   52 |   await page.getByRole('textbox', { name: 'City' }).fill('Kuala Lumpur');
   53 |   await page.getByRole('spinbutton', { name: 'ZIP/Postcode' }).click();
   54 |   await page.getByRole('spinbutton', { name: 'ZIP/Postcode' }).fill('63800');
   55 |   await page.setViewportSize({ width: 1280, height: 1000 });
   56 |   await page.getByRole('button', { name: 'Submit' }).click();
   57 |   await page.getByRole('button', { name: 'Done' }).click();
   58 | });
   59 |
   60 | test('update delivery address', async ({ page }) => {
>  61 |   await page.goto('https://my.haleon-rewards.d-rive.net/login');
      |              ^ Error: page.goto: Target page, context or browser has been closed
   62 |   await expect(page).toHaveURL(/.*login/);
   63 |   await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
   64 |   await page.getByPlaceholder('Your phone number').fill('137336651');
   65 |   await page.getByRole('button', { name: 'Send OTP Code' }).click();
   66 |   await page.pause();
   67 |   await page.getByRole('button', { name: 'Verify' }).click();
   68 |   await page.getByRole('button', { name: 'Done' }).click();
   69 |   await page.locator('div').filter({ hasText: /^Profile$/ }).locator('img').click();
   70 |   await page.locator('div').filter({ hasText: /^Delivery Address$/ }).nth(1).click();
   71 |   //await page.pause();
   72 |   await page.getByText('Edit Delivery Address').first().click();
   73 |       
   74 |   await page.getByRole('textbox', { name: 'Name' }).click();
   75 |   await page.getByRole('textbox', { name: 'Name' }).fill('Atika ');
   76 |   await page.getByRole('textbox', { name: 'Name' }).press('CapsLock');
   77 |   await page.getByRole('textbox', { name: 'Name' }).fill('Atika A');
   78 |   await page.getByRole('textbox', { name: 'Name' }).press('CapsLock');
   79 |   await page.getByRole('textbox', { name: 'Name' }).fill('Atika Arden');
   80 |   await page.getByRole('spinbutton', { name: 'Mobile Number' }).click();
   81 |   await page.getByRole('spinbutton', { name: 'Mobile Number' }).fill('60137336652');
   82 |   await page.getByRole('textbox', { name: 'Address', exact: true }).click();
   83 |   await page.getByRole('textbox', { name: 'Address', exact: true }).fill('No 4 Jalan Ander 3');
   84 |   await page.getByRole('textbox', { name: 'Enter your address (line 2)' }).click();
   85 |   await page.getByRole('textbox', { name: 'Enter your address (line 2)' }).fill('Taman Adersons');
   86 |   await page.getByRole('textbox', { name: 'City' }).dblclick();
   87 |   await page.getByRole('textbox', { name: 'City' }).fill('');
   88 |   await page.getByRole('textbox', { name: 'City' }).press('CapsLock');
   89 |   await page.getByRole('textbox', { name: 'City' }).fill('J');
   90 |   await page.getByRole('textbox', { name: 'City' }).press('CapsLock');
   91 |   await page.getByRole('textbox', { name: 'City' }).fill('Johor');
   92 |   await page.getByRole('spinbutton', { name: 'ZIP/Postcode' }).click();
   93 |   await page.getByRole('spinbutton', { name: 'ZIP/Postcode' }).fill('63700');
   94 |   await page.setViewportSize({ width: 1280, height: 1000 });
   95 |   await page.getByRole('button', { name: 'Save' }).click();
   96 |   await page.getByRole('button', { name: 'Done' }).click();
   97 | });
   98 |
   99 | test('test delete delivery address', async ({ page }) => {
  100 |   
  101 |   await page.goto('https://my.haleon-rewards.d-rive.net/login');
  102 |   await expect(page).toHaveURL(/.*login/);
  103 |   await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
  104 |   await page.getByPlaceholder('Your phone number').fill('137336651');
  105 |   await page.getByRole('button', { name: 'Send OTP Code' }).click();
  106 |   await page.pause();
  107 |   await page.getByRole('button', { name: 'Verify' }).click();
  108 |   await page.getByRole('button', { name: 'Done' }).click();
  109 |   await page.locator('div').filter({ hasText: /^Profile$/ }).locator('img').click();
  110 |   await page.locator('div').filter({ hasText: /^Delivery Address$/ }).nth(1).click();
  111 |   await page.locator('div:nth-child(2) > div > div:nth-child(2) > .delete-address-btn > .anticon > svg > path').click();
  112 |   await page.locator('div:nth-child(4) > div > div:nth-child(2) > .delete-address-btn > .anticon > svg').click();
  113 |   await page.getByRole('button', { name: 'Yes' }).nth(3).click();
  114 | });
```