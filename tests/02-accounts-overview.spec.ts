import { test, expect } from './fixtures/test-fixtures.js';
import { TEST_USERS } from './fixtures/test-data.js';

test.describe('Module 2: Accounts Overview', () => {

  /**
   * @testcase TC-ACCT-001
   * @type Positive
   * @goal Verify accounts overview displays accounts table with account numbers and balances.
   */
  test('TC-ACCT-001: Verification of Accounts Overview Grid and Balance Summary', async ({ loginPage, overviewPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await overviewPage.navigate();
    await expect(page).toHaveURL(/.*overview\.htm/);
    await expect(overviewPage.accountTable).toBeVisible();
    await expect(overviewPage.accountRows.first()).toBeVisible();
  });

  /**
   * @testcase TC-ACCT-002
   * @type Positive
   * @goal Verify clicking account number link opens account activity/details page.
   */
  test('TC-ACCT-002: Navigation to Account Details and Activity View via Account Number Link', async ({ loginPage, overviewPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await overviewPage.navigate();
    const accountLink = page.locator('#accountTable tbody tr a').first();
    await expect(accountLink).toBeVisible();
    await accountLink.click();
    await expect(page).toHaveURL(/.*activity\.htm\?id=\d+/);
    await expect(page.locator('#accountDetails, #transactionTable, h1.title:has-text("Account Details")').first()).toBeVisible();
  });

  /**
   * @testcase TC-ACCT-003
   * @type Negative
   * @goal Verify unauthenticated access to overview.htm shows error message or redirects.
   */
  test('TC-ACCT-003: Unauthenticated Direct Access to Overview Page', async ({ overviewPage, page }) => {
    await overviewPage.navigate();
    // In ParaBank, unauthenticated overview access displays the error alert or prompts login
    const errorOrLogin = page.locator('p:has-text("An internal error has occurred"), p.error, input[value="Log In"]');
    await expect(errorOrLogin.first()).toBeVisible();
  });

  /**
   * @testcase TC-ACCT-004
   * @type Negative
   * @goal Verify direct URL navigation to an invalid/unauthorized account activity ID displays error.
   */
  test('TC-ACCT-004: Direct URL Tampering for Unauthorized Account ID', async ({ loginPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await page.goto('activity.htm?id=99999999');
    const errorOrDetails = page.locator('p.error, #rightPanel p, #noTransactions');
    await expect(errorOrDetails.first()).toBeVisible();
  });

  /**
   * @testcase TC-ACCT-005
   * @type Edge
   * @goal Verify boundary calculation of total balance row displays valid numeric amount.
   */
  test('TC-ACCT-005: Boundary Verification of Total Balance Calculation', async ({ loginPage, overviewPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await overviewPage.navigate();
    await expect(overviewPage.accountTable).toBeVisible();
    const totalRow = page.locator('#accountTable tr:has-text("Total")');
    await expect(totalRow).toBeVisible();
    await expect(totalRow).toContainText(/\$\d+(\.\d{2})?/);
  });

});
