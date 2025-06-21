import { test, expect } from '@playwright/test';

test('successful tap to reveal redeem voucher code', async ({ page }) => {
  await page.goto('https://my.haleon-rewards.d-rive.net/login');
  await expect(page).toHaveURL(/.*login/);
  await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
  await page.getByPlaceholder('Your phone number').fill('137336651');
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await page.pause();
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
  await page.locator('div').filter({ hasText: /^Rewards$/ }).locator('img').click();
  await page.getByText('How to Redeem?').first().click();
  await page.getByRole('button', { name: 'DONE' }).nth(2).click();
  await page.getByText('Terms & Conditions').first().click();
  await page.getByRole('button', { name: 'DONE' }).nth(2).click();
  //await page.getByText('Tap to Reveal').first().click();
  //await page.getByRole('paragraph').filter({ hasText: 'TEST_CODES' }).locator('img').click();
  //await page.locator('div').filter({ hasText: /^Rewards$/ }).locator('img').click();
  await page.getByText('TEST_CODES').first().click();
});