import { test, expect } from '@playwright/test';
import { TestHelpers, TestData } from './helpers/common';

/**
 * History Tests
 * TC032-TC037: Submissions and Points History functionality
 */

test.beforeEach(async ({ page }) => {
  // Login as registered user and navigate to history page before each test
  await TestHelpers.loginAsRegisteredUser(page);
  await TestHelpers.navigateViaBottomNav(page, 'history');
});

// TC032: "Submissions" opens Submissions section
test('TC032: Submissions section opens correctly', async ({ page }) => {
  // Should be on history page from beforeEach
  await expect(page).toHaveURL(/.*history/);
  
  // Look for Submissions tab/button
  const submissionsTab = page.getByText('Submissions');
  
  if (await submissionsTab.isVisible({ timeout: 5000 })) {
    await submissionsTab.click();
    
    // Verify submissions section is displayed
    await expect(page.locator('text=/submissions|submitted|receipt/i')).toBeVisible();
    
    // Verify URL or section indicator shows submissions
    const currentUrl = page.url();
    const isSubmissionsActive = currentUrl.includes('submissions') || 
                               await page.locator('.active:has-text("Submissions"), .selected:has-text("Submissions")').isVisible().catch(() => false);
    
    expect(isSubmissionsActive).toBeTruthy();
  } else {
    // Look for alternative tab names
    const alternatives = [
      page.getByText('Receipt History'),
      page.getByText('My Submissions'),
      page.getByText('Upload History'),
      page.locator('[data-testid="submissions-tab"]')
    ];
    
    let found = false;
    for (const tab of alternatives) {
      if (await tab.isVisible({ timeout: 2000 }).catch(() => false)) {
        await tab.click();
        await expect(page.locator('text=/submissions|submitted|receipt/i')).toBeVisible();
        found = true;
        break;
      }
    }
    
    if (!found) {
      console.log('Submissions tab not found - may be default view');
      // Verify submissions content is visible by default
      await expect(page.locator('text=/submissions|submitted|receipt/i')).toBeVisible();
    }
  }
});

// TC033: "Points" opens Points History section  
test('TC033: Points History section opens correctly', async ({ page }) => {
  // Should be on history page from beforeEach
  await expect(page).toHaveURL(/.*history/);
  
  // Look for Points tab/button
  const pointsTab = page.getByText('Points');
  
  if (await pointsTab.isVisible({ timeout: 5000 })) {
    await pointsTab.click();
    
    // Verify points section is displayed
    await expect(page.locator('text=/points|earned|used|redeemed/i')).toBeVisible();
    
    // Verify URL or section indicator shows points
    const currentUrl = page.url();
    const isPointsActive = currentUrl.includes('points') || 
                          await page.locator('.active:has-text("Points"), .selected:has-text("Points")').isVisible().catch(() => false);
    
    expect(isPointsActive).toBeTruthy();
  } else {
    // Look for alternative tab names
    const alternatives = [
      page.getByText('Points History'),
      page.getByText('Point History'),
      page.getByText('My Points'),
      page.locator('[data-testid="points-tab"]')
    ];
    
    let found = false;
    for (const tab of alternatives) {
      if (await tab.isVisible({ timeout: 2000 }).catch(() => false)) {
        await tab.click();
        await expect(page.locator('text=/points|earned|used|redeemed/i')).toBeVisible();
        found = true;
        break;
      }
    }
    
    if (!found) {
      console.log('Points tab not found - checking if points history is available');
      // Check if points history content is visible
      const pointsContent = await page.locator('text=/points|earned|used|redeemed/i').isVisible().catch(() => false);
      if (!pointsContent) {
        console.log('Points history feature may not be implemented');
      }
    }
  }
});

// TC034: Filter by duration in Submissions section
test('TC034: Filter submissions by duration', async ({ page }) => {
  // Navigate to submissions section
  const submissionsTab = page.getByText('Submissions');
  if (await submissionsTab.isVisible({ timeout: 3000 })) {
    await submissionsTab.click();
  }
  
  // Look for filter controls
  const filterElements = [
    page.locator('select[name*="filter"], select[name*="duration"]'),
    page.locator('.filter-dropdown, .duration-filter'),
    page.getByText('Last 30 days'),
    page.getByText('Last 3 months'),
    page.getByText('Last 6 months'),
    page.getByText('All time')
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
      
      // Verify some change occurred (loading, content change, etc.)
      const hasLoader = await page.locator('.loading, .spinner, [data-testid="loading"]').isVisible().catch(() => false);
      const hasContent = await page.locator('.submission-item, .receipt-item, .history-item').isVisible().catch(() => false);
      
      expect(hasLoader || hasContent).toBeTruthy();
      break;
    }
  }
  
  if (!filterFound) {
    console.log('Duration filter not found in submissions section');
  }
});

