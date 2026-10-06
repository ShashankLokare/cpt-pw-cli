import { Page, Locator } from '@playwright/test';

/**
 * BasePage encapsulating shared navigation, layout panels, and standard assertions
 */
export class BasePage {
  readonly page: Page;
  readonly logoLink: Locator;
  readonly homeLink: Locator;
  readonly aboutUsLink: Locator;
  readonly contactLink: Locator;
  readonly openAccountLink: Locator;
  readonly overviewLink: Locator;
  readonly transferFundsLink: Locator;
  readonly billPayLink: Locator;
  readonly findTransLink: Locator;
  readonly updateProfileLink: Locator;
  readonly requestLoanLink: Locator;
  readonly logOutLink: Locator;
  readonly pageHeading: Locator;
  readonly alertMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logoLink = page.locator('img[title="ParaBank"]');
    this.homeLink = page.locator('ul.leftmenu a[href*="index.htm"], ul.button a[href*="index.htm"]').first();
    this.aboutUsLink = page.locator('ul.leftmenu a[href*="about.htm"], ul.button a[href*="about.htm"]').first();
    this.contactLink = page.locator('ul.leftmenu a[href*="contact.htm"], ul.button a[href*="contact.htm"]').first();
    
    // Left navigation panel for authenticated users
    this.openAccountLink = page.locator('a[href*="openaccount.htm"]');
    this.overviewLink = page.locator('a[href*="overview.htm"]');
    this.transferFundsLink = page.locator('a[href*="transfer.htm"]');
    this.billPayLink = page.locator('a[href*="billpay.htm"]');
    this.findTransLink = page.locator('a[href*="findtrans.htm"]');
    this.updateProfileLink = page.locator('a[href*="updateprofile.htm"]');
    this.requestLoanLink = page.locator('a[href*="requestloan.htm"]');
    this.logOutLink = page.locator('a[href*="logout.htm"]');
    this.pageHeading = page.locator('h1.title, h2.title, #rightPanel h1').first();
    this.alertMessage = page.locator('p.error, div[role="alert"], p:has-text("An internal error has occurred")').first();
  }

  async goto(path: string) {
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async logout() {
    if (await this.logOutLink.isVisible()) {
      await this.logOutLink.click();
    }
  }
}
