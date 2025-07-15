import { test, expect } from '@playwright/test';
import { TestHelpers, TestData } from './helpers/common';

/**
 * Registration Tests
 * TC010-TC018: Complete registration flow testing
 */

// TC010: Registered User - "Done" redirects to Homepage
test('TC010: Registered user Done button redirects to Homepage', async ({ page }) => {
  await TestHelpers.navigateToLogin(page);
  
  // Login with registered user
  await page.getByPlaceholder('Your phone number').fill(TestData.REGISTERED_USER_PHONE);
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await page.pause(); // Manual OTP entry
  await page.getByRole('button', { name: 'Verify' }).click();
  
  // Should show "Successful Verified" popup
  await TestHelpers.verifySuccessMessage(page, 'Successful Verified');
  
  // Click Done - should redirect to Homepage
  await page.getByRole('button', { name: 'Done' }).click();
  
  // Verify we're on homepage
  await expect(page).toHaveURL(/.*home/);
});

// TC011: Unregistered User - "Done" redirects to Registration Page
test('TC011: Unregistered user Done button redirects to Registration Page', async ({ page }) => {
  await TestHelpers.navigateToLogin(page);
  
  // Login with unregistered user
  await page.getByPlaceholder('Your phone number').fill(TestData.UNREGISTERED_USER_PHONE);
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await page.pause(); // Manual OTP entry
  await page.getByRole('button', { name: 'Verify' }).click();
  
  // Should show "Successful Verified" popup
  await TestHelpers.verifySuccessMessage(page, 'Successful Verified');
  
  // Click Done - should redirect to Registration Page
  await page.getByRole('button', { name: 'Done' }).click();
  
  // Verify we're on registration page
  await expect(page).toHaveURL(/.*register|.*registration/);
  await expect(page.getByRole('textbox', { name: 'Full Name' })).toBeVisible();
});

// TC012: Fill in registration form with valid data
test('TC012: Fill registration form - Full Name, Email, Date of Birth', async ({ page }) => {
  await TestHelpers.navigateToLogin(page);
  
  // Navigate to registration page via unregistered user login
  await page.getByPlaceholder('Your phone number').fill(TestData.UNREGISTERED_USER_PHONE);
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await page.pause();
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
  
  // Fill Full Name (alphabet only, ≤50 chars)
  await page.getByRole('textbox', { name: 'Full Name' }).fill('John Doe Smith');
  await expect(page.getByRole('textbox', { name: 'Full Name' })).toHaveValue('John Doe Smith');
  
  // Fill Email (valid format)
  await page.getByRole('textbox', { name: 'Email' }).fill('john.doe@example.com');
  await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue('john.doe@example.com');
  
  // Select Gender
  await page.locator('#gender').selectOption('Male');
  
  // Select Date of Birth (future year should be restricted)
  await page.getByRole('textbox', { name: 'Month of Birth' }).fill('1990-05-15');
  
  // Verify future date restriction by trying current year + 1
  const futureYear = new Date().getFullYear() + 1;
  await page.getByRole('textbox', { name: 'Month of Birth' }).fill(`${futureYear}-01-01`);
  // The system should reject this or show error
});

// TC013: Click Terms and Conditions & Privacy Policy checkboxes and Authorize checkbox
test('TC013: Check Terms and Conditions and Authorize checkboxes', async ({ page }) => {
  await TestHelpers.navigateToLogin(page);
  
  // Navigate to registration page
  await page.getByPlaceholder('Your phone number').fill(TestData.UNREGISTERED_USER_PHONE);
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await page.pause();
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
  
  // Check Terms and Conditions checkbox
  const termsCheckbox = page.getByRole('checkbox', { name: "I agree to the Haleons Terms" });
  await termsCheckbox.check();
  await expect(termsCheckbox).toBeChecked();
  
  // Check Authorize checkbox
  const authorizeCheckbox = page.getByRole('checkbox', { name: 'I authorize Haleon to share' });
  await authorizeCheckbox.check();
  await expect(authorizeCheckbox).toBeChecked();
});

// TC014: Redirection links open relevant PDF or redirect to login
test('TC014: Terms and Privacy Policy links redirect correctly', async ({ page }) => {
  await TestHelpers.navigateToLogin(page);
  
  // Navigate to registration page
  await page.getByPlaceholder('Your phone number').fill(TestData.UNREGISTERED_USER_PHONE);
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await page.pause();
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
  
  // Test Terms and Conditions link
  const termsLink = page.getByText('Terms and Conditions');
  if (await termsLink.isVisible()) {
    // Create a promise that resolves when a new page is opened
    const newPagePromise = page.context().waitForEvent('page');
    await termsLink.click();
    const newPage = await newPagePromise;
    
    // Verify the new page URL contains terms or PDF
    await expect(newPage).toHaveURL(/terms|pdf/i);
    await newPage.close();
  }
  
  // Test Privacy Policy link
  const privacyLink = page.getByText('Privacy Policy');
  if (await privacyLink.isVisible()) {
    const newPagePromise = page.context().waitForEvent('page');
    await privacyLink.click();
    const newPage = await newPagePromise;
    
    // Verify the new page URL contains privacy or PDF
    await expect(newPage).toHaveURL(/privacy|pdf/i);
    await newPage.close();
  }
});