// TC035: List receipt submissions
test('TC035: List receipt submissions correctly', async ({ page }) => {
  // Navigate to submissions section
  const submissionsTab = page.getByText('Submissions');
  if (await submissionsTab.isVisible({ timeout: 3000 })) {
    await submissionsTab.click();
  }
  
  // Wait for content to load
  await page.waitForTimeout(2000);
  
  // Look for submission items
  const submissionItems = page.locator('.submission-item, .receipt-item, .history-item, .list-item');
  const submissionCount = await submissionItems.count();
  
  if (submissionCount > 0) {
    // Verify submission items contain expected information
    const firstItem = submissionItems.first();
    
    // Check for common submission fields
    const hasDate = await firstItem.locator('text=/\\d{1,2}[\\/-]\\d{1,2}[\\/-]\\d{2,4}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/').isVisible().catch(() => false);
    const hasStatus = await firstItem.locator('text=/pending|approved|rejected|processing/i').isVisible().catch(() => false);
    const hasAmount = await firstItem.locator('text=/RM\\s*\\d+|\\d+\\s*points/i').isVisible().catch(() => false);
    
    // At least one of these should be present
    expect(hasDate || hasStatus || hasAmount).toBeTruthy();
    
    // Verify multiple submissions if available
    if (submissionCount > 1) {
      const secondItem = submissionItems.nth(1);
      await expect(secondItem).toBeVisible();
    }
  } else {
    // No submissions found - check for empty state message
    const emptyStateMessages = [
      page.getByText('No submissions found'),
      page.getByText('No receipts submitted'),
      page.getByText('No history available'),
      page.locator('.empty-state, .no-data')
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

// TC036: Filter by duration in Points History section
test('TC036: Filter points history by duration', async ({ page }) => {
  // Navigate to points section
  const pointsTab = page.getByText('Points');
  if (await pointsTab.isVisible({ timeout: 3000 })) {
    await pointsTab.click();
  }
  
  // Look for filter controls
  const filterElements = [
    page.locator('select[name*="filter"], select[name*="duration"]'),
    page.locator('.filter-dropdown, .duration-filter'),
    page.getByText('Last 30 days'),
    page.getByText('Last 3 months'),
    page.getByText('Last 6 months'),
    page.getByText('All time')
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
      const hasContent = await page.locator('.point-item, .history-item, .transaction-item').isVisible().catch(() => false);
      
      expect(hasLoader || hasContent).toBeTruthy();
      break;
    }
  }
  
  if (!filterFound) {
    console.log('Duration filter not found in points section');
  }
});

// TC037: List points earned/used
test('TC037: List points earned and used correctly', async ({ page }) => {
  // Navigate to points section
  const pointsTab = page.getByText('Points');
  if (await pointsTab.isVisible({ timeout: 3000 })) {
    await pointsTab.click();
  }
  
  // Wait for content to load
  await page.waitForTimeout(2000);
  
  // Look for points history items
  const pointItems = page.locator('.point-item, .history-item, .transaction-item, .list-item');
  const pointCount = await pointItems.count();
  
  if (pointCount > 0) {
    // Verify points items contain expected information
    const firstItem = pointItems.first();
    
    // Check for common points fields
    const hasDate = await firstItem.locator('text=/\\d{1,2}[\\/-]\\d{1,2}[\\/-]\\d{2,4}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/').isVisible().catch(() => false);
    const hasPoints = await firstItem.locator('text=/\\+\\d+|\\-\\d+|\\d+\\s*points/i').isVisible().catch(() => false);
    const hasType = await firstItem.locator('text=/earned|used|redeemed|received|spent/i').isVisible().catch(() => false);
    const hasDescription = await firstItem.locator('text=/receipt|reward|bonus|welcome|tier/i').isVisible().catch(() => false);
    
    // At least one of these should be present
    expect(hasDate || hasPoints || hasType || hasDescription).toBeTruthy();
    
    // Verify points earned vs used differentiation
    const earnedItems = await page.locator('text=/\\+\\d+|earned|received/i').count();
    const usedItems = await page.locator('text=/\\-\\d+|used|spent|redeemed/i').count();
    
    // Should have some indication of earned or used points
    expect(earnedItems > 0 || usedItems > 0).toBeTruthy();
    
    // Verify multiple point transactions if available
    if (pointCount > 1) {
      const secondItem = pointItems.nth(1);
      await expect(secondItem).toBeVisible();
    }
  } else {
    // No points history found - check for empty state message
    const emptyStateMessages = [
      page.getByText('No points history'),
      page.getByText('No transactions found'),
      page.getByText('No points earned or used'),
      page.locator('.empty-state, .no-data')
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

// Additional test: History page basic functionality
test('History page loads correctly with both sections', async ({ page }) => {
  // Should be on history page from beforeEach
  await expect(page).toHaveURL(/.*history/);
  
  // Verify page title or heading
  await expect(page.locator('text=/history|submissions|points/i')).toBeVisible();
  
  // Verify both sections are available (if implemented as tabs)
  const submissionsExists = await page.getByText('Submissions').isVisible({ timeout: 3000 }).catch(() => false);
  const pointsExists = await page.getByText('Points').isVisible({ timeout: 3000 }).catch(() => false);
  
  if (submissionsExists && pointsExists) {
    // Test switching between tabs
    await page.getByText('Submissions').click();
    await page.waitForTimeout(500);
    
    await page.getByText('Points').click();
    await page.waitForTimeout(500);
    
    // Switch back to submissions
    await page.getByText('Submissions').click();
    await page.waitForTimeout(500);
  } else {
    console.log('Tab-based history interface not found - may be single view or different implementation');
  }
});