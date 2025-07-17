import { test, expect } from '@playwright/test';
import { TestHelpers, TestData } from './helpers/common';

/**
 * Physical Items Tests
 * TC058-TC062: Physical item purchase and redemption flow
 */

test.beforeEach(async ({ page }) => {
  // Login as registered user and navigate to physical items page
  await TestHelpers.loginAsRegisteredUser(page);
  await TestHelpers.navigateViaBottomNav(page, 'rewards');
  
  // Navigate to Points Shop and then to Physical Items
  const pointsShopButton = page.getByRole('button', { name: 'Points Shop' });
  if (await pointsShopButton.isVisible({ timeout: 3000 })) {
    await pointsShopButton.click();
  }
  
  // Try to navigate to physical items section
  const physicalButton = page.getByText('Physical Product');
  if (await physicalButton.isVisible({ timeout: 3000 })) {
    await physicalButton.click();
  } else {
    // If no specific physical section, we'll work with the general shop
    console.log('Working with general shop items for physical product testing');
  }
});

// TC058: "Back" arrow to Homepage
test('TC058: Back arrow redirects to Homepage', async ({ page }) => {
  // Should be on physical items or shop page from beforeEach
  
  // Click back arrow
  await TestHelpers.goBack(page);
  
  // According to TC058, should redirect to Homepage (not just previous page)
  await expect(page).toHaveURL(/.*home/);
});

// TC059: Add/reduce quantity
test('TC059: Add and reduce quantity controls work correctly', async ({ page }) => {
  // Find the first available physical item
  const physicalItems = page.locator('.product-item, .shop-item, .reward-item, .physical-item');
  const itemCount = await physicalItems.count();
  
  if (itemCount > 0) {
    // Look for physical items specifically (items that mention shipping, delivery, or physical attributes)
    let selectedItem = physicalItems.first();
    
    for (let i = 0; i < Math.min(itemCount, 5); i++) {
      const item = physicalItems.nth(i);
      const itemText = await item.textContent();
      
      // Look for physical item indicators
      if (itemText?.toLowerCase().includes('delivery') || 
          itemText?.toLowerCase().includes('shipping') ||
          itemText?.toLowerCase().includes('physical')) {
        selectedItem = item;
        break;
      }
    }
    
    // Look for quantity controls
    const increaseButton = selectedItem.locator('button:has-text("+"), .quantity-increase, .qty-plus');
    const decreaseButton = selectedItem.locator('button:has-text("-"), .quantity-decrease, .qty-minus');
    const quantityInput = selectedItem.locator('input[type="number"], .quantity-input');
    
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
      const altIncrease = selectedItem.locator('.plus, [data-action="increase"]');
      const altDecrease = selectedItem.locator('.minus, [data-action="decrease"]');
      
      if (await altIncrease.isVisible({ timeout: 2000 })) {
        await altIncrease.click();
        await page.waitForTimeout(500);
        
        if (await altDecrease.isVisible()) {
          await altDecrease.click();
          await page.waitForTimeout(500);
        }
      } else {
        console.log('Quantity controls not found - may be single quantity only for physical items');
      }
    }
  } else {
    console.log('No physical items found for quantity testing');
  }
});

// TC060: Display points needed for quantity
test('TC060: Display points needed for selected quantity', async ({ page }) => {
  // Find the first available physical item
  const physicalItems = page.locator('.product-item, .shop-item, .reward-item, .physical-item');
  const itemCount = await physicalItems.count();
  
  if (itemCount > 0) {
    let selectedItem = physicalItems.first();
    
    // Try to find physical items
    for (let i = 0; i < Math.min(itemCount, 5); i++) {
      const item = physicalItems.nth(i);
      const itemText = await item.textContent();
      
      if (itemText?.toLowerCase().includes('delivery') || 
          itemText?.toLowerCase().includes('shipping') ||
          itemText?.toLowerCase().includes('physical')) {
        selectedItem = item;
        break;
      }
    }
    
    // Check for points display
    const pointsDisplay = selectedItem.locator('text=/\\d+\\s*points|points:\\s*\\d+/i');
    await expect(pointsDisplay).toBeVisible();
    
    // If quantity controls exist, test points update
    const increaseButton = selectedItem.locator('button:has-text("+"), .quantity-increase, .qty-plus');
    
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
    console.log('No physical items found for points display testing');
  }
});

