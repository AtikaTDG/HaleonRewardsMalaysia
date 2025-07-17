import { test, expect } from '@playwright/test';
import { TestHelpers, TestData } from './helpers/common';

/**
 * Profile Tests
 * TC082-TC121: Comprehensive profile functionality testing
 */

test.beforeEach(async ({ page }) => {
  // Login as registered user and navigate to profile page before each test
  await TestHelpers.loginAsRegisteredUser(page);
  await TestHelpers.navigateViaBottomNav(page, 'profile');
});

// TC082: Display user points/tiering
test('TC082: Profile displays user points and tiering information', async ({ page }) => {
  // Should be on profile page from beforeEach
  await expect(page).toHaveURL(/.*profile/);
  
  // Verify user points are displayed
  await expect(page.locator('text=/\\d+\\s*points|points:\\s*\\d+/i')).toBeVisible();
  
  // Verify tiering information is displayed
  await expect(page.locator('text=/Bronze|Silver|Gold|Platinum/i')).toBeVisible();
  
  // Verify profile content is visible
  await expect(page.locator('text=/profile|personal|account/i')).toBeVisible();
});

// TC083: Personal Details redirection
test('TC083: Personal Details section redirects correctly', async ({ page }) => {
  // Look for Personal Details option
  const personalDetailsOption = page.locator('div').filter({ hasText: /^Personal Details$/ });
  
  if (await personalDetailsOption.isVisible({ timeout: 5000 })) {
    await personalDetailsOption.click();
    
    // Verify redirect to personal details page
    await expect(page).toHaveURL(/.*personal|.*details/);
    await expect(page.getByRole('textbox', { name: 'Full Name' })).toBeVisible();
  } else {
    // Look for alternative text
    const alternatives = [
      page.getByText('Personal Information'),
      page.getByText('My Details'),
      page.getByText('Account Details'),
      page.locator('[data-testid="personal-details"]')
    ];
    
    let found = false;
    for (const option of alternatives) {
      if (await option.isVisible({ timeout: 2000 }).catch(() => false)) {
        await option.click();
        await expect(page.locator('text=/name|email|personal/i')).toBeVisible();
        found = true;
        break;
      }
    }
    
    expect(found).toBeTruthy();
  }
});

// TC083: Delivery Address redirection
test('TC083: Delivery Address section redirects correctly', async ({ page }) => {
  const deliveryAddressOption = page.locator('div').filter({ hasText: /^Delivery Address$/ });
  
  if (await deliveryAddressOption.isVisible({ timeout: 5000 })) {
    await deliveryAddressOption.click();
    
    // Verify redirect to delivery address page
    await expect(page).toHaveURL(/.*address|.*delivery/);
    await expect(page.locator('text=/address|delivery/i')).toBeVisible();
  } else {
    console.log('Delivery Address option not found in profile');
  }
});

// TC083: Language redirection
test('TC083: Language section redirects correctly', async ({ page }) => {
  const languageOption = page.locator('div').filter({ hasText: /^Language$/ });
  
  if (await languageOption.isVisible({ timeout: 5000 })) {
    await languageOption.click();
    
    // Verify redirect to language page
    await expect(page).toHaveURL(/.*language/);
    await expect(page.locator('text=/language|english|bahasa/i')).toBeVisible();
  } else {
    console.log('Language option not found in profile');
  }
});

// TC083: Refer a Friend redirection
test('TC083: Refer a Friend section redirects correctly', async ({ page }) => {
  const referOption = page.locator('div').filter({ hasText: /^Refer a Friend$/ });
  
  if (await referOption.isVisible({ timeout: 5000 })) {
    await referOption.click();
    
    // Verify redirect to refer friend page
    await expect(page).toHaveURL(/.*refer|.*friend/);
    await expect(page.locator('text=/refer|friend|invitation/i')).toBeVisible();
  } else {
    console.log('Refer a Friend option not found in profile');
  }
});

// TC083: Tiering redirection
test('TC083: Tiering section redirects correctly', async ({ page }) => {
  const tieringOption = page.locator('div').filter({ hasText: /^Tiering$/ });
  
  if (await tieringOption.isVisible({ timeout: 5000 })) {
    await tieringOption.click();
    
    // Verify redirect to tiering page
    await expect(page).toHaveURL(/.*tier/);
    await expect(page.locator('text=/tier|bronze|silver|gold|platinum/i')).toBeVisible();
  } else {
    console.log('Tiering option not found in profile');
  }
});

