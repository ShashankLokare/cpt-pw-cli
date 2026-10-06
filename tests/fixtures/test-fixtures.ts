import { test as baseTest, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { AccountsOverviewPage } from '../pages/AccountsOverviewPage.js';
import { OpenAccountPage } from '../pages/OpenAccountPage.js';
import { TransferFundsPage } from '../pages/TransferFundsPage.js';
import { BillPayPage } from '../pages/BillPayPage.js';
import { FindTransactionsPage } from '../pages/FindTransactionsPage.js';
import { UpdateProfilePage } from '../pages/UpdateProfilePage.js';
import { RequestLoanPage } from '../pages/RequestLoanPage.js';
import { RegistrationPage } from '../pages/RegistrationPage.js';
import { CustomerLookupPage } from '../pages/CustomerLookupPage.js';
import { CustomerSupportPage } from '../pages/CustomerSupportPage.js';
import { AdminPage } from '../pages/AdminPage.js';
import { StaticContentPage } from '../pages/StaticContentPage.js';
import { TEST_USERS } from './test-data.js';

type CustomFixtures = {
  loginPage: LoginPage;
  overviewPage: AccountsOverviewPage;
  openAccountPage: OpenAccountPage;
  transferPage: TransferFundsPage;
  billPayPage: BillPayPage;
  findTransPage: FindTransactionsPage;
  profilePage: UpdateProfilePage;
  loanPage: RequestLoanPage;
  registerPage: RegistrationPage;
  lookupPage: CustomerLookupPage;
  supportPage: CustomerSupportPage;
  adminPage: AdminPage;
  staticPage: StaticContentPage;
  authenticatedSession: Page;
};

export const test = baseTest.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  overviewPage: async ({ page }, use) => {
    await use(new AccountsOverviewPage(page));
  },
  openAccountPage: async ({ page }, use) => {
    await use(new OpenAccountPage(page));
  },
  transferPage: async ({ page }, use) => {
    await use(new TransferFundsPage(page));
  },
  billPayPage: async ({ page }, use) => {
    await use(new BillPayPage(page));
  },
  findTransPage: async ({ page }, use) => {
    await use(new FindTransactionsPage(page));
  },
  profilePage: async ({ page }, use) => {
    await use(new UpdateProfilePage(page));
  },
  loanPage: async ({ page }, use) => {
    await use(new RequestLoanPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegistrationPage(page));
  },
  lookupPage: async ({ page }, use) => {
    await use(new CustomerLookupPage(page));
  },
  supportPage: async ({ page }, use) => {
    await use(new CustomerSupportPage(page));
  },
  adminPage: async ({ page }, use) => {
    await use(new AdminPage(page));
  },
  staticPage: async ({ page }, use) => {
    await use(new StaticContentPage(page));
  },
  authenticatedSession: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(TEST_USERS.defaultUser.username, TEST_USERS.defaultUser.password);
    // ensure overview or valid dashboard loaded
    await page.waitForLoadState('domcontentloaded');
    await use(page);
  }
});

export { expect };
