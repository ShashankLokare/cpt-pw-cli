import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class FindTransactionsPage extends BasePage {
  readonly accountSelect: Locator;
  readonly transactionIdInput: Locator;
  readonly findByIdButton: Locator;
  readonly transactionDateInput: Locator;
  readonly findByDateButton: Locator;
  readonly fromDateInput: Locator;
  readonly toDateInput: Locator;
  readonly findByDateRangeButton: Locator;
  readonly amountInput: Locator;
  readonly findByAmountButton: Locator;
  readonly transactionTable: Locator;
  readonly transactionRows: Locator;

  constructor(page: Page) {
    super(page);
    this.accountSelect = page.locator('select#accountId');
    this.transactionIdInput = page.locator('input#transactionId');
    this.findByIdButton = page.locator('#findById, button#findById, input#findById');
    this.transactionDateInput = page.locator('input#transactionDate');
    this.findByDateButton = page.locator('#findByDate, button#findByDate, input#findByDate');
    this.fromDateInput = page.locator('input#fromDate');
    this.toDateInput = page.locator('input#toDate');
    this.findByDateRangeButton = page.locator('#findByDateRange, button#findByDateRange, input#findByDateRange');
    this.amountInput = page.locator('input#amount');
    this.findByAmountButton = page.locator('#findByAmount, button#findByAmount, input#findByAmount');
    this.transactionTable = page.locator('#transactionTable');
    this.transactionRows = page.locator('#transactionTable tbody tr');
  }

  async navigate() {
    await this.goto('findtrans.htm');
  }

  async findById(id: string) {
    await this.transactionIdInput.fill(id);
    await this.findByIdButton.click();
  }

  async findByDate(dateStr: string) {
    await this.transactionDateInput.fill(dateStr);
    await this.findByDateButton.click();
  }

  async findByDateRange(from: string, to: string) {
    await this.fromDateInput.fill(from);
    await this.toDateInput.fill(to);
    await this.findByDateRangeButton.click();
  }

  async findByAmount(amount: string) {
    await this.amountInput.fill(amount);
    await this.findByAmountButton.click();
  }
}
