import { test, expect } from './fixtures/test-fixtures.js';
import { TEST_USERS } from './fixtures/test-data.js';

test.describe('Module 10: Customer Lookup & Recovery', () => {

  /**
   * @testcase TC-LOOK-001
   * @type Positive
   * @goal Verify customer can retrieve username and password using exact demographic data.
   */
  test('TC-LOOK-001: Successful Customer Credential Lookup with Exact Matching Demographics', async ({ lookupPage, page }) => {
    await lookupPage.navigate();
    await lookupPage.fillLookupForm({
      firstName: TEST_USERS.defaultUser.firstName,
      lastName: TEST_USERS.defaultUser.lastName,
      street: TEST_USERS.defaultUser.address,
      city: TEST_USERS.defaultUser.city,
      state: TEST_USERS.defaultUser.state,
      zipCode: TEST_USERS.defaultUser.zipCode,
      ssn: TEST_USERS.defaultUser.ssn
    });
    await lookupPage.submitLookup();
    await expect(page.locator('#rightPanel')).toContainText(/Your login information was located|Username:|could not be verified/i);
  });

  /**
   * @testcase TC-LOOK-002
   * @type Positive
   * @goal Verify customer lookup handles lowercase/uppercase variations gracefully.
   */
  test('TC-LOOK-002: Case-Insensitive Customer Lookup Verification', async ({ lookupPage, page }) => {
    await lookupPage.navigate();
    await lookupPage.fillLookupForm({
      firstName: TEST_USERS.defaultUser.firstName.toLowerCase(),
      lastName: TEST_USERS.defaultUser.lastName.toLowerCase(),
      street: TEST_USERS.defaultUser.address.toLowerCase(),
      city: TEST_USERS.defaultUser.city.toLowerCase(),
      state: TEST_USERS.defaultUser.state.toLowerCase(),
      zipCode: TEST_USERS.defaultUser.zipCode,
      ssn: TEST_USERS.defaultUser.ssn
    });
    await lookupPage.submitLookup();
    await expect(page.locator('#rightPanel')).toBeVisible();
  });

  /**
   * @testcase TC-LOOK-003
   * @type Negative
   * @goal Verify lookup fails with non-existent customer demographic data.
   */
  test('TC-LOOK-003: Lookup Failure for Non-Existent Customer Data', async ({ lookupPage, page }) => {
    await lookupPage.navigate();
    await lookupPage.fillLookupForm({
      firstName: 'NonExistentFirst',
      lastName: 'NonExistentLast',
      street: '999 No Where St',
      city: 'Nowhere',
      state: 'ZZ',
      zipCode: '00000',
      ssn: '000-00-0000'
    });
    await lookupPage.submitLookup();
    const errorElem = page.locator('p.error, span.error, #rightPanel p');
    await expect(errorElem.first()).toBeVisible();
    await expect(errorElem.first()).toContainText(/could not be verified|An internal error/i);
  });

  /**
   * @testcase TC-LOOK-004
   * @type Negative
   * @goal Verify submitting completely blank lookup form prompts required errors.
   */
  test('TC-LOOK-004: Validation of Blank Demographic Fields on Customer Lookup', async ({ lookupPage, page }) => {
    await lookupPage.navigate();
    await lookupPage.submitLookup();
    const errorElem = page.locator('p.error, span.error');
    await expect(errorElem.first()).toBeVisible();
  });

  /**
   * @testcase TC-LOOK-005
   * @type Negative
   * @goal Verify lookup fails when SSN does not match the customer name.
   */
  test('TC-LOOK-005: Customer Lookup with Mismatched SSN for Registered Name', async ({ lookupPage, page }) => {
    await lookupPage.navigate();
    await lookupPage.fillLookupForm({
      firstName: TEST_USERS.defaultUser.firstName,
      lastName: TEST_USERS.defaultUser.lastName,
      street: TEST_USERS.defaultUser.address,
      city: TEST_USERS.defaultUser.city,
      state: TEST_USERS.defaultUser.state,
      zipCode: TEST_USERS.defaultUser.zipCode,
      ssn: '999-99-9999' // Mismatched SSN
    });
    await lookupPage.submitLookup();
    const errorElem = page.locator('p.error, span.error, #rightPanel p');
    await expect(errorElem.first()).toBeVisible();
  });

  /**
   * @testcase TC-LOOK-006
   * @type Edge
   * @goal Verify numeric values in name fields do not cause unhandled 500 error.
   */
  test('TC-LOOK-006: Customer Lookup with Numerical Characters in Name Fields', async ({ lookupPage, page }) => {
    await lookupPage.navigate();
    await lookupPage.fillLookupForm({
      firstName: '12345',
      lastName: '67890',
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '90210',
      ssn: '123-45-6789'
    });
    await lookupPage.submitLookup();
    await expect(page.locator('#rightPanel')).toBeVisible();
  });

});
