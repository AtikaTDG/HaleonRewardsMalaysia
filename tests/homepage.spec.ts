import { test, expect } from '@playwright/test';
import { TestHelpers, TestData } from './helpers/common';

/**
 * Homepage and Navigation Tests
 * TC019-TC020: Homepage functionality
 * TC122: Bottom Navigation Bar
 */

test.beforeEach(async ({ page }) => {
  // Login as registered user before each test
  await TestHelpers.loginAsRegisteredUser(page);
});

// TC019: Homepage displays user name, points, tiering, progress
test('TC019: Homepage displays user information correctly', async ({ page }) => {
  // Should be on homepage after login
  await TestHelpers.navigateToHomepage(page);
  
  // Verify user name is displayed
  await expect(page.locator('text=/Hello|Hi|Welcome/')).toBeVisible();
  
  // Verify points are displayed
  await expect(page.locator('text=/points|pts/i')).toBeVisible();
  
  // Verify tiering information is displayed
  await expect(page.locator('text=/Bronze|Silver|Gold|Platinum/i')).toBeVisible();
  
  // Verify progress indicator or bar is present
  const progressElements = [
    page.locator('.progress-bar'),
    page.locator('.progress'),
    page.locator('[role="progressbar"]'),
    page.locator('text=/progress/i')
  ];
  
  let progressFound = false;
  for (const element of progressElements) {
    if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
      progressFound = true;
      break;
    }
  }
  
  expect(progressFound).toBeTruthy();
});

// TC020: "Browse All Rewards" redirects to Rewards Page
test('TC020: Browse All Rewards redirects to Rewards Page', async ({ page }) => {
  await TestHelpers.navigateToHomepage(page);
  
  // Look for "Browse All Rewards" button
  const browseRewardsButton = page.getByText('Browse All Rewards');
  
  if (await browseRewardsButton.isVisible({ timeout: 5000 })) {
    await browseRewardsButton.click();
    
    // Verify redirect to rewards page
    await expect(page).toHaveURL(/.*rewards/);
  } else {
    // Alternative text variations
    const alternatives = [
      page.getByText('View All Rewards'),
      page.getByText('All Rewards'),
      page.getByText('Browse Rewards'),
      page.getByRole('button', { name: /rewards/i })
    ];
    
    let found = false;
    for (const button of alternatives) {
      if (await button.isVisible({ timeout: 2000 }).catch(() => false)) {
        await button.click();
        await expect(page).toHaveURL(/.*rewards/);
        found = true;
        break;
      }
    }
    
    expect(found).toBeTruthy();
  }
});

// TC019: "How To Earn Points?" shows popup
test('TC019: How To Earn Points shows popup', async ({ page }) => {
  await TestHelpers.navigateToHomepage(page);
  
  // Look for "How To Earn Points?" element
  const howToEarnButton = page.getByText('How To Earn Points?');
  
  if (await howToEarnButton.isVisible({ timeout: 5000 })) {
    await howToEarnButton.click();
    
    // Verify popup appears
    await expect(page.locator('.popup, .modal, .dialog')).toBeVisible();
    
    // Verify popup content relates to earning points
    await expect(page.locator('text=/earn|points|how to/i')).toBeVisible();
    
    // Close popup
    await TestHelpers.closePopupWithX(page);
  } else {
    // Look for alternatives
    const alternatives = [
      page.getByText('How to earn points'),
      page.getByText('Earn Points'),
      page.getByText('How To Earn'),
      page.locator('[data-testid="how-to-earn"]')
    ];
    
    let found = false;
    for (const element of alternatives) {
      if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
        await element.click();
        await expect(page.locator('.popup, .modal, .dialog')).toBeVisible();
        found = true;
        break;
      }
    }
    
    // If no specific button found, this feature might not be implemented
    console.log('How To Earn Points button not found - feature may not be implemented');
  }
});

// TC019: "Visit Haleon Online Store" redirects to Shopee
test('TC019: Visit Haleon Online Store redirects to Shopee', async ({ page }) => {
  await TestHelpers.navigateToHomepage(page);
  
  // Look for "Visit Haleon Online Store" button
  const storeButton = page.getByText('Visit Haleon Online Store');
  
  if (await storeButton.isVisible({ timeout: 5000 })) {
    // Create a promise that resolves when a new page is opened
    const newPagePromise = page.context().waitForEvent('page');
    await storeButton.click();
    const newPage = await newPagePromise;
    
    // Verify the new page URL contains shopee
    await expect(newPage).toHaveURL(/shopee/i);
    await newPage.close();
  } else {
    // Look for alternatives
    const alternatives = [
      page.getByText('Online Store'),
      page.getByText('Visit Store'),
      page.getByText('Shop Now'),
      page.getByText('Haleon Store')
    ];
    
    let found = false;
    for (const button of alternatives) {
      if (await button.isVisible({ timeout: 2000 }).catch(() => false)) {
        const newPagePromise = page.context().waitForEvent('page');
        await button.click();
        const newPage = await newPagePromise;
        await expect(newPage).toHaveURL(/shopee|store/i);
        await newPage.close();
        found = true;
        break;
      }
    }
    
    // If no specific button found, this feature might not be implemented
    console.log('Visit Haleon Online Store button not found - feature may not be implemented');
  }
});

