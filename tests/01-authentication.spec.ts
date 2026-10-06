import { test, expect } from './fixtures/test-fixtures.js';
import { TEST_USERS } from './fixtures/test-data.js';

test.describe('Module 1: Authentication & Welcome', () => {

  /**
   * @testcase TC-AUTH-001
   * @type Positive
   * @goal Verify that a registered customer can log in successfully with valid credentials.
   */
  test('TC-AUTH-001: Successful Customer Login with Valid Credentials', async ({ loginPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await expect(page).toHaveURL(/.*(overview\.htm|index\.htm)/);
    // Left menu or user welcome is displayed
    const overviewOrWelcome = page.locator('#accountTable, #leftPanel p.smallText, a[href*="logout.htm"]');
    await expect(overviewOrWelcome.first()).toBeVisible();
  });

  /**
   * @testcase TC-AUTH-002
   * @type Negative
   * @goal Verify that submitting the login form with empty username and password displays an error.
   */
  test('TC-AUTH-002: Login Failure with Blank Username and Blank Password', async ({ loginPage, page }) => {
    await loginPage.navigate();
    await loginPage.login('', '');
    const errorMsg = page.locator('p.error, .error');
    await expect(errorMsg.first()).toBeVisible();
    await expect(errorMsg.first()).toHaveText(/Please enter a username and password\.|An internal error has occurred/);
  });

  /**
   * @testcase TC-AUTH-003
   * @type Negative
   * @goal Verify login fails with non-existent username and presents an error message.
   */
  test('TC-AUTH-003: Login Failure with Non-Existent Username', async ({ loginPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.invalidUser.username, 'SomePassword123!');
    const errorMsg = page.locator('p.error, .error');
    await expect(errorMsg.first()).toBeVisible();
    await expect(errorMsg.first()).toHaveText(/The username and password could not be verified\.|An internal error has occurred/);
  });

  /**
   * @testcase TC-AUTH-004
   * @type Negative
   * @goal Verify login fails when entering an incorrect password for a valid registered customer.
   */
  test('TC-AUTH-004: Login Failure with Incorrect Password for Valid Username', async ({ loginPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, 'IncorrectPassword999!');
    const errorMsg = page.locator('p.error, .error');
    await expect(errorMsg.first()).toBeVisible();
    await expect(errorMsg.first()).toHaveText(/The username and password could not be verified\.|An internal error has occurred/);
  });

  /**
   * @testcase TC-AUTH-005
   * @type Positive
   * @goal Verify customer can terminate session securely via 'Log Out' link.
   */
  test('TC-AUTH-005: Successful Session Termination via Log Out', async ({ loginPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    const logoutBtn = page.locator('a[href*="logout.htm"]');
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();
    await expect(page.locator('input[value="Log In"]')).toBeVisible();
  });

  /**
   * @testcase TC-AUTH-006
   * @type Positive
   * @goal Verify 'Forgot login info?' link navigates to customer recovery page.
   */
  test('TC-AUTH-006: Navigation to Customer Lookup Page via Forgot login info Link', async ({ loginPage, page }) => {
    await loginPage.navigate();
    await loginPage.forgotLoginLink.click();
    await expect(page).toHaveURL(/.*lookup\.htm/);
    await expect(page.locator('input[value="Find My Login Info"]')).toBeVisible();
  });

  /**
   * @testcase TC-AUTH-007
   * @type Positive
   * @goal Verify 'Register' link navigates to new customer registration form.
   */
  test('TC-AUTH-007: Navigation to Customer Registration via Register Link', async ({ loginPage, page }) => {
    await loginPage.navigate();
    await loginPage.registerLink.click();
    await expect(page).toHaveURL(/.*register\.htm/);
    await expect(page.locator('input[value="Register"]')).toBeVisible();
  });

  /**
   * @testcase TC-AUTH-008
   * @type Edge
   * @goal Verify login inputs handle SQL injection characters safely without application crash.
   */
  test('TC-AUTH-008: SQL Injection Resilience on Login Credentials', async ({ loginPage, page }) => {
    await loginPage.navigate();
    await loginPage.login("' OR '1'='1", "' OR '1'='1");
    // Ensure user remains unauthenticated (never gains authenticated session)
    await expect(page.locator('a[href*="logout.htm"]')).not.toBeVisible();
    await expect(page.locator('#accountTable')).not.toBeVisible();
    // System safely defends via login rejection error or WAF security intercept
    const safeDefense = page.locator('input[value="Log In"], p.error, :text("security verification"), :text("Cloudflare")');
    await expect(safeDefense.first()).toBeVisible();
  });

});
