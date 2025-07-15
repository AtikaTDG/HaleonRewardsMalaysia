import { test, expect } from '@playwright/test';
import { TestHelpers, TestData } from './helpers/common';

/**
 * Login and OTP Verification Tests
 * TC002-TC009: Comprehensive login flow testing
 */

// TC002: Fill in the textbox - Valid Malaysia phone number format
test('TC002: Login with valid Malaysia phone number format', async ({ page }) => {
  await TestHelpers.navigateToLogin(page);
  
  // Test with valid Malaysian phone number
  await page.getByPlaceholder('Your phone number').fill(TestData.REGISTERED_USER_PHONE);
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  
  // Verify OTP screen appears
  await expect(page.getByText('Please enter verification')).toBeVisible();
  
  // Manual OTP entry for actual testing
  await page.pause();
  
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
});

// TC002: Fill in the textbox - Invalid format
test('TC002: Login with invalid phone number format shows error', async ({ page }) => {
  await TestHelpers.navigateToLogin(page);
  
  // Test with invalid phone number format
  await page.getByPlaceholder('Your phone number').fill('19383744444');
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  
  // Verify error message appears
  await TestHelpers.verifyErrorMessage(page, 'Invalid phone number format!');
});

// TC002: Fill in the textbox - No input
test('TC002: Login with no phone number shows required error', async ({ page }) => {
  await TestHelpers.navigateToLogin(page);
  
  // Try to send OTP without entering phone number
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  
  // Verify error message appears
  await TestHelpers.verifyErrorMessage(page, 'phone number required');
});

// TC003: Receive OTP code after entering valid number
test('TC003: Receive OTP code after entering valid number', async ({ page }) => {
  await TestHelpers.navigateToLogin(page);
  
  await page.getByPlaceholder('Your phone number').fill(TestData.REGISTERED_USER_PHONE);
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  
  // Verify OTP input fields appear
  await expect(page.getByRole('textbox', { name: 'Please enter verification' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Digit 2' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Digit 3' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Digit 4' })).toBeVisible();
  
  // Verify verify button is present
  await expect(page.getByRole('button', { name: 'Verify' })).toBeVisible();
});

// TC004: Fill in OTP textbox
test('TC004: Fill in OTP textbox', async ({ page }) => {
  await TestHelpers.navigateToLogin(page);
  
  await page.getByPlaceholder('Your phone number').fill(TestData.REGISTERED_USER_PHONE);
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  
  // Fill OTP fields
  await page.getByRole('textbox', { name: 'Please enter verification' }).fill('1');
  await page.getByRole('textbox', { name: 'Digit 2' }).fill('2');
  await page.getByRole('textbox', { name: 'Digit 3' }).fill('3');
  await page.getByRole('textbox', { name: 'Digit 4' }).fill('4');
  
  // Verify all fields are filled
  await expect(page.getByRole('textbox', { name: 'Please enter verification' })).toHaveValue('1');
  await expect(page.getByRole('textbox', { name: 'Digit 2' })).toHaveValue('2');
  await expect(page.getByRole('textbox', { name: 'Digit 3' })).toHaveValue('3');
  await expect(page.getByRole('textbox', { name: 'Digit 4' })).toHaveValue('4');
});

// TC005: Request new OTP code
test('TC005: Request new OTP code shows success popup', async ({ page }) => {
  await TestHelpers.navigateToLogin(page);
  
  await page.getByPlaceholder('Your phone number').fill(TestData.REGISTERED_USER_PHONE);
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  
  // Wait for resend code option to appear
  await page.waitForTimeout(2000);
  
  // Click resend code
  await page.getByText('Resend Code').click();
  
  // Verify success message
  await TestHelpers.verifySuccessMessage(page, 'new otp code sent successfully');
});

// TC006: Cannot request OTP within 60s countdown
test('TC006: Cannot request OTP within 60s countdown', async ({ page }) => {
  await TestHelpers.navigateToLogin(page);
  
  await page.getByPlaceholder('Your phone number').fill(TestData.REGISTERED_USER_PHONE);
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  
  // Immediately try to resend - should show countdown or be disabled
  const resendButton = page.getByText('Resend Code');
  
  // Check if resend is disabled or shows countdown
  if (await resendButton.isVisible({ timeout: 2000 })) {
    // If visible, it should be disabled or show countdown
    const isDisabled = await resendButton.isDisabled().catch(() => false);
    if (!isDisabled) {
      // Check for countdown text
      await expect(page.locator('text=/\\d+s/')).toBeVisible(); // Look for countdown like "59s", "58s", etc.
    }
  }
});

// TC007: Verify without OTP shows missing fields error
test('TC007: Verify without OTP shows missing required fields error', async ({ page }) => {
  await TestHelpers.navigateToLogin(page);
  
  await page.getByPlaceholder('Your phone number').fill(TestData.REGISTERED_USER_PHONE);
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  
  // Try to verify without entering OTP
  await page.getByRole('button', { name: 'Verify' }).click();
  
  // Verify error message
  await TestHelpers.verifyErrorMessage(page, 'Missing required fields');
});

// TC008: Invalid OTP shows expired or invalid token error
test('TC008: Invalid OTP shows expired or invalid token error', async ({ page }) => {
  await TestHelpers.navigateToLogin(page);
  
  await page.getByPlaceholder('Your phone number').fill(TestData.REGISTERED_USER_PHONE);
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  
  // Fill with invalid OTP
  await TestHelpers.fillOTP(page, TestData.INVALID_OTP);
  await page.getByRole('button', { name: 'Verify' }).click();
  
  // Verify error message
  await TestHelpers.verifyErrorMessage(page, 'Expired or invalid token');
});

// TC009: Valid OTP shows successful verified popup
test('TC009: Valid OTP shows Successful Verified popup', async ({ page }) => {
  await TestHelpers.navigateToLogin(page);
  
  await page.getByPlaceholder('Your phone number').fill(TestData.REGISTERED_USER_PHONE);
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  
  // Manual OTP entry for real testing
  await page.pause();
  
  await page.getByRole('button', { name: 'Verify' }).click();
  
  // Verify success popup appears
  await TestHelpers.verifySuccessMessage(page, 'Successful Verified');
  
  // Verify Done button is present
  await expect(page.getByRole('button', { name: 'Done' })).toBeVisible();
});

// Original tests maintained for backward compatibility
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
});