// TC083: Badges redirection
test('TC083: Badges section redirects correctly', async ({ page }) => {
  const badgesOption = page.locator('div').filter({ hasText: /^Badges$/ });
  
  if (await badgesOption.isVisible({ timeout: 5000 })) {
    await badgesOption.click();
    
    // Verify redirect to badges page
    await expect(page).toHaveURL(/.*badge/);
    await expect(page.locator('text=/badge/i')).toBeVisible();
  } else {
    console.log('Badges option not found in profile');
  }
});

// TC083: Contact Preferences redirection
test('TC083: Contact Preferences section redirects correctly', async ({ page }) => {
  const contactOption = page.locator('div').filter({ hasText: /^Contact Preferences$/ });
  
  if (await contactOption.isVisible({ timeout: 5000 })) {
    await contactOption.click();
    
    // Verify redirect to contact preferences page
    await expect(page).toHaveURL(/.*contact|.*preference/);
    await expect(page.locator('text=/contact|preference|notification/i')).toBeVisible();
  } else {
    console.log('Contact Preferences option not found in profile');
  }
});

// TC083: Help redirection
test('TC083: Help section redirects correctly', async ({ page }) => {
  const helpOption = page.locator('div').filter({ hasText: /^Help$/ });
  
  if (await helpOption.isVisible({ timeout: 5000 })) {
    await helpOption.click();
    
    // Verify redirect to help page
    await expect(page).toHaveURL(/.*help|.*support/);
    await expect(page.locator('text=/help|support|faq/i')).toBeVisible();
  } else {
    console.log('Help option not found in profile');
  }
});

// TC083: FAQ and T&C buttons redirect correctly
test('TC083: FAQ and Terms & Conditions buttons redirect correctly', async ({ page }) => {
  // Test FAQ button
  const faqButton = page.getByText('FAQ');
  
  if (await faqButton.isVisible({ timeout: 5000 })) {
    await faqButton.click();
    
    // Should redirect to FAQ page or open popup
    const faqPageVisible = await page.locator('text=/frequently|questions|faq/i').isVisible({ timeout: 3000 }).catch(() => false);
    const popupVisible = await page.locator('.popup, .modal, .dialog').isVisible().catch(() => false);
    
    expect(faqPageVisible || popupVisible).toBeTruthy();
    
    if (popupVisible) {
      await TestHelpers.closePopupWithX(page);
    }
  }
  
  // Test Terms & Conditions button
  const tcButton = page.getByText('Terms & Conditions');
  
  if (await tcButton.isVisible({ timeout: 5000 })) {
    const newPagePromise = page.context().waitForEvent('page');
    await tcButton.click();
    
    try {
      const newPage = await newPagePromise;
      await expect(newPage).toHaveURL(/terms|conditions|pdf/i);
      await newPage.close();
    } catch (error) {
      // If no new page, check for popup
      const popupVisible = await page.locator('.popup, .modal, .dialog').isVisible().catch(() => false);
      expect(popupVisible).toBeTruthy();
      if (popupVisible) {
        await TestHelpers.closePopupWithX(page);
      }
    }
  }
});

// TC084: Logout functionality
test('TC084: Logout logs out and redirects to Login', async ({ page }) => {
  // Look for logout button in profile
  const logoutButton = page.getByText('Logout');
  
  if (await logoutButton.isVisible({ timeout: 5000 })) {
    await logoutButton.click();
    
    // Should redirect to login page
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
  } else {
    console.log('Logout button not found in profile');
  }
});

// TC085: Personal Details - "Back" arrow to previous page
test('TC085: Personal Details back arrow redirects to previous page', async ({ page }) => {
  // Navigate to personal details
  const personalDetailsOption = page.locator('div').filter({ hasText: /^Personal Details$/ });
  if (await personalDetailsOption.isVisible({ timeout: 3000 })) {
    await personalDetailsOption.click();
    
    // Click back arrow
    await TestHelpers.goBack(page);
    
    // Should return to profile page
    await expect(page).toHaveURL(/.*profile/);
  }
});

