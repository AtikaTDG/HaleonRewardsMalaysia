import { test, expect } from '@playwright/test';

test('Successful Login', async ({ page }) => {

  await page.goto('https://my.haleon-rewards.d-rive.net/login');
  await expect(page).toHaveURL(/.*login/);

  await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
  await page.getByPlaceholder('Your phone number').fill('137336651');
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await page.pause();
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
});

test('Unsuccessful Login', async ({ page }) => {
  await page.goto('https://my.haleon-rewards.d-rive.net/login');
  await page.getByRole('textbox', { name: 'Your phone number' }).click();
  await page.getByRole('textbox', { name: 'Your phone number' }).fill('137336651');
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await page.getByRole('textbox', { name: 'Please enter verification' }).click();
  await page.getByRole('textbox', { name: 'Please enter verification' }).fill('1');
  await page.getByRole('textbox', { name: 'Digit 2' }).fill('1');
  await page.getByRole('textbox', { name: 'Digit 3' }).fill('1');
  await page.getByRole('textbox', { name: 'Digit 4' }).fill('1');
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByText('Expired or invalid token').click();
});

test('Resend Code', async ({ page }) => {
  await page.goto('https://my.haleon-rewards.d-rive.net/login');
  await page.getByRole('textbox', { name: 'Your phone number' }).click();
  await page.getByRole('textbox', { name: 'Your phone number' }).fill('137336651');
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await page.getByText('Resend Code').click();
});

test('Invalid Phone Number', async ({ page }) => {
  await page.goto('https://my.haleon-rewards.d-rive.net/login');
  await page.getByRole('textbox', { name: 'Your phone number' }).click();
  await page.getByRole('textbox', { name: 'Your phone number' }).fill('19383744444');
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await page.getByText('Invalid phone number format!').click();
});