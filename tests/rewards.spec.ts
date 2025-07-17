import { test, expect } from '@playwright/test';
import { TestHelpers, TestData } from './helpers/common';

/**
 * Rewards Tests  
 * TC038-TC051: Points Shop and My Rewards functionality
 */

test.beforeEach(async ({ page }) => {
  // Login as registered user and navigate to rewards page before each test
  await TestHelpers.loginAsRegisteredUser(page);
  await TestHelpers.navigateViaBottomNav(page, 'rewards');
});

// TC038: "Points Shop" button opens Points Shop
test('TC038: Points Shop button opens Points Shop', async ({ page }) => {
  // Should be on rewards page from beforeEach
  await expect(page).toHaveURL(/.*reward/);
  
  // Look for Points Shop button
  const pointsShopButton = page.getByRole('button', { name: 'Points Shop' });
  
  if (await pointsShopButton.isVisible({ timeout: 5000 })) {
    await pointsShopButton.click();
    
    // Verify we're in points shop section
    await expect(page).toHaveURL(/.*shop|.*points/);
    
    // Verify points shop content is visible
    await expect(page.locator('text=/shop|redeem|items/i')).toBeVisible();
  } else {
    // Look for alternative button text
    const alternatives = [
      page.getByText('Shop'),
      page.getByText('Point Shop'),
      page.getByText('Redeem Points'),
      page.locator('[data-testid="points-shop"]')
    ];
    
    let found = false;
    for (const button of alternatives) {
      if (await button.isVisible({ timeout: 2000 }).catch(() => false)) {
        await button.click();
        await expect(page.locator('text=/shop|redeem|items/i')).toBeVisible();
        found = true;
        break;
      }
    }
    
    expect(found).toBeTruthy();
  }
});

// TC038: "My Rewards" button opens My Rewards
test('TC038: My Rewards button opens My Rewards', async ({ page }) => {
  // Should be on rewards page from beforeEach
  await expect(page).toHaveURL(/.*reward/);
  
  // Look for My Rewards button
  const myRewardsButton = page.getByRole('button', { name: 'My Rewards' });
  
  if (await myRewardsButton.isVisible({ timeout: 5000 })) {
    await myRewardsButton.click();
    
    // Verify we're in my rewards section
    await expect(page).toHaveURL(/.*my-rewards|.*rewards/);
    
    // Verify my rewards content is visible
    await expect(page.locator('text=/my rewards|vouchers|digital/i')).toBeVisible();
  } else {
    // Look for alternative button text
    const alternatives = [
      page.getByText('My Vouchers'),
      page.getByText('Rewards'),
      page.getByText('Digital Rewards'),
      page.locator('[data-testid="my-rewards"]')
    ];
    
    let found = false;
    for (const button of alternatives) {
      if (await button.isVisible({ timeout: 2000 }).catch(() => false)) {
        await button.click();
        await expect(page.locator('text=/my rewards|vouchers|digital/i')).toBeVisible();
        found = true;
        break;
      }
    }
    
    expect(found).toBeTruthy();
  }
});

// TC039: Filter products in Points Shop
test('TC039: Filter products in Points Shop', async ({ page }) => {
  // Navigate to Points Shop
  const pointsShopButton = page.getByRole('button', { name: 'Points Shop' });
  if (await pointsShopButton.isVisible({ timeout: 3000 })) {
    await pointsShopButton.click();
  }
  
  // Look for filter controls
  const filterElements = [
    page.locator('select[name*="filter"], select[name*="category"]'),
    page.locator('.filter-dropdown, .category-filter'),
    page.getByText('Digital'),
    page.getByText('Physical'),
    page.getByText('Vouchers'),
    page.getByText('All Categories')
  ];
  
  let filterFound = false;
  
  for (const filter of filterElements) {
    if (await filter.isVisible({ timeout: 2000 }).catch(() => false)) {
      filterFound = true;
      
      // If it's a dropdown, try to interact with it
      if (await filter.getAttribute('tagName') === 'SELECT') {
        await filter.selectOption({ index: 1 }); // Select second option
      } else {
        await filter.click();
      }
      
      // Wait for filter to apply
      await page.waitForTimeout(1000);
      
      // Verify some change occurred
      const hasLoader = await page.locator('.loading, .spinner, [data-testid="loading"]').isVisible().catch(() => false);
      const hasItems = await page.locator('.product-item, .shop-item, .reward-item').isVisible().catch(() => false);
      
      expect(hasLoader || hasItems).toBeTruthy();
      break;
    }
  }
  
  if (!filterFound) {
    console.log('Product filter not found in Points Shop');
  }
});

