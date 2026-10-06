import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class AccountsOverviewPage extends BasePage {
  readonly accountTable: Locator;
  readonly accountRows: Locator;
  readonly totalBalanceCell: Locator;
  readonly internalErrorMsg: Locator;

  constructor(page: Page) {
    super(page);
    this.accountTable = page.locator('#accountTable');
    this.accountRows = page.locator('#accountTable tbody tr');
    this.totalBalanceCell = page.locator('#accountTable tr:has-text("Total") td.ng-binding, #accountTable b:has-text("Total")');
    this.internalErrorMsg = page.locator('p:has-text("An internal error has occurred and has been logged.")');
  }

  async navigate() {
    await this.goto('overview.htm');
  }

  async clickFirstAccountLink() {
    const firstLink = this.page.locator('#accountTable tbody tr a').first();
    await firstLink.click();
  }
}
