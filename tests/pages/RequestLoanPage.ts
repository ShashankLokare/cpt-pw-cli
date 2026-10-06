import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class RequestLoanPage extends BasePage {
  readonly amountInput: Locator;
  readonly downPaymentInput: Locator;
  readonly fromAccountIdSelect: Locator;
  readonly applyButton: Locator;
  readonly loanStatusLabel: Locator;
  readonly loanProviderLabel: Locator;
  readonly errorMessage: Locator;
  readonly loanResultContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.amountInput = page.locator('input#amount');
    this.downPaymentInput = page.locator('input#downPayment');
    this.fromAccountIdSelect = page.locator('select#fromAccountId');
    this.applyButton = page.locator('input[type="button"][value="Apply Now"]');
    this.loanStatusLabel = page.locator('#loanStatus');
    this.loanProviderLabel = page.locator('#loanProviderName');
    this.errorMessage = page.locator('div.error, p.error');
    this.loanResultContainer = page.locator('#requestLoanResult, #rightPanel');
  }

  async navigate() {
    await this.goto('requestloan.htm');
  }

  async applyForLoan(amount: string, downPayment: string, fromAccount?: string) {
    await this.amountInput.fill(amount);
    await this.downPaymentInput.fill(downPayment);
    if (fromAccount) {
      await this.fromAccountIdSelect.selectOption(fromAccount);
    }
    await this.applyButton.click();
  }
}
