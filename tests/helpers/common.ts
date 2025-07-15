import { Page, expect } from '@playwright/test';

/**
 * Common helper functions for Haleon Rewards Malaysia tests
 */
export class TestHelpers {
  
  /**
   * Navigate to login page and verify we're there
   */
  static async navigateToLogin(page: Page): Promise<void> {
    await page.goto('https://my.haleon-rewards.d-rive.net/login');
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
  }

  /**
   * Perform login with phone number (requires manual OTP entry)
   */
  static async loginWithPhoneNumber(page: Page, phoneNumber: string): Promise<void> {
    await page.getByPlaceholder('Your phone number').fill(phoneNumber);
    await page.getByRole('button', { name: 'Send OTP Code' }).click();
    
    // Pause for manual OTP entry - this follows the existing pattern in the codebase
    await page.pause();
    
    await page.getByRole('button', { name: 'Verify' }).click();
    await page.getByRole('button', { name: 'Done' }).click();
  }

  /**
   * Complete login flow for registered user (standard test user)
   */
  static async loginAsRegisteredUser(page: Page): Promise<void> {
    await this.navigateToLogin(page);
    await this.loginWithPhoneNumber(page, '137336651'); // Standard test user
  }

  /**
   * Navigate to homepage and verify we're there
   */
  static async navigateToHomepage(page: Page): Promise<void> {
    await expect(page).toHaveURL(/.*home/);
  }

  /**
   * Fill OTP fields with provided code
   */
  static async fillOTP(page: Page, otpCode: string): Promise<void> {
    const digits = otpCode.split('');
    if (digits.length !== 4) {
      throw new Error('OTP code must be 4 digits');
    }
    
    await page.getByRole('textbox', { name: 'Please enter verification' }).fill(digits[0]);
    await page.getByRole('textbox', { name: 'Digit 2' }).fill(digits[1]);
    await page.getByRole('textbox', { name: 'Digit 3' }).fill(digits[2]);
    await page.getByRole('textbox', { name: 'Digit 4' }).fill(digits[3]);
  }

  /**
   * Wait for element to be visible with timeout
   */
  static async waitForElement(page: Page, selector: string, timeout: number = 5000): Promise<void> {
    await page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Set viewport size for consistent testing
   */
  static async setStandardViewport(page: Page): Promise<void> {
    await page.setViewportSize({ width: 1280, height: 800 });
  }

  /**
   * Set extended viewport for forms and longer content
   */
  static async setExtendedViewport(page: Page): Promise<void> {
    await page.setViewportSize({ width: 1280, height: 1000 });
  }

  /**
   * Navigate using bottom navigation bar
   */
  static async navigateViaBottomNav(page: Page, section: 'home' | 'rewards' | 'upload' | 'history' | 'profile'): Promise<void> {
    const sectionMap = {
      home: 'Home',
      rewards: 'Rewards', 
      upload: 'Upload Receipt',
      history: 'History',
      profile: 'Profile'
    };
    
    await page.locator('div').filter({ hasText: new RegExp(`^${sectionMap[section]}$`) }).locator('img').click();
  }

  /**
   * Verify error message is displayed
   */
  static async verifyErrorMessage(page: Page, message: string): Promise<void> {
    await expect(page.getByText(message)).toBeVisible();
  }

  /**
   * Verify success message is displayed
   */
  static async verifySuccessMessage(page: Page, message: string): Promise<void> {
    await expect(page.getByText(message)).toBeVisible();
  }

  /**
   * Close popup by clicking Done button
   */
  static async closePopupWithDone(page: Page): Promise<void> {
    await page.getByRole('button', { name: 'Done' }).click();
  }

  /**
   * Close popup by clicking X button
   */
  static async closePopupWithX(page: Page): Promise<void> {
    await page.getByRole('button', { name: 'X' }).click();
  }

  /**
   * Go back using back arrow
   */
  static async goBack(page: Page): Promise<void> {
    await page.getByRole('button', { name: 'Back' }).click();
  }
}

/**
 * Test data constants
 */
export const TestData = {
  // Test phone numbers
  REGISTERED_USER_PHONE: '137336651',
  UNREGISTERED_USER_PHONE: '148594474', 
  INSUFFICIENT_POINTS_USER_PHONE: '183234651',
  
  // Valid test data
  VALID_PHONE_NUMBERS: ['137336651', '148594474', '123456789'],
  INVALID_PHONE_NUMBERS: ['19383744444', '123', 'abc123', ''],
  
  VALID_EMAILS: ['test@example.com', 'user@mail.com', 'valid@domain.org'],
  INVALID_EMAILS: ['testtt', 'invalid@', '@domain.com', ''],
  
  VALID_NAMES: ['John Doe', 'Mary Jane', 'Ahmad bin Ali'],
  INVALID_NAMES: ['test123', '123456', 'name@#$', ''],
  
  // OTP codes
  VALID_OTP: '1234', // Note: In real tests, this would come from actual OTP
  INVALID_OTP: '1111',
  
  // Address data
  VALID_ADDRESS: {
    name: 'John Doe',
    mobile: '60137336651',
    address1: 'No 123 Jalan Test',
    address2: 'Taman Test',
    city: 'Kuala Lumpur',
    postcode: '50000'
  }
};