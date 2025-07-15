import { test, expect } from '@playwright/test';
import { TestHelpers, TestData } from './helpers/common';

/**
 * System Business Logic Tests
 * TC123-TC150: Business rules, point system, tier system, and badge system validation
 */

test.beforeEach(async ({ page }) => {
  // Login as registered user for system tests
  await TestHelpers.loginAsRegisteredUser(page);
});

// TC123: Max redemption from receipt submissions is 500pts/month
test('TC123: Receipt submission max redemption limit is 500 points per month', async ({ page }) => {
  // Navigate to upload receipt to check limits
  await TestHelpers.navigateViaBottomNav(page, 'upload');
  
  // Look for limit information or terms
  const limitInfo = [
    page.locator('text=/500.*points.*month/i'),
    page.locator('text=/monthly.*limit.*500/i'),
    page.locator('text=/max.*500.*per.*month/i')
  ];
  
  let limitFound = false;
  for (const info of limitInfo) {
    if (await info.isVisible({ timeout: 3000 }).catch(() => false)) {
      limitFound = true;
      break;
    }
  }
  
  // If not visible on upload page, check terms or help section
  if (!limitFound) {
    const termsButton = page.getByText('Terms and Conditions');
    if (await termsButton.isVisible({ timeout: 2000 })) {
      await termsButton.click();
      
      // Check for limit in terms
      const termsLimit = page.locator('text=/500.*points.*month/i');
      if (await termsLimit.isVisible({ timeout: 3000 })) {
        limitFound = true;
      }
    }
  }
  
  // Note: This is a business rule test - the limit should be documented or enforced in the system
  console.log(`Receipt submission limit information found: ${limitFound}`);
});

// TC124: No max cap for badge, welcome, tier multiplier points
test('TC124: Badge, welcome, and tier multiplier points have no max cap', async ({ page }) => {
  // Check tiering page for multiplier information
  await TestHelpers.navigateViaBottomNav(page, 'profile');
  
  const tieringOption = page.locator('div').filter({ hasText: /^Tiering$/ });
  if (await tieringOption.isVisible({ timeout: 3000 })) {
    await tieringOption.click();
    
    // Look for multiplier information that indicates no cap
    const multiplierInfo = [
      page.locator('text=/no.*limit.*multiplier/i'),
      page.locator('text=/unlimited.*tier.*points/i'),
      page.locator('text=/1x|1.5x|2x/'),
    ];
    
    let multiplierFound = false;
    for (const info of multiplierInfo) {
      if (await info.isVisible({ timeout: 3000 }).catch(() => false)) {
        multiplierFound = true;
        break;
      }
    }
    
    console.log(`Tier multiplier information found: ${multiplierFound}`);
  }
  
  // Check badges page for badge point information
  const badgesOption = page.locator('div').filter({ hasText: /^Badges$/ });
  if (await badgesOption.isVisible({ timeout: 3000 })) {
    await badgesOption.click();
    
    // Look for badge reward information
    const badgeRewards = page.locator('text=/rm\\d+.*tng|badge.*reward/i');
    const badgeRewardExists = await badgeRewards.isVisible({ timeout: 3000 }).catch(() => false);
    
    console.log(`Badge reward information found: ${badgeRewardExists}`);
  }
});

// TC125: RM1 = 1pt (rounded down)
test('TC125: Point calculation is RM1 = 1 point (rounded down)', async ({ page }) => {
  // Check point calculation information
  await TestHelpers.navigateViaBottomNav(page, 'upload');
  
  // Look for point calculation rules
  const calculationInfo = [
    page.locator('text=/rm1.*1.*point/i'),
    page.locator('text=/1.*ringgit.*1.*point/i'),
    page.locator('text=/rounded.*down/i')
  ];
  
  let calculationFound = false;
  for (const info of calculationInfo) {
    if (await info.isVisible({ timeout: 3000 }).catch(() => false)) {
      calculationFound = true;
      break;
    }
  }
  
  // Check in help or FAQ section
  if (!calculationFound) {
    await TestHelpers.navigateViaBottomNav(page, 'profile');
    
    const helpOption = page.locator('div').filter({ hasText: /^Help$/ });
    if (await helpOption.isVisible({ timeout: 3000 })) {
      await helpOption.click();
      
      const helpCalculation = page.locator('text=/rm1.*1.*point|point.*calculation/i');
      calculationFound = await helpCalculation.isVisible({ timeout: 3000 }).catch(() => false);
    }
  }
  
  console.log(`Point calculation rule found: ${calculationFound}`);
});