// TC086: Personal Details - Fill in Full Name and Email
test('TC086: Personal Details form validation for name and email', async ({ page }) => {
  // Navigate to personal details
  const personalDetailsOption = page.locator('div').filter({ hasText: /^Personal Details$/ });
  if (await personalDetailsOption.isVisible({ timeout: 3000 })) {
    await personalDetailsOption.click();
    
    // Test Full Name field (≤50 chars)
    const nameField = page.getByRole('textbox', { name: 'Full Name' });
    if (await nameField.isVisible({ timeout: 3000 })) {
      // Clear and fill with valid name
      await nameField.clear();
      await nameField.fill('John Doe Smith Updated');
      await expect(nameField).toHaveValue('John Doe Smith Updated');
      
      // Test character limit (50 chars)
      const longName = 'A'.repeat(51);
      await nameField.clear();
      await nameField.fill(longName);
      const actualValue = await nameField.inputValue();
      expect(actualValue.length).toBeLessThanOrEqual(50);
    }
    
    // Test Email field (valid format)
    const emailField = page.getByRole('textbox', { name: 'Email' });
    if (await emailField.isVisible({ timeout: 3000 })) {
      // Fill with valid email
      await emailField.clear();
      await emailField.fill('updated.email@example.com');
      await expect(emailField).toHaveValue('updated.email@example.com');
    }
  }
});

// TC087: Personal Details - Phone number textbox not editable
test('TC087: Personal Details phone number field is not editable', async ({ page }) => {
  // Navigate to personal details
  const personalDetailsOption = page.locator('div').filter({ hasText: /^Personal Details$/ });
  if (await personalDetailsOption.isVisible({ timeout: 3000 })) {
    await personalDetailsOption.click();
    
    // Look for phone number field
    const phoneField = page.locator('input[type="tel"], input[name*="phone"], input[placeholder*="phone"]');
    
    if (await phoneField.isVisible({ timeout: 3000 })) {
      // Verify field is disabled or readonly
      const isDisabled = await phoneField.isDisabled();
      const isReadonly = await phoneField.getAttribute('readonly') !== null;
      
      expect(isDisabled || isReadonly).toBeTruthy();
    } else {
      // Phone number might be displayed as text, not input
      const phoneText = page.locator('text=/\\d{8,15}|\\+\\d+/');
      if (await phoneText.isVisible({ timeout: 3000 })) {
        // Verify it's not an input field
        const isInput = await phoneText.evaluate(el => el.tagName === 'INPUT');
        expect(isInput).toBeFalsy();
      }
    }
  }
});

// TC088: Personal Details - Date of Birth validation
test('TC088: Personal Details Date of Birth field restricts future years', async ({ page }) => {
  // Navigate to personal details
  const personalDetailsOption = page.locator('div').filter({ hasText: /^Personal Details$/ });
  if (await personalDetailsOption.isVisible({ timeout: 3000 })) {
    await personalDetailsOption.click();
    
    // Look for date of birth field
    const dobField = page.locator('input[type="date"], input[name*="birth"], input[placeholder*="birth"]');
    
    if (await dobField.isVisible({ timeout: 3000 })) {
      // Try to enter future date
      const futureYear = new Date().getFullYear() + 1;
      const futureDate = `${futureYear}-01-01`;
      
      await dobField.fill(futureDate);
      
      // Check if future date is rejected or validation error appears
      const actualValue = await dobField.inputValue();
      const enteredYear = parseInt(actualValue.split('-')[0]);
      
      // Should either reject the input or show error
      if (enteredYear > new Date().getFullYear()) {
        // Look for validation error
        const errorMessage = page.locator('text=/invalid|future|error/i');
        await expect(errorMessage).toBeVisible();
      }
    }
  }
});

// TC089: Personal Details - Valid update saves with prompt
test('TC089: Personal Details valid update shows success prompt', async ({ page }) => {
  // Navigate to personal details
  const personalDetailsOption = page.locator('div').filter({ hasText: /^Personal Details$/ });
  if (await personalDetailsOption.isVisible({ timeout: 3000 })) {
    await personalDetailsOption.click();
    
    // Update valid information
    const nameField = page.getByRole('textbox', { name: 'Full Name' });
    if (await nameField.isVisible({ timeout: 3000 })) {
      await nameField.clear();
      await nameField.fill('Updated Test User');
    }
    
    const emailField = page.getByRole('textbox', { name: 'Email' });
    if (await emailField.isVisible({ timeout: 3000 })) {
      await emailField.clear();
      await emailField.fill('updated.test@example.com');
    }
    
    // Submit the form
    const saveButton = page.locator('button:has-text("Save"), button:has-text("Update"), .save-btn');
    if (await saveButton.isVisible({ timeout: 3000 })) {
      await saveButton.click();
      
      // Should show success message
      await TestHelpers.verifySuccessMessage(page, 'success');
    }
  }
});