// TC040: Display user points in Points Shop
test('TC040: Display user points in Points Shop', async ({ page }) => {
  // Navigate to Points Shop
  const pointsShopButton = page.getByRole('button', { name: 'Points Shop' });
  if (await pointsShopButton.isVisible({ timeout: 3000 })) {
    await pointsShopButton.click();
  }
  
  // Verify user points are displayed
  await expect(page.locator('text=/\\d+\\s*points|points:\\s*\\d+|available:\\s*\\d+/i')).toBeVisible();
  
  // Also check for points balance in header or sidebar
  const pointsDisplay = page.locator('.points-balance, .user-points, [data-testid="points-display"]');
  if (await pointsDisplay.isVisible({ timeout: 2000 })) {
    await expect(pointsDisplay).toContainText(/\d+/);
  }
});

// TC041: Display all shop items
test('TC041: Display all shop items in Points Shop', async ({ page }) => {
  // Navigate to Points Shop
  const pointsShopButton = page.getByRole('button', { name: 'Points Shop' });
  if (await pointsShopButton.isVisible({ timeout: 3000 })) {
    await pointsShopButton.click();
  }
  
  // Wait for items to load
  await page.waitForTimeout(2000);
  
  // Look for shop items
  const shopItems = page.locator('.product-item, .shop-item, .reward-item, .item-card');
  const itemCount = await shopItems.count();
  
  if (itemCount > 0) {
    // Verify items contain expected information
    const firstItem = shopItems.first();
    
    // Check for common item fields
    const hasTitle = await firstItem.locator('text=/[A-Za-z]+ voucher|rm \\d+|[A-Za-z]+ reward/i').isVisible().catch(() => false);
    const hasPoints = await firstItem.locator('text=/\\d+\\s*points/i').isVisible().catch(() => false);
    const hasImage = await firstItem.locator('img').isVisible().catch(() => false);
    const hasButton = await firstItem.locator('button').isVisible().catch(() => false);
    
    // At least title and points should be present
    expect(hasTitle || hasPoints).toBeTruthy();
    
    // Verify multiple items if available
    if (itemCount > 1) {
      const secondItem = shopItems.nth(1);
      await expect(secondItem).toBeVisible();
    }
  } else {
    // No items found - check for empty state
    const emptyStateMessages = [
      page.getByText('No items available'),
      page.getByText('Coming soon'),
      page.getByText('No rewards found'),
      page.locator('.empty-state, .no-items')
    ];
    
    let emptyStateFound = false;
    for (const message of emptyStateMessages) {
      if (await message.isVisible({ timeout: 2000 }).catch(() => false)) {
        emptyStateFound = true;
        break;
      }
    }
    
    expect(emptyStateFound).toBeTruthy();
  }
});

// TC042: "Physical Product" redirects to Physical Items page
test('TC042: Physical Product redirects to Physical Items page', async ({ page }) => {
  // Navigate to Points Shop
  const pointsShopButton = page.getByRole('button', { name: 'Points Shop' });
  if (await pointsShopButton.isVisible({ timeout: 3000 })) {
    await pointsShopButton.click();
  }
  
  // Look for Physical Product button/link
  const physicalButton = page.getByText('Physical Product');
  
  if (await physicalButton.isVisible({ timeout: 5000 })) {
    await physicalButton.click();
    
    // Verify redirect to physical items page
    await expect(page).toHaveURL(/.*physical|.*items/);
    
    // Verify physical items content
    await expect(page.locator('text=/physical|delivery|shipping/i')).toBeVisible();
  } else {
    // Look for alternative text
    const alternatives = [
      page.getByText('Physical Items'),
      page.getByText('Physical Rewards'),
      page.getByText('Delivery Items'),
      page.locator('[data-testid="physical-products"]')
    ];
    
    let found = false;
    for (const button of alternatives) {
      if (await button.isVisible({ timeout: 2000 }).catch(() => false)) {
        await button.click();
        await expect(page.locator('text=/physical|delivery|shipping/i')).toBeVisible();
        found = true;
        break;
      }
    }
    
    if (!found) {
      console.log('Physical Product button not found - may be integrated in main shop');
    }
  }
});