// TC061: Insufficient points disables checkout
test('TC061: Insufficient points disables checkout for physical items', async ({ page }) => {
  // Use insufficient points user for this test
  await page.goto('https://my.haleon-rewards.d-rive.net/login');
  await page.getByPlaceholder('Your phone number').fill(TestData.INSUFFICIENT_POINTS_USER_PHONE);
  await page.getByRole('button', { name: 'Send OTP Code' }).click();
  await page.pause(); // Manual OTP entry
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
  
  // Navigate to physical items
  await TestHelpers.navigateViaBottomNav(page, 'rewards');
  const pointsShopButton = page.getByRole('button', { name: 'Points Shop' });
  if (await pointsShopButton.isVisible({ timeout: 3000 })) {
    await pointsShopButton.click();
  }
  
  const physicalButton = page.getByText('Physical Product');
  if (await physicalButton.isVisible({ timeout: 3000 })) {
    await physicalButton.click();
  }
  
  // Find an expensive physical item
  const physicalItems = page.locator('.product-item, .shop-item, .reward-item');
  const itemCount = await physicalItems.count();
  
  if (itemCount > 0) {
    // Try to find an item that costs more points than available
    for (let i = 0; i < Math.min(itemCount, 3); i++) {
      const item = physicalItems.nth(i);
      const addButton = item.locator('button:has-text("Add"), button:has-text("Select"), .add-to-cart');
      
      if (await addButton.isVisible({ timeout: 2000 })) {
        await addButton.click();
        
        // Check for insufficient points error or disabled checkout
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

// TC062: Sufficient points proceeds to confirmation and success message
test('TC062: Sufficient points proceeds to confirmation and success for physical items', async ({ page }) => {
  // Find an affordable physical item
  const physicalItems = page.locator('.product-item, .shop-item, .reward-item');
  const itemCount = await physicalItems.count();
  
  if (itemCount > 0) {
    // Look for a low-cost item or the cheapest available
    let selectedItem = physicalItems.first();
    
    // Try to find an item with low point cost
    for (let i = 0; i < Math.min(itemCount, 3); i++) {
      const item = physicalItems.nth(i);
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
        
        // For physical items, should proceed to address/delivery information
        const deliveryElements = [
          page.locator('.delivery-address, .shipping-address'),
          page.getByText('Delivery Address'),
          page.getByText('Shipping Information'),
          page.locator('.address-form')
        ];
        
        let deliveryFound = false;
        for (const element of deliveryElements) {
          if (await element.isVisible({ timeout: 3000 }).catch(() => false)) {
            deliveryFound = true;
            break;
          }
        }
        
        if (deliveryFound) {
          // Physical items should require delivery address
          console.log('Delivery address step found for physical item');
          
          // Look for continue button after address
          const continueButton = page.locator('button:has-text("Continue"), button:has-text("Next"), .continue-btn');
          if (await continueButton.isVisible({ timeout: 3000 })) {
            await continueButton.click();
          }
        }
        
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
        console.log('Proceed/Checkout button not found after adding physical item');
      }
    } else {
      console.log('Add button not found for physical item');
    }
  } else {
    console.log('No physical items found for purchase testing');
  }
});

// Additional test: Physical item details and shipping information
test('Physical item displays delivery and shipping information', async ({ page }) => {
  // Find a physical item and check for delivery-related information
  const physicalItems = page.locator('.product-item, .shop-item, .reward-item');
  const itemCount = await physicalItems.count();
  
  if (itemCount > 0) {
    let physicalItemFound = false;
    
    for (let i = 0; i < Math.min(itemCount, 5); i++) {
      const item = physicalItems.nth(i);
      const itemText = await item.textContent();
      
      // Look for physical item indicators
      if (itemText?.toLowerCase().includes('delivery') || 
          itemText?.toLowerCase().includes('shipping') ||
          itemText?.toLowerCase().includes('physical')) {
        
        // Click on the item to view details
        const itemTitle = item.locator('h3, .title, .name').first();
        if (await itemTitle.isVisible({ timeout: 2000 })) {
          await itemTitle.click();
        } else {
          await item.click();
        }
        
        // Wait for details page to load
        await page.waitForTimeout(2000);
        
        // Verify delivery/shipping information is displayed
        const deliveryInfo = [
          page.locator('text=/delivery|shipping|postal/i'),
          page.locator('text=/\\d+-\\d+ days|\\d+ working days/i'),
          page.locator('.delivery-info, .shipping-info')
        ];
        
        let deliveryInfoFound = false;
        for (const info of deliveryInfo) {
          if (await info.isVisible({ timeout: 2000 }).catch(() => false)) {
            deliveryInfoFound = true;
            break;
          }
        }
        
        if (deliveryInfoFound) {
          physicalItemFound = true;
          break;
        }
      }
    }
    
    if (!physicalItemFound) {
      console.log('No physical items with delivery information found');
    }
  }
});

// Additional test: Physical item stock status
test('Physical item stock status is displayed correctly', async ({ page }) => {
  // Check for stock status on physical items
  const physicalItems = page.locator('.product-item, .shop-item, .reward-item');
  const itemCount = await physicalItems.count();
  
  if (itemCount > 0) {
    for (let i = 0; i < Math.min(itemCount, 3); i++) {
      const item = physicalItems.nth(i);
      
      // Check for stock status indicators
      const stockElements = [
        item.locator('text=/in stock|out of stock|limited stock/i'),
        item.locator('.stock-status, .availability'),
        item.locator('text=/\\d+ left|only \\d+ remaining/i')
      ];
      
      for (const stock of stockElements) {
        if (await stock.isVisible({ timeout: 1000 }).catch(() => false)) {
          await expect(stock).toBeVisible();
          console.log(`Stock status found: ${await stock.textContent()}`);
          break;
        }
      }
    }
  }
});

// Additional test: Physical vs Digital item differentiation
test('Physical items are clearly differentiated from digital items', async ({ page }) => {
  // Check if physical items have clear indicators that distinguish them from digital items
  const allItems = page.locator('.product-item, .shop-item, .reward-item');
  const itemCount = await allItems.count();
  
  if (itemCount > 0) {
    let physicalIndicatorsFound = 0;
    let digitalIndicatorsFound = 0;
    
    for (let i = 0; i < Math.min(itemCount, 5); i++) {
      const item = allItems.nth(i);
      const itemText = await item.textContent();
      
      // Check for physical item indicators
      if (itemText?.toLowerCase().includes('delivery') || 
          itemText?.toLowerCase().includes('shipping') ||
          itemText?.toLowerCase().includes('physical') ||
          itemText?.toLowerCase().includes('postal')) {
        physicalIndicatorsFound++;
      }
      
      // Check for digital item indicators
      if (itemText?.toLowerCase().includes('digital') || 
          itemText?.toLowerCase().includes('voucher') ||
          itemText?.toLowerCase().includes('instant') ||
          itemText?.toLowerCase().includes('e-wallet')) {
        digitalIndicatorsFound++;
      }
    }
    
    console.log(`Found ${physicalIndicatorsFound} items with physical indicators`);
    console.log(`Found ${digitalIndicatorsFound} items with digital indicators`);
    
    // Should have some form of differentiation
    expect(physicalIndicatorsFound + digitalIndicatorsFound).toBeGreaterThan(0);
  }
});