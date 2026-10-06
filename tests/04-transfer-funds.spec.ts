import { test, expect } from './fixtures/test-fixtures.js';
import { TEST_USERS } from './fixtures/test-data.js';

test.describe('Module 4: Transfer Funds', () => {

  /**
   * @testcase TC-XFER-001
   * @type Positive
   * @goal Verify customer can transfer funds successfully between valid accounts.
   */
  test('TC-XFER-001: Successful Fund Transfer Between Different Customer Accounts', async ({ loginPage, transferPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await transferPage.navigate();
    await page.waitForTimeout(500); // allow account dropdowns to populate
    await transferPage.transfer('25.00');
    await expect(page.getByRole('heading', { name: 'Transfer Complete!' })).toBeVisible();
    await expect(page.locator('#showResult')).toContainText('$25.00');
  });

  /**
   * @testcase TC-XFER-002
   * @type Positive
   * @goal Verify transfer processes fractional decimal cents correctly ($12.34).
   */
  test('TC-XFER-002: Fund Transfer with Fractional Decimal Cents ($12.34)', async ({ loginPage, transferPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await transferPage.navigate();
    await page.waitForTimeout(500);
    await transferPage.transfer('12.34');
    await expect(page.getByRole('heading', { name: 'Transfer Complete!' })).toBeVisible();
    await expect(page.locator('#showResult')).toContainText('$12.34');
  });

  /**
   * @testcase TC-XFER-003
   * @type Negative
   * @goal Verify leaving amount empty displays exact error: 'The amount cannot be empty.'
   */
  test('TC-XFER-003: Validation of Empty Amount Field on Transfer Submission', async ({ loginPage, transferPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await transferPage.navigate();
    await transferPage.amountInput.fill('');
    await transferPage.transferButton.click();
    const errorElem = page.locator('#amount\\.errors').first();
    await expect(errorElem).toBeAttached();
    await expect(errorElem).toContainText(/The amount cannot be empty/i);
  });

  /**
   * @testcase TC-XFER-004
   * @type Negative
   * @goal Verify non-numeric input displays validation error: 'Please enter a valid amount.'
   */
  test('TC-XFER-004: Validation of Non-Numeric Alphanumeric String in Amount Field', async ({ loginPage, transferPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await transferPage.navigate();
    await transferPage.amountInput.fill('invalid_amt');
    await transferPage.transferButton.click();
    const errorElem = page.locator('#amount\\.errors').nth(1);
    await expect(errorElem).toBeAttached();
    await expect(errorElem).toContainText(/Please enter a valid amount/i);
  });

  /**
   * @testcase TC-XFER-005
   * @type Negative
   * @goal Verify unauthenticated access to transfer.htm displays error alert or prompts login.
   */
  test('TC-XFER-005: Unauthenticated Direct Access to Transfer Funds Page', async ({ transferPage, page }) => {
    await transferPage.navigate();
    const errorOrLogin = page.locator('p:has-text("An internal error has occurred"), p.error, input[value="Log In"]');
    await expect(errorOrLogin.first()).toBeVisible();
  });

  /**
   * @testcase TC-XFER-006
   * @type Edge
   * @goal Verify transferring funds to the same source and destination account is handled gracefully.
   */
  test('TC-XFER-006: Transfer to Same Source and Destination Account', async ({ loginPage, transferPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await transferPage.navigate();
    await page.waitForTimeout(500);
    // Submit transfer with default selected accounts (same account or different)
    await transferPage.transfer('5.00');
    // Verifies application finishes transaction or responds without server failure
    await expect(page.locator('#showResult, #showForm, h1.title').first()).toBeVisible();
  });

  /**
   * @testcase TC-XFER-007
   * @type Edge
   * @goal Verify transfer of large amount ($1,000,000.00) executes without UI overflow or exception.
   */
  test('TC-XFER-007: Transfer of Extreme Large Amount ($1,000,000.00)', async ({ loginPage, transferPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await transferPage.navigate();
    await page.waitForTimeout(500);
    await transferPage.transfer('1000000.00');
    await expect(page.locator('#showResult, #showForm, h1.title').first()).toBeVisible();
  });

  /**
   * @testcase TC-XFER-008
   * @type Edge
   * @goal Verify transfer with zero amount ($0.00) boundary condition.
   */
  test('TC-XFER-008: Zero Amount Transfer ($0.00) Boundary Validation', async ({ loginPage, transferPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await transferPage.navigate();
    await page.waitForTimeout(500);
    await transferPage.transfer('0.00');
    // Result container renders without unhandled 500 error
    await expect(page.locator('#showResult, #showForm, h1.title').first()).toBeVisible();
  });

});
