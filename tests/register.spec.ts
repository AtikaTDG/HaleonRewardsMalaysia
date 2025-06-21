import { test, expect } from '@playwright/test';

test('successful register', async ({ page }) => {
  await page.goto('https://my.haleon-rewards.d-rive.net/login');
  await expect(page).toHaveURL(/.*login/);

  await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
  await page.getByPlaceholder('Your phone number').fill('148594474');
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await page.pause();
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
  await page.getByRole('textbox', { name: 'Full Name' }).click();
  await page.getByRole('textbox', { name: 'Full Name' }).fill('viva');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('viva@mail.com');
  await page.locator('#gender').selectOption('Female');
  await page.getByRole('textbox', { name: 'Month of Birth' }).fill('1997-05-12');
  await page.getByRole('checkbox', { name: 'I agree to the Haleon’s Terms' }).check();
  await page.getByRole('checkbox', { name: 'I authorize Haleon to share' }).check();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Proceed' }).click();
});

test('Unsuccessful Register', async ({ page }) => {
  await page.goto('https://my.haleon-rewards.d-rive.net/login');
  await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
  await page.getByPlaceholder('Your phone number').fill('122883933');
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await page.pause();
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
  await page.getByRole('textbox', { name: 'Full Name' }).click();
  await page.getByRole('textbox', { name: 'Full Name' }).fill('test123');
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByText('Invalid name format!').click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('testtt');
  await page.getByText('Invalid email format!').click();
  await page.locator('div').filter({ hasText: /^Submit$/ }).nth(4).click();
});