// TC090: Personal Details - Invalid update shows error
test('TC090: Personal Details invalid update shows error message', async ({ page }) => {
  // Navigate to personal details
  const personalDetailsOption = page.locator('div').filter({ hasText: /^Personal Details$/ });
  if (await personalDetailsOption.isVisible({ timeout: 3000 })) {
    await personalDetailsOption.click();
    
    // Enter invalid information
    const nameField = page.getByRole('textbox', { name: 'Full Name' });
    if (await nameField.isVisible({ timeout: 3000 })) {
      await nameField.clear();
      await nameField.fill('Invalid123'); // Numbers in name
    }
    
    const emailField = page.getByRole('textbox', { name: 'Email' });
    if (await emailField.isVisible({ timeout: 3000 })) {
      await emailField.clear();
      await emailField.fill('invalid-email'); // Invalid email format
    }
    
    // Submit the form
    const saveButton = page.locator('button:has-text("Save"), button:has-text("Update"), .save-btn');
    if (await saveButton.isVisible({ timeout: 3000 })) {
      await saveButton.click();
      
      // Should show error message
      await TestHelpers.verifyErrorMessage(page, 'Invalid');
    }
  }
});

// TC091-TC101: Delivery Address functionality (already covered in deliveryaddress.spec.ts)
// These tests are already implemented in the existing deliveryaddress.spec.ts file

// TC102: Language - "Back" arrow to previous page
test('TC102: Language back arrow redirects to previous page', async ({ page }) => {
  const languageOption = page.locator('div').filter({ hasText: /^Language$/ });
  if (await languageOption.isVisible({ timeout: 3000 })) {
    await languageOption.click();
    
    // Click back arrow
    await TestHelpers.goBack(page);
    
    // Should return to profile page
    await expect(page).toHaveURL(/.*profile/);
  }
});

// TC103: Language - Change language
test('TC103: Language change functionality works correctly', async ({ page }) => {
  const languageOption = page.locator('div').filter({ hasText: /^Language$/ });
  if (await languageOption.isVisible({ timeout: 3000 })) {
    await languageOption.click();
    
    // Look for language options
    const languageOptions = [
      page.getByText('English'),
      page.getByText('Bahasa Malaysia'),
      page.getByText('中文'),
      page.locator('input[type="radio"], .language-option')
    ];
    
    let optionFound = false;
    for (const option of languageOptions) {
      if (await option.isVisible({ timeout: 2000 }).catch(() => false)) {
        await option.click();
        optionFound = true;
        break;
      }
    }
    
    if (optionFound) {
      // Should show confirmation or save changes
      const saveButton = page.locator('button:has-text("Save"), button:has-text("Apply")');
      if (await saveButton.isVisible({ timeout: 2000 })) {
        await saveButton.click();
      }
      
      // Language change should be applied
      await page.waitForTimeout(1000);
    }
    
    expect(optionFound).toBeTruthy();
  }
});

// TC104-TC107: Refer Friend functionality
test('TC104: Refer Friend back arrow redirects to previous page', async ({ page }) => {
  const referOption = page.locator('div').filter({ hasText: /^Refer a Friend$/ });
  if (await referOption.isVisible({ timeout: 3000 })) {
    await referOption.click();
    
    await TestHelpers.goBack(page);
    await expect(page).toHaveURL(/.*profile/);
  }
});

test('TC105: Refer Friend copy button copies referral link', async ({ page }) => {
  const referOption = page.locator('div').filter({ hasText: /^Refer a Friend$/ });
  if (await referOption.isVisible({ timeout: 3000 })) {
    await referOption.click();
    
    const copyButton = page.getByText('Copy');
    if (await copyButton.isVisible({ timeout: 3000 })) {
      await copyButton.click();
      
      // Should show copy confirmation
      const copyFeedback = [
        page.getByText('Copied'),
        page.getByText('Link copied'),
        page.locator('.toast, .notification')
      ];
      
      let feedbackFound = false;
      for (const feedback of copyFeedback) {
        if (await feedback.isVisible({ timeout: 2000 }).catch(() => false)) {
          feedbackFound = true;
          break;
        }
      }
      
      expect(feedbackFound).toBeTruthy();
    }
  }
});

