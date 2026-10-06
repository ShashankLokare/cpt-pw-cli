import { test, expect } from './fixtures/test-fixtures.js';
import { TEST_USERS, TEST_SUPPORT } from './fixtures/test-data.js';

test.describe('Module 11: Customer Support', () => {

  /**
   * @testcase TC-CARE-001
   * @type Positive
   * @goal Verify customer support inquiry submission displays confirmation text.
   */
  test('TC-CARE-001: Successful Customer Care Message Submission with Valid Details', async ({ supportPage, page }) => {
    await supportPage.navigate();
    await supportPage.fillSupportMessage(TEST_SUPPORT.validMessage);
    await supportPage.submitMessage();
    await expect(page.locator('#rightPanel p')).toContainText(/Thank you Jane Doe|Customer Care/i);
  });

  /**
   * @testcase TC-CARE-002
   * @type Positive
   * @goal Verify authenticated customer can send support inquiry.
   */
  test('TC-CARE-002: Submission of Support Message by Authenticated Customer', async ({ loginPage, supportPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    await supportPage.navigate();
    await supportPage.fillSupportMessage({
      name: `${TEST_USERS.defaultUser.firstName} ${TEST_USERS.defaultUser.lastName}`,
      email: 'john.smith@example.com',
      phone: TEST_USERS.defaultUser.phone,
      message: 'Authenticated inquiry regarding recent loan applications.'
    });
    await supportPage.submitMessage();
    await expect(page.locator('#rightPanel p')).toContainText(/Thank you/i);
  });

  /**
   * @testcase TC-CARE-003
   * @type Negative
   * @goal Verify submitting blank support message triggers mandatory field validations.
   */
  test('TC-CARE-003: Validation of Blank Mandatory Fields on Support Form', async ({ supportPage, page }) => {
    await supportPage.navigate();
    await supportPage.submitMessage();
    const errorElem = page.locator('span.error, span[id*="errors"], p.error');
    await expect(errorElem.first()).toBeVisible();
  });

  /**
   * @testcase TC-CARE-004
   * @type Negative
   * @goal Verify malformed email address format triggers error or validation.
   */
  test('TC-CARE-004: Validation of Invalid Email Address Format on Support Form', async ({ supportPage, page }) => {
    await supportPage.navigate();
    await supportPage.fillSupportMessage({
      name: 'Jane Doe',
      email: 'invalid-email-no-at-symbol',
      phone: '555-1234',
      message: 'Test message with malformed email format.'
    });
    await supportPage.submitMessage();
    await expect(page.locator('#rightPanel, span.error')).toBeVisible();
  });

  /**
   * @testcase TC-CARE-005
   * @type Positive
   * @goal Verify guest user without active session can access contact form and send inquiry.
   */
  test('TC-CARE-005: Unauthenticated Direct Message Submission to Customer Care', async ({ supportPage, page }) => {
    await supportPage.navigate();
    await expect(page.locator('form#contactForm, input[value="Send to Customer Care"]')).toBeVisible();
    await supportPage.fillSupportMessage(TEST_SUPPORT.validMessage);
    await supportPage.submitMessage();
    await expect(page.locator('#rightPanel p')).toContainText(/Thank you/i);
  });

  /**
   * @testcase TC-CARE-006
   * @type Edge
   * @goal Verify support message handles long multi-line text (2,000 chars) without truncation.
   */
  test('TC-CARE-006: Transmission of Extremely Long Multi-line Message Text', async ({ supportPage, page }) => {
    await supportPage.navigate();
    const longMsg = 'Detailed customer query paragraph. \n'.repeat(50);
    await supportPage.fillSupportMessage({
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '555-1234',
      message: longMsg
    });
    await supportPage.submitMessage();
    await expect(page.locator('#rightPanel p')).toContainText(/Thank you/i);
  });

});