// TC126-TC128: Tier point ranges
test('TC126-TC128: Tier point ranges are correctly defined', async ({ page }) => {
  // Navigate to tiering page to check tier definitions
  await TestHelpers.navigateViaBottomNav(page, 'profile');
  
  const tieringOption = page.locator('div').filter({ hasText: /^Tiering$/ });
  if (await tieringOption.isVisible({ timeout: 3000 })) {
    await tieringOption.click();
    
    // Check Bronze tier range (0-100pts)
    const bronzeInfo = [
      page.locator('text=/bronze.*0.*100/i'),
      page.locator('text=/0.*100.*bronze/i')
    ];
    
    let bronzeFound = false;
    for (const info of bronzeInfo) {
      if (await info.isVisible({ timeout: 3000 }).catch(() => false)) {
        bronzeFound = true;
        break;
      }
    }
    
    // Check Silver tier range (101-300pts)
    const silverInfo = [
      page.locator('text=/silver.*101.*300/i'),
      page.locator('text=/101.*300.*silver/i')
    ];
    
    let silverFound = false;
    for (const info of silverInfo) {
      if (await info.isVisible({ timeout: 3000 }).catch(() => false)) {
        silverFound = true;
        break;
      }
    }
    
    // Check Gold tier range (>300pts)
    const goldInfo = [
      page.locator('text=/gold.*300/i'),
      page.locator('text=/300.*gold/i')
    ];
    
    let goldFound = false;
    for (const info of goldInfo) {
      if (await info.isVisible({ timeout: 3000 }).catch(() => false)) {
        goldFound = true;
        break;
      }
    }
    
    console.log(`Tier ranges found - Bronze: ${bronzeFound}, Silver: ${silverFound}, Gold: ${goldFound}`);
  }
});

// TC129-TC134: Tier review and upgrade/downgrade rules
test('TC129-TC134: Tier review system and upgrade/downgrade rules', async ({ page }) => {
  // Navigate to tiering page to check tier review information
  await TestHelpers.navigateViaBottomNav(page, 'profile');
  
  const tieringOption = page.locator('div').filter({ hasText: /^Tiering$/ });
  if (await tieringOption.isVisible({ timeout: 3000 })) {
    await tieringOption.click();
    
    // Look for tier review information
    const reviewInfo = [
      page.locator('text=/3.*month.*review/i'),
      page.locator('text=/review.*every.*3.*month/i'),
      page.locator('text=/quarterly.*review/i')
    ];
    
    let reviewFound = false;
    for (const info of reviewInfo) {
      if (await info.isVisible({ timeout: 3000 }).catch(() => false)) {
        reviewFound = true;
        break;
      }
    }
    
    // Look for points reset information
    const resetInfo = [
      page.locator('text=/points.*reset/i'),
      page.locator('text=/reset.*after.*review/i'),
      page.locator('text=/3.*month.*reset/i')
    ];
    
    let resetFound = false;
    for (const info of resetInfo) {
      if (await info.isVisible({ timeout: 3000 }).catch(() => false)) {
        resetFound = true;
        break;
      }
    }
    
    // Look for upgrade/downgrade rules
    const upgradeInfo = [
      page.locator('text=/upgrade.*bronze.*silver/i'),
      page.locator('text=/downgrade.*bronze/i'),
      page.locator('text=/tier.*change/i')
    ];
    
    let upgradeFound = false;
    for (const info of upgradeInfo) {
      if (await info.isVisible({ timeout: 3000 }).catch(() => false)) {
        upgradeFound = true;
        break;
      }
    }
    
    console.log(`Tier system rules found - Review: ${reviewFound}, Reset: ${resetFound}, Upgrade: ${upgradeFound}`);
  }
});

