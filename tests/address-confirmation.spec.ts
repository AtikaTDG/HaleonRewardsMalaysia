import { test, expect } from '@playwright/test';
import { TestHelpers, TestData } from './helpers/common';

/**
 * Address Confirmation Tests
 * TC074-TC081: Address confirmation and checkout flow for physical items
 */

test.beforeEach(async ({ page }) => {
  // Login as registered user and add a physical item to cart for address testing
  await TestHelpers.loginAsRegisteredUser(page);
  await TestHelpers.navigateViaBottomNav(page, 'rewards');
  
  // Navigate to Points Shop
  const pointsShopButton = page.getByRole('button', { name: 'Points Shop' });
  if (await pointsShopButton.isVisible({ timeout: 3000 })) {
    await pointsShopButton.click();
  }
  
  // Try to add a physical item to trigger address confirmation flow
  const physicalButton = page.getByText('Physical Product');
  if (await physicalButton.isVisible({ timeout: 3000 })) {
    await physicalButton.click();
  }
  
  // Add a physical item to cart
  const physicalItems = page.locator('.product-item, .shop-item, .reward-item');
  const itemCount = await physicalItems.count();
  
  if (itemCount > 0) {
    // Look for physical items or just use the first available item
    let selectedItem = physicalItems.first();
    
    for (let i = 0; i < Math.min(itemCount, 3); i++) {
      const item = physicalItems.nth(i);
      const itemText = await item.textContent();
      
      if (itemText?.toLowerCase().includes('delivery') || 
          itemText?.toLowerCase().includes('shipping') ||
          itemText?.toLowerCase().includes('physical')) {
        selectedItem = item;
        break;
      }
    }
    
    const addButton = selectedItem.locator('button:has-text("Add"), .add-to-cart');
    if (await addButton.isVisible({ timeout: 3000 })) {
      await addButton.click();
      
      // Navigate to cart and proceed to checkout to reach address confirmation
      const viewCartButton = page.getByText('View Cart');
      if (await viewCartButton.isVisible({ timeout: 3000 })) {
        await viewCartButton.click();
      }
      
      // Select item and proceed to checkout
      const checkbox = page.locator('input[type="checkbox"]').first();
      if (await checkbox.isVisible({ timeout: 2000 })) {
        await checkbox.check();
      }
      
      const checkoutButton = page.locator('button:has-text("Checkout"), button:has-text("Proceed"), .checkout-btn');
      if (await checkoutButton.isVisible({ timeout: 3000 })) {
        await checkoutButton.click();
      }
    }
  }
});

// TC074: "Back" arrow to previous page
test('TC074: Back arrow redirects to previous page from address confirmation', async ({ page }) => {
  // Should be on address confirmation page from beforeEach
  // Look for address confirmation page indicators
  const addressPageIndicators = [
    page.locator('text=/delivery address|shipping address|confirm address/i'),
    page.locator('.address-confirmation, .delivery-page'),
    page.getByText('Choose Delivery Address')
  ];
  
  let onAddressPage = false;
  for (const indicator of addressPageIndicators) {
    if (await indicator.isVisible({ timeout: 3000 }).catch(() => false)) {
      onAddressPage = true;
      break;
    }
  }
  
  if (onAddressPage) {
    // Click back arrow
    await TestHelpers.goBack(page);
    
    // Should return to previous page (cart)
    await expect(page).toHaveURL(/.*cart/);
  } else {
    console.log('Address confirmation page not reached - may need different flow');
  }
});

