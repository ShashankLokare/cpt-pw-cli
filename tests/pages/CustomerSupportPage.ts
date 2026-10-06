import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';

export interface SupportMessageData {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export class CustomerSupportPage extends BasePage {
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly messageTextarea: Locator;
  readonly sendButton: Locator;
  readonly nameError: Locator;
  readonly emailError: Locator;
  readonly phoneError: Locator;
  readonly messageError: Locator;
  readonly confirmationMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.nameInput = page.locator('input#name');
    this.emailInput = page.locator('input#email');
    this.phoneInput = page.locator('input#phone');
    this.messageTextarea = page.locator('textarea#message');
    this.sendButton = page.locator('input[type="submit"][value="Send to Customer Care"]');

    this.nameError = page.locator('#name\\.errors, span[id*="name.errors"]');
    this.emailError = page.locator('#email\\.errors, span[id*="email.errors"]');
    this.phoneError = page.locator('#phone\\.errors, span[id*="phone.errors"]');
    this.messageError = page.locator('#message\\.errors, span[id*="message.errors"]');
    this.confirmationMessage = page.locator('#rightPanel p:has-text("Thank you"), #rightPanel p:has-text("A Customer Care Representative will be contacting you.")');
  }

  async navigate() {
    await this.goto('contact.htm');
  }

  async fillSupportMessage(data: SupportMessageData) {
    if (data.name !== undefined) await this.nameInput.fill(data.name);
    if (data.email !== undefined) await this.emailInput.fill(data.email);
    if (data.phone !== undefined) await this.phoneInput.fill(data.phone);
    if (data.message !== undefined) await this.messageTextarea.fill(data.message);
  }

  async submitMessage() {
    await this.sendButton.click();
  }
}
