import { test, expect } from '@playwright/test';

test('test upload successful', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/'); // baseURL is used from config

  // If homepage shows any "Done" button from a modal, handle it
  const doneButton = page.getByRole('button', { name: 'Done' });
  if (await doneButton.isVisible()) {
    await doneButton.click();
  }

  // Click "Upload Receipt"
  await page.locator('div').filter({ hasText: /^Upload Receipt$/ }).locator('img').click();
  await page.getByText('Upload your receiptPNG, JPEG').click();

  // ✅ Upload file
  await page.setInputFiles('input[type="file"]', 'C:\\Users\\LENOVO\\Pictures\\Screenshots\\test.png');

  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.getByRole('button', { name: 'Submit' }).click();

  await page.getByRole('button', { name: 'Done' }).click();
});

test('test unable to submit without upload receipt', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');

  const doneButton = page.getByRole('button', { name: 'Done' });
  if (await doneButton.isVisible()) {
    await doneButton.click();
  }

  await page.locator('div').filter({ hasText: /^Upload Receipt$/ }).locator('img').click();
  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page.getByText('Please upload your receipt image!')).toBeVisible();
});