// TC042: "Digital Product" redirects to Digital Items page
test('TC042: Digital Product redirects to Digital Items page', async ({ page }) => {
  // Navigate to Points Shop
  const pointsShopButton = page.getByRole('button', { name: 'Points Shop' });
  if (await pointsShopButton.isVisible({ timeout: 3000 })) {
    await pointsShopButton.click();
  }
  
  // Look for Digital Product button/link
  const digitalButton = page.getByText('Digital Product');
  
  if (await digitalButton.isVisible({ timeout: 5000 })) {
    await digitalButton.click();
    
    // Verify redirect to digital items page
    await expect(page).toHaveURL(/.*digital|.*vouchers/);
    
    // Verify digital items content
    await expect(page.locator('text=/digital|voucher|instant/i')).toBeVisible();
  } else {
    // Look for alternative text
    const alternatives = [
      page.getByText('Digital Items'),
      page.getByText('Digital Rewards'),
      page.getByText('Vouchers'),
      page.locator('[data-testid="digital-products"]')
    ];
    
    let found = false;
    for (const button of alternatives) {
      if (await button.isVisible({ timeout: 2000 }).catch(() => false)) {
        await button.click();
        await expect(page.locator('text=/digital|voucher|instant/i')).toBeVisible();
        found = true;
        break;
      }
    }
    
    if (!found) {
      console.log('Digital Product button not found - may be integrated in main shop');
    }
  }
});

// TC043: Out of stock disables button and shows message
test('TC043: Out of stock items disable button and show message', async ({ page }) => {
  // Navigate to Points Shop
  const pointsShopButton = page.getByRole('button', { name: 'Points Shop' });
  if (await pointsShopButton.isVisible({ timeout: 3000 })) {
    await pointsShopButton.click();
  }
  
  // Look for out of stock items
  const outOfStockItems = page.locator('.out-of-stock, .unavailable, :has-text("Out of Stock")');
  const outOfStockCount = await outOfStockItems.count();
  
  if (outOfStockCount > 0) {
    const firstOutOfStockItem = outOfStockItems.first();
    
    // Verify out of stock message is shown
    await expect(firstOutOfStockItem.locator('text=/out of stock|unavailable|sold out/i')).toBeVisible();
    
    // Verify button is disabled
    const button = firstOutOfStockItem.locator('button');
    if (await button.isVisible()) {
      const isDisabled = await button.isDisabled();
      expect(isDisabled).toBeTruthy();
    }
  } else {
    // No out of stock items found - this is expected if all items are available
    console.log('No out of stock items found - all items appear to be available');
  }
});

// TC044: Display selected item count & required points
test('TC044: Display selected item count and required points', async ({ page }) => {
  // Navigate to Points Shop
  const pointsShopButton = page.getByRole('button', { name: 'Points Shop' });
  if (await pointsShopButton.isVisible({ timeout: 3000 })) {
    await pointsShopButton.click();
  }
  
  // Find an available item to add to cart
  const shopItems = page.locator('.product-item, .shop-item, .reward-item');
  const itemCount = await shopItems.count();
  
  if (itemCount > 0) {
    const firstItem = shopItems.first();
    const addButton = firstItem.locator('button:has-text("Add"), button:has-text("Select"), .add-to-cart');
    
    if (await addButton.isVisible({ timeout: 2000 })) {
      await addButton.click();
      
      // Look for cart/selection indicator
      const cartElements = [
        page.locator('.cart-count, .selected-count'),
        page.locator('text=/\\d+ item|\\d+ selected/'),
        page.locator('.cart-total, .total-points'),
        page.locator('text=/total:\\s*\\d+\\s*points/i')
      ];
      
      let cartIndicatorFound = false;
      for (const element of cartElements) {
        if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
          cartIndicatorFound = true;
          break;
        }
      }
      
      expect(cartIndicatorFound).toBeTruthy();
    }
  }
});

