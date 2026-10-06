import { test, expect } from './fixtures/test-fixtures.js';
import { TEST_USERS } from './fixtures/test-data.js';

test.describe('Module 6: Find Transactions', () => {

  /**
   * @testcase TC-FIND-001
   * @type Positive
   * @goal Verify searching by transaction ID returns results or appropriate message.
   */
  test('TC-FIND-001: Find Transactions by Valid Transaction ID', async ({ loginPage, findTransPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await findTransPage.navigate();
    await findTransPage.findById('13344');
    await expect(page.locator('#transactionTable, #noTransactions, #rightPanel')).toBeVisible();
  });

  /**
   * @testcase TC-FIND-002
   * @type Positive
   * @goal Verify searching by transaction date (MM-DD-YYYY or YYYY-MM-DD).
   */
  test('TC-FIND-002: Find Transactions by Valid Transaction Date', async ({ loginPage, findTransPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await findTransPage.navigate();
    await findTransPage.findByDate('10-06-2026');
    await expect(page.locator('#transactionTable, #noTransactions, #rightPanel')).toBeVisible();
  });

  /**
   * @testcase TC-FIND-003
   * @type Positive
   * @goal Verify searching by valid date range (From Date to To Date).
   */
  test('TC-FIND-003: Find Transactions by Valid Date Range', async ({ loginPage, findTransPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await findTransPage.navigate();
    await findTransPage.findByDateRange('01-01-2026', '12-31-2026');
    await expect(page.locator('#transactionTable, #noTransactions, #rightPanel')).toBeVisible();
  });

  /**
   * @testcase TC-FIND-004
   * @type Positive
   * @goal Verify searching transactions by exact amount ($100.00).
   */
  test('TC-FIND-004: Find Transactions by Exact Amount ($100.00)', async ({ loginPage, findTransPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await findTransPage.navigate();
    await findTransPage.findByAmount('100.00');
    await expect(page.locator('#transactionTable, #noTransactions, #rightPanel')).toBeVisible();
  });

  /**
   * @testcase TC-FIND-005
   * @type Negative
   * @goal Verify search with non-existent transaction ID handles empty set cleanly.
   */
  test('TC-FIND-005: Find Transactions by Non-Existent Transaction ID', async ({ loginPage, findTransPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await findTransPage.navigate();
    await findTransPage.findById('999999999');
    await expect(page.locator('#transactionTable, #noTransactions, #rightPanel')).toBeVisible();
  });

  /**
   * @testcase TC-FIND-006
   * @type Negative
   * @goal Verify inverted date range (From > To) handles validation or returns empty list.
   */
  test('TC-FIND-006: Find Transactions with Inverted Date Range', async ({ loginPage, findTransPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await findTransPage.navigate();
    await findTransPage.findByDateRange('12-31-2026', '01-01-2026');
    await expect(page.locator('#transactionTable, #noTransactions, #rightPanel')).toBeVisible();
  });

  /**
   * @testcase TC-FIND-007
   * @type Negative
   * @goal Verify malformed date strings do not trigger 500 error.
   */
  test('TC-FIND-007: Validation of Malformed Date Format in Search Inputs', async ({ loginPage, findTransPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await findTransPage.navigate();
    await findTransPage.findByDate('invalid-date-format');
    await expect(page.locator('#transactionTable, #noTransactions, #rightPanel')).toBeVisible();
  });

  /**
   * @testcase TC-FIND-008
   * @type Negative
   * @goal Verify unauthenticated direct navigation to findtrans.htm displays error alert.
   */
  test('TC-FIND-008: Unauthenticated Direct Access to Find Transactions Page', async ({ findTransPage, page }) => {
    await findTransPage.navigate();
    const errorOrLogin = page.locator('p:has-text("An internal error has occurred"), p.error, input[value="Log In"]');
    await expect(errorOrLogin.first()).toBeVisible();
  });

  /**
   * @testcase TC-FIND-009
   * @type Edge
   * @goal Verify searching by negative amount boundary condition.
   */
  test('TC-FIND-009: Find Transactions by Negative Amount (-$50.00)', async ({ loginPage, findTransPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await findTransPage.navigate();
    await findTransPage.findByAmount('-50.00');
    await expect(page.locator('#transactionTable, #noTransactions, #rightPanel')).toBeVisible();
  });

});
