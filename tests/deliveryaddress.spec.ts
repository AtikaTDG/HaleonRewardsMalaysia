import { test, expect } from '@playwright/test';

test('Successful Add Address', async ({ page }) => {
  await page.goto('https://my.haleon-rewards.d-rive.net/login');
  await expect(page).toHaveURL(/.*login/);
  await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
  await page.getByPlaceholder('Your phone number').fill('137336651');
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await page.pause();
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
  await page.locator('div').filter({ hasText: /^Profile$/ }).locator('img').click();
  await page.locator('div').filter({ hasText: /^Delivery Address$/ }).nth(1).click();
  await page.getByText('Add New Address').click();
  await page.getByRole('textbox', { name: 'Name' }).click();
  await page.getByRole('textbox', { name: 'Name' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Name' }).fill('A');
  await page.getByRole('textbox', { name: 'Name' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Name' }).fill('Atika');
  await page.getByRole('spinbutton', { name: 'Mobile Number' }).click();
  await page.getByRole('spinbutton', { name: 'Mobile Number' }).fill('60137336651');
  await page.getByRole('textbox', { name: 'Address line 1' }).click();
  await page.getByRole('textbox', { name: 'Address line 1' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Address line 1' }).fill('N');
  await page.getByRole('textbox', { name: 'Address line 1' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Address line 1' }).fill('No 4 ');
  await page.getByRole('textbox', { name: 'Address line 1' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Address line 1' }).fill('No 4 J');
  await page.getByRole('textbox', { name: 'Address line 1' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Address line 1' }).fill('No 4 Jalan ');
  await page.getByRole('textbox', { name: 'Address line 1' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Address line 1' }).fill('No 4 Jalan A');
  await page.getByRole('textbox', { name: 'Address line 1' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Address line 1' }).fill('No 4 Jalan Anders 2');
  await page.getByRole('textbox', { name: 'Address line 2' }).click();
  await page.getByRole('textbox', { name: 'Address line 2' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Address line 2' }).fill('T');
  await page.getByRole('textbox', { name: 'Address line 2' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Address line 2' }).fill('Taman ');
  await page.getByRole('textbox', { name: 'Address line 2' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Address line 2' }).fill('Taman A');
  await page.getByRole('textbox', { name: 'Address line 2' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Address line 2' }).fill('Taman Adersons');
  await page.getByRole('textbox', { name: 'City' }).click();
  await page.getByRole('textbox', { name: 'City' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'City' }).fill('K');
  await page.getByRole('textbox', { name: 'City' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'City' }).fill('Kuala ');
  await page.getByRole('textbox', { name: 'City' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'City' }).fill('Kuala L');
  await page.getByRole('textbox', { name: 'City' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'City' }).fill('Kuala Lumpur');
  await page.getByRole('spinbutton', { name: 'ZIP/Postcode' }).click();
  await page.getByRole('spinbutton', { name: 'ZIP/Postcode' }).fill('63800');
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
});

test('update delivery address', async ({ page }) => {
  await page.goto('https://my.haleon-rewards.d-rive.net/login');
  await expect(page).toHaveURL(/.*login/);
  await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
  await page.getByPlaceholder('Your phone number').fill('137336651');
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await page.pause();
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
  await page.locator('div').filter({ hasText: /^Profile$/ }).locator('img').click();
  await page.locator('div').filter({ hasText: /^Delivery Address$/ }).nth(1).click();
  //await page.pause();
  await page.getByText('Edit Delivery Address').first().click();
      
  await page.getByRole('textbox', { name: 'Name' }).click();
  await page.getByRole('textbox', { name: 'Name' }).fill('Atika ');
  await page.getByRole('textbox', { name: 'Name' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Name' }).fill('Atika A');
  await page.getByRole('textbox', { name: 'Name' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Name' }).fill('Atika Arden');
  await page.getByRole('spinbutton', { name: 'Mobile Number' }).click();
  await page.getByRole('spinbutton', { name: 'Mobile Number' }).fill('60137336652');
  await page.getByRole('textbox', { name: 'Address', exact: true }).click();
  await page.getByRole('textbox', { name: 'Address', exact: true }).fill('No 4 Jalan Ander 3');
  await page.getByRole('textbox', { name: 'Enter your address (line 2)' }).click();
  await page.getByRole('textbox', { name: 'Enter your address (line 2)' }).fill('Taman Adersons');
  await page.getByRole('textbox', { name: 'City' }).dblclick();
  await page.getByRole('textbox', { name: 'City' }).fill('');
  await page.getByRole('textbox', { name: 'City' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'City' }).fill('J');
  await page.getByRole('textbox', { name: 'City' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'City' }).fill('Johor');
  await page.getByRole('spinbutton', { name: 'ZIP/Postcode' }).click();
  await page.getByRole('spinbutton', { name: 'ZIP/Postcode' }).fill('63700');
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
});

test('test delete delivery address', async ({ page }) => {
  
  await page.goto('https://my.haleon-rewards.d-rive.net/login');
  await expect(page).toHaveURL(/.*login/);
  await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
  await page.getByPlaceholder('Your phone number').fill('137336651');
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await page.pause();
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
  await page.locator('div').filter({ hasText: /^Profile$/ }).locator('img').click();
  await page.locator('div').filter({ hasText: /^Delivery Address$/ }).nth(1).click();
  await page.locator('div:nth-child(2) > div > div:nth-child(2) > .delete-address-btn > .anticon > svg > path').click();
  await page.locator('div:nth-child(4) > div > div:nth-child(2) > .delete-address-btn > .anticon > svg').click();
  await page.getByRole('button', { name: 'Yes' }).nth(3).click();
});