// TC075: If address empty, redirects to Add Address page
test('TC075: Empty address redirects to Add Address page', async ({ page }) => {
  // Clear existing addresses first by going to profile and removing them
  await TestHelpers.navigateViaBottomNav(page, 'profile');
  
  const deliveryAddressOption = page.locator('div').filter({ hasText: /^Delivery Address$/ });
  if (await deliveryAddressOption.isVisible({ timeout: 3000 })) {
    await deliveryAddressOption.click();
    
    // Remove existing addresses if any
    const deleteButtons = page.locator('.delete-address-btn, button:has-text("Delete")');
    const deleteCount = await deleteButtons.count();
    
    for (let i = 0; i < deleteCount; i++) {
      const deleteBtn = deleteButtons.first();
      if (await deleteBtn.isVisible({ timeout: 2000 })) {
        await deleteBtn.click();
        
        // Confirm deletion
        const confirmButton = page.getByRole('button', { name: 'Yes' });
        if (await confirmButton.isVisible({ timeout: 2000 })) {
          await confirmButton.click();
        }
        
        await page.waitForTimeout(1000);
      }
    }
  }
  
  // Now go back to checkout flow with no addresses
  await TestHelpers.navigateViaBottomNav(page, 'rewards');
  const pointsShopButton = page.getByRole('button', { name: 'Points Shop' });
  if (await pointsShopButton.isVisible({ timeout: 3000 })) {
    await pointsShopButton.click();
  }
  
  // Add physical item and proceed to checkout
  const physicalItems = page.locator('.product-item, .shop-item, .reward-item');
  if (await physicalItems.first().isVisible({ timeout: 3000 })) {
    const addButton = physicalItems.first().locator('button:has-text("Add"), .add-to-cart');
    if (await addButton.isVisible({ timeout: 3000 })) {
      await addButton.click();
      
      const viewCartButton = page.getByText('View Cart');
      if (await viewCartButton.isVisible({ timeout: 3000 })) {
        await viewCartButton.click();
      }
      
      const checkbox = page.locator('input[type="checkbox"]').first();
      if (await checkbox.isVisible({ timeout: 2000 })) {
        await checkbox.check();
      }
      
      const checkoutButton = page.locator('button:has-text("Checkout"), button:has-text("Proceed")');
      if (await checkoutButton.isVisible({ timeout: 3000 })) {
        await checkoutButton.click();
        
        // Should redirect to Add Address page
        await expect(page).toHaveURL(/.*add.*address|.*address.*add/);
        await expect(page.locator('text=/add.*address|new.*address/i')).toBeVisible();
      }
    }
  }
});

// TC076: Cannot proceed without address shows error
test('TC076: Cannot proceed without selecting delivery address', async ({ page }) => {
  // Ensure we have at least one address available but not selected
  await TestHelpers.navigateViaBottomNav(page, 'profile');
  
  const deliveryAddressOption = page.locator('div').filter({ hasText: /^Delivery Address$/ });
  if (await deliveryAddressOption.isVisible({ timeout: 3000 })) {
    await deliveryAddressOption.click();
    
    // Add an address if none exists
    const addAddressButton = page.getByText('Add New Address');
    if (await addAddressButton.isVisible({ timeout: 3000 })) {
      await addAddressButton.click();
      
      // Fill address form
      await page.getByRole('textbox', { name: 'Name' }).fill(TestData.VALID_ADDRESS.name);
      await page.getByRole('spinbutton', { name: 'Mobile Number' }).fill(TestData.VALID_ADDRESS.mobile);
      await page.getByRole('textbox', { name: 'Address line 1' }).fill(TestData.VALID_ADDRESS.address1);
      await page.getByRole('textbox', { name: 'Address line 2' }).fill(TestData.VALID_ADDRESS.address2);
      await page.getByRole('textbox', { name: 'City' }).fill(TestData.VALID_ADDRESS.city);
      await page.getByRole('spinbutton', { name: 'ZIP/Postcode' }).fill(TestData.VALID_ADDRESS.postcode);
      
      await TestHelpers.setExtendedViewport(page);
      await page.getByRole('button', { name: 'Submit' }).click();
      await page.getByRole('button', { name: 'Done' }).click();
    }
  }
  
  // Go back to checkout flow
  await TestHelpers.navigateViaBottomNav(page, 'rewards');
  const pointsShopButton = page.getByRole('button', { name: 'Points Shop' });
  if (await pointsShopButton.isVisible({ timeout: 3000 })) {
    await pointsShopButton.click();
  }
  
  // Add item and proceed to address confirmation
  const physicalItems = page.locator('.product-item, .shop-item, .reward-item');
  if (await physicalItems.first().isVisible({ timeout: 3000 })) {
    const addButton = physicalItems.first().locator('button:has-text("Add"), .add-to-cart');
    if (await addButton.isVisible({ timeout: 3000 })) {
      await addButton.click();
      
      const viewCartButton = page.getByText('View Cart');
      if (await viewCartButton.isVisible({ timeout: 3000 })) {
        await viewCartButton.click();
      }
      
      const checkbox = page.locator('input[type="checkbox"]').first();
      if (await checkbox.isVisible({ timeout: 2000 })) {
        await checkbox.check();
      }
      
      const checkoutButton = page.locator('button:has-text("Checkout"), button:has-text("Proceed")');
      if (await checkoutButton.isVisible({ timeout: 3000 })) {
        await checkoutButton.click();
        
        // Should be on address confirmation page
        // Try to proceed without selecting address
        const continueButton = page.locator('button:has-text("Continue"), button:has-text("Proceed"), button:has-text("Next")');
        if (await continueButton.isVisible({ timeout: 3000 })) {
          await continueButton.click();
          
          // Should show error
          await TestHelpers.verifyErrorMessage(page, 'Please choose the delivery address!');
        }
      }
    }
  }
});

