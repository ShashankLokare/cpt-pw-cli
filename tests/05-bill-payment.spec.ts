import { test, expect } from './fixtures/test-fixtures.js';
import { TEST_USERS, TEST_PAYEE } from './fixtures/test-data.js';

test.describe('Module 5: Bill Payment', () => {

  /**
   * @testcase TC-BILL-001
   * @type Positive
   * @goal Verify successful bill payment dispatch with complete valid payee data.
   */
  test('TC-BILL-001: Successful Bill Payment Submission with Valid Payee Details', async ({ loginPage, billPayPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await billPayPage.navigate();
    await billPayPage.fillPayeeDetails(TEST_PAYEE.valid);
    await billPayPage.submitPayment();
    await expect(page.getByRole('heading', { name: 'Bill Payment Complete' })).toBeVisible();
    await expect(page.locator('#billpayResult')).toContainText(TEST_PAYEE.valid.name);
  });

  /**
   * @testcase TC-BILL-002
   * @type Positive
   * @goal Verify bill payment submission with large amount and extended address format.
   */
  test('TC-BILL-002: Successful Bill Payment with Large Amount and Extended Address', async ({ loginPage, billPayPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await billPayPage.navigate();
    await billPayPage.fillPayeeDetails({
      ...TEST_PAYEE.valid,
      name: 'Electric Utility Corp Services Ltd',
      address: 'Suite 450, 999 Long Industrial Boulevard',
      amount: '5432.10'
    });
    await billPayPage.submitPayment();
    await expect(page.getByRole('heading', { name: 'Bill Payment Complete' })).toBeVisible();
  });

  /**
   * @testcase TC-BILL-003
   * @type Negative
   * @goal Verify submitting completely blank form triggers mandatory field validation messages.
   */
  test('TC-BILL-003: Validation of All Blank Fields on Form Submission', async ({ loginPage, billPayPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await billPayPage.navigate();
    await billPayPage.submitPayment();
    
    // Assert all field validation error selectors from app-inventory.json
    await expect(billPayPage.nameError).toHaveText('Payee name is required.');
    await expect(billPayPage.addressError).toHaveText('Address is required.');
    await expect(billPayPage.cityError).toHaveText('City is required.');
    await expect(billPayPage.stateError).toHaveText('State is required.');
    await expect(billPayPage.zipCodeError).toHaveText('Zip Code is required.');
    await expect(billPayPage.phoneError).toHaveText('Phone number is required.');
    await expect(billPayPage.accountError).toHaveText('Account number is required.');
    await expect(billPayPage.verifyAccountError).toHaveText('Account number is required.');
    await expect(billPayPage.amountError).toHaveText('The amount cannot be empty.');
  });

  /**
   * @testcase TC-BILL-004
   * @type Negative
   * @goal Verify validation when only Payee Name is omitted.
   */
  test('TC-BILL-004: Validation of Payee Name Required Field', async ({ loginPage, billPayPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await billPayPage.navigate();
    await billPayPage.fillPayeeDetails({ ...TEST_PAYEE.valid, name: '' });
    await billPayPage.submitPayment();
    await expect(billPayPage.nameError).toHaveText('Payee name is required.');
  });

  /**
   * @testcase TC-BILL-005
   * @type Negative
   * @goal Verify validation when Street Address is omitted.
   */
  test('TC-BILL-005: Validation of Street Address Required Field', async ({ loginPage, billPayPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await billPayPage.navigate();
    await billPayPage.fillPayeeDetails({ ...TEST_PAYEE.valid, address: '' });
    await billPayPage.submitPayment();
    await expect(billPayPage.addressError).toHaveText('Address is required.');
  });

  /**
   * @testcase TC-BILL-006
   * @type Negative
   * @goal Verify validation when City is omitted.
   */
  test('TC-BILL-006: Validation of City Required Field', async ({ loginPage, billPayPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await billPayPage.navigate();
    await billPayPage.fillPayeeDetails({ ...TEST_PAYEE.valid, city: '' });
    await billPayPage.submitPayment();
    await expect(billPayPage.cityError).toHaveText('City is required.');
  });

  /**
   * @testcase TC-BILL-007
   * @type Negative
   * @goal Verify validation when State is omitted.
   */
  test('TC-BILL-007: Validation of State Required Field', async ({ loginPage, billPayPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await billPayPage.navigate();
    await billPayPage.fillPayeeDetails({ ...TEST_PAYEE.valid, state: '' });
    await billPayPage.submitPayment();
    await expect(billPayPage.stateError).toHaveText('State is required.');
  });

  /**
   * @testcase TC-BILL-008
   * @type Negative
   * @goal Verify validation when Zip Code is omitted.
   */
  test('TC-BILL-008: Validation of Zip Code Required Field', async ({ loginPage, billPayPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await billPayPage.navigate();
    await billPayPage.fillPayeeDetails({ ...TEST_PAYEE.valid, zipCode: '' });
    await billPayPage.submitPayment();
    await expect(billPayPage.zipCodeError).toHaveText('Zip Code is required.');
  });

  /**
   * @testcase TC-BILL-009
   * @type Negative
   * @goal Verify validation when Phone Number is omitted.
   */
  test('TC-BILL-009: Validation of Phone Number Required Field', async ({ loginPage, billPayPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await billPayPage.navigate();
    await billPayPage.fillPayeeDetails({ ...TEST_PAYEE.valid, phoneNumber: '' });
    await billPayPage.submitPayment();
    await expect(billPayPage.phoneError).toHaveText('Phone number is required.');
  });

  /**
   * @testcase TC-BILL-010
   * @type Negative
   * @goal Verify validation error when Account and Verify Account numbers do not match.
   */
  test('TC-BILL-010: Validation of Mismatched Account and Verify Account Numbers', async ({ loginPage, billPayPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await billPayPage.navigate();
    await billPayPage.fillPayeeDetails(TEST_PAYEE.mismatchedAccount);
    await billPayPage.submitPayment();
    await expect(billPayPage.verifyAccountError).toHaveText('The account numbers do not match.');
  });

  /**
   * @testcase TC-BILL-011
   * @type Edge
   * @goal Verify unauthenticated access to billpay.htm displays error alert.
   */
  test('TC-BILL-011: Unauthenticated Direct Access to Bill Pay Page', async ({ billPayPage, page }) => {
    await billPayPage.navigate();
    const errorOrLogin = page.locator('p:has-text("An internal error has occurred"), p.error, input[value="Log In"]');
    await expect(errorOrLogin.first()).toBeVisible();
  });

});
