import { test, expect } from '@playwright/test';

test('unsuccessful redemption', async ({ page }) => {
  await page.goto('https://my.haleon-rewards.d-rive.net/login');
  await expect(page).toHaveURL(/.*login/);

  await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
  await page.getByPlaceholder('Your phone number').fill('183234651');
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await page.pause();
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
  await page.locator('div').filter({ hasText: /^Rewards$/ }).locator('img').click();
  await page.getByRole('button', { name: 'Point Shop' }).click();
  await page.locator('div:nth-child(9) > .d-flex > img').click();
  await page.getByRole('button', { name: 'Add To Cart' }).click();
  await page.pause();
  await page.getByLabel('').nth(1).check();
  await page.getByText('Insufficient Points.').click();
});

test('Successful redeem pointshop', async ({ page }) => {
  await page.goto('https://my.haleon-rewards.d-rive.net/login');
  await expect(page).toHaveURL(/.*login/);

  await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
  await page.getByPlaceholder('Your phone number').fill('137336651');
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await page.pause();
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
  await page.locator('div').filter({ hasText: /^Rewards$/ }).locator('img').click();
  await page.getByRole('button', { name: 'Point Shop' }).click();
  await page.locator('div:nth-child(8) > .d-flex').click();
  await page.getByRole('button', { name: 'Add To Cart' }).click();
  await page.pause();
  await page.getByLabel('', { exact: true }).check();
  await page.getByRole('button', { name: 'Proceed to Checkout' }).click();
  await page.getByRole('button', { name: 'Confirm' }).click();
  await page.getByRole('button', { name: 'Go To Rewards' }).click();
  //test
});