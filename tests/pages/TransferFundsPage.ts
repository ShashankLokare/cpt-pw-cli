import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class TransferFundsPage extends BasePage {
  readonly amountInput: Locator;
  readonly fromAccountSelect: Locator;
  readonly toAccountSelect: Locator;
  readonly transferButton: Locator;
  readonly amountError: Locator;
  readonly resultContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.amountInput = page.locator('input#amount');
    this.fromAccountSelect = page.locator('select#fromAccountId');
    this.toAccountSelect = page.locator('select#toAccountId');
    this.transferButton = page.locator('input[type="submit"][value="Transfer"]');
    this.amountError = page.locator('#amount\\.errors');
    this.resultContainer = page.locator('#showResult');
  }

  async navigate() {
    await this.goto('transfer.htm');
  }

  async transfer(amount: string, fromAccount?: string, toAccount?: string) {
    await this.amountInput.fill(amount);
    if (fromAccount) {
      await this.fromAccountSelect.selectOption(fromAccount);
    }
    if (toAccount) {
      await this.toAccountSelect.selectOption(toAccount);
    }
    await this.transferButton.click();
  }
}
