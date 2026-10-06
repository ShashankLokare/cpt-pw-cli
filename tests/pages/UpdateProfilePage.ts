import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';

export interface ProfileData {
  firstName?: string;
  lastName?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phoneNumber?: string;
}

export class UpdateProfilePage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneInput: Locator;
  readonly updateButton: Locator;

  // Validation error locators matching app-inventory.json
  readonly firstNameError: Locator;
  readonly lastNameError: Locator;
  readonly streetError: Locator;
  readonly cityError: Locator;
  readonly stateError: Locator;
  readonly zipCodeError: Locator;
  readonly updateSuccessMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('input[name="customer.firstName"]');
    this.lastNameInput = page.locator('input[name="customer.lastName"]');
    this.streetInput = page.locator('input[name="customer.address.street"]');
    this.cityInput = page.locator('input[name="customer.address.city"]');
    this.stateInput = page.locator('input[name="customer.address.state"]');
    this.zipCodeInput = page.locator('input[name="customer.address.zipCode"]');
    this.phoneInput = page.locator('input[name="customer.phoneNumber"]');
    this.updateButton = page.locator('input[type="button"][value="Update Profile"]');

    this.firstNameError = page.locator('#firstName-error, span[id*="firstName"]');
    this.lastNameError = page.locator('#lastName-error, span[id*="lastName"]');
    this.streetError = page.locator('#street-error, span[id*="street"]');
    this.cityError = page.locator('#city-error, span[id*="city"]');
    this.stateError = page.locator('#state-error, span[id*="state"]');
    this.zipCodeError = page.locator('#zipCode-error, span[id*="zipCode"]');
    this.updateSuccessMessage = page.locator('#updateProfileResult h1, #rightPanel h1.title:has-text("Profile Updated")');
  }

  async navigate() {
    await this.goto('updateprofile.htm');
  }

  async fillProfile(data: ProfileData) {
    if (data.firstName !== undefined) await this.firstNameInput.fill(data.firstName);
    if (data.lastName !== undefined) await this.lastNameInput.fill(data.lastName);
    if (data.street !== undefined) await this.streetInput.fill(data.street);
    if (data.city !== undefined) await this.cityInput.fill(data.city);
    if (data.state !== undefined) await this.stateInput.fill(data.state);
    if (data.zipCode !== undefined) await this.zipCodeInput.fill(data.zipCode);
    if (data.phoneNumber !== undefined) await this.phoneInput.fill(data.phoneNumber);
  }

  async submitUpdate() {
    await this.updateButton.click();
  }
}