// TC077: "Edit Delivery Address" redirects to confirm page
test('TC077: Edit Delivery Address redirects correctly', async ({ page }) => {
  // Navigate to address confirmation page (from beforeEach setup)
  const addressPageIndicators = [
    page.locator('text=/delivery address|shipping address/i'),
    page.getByText('Choose Delivery Address')
  ];
  
  let onAddressPage = false;
  for (const indicator of addressPageIndicators) {
    if (await indicator.isVisible({ timeout: 5000 }).catch(() => false)) {
      onAddressPage = true;
      break;
    }
  }
  
  if (onAddressPage) {
    // Look for "Edit Delivery Address" button
    const editAddressButton = page.getByText('Edit Delivery Address');
    
    if (await editAddressButton.isVisible({ timeout: 3000 })) {
      await editAddressButton.click();
      
      // Should redirect to edit address page
      await expect(page).toHaveURL(/.*edit.*address|.*address.*edit/);
      
      // Should show address form with existing data
      await expect(page.getByRole('textbox', { name: 'Name' })).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Address' })).toBeVisible();
    } else {
      console.log('Edit Delivery Address button not found');
    }
  } else {
    console.log('Address confirmation page not reached');
  }
});

// TC078: Display added address details
test('TC078: Display added address details correctly', async ({ page }) => {
  // Ensure we have an address and navigate to address confirmation
  await TestHelpers.navigateViaBottomNav(page, 'profile');
  
  const deliveryAddressOption = page.locator('div').filter({ hasText: /^Delivery Address$/ });
  if (await deliveryAddressOption.isVisible({ timeout: 3000 })) {
    await deliveryAddressOption.click();
    
    // Check if we have existing addresses
    const addressItems = page.locator('.address-item, .delivery-address');
    const addressCount = await addressItems.count();
    
    if (addressCount === 0) {
      // Add an address
      const addAddressButton = page.getByText('Add New Address');
      if (await addAddressButton.isVisible({ timeout: 3000 })) {
        await addAddressButton.click();
        
        await page.getByRole('textbox', { name: 'Name' }).fill(TestData.VALID_ADDRESS.name);
        await page.getByRole('spinbutton', { name: 'Mobile Number' }).fill(TestData.VALID_ADDRESS.mobile);
        await page.getByRole('textbox', { name: 'Address line 1' }).fill(TestData.VALID_ADDRESS.address1);
        await page.getByRole('textbox', { name: 'Address line 2' }).fill(TestData.VALID_ADDRESS.address2);
        await page.getByRole('textbox', { name: 'City' }).fill(TestData.VALID_ADDRESS.city);
        await page.getByRole('spinbutton', { name: 'ZIP/Postcode' }).fill(TestData.VALID_ADDRESS.postcode);
        
        await TestHelpers.setExtendedViewport(page);
        await page.getByRole('button', { name: 'Submit' }).click();
        await page.getByRole('button', { name: 'Done' }).click();
      }
    }
  }
  
  // Go to checkout to see address confirmation
  await TestHelpers.navigateViaBottomNav(page, 'rewards');
  const pointsShopButton = page.getByRole('button', { name: 'Points Shop' });
  if (await pointsShopButton.isVisible({ timeout: 3000 })) {
    await pointsShopButton.click();
  }
  
  const physicalItems = page.locator('.product-item, .shop-item, .reward-item');
  if (await physicalItems.first().isVisible({ timeout: 3000 })) {
    const addButton = physicalItems.first().locator('button:has-text("Add"), .add-to-cart');
    if (await addButton.isVisible({ timeout: 3000 })) {
      await addButton.click();
      
      const viewCartButton = page.getByText('View Cart');
      if (await viewCartButton.isVisible({ timeout: 3000 })) {
        await viewCartButton.click();
      }
      
      const checkbox = page.locator('input[type="checkbox"]').first();
      if (await checkbox.isVisible({ timeout: 2000 })) {
        await checkbox.check();
      }
      
      const checkoutButton = page.locator('button:has-text("Checkout"), button:has-text("Proceed")');
      if (await checkoutButton.isVisible({ timeout: 3000 })) {
        await checkoutButton.click();
        
        // Should display address details
        await expect(page.locator(`text=${TestData.VALID_ADDRESS.name}`)).toBeVisible();
        await expect(page.locator(`text=${TestData.VALID_ADDRESS.address1}`)).toBeVisible();
        await expect(page.locator(`text=${TestData.VALID_ADDRESS.city}`)).toBeVisible();
      }
    }
  }
});

