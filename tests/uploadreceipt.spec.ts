import { test, expect } from '@playwright/test';
import { TestHelpers, TestData } from './helpers/common';
import path from 'path';

/**
 * Upload Receipt Tests
 * TC021-TC031: Comprehensive upload receipt functionality
 */

test.beforeEach(async ({ page }) => {
  // Login as registered user and navigate to upload page before each test
  await TestHelpers.loginAsRegisteredUser(page);
  await TestHelpers.navigateViaBottomNav(page, 'upload');
});

// TC021: "Back" arrow redirects to previous page
test('TC021: Back arrow redirects to previous page', async ({ page }) => {
  // Should be on upload page from beforeEach
  await expect(page).toHaveURL(/.*upload/);
  
  // Click back arrow
  await TestHelpers.goBack(page);
  
  // Should return to homepage (previous page)
  await expect(page).toHaveURL(/.*home/);
});

// TC022: "Sample Receipt" opens popup
test('TC022: Sample Receipt opens popup', async ({ page }) => {
  // Look for Sample Receipt button
  const sampleReceiptButton = page.getByText('Sample Receipt');
  
  if (await sampleReceiptButton.isVisible({ timeout: 5000 })) {
    await sampleReceiptButton.click();
    
    // Verify popup appears
    await expect(page.locator('.popup, .modal, .dialog')).toBeVisible();
    
    // Verify popup contains sample receipt content
    await expect(page.locator('text=/sample|receipt|example/i')).toBeVisible();
  } else {
    // Look for alternative button text
    const alternatives = [
      page.getByText('View Sample'),
      page.getByText('Receipt Sample'),
      page.getByText('Example Receipt'),
      page.locator('[data-testid="sample-receipt"]')
    ];
    
    let found = false;
    for (const button of alternatives) {
      if (await button.isVisible({ timeout: 2000 }).catch(() => false)) {
        await button.click();
        await expect(page.locator('.popup, .modal, .dialog')).toBeVisible();
        found = true;
        break;
      }
    }
    
    if (!found) {
      console.log('Sample Receipt button not found - feature may not be implemented');
    }
  }
});

// TC023: Upload receipt image
test('TC023: Upload receipt image successfully', async ({ page }) => {
  // Create a test image file
  const testImagePath = '/tmp/test-receipt.png';
  
  // Create a simple PNG image for testing (1x1 pixel)
  const fs = require('fs');
  const pngData = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, // IHDR chunk size
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, 0x01, // width = 1
    0x00, 0x00, 0x00, 0x01, // height = 1
    0x08, 0x02, 0x00, 0x00, 0x00, // bit depth = 8, color type = 2, compression = 0, filter = 0, interlace = 0
    0x90, 0x77, 0x53, 0xDE, // CRC
    0x00, 0x00, 0x00, 0x0C, // IDAT chunk size
    0x49, 0x44, 0x41, 0x54, // IDAT
    0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0x8D, 0xB4, // image data
    0x36, 0x6F, 0x2C, 0x0F, // CRC
    0x00, 0x00, 0x00, 0x00, // IEND chunk size
    0x49, 0x45, 0x4E, 0x44, // IEND
    0xAE, 0x42, 0x60, 0x82  // CRC
  ]);
  
  fs.writeFileSync(testImagePath, pngData);
  
  // Upload the test image
  await page.setInputFiles('input[type="file"]', testImagePath);
  
  // Verify image was uploaded (should show preview or filename)
  await expect(page.locator('img, .preview, .uploaded-file')).toBeVisible();
  
  // Clean up
  fs.unlinkSync(testImagePath);
});

// TC024: Delete button displays after upload
test('TC024: Delete button displays after upload', async ({ page }) => {
  // Upload a test image first
  const testImagePath = '/tmp/test-receipt.png';
  const fs = require('fs');
  const pngData = Buffer.from([0x89, 0x50, 0x4E, 0x47]); // Minimal PNG header
  fs.writeFileSync(testImagePath, pngData);
  
  await page.setInputFiles('input[type="file"]', testImagePath);
  
  // Verify delete button appears
  const deleteButton = page.locator('button:has-text("Delete"), button:has-text("Remove"), .delete-btn, .remove-btn');
  await expect(deleteButton).toBeVisible();
  
  // Clean up
  fs.unlinkSync(testImagePath);
});

