import { test, expect } from '@playwright/test';

test('test successful update profile', async ({ page }) => {
  await page.goto('https://my.haleon-rewards.d-rive.net/login');
  await expect(page).toHaveURL(/.*login/);
  await expect(page.getByPlaceholder('Your phone number')).toBeVisible();

  await page.getByPlaceholder('Your phone number').fill('137336651');
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await page.pause();
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Done' }).click();

  // Go to profile section
  await page.locator('div').filter({ hasText: /^Profile$/ }).locator('img').click();
  await page.locator('div').filter({ hasText: /^Personal Details$/ }).nth(1).click();
  
  const fullNameInput = page.getByRole('textbox', { name: 'Full Name' });
  await fullNameInput.waitFor({ timeout: 10000 }); 
  //console.log(fullNameInput);
  await fullNameInput.click({ force: true });
  await page.getByRole('textbox', { name: 'Full Name' }).dblclick();
  await page.getByRole('textbox', { name: 'Full Name' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Full Name' }).fill('');
  await page.getByRole('textbox', { name: 'Full Name' }).click();
  await page.getByRole('textbox', { name: 'Full Name' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Full Name' }).press('ControlOrMeta+a');
  await page.getByRole('textbox', { name: 'Full Name' }).fill('');

  await page.pause();
  //await fullNameInput.fill('');
  await fullNameInput.type('Atika Rocky', { delay: 100 });
  await fullNameInput.evaluate(e => e.blur());
  
  const emailInput = page.getByRole('textbox', { name: '* Email Address' });
  await emailInput.waitFor({ timeout: 10000 });
  await emailInput.click({ force: true });
  await emailInput.press('Control+a');   // Select all text
  await emailInput.press('Delete');      // Delete selected text
  await emailInput.type('race@mail.com', { delay: 100 });
  await emailInput.evaluate(e => e.blur());

  //await page.pause();

  // Optional: check if Save is enabled
  const saveButton = page.getByRole('button', { name: 'Save' });
  console.log('🔓 Save enabled?', await saveButton.isEnabled());

  // Click Save
  await saveButton.click();

  // Wait for and click Done
  await page.getByRole('button', { name: 'Done' }).click();

});
