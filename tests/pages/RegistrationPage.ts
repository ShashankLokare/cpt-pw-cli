import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';

export interface CustomerRegistrationData {
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  ssn?: string;
  username?: string;
  password?: string;
  repeatedPassword?: string;
}

export class RegistrationPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneInput: Locator;
  readonly ssnInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly repeatedPasswordInput: Locator;
  readonly registerButton: Locator;

  // Validation error locators
  readonly usernameError: Locator;
  readonly passwordError: Locator;
  readonly repeatPasswordError: Locator;
  readonly welcomeTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('input[name="customer.firstName"]');
    this.lastNameInput = page.locator('input[name="customer.lastName"]');
    this.addressInput = page.locator('input[name="customer.address.street"]');
    this.cityInput = page.locator('input[name="customer.address.city"]');
    this.stateInput = page.locator('input[name="customer.address.state"]');
    this.zipCodeInput = page.locator('input[name="customer.address.zipCode"]');
    this.phoneInput = page.locator('input[name="customer.phoneNumber"]');
    this.ssnInput = page.locator('input[name="customer.ssn"]');
    this.usernameInput = page.locator('input[name="customer.username"]');
    this.passwordInput = page.locator('input[name="customer.password"]');
    this.repeatedPasswordInput = page.locator('input[name="repeatedPassword"]');
    this.registerButton = page.locator('input[type="submit"][value="Register"]');

    this.usernameError = page.locator('#customer\\.username\\.errors, span[id*="username.errors"]');
    this.passwordError = page.locator('#customer\\.password\\.errors, span[id*="password.errors"]');
    this.repeatPasswordError = page.locator('#repeatedPassword\\.errors, span[id*="repeatedPassword.errors"]');
    this.welcomeTitle = page.locator('h1.title:has-text("Welcome"), #rightPanel p:has-text("Your account was created successfully")');
  }

  async navigate() {
    await this.goto('register.htm');
  }

  async fillRegistrationForm(data: CustomerRegistrationData) {
    if (data.firstName !== undefined) await this.firstNameInput.fill(data.firstName);
    if (data.lastName !== undefined) await this.lastNameInput.fill(data.lastName);
    if (data.address !== undefined) await this.addressInput.fill(data.address);
    if (data.city !== undefined) await this.cityInput.fill(data.city);
    if (data.state !== undefined) await this.stateInput.fill(data.state);
    if (data.zipCode !== undefined) await this.zipCodeInput.fill(data.zipCode);
    if (data.phone !== undefined) await this.phoneInput.fill(data.phone);
    if (data.ssn !== undefined) await this.ssnInput.fill(data.ssn);
    if (data.username !== undefined) await this.usernameInput.fill(data.username);
    if (data.password !== undefined) await this.passwordInput.fill(data.password);
    if (data.repeatedPassword !== undefined) await this.repeatedPasswordInput.fill(data.repeatedPassword);
  }

  async submitRegistration() {
    await this.registerButton.click();
  }
}
