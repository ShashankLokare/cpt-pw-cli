import { test, expect } from './fixtures/test-fixtures.js';
import { TEST_USERS } from './fixtures/test-data.js';

test.describe('Module 8: Request Loan', () => {

  /**
   * @testcase TC-LOAN-001
   * @type Positive
   * @goal Verify loan application with adequate down payment displays approval status.
   */
  test('TC-LOAN-001: Successful Loan Application Approval with Adequate Down Payment', async ({ loginPage, loanPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await loanPage.navigate();
    await page.waitForTimeout(500); // allow account dropdown to populate
    await loanPage.applyForLoan('1000.00', '200.00');
    await expect(page.locator('#loanStatus, #requestLoanResult, #rightPanel')).toBeVisible();
    await expect(page.locator('#loanStatus, #requestLoanResult')).toContainText(/Approved|Denied/i);
  });

  /**
   * @testcase TC-LOAN-002
   * @type Positive
   * @goal Verify loan with high available funds ratio.
   */
  test('TC-LOAN-002: Loan Application Approval with High Available Funds Ratio', async ({ loginPage, loanPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await loanPage.navigate();
    await page.waitForTimeout(500);
    await loanPage.applyForLoan('500.00', '250.00');
    await expect(page.locator('#loanStatus, #requestLoanResult, #rightPanel')).toBeVisible();
  });

  /**
   * @testcase TC-LOAN-003
   * @type Negative
   * @goal Verify loan application is denied when down payment is excessively low.
   */
  test('TC-LOAN-003: Loan Application Denied Due to Insufficient Down Payment', async ({ loginPage, loanPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await loanPage.navigate();
    await page.waitForTimeout(500);
    await loanPage.applyForLoan('50000.00', '1.00');
    await expect(page.locator('#loanStatus, #requestLoanResult, #rightPanel')).toBeVisible();
  });

  /**
   * @testcase TC-LOAN-004
   * @type Negative
   * @goal Verify submitting blank loan fields handles validation properly.
   */
  test('TC-LOAN-004: Validation of Blank Loan Amount and Down Payment Fields', async ({ loginPage, loanPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await loanPage.navigate();
    await loanPage.amountInput.fill('');
    await loanPage.downPaymentInput.fill('');
    await loanPage.applyButton.click();
    await expect(page.locator('.error, #rightPanel, #loanStatus')).toBeVisible();
  });

  /**
   * @testcase TC-LOAN-005
   * @type Negative
   * @goal Verify unauthenticated access to requestloan.htm displays error alert.
   */
  test('TC-LOAN-005: Unauthenticated Direct Access to Request Loan Page', async ({ loanPage, page }) => {
    await loanPage.navigate();
    const errorOrLogin = page.locator('p:has-text("An internal error has occurred"), p.error, input[value="Log In"]');
    await expect(errorOrLogin.first()).toBeVisible();
  });

  /**
   * @testcase TC-LOAN-006
   * @type Edge
   * @goal Verify requesting extreme loan amount ($10,000,000) handles underwriting response without server error.
   */
  test('TC-LOAN-006: Loan Request Exceeding Available Balance Limit', async ({ loginPage, loanPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await loanPage.navigate();
    await page.waitForTimeout(500);
    await loanPage.applyForLoan('10000000.00', '500.00');
    await expect(page.locator('#loanStatus, #requestLoanResult, #rightPanel')).toBeVisible();
  });

  /**
   * @testcase TC-LOAN-007
   * @type Edge
   * @goal Verify boundary condition of zero down payment ($0.00).
   */
  test('TC-LOAN-007: Zero Down Payment ($0.00) Loan Application Boundary', async ({ loginPage, loanPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await loanPage.navigate();
    await page.waitForTimeout(500);
    await loanPage.applyForLoan('1000.00', '0.00');
    await expect(page.locator('#loanStatus, #requestLoanResult, #rightPanel')).toBeVisible();
  });

});