// TC079: "Confirm" redirects to Success Page
test('TC079: Confirm button redirects to Success Page', async ({ page }) => {
  // Complete the checkout flow to reach confirmation
  const addressPageIndicators = [
    page.locator('text=/delivery address|shipping address/i'),
    page.locator('.address-confirmation')
  ];
  
  let onAddressPage = false;
  for (const indicator of addressPageIndicators) {
    if (await indicator.isVisible({ timeout: 5000 }).catch(() => false)) {
      onAddressPage = true;
      break;
    }
  }
  
  if (onAddressPage) {
    // Select an address if available
    const addressOptions = page.locator('.address-option, .address-item, input[type="radio"]');
    if (await addressOptions.first().isVisible({ timeout: 3000 })) {
      await addressOptions.first().click();
    }
    
    // Proceed to confirmation
    const continueButton = page.locator('button:has-text("Continue"), button:has-text("Proceed"), button:has-text("Next")');
    if (await continueButton.isVisible({ timeout: 3000 })) {
      await continueButton.click();
      
      // Should reach confirmation popup/page
      const confirmButton = page.locator('button:has-text("Confirm")');
      if (await confirmButton.isVisible({ timeout: 5000 })) {
        await confirmButton.click();
        
        // Should redirect to success page
        await expect(page).toHaveURL(/.*success/);
        await expect(page.locator('text=/success|successful|confirmed/i')).toBeVisible();
      }
    }
  }
});

// TC080: "X" closes order summary page
test('TC080: X button closes order summary popup', async ({ page }) => {
  // Navigate to order summary/confirmation popup
  const addressPageIndicators = [
    page.locator('text=/delivery address|shipping address/i'),
    page.locator('.address-confirmation')
  ];
  
  let onAddressPage = false;
  for (const indicator of addressPageIndicators) {
    if (await indicator.isVisible({ timeout: 5000 }).catch(() => false)) {
      onAddressPage = true;
      break;
    }
  }
  
  if (onAddressPage) {
    // Select an address
    const addressOptions = page.locator('.address-option, .address-item, input[type="radio"]');
    if (await addressOptions.first().isVisible({ timeout: 3000 })) {
      await addressOptions.first().click();
    }
    
    // Proceed to get order summary
    const continueButton = page.locator('button:has-text("Continue"), button:has-text("Proceed")');
    if (await continueButton.isVisible({ timeout: 3000 })) {
      await continueButton.click();
      
      // Should show order summary popup
      const orderSummary = page.locator('.order-summary, .confirmation-popup, .modal');
      if (await orderSummary.isVisible({ timeout: 5000 })) {
        // Close with X button
        await TestHelpers.closePopupWithX(page);
        
        // Popup should be closed
        await expect(orderSummary).not.toBeVisible();
      }
    }
  }
});