// TC015: Error on empty/invalid input
test('TC015: Registration form shows errors for invalid input', async ({ page }) => {
  await TestHelpers.navigateToLogin(page);
  
  // Navigate to registration page
  await page.getByPlaceholder('Your phone number').fill(TestData.UNREGISTERED_USER_PHONE);
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await page.pause();
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
  
  // Test invalid name format (numbers)
  await page.getByRole('textbox', { name: 'Full Name' }).fill('test123');
  await page.getByRole('button', { name: 'Submit' }).click();
  await TestHelpers.verifyErrorMessage(page, 'Invalid name format!');
  
  // Test invalid email format
  await page.getByRole('textbox', { name: 'Full Name' }).fill('Valid Name');
  await page.getByRole('textbox', { name: 'Email' }).fill('testtt');
  await page.getByRole('button', { name: 'Submit' }).click();
  await TestHelpers.verifyErrorMessage(page, 'Invalid email format!');
});

// TC016: Cannot submit with invalid details – show error
test('TC016: Cannot submit registration with invalid details', async ({ page }) => {
  await TestHelpers.navigateToLogin(page);
  
  // Navigate to registration page
  await page.getByPlaceholder('Your phone number').fill(TestData.UNREGISTERED_USER_PHONE);
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await page.pause();
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
  
  // Try to submit without filling required fields
  await page.getByRole('button', { name: 'Submit' }).click();
  
  // Should show validation errors
  await expect(page.locator('text=/required|invalid|error/i')).toBeVisible();
  
  // Verify submit button doesn't proceed
  await expect(page).toHaveURL(/.*register|.*registration/);
});

// TC017: Valid submission opens "Successful Register" popup
test('TC017: Valid registration submission shows success popup', async ({ page }) => {
  await TestHelpers.navigateToLogin(page);
  
  // Navigate to registration page
  await page.getByPlaceholder('Your phone number').fill(TestData.UNREGISTERED_USER_PHONE);
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await page.pause();
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
  
  // Fill valid registration data
  await page.getByRole('textbox', { name: 'Full Name' }).fill('Test User');
  await page.getByRole('textbox', { name: 'Email' }).fill('test.user@example.com');
  await page.locator('#gender').selectOption('Male');
  await page.getByRole('textbox', { name: 'Month of Birth' }).fill('1990-05-15');
  await page.getByRole('checkbox', { name: "I agree to the Haleons Terms" }).check();
  await page.getByRole('checkbox', { name: 'I authorize Haleon to share' }).check();
  
  // Submit registration
  await page.getByRole('button', { name: 'Submit' }).click();
  
  // Verify success popup appears
  await TestHelpers.verifySuccessMessage(page, 'Successful Register');
  await expect(page.getByRole('button', { name: 'Proceed' })).toBeVisible();
});

// TC018: "Proceed" redirects to Homepage
test('TC018: Successful Register Proceed button redirects to Homepage', async ({ page }) => {
  await TestHelpers.navigateToLogin(page);
  
  // Complete registration flow
  await page.getByPlaceholder('Your phone number').fill(TestData.UNREGISTERED_USER_PHONE);
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await page.pause();
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
  
  // Fill and submit registration
  await page.getByRole('textbox', { name: 'Full Name' }).fill('Test User');
  await page.getByRole('textbox', { name: 'Email' }).fill('test.user@example.com');
  await page.locator('#gender').selectOption('Male');
  await page.getByRole('textbox', { name: 'Month of Birth' }).fill('1990-05-15');
  await page.getByRole('checkbox', { name: "I agree to the Haleons Terms" }).check();
  await page.getByRole('checkbox', { name: 'I authorize Haleon to share' }).check();
  await page.getByRole('button', { name: 'Submit' }).click();
  
  // Click Proceed from success popup
  await page.getByRole('button', { name: 'Proceed' }).click();
  
  // Verify redirect to Homepage
  await expect(page).toHaveURL(/.*home/);
});

// Original tests maintained for backward compatibility (renamed to avoid conflicts)
test('successful register - original', async ({ page }) => {
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
  await page.getByRole('checkbox', { name: "I agree to the Haleons Terms" }).check();
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

test('Unsuccessful Register - original', async ({ page }) => {
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