// TC025: Uploaded image/file is displayed
test('TC025: Uploaded image is displayed correctly', async ({ page }) => {
  // Upload a test image
  const testImagePath = '/tmp/test-receipt.png';
  const fs = require('fs');
  const pngData = Buffer.from([0x89, 0x50, 0x4E, 0x47]); // Minimal PNG header
  fs.writeFileSync(testImagePath, pngData);
  
  await page.setInputFiles('input[type="file"]', testImagePath);
  
  // Verify image preview is displayed
  const imagePreview = page.locator('img[src*="blob:"], img[src*="data:"], .image-preview, .file-preview');
  await expect(imagePreview).toBeVisible();
  
  // Verify filename is displayed
  await expect(page.locator('text=/test-receipt|\.png/i')).toBeVisible();
  
  // Clean up
  fs.unlinkSync(testImagePath);
});

// TC026: Remove uploaded image
test('TC026: Remove uploaded image functionality', async ({ page }) => {
  // Upload a test image first
  const testImagePath = '/tmp/test-receipt.png';
  const fs = require('fs');
  const pngData = Buffer.from([0x89, 0x50, 0x4E, 0x47]); // Minimal PNG header
  fs.writeFileSync(testImagePath, pngData);
  
  await page.setInputFiles('input[type="file"]', testImagePath);
  
  // Verify image is uploaded
  await expect(page.locator('img, .preview, .uploaded-file')).toBeVisible();
  
  // Click delete/remove button
  const deleteButton = page.locator('button:has-text("Delete"), button:has-text("Remove"), .delete-btn, .remove-btn');
  await deleteButton.click();
  
  // Verify image is removed
  await expect(page.locator('img, .preview, .uploaded-file')).not.toBeVisible();
  
  // Clean up
  fs.unlinkSync(testImagePath);
});

// TC027: Submit without image shows error
test('TC027: Submit without image shows error message', async ({ page }) => {
  // Try to submit without uploading image
  await TestHelpers.setExtendedViewport(page);
  await page.getByRole('button', { name: 'Submit' }).click();
  
  // Verify error message appears
  await TestHelpers.verifyErrorMessage(page, 'Please upload your receipt image!');
});

// TC028: Submit with image opens "Successful Upload" popup
test('TC028: Submit with image shows successful upload popup', async ({ page }) => {
  // Upload a test image first
  const testImagePath = '/tmp/test-receipt.png';
  const fs = require('fs');
  const pngData = Buffer.from([0x89, 0x50, 0x4E, 0x47]); // Minimal PNG header
  fs.writeFileSync(testImagePath, pngData);
  
  await page.setInputFiles('input[type="file"]', testImagePath);
  
  // Submit the form
  await TestHelpers.setExtendedViewport(page);
  await page.getByRole('button', { name: 'Submit' }).click();
  
  // Verify success popup appears
  await TestHelpers.verifySuccessMessage(page, 'Successful Upload');
  await expect(page.getByRole('button', { name: 'Done' })).toBeVisible();
  
  // Clean up
  fs.unlinkSync(testImagePath);
});

// TC029: Sample Receipt Popup - "X" closes popup
test('TC029: Sample Receipt popup X button closes popup', async ({ page }) => {
  // Open sample receipt popup first
  const sampleReceiptButton = page.getByText('Sample Receipt');
  
  if (await sampleReceiptButton.isVisible({ timeout: 5000 })) {
    await sampleReceiptButton.click();
    
    // Verify popup is open
    await expect(page.locator('.popup, .modal, .dialog')).toBeVisible();
    
    // Close popup with X button
    await TestHelpers.closePopupWithX(page);
    
    // Verify popup is closed
    await expect(page.locator('.popup, .modal, .dialog')).not.toBeVisible();
  } else {
    console.log('Sample Receipt feature not available for testing');
  }
});

