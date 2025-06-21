# Test info

- Name: test upload successful
- Location: C:\Users\LENOVO\haleonplay\tests\uploadreceipt.spec.ts:3:5

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "https://my.haleon-rewards.d-rive.net/login", waiting until "load"

    at C:\Users\LENOVO\haleonplay\tests\uploadreceipt.spec.ts:5:14
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test('test upload successful', async ({ page }) => {
   4 |   await page.setViewportSize({ width: 1280, height: 800 });
>  5 |   await page.goto('https://my.haleon-rewards.d-rive.net/login');
     |              ^ Error: page.goto: Target page, context or browser has been closed
   6 |   await expect(page).toHaveURL(/.*login/);
   7 |   await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
   8 |   await page.getByPlaceholder('Your phone number').fill('137336651');
   9 |
  10 |   // Click "Send OTP Code"
  11 |   await page.getByRole('button', { name: 'Send OTP Code' }).click();
  12 |
  13 |   // Pause for manual OTP entry
  14 |   await page.pause();
  15 |
  16 |   // After you manually enter the OTP and resume the test:
  17 |   await page.getByRole('button', { name: 'Verify' }).click();
  18 |   await page.getByRole('button', { name: 'Done' }).click();
  19 |
  20 |   // Click "Upload Receipt"
  21 |   await page.locator('div').filter({ hasText: /^Upload Receipt$/ }).locator('img').click();
  22 |   await page.getByText('Upload your receiptPNG, JPEG').click();
  23 |
  24 |   // ✅ Upload file via the actual <input type="file"> element
  25 |   await page.setInputFiles('input[type="file"]', 'C:\\Users\\LENOVO\\Pictures\\Screenshots\\test.png');
  26 |
  27 |   //await page.pause();
  28 |   //await page.screenshot();
  29 |   // Submit and verify
  30 |   await page.setViewportSize({ width: 1280, height: 1000 });
  31 |   await page.getByRole('button', { name: 'Submit' }).click();
  32 |   //await page.locator('custom-element').locator('button.submit-receipt-btn').click();
  33 |   //await page.waitForSelector('button.submit-receipt-btn', { state: 'visible', timeout: 5000 });
  34 |   //await page.locator('button.submit-receipt-btn').click();
  35 |
  36 |     // Confirm success message
  37 |   //await expect(page.getByText('Receipt uploaded successfully')).toBeVisible();
  38 |   await page.getByRole('button', { name: 'Done' }).click();
  39 |
  40 | });
  41 |
  42 | test('test unable to submit without upload receipt', async ({ page }) => {
  43 |   await page.setViewportSize({ width: 1280, height: 800 });
  44 |   await page.goto('https://my.haleon-rewards.d-rive.net/login');
  45 |   await expect(page).toHaveURL(/.*login/);
  46 |   await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
  47 |   await page.getByPlaceholder('Your phone number').fill('137336651');
  48 |
  49 |   // Click "Send OTP Code"
  50 |   await page.getByRole('button', { name: 'Send OTP Code' }).click();
  51 |
  52 |   // Pause for manual OTP entry
  53 |   await page.pause();
  54 |
  55 |
  56 |   // After you manually enter the OTP and resume the test:
  57 |   await page.getByRole('button', { name: 'Verify' }).click();
  58 |   await page.getByRole('button', { name: 'Done' }).click();
  59 |   await page.locator('div').filter({ hasText: /^Upload Receipt$/ }).locator('img').click();
  60 |   //await page.pause();
  61 |   //const buttons = await page.locator('button').allTextContents();
  62 |   //console.log('Buttons:', buttons);
  63 |   //await page.waitForSelector('button.submit-receipt-btn', { state: 'visible', timeout: 5000 });
  64 |   //await page.getByRole('button', { name: 'Submit' }).click();
  65 |   //const submitBtn = page.getByRole('button', { name: 'Submit' });
  66 |   //await submitBtn.scrollIntoViewIfNeeded();
  67 |   //await submitBtn.click();
  68 |   await page.setViewportSize({ width: 1280, height: 800 });
  69 |   await page.getByRole('button', { name: 'Submit' }).click();
  70 |   //await page.getByText('Please upload your receipt').click();
  71 |   //await expect(page.getByText('Please upload your receipt image!')).toBeVisible();
  72 |
  73 |   //const submitBtn = page.locator('button.submit-receipt-btn');
  74 |   //console.log('Is enabled:', await submitBtn.isEnabled());
  75 |   //console.log('Is visible:', await submitBtn.isVisible());
  76 |   //await submitBtn.click({ force: true });
  77 |   await expect(page.getByText('Please upload your receipt image!')).toBeVisible();
  78 | });
```