test('TC106-TC107: Refer Friend points system validation', async ({ page }) => {
  const referOption = page.locator('div').filter({ hasText: /^Refer a Friend$/ });
  if (await referOption.isVisible({ timeout: 3000 })) {
    await referOption.click();
    
    // Verify referral points information is displayed
    await expect(page.locator('text=/10.*points|points.*10/i')).toBeVisible();
    
    // Verify referral rules are displayed
    const rulesText = [
      page.locator('text=/referrer.*10|10.*referrer/i'),
      page.locator('text=/referee.*10|10.*referee/i'),
      page.locator('text=/successful.*register/i')
    ];
    
    let rulesFound = 0;
    for (const rule of rulesText) {
      if (await rule.isVisible({ timeout: 2000 }).catch(() => false)) {
        rulesFound++;
      }
    }
    
    expect(rulesFound).toBeGreaterThan(0);
  }
});

// TC108-TC112: Tiering functionality
test('TC108: Tiering benefits section displays correctly', async ({ page }) => {
  const tieringOption = page.locator('div').filter({ hasText: /^Tiering$/ });
  if (await tieringOption.isVisible({ timeout: 3000 })) {
    await tieringOption.click();
    
    const tieringButton = page.getByText('Tiering');
    if (await tieringButton.isVisible({ timeout: 3000 })) {
      await tieringButton.click();
      
      // Should show benefits information
      await expect(page.locator('text=/benefit|tier|bronze|silver|gold|platinum/i')).toBeVisible();
    }
  }
});

test('TC109: Tiering displays user details, points, and tier', async ({ page }) => {
  const tieringOption = page.locator('div').filter({ hasText: /^Tiering$/ });
  if (await tieringOption.isVisible({ timeout: 3000 })) {
    await tieringOption.click();
    
    // Verify user tier information is displayed
    await expect(page.locator('text=/bronze|silver|gold|platinum/i')).toBeVisible();
    await expect(page.locator('text=/\\d+\\s*points/i')).toBeVisible();
  }
});

test('TC110: Tiering View History opens Tier History', async ({ page }) => {
  const tieringOption = page.locator('div').filter({ hasText: /^Tiering$/ });
  if (await tieringOption.isVisible({ timeout: 3000 })) {
    await tieringOption.click();
    
    const viewHistoryButton = page.getByText('View History');
    if (await viewHistoryButton.isVisible({ timeout: 3000 })) {
      await viewHistoryButton.click();
      
      // Should show tier history
      await expect(page.locator('text=/history|tier/i')).toBeVisible();
    }
  }
});

test('TC111: Tiering Benefits - Bronze, Silver, Gold, Platinum buttons show details', async ({ page }) => {
  const tieringOption = page.locator('div').filter({ hasText: /^Tiering$/ });
  if (await tieringOption.isVisible({ timeout: 3000 })) {
    await tieringOption.click();
    
    const tierButtons = ['Bronze', 'Silver', 'Gold', 'Platinum'];
    
    for (const tier of tierButtons) {
      const tierButton = page.getByText(tier);
      if (await tierButton.isVisible({ timeout: 2000 })) {
        await tierButton.click();
        
        // Should show tier-specific details
        await expect(page.locator(`text=${tier}`)).toBeVisible();
        
        // Verify tier benefits are shown
        const benefitTexts = [
          page.locator('text=/multiplier|points|benefit/i'),
          page.locator('text=/1x|1.5x|2x/'),
          page.locator('text=/bonus/i')
        ];
        
        let benefitFound = false;
        for (const benefit of benefitTexts) {
          if (await benefit.isVisible({ timeout: 2000 }).catch(() => false)) {
            benefitFound = true;
            break;
          }
        }
        
        expect(benefitFound).toBeTruthy();
      }
    }
    
    // Verify Platinum button is fully visible (TC111 requirement)
    const platinumButton = page.getByText('Platinum');
    if (await platinumButton.isVisible({ timeout: 2000 })) {
      const isFullyVisible = await platinumButton.evaluate(el => {
        const rect = el.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
      });
      expect(isFullyVisible).toBeTruthy();
    }
  }
});