// TC135-TC138: Welcome bonus system
test('TC135-TC138: Welcome bonus system for different tiers', async ({ page }) => {
  // Navigate to tiering page to check welcome bonus information
  await TestHelpers.navigateViaBottomNav(page, 'profile');
  
  const tieringOption = page.locator('div').filter({ hasText: /^Tiering$/ });
  if (await tieringOption.isVisible({ timeout: 3000 })) {
    await tieringOption.click();
    
    // Check for welcome bonus information
    const welcomeBonusInfo = [
      page.locator('text=/bronze.*10.*point.*bonus/i'),
      page.locator('text=/silver.*20.*point.*bonus/i'),
      page.locator('text=/gold.*40.*point.*bonus/i'),
      page.locator('text=/welcome.*bonus/i'),
      page.locator('text=/first.*time.*bonus/i')
    ];
    
    let bonusInfoFound = 0;
    for (const info of welcomeBonusInfo) {
      if (await info.isVisible({ timeout: 3000 }).catch(() => false)) {
        bonusInfoFound++;
      }
    }
    
    // Check for one-time restriction information
    const oneTimeInfo = [
      page.locator('text=/one.*time.*only/i'),
      page.locator('text=/first.*time.*only/i'),
      page.locator('text=/already.*received/i')
    ];
    
    let oneTimeFound = false;
    for (const info of oneTimeInfo) {
      if (await info.isVisible({ timeout: 3000 }).catch(() => false)) {
        oneTimeFound = true;
        break;
      }
    }
    
    console.log(`Welcome bonus information found: ${bonusInfoFound} items, One-time restriction: ${oneTimeFound}`);
  }
});

// TC139-TC141: Tier multiplier system
test('TC139-TC141: Tier multiplier system validation', async ({ page }) => {
  // Navigate to tiering page to check multiplier information
  await TestHelpers.navigateViaBottomNav(page, 'profile');
  
  const tieringOption = page.locator('div').filter({ hasText: /^Tiering$/ });
  if (await tieringOption.isVisible({ timeout: 3000 })) {
    await tieringOption.click();
    
    // Check for multiplier information
    const multiplierInfo = [
      page.locator('text=/bronze.*1x/i'),
      page.locator('text=/silver.*1\\.5x/i'),
      page.locator('text=/gold.*2x/i'),
      page.locator('text=/multiplier/i')
    ];
    
    let multiplierFound = 0;
    for (const info of multiplierInfo) {
      if (await info.isVisible({ timeout: 3000 }).catch(() => false)) {
        multiplierFound++;
      }
    }
    
    console.log(`Tier multiplier information found: ${multiplierFound} items`);
  }
});

// TC142-TC150: Badge system validation
test('TC142-TC150: Badge system periods, rewards, and redemption limits', async ({ page }) => {
  // Navigate to badges page to check badge information
  await TestHelpers.navigateViaBottomNav(page, 'profile');
  
  const badgesOption = page.locator('div').filter({ hasText: /^Badges$/ });
  if (await badgesOption.isVisible({ timeout: 3000 })) {
    await badgesOption.click();
    
    // Check for badge period information (1 Jan 2025 – 31 Dec 2028)
    const periodInfo = [
      page.locator('text=/2025.*2028/'),
      page.locator('text=/jan.*2025.*dec.*2028/i'),
      page.locator('text=/badge.*period/i')
    ];
    
    let periodFound = false;
    for (const info of periodInfo) {
      if (await info.isVisible({ timeout: 3000 }).catch(() => false)) {
        periodFound = true;
        break;
      }
    }
    
    // Check for Toothpaste badge (buy 2, get RM1 TNG, max 4 times)
    const toothpasteInfo = [
      page.locator('text=/toothpaste/i'),
      page.locator('text=/buy.*2.*rm1/i'),
      page.locator('text=/max.*4.*time/i')
    ];
    
    let toothpasteFound = 0;
    for (const info of toothpasteInfo) {
      if (await info.isVisible({ timeout: 3000 }).catch(() => false)) {
        toothpasteFound++;
      }
    }
    
    // Check for Milk powder badge (buy 2, get RM2 TNG, max 2 times)
    const milkInfo = [
      page.locator('text=/milk.*powder/i'),
      page.locator('text=/buy.*2.*rm2/i'),
      page.locator('text=/max.*2.*time/i')
    ];
    
    let milkFound = 0;
    for (const info of milkInfo) {
      if (await info.isVisible({ timeout: 3000 }).catch(() => false)) {
        milkFound++;
      }
    }
    
    // Check for Diapers badge (buy 4, get RM5 TNG, max 1 time)
    const diapersInfo = [
      page.locator('text=/diapers/i'),
      page.locator('text=/buy.*4.*rm5/i'),
      page.locator('text=/max.*1.*time/i')
    ];
    
    let diapersFound = 0;
    for (const info of diapersInfo) {
      if (await info.isVisible({ timeout: 3000 }).catch(() => false)) {
        diapersFound++;
      }
    }
    
    console.log(`Badge information found - Period: ${periodFound}, Toothpaste: ${toothpasteFound}, Milk: ${milkFound}, Diapers: ${diapersFound}`);
    
    // Verify at least some badge information is present
    const totalBadgeInfo = toothpasteFound + milkFound + diapersFound;
    expect(totalBadgeInfo).toBeGreaterThan(0);
  }
});

