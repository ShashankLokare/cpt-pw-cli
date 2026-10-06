import { test, expect } from './fixtures/test-fixtures.js';
import { generateUniqueUser, TEST_USERS } from './fixtures/test-data.js';

test.describe('Module 9: Registration', () => {

  /**
   * @testcase TC-REG-001
   * @type Positive
   * @goal Verify new customer account can register successfully with valid credentials.
   */
  test('TC-REG-001: Successful Registration of a New Customer Account', async ({ registerPage, page }) => {
    const newUser = generateUniqueUser();
    await registerPage.navigate();
    await registerPage.fillRegistrationForm(newUser);
    await registerPage.submitRegistration();
    await expect(page.locator('#rightPanel h1.title:has-text("Welcome"), #rightPanel p:has-text("Your account was created successfully")')).toBeVisible();
  });

  /**
   * @testcase TC-REG-002
   * @type Positive
   * @goal Verify a default bank account is provisioned upon registration.
   */
  test('TC-REG-002: Initial Bank Account Provisioning Upon Registration', async ({ registerPage, page }) => {
    const newUser = generateUniqueUser();
    await registerPage.navigate();
    await registerPage.fillRegistrationForm(newUser);
    await registerPage.submitRegistration();
    await page.locator('a[href*="overview.htm"]').click();
    await expect(page.locator('#accountTable tbody tr a')).toBeVisible();
  });

  /**
   * @testcase TC-REG-003
   * @type Positive
   * @goal Verify customer session is immediately authenticated following registration.
   */
  test('TC-REG-003: Session Persistence and Direct Navigation Following Registration', async ({ registerPage, page }) => {
    const newUser = generateUniqueUser();
    await registerPage.navigate();
    await registerPage.fillRegistrationForm(newUser);
    await registerPage.submitRegistration();
    await expect(page.locator('a[href*="logout.htm"]')).toBeVisible();
  });

  /**
   * @testcase TC-REG-004
   * @type Negative
   * @goal Verify registration fails when attempting to register an existing duplicate username.
   */
  test('TC-REG-004: Registration Failure with Duplicate Username', async ({ registerPage, page }) => {
    await registerPage.navigate();
    await registerPage.fillRegistrationForm({
      ...generateUniqueUser(),
      username: TEST_USERS.defaultUser.username // existing username 'john'
    });
    await registerPage.submitRegistration();
    const usernameError = page.locator('#customer\\.username\\.errors, span[id*="username.errors"], span.error');
    await expect(usernameError.first()).toBeVisible();
    await expect(usernameError.first()).toHaveText(/This username already exists\./);
  });

  /**
   * @testcase TC-REG-005
   * @type Negative
   * @goal Verify registration fails when password and repeated password do not match.
   */
  test('TC-REG-005: Registration Failure with Mismatched Password and Repeat Password', async ({ registerPage, page }) => {
    await registerPage.navigate();
    await registerPage.fillRegistrationForm({
      ...generateUniqueUser(),
      password: 'Password123!',
      repeatedPassword: 'DifferentPassword456!'
    });
    await registerPage.submitRegistration();
    const repeatPassError = page.locator('#repeatedPassword\\.errors, span[id*="repeatedPassword.errors"], span.error');
    await expect(repeatPassError.first()).toBeVisible();
    await expect(repeatPassError.first()).toHaveText(/Passwords did not match\./);
  });

  /**
   * @testcase TC-REG-006
   * @type Negative
   * @goal Verify submitting completely blank registration form displays required field errors.
   */
  test('TC-REG-006: Validation of Blank Mandatory Registration Fields', async ({ registerPage, page }) => {
    await registerPage.navigate();
    await registerPage.submitRegistration();
    // Verify field-level validation errors
    const errorSpans = page.locator('span.error, span[id*="errors"]');
    await expect(errorSpans.first()).toBeVisible();
  });

  /**
   * @testcase TC-REG-007
   * @type Negative
   * @goal Verify registration fails when password is left blank.
   */
  test('TC-REG-007: Registration Failure with Missing Password', async ({ registerPage, page }) => {
    await registerPage.navigate();
    const user = generateUniqueUser();
    await registerPage.fillRegistrationForm({
      ...user,
      password: '',
      repeatedPassword: ''
    });
    await registerPage.submitRegistration();
    const passError = page.locator('#customer\\.password\\.errors, span[id*="password.errors"], span.error');
    await expect(passError.first()).toBeVisible();
  });

  /**
   * @testcase TC-REG-008
   * @type Edge
   * @goal Verify registration handles maximum length inputs gracefully.
   */
  test('TC-REG-008: Registration with Maximum Permissible Field Lengths', async ({ registerPage, page }) => {
    const ts = Date.now();
    await registerPage.navigate();
    await registerPage.fillRegistrationForm({
      firstName: 'A'.repeat(50),
      lastName: 'B'.repeat(50),
      address: 'C'.repeat(80),
      city: 'Springfield',
      state: 'CA',
      zipCode: '90210',
      phone: '1234567890',
      ssn: '123-45-6789',
      username: `maxlen_${ts}`,
      password: 'TestPassword123!',
      repeatedPassword: 'TestPassword123!'
    });
    await registerPage.submitRegistration();
    await expect(page.locator('#rightPanel')).toBeVisible();
  });

  /**
   * @testcase TC-REG-009
   * @type Edge
   * @goal Verify registration handles leading and trailing whitespaces in inputs.
   */
  test('TC-REG-009: Registration with Whitespace Padding Around Inputs', async ({ registerPage, page }) => {
    const ts = Date.now();
    await registerPage.navigate();
    await registerPage.fillRegistrationForm({
      firstName: '  Jane  ',
      lastName: '  Doe  ',
      address: '  123 Space St  ',
      city: 'Springfield',
      state: 'CA',
      zipCode: '90210',
      phone: '1234567890',
      ssn: '123-45-6789',
      username: `trimmed_${ts}`,
      password: 'TestPassword123!',
      repeatedPassword: 'TestPassword123!'
    });
    await registerPage.submitRegistration();
    await expect(page.locator('#rightPanel')).toBeVisible();
  });

});
