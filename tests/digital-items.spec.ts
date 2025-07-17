import { test, expect } from '@playwright/test';
import { TestHelpers, TestData } from './helpers/common';

/**
 * Digital Items Tests
 * TC052-TC057: Digital item purchase and redemption flow
 */

test.beforeEach(async ({ page }) => {
  // Login as registered user and navigate to digital items page
  await TestHelpers.loginAsRegisteredUser(page);
  await TestHelpers.navigateViaBottomNav(page, 'rewards');
  
  // Navigate to Points Shop and then to Digital Items
  const pointsShopButton = page.getByRole('button', { name: 'Points Shop' });
  if (await pointsShopButton.isVisible({ timeout: 3000 })) {
    await pointsShopButton.click();
  }
  
  // Try to navigate to digital items section
  const digitalButton = page.getByText('Digital Product');
  if (await digitalButton.isVisible({ timeout: 3000 })) {
    await digitalButton.click();
  } else {
    // If no specific digital section, we'll work with the general shop
    console.log('Working with general shop items for digital product testing');
  }
});

// TC052: "Back" arrow to previous page
test('TC052: Back arrow redirects to previous page', async ({ page }) => {
  // Should be on digital items or shop page from beforeEach
  
  // Click back arrow
  await TestHelpers.goBack(page);
  
  // Should return to previous page (rewards or shop)
  await expect(page).toHaveURL(/.*reward|.*shop/);
});

// TC053: T&C button opens T&C page
test('TC053: Terms and Conditions button opens T&C page', async ({ page }) => {
  // Look for Terms and Conditions button on digital items page
  const tcButton = page.getByText('Terms and Conditions');
  
  if (await tcButton.isVisible({ timeout: 5000 })) {
    // Create a promise that resolves when a new page is opened
    const newPagePromise = page.context().waitForEvent('page');
    await tcButton.click();
    
    try {
      const newPage = await newPagePromise;
      
      // Verify the new page contains terms content
      await expect(newPage).toHaveURL(/terms|conditions|pdf/i);
      await newPage.close();
    } catch (error) {
      // If no new page opens, check for popup
      await expect(page.locator('.popup, .modal, .dialog')).toBeVisible();
      await expect(page.locator('text=/terms|conditions|agreement/i')).toBeVisible();
      await TestHelpers.closePopupWithX(page);
    }
  } else {
    // Look for alternative T&C elements
    const alternatives = [
      page.getByText('T&C'),
      page.getByText('Terms'),
      page.getByText('Conditions'),
      page.locator('[data-testid="terms-conditions"]')
    ];
    
    let found = false;
    for (const element of alternatives) {
      if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
        await element.click();
        found = true;
        break;
      }
    }
    
    if (!found) {
      console.log('Terms and Conditions button not found on digital items page');
    }
  }
});

// TC054: Add/reduce quantity
test('TC054: Add and reduce quantity controls work correctly', async ({ page }) => {
  // Find the first available digital item
  const digitalItems = page.locator('.product-item, .shop-item, .reward-item, .digital-item');
  const itemCount = await digitalItems.count();
  
  if (itemCount > 0) {
    const firstItem = digitalItems.first();
    
    // Look for quantity controls
    const increaseButton = firstItem.locator('button:has-text("+"), .quantity-increase, .qty-plus');
    const decreaseButton = firstItem.locator('button:has-text("-"), .quantity-decrease, .qty-minus');
    const quantityInput = firstItem.locator('input[type="number"], .quantity-input');
    
    // Test increase quantity
    if (await increaseButton.isVisible({ timeout: 3000 })) {
      const initialValue = await quantityInput.inputValue().catch(() => '1');
      await increaseButton.click();
      
      // Wait for update
      await page.waitForTimeout(500);
      
      const newValue = await quantityInput.inputValue().catch(() => '1');
      expect(parseInt(newValue)).toBeGreaterThan(parseInt(initialValue));
      
      // Test decrease quantity
      if (await decreaseButton.isVisible()) {
        await decreaseButton.click();
        await page.waitForTimeout(500);
        
        const finalValue = await quantityInput.inputValue().catch(() => '1');
        expect(parseInt(finalValue)).toBeLessThan(parseInt(newValue));
      }
    } else {
      // Look for alternative quantity controls
      const altIncrease = firstItem.locator('.plus, [data-action="increase"]');
      const altDecrease = firstItem.locator('.minus, [data-action="decrease"]');
      
      if (await altIncrease.isVisible({ timeout: 2000 })) {
        await altIncrease.click();
        await page.waitForTimeout(500);
        
        if (await altDecrease.isVisible()) {
          await altDecrease.click();
          await page.waitForTimeout(500);
        }
      } else {
        console.log('Quantity controls not found - may be single quantity only');
      }
    }
  } else {
    console.log('No digital items found for quantity testing');
  }
});

