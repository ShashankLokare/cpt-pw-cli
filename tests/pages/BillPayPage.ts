import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';

export interface PayeeData {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phoneNumber?: string;
  accountNumber?: string;
  verifyAccount?: string;
  amount?: string;
  fromAccountId?: string;
}

export class BillPayPage extends BasePage {
  readonly payeeNameInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneNumberInput: Locator;
  readonly accountNumberInput: Locator;
  readonly verifyAccountInput: Locator;
  readonly amountInput: Locator;
  readonly fromAccountSelect: Locator;
  readonly sendPaymentButton: Locator;

  // Validation error locators matching app-inventory.json
  readonly nameError: Locator;
  readonly addressError: Locator;
  readonly cityError: Locator;
  readonly stateError: Locator;
  readonly zipCodeError: Locator;
  readonly phoneError: Locator;
  readonly accountError: Locator;
  readonly verifyAccountError: Locator;
  readonly amountError: Locator;
  readonly billpayResult: Locator;

  constructor(page: Page) {
    super(page);
    this.payeeNameInput = page.locator('input[name="payee.name"]');
    this.addressInput = page.locator('input[name="payee.address.street"]');
    this.cityInput = page.locator('input[name="payee.address.city"]');
    this.stateInput = page.locator('input[name="payee.address.state"]');
    this.zipCodeInput = page.locator('input[name="payee.address.zipCode"]');
    this.phoneNumberInput = page.locator('input[name="payee.phoneNumber"]');
    this.accountNumberInput = page.locator('input[name="payee.accountNumber"]');
    this.verifyAccountInput = page.locator('input[name="verifyAccount"]');
    this.amountInput = page.locator('input[name="amount"]');
    this.fromAccountSelect = page.locator('select[name="fromAccountId"]');
    this.sendPaymentButton = page.locator('input[type="button"][value="Send Payment"]');

    // DOM validation error IDs from inventory
    this.nameError = page.locator('#validationModel-name');
    this.addressError = page.locator('#validationModel-address');
    this.cityError = page.locator('#validationModel-city');
    this.stateError = page.locator('#validationModel-state');
    this.zipCodeError = page.locator('#validationModel-zipCode');
    this.phoneError = page.locator('#validationModel-phoneNumber');
    this.accountError = page.locator('#validationModel-accountNumber');
    this.verifyAccountError = page.locator('#validationModel-verifyAccount');
    this.amountError = page.locator('#validationModel-amount');
    this.billpayResult = page.locator('#billpayResult');
  }

  async navigate() {
    await this.goto('billpay.htm');
  }

  async fillPayeeDetails(data: PayeeData) {
    if (data.name !== undefined) await this.payeeNameInput.fill(data.name);
    if (data.address !== undefined) await this.addressInput.fill(data.address);
    if (data.city !== undefined) await this.cityInput.fill(data.city);
    if (data.state !== undefined) await this.stateInput.fill(data.state);
    if (data.zipCode !== undefined) await this.zipCodeInput.fill(data.zipCode);
    if (data.phoneNumber !== undefined) await this.phoneNumberInput.fill(data.phoneNumber);
    if (data.accountNumber !== undefined) await this.accountNumberInput.fill(data.accountNumber);
    if (data.verifyAccount !== undefined) await this.verifyAccountInput.fill(data.verifyAccount);
    if (data.amount !== undefined) await this.amountInput.fill(data.amount);
    if (data.fromAccountId !== undefined) await this.fromAccountSelect.selectOption(data.fromAccountId);
  }

  async submitPayment() {
    await this.sendPaymentButton.click();
  }
}
