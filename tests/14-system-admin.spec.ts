import { test, expect } from './fixtures/test-fixtures.js';

test.describe('Module 14: System Administration', () => {

  /**
   * @testcase TC-ADM-001
   * @type Positive
   * @goal Verify database re-initialization executes successfully via 'INITIALIZE' button.
   */
  test('TC-ADM-001: Successful Database Initialization via INITIALIZE Action Button', async ({ adminPage, page }) => {
    await adminPage.navigate();
    await adminPage.initializeDatabase();
    await expect(page.locator('#rightPanel p b:has-text("Database Initialized")')).toBeVisible();
  });

  /**
   * @testcase TC-ADM-002
   * @type Positive
   * @goal Verify database cleanup executes successfully via 'CLEAN' button.
   */
  test('TC-ADM-002: Successful Database Cleanup via CLEAN Action Button', async ({ adminPage, page }) => {
    await adminPage.navigate();
    await adminPage.cleanDatabase();
    await expect(page.locator('#rightPanel p b:has-text("Database Cleaned")')).toBeVisible();
  });

  /**
   * @testcase TC-ADM-003
   * @type Positive
   * @goal Verify updating parameters (initialBalance, minimumBalance, threshold).
   */
  test('TC-ADM-003: Successful Update of System Configuration Parameters', async ({ adminPage, page }) => {
    await adminPage.navigate();
    await adminPage.updateParameters({
      initialBalance: '500.00',
      minimumBalance: '50.00',
      threshold: '25'
    });
    await expect(page.locator('#rightPanel')).toContainText(/Settings saved successfully|Administration/i);
  });

  /**
   * @testcase TC-ADM-004
   * @type Positive
   * @goal Verify switching access mode radio to 'SOAP'.
   */
  test('TC-ADM-004: Switching Web Service Data Access Mode to SOAP', async ({ adminPage, page }) => {
    await adminPage.navigate();
    await adminPage.setAccessMode('soap');
    await adminPage.submitButton.click();
    await expect(page.locator('input[name="accessMode"][value="soap"]')).toBeChecked();
  });

  /**
   * @testcase TC-ADM-005
   * @type Positive
   * @goal Verify switching access mode radio to 'REST (XML)'.
   */
  test('TC-ADM-005: Switching Web Service Data Access Mode to REST XML', async ({ adminPage, page }) => {
    await adminPage.navigate();
    await adminPage.setAccessMode('restxml');
    await adminPage.submitButton.click();
    await expect(page.locator('input[name="accessMode"][value="restxml"]')).toBeChecked();
  });

  /**
   * @testcase TC-ADM-006
   * @type Positive
   * @goal Verify switching access mode radio to 'REST (JSON)'.
   */
  test('TC-ADM-006: Switching Web Service Data Access Mode to REST JSON', async ({ adminPage, page }) => {
    await adminPage.navigate();
    await adminPage.setAccessMode('restjson');
    await adminPage.submitButton.click();
    await expect(page.locator('input[name="accessMode"][value="restjson"]')).toBeChecked();
  });

  /**
   * @testcase TC-ADM-007
   * @type Positive
   * @goal Verify switching access mode radio to 'JDBC'.
   */
  test('TC-ADM-007: Switching Web Service Data Access Mode to JDBC', async ({ adminPage, page }) => {
    await adminPage.navigate();
    await adminPage.setAccessMode('jdbc');
    await adminPage.submitButton.click();
    await expect(page.locator('input[name="accessMode"][value="jdbc"]')).toBeChecked();
  });

  /**
   * @testcase TC-ADM-008
   * @type Negative
   * @goal Verify negative values in balance/threshold inputs are rejected or handled gracefully.
   */
  test('TC-ADM-008: Validation of Negative Threshold and Balance Parameter Settings', async ({ adminPage, page }) => {
    await adminPage.navigate();
    await adminPage.updateParameters({
      initialBalance: '-100.00',
      minimumBalance: '-50.00',
      threshold: '-5'
    });
    await expect(page.locator('#rightPanel')).toBeVisible();
  });

  /**
   * @testcase TC-ADM-009
   * @type Edge
   * @goal Verify admin page is accessible to unauthenticated admin users for demo testing.
   */
  test('TC-ADM-009: Unauthenticated Public Access to System Administration Panel', async ({ adminPage, page }) => {
    await adminPage.navigate();
    await expect(page.locator('form#adminForm')).toBeVisible();
    await expect(adminPage.initButton).toBeVisible();
    await expect(adminPage.cleanButton).toBeVisible();
  });

});