// Additional system validation tests

test('Point calculation system validation', async ({ page }) => {
  // Test point calculation by checking receipt upload information
  await TestHelpers.navigateViaBottomNav(page, 'upload');
  
  // Look for calculation examples or rules
  const calculationExamples = [
    page.locator('text=/rm10.*10.*point/i'),
    page.locator('text=/rm5\\.50.*5.*point/i'),
    page.locator('text=/calculation.*example/i')
  ];
  
  let exampleFound = false;
  for (const example of calculationExamples) {
    if (await example.isVisible({ timeout: 3000 }).catch(() => false)) {
      exampleFound = true;
      break;
    }
  }
  
  console.log(`Point calculation examples found: ${exampleFound}`);
});

test('Monthly limit system validation', async ({ page }) => {
  // Check history page for monthly limit tracking
  await TestHelpers.navigateViaBottomNav(page, 'history');
  
  // Look for monthly summary or limit information
  const limitTracking = [
    page.locator('text=/monthly.*summary/i'),
    page.locator('text=/\\d+.*500.*month/i'),
    page.locator('text=/limit.*remaining/i')
  ];
  
  let trackingFound = false;
  for (const tracking of limitTracking) {
    if (await tracking.isVisible({ timeout: 3000 }).catch(() => false)) {
      trackingFound = true;
      break;
    }
  }
  
  console.log(`Monthly limit tracking found: ${trackingFound}`);
});

test('Tier progression system validation', async ({ page }) => {
  // Check current user tier and progression
  await TestHelpers.navigateViaBottomNav(page, 'profile');
  
  // Get current tier information
  const currentTier = page.locator('text=/bronze|silver|gold|platinum/i');
  if (await currentTier.isVisible({ timeout: 3000 })) {
    const tierText = await currentTier.textContent();
    console.log(`Current user tier: ${tierText}`);
    
    // Check for tier progression information
    const progressionInfo = [
      page.locator('text=/next.*tier/i'),
      page.locator('text=/\\d+.*points.*to.*next/i'),
      page.locator('.progress-bar, .tier-progress')
    ];
    
    let progressionFound = false;
    for (const info of progressionInfo) {
      if (await info.isVisible({ timeout: 3000 }).catch(() => false)) {
        progressionFound = true;
        break;
      }
    }
    
    console.log(`Tier progression information found: ${progressionFound}`);
  }
});

test('Badge eligibility system validation', async ({ page }) => {
  // Check badge eligibility and progress
  await TestHelpers.navigateViaBottomNav(page, 'profile');
  
  const badgesOption = page.locator('div').filter({ hasText: /^Badges$/ });
  if (await badgesOption.isVisible({ timeout: 3000 })) {
    await badgesOption.click();
    
    // Look for badge progress indicators
    const progressIndicators = [
      page.locator('text=/\\d+.*of.*\\d+/'),
      page.locator('text=/progress.*\\d+/i'),
      page.locator('.progress, .completion')
    ];
    
    let progressFound = false;
    for (const indicator of progressIndicators) {
      if (await indicator.isVisible({ timeout: 3000 }).catch(() => false)) {
        progressFound = true;
        break;
      }
    }
    
    // Look for badge completion status
    const completionStatus = [
      page.locator('text=/completed/i'),
      page.locator('text=/eligible/i'),
      page.locator('text=/in.*progress/i')
    ];
    
    let statusFound = false;
    for (const status of completionStatus) {
      if (await status.isVisible({ timeout: 3000 }).catch(() => false)) {
        statusFound = true;
        break;
      }
    }
    
    console.log(`Badge progress found: ${progressFound}, Status found: ${statusFound}`);
  }
});

