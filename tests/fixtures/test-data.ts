/**
 * Test Data Factory & Canonical Test Constants
 * Derived from app-inventory.json and TEST_PLAN.md
 */

export const TEST_USERS = {
  defaultUser: {
    username: 'john',
    password: 'demo',
    firstName: 'John',
    lastName: 'Smith',
    address: '1431 Main St',
    city: 'Beverly Hills',
    state: 'CA',
    zipCode: '90210',
    phone: '310-447-4121',
    ssn: '123-45-6789'
  },
  invalidUser: {
    username: 'non_existent_user_99999',
    password: 'WrongPassword999!'
  }
};

export const TEST_ACCOUNTS = {
  primaryAccountId: '13344',
  checkingType: '0',
  savingsType: '1'
};

export const TEST_PAYEE = {
  valid: {
    name: 'Jane Doe',
    address: '123 Main Street',
    city: 'Springfield',
    state: 'CA',
    zipCode: '90210',
    phoneNumber: '+15551234567',
    accountNumber: '13344',
    verifyAccount: '13344',
    amount: '100.00'
  },
  mismatchedAccount: {
    name: 'Jane Doe',
    address: '123 Main Street',
    city: 'Springfield',
    state: 'CA',
    zipCode: '90210',
    phoneNumber: '+15551234567',
    accountNumber: '13344',
    verifyAccount: '99999',
    amount: '100.00'
  }
};

export const TEST_LOAN = {
  standardApproval: {
    amount: '1000.00',
    downPayment: '200.00'
  },
  insufficientDownPayment: {
    amount: '10000.00',
    downPayment: '1.00'
  }
};

export const TEST_SUPPORT = {
  validMessage: {
    name: 'Jane Doe',
    email: 'test.user@example.com',
    phone: '+15551234567',
    message: 'Automated test inquiry regarding transaction records and statements.'
  }
};

export function generateUniqueUser() {
  const ts = Date.now();
  return {
    firstName: `TestFirst${ts}`,
    lastName: `TestLast${ts}`,
    address: `${ts} Automation Way`,
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    phone: '415-555-0199',
    ssn: `${String(ts).slice(-3)}-00-${String(ts).slice(-4)}`,
    username: `user_${ts}`,
    password: 'TestPassword123!',
    repeatedPassword: 'TestPassword123!'
  };
}
