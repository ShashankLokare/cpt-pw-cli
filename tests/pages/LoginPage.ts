import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly forgotLoginLink: Locator;
  readonly registerLink: Locator;
  readonly errorMessage: Locator;
  readonly smallText: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('input[type="submit"][value="Log In"]');
    this.forgotLoginLink = page.locator('a[href*="lookup.htm"]');
    this.registerLink = page.locator('a[href*="register.htm"]');
    this.errorMessage = page.locator('p.error');
    this.smallText = page.locator('.smallText');
  }

  async navigate() {
    await this.goto('index.htm');
  }

  async login(username?: string, password?: string) {
    if (username !== undefined) {
      await this.usernameInput.fill(username);
    }
    if (password !== undefined) {
      await this.passwordInput.fill(password);
    }
    await this.loginButton.click();
  }
}