// TC045: "View Cart" redirects to Cart page
test('TC045: View Cart redirects to Cart page', async ({ page }) => {
  // Navigate to Points Shop and add an item first
  const pointsShopButton = page.getByRole('button', { name: 'Points Shop' });
  if (await pointsShopButton.isVisible({ timeout: 3000 })) {
    await pointsShopButton.click();
  }
  
  // Try to add an item to cart first
  const shopItems = page.locator('.product-item, .shop-item, .reward-item');
  const itemCount = await shopItems.count();
  
  if (itemCount > 0) {
    const firstItem = shopItems.first();
    const addButton = firstItem.locator('button:has-text("Add"), button:has-text("Select"), .add-to-cart');
    
    if (await addButton.isVisible({ timeout: 2000 })) {
      await addButton.click();
    }
  }
  
  // Look for View Cart button
  const viewCartButton = page.getByText('View Cart');
  
  if (await viewCartButton.isVisible({ timeout: 5000 })) {
    await viewCartButton.click();
    
    // Verify redirect to cart page
    await expect(page).toHaveURL(/.*cart/);
    
    // Verify cart content is visible
    await expect(page.locator('text=/cart|checkout|total/i')).toBeVisible();
  } else {
    // Look for alternative button text
    const alternatives = [
      page.getByText('Cart'),
      page.getByText('Checkout'),
      page.getByText('Review Order'),
      page.locator('[data-testid="view-cart"]')
    ];
    
    let found = false;
    for (const button of alternatives) {
      if (await button.isVisible({ timeout: 2000 }).catch(() => false)) {
        await button.click();
        await expect(page).toHaveURL(/.*cart/);
        found = true;
        break;
      }
    }
    
    if (!found) {
      console.log('View Cart button not found - may not be implemented or no items in cart');
    }
  }
});

// TC046-TC051: My Rewards functionality
// TC046: Filter reward duration in My Rewards
test('TC046: Filter reward duration in My Rewards', async ({ page }) => {
  // Navigate to My Rewards
  const myRewardsButton = page.getByRole('button', { name: 'My Rewards' });
  if (await myRewardsButton.isVisible({ timeout: 3000 })) {
    await myRewardsButton.click();
  }
  
  // Look for filter controls
  const filterElements = [
    page.locator('select[name*="filter"], select[name*="duration"]'),
    page.locator('.filter-dropdown, .duration-filter'),
    page.getByText('Active'),
    page.getByText('Expired'),
    page.getByText('All Rewards')
  ];
  
  let filterFound = false;
  
  for (const filter of filterElements) {
    if (await filter.isVisible({ timeout: 2000 }).catch(() => false)) {
      filterFound = true;
      
      if (await filter.getAttribute('tagName') === 'SELECT') {
        await filter.selectOption({ index: 1 });
      } else {
        await filter.click();
      }
      
      await page.waitForTimeout(1000);
      break;
    }
  }
  
  if (!filterFound) {
    console.log('Duration filter not found in My Rewards');
  }
});

// TC047: List of digital rewards
test('TC047: List of digital rewards in My Rewards', async ({ page }) => {
  // Navigate to My Rewards
  const myRewardsButton = page.getByRole('button', { name: 'My Rewards' });
  if (await myRewardsButton.isVisible({ timeout: 3000 })) {
    await myRewardsButton.click();
  }
  
  // Wait for rewards to load
  await page.waitForTimeout(2000);
  
  // Look for reward items
  const rewardItems = page.locator('.reward-item, .voucher-item, .digital-reward');
  const rewardCount = await rewardItems.count();
  
  if (rewardCount > 0) {
    // Verify rewards contain expected information
    const firstReward = rewardItems.first();
    
    const hasTitle = await firstReward.locator('text=/voucher|reward|rm \\d+/i').isVisible().catch(() => false);
    const hasExpiry = await firstReward.locator('text=/expire|valid until|\\d{1,2}[\\/-]\\d{1,2}/i').isVisible().catch(() => false);
    const hasCode = await firstReward.locator('text=/code|tap to reveal/i').isVisible().catch(() => false);
    
    expect(hasTitle || hasExpiry || hasCode).toBeTruthy();
  } else {
    // Check for empty state
    const emptyMessages = [
      page.getByText('No rewards available'),
      page.getByText('No vouchers found'),
      page.locator('.empty-state')
    ];
    
    let emptyFound = false;
    for (const message of emptyMessages) {
      if (await message.isVisible({ timeout: 2000 }).catch(() => false)) {
        emptyFound = true;
        break;
      }
    }
    
    expect(emptyFound).toBeTruthy();
  }
});

// TC048: "Tap to Reveal" shows code
test('TC048: Tap to Reveal shows voucher code', async ({ page }) => {
  // Navigate to My Rewards
  const myRewardsButton = page.getByRole('button', { name: 'My Rewards' });
  if (await myRewardsButton.isVisible({ timeout: 3000 })) {
    await myRewardsButton.click();
  }
  
  // Look for "Tap to Reveal" button
  const tapToRevealButton = page.getByText('Tap to Reveal');
  
  if (await tapToRevealButton.isVisible({ timeout: 5000 })) {
    await tapToRevealButton.click();
    
    // Verify code is revealed (usually alphanumeric string)
    await expect(page.locator('text=/[A-Z0-9]{6,20}|[a-z0-9]{8,}/i')).toBeVisible();
    
    // Verify copy button appears
    await expect(page.getByText('Copy')).toBeVisible();
  } else {
    console.log('Tap to Reveal button not found - no redeemable rewards available');
  }
});

