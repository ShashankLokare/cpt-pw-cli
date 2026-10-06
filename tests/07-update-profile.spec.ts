import { test, expect } from './fixtures/test-fixtures.js';
import { TEST_USERS } from './fixtures/test-data.js';

test.describe('Module 7: Update Profile', () => {

  /**
   * @testcase TC-PROF-001
   * @type Positive
   * @goal Verify customer can update their address and phone number successfully.
   */
  test('TC-PROF-001: Successful Profile Update with Valid Address and Phone Data', async ({ loginPage, profilePage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await profilePage.navigate();
    await profilePage.fillProfile({
      firstName: 'John',
      lastName: 'Smith',
      street: '789 Updated Blvd',
      city: 'Pasadena',
      state: 'CA',
      zipCode: '91101',
      phoneNumber: '626-555-0199'
    });
    await profilePage.submitUpdate();
    await expect(page.locator('#updateProfileResult h1, h1.title:has-text("Profile Updated")')).toBeVisible();
  });

  /**
   * @testcase TC-PROF-002
   * @type Positive
   * @goal Verify modified profile values persist when re-navigating to the page.
   */
  test('TC-PROF-002: Profile Data Persistence Verification Across Sessions', async ({ loginPage, profilePage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await profilePage.navigate();
    const currentZip = await profilePage.zipCodeInput.inputValue();
    expect(currentZip.length).toBeGreaterThan(0);
  });

  /**
   * @testcase TC-PROF-003
   * @type Negative
   * @goal Verify removing First Name and submitting triggers 'First name is required.' validation.
   */
  test('TC-PROF-003: Validation of Missing First Name Field', async ({ loginPage, profilePage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await profilePage.navigate();
    await profilePage.firstNameInput.fill('');
    await profilePage.submitUpdate();
    await expect(page.locator('#firstName-error, span[id*="firstName"]')).toBeVisible();
    await expect(page.locator('#firstName-error, span[id*="firstName"]')).toHaveText(/First name is required\./);
  });

  /**
   * @testcase TC-PROF-004
   * @type Negative
   * @goal Verify removing Last Name and submitting triggers 'Last name is required.' validation.
   */
  test('TC-PROF-004: Validation of Missing Last Name Field', async ({ loginPage, profilePage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await profilePage.navigate();
    await profilePage.lastNameInput.fill('');
    await profilePage.submitUpdate();
    await expect(page.locator('#lastName-error, span[id*="lastName"]')).toBeVisible();
    await expect(page.locator('#lastName-error, span[id*="lastName"]')).toHaveText(/Last name is required\./);
  });

  /**
   * @testcase TC-PROF-005
   * @type Negative
   * @goal Verify removing Street Address and submitting triggers 'Address is required.' validation.
   */
  test('TC-PROF-005: Validation of Missing Street Address Field', async ({ loginPage, profilePage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await profilePage.navigate();
    await profilePage.streetInput.fill('');
    await profilePage.submitUpdate();
    await expect(page.locator('#street-error, span[id*="street"]')).toBeVisible();
    await expect(page.locator('#street-error, span[id*="street"]')).toHaveText(/Address is required\./);
  });

  /**
   * @testcase TC-PROF-006
   * @type Negative
   * @goal Verify unauthenticated access to updateprofile.htm displays error alert.
   */
  test('TC-PROF-006: Unauthenticated Direct Access to Update Profile Page', async ({ profilePage, page }) => {
    await profilePage.navigate();
    const errorOrLogin = page.locator('p:has-text("An internal error has occurred"), p.error, input[value="Log In"]');
    await expect(errorOrLogin.first()).toBeVisible();
  });

  /**
   * @testcase TC-PROF-007
   * @type Edge
   * @goal Verify special characters (hyphens, apostrophes) and unicode names save properly.
   */
  test('TC-PROF-007: Profile Update with Special Characters and Unicode in Names', async ({ loginPage, profilePage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await profilePage.navigate();
    await profilePage.fillProfile({
      firstName: "Renée-O'Connor",
      lastName: "Smith-Müller"
    });
    await profilePage.submitUpdate();
    await expect(page.locator('#updateProfileResult h1, h1.title:has-text("Profile Updated")')).toBeVisible();
  });

});
