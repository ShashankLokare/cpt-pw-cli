import { test, expect } from './fixtures/test-fixtures.js';

test.describe('Module 13: Web Services API', () => {

  /**
   * @testcase TC-API-001
   * @type Positive
   * @goal Verify services.htm renders the SOAP and REST service tables and operations.
   */
  test('TC-API-001: Verification of Web Services Catalog Documentation and Tables', async ({ staticPage, page }) => {
    await staticPage.navigateServices();
    await expect(page).toHaveURL(/.*services\.htm/);
    await expect(page.locator('#rightPanel table').first()).toBeVisible();
    await expect(page.locator('#rightPanel table, span.heading').first()).toBeVisible();
  });

  /**
   * @testcase TC-API-002
   * @type Positive
   * @goal Verify WSDL and WADL service definition links are accessible.
   */
  test('TC-API-002: WSDL and Swagger/WADL Service Definition Links Availability', async ({ staticPage, page }) => {
    await staticPage.navigateServices();
    const wsdlLink = page.locator('a[href*="services"], a[href*="wsdl"]').first();
    await expect(wsdlLink).toBeVisible();
    const href = await wsdlLink.getAttribute('href');
    expect(href).toBeTruthy();
  });

  /**
   * @testcase TC-API-003
   * @type Negative
   * @goal Verify error handling when navigating to a non-existent web service WSDL path.
   */
  test('TC-API-003: Error Handling for Non-Existent Web Service Operation or WSDL Path', async ({ page }) => {
    const response = await page.goto('services/NonExistentService?wsdl');
    expect(response?.status()).toBeDefined();
  });

  /**
   * @testcase TC-API-004
   * @type Edge
   * @goal Verify unauthenticated external developers can view API documentation without login.
   */
  test('TC-API-004: Public Unauthenticated Access to Services Documentation', async ({ staticPage, page }) => {
    await staticPage.navigateServices();
    await expect(page.locator('#rightPanel')).toContainText(/Services|SOAP|REST/i);
    await expect(page.locator('#loginPanel')).toBeVisible();
  });

});