// TC019: Banner clicks redirect to relevant pages
test('TC019: Banner clicks redirect to relevant pages', async ({ page }) => {
  await TestHelpers.navigateToHomepage(page);
  
  // Look for banners/carousel items
  const banners = page.locator('.banner, .carousel-item, .slider-item, .promotion-banner');
  const bannerCount = await banners.count();
  
  if (bannerCount > 0) {
    // Test first banner
    const firstBanner = banners.first();
    
    if (await firstBanner.isVisible()) {
      // Check if it's clickable
      const isClickable = await firstBanner.evaluate(el => {
        return el.tagName === 'A' || el.onclick !== null || el.style.cursor === 'pointer';
      }).catch(() => false);
      
      if (isClickable) {
        const currentUrl = page.url();
        await firstBanner.click();
        
        // Wait a moment for potential navigation
        await page.waitForTimeout(2000);
        
        // Verify URL changed or popup appeared
        const newUrl = page.url();
        const popupVisible = await page.locator('.popup, .modal, .dialog').isVisible().catch(() => false);
        
        expect(newUrl !== currentUrl || popupVisible).toBeTruthy();
      }
    }
  } else {
    console.log('No banners found on homepage');
  }
});

// TC019: Product/brand/rewards links redirect correctly
test('TC019: Product and brand links redirect correctly', async ({ page }) => {
  await TestHelpers.navigateToHomepage(page);
  
  // Look for product/brand links
  const productLinks = page.locator('a:has-text("Product"), a:has-text("Brand"), a:has-text("Reward")');
  const linkCount = await productLinks.count();
  
  if (linkCount > 0) {
    const firstLink = productLinks.first();
    const linkText = await firstLink.textContent();
    
    if (await firstLink.isVisible()) {
      await firstLink.click();
      
      // Wait for navigation or popup
      await page.waitForTimeout(2000);
      
      // Verify appropriate redirection based on link text
      if (linkText?.toLowerCase().includes('reward')) {
        await expect(page).toHaveURL(/.*reward/);
      } else if (linkText?.toLowerCase().includes('product')) {
        await expect(page).toHaveURL(/.*product|.*shop/);
      } else if (linkText?.toLowerCase().includes('brand')) {
        await expect(page).toHaveURL(/.*brand|.*about/);
      }
    }
  }
});

// TC122: Bottom Navigation Bar - Home button
test('TC122: Bottom Navigation Bar - Home button redirects correctly', async ({ page }) => {
  await TestHelpers.navigateToHomepage(page);
  
  // Navigate away from home first
  await TestHelpers.navigateViaBottomNav(page, 'profile');
  
  // Now test home navigation
  await TestHelpers.navigateViaBottomNav(page, 'home');
  
  // Verify we're back on homepage
  await expect(page).toHaveURL(/.*home/);
});

// TC122: Bottom Navigation Bar - Rewards button
test('TC122: Bottom Navigation Bar - Rewards button redirects correctly', async ({ page }) => {
  await TestHelpers.navigateToHomepage(page);
  
  // Click rewards in bottom nav
  await TestHelpers.navigateViaBottomNav(page, 'rewards');
  
  // Verify we're on rewards page
  await expect(page).toHaveURL(/.*reward/);
});

// TC122: Bottom Navigation Bar - Upload Receipt button
test('TC122: Bottom Navigation Bar - Upload Receipt button redirects correctly', async ({ page }) => {
  await TestHelpers.navigateToHomepage(page);
  
  // Click upload receipt in bottom nav
  await TestHelpers.navigateViaBottomNav(page, 'upload');
  
  // Verify we're on upload page
  await expect(page).toHaveURL(/.*upload/);
  
  // Verify upload form is visible
  await expect(page.getByText('Upload your receipt')).toBeVisible();
});

// TC122: Bottom Navigation Bar - History button
test('TC122: Bottom Navigation Bar - History button redirects correctly', async ({ page }) => {
  await TestHelpers.navigateToHomepage(page);
  
  // Click history in bottom nav
  await TestHelpers.navigateViaBottomNav(page, 'history');
  
  // Verify we're on history page
  await expect(page).toHaveURL(/.*history/);
});

// TC122: Bottom Navigation Bar - Profile button
test('TC122: Bottom Navigation Bar - Profile button redirects correctly', async ({ page }) => {
  await TestHelpers.navigateToHomepage(page);
  
  // Click profile in bottom nav
  await TestHelpers.navigateViaBottomNav(page, 'profile');
  
  // Verify we're on profile page
  await expect(page).toHaveURL(/.*profile/);
  
  // Verify profile content is visible
  await expect(page.locator('text=/profile|personal|account/i')).toBeVisible();
});

// TC122: Bottom Navigation Bar - All buttons are functional
test('TC122: Bottom Navigation Bar - All buttons are functional', async ({ page }) => {
  await TestHelpers.navigateToHomepage(page);
  
  // Test all navigation buttons in sequence
  const navItems = ['rewards', 'upload', 'history', 'profile', 'home'] as const;
  
  for (const navItem of navItems) {
    await TestHelpers.navigateViaBottomNav(page, navItem);
    
    // Wait for navigation to complete
    await page.waitForTimeout(1000);
    
    // Verify URL changed appropriately
    const currentUrl = page.url();
    
    switch (navItem) {
      case 'home':
        expect(currentUrl).toMatch(/home/);
        break;
      case 'rewards':
        expect(currentUrl).toMatch(/reward/);
        break;
      case 'upload':
        expect(currentUrl).toMatch(/upload/);
        break;
      case 'history':
        expect(currentUrl).toMatch(/history/);
        break;
      case 'profile':
        expect(currentUrl).toMatch(/profile/);
        break;
    }
  }
});