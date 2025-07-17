import { test, expect } from '@playwright/test';

/*test('Successful Login', async ({ page }) => {

  await page.goto('https://my.haleon-rewards.d-rive.net/login');
  await expect(page).toHaveURL(/.*login/);

  await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
  await page.getByPlaceholder('Your phone number').fill('137336651');
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await page.pause();
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
});

test('Unsuccessful Login (Wrong OTP Code)', async ({ page }) => {
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
}); */

test('Successful Login', async ({ page }) => {
  await page.goto('https://my.haleon-rewards.d-rive.net/login');
  await expect(page).toHaveURL(/.*login/);

  await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
  await page.getByPlaceholder('Your phone number').fill('137336651');
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await page.pause(); // Replace this with actual OTP handling logic
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
  await expect(page).toHaveURL(/.*home/); // Assuming successful login redirects to dashboard
});

test('Unsuccessful Login (Wrong OTP Code)', async ({ page }) => {
  await page.goto('https://my.haleon-rewards.d-rive.net/login');
  await page.getByPlaceholder('Your phone number').fill('137336651');
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await page.getByRole('textbox', { name: 'Please enter verification' }).fill('1');
  await page.getByRole('textbox', { name: 'Digit 2' }).fill('1');
  await page.getByRole('textbox', { name: 'Digit 3' }).fill('1');
  await page.getByRole('textbox', { name: 'Digit 4' }).fill('1');
  await page.getByRole('button', { name: 'Verify' }).click();
  await expect(page.getByText('Expired or invalid token')).toBeVisible();
});

// Test: Resend OTP Code
test('Resend Code', async ({ page }) => {
  test.setTimeout(90000); // Increase test timeout

  await page.goto('https://my.haleon-rewards.d-rive.net/login');

  // Fill in phone number
  await page.getByPlaceholder('Your phone number').fill('137336651');

  // Click "Send OTP Code"
  await page.getByRole('button', { name: 'Send OTP Code' }).click();

  // Wait 60 seconds before clicking "Resend Code"
  await page.waitForTimeout(60000);

  // Wait for "Resend Code" to become visible
  const resendCode = await page.waitForSelector(
    'p.text-center[style*="cursor: pointer"]:has-text("Resend Code")',
    { state: 'visible' }
  );

  // Click "Resend Code"
  await resendCode.click();

  // Assert the success message
  await expect(
    page.getByText('new otp code sent successfully', { exact: true })
  ).toBeVisible();
});

test('Login with Empty Phone Number', async ({ page }) => {
  await page.goto('https://my.haleon-rewards.d-rive.net/login');
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await expect(page.getByText('Phone is required')).toBeVisible(); // Eerror message is displayed
});

test('Login with Invalid Phone Number Format', async ({ page }) => {
  await page.goto('https://my.haleon-rewards.d-rive.net/login');
  await page.getByPlaceholder('Your phone number').fill('invalid-phone');
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await expect(page.getByText('Invalid phone number format')).toBeVisible(); // Error message is displayed
});