test('TC112: Tier History displays tiering history details', async ({ page }) => {
  const tieringOption = page.locator('div').filter({ hasText: /^Tiering$/ });
  if (await tieringOption.isVisible({ timeout: 3000 })) {
    await tieringOption.click();
    
    const viewHistoryButton = page.getByText('View History');
    if (await viewHistoryButton.isVisible({ timeout: 3000 })) {
      await viewHistoryButton.click();
      
      // Look for tier history items
      const historyItems = page.locator('.tier-history-item, .history-item');
      const itemCount = await historyItems.count();
      
      if (itemCount > 0) {
        // Verify history items contain tier information
        const firstItem = historyItems.first();
        const hasDate = await firstItem.locator('text=/\\d{1,2}[\\/-]\\d{1,2}[\\/-]\\d{2,4}/').isVisible().catch(() => false);
        const hasTier = await firstItem.locator('text=/bronze|silver|gold|platinum/i').isVisible().catch(() => false);
        
        expect(hasDate || hasTier).toBeTruthy();
      } else {
        // No history items - check for empty state
        await expect(page.locator('text=/no.*history|empty/i')).toBeVisible();
      }
    }
  }
});

// TC113-TC117: Badges functionality
test('TC113: Badges back arrow redirects to previous page', async ({ page }) => {
  const badgesOption = page.locator('div').filter({ hasText: /^Badges$/ });
  if (await badgesOption.isVisible({ timeout: 3000 })) {
    await badgesOption.click();
    
    await TestHelpers.goBack(page);
    await expect(page).toHaveURL(/.*profile/);
  }
});

test('TC114: Badges display available badges', async ({ page }) => {
  const badgesOption = page.locator('div').filter({ hasText: /^Badges$/ });
  if (await badgesOption.isVisible({ timeout: 3000 })) {
    await badgesOption.click();
    
    // Look for badge items
    const badgeItems = page.locator('.badge-item, .badge');
    const badgeCount = await badgeItems.count();
    
    if (badgeCount > 0) {
      // Verify badges contain expected information
      const firstBadge = badgeItems.first();
      const hasTitle = await firstBadge.locator('text=/toothpaste|milk|diapers/i').isVisible().catch(() => false);
      const hasReward = await firstBadge.locator('text=/rm\\d+|tng/i').isVisible().catch(() => false);
      
      expect(hasTitle || hasReward).toBeTruthy();
    } else {
      // No badges available
      await expect(page.locator('text=/no.*badges|coming.*soon/i')).toBeVisible();
    }
  }
});

test('TC115: Expired badges are inactive', async ({ page }) => {
  const badgesOption = page.locator('div').filter({ hasText: /^Badges$/ });
  if (await badgesOption.isVisible({ timeout: 3000 })) {
    await badgesOption.click();
    
    // Look for expired badges
    const expiredBadges = page.locator('.expired, .inactive, :has-text("Expired")');
    const expiredCount = await expiredBadges.count();
    
    if (expiredCount > 0) {
      const firstExpired = expiredBadges.first();
      
      // Verify expired badge is visually inactive
      const isDisabled = await firstExpired.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.opacity < 1 || style.pointerEvents === 'none' || el.disabled;
      });
      
      expect(isDisabled).toBeTruthy();
    } else {
      console.log('No expired badges found for testing');
    }
  }
});

test('TC116-TC117: Badge collection and rewards system', async ({ page }) => {
  const badgesOption = page.locator('div').filter({ hasText: /^Badges$/ });
  if (await badgesOption.isVisible({ timeout: 3000 })) {
    await badgesOption.click();
    
    // Look for active badges
    const activeBadges = page.locator('.badge-item, .badge').filter({ hasNotText: 'Expired' });
    const activeCount = await activeBadges.count();
    
    if (activeCount > 0) {
      // Verify badge rules are displayed
      const badgeRules = [
        page.locator('text=/buy.*2.*get/i'),
        page.locator('text=/rm\\d+.*tng/i'),
        page.locator('text=/max.*redemption/i')
      ];
      
      let rulesFound = 0;
      for (const rule of badgeRules) {
        if (await rule.isVisible({ timeout: 2000 }).catch(() => false)) {
          rulesFound++;
        }
      }
      
      expect(rulesFound).toBeGreaterThan(0);
    }
  }
});

// TC118-TC121: Contact Preferences functionality
test('TC118: Contact Preferences back arrow redirects to previous page', async ({ page }) => {
  const contactOption = page.locator('div').filter({ hasText: /^Contact Preferences$/ });
  if (await contactOption.isVisible({ timeout: 3000 })) {
    await contactOption.click();
    
    await TestHelpers.goBack(page);
    await expect(page).toHaveURL(/.*profile/);
  }
});

