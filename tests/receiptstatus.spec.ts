import { test, expect } from '@playwright/test';

test('test receipt status change with page refresh', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('https://my.haleon-rewards.d-rive.net/login');

  // Login flow
  await expect(page).toHaveURL(/.*login/);
  await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
  await page.getByPlaceholder('Your phone number').fill('137336651');
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await page.pause(); // Pause for manual OTP input
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Done' }).click();

  // Upload receipt
  await page.locator('div').filter({ hasText: /^Upload Receipt$/ }).locator('img').click();
  await page.getByText('Upload your receiptPNG, JPEG').click();
  await page.setInputFiles('input[type="file"]', 'C:\\Users\\LENOVO\\Pictures\\Screenshots\\test.png');
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Done' }).click();

  // Go to history page
  await page.locator('div').filter({ hasText: /^History$/ }).locator('img').click();

  // Refresh + check loop
  let statusText = '';
  const maxRetries = 16;
  const waitBeforeReload = 60000;
  const retryInterval = 10000;

  for (let i = 0; i < maxRetries; i++) {
    // Wait before reload
    await page.waitForTimeout(waitBeforeReload);

    // Reload the page
    await page.reload();

    // Re-acquire locators after reload
    const receiptRow = page.locator('.submission-history-card').first();
    const statusLocator = receiptRow.locator('div.ml-1 > p').nth(1); // Corrected locator for status

    try {
      await expect(statusLocator).toBeVisible({ timeout: 10000 });

      const currentStatus = await statusLocator.textContent();
      statusText = currentStatus?.trim() || '';

      console.log(`Attempt ${i + 1}: Status = "${statusText}"`);

      if (/Approved|Rejected/i.test(statusText)) {
        break;
      }
    } catch (e) {
      console.log(`Attempt ${i + 1}: Status element not found or not visible`);
    }

    await page.waitForTimeout(retryInterval);
  }

  // Final assertion
  expect(statusText).toMatch(/Approved|Rejected/);

  // Optionally click to view details
  const receiptRow = page.locator('.submission-history-card').first();
  await receiptRow.click();
});