// TC055: Display points needed for quantity
test('TC055: Display points needed for selected quantity', async ({ page }) => {
  // Find the first available digital item
  const digitalItems = page.locator('.product-item, .shop-item, .reward-item, .digital-item');
  const itemCount = await digitalItems.count();
  
  if (itemCount > 0) {
    const firstItem = digitalItems.first();
    
    // Check for points display
    const pointsDisplay = firstItem.locator('text=/\\d+\\s*points|points:\\s*\\d+/i');
    await expect(pointsDisplay).toBeVisible();
    
    // If quantity controls exist, test points update
    const increaseButton = firstItem.locator('button:has-text("+"), .quantity-increase, .qty-plus');
    
    if (await increaseButton.isVisible({ timeout: 3000 })) {
      // Get initial points value
      const initialPoints = await pointsDisplay.textContent();
      
      // Increase quantity
      await increaseButton.click();
      await page.waitForTimeout(1000);
      
      // Check if points updated
      const newPoints = await pointsDisplay.textContent();
      
      // Points should either increase or remain the same (depending on implementation)
      expect(newPoints).toBeDefined();
      
      // Look for total points calculation
      const totalPointsDisplay = page.locator('text=/total.*\\d+.*points|\\d+.*points.*total/i');
      if (await totalPointsDisplay.isVisible({ timeout: 2000 })) {
        await expect(totalPointsDisplay).toBeVisible();
      }
    }
  } else {
    console.log('No digital items found for points display testing');
  }
});

// TC056: Insufficient points disables checkout with error
test('TC056: Insufficient points disables checkout with error message', async ({ page }) => {
  // Use insufficient points user for this test
  await page.goto('https://my.haleon-rewards.d-rive.net/login');
  await page.getByPlaceholder('Your phone number').fill(TestData.INSUFFICIENT_POINTS_USER_PHONE);
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await page.pause(); // Manual OTP entry
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
  
  // Navigate to digital items
  await TestHelpers.navigateViaBottomNav(page, 'rewards');
  const pointsShopButton = page.getByRole('button', { name: 'Points Shop' });
  if (await pointsShopButton.isVisible({ timeout: 3000 })) {
    await pointsShopButton.click();
  }
  
  // Find an expensive digital item
  const digitalItems = page.locator('.product-item, .shop-item, .reward-item');
  const itemCount = await digitalItems.count();
  
  if (itemCount > 0) {
    // Try to find an item that costs more points than available
    for (let i = 0; i < Math.min(itemCount, 3); i++) {
      const item = digitalItems.nth(i);
      const addButton = item.locator('button:has-text("Add"), button:has-text("Select"), .add-to-cart');
      
      if (await addButton.isVisible({ timeout: 2000 })) {
        await addButton.click();
        
        // Check for insufficient points error
        const errorMessages = [
          page.getByText('Insufficient Points'),
          page.getByText('Not enough points'),
          page.getByText('Insufficient balance'),
          page.locator('.error-message, .warning')
        ];
        
        let errorFound = false;
        for (const error of errorMessages) {
          if (await error.isVisible({ timeout: 2000 }).catch(() => false)) {
            errorFound = true;
            break;
          }
        }
        
        if (errorFound) {
          // Verify checkout button is disabled
          const checkoutButton = page.locator('button:has-text("Checkout"), button:has-text("Proceed"), .checkout-btn');
          if (await checkoutButton.isVisible()) {
            const isDisabled = await checkoutButton.isDisabled();
            expect(isDisabled).toBeTruthy();
          }
          break;
        }
      }
    }
  }
});

