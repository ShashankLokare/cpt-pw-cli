import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class StaticContentPage extends BasePage {
  // About Us
  readonly parasoftLink: Locator;
  readonly aboutTitle: Locator;
  readonly aboutContent: Locator;

  // Web Services
  readonly servicesTable: Locator;
  readonly wsdlLinks: Locator;
  readonly bookStoreWsdlLink: Locator;

  // Site Map
  readonly sitemapLinks: Locator;

  constructor(page: Page) {
    super(page);
    this.parasoftLink = page.locator('#rightPanel a[href*="parasoft.com"]').first();
    this.aboutTitle = page.locator('h1.title:has-text("ParaSoft Demo Website"), #rightPanel h1').first();
    this.aboutContent = page.locator('#rightPanel p');

    this.servicesTable = page.locator('#rightPanel table').first();
    this.wsdlLinks = page.locator('a[href*="wsdl"], a[href*="?_wadl"], a[href*="swagger"]');
    this.bookStoreWsdlLink = page.locator('a[href*="services/store-01"]').first();

    this.sitemapLinks = page.locator('#rightPanel ul a');
  }

  async navigateAbout() {
    await this.goto('about.htm');
  }

  async navigateServices() {
    await this.goto('services.htm');
  }

  async navigateSitemap() {
    await this.goto('sitemap.htm');
  }
}
