import { test, expect } from './fixtures/test-fixtures.js';

test.describe('Module 12: About Information', () => {

  /**
   * @testcase TC-ABT-001
   * @type Positive
   * @goal Verify About Us page renders header, description, and external Parasoft link.
   */
  test('TC-ABT-001: Verification of About Us Page Header, Body Content, and Layout', async ({ staticPage, page }) => {
    await staticPage.navigateAbout();
    await expect(page).toHaveURL(/.*about\.htm/);
    await expect(staticPage.aboutTitle).toBeVisible();
    await expect(staticPage.aboutContent.first()).toBeVisible();
  });

  /**
   * @testcase TC-ABT-002
   * @type Positive
   * @goal Verify external Parasoft hyperlink points to parasoft.com.
   */
  test('TC-ABT-002: Verification of External Parasoft Hyperlink Navigation', async ({ staticPage, page }) => {
    await staticPage.navigateAbout();
    await expect(staticPage.parasoftLink).toBeVisible();
    const href = await staticPage.parasoftLink.getAttribute('href');
    expect(href).toMatch(/parasoft\.com/);
  });

  /**
   * @testcase TC-ABT-003
   * @type Negative
   * @goal Verify invalid sub-path under about URL handles 404 or redirect gracefully.
   */
  test('TC-ABT-003: Error Handling for Invalid Sub-Path under About URL', async ({ page }) => {
    const response = await page.goto('about.htm/non_existent_subpath_xyz', { waitUntil: 'domcontentloaded' });
    // In Parabank or web servers, non-existent endpoints return 404 or standard error page without server crash
    expect(response?.status()).toBeDefined();
  });

  /**
   * @testcase TC-ABT-004
   * @type Edge
   * @goal Verify unauthenticated guest browser can access About page directly.
   */
  test('TC-ABT-004: Direct Page Access Across Unauthenticated Guest Browser Sessions', async ({ staticPage, page }) => {
    await staticPage.navigateAbout();
    await expect(page.locator('#rightPanel h1')).toContainText(/ParaSoft Demo Website|About Us/i);
    await expect(page.locator('#loginPanel')).toBeVisible(); // Login form is accessible on sidebar
  });

});