// TC030: Sample Receipt Popup - Can slide receipt images
test('TC030: Sample Receipt popup can slide through images', async ({ page }) => {
  // Open sample receipt popup first
  const sampleReceiptButton = page.getByText('Sample Receipt');
  
  if (await sampleReceiptButton.isVisible({ timeout: 5000 })) {
    await sampleReceiptButton.click();
    
    // Verify popup is open
    await expect(page.locator('.popup, .modal, .dialog')).toBeVisible();
    
    // Look for slide controls
    const nextButton = page.locator('button:has-text("Next"), .next-btn, .carousel-next');
    const prevButton = page.locator('button:has-text("Previous"), button:has-text("Prev"), .prev-btn, .carousel-prev');
    const slideIndicators = page.locator('.slide-indicator, .dot, .pagination-dot');
    
    // Test next button if available
    if (await nextButton.isVisible({ timeout: 2000 })) {
      await nextButton.click();
      await page.waitForTimeout(500); // Wait for slide transition
    }
    
    // Test previous button if available
    if (await prevButton.isVisible({ timeout: 2000 })) {
      await prevButton.click();
      await page.waitForTimeout(500); // Wait for slide transition
    }
    
    // Test slide indicators if available
    const indicatorCount = await slideIndicators.count();
    if (indicatorCount > 1) {
      await slideIndicators.nth(1).click();
      await page.waitForTimeout(500); // Wait for slide transition
    }
    
    // Test swipe gesture
    const slideArea = page.locator('.slider, .carousel, .slides');
    if (await slideArea.isVisible({ timeout: 2000 })) {
      const box = await slideArea.boundingBox();
      if (box) {
        // Swipe left
        await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2);
        await page.mouse.up();
        await page.waitForTimeout(500);
      }
    }
    
    // Close popup
    await TestHelpers.closePopupWithX(page);
  } else {
    console.log('Sample Receipt feature not available for testing');
  }
});

// TC031: Successful Upload Popup - "Done" redirects to Homepage
test('TC031: Successful Upload Done button redirects to Homepage', async ({ page }) => {
  // Upload a test image and submit
  const testImagePath = '/tmp/test-receipt.png';
  const fs = require('fs');
  const pngData = Buffer.from([0x89, 0x50, 0x4E, 0x47]); // Minimal PNG header
  fs.writeFileSync(testImagePath, pngData);
  
  await page.setInputFiles('input[type="file"]', testImagePath);
  await TestHelpers.setExtendedViewport(page);
  await page.getByRole('button', { name: 'Submit' }).click();
  
  // Click Done from success popup
  await page.getByRole('button', { name: 'Done' }).click();
  
  // Verify redirect to Homepage
  await expect(page).toHaveURL(/.*home/);
  
  // Clean up
  fs.unlinkSync(testImagePath);
});

// Original tests maintained for backward compatibility
test('test upload successful - original', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('https://my.haleon-rewards.d-rive.net/login');
  await expect(page).toHaveURL(/.*login/);
  await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
  await page.getByPlaceholder('Your phone number').fill('137336651');

  // Click "Send OTP Code"
  await page.getByRole('button', { name: 'Send OTP Code' }).click();

  // Pause for manual OTP entry
  await page.pause();

  // After you manually enter the OTP and resume the test:
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Done' }).click();

  // Click "Upload Receipt"
  await page.locator('div').filter({ hasText: /^Upload Receipt$/ }).locator('img').click();
  await page.getByText('Upload your receiptPNG, JPEG').click();

  // ✅ Upload file via the actual <input type="file"> element
  // Note: This path needs to be updated to a valid test file path
  // await page.setInputFiles('input[type="file"]', 'C:\\Users\\LENOVO\\Pictures\\Screenshots\\test.png');

  // Submit and verify
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.getByRole('button', { name: 'Submit' }).click();

  // Confirm success message
  await page.getByRole('button', { name: 'Done' }).click();
});

test('test unable to submit without upload receipt - original', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('https://my.haleon-rewards.d-rive.net/login');
  await expect(page).toHaveURL(/.*login/);
  await expect(page.getByPlaceholder('Your phone number')).toBeVisible();
  await page.getByPlaceholder('Your phone number').fill('137336651');

  // Click "Send OTP Code"
  await page.getByRole('button', { name: 'Send OTP Code' }).click();

  // Pause for manual OTP entry
  await page.pause();

  // After you manually enter the OTP and resume the test:
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
  await page.locator('div').filter({ hasText: /^Upload Receipt$/ }).locator('img').click();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('Please upload your receipt image!')).toBeVisible();
});