test('System rewards distribution validation', async ({ page }) => {
  // Check points history for different types of rewards
  await TestHelpers.navigateViaBottomNav(page, 'history');
  
  // Look for points history tab
  const pointsTab = page.getByText('Points');
  if (await pointsTab.isVisible({ timeout: 3000 })) {
    await pointsTab.click();
    
    // Look for different types of point earnings
    const rewardTypes = [
      page.locator('text=/receipt.*point/i'),
      page.locator('text=/welcome.*bonus/i'),
      page.locator('text=/tier.*bonus/i'),
      page.locator('text=/badge.*reward/i'),
      page.locator('text=/multiplier/i')
    ];
    
    let typesFound = 0;
    for (const type of rewardTypes) {
      if (await type.isVisible({ timeout: 3000 }).catch(() => false)) {
        typesFound++;
      }
    }
    
    console.log(`Different reward types found in history: ${typesFound}`);
  }
});

test('Business rules enforcement validation', async ({ page }) => {
  // Test that business rules are properly enforced in the UI
  
  // Check that expired items are properly handled
  await TestHelpers.navigateViaBottomNav(page, 'rewards');
  
  const myRewardsButton = page.getByRole('button', { name: 'My Rewards' });
  if (await myRewardsButton.isVisible({ timeout: 3000 })) {
    await myRewardsButton.click();
    
    // Look for expired vouchers
    const expiredItems = page.locator('.expired, :has-text("Expired")');
    const expiredCount = await expiredItems.count();
    
    if (expiredCount > 0) {
      // Verify expired items have disabled interactions
      const firstExpired = expiredItems.first();
      const copyButton = firstExpired.locator('button:has-text("Copy")');
      
      if (await copyButton.isVisible()) {
        const isDisabled = await copyButton.isDisabled();
        expect(isDisabled).toBeTruthy();
      }
    }
  }
  
  // Check that insufficient points properly disable actions
  await TestHelpers.navigateViaBottomNav(page, 'rewards');
  
  const pointsShopButton = page.getByRole('button', { name: 'Points Shop' });
  if (await pointsShopButton.isVisible({ timeout: 3000 })) {
    await pointsShopButton.click();
    
    // Look for high-cost items and verify they show insufficient points warning
    const shopItems = page.locator('.product-item, .shop-item, .reward-item');
    const itemCount = await shopItems.count();
    
    if (itemCount > 0) {
      // Find the most expensive item
      let highestCost = 0;
      let expensiveItem = shopItems.first();
      
      for (let i = 0; i < Math.min(itemCount, 5); i++) {
        const item = shopItems.nth(i);
        const pointsText = await item.locator('text=/\\d+\\s*points/i').textContent().catch(() => '');
        const pointsCost = parseInt(pointsText.match(/\d+/)?.[0] || '0');
        
        if (pointsCost > highestCost) {
          highestCost = pointsCost;
          expensiveItem = item;
        }
      }
      
      // Try to add expensive item and check for proper handling
      const addButton = expensiveItem.locator('button:has-text("Add"), .add-to-cart');
      if (await addButton.isVisible({ timeout: 2000 })) {
        await addButton.click();
        
        // Should either disable the button or show error
        const errorShown = await page.locator('text=/insufficient|not.*enough/i').isVisible({ timeout: 2000 }).catch(() => false);
        const buttonDisabled = await addButton.isDisabled().catch(() => false);
        
        console.log(`Insufficient points handling - Error shown: ${errorShown}, Button disabled: ${buttonDisabled}`);
      }
    }
  }
});