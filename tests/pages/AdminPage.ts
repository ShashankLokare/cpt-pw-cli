import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class AdminPage extends BasePage {
  readonly initButton: Locator;
  readonly cleanButton: Locator;
  readonly jmsShutdownButton: Locator;
  readonly soapEndpointInput: Locator;
  readonly restEndpointInput: Locator;
  readonly endpointInput: Locator;
  readonly initialBalanceInput: Locator;
  readonly minimumBalanceInput: Locator;
  readonly loanProviderSelect: Locator;
  readonly loanProcessorSelect: Locator;
  readonly loanThresholdInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.initButton = page.locator('input[type="submit"][name="action"][value="INIT"], button[value="INIT"], input[value="INIT"]');
    this.cleanButton = page.locator('input[type="submit"][name="action"][value="CLEAN"], button[value="CLEAN"], input[value="CLEAN"]');
    this.jmsShutdownButton = page.locator('form[action*="jms.htm"] input[type="submit"]');
    this.soapEndpointInput = page.locator('input#soapEndpoint');
    this.restEndpointInput = page.locator('input#restEndpoint');
    this.endpointInput = page.locator('input#endpoint');
    this.initialBalanceInput = page.locator('input#initialBalance');
    this.minimumBalanceInput = page.locator('input#minimumBalance');
    this.loanProviderSelect = page.locator('select#loanProvider');
    this.loanProcessorSelect = page.locator('select#loanProcessor');
    this.loanThresholdInput = page.locator('input#loanProcessorThreshold');
    this.submitButton = page.locator('form#adminForm input[type="submit"][value="Submit"]');
    this.successMessage = page.locator('#rightPanel p b:has-text("Database Initialized"), #rightPanel p b:has-text("Database Cleaned"), #rightPanel p:has-text("Settings saved successfully")');
  }

  async navigate() {
    await this.goto('admin.htm');
  }

  async initializeDatabase() {
    await this.initButton.click();
  }

  async cleanDatabase() {
    await this.cleanButton.click();
  }

  async setAccessMode(modeValue: 'soap' | 'restxml' | 'restjson' | 'jdbc') {
    const radio = this.page.locator(`input[name="accessMode"][value="${modeValue}"]`);
    await radio.check();
  }

  async updateParameters(params: {
    initialBalance?: string;
    minimumBalance?: string;
    threshold?: string;
    loanProvider?: string;
    loanProcessor?: string;
  }) {
    if (params.initialBalance !== undefined) await this.initialBalanceInput.fill(params.initialBalance);
    if (params.minimumBalance !== undefined) await this.minimumBalanceInput.fill(params.minimumBalance);
    if (params.threshold !== undefined) await this.loanThresholdInput.fill(params.threshold);
    if (params.loanProvider !== undefined) await this.loanProviderSelect.selectOption(params.loanProvider);
    if (params.loanProcessor !== undefined) await this.loanProcessorSelect.selectOption(params.loanProcessor);
    await this.submitButton.click();
  }
}