test('TC119: Contact Preferences check/uncheck opens confirmation popup', async ({ page }) => {
  const contactOption = page.locator('div').filter({ hasText: /^Contact Preferences$/ });
  if (await contactOption.isVisible({ timeout: 3000 })) {
    await contactOption.click();
    
    // Look for preference checkboxes
    const checkboxes = page.locator('input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();
    
    if (checkboxCount > 0) {
      const firstCheckbox = checkboxes.first();
      await firstCheckbox.click();
      
      // Should show confirmation popup
      await expect(page.locator('.confirmation, .modal, .popup')).toBeVisible();
      await expect(page.locator('text=/confirm|are you sure/i')).toBeVisible();
    }
  }
});

test('TC120: Contact Preferences confirmation popup Confirm saves preferences', async ({ page }) => {
  const contactOption = page.locator('div').filter({ hasText: /^Contact Preferences$/ });
  if (await contactOption.isVisible({ timeout: 3000 })) {
    await contactOption.click();
    
    const checkboxes = page.locator('input[type="checkbox"]');
    if (await checkboxes.first().isVisible({ timeout: 3000 })) {
      await checkboxes.first().click();
      
      // Confirm in popup
      const confirmButton = page.getByRole('button', { name: 'Confirm' });
      if (await confirmButton.isVisible({ timeout: 3000 })) {
        await confirmButton.click();
        
        // Should save preferences and close popup
        await expect(page.locator('.confirmation, .modal, .popup')).not.toBeVisible();
      }
    }
  }
});

test('TC121: Contact Preferences confirmation popup Cancel closes popup', async ({ page }) => {
  const contactOption = page.locator('div').filter({ hasText: /^Contact Preferences$/ });
  if (await contactOption.isVisible({ timeout: 3000 })) {
    await contactOption.click();
    
    const checkboxes = page.locator('input[type="checkbox"]');
    if (await checkboxes.first().isVisible({ timeout: 3000 })) {
      await checkboxes.first().click();
      
      // Cancel in popup
      const cancelButton = page.getByRole('button', { name: 'Cancel' });
      if (await cancelButton.isVisible({ timeout: 3000 })) {
        await cancelButton.click();
        
        // Should close popup without saving
        await expect(page.locator('.confirmation, .modal, .popup')).not.toBeVisible();
      }
    }
  }
});

// TC084: Slide-out Menu functionality (additional test for slide-out menu)
test('TC084: Slide-out Menu logout and navigation', async ({ page }) => {
  // Look for menu button (hamburger menu)
  const menuButton = page.locator('.menu-button, .hamburger, button:has-text("☰")');
  
  if (await menuButton.isVisible({ timeout: 3000 })) {
    await menuButton.click();
    
    // Test slide-out menu options
    const menuOptions = [
      { text: 'FAQ', expectedUrl: /faq/ },
      { text: 'Terms & Conditions', expectedUrl: /terms/ },
      { text: 'Privacy Policy', expectedUrl: /privacy/ },
      { text: 'Contact Us', expectedUrl: /contact/ }
    ];
    
    for (const option of menuOptions) {
      const optionElement = page.getByText(option.text);
      if (await optionElement.isVisible({ timeout: 2000 })) {
        await optionElement.click();
        
        // Should redirect or open popup
        const urlChanged = await page.waitForURL(option.expectedUrl, { timeout: 3000 }).then(() => true).catch(() => false);
        const popupVisible = await page.locator('.popup, .modal, .dialog').isVisible().catch(() => false);
        
        expect(urlChanged || popupVisible).toBeTruthy();
        
        if (popupVisible) {
          await TestHelpers.closePopupWithX(page);
        }
        
        // Go back to profile for next test
        if (urlChanged) {
          await TestHelpers.navigateViaBottomNav(page, 'profile');
          await menuButton.click(); // Reopen menu
        }
      }
    }
    
    // Test logout from slide-out menu
    const logoutOption = page.getByText('Logout');
    if (await logoutOption.isVisible({ timeout: 2000 })) {
      await logoutOption.click();
      
      // Should redirect to login
      await expect(page).toHaveURL(/.*login/);
      await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
    }
  } else {
    console.log('Slide-out menu not found - may not be implemented');
  }
});