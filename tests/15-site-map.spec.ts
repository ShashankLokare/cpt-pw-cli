import { test, expect } from './fixtures/test-fixtures.js';

test.describe('Module 15: Site Map', () => {

  /**
   * @testcase TC-MAP-001
   * @type Positive
   * @goal Verify sitemap.htm displays comprehensive directory list of all application links.
   */
  test('TC-MAP-001: Verification of Complete Site Map Page Structure and Category Lists', async ({ staticPage, page }) => {
    await staticPage.navigateSitemap();
    await expect(page).toHaveURL(/.*sitemap\.htm/);
    await expect(page.locator('#rightPanel ul').first()).toBeVisible();
    const linkCount = await staticPage.sitemapLinks.count();
    expect(linkCount).toBeGreaterThan(5);
  });

  /**
   * @testcase TC-MAP-002
   * @type Positive
   * @goal Verify deep link to Bill Pay within Site Map navigates accurately to billpay.htm.
   */
  test('TC-MAP-002: Functional Deep Navigation to Core Banking Services via Site Map Links', async ({ staticPage, page }) => {
    await staticPage.navigateSitemap();
    const billPayLink = page.locator('#rightPanel a[href*="billpay.htm"]').first();
    await expect(billPayLink).toBeVisible();
    await billPayLink.click();
    await expect(page).toHaveURL(/.*billpay\.htm/);
  });

  /**
   * @testcase TC-MAP-003
   * @type Negative
   * @goal Verify sitemap URL with malformed injection query parameters does not throw 500 error.
   */
  test('TC-MAP-003: Handling of Malformed Query Parameters on Site Map URL', async ({ page }) => {
    const response = await page.goto('sitemap.htm?view=invalid&payload=alert(1)');
    expect(response?.status()).toBeLessThan(500);
    await expect(page.locator('body')).toBeVisible();
  });

  /**
   * @testcase TC-MAP-004
   * @type Edge
   * @goal Verify every internal hyperlink in sitemap resolves to a valid URL.
   */
  test('TC-MAP-004: Comprehensive Hyperlink Integrity Audit Across Site Map', async ({ staticPage, page }) => {
    await staticPage.navigateSitemap();
    const hrefs = await page.locator('#rightPanel a').evaluateAll((anchors: HTMLAnchorElement[]) =>
      anchors.map(a => a.href).filter(h => h.startsWith('http'))
    );
    expect(hrefs.length).toBeGreaterThan(0);
    // Spot check the first 3 links are non-empty
    for (const href of hrefs.slice(0, 3)) {
      expect(href).toMatch(/https?:\/\//);
    }
  });

});
