import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';

export interface CustomerLookupData {
  firstName?: string;
  lastName?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  ssn?: string;
}

export class CustomerLookupPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly ssnInput: Locator;
  readonly findLoginButton: Locator;
  readonly lookupResult: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('input#firstName');
    this.lastNameInput = page.locator('input#lastName');
    this.streetInput = page.locator('input[name="address.street"], input#address\\.street');
    this.cityInput = page.locator('input[name="address.city"], input#address\\.city');
    this.stateInput = page.locator('input[name="address.state"], input#address\\.state');
    this.zipCodeInput = page.locator('input[name="address.zipCode"], input#address\\.zipCode');
    this.ssnInput = page.locator('input#ssn');
    this.findLoginButton = page.locator('input[type="submit"][value="Find My Login Info"]');
    this.lookupResult = page.locator('#rightPanel p:has-text("Your login information was located"), #rightPanel p:has-text("Username:")');
    this.errorMessage = page.locator('p.error, span.error');
  }

  async navigate() {
    await this.goto('lookup.htm');
  }

  async fillLookupForm(data: CustomerLookupData) {
    if (data.firstName !== undefined) await this.firstNameInput.fill(data.firstName);
    if (data.lastName !== undefined) await this.lastNameInput.fill(data.lastName);
    if (data.street !== undefined) await this.streetInput.fill(data.street);
    if (data.city !== undefined) await this.cityInput.fill(data.city);
    if (data.state !== undefined) await this.stateInput.fill(data.state);
    if (data.zipCode !== undefined) await this.zipCodeInput.fill(data.zipCode);
    if (data.ssn !== undefined) await this.ssnInput.fill(data.ssn);
  }

  async submitLookup() {
    await this.findLoginButton.click();
  }
}
