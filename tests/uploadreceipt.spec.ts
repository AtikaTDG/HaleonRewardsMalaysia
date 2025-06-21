import { test, expect } from '@playwright/test';

test('test upload successful', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('https://my.haleon-rewards.d-rive.net/login');
  await expect(page).toHaveURL(/.*login/);
  await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
  await page.getByPlaceholder('Your phone number').fill('137336651');

  // Click "Send OTP Code"
  await page.getByRole('button', { name: 'Send OTP Code' }).click();

  // Pause for manual OTP entry
  await page.pause();

  // After you manually enter the OTP and resume the test:
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Done' }).click();

  // Click "Upload Receipt"
  await page.locator('div').filter({ hasText: /^Upload Receipt$/ }).locator('img').click();
  await page.getByText('Upload your receiptPNG, JPEG').click();

  // ✅ Upload file via the actual <input type="file"> element
  await page.setInputFiles('input[type="file"]', 'C:\\Users\\LENOVO\\Pictures\\Screenshots\\test.png');

  //await page.pause();
  //await page.screenshot();
  // Submit and verify
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.getByRole('button', { name: 'Submit' }).click();
  //await page.locator('custom-element').locator('button.submit-receipt-btn').click();
  //await page.waitForSelector('button.submit-receipt-btn', { state: 'visible', timeout: 5000 });
  //await page.locator('button.submit-receipt-btn').click();

    // Confirm success message
  //await expect(page.getByText('Receipt uploaded successfully')).toBeVisible();
  await page.getByRole('button', { name: 'Done' }).click();

});

test('test unable to submit without upload receipt', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('https://my.haleon-rewards.d-rive.net/login');
  await expect(page).toHaveURL(/.*login/);
  await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
  await page.getByPlaceholder('Your phone number').fill('137336651');

  // Click "Send OTP Code"
  await page.getByRole('button', { name: 'Send OTP Code' }).click();

  // Pause for manual OTP entry
  await page.pause();


  // After you manually enter the OTP and resume the test:
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
  await page.locator('div').filter({ hasText: /^Upload Receipt$/ }).locator('img').click();
  //await page.pause();
  //const buttons = await page.locator('button').allTextContents();
  //console.log('Buttons:', buttons);
  //await page.waitForSelector('button.submit-receipt-btn', { state: 'visible', timeout: 5000 });
  //await page.getByRole('button', { name: 'Submit' }).click();
  //const submitBtn = page.getByRole('button', { name: 'Submit' });
  //await submitBtn.scrollIntoViewIfNeeded();
  //await submitBtn.click();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.getByRole('button', { name: 'Submit' }).click();
  //await page.getByText('Please upload your receipt').click();
  //await expect(page.getByText('Please upload your receipt image!')).toBeVisible();

  //const submitBtn = page.locator('button.submit-receipt-btn');
  //console.log('Is enabled:', await submitBtn.isEnabled());
  //console.log('Is visible:', await submitBtn.isVisible());
  //await submitBtn.click({ force: true });
  await expect(page.getByText('Please upload your receipt image!')).toBeVisible();
});