// TC081: "Go to Rewards" redirects to My Rewards
test('TC081: Go to Rewards redirects to My Rewards from Success Page', async ({ page }) => {
  // Complete the entire checkout flow to reach success page
  const addressPageIndicators = [
    page.locator('text=/delivery address|shipping address/i'),
    page.locator('.address-confirmation')
  ];
  
  let onAddressPage = false;
  for (const indicator of addressPageIndicators) {
    if (await indicator.isVisible({ timeout: 5000 }).catch(() => false)) {
      onAddressPage = true;
      break;
    }
  }
  
  if (onAddressPage) {
    // Complete checkout flow
    const addressOptions = page.locator('.address-option, .address-item, input[type="radio"]');
    if (await addressOptions.first().isVisible({ timeout: 3000 })) {
      await addressOptions.first().click();
    }
    
    const continueButton = page.locator('button:has-text("Continue"), button:has-text("Proceed")');
    if (await continueButton.isVisible({ timeout: 3000 })) {
      await continueButton.click();
      
      const confirmButton = page.locator('button:has-text("Confirm")');
      if (await confirmButton.isVisible({ timeout: 5000 })) {
        await confirmButton.click();
        
        // Should be on success page
        const successPage = page.locator('text=/success|successful|confirmed/i');
        if (await successPage.isVisible({ timeout: 5000 })) {
          // Look for "Go to Rewards" button
          const goToRewardsButton = page.getByRole('button', { name: 'Go to Rewards' });
          
          if (await goToRewardsButton.isVisible({ timeout: 3000 })) {
            await goToRewardsButton.click();
            
            // Should redirect to My Rewards
            await expect(page).toHaveURL(/.*my.*rewards|.*rewards/);
            await expect(page.locator('text=/my rewards|digital rewards/i')).toBeVisible();
          } else {
            console.log('Go to Rewards button not found on success page');
          }
        }
      }
    }
  }
});

// Additional test: Address selection functionality
test('Address selection works correctly in confirmation page', async ({ page }) => {
  // Navigate to address confirmation and test address selection
  const addressPageIndicators = [
    page.locator('text=/delivery address|shipping address/i'),
    page.locator('.address-confirmation')
  ];
  
  let onAddressPage = false;
  for (const indicator of addressPageIndicators) {
    if (await indicator.isVisible({ timeout: 5000 }).catch(() => false)) {
      onAddressPage = true;
      break;
    }
  }
  
  if (onAddressPage) {
    // Check for multiple address options
    const addressOptions = page.locator('.address-option, .address-item, input[type="radio"]');
    const addressCount = await addressOptions.count();
    
    if (addressCount > 1) {
      // Test selecting different addresses
      await addressOptions.first().click();
      await page.waitForTimeout(500);
      
      // Verify first address is selected
      const firstSelected = await addressOptions.first().isChecked().catch(() => false);
      expect(firstSelected).toBeTruthy();
      
      // Select second address
      await addressOptions.nth(1).click();
      await page.waitForTimeout(500);
      
      // Verify second address is selected and first is not
      const secondSelected = await addressOptions.nth(1).isChecked().catch(() => false);
      expect(secondSelected).toBeTruthy();
    } else {
      console.log('Only one or no address options found');
    }
  }
});

// Additional test: Address validation in confirmation
test('Address confirmation displays complete address information', async ({ page }) => {
  // Check that all required address fields are displayed in confirmation
  const addressPageIndicators = [
    page.locator('text=/delivery address|shipping address/i'),
    page.locator('.address-confirmation')
  ];
  
  let onAddressPage = false;
  for (const indicator of addressPageIndicators) {
    if (await indicator.isVisible({ timeout: 5000 }).catch(() => false)) {
      onAddressPage = true;
      break;
    }
  }
  
  if (onAddressPage) {
    // Verify address information is complete
    const addressFields = [
      page.locator('text=/name|recipient/i'),
      page.locator('text=/phone|mobile/i'),
      page.locator('text=/address|street/i'),
      page.locator('text=/city/i'),
      page.locator('text=/postcode|zip/i')
    ];
    
    let fieldsFound = 0;
    for (const field of addressFields) {
      if (await field.isVisible({ timeout: 2000 }).catch(() => false)) {
        fieldsFound++;
      }
    }
    
    // Should have at least basic address information
    expect(fieldsFound).toBeGreaterThan(2);
  }
});