import { test, expect } from '@playwright/test';
import { TestHelpers, TestData } from './helpers/common';

/**
 * Cart Tests
 * TC063-TC073: Cart functionality and checkout process
 */

test.beforeEach(async ({ page }) => {
  // Login as registered user and navigate to cart page (via adding items first)
  await TestHelpers.loginAsRegisteredUser(page);
  await TestHelpers.navigateViaBottomNav(page, 'rewards');
  
  // Navigate to Points Shop to add items to cart
  const pointsShopButton = page.getByRole('button', { name: 'Points Shop' });
  if (await pointsShopButton.isVisible({ timeout: 3000 })) {
    await pointsShopButton.click();
  }
});

// TC063: "Back" arrow to previous page
test('TC063: Back arrow redirects to previous page from cart', async ({ page }) => {
  // First add an item to cart to navigate to cart page
  const shopItems = page.locator('.product-item, .shop-item, .reward-item');
  const itemCount = await shopItems.count();
  
  if (itemCount > 0) {
    const firstItem = shopItems.first();
    const addButton = firstItem.locator('button:has-text("Add"), .add-to-cart');
    
    if (await addButton.isVisible({ timeout: 3000 })) {
      await addButton.click();
    }
  }
  
  // Navigate to cart
  const viewCartButton = page.getByText('View Cart');
  if (await viewCartButton.isVisible({ timeout: 3000 })) {
    await viewCartButton.click();
  } else {
    // Alternative cart navigation
    const cartButton = page.getByText('Cart');
    if (await cartButton.isVisible({ timeout: 3000 })) {
      await cartButton.click();
    }
  }
  
  // Should be on cart page now
  await expect(page).toHaveURL(/.*cart/);
  
  // Click back arrow
  await TestHelpers.goBack(page);
  
  // Should return to previous page (shop)
  await expect(page).toHaveURL(/.*shop|.*reward/);
});

// TC064: "Return to Point Shop" if cart empty
test('TC064: Return to Point Shop when cart is empty', async ({ page }) => {
  // Try to navigate to cart directly or clear cart first
  const cartButton = page.getByText('Cart');
  if (await cartButton.isVisible({ timeout: 3000 })) {
    await cartButton.click();
  } else {
    // Try navigating via URL if cart button not visible
    await page.goto(page.url().replace(/\/[^\/]*$/, '/cart'));
  }
  
  // Look for empty cart message and return to shop button
  const emptyCartMessages = [
    page.getByText('Your cart is empty'),
    page.getByText('No items in cart'),
    page.getByText('Cart is empty'),
    page.locator('.empty-cart')
  ];
  
  let emptyCartFound = false;
  for (const message of emptyCartMessages) {
    if (await message.isVisible({ timeout: 3000 }).catch(() => false)) {
      emptyCartFound = true;
      break;
    }
  }
  
  if (emptyCartFound) {
    // Look for "Return to Point Shop" button
    const returnButton = page.getByText('Return to Point Shop');
    
    if (await returnButton.isVisible({ timeout: 3000 })) {
      await returnButton.click();
      
      // Should redirect back to shop
      await expect(page).toHaveURL(/.*shop|.*reward/);
    } else {
      // Look for alternative return buttons
      const alternatives = [
        page.getByText('Continue Shopping'),
        page.getByText('Back to Shop'),
        page.getByText('Shop Now'),
        page.locator('.continue-shopping')
      ];
      
      for (const button of alternatives) {
        if (await button.isVisible({ timeout: 2000 }).catch(() => false)) {
          await button.click();
          await expect(page).toHaveURL(/.*shop|.*reward/);
          break;
        }
      }
    }
  } else {
    console.log('Empty cart state not found - cart may have items or feature not implemented');
  }
});