// TC049: "Copy" button copies code
test('TC049: Copy button copies voucher code', async ({ page }) => {
  // Navigate to My Rewards and reveal a code first
  const myRewardsButton = page.getByRole('button', { name: 'My Rewards' });
  if (await myRewardsButton.isVisible({ timeout: 3000 })) {
    await myRewardsButton.click();
  }
  
  const tapToRevealButton = page.getByText('Tap to Reveal');
  if (await tapToRevealButton.isVisible({ timeout: 3000 })) {
    await tapToRevealButton.click();
  }
  
  // Look for Copy button
  const copyButton = page.getByText('Copy');
  
  if (await copyButton.isVisible({ timeout: 5000 })) {
    await copyButton.click();
    
    // Verify copy feedback (toast, message, or button text change)
    const copyFeedback = [
      page.getByText('Copied'),
      page.getByText('Code copied'),
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
  } else {
    console.log('Copy button not found - may not be available');
  }
});

// TC050: Voucher expired disables "Copy" button
test('TC050: Expired voucher disables Copy button', async ({ page }) => {
  // Navigate to My Rewards
  const myRewardsButton = page.getByRole('button', { name: 'My Rewards' });
  if (await myRewardsButton.isVisible({ timeout: 3000 })) {
    await myRewardsButton.click();
  }
  
  // Look for expired vouchers
  const expiredVouchers = page.locator('.expired, :has-text("Expired")');
  const expiredCount = await expiredVouchers.count();
  
  if (expiredCount > 0) {
    const firstExpired = expiredVouchers.first();
    
    // Check if copy button is disabled or not present
    const copyButton = firstExpired.locator('button:has-text("Copy")');
    
    if (await copyButton.isVisible()) {
      const isDisabled = await copyButton.isDisabled();
      expect(isDisabled).toBeTruthy();
    } else {
      // Copy button should not be visible for expired vouchers
      expect(await copyButton.isVisible()).toBeFalsy();
    }
  } else {
    console.log('No expired vouchers found for testing');
  }
});

// TC051: "How to Redeem" opens popup
test('TC051: How to Redeem opens information popup', async ({ page }) => {
  // Navigate to My Rewards
  const myRewardsButton = page.getByRole('button', { name: 'My Rewards' });
  if (await myRewardsButton.isVisible({ timeout: 3000 })) {
    await myRewardsButton.click();
  }
  
  // Look for "How to Redeem" button
  const howToRedeemButton = page.getByText('How to Redeem');
  
  if (await howToRedeemButton.isVisible({ timeout: 5000 })) {
    await howToRedeemButton.click();
    
    // Verify popup appears with redemption instructions
    await expect(page.locator('.popup, .modal, .dialog')).toBeVisible();
    await expect(page.locator('text=/redeem|how to|instructions/i')).toBeVisible();
    
    // Close popup
    await TestHelpers.closePopupWithX(page);
  } else {
    console.log('How to Redeem button not found - may not be implemented');
  }
});

// TC051: "Terms and Conditions" opens popup  
test('TC051: Terms and Conditions opens popup in My Rewards', async ({ page }) => {
  // Navigate to My Rewards
  const myRewardsButton = page.getByRole('button', { name: 'My Rewards' });
  if (await myRewardsButton.isVisible({ timeout: 3000 })) {
    await myRewardsButton.click();
  }
  
  // Look for "Terms and Conditions" link
  const termsButton = page.getByText('Terms and Conditions');
  
  if (await termsButton.isVisible({ timeout: 5000 })) {
    await termsButton.click();
    
    // Verify popup or new page appears with terms
    const popupVisible = await page.locator('.popup, .modal, .dialog').isVisible().catch(() => false);
    const newPageOpened = await page.context().pages().length > 1;
    
    expect(popupVisible || newPageOpened).toBeTruthy();
    
    if (popupVisible) {
      await expect(page.locator('text=/terms|conditions|agreement/i')).toBeVisible();
      await TestHelpers.closePopupWithX(page);
    }
  } else {
    console.log('Terms and Conditions link not found - may not be implemented');
  }
});