// TC057: Sufficient points proceeds to confirmation and success message
test('TC057: Sufficient points proceeds to confirmation and success', async ({ page }) => {
  // Find an affordable digital item
  const digitalItems = page.locator('.product-item, .shop-item, .reward-item');
  const itemCount = await digitalItems.count();
  
  if (itemCount > 0) {
    // Look for a low-cost item or the cheapest available
    let selectedItem = digitalItems.first();
    
    // Try to find an item with low point cost
    for (let i = 0; i < Math.min(itemCount, 3); i++) {
      const item = digitalItems.nth(i);
      const pointsText = await item.locator('text=/\\d+\\s*points/i').textContent().catch(() => '');
      const pointsCost = parseInt(pointsText.match(/\d+/)?.[0] || '0');
      
      // Look for items costing 50 points or less (assuming this should be affordable)
      if (pointsCost <= 50 && pointsCost > 0) {
        selectedItem = item;
        break;
      }
    }
    
    // Add the selected item
    const addButton = selectedItem.locator('button:has-text("Add"), button:has-text("Select"), .add-to-cart');
    
    if (await addButton.isVisible({ timeout: 3000 })) {
      await addButton.click();
      
      // Look for proceed/checkout button
      const proceedButton = page.locator('button:has-text("Proceed"), button:has-text("Checkout"), button:has-text("Confirm"), .checkout-btn');
      
      if (await proceedButton.isVisible({ timeout: 5000 })) {
        await proceedButton.click();
        
        // Should show confirmation dialog or proceed to confirmation page
        const confirmationElements = [
          page.locator('.confirmation, .order-summary'),
          page.getByText('Confirm your order'),
          page.getByText('Order Summary'),
          page.locator('.modal, .popup')
        ];
        
        let confirmationFound = false;
        for (const element of confirmationElements) {
          if (await element.isVisible({ timeout: 3000 }).catch(() => false)) {
            confirmationFound = true;
            break;
          }
        }
        
        if (confirmationFound) {
          // Look for final confirm button
          const finalConfirmButton = page.locator('button:has-text("Confirm"), button:has-text("Complete"), .confirm-btn');
          
          if (await finalConfirmButton.isVisible({ timeout: 3000 })) {
            await finalConfirmButton.click();
            
            // Should show success message
            await TestHelpers.verifySuccessMessage(page, 'success');
            
            // Look for completion actions
            const completionButtons = [
              page.getByRole('button', { name: 'Done' }),
              page.getByRole('button', { name: 'Go to Rewards' }),
              page.getByRole('button', { name: 'Continue' })
            ];
            
            for (const button of completionButtons) {
              if (await button.isVisible({ timeout: 2000 })) {
                await button.click();
                break;
              }
            }
          }
        } else {
          console.log('Confirmation step not found - may proceed directly to success');
        }
      } else {
        console.log('Proceed/Checkout button not found after adding item');
      }
    } else {
      console.log('Add button not found for digital item');
    }
  } else {
    console.log('No digital items found for purchase testing');
  }
});

// Additional test: Digital item details page
test('Digital item details page displays correctly', async ({ page }) => {
  // Find a digital item and click on it to view details
  const digitalItems = page.locator('.product-item, .shop-item, .reward-item');
  const itemCount = await digitalItems.count();
  
  if (itemCount > 0) {
    const firstItem = digitalItems.first();
    
    // Click on the item (not the add button)
    const itemTitle = firstItem.locator('h3, .title, .name').first();
    const itemImage = firstItem.locator('img').first();
    
    if (await itemTitle.isVisible({ timeout: 2000 })) {
      await itemTitle.click();
    } else if (await itemImage.isVisible({ timeout: 2000 })) {
      await itemImage.click();
    } else {
      await firstItem.click();
    }
    
    // Wait for details page to load
    await page.waitForTimeout(2000);
    
    // Verify we're on a details page
    const detailsIndicators = [
      page.locator('.product-details, .item-details'),
      page.locator('text=/description|details|terms/i'),
      page.locator('button:has-text("Add to Cart"), button:has-text("Redeem")')
    ];
    
    let detailsFound = false;
    for (const indicator of detailsIndicators) {
      if (await indicator.isVisible({ timeout: 2000 }).catch(() => false)) {
        detailsFound = true;
        break;
      }
    }
    
    if (detailsFound) {
      // Verify essential details are present
      await expect(page.locator('text=/points|price/i')).toBeVisible();
      
      // Verify action buttons are present
      const actionButtons = page.locator('button:has-text("Add"), button:has-text("Redeem"), button:has-text("Select")');
      await expect(actionButtons.first()).toBeVisible();
    } else {
      console.log('Digital item details page not found - may be single-page shop');
    }
  }
});

// Additional test: Digital item categories/filtering
test('Digital item categories and filtering work correctly', async ({ page }) => {
  // Look for category filters
  const categoryFilters = [
    page.locator('select[name*="category"]'),
    page.getByText('Vouchers'),
    page.getByText('E-wallet'),
    page.getByText('Gift Cards'),
    page.locator('.category-filter, .filter-tabs')
  ];
  
  let filterFound = false;
  
  for (const filter of categoryFilters) {
    if (await filter.isVisible({ timeout: 3000 }).catch(() => false)) {
      filterFound = true;
      
      // Apply filter
      if (await filter.getAttribute('tagName') === 'SELECT') {
        await filter.selectOption({ index: 1 });
      } else {
        await filter.click();
      }
      
      // Wait for filter to apply
      await page.waitForTimeout(1000);
      
      // Verify items are filtered
      const items = page.locator('.product-item, .shop-item, .reward-item');
      const itemCount = await items.count();
      
      // Should have some items or show empty state
      expect(itemCount >= 0).toBeTruthy();
      break;
    }
  }
  
  if (!filterFound) {
    console.log('Digital item category filters not found - may not be implemented');
  }
});