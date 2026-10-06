import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class OpenAccountPage extends BasePage {
  readonly accountTypeSelect: Locator;
  readonly fromAccountIdSelect: Locator;
  readonly openAccountButton: Locator;
  readonly resultContainer: Locator;
  readonly newAccountIdLink: Locator;

  constructor(page: Page) {
    super(page);
    this.accountTypeSelect = page.locator('select#type');
    this.fromAccountIdSelect = page.locator('select#fromAccountId');
    this.openAccountButton = page.locator('input[type="button"][value="Open New Account"]');
    this.resultContainer = page.locator('#openAccountResult');
    this.newAccountIdLink = page.locator('#newAccountId, a#newAccountId');
  }

  async navigate() {
    await this.goto('openaccount.htm');
  }

  async selectAccountType(typeValue: string) {
    await this.accountTypeSelect.selectOption(typeValue);
  }

  async selectFromAccount(accountId?: string) {
    if (accountId) {
      await this.fromAccountIdSelect.selectOption(accountId);
    } else {
      // wait until populated and select first available
      await this.fromAccountIdSelect.waitFor();
    }
  }

  async submitOpenAccount() {
    await this.openAccountButton.click();
  }
}
