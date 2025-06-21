# Test info

- Name: test upload successful
- Location: C:\Users\LENOVO\haleonplay\tests\autouploadreceipt.spec.ts:3:5

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "https://my.haleon-rewards.d-rive.net/", waiting until "load"

    at C:\Users\LENOVO\haleonplay\tests\autouploadreceipt.spec.ts:5:14
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test('test upload successful', async ({ page }) => {
   4 |   await page.setViewportSize({ width: 1280, height: 800 });
>  5 |   await page.goto('/'); // baseURL is used from config
     |              ^ Error: page.goto: Target page, context or browser has been closed
   6 |
   7 |   // If homepage shows any "Done" button from a modal, handle it
   8 |   const doneButton = page.getByRole('button', { name: 'Done' });
   9 |   if (await doneButton.isVisible()) {
  10 |     await doneButton.click();
  11 |   }
  12 |
  13 |   // Click "Upload Receipt"
  14 |   await page.locator('div').filter({ hasText: /^Upload Receipt$/ }).locator('img').click();
  15 |   await page.getByText('Upload your receiptPNG, JPEG').click();
  16 |
  17 |   // ✅ Upload file
  18 |   await page.setInputFiles('input[type="file"]', 'C:\\Users\\LENOVO\\Pictures\\Screenshots\\test.png');
  19 |
  20 |   await page.setViewportSize({ width: 1280, height: 1000 });
  21 |   await page.getByRole('button', { name: 'Submit' }).click();
  22 |
  23 |   await page.getByRole('button', { name: 'Done' }).click();
  24 | });
  25 |
  26 | test('test unable to submit without upload receipt', async ({ page }) => {
  27 |   await page.setViewportSize({ width: 1280, height: 800 });
  28 |   await page.goto('/');
  29 |
  30 |   const doneButton = page.getByRole('button', { name: 'Done' });
  31 |   if (await doneButton.isVisible()) {
  32 |     await doneButton.click();
  33 |   }
  34 |
  35 |   await page.locator('div').filter({ hasText: /^Upload Receipt$/ }).locator('img').click();
  36 |   await page.getByRole('button', { name: 'Submit' }).click();
  37 |
  38 |   await expect(page.getByText('Please upload your receipt image!')).toBeVisible();
  39 | });
  40 |
```