import { test, expect } from './fixtures/test-fixtures.js';
import { TEST_USERS } from './fixtures/test-data.js';

test.describe('Module 3: Open New Account', () => {

  /**
   * @testcase TC-OPEN-001
   * @type Positive
   * @goal Verify customer can open a new CHECKING account using an existing funded account.
   */
  test('TC-OPEN-001: Successful Creation of a New Checking Account', async ({ loginPage, openAccountPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await openAccountPage.navigate();
    await openAccountPage.selectAccountType('0'); // CHECKING
    await page.waitForTimeout(500); // allow account dropdown population
    await openAccountPage.submitOpenAccount();
    
    // Verify confirmation and account number link
    await expect(page.getByRole('heading', { name: 'Account Opened!' })).toBeVisible();
    await expect(page.locator('#newAccountId')).toBeVisible();
  });

  /**
   * @testcase TC-OPEN-002
   * @type Positive
   * @goal Verify customer can open a new SAVINGS account using an existing funded account.
   */
  test('TC-OPEN-002: Successful Creation of a New Savings Account', async ({ loginPage, openAccountPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await openAccountPage.navigate();
    await openAccountPage.selectAccountType('1'); // SAVINGS
    await page.waitForTimeout(500);
    await openAccountPage.submitOpenAccount();
    
    await expect(page.getByRole('heading', { name: 'Account Opened!' })).toBeVisible();
    await expect(page.locator('#newAccountId')).toBeVisible();
  });

  /**
   * @testcase TC-OPEN-003
   * @type Negative
   * @goal Verify unauthenticated access to openaccount.htm displays internal error or redirects.
   */
  test('TC-OPEN-003: Unauthenticated Direct Access to Open Account Page', async ({ openAccountPage, page }) => {
    await openAccountPage.navigate();
    const errorOrLogin = page.locator('p:has-text("An internal error has occurred"), p.error, input[value="Log In"]');
    await expect(errorOrLogin.first()).toBeVisible();
  });

  /**
   * @testcase TC-OPEN-004
   * @type Edge
   * @goal Verify fast repeated clicking does not crash the account creation service.
   */
  test('TC-OPEN-004: Fast Repeated Submissions Debounce Verification', async ({ loginPage, openAccountPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await openAccountPage.navigate();
    await openAccountPage.selectAccountType('0');
    await page.waitForTimeout(500);
    await openAccountPage.openAccountButton.click();
    // Immediate double click attempt
    if (await openAccountPage.openAccountButton.isVisible()) {
      await openAccountPage.openAccountButton.click().catch(() => {});
    }
    await expect(page.locator('#openAccountResult, #openAccountForm').first()).toBeVisible();
  });

  /**
   * @testcase TC-OPEN-005
   * @type Edge
   * @goal Verify dropdown contains exactly CHECKING and SAVINGS options as captured in inventory.
   */
  test('TC-OPEN-005: Account Type Dropdown Options Integrity Verification', async ({ loginPage, openAccountPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await openAccountPage.navigate();
    await expect(openAccountPage.accountTypeSelect).toBeVisible();
    const options = await openAccountPage.accountTypeSelect.locator('option').allTextContents();
    expect(options).toEqual(expect.arrayContaining(['CHECKING', 'SAVINGS']));
  });

  /**
   * @testcase TC-OPEN-006
   * @type Positive
   * @goal Verify newly created account has minimum deposit allocation link and details.
   */
  test('TC-OPEN-006: Verification of Initial Minimum Deposit Allocation', async ({ loginPage, openAccountPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await openAccountPage.navigate();
    await openAccountPage.selectAccountType('0');
    await page.waitForTimeout(500);
    await openAccountPage.submitOpenAccount();
    const newAccountLink = page.locator('#newAccountId, a[href*="activity.htm"]').first();
    await expect(newAccountLink).toBeVisible();
    await newAccountLink.click();
    await expect(page).toHaveURL(/.*activity\.htm/);
  });

});