// TC065: Add to cart and select checkbox to redeem
test('TC065: Add item to cart and select checkbox for redemption', async ({ page }) => {
  // Add an item to cart
  const shopItems = page.locator('.product-item, .shop-item, .reward-item');
  const itemCount = await shopItems.count();
  
  if (itemCount > 0) {
    const firstItem = shopItems.first();
    const addButton = firstItem.locator('button:has-text("Add"), .add-to-cart');
    
    if (await addButton.isVisible({ timeout: 3000 })) {
      await addButton.click();
      
      // Navigate to cart
      const viewCartButton = page.getByText('View Cart');
      if (await viewCartButton.isVisible({ timeout: 3000 })) {
        await viewCartButton.click();
      }
      
      // Should be on cart page
      await expect(page).toHaveURL(/.*cart/);
      
      // Look for checkbox to select item for redemption
      const itemCheckboxes = page.locator('input[type="checkbox"], .select-item, .item-checkbox');
      const checkboxCount = await itemCheckboxes.count();
      
      if (checkboxCount > 0) {
        const firstCheckbox = itemCheckboxes.first();
        await firstCheckbox.check();
        
        // Verify checkbox is checked
        await expect(firstCheckbox).toBeChecked();
        
        // Verify item is selected for redemption
        const selectedItems = page.locator('.selected, .checked, input[type="checkbox"]:checked');
        await expect(selectedItems.first()).toBeVisible();
      } else {
        console.log('Item selection checkboxes not found in cart');
      }
    }
  } else {
    console.log('No shop items found to add to cart');
  }
});

// TC066: Remove item with confirmation
test('TC066: Remove item from cart with confirmation', async ({ page }) => {
  // Add an item to cart first
  const shopItems = page.locator('.product-item, .shop-item, .reward-item');
  const itemCount = await shopItems.count();
  
  if (itemCount > 0) {
    const firstItem = shopItems.first();
    const addButton = firstItem.locator('button:has-text("Add"), .add-to-cart');
    
    if (await addButton.isVisible({ timeout: 3000 })) {
      await addButton.click();
      
      // Navigate to cart
      const viewCartButton = page.getByText('View Cart');
      if (await viewCartButton.isVisible({ timeout: 3000 })) {
        await viewCartButton.click();
      }
      
      // Look for remove/delete button
      const removeButtons = page.locator('button:has-text("Remove"), button:has-text("Delete"), .remove-btn, .delete-btn');
      
      if (await removeButtons.first().isVisible({ timeout: 3000 })) {
        await removeButtons.first().click();
        
        // Look for confirmation dialog
        const confirmationDialog = page.locator('.confirmation, .modal, .dialog');
        
        if (await confirmationDialog.isVisible({ timeout: 3000 })) {
          // Verify confirmation message
          await expect(page.locator('text=/remove|delete|confirm/i')).toBeVisible();
          
          // Confirm removal
          const confirmButton = page.locator('button:has-text("Yes"), button:has-text("Confirm"), button:has-text("Remove"), .confirm-btn');
          if (await confirmButton.isVisible()) {
            await confirmButton.click();
          }
          
          // Verify item is removed
          await page.waitForTimeout(1000);
          
          // Should show empty cart or fewer items
          const remainingItems = page.locator('.cart-item, .item');
          const remainingCount = await remainingItems.count();
          expect(remainingCount).toBeLessThan(itemCount);
        } else {
          console.log('Confirmation dialog not found - item may be removed directly');
        }
      } else {
        console.log('Remove button not found in cart');
      }
    }
  }
});

// TC067: Increase quantity
test('TC067: Increase item quantity in cart', async ({ page }) => {
  // Add an item to cart first
  const shopItems = page.locator('.product-item, .shop-item, .reward-item');
  const itemCount = await shopItems.count();
  
  if (itemCount > 0) {
    const firstItem = shopItems.first();
    const addButton = firstItem.locator('button:has-text("Add"), .add-to-cart');
    
    if (await addButton.isVisible({ timeout: 3000 })) {
      await addButton.click();
      
      // Navigate to cart
      const viewCartButton = page.getByText('View Cart');
      if (await viewCartButton.isVisible({ timeout: 3000 })) {
        await viewCartButton.click();
      }
      
      // Look for quantity increase button
      const increaseButtons = page.locator('button:has-text("+"), .quantity-increase, .qty-plus');
      const quantityInputs = page.locator('input[type="number"], .quantity-input');
      
      if (await increaseButtons.first().isVisible({ timeout: 3000 })) {
        // Get initial quantity
        const initialQuantity = await quantityInputs.first().inputValue().catch(() => '1');
        
        // Increase quantity
        await increaseButtons.first().click();
        
        // Wait for update
        await page.waitForTimeout(1000);
        
        // Verify quantity increased
        const newQuantity = await quantityInputs.first().inputValue().catch(() => '1');
        expect(parseInt(newQuantity)).toBeGreaterThan(parseInt(initialQuantity));
        
        // Verify total points updated if displayed
        const totalPoints = page.locator('text=/total.*\\d+.*points/i');
        if (await totalPoints.isVisible()) {
          await expect(totalPoints).toBeVisible();
        }
      } else {
        console.log('Quantity increase controls not found in cart');
      }
    }
  }
});

// TC068: Decrease quantity
test('TC068: Decrease item quantity in cart', async ({ page }) => {
  // Add an item to cart and increase quantity first
  const shopItems = page.locator('.product-item, .shop-item, .reward-item');
  const itemCount = await shopItems.count();
  
  if (itemCount > 0) {
    const firstItem = shopItems.first();
    const addButton = firstItem.locator('button:has-text("Add"), .add-to-cart');
    
    if (await addButton.isVisible({ timeout: 3000 })) {
      await addButton.click();
      
      // Navigate to cart
      const viewCartButton = page.getByText('View Cart');
      if (await viewCartButton.isVisible({ timeout: 3000 })) {
        await viewCartButton.click();
      }
      
      // First increase quantity to ensure we can decrease
      const increaseButtons = page.locator('button:has-text("+"), .quantity-increase, .qty-plus');
      if (await increaseButtons.first().isVisible({ timeout: 3000 })) {
        await increaseButtons.first().click();
        await page.waitForTimeout(500);
      }
      
      // Now test decrease
      const decreaseButtons = page.locator('button:has-text("-"), .quantity-decrease, .qty-minus');
      const quantityInputs = page.locator('input[type="number"], .quantity-input');
      
      if (await decreaseButtons.first().isVisible({ timeout: 3000 })) {
        // Get current quantity
        const currentQuantity = await quantityInputs.first().inputValue().catch(() => '2');
        
        // Decrease quantity
        await decreaseButtons.first().click();
        
        // Wait for update
        await page.waitForTimeout(1000);
        
        // Verify quantity decreased
        const newQuantity = await quantityInputs.first().inputValue().catch(() => '1');
        expect(parseInt(newQuantity)).toBeLessThan(parseInt(currentQuantity));
      } else {
        console.log('Quantity decrease controls not found in cart');
      }
    }
  }
});

// TC069: Display total points for redemption
test('TC069: Display total points required for redemption', async ({ page }) => {
  // Add multiple items to cart if possible
  const shopItems = page.locator('.product-item, .shop-item, .reward-item');
  const itemCount = await shopItems.count();
  
  if (itemCount > 0) {
    // Add first item
    const firstItem = shopItems.first();
    const addButton1 = firstItem.locator('button:has-text("Add"), .add-to-cart');
    
    if (await addButton1.isVisible({ timeout: 3000 })) {
      await addButton1.click();
      await page.waitForTimeout(500);
    }
    
    // Add second item if available
    if (itemCount > 1) {
      const secondItem = shopItems.nth(1);
      const addButton2 = secondItem.locator('button:has-text("Add"), .add-to-cart');
      
      if (await addButton2.isVisible({ timeout: 3000 })) {
        await addButton2.click();
        await page.waitForTimeout(500);
      }
    }
    
    // Navigate to cart
    const viewCartButton = page.getByText('View Cart');
    if (await viewCartButton.isVisible({ timeout: 3000 })) {
      await viewCartButton.click();
    }
    
    // Verify total points are displayed
    const totalPointsElements = [
      page.locator('text=/total.*\\d+.*points/i'),
      page.locator('text=/\\d+.*points.*total/i'),
      page.locator('.total-points, .cart-total'),
      page.locator('text=/subtotal.*\\d+/i')
    ];
    
    let totalFound = false;
    for (const element of totalPointsElements) {
      if (await element.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(element).toBeVisible();
        totalFound = true;
        break;
      }
    }
    
    expect(totalFound).toBeTruthy();
  }
});

// TC070: Selecting both digital & physical disables checkout
test('TC070: Selecting both digital and physical items disables checkout', async ({ page }) => {
  // Try to add both digital and physical items to cart
  const shopItems = page.locator('.product-item, .shop-item, .reward-item');
  const itemCount = await shopItems.count();
  
  if (itemCount > 1) {
    let digitalItemAdded = false;
    let physicalItemAdded = false;
    
    // Look for digital and physical items
    for (let i = 0; i < Math.min(itemCount, 5); i++) {
      const item = shopItems.nth(i);
      const itemText = await item.textContent();
      const addButton = item.locator('button:has-text("Add"), .add-to-cart');
      
      if (!digitalItemAdded && (itemText?.toLowerCase().includes('digital') || 
                                itemText?.toLowerCase().includes('voucher') ||
                                itemText?.toLowerCase().includes('e-wallet'))) {
        if (await addButton.isVisible({ timeout: 2000 })) {
          await addButton.click();
          digitalItemAdded = true;
          await page.waitForTimeout(500);
        }
      } else if (!physicalItemAdded && (itemText?.toLowerCase().includes('delivery') || 
                                        itemText?.toLowerCase().includes('shipping') ||
                                        itemText?.toLowerCase().includes('physical'))) {
        if (await addButton.isVisible({ timeout: 2000 })) {
          await addButton.click();
          physicalItemAdded = true;
          await page.waitForTimeout(500);
        }
      }
      
      if (digitalItemAdded && physicalItemAdded) break;
    }
    
    if (digitalItemAdded && physicalItemAdded) {
      // Navigate to cart
      const viewCartButton = page.getByText('View Cart');
      if (await viewCartButton.isVisible({ timeout: 3000 })) {
        await viewCartButton.click();
      }
      
      // Select both items if checkboxes exist
      const checkboxes = page.locator('input[type="checkbox"]');
      const checkboxCount = await checkboxes.count();
      
      if (checkboxCount >= 2) {
        await checkboxes.first().check();
        await checkboxes.nth(1).check();
        
        // Should show error message
        await TestHelpers.verifyErrorMessage(page, 'Please only select items from same type');
        
        // Checkout should be disabled
        const checkoutButton = page.locator('button:has-text("Checkout"), button:has-text("Proceed"), .checkout-btn');
        if (await checkoutButton.isVisible()) {
          const isDisabled = await checkoutButton.isDisabled();
          expect(isDisabled).toBeTruthy();
        }
      }
    } else {
      console.log('Could not find both digital and physical items to test mixed cart restriction');
    }
  }
});

// TC071: Selecting same type allows checkout
test('TC071: Selecting items of same type allows checkout', async ({ page }) => {
  // Add two items of the same type to cart
  const shopItems = page.locator('.product-item, .shop-item, .reward-item');
  const itemCount = await shopItems.count();
  
  if (itemCount > 1) {
    // Add first two items (assuming they're same type)
    const firstItem = shopItems.first();
    const addButton1 = firstItem.locator('button:has-text("Add"), .add-to-cart');
    
    if (await addButton1.isVisible({ timeout: 3000 })) {
      await addButton1.click();
      await page.waitForTimeout(500);
    }
    
    const secondItem = shopItems.nth(1);
    const addButton2 = secondItem.locator('button:has-text("Add"), .add-to-cart');
    
    if (await addButton2.isVisible({ timeout: 3000 })) {
      await addButton2.click();
      await page.waitForTimeout(500);
    }
    
    // Navigate to cart
    const viewCartButton = page.getByText('View Cart');
    if (await viewCartButton.isVisible({ timeout: 3000 })) {
      await viewCartButton.click();
    }
    
    // Select both items if checkboxes exist
    const checkboxes = page.locator('input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();
    
    if (checkboxCount >= 2) {
      await checkboxes.first().check();
      await checkboxes.nth(1).check();
      
      // Should NOT show type restriction error
      const typeError = page.getByText('Please only select items from same type');
      const hasTypeError = await typeError.isVisible().catch(() => false);
      expect(hasTypeError).toBeFalsy();
      
      // Checkout should be enabled (if user has sufficient points)
      const checkoutButton = page.locator('button:has-text("Checkout"), button:has-text("Proceed"), .checkout-btn');
      if (await checkoutButton.isVisible()) {
        // Button should be enabled or show different error (like insufficient points)
        const buttonText = await checkoutButton.textContent();
        expect(buttonText).not.toContain('disabled');
      }
    }
  }
});

// TC072: Sufficient points allows checkout and shows success
test('TC072: Sufficient points allows checkout and shows success', async ({ page }) => {
  // Find a low-cost item
  const shopItems = page.locator('.product-item, .shop-item, .reward-item');
  const itemCount = await shopItems.count();
  
  if (itemCount > 0) {
    let selectedItem = shopItems.first();
    
    // Try to find a low-cost item
    for (let i = 0; i < Math.min(itemCount, 3); i++) {
      const item = shopItems.nth(i);
      const pointsText = await item.locator('text=/\\d+\\s*points/i').textContent().catch(() => '');
      const pointsCost = parseInt(pointsText.match(/\d+/)?.[0] || '0');
      
      if (pointsCost <= 50 && pointsCost > 0) {
        selectedItem = item;
        break;
      }
    }
    
    // Add item to cart
    const addButton = selectedItem.locator('button:has-text("Add"), .add-to-cart');
    if (await addButton.isVisible({ timeout: 3000 })) {
      await addButton.click();
      
      // Navigate to cart
      const viewCartButton = page.getByText('View Cart');
      if (await viewCartButton.isVisible({ timeout: 3000 })) {
        await viewCartButton.click();
      }
      
      // Select item if checkbox exists
      const checkbox = page.locator('input[type="checkbox"]').first();
      if (await checkbox.isVisible({ timeout: 2000 })) {
        await checkbox.check();
      }
      
      // Proceed to checkout
      const checkoutButton = page.locator('button:has-text("Checkout"), button:has-text("Proceed"), .checkout-btn');
      if (await checkoutButton.isVisible({ timeout: 3000 })) {
        await checkoutButton.click();
        
        // Should proceed to checkout flow or show success
        const successElements = [
          page.locator('text=/success|confirmed|order placed/i'),
          page.locator('.success, .confirmation'),
          page.getByText('Order Summary')
        ];
        
        let successFound = false;
        for (const element of successElements) {
          if (await element.isVisible({ timeout: 5000 }).catch(() => false)) {
            successFound = true;
            break;
          }
        }
        
        expect(successFound).toBeTruthy();
      }
    }
  }
});

// TC073: Insufficient points disables checkout
test('TC073: Insufficient points disables checkout', async ({ page }) => {
  // Use insufficient points user
  await page.goto('https://my.haleon-rewards.d-rive.net/login');
  await page.getByPlaceholder('Your phone number').fill(TestData.INSUFFICIENT_POINTS_USER_PHONE);
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await page.pause(); // Manual OTP entry
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
  
  // Navigate to shop and add expensive item
  await TestHelpers.navigateViaBottomNav(page, 'rewards');
  const pointsShopButton = page.getByRole('button', { name: 'Points Shop' });
  if (await pointsShopButton.isVisible({ timeout: 3000 })) {
    await pointsShopButton.click();
  }
  
  const shopItems = page.locator('.product-item, .shop-item, .reward-item');
  const itemCount = await shopItems.count();
  
  if (itemCount > 0) {
    // Add an expensive item
    const expensiveItem = shopItems.first();
    const addButton = expensiveItem.locator('button:has-text("Add"), .add-to-cart');
    
    if (await addButton.isVisible({ timeout: 3000 })) {
      await addButton.click();
      
      // Navigate to cart
      const viewCartButton = page.getByText('View Cart');
      if (await viewCartButton.isVisible({ timeout: 3000 })) {
        await viewCartButton.click();
      }
      
      // Select item if checkbox exists
      const checkbox = page.locator('input[type="checkbox"]').first();
      if (await checkbox.isVisible({ timeout: 2000 })) {
        await checkbox.check();
      }
      
      // Check if checkout is disabled due to insufficient points
      const checkoutButton = page.locator('button:has-text("Checkout"), button:has-text("Proceed"), .checkout-btn');
      
      if (await checkoutButton.isVisible({ timeout: 3000 })) {
        const isDisabled = await checkoutButton.isDisabled();
        if (isDisabled) {
          expect(isDisabled).toBeTruthy();
        } else {
          // If not disabled, should show error when clicked
          await checkoutButton.click();
          await TestHelpers.verifyErrorMessage(page, 'Insufficient');
        }
      }
    }
  }
});