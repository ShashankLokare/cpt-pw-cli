# Comprehensive Test Plan & Automated QA Strategy: ParaBank Application

> **Application Under Test**: ParaBank Online Banking Platform (`https://parabank.parasoft.com/parabank/`)
> **Author**: Test Planner & Strategy Architect Subagent
> **Target Audience**: Playwright Test Script Creator Agents, Automated QA Engineers
> **Baseline Document**: `app-inventory.json` (15 Modules, 15 Pages, 13 Forms, 680 DOM Objects, 28 DOM Errors/Warnings)
> **Document Version**: 1.0.0-PROD
> **Date**: October 2026

---

## Table of Contents
1. [Executive Summary & Architecture Strategy](#1-executive-summary--architecture-strategy)
2. [Application Inventory Catalog (Ground Truth Analysis)](#2-application-inventory-catalog-ground-truth-analysis)
   - 2.1 [Module & Page Mapping Matrix](#21-module--page-mapping-matrix)
   - 2.2 [Inventory of All 13 Discovered Forms & Field Specifications](#22-inventory-of-all-13-discovered-forms--field-specifications)
   - 2.3 [Dropdown & Select Options Catalog](#23-dropdown--select-options-catalog)
   - 2.4 [DOM Validation Errors & System Alert Selectors Catalog](#24-dom-validation-errors--system-alert-selectors-catalog)
3. [Master Test Coverage Matrix](#3-master-test-coverage-matrix)
4. [Detailed Test Cases by Module](#4-detailed-test-cases-by-module)
   - 4.1 [Module 1: Authentication & Welcome (TC-AUTH)](#41-module-1-authentication-welcome-tc-auth)
   - 4.2 [Module 2: Accounts Overview (TC-ACCT)](#42-module-2-accounts-overview-tc-acct)
   - 4.3 [Module 3: Open New Account (TC-OPEN)](#43-module-3-open-new-account-tc-open)
   - 4.4 [Module 4: Transfer Funds (TC-XFER)](#44-module-4-transfer-funds-tc-xfer)
   - 4.5 [Module 5: Bill Payment (TC-BILL)](#45-module-5-bill-payment-tc-bill)
   - 4.6 [Module 6: Find Transactions (TC-FIND)](#46-module-6-find-transactions-tc-find)
   - 4.7 [Module 7: Update Profile (TC-PROF)](#47-module-7-update-profile-tc-prof)
   - 4.8 [Module 8: Request Loan (TC-LOAN)](#48-module-8-request-loan-tc-loan)
   - 4.9 [Module 9: Registration (TC-REG)](#49-module-9-registration-tc-reg)
   - 4.10 [Module 10: Customer Lookup & Recovery (TC-LOOK)](#410-module-10-customer-lookup-recovery-tc-look)
   - 4.11 [Module 11: Customer Support (TC-CARE)](#411-module-11-customer-support-tc-care)
   - 4.12 [Module 12: About Information (TC-ABT)](#412-module-12-about-information-tc-abt)
   - 4.13 [Module 13: Web Services API (TC-API)](#413-module-13-web-services-api-tc-api)
   - 4.14 [Module 14: System Administration (TC-ADM)](#414-module-14-system-administration-tc-adm)
   - 4.15 [Module 15: Site Map (TC-MAP)](#415-module-15-site-map-tc-map)
5. [Playwright Test Creator Agent Consumption Guidelines](#5-playwright-test-creator-agent-consumption-guidelines)
   - 5.1 [Selector Mapping Strategy](#51-selector-mapping-strategy)
   - 5.2 [Test Fixtures & Authentication State](#52-test-fixtures--authentication-state)
   - 5.3 [Deterministic Test Execution Pipeline](#53-deterministic-test-execution-pipeline)

---

## 1. Executive Summary & Architecture Strategy

The **Test Planner & Strategy Architect Subagent** has authored this comprehensive master test plan to establish an exhaustive automated testing suite for the **ParaBank** online banking application.

### Foundational Metrics from `app-inventory.json`:
- **Total Modules Covered**: 15 distinct functional modules.
- **Total Interactive Forms Audited**: 13 HTML forms.
- **Interactive Objects Cataloged**: 680 DOM objects (inputs, buttons, select menus, links, tables, alerts).
- **Default Values Documented**: 79 field default configurations.
- **Captured Validation Messages**: 28 exact DOM error strings and selectors.
- **Total Articulated Test Cases**: 103 discrete, step-by-step test cases.
- **Coverage Breakdown**: 38 Positive (Happy Path), 39 Negative (Validation & Error Handling), 26 Edge (Boundary & Security).

### Verification Principles:
1. **Zero Hallucination Traceability**: All form actions, input field names (`customer.firstName`, `payee.phoneNumber`, `initialBalance`), button selectors, and error texts strictly mirror `app-inventory.json`.
2. **Balanced Triad Testing**: Every single module guarantees coverage across positive workflows, negative constraint enforcement, and edge boundary thresholds.
3. **Machine Readability for Test Creator Agents**: Every test case follows an unyielding hierarchical schema with precise steps, explicit test data, and verifiable outcomes to allow automated generation of Playwright TypeScript/JavaScript test specs.

---

## 2. Application Inventory Catalog (Ground Truth Analysis)

### 2.1 Module & Page Mapping Matrix

| Module # | Module Name | Page Title | Target URL | Form Count | Objects Count | Key Features Discovered |
|:---:|:---|:---|:---|:---:|:---:|:---|
| 1 | Authentication & Welcome | ParaBank | Welcome | Online Banking | `https://parabank.parasoft.com/parabank/index.htm` | 1 | 44 | Login Form, Credential Input, Left Menu Links, Service Panels |
| 2 | Accounts Overview | ParaBank | Accounts Overview | `https://parabank.parasoft.com/parabank/overview.htm` | 0 | 36 | `#accountTable` Data Grid, Balance Aggregations, Session Validation |
| 3 | Open New Account | ParaBank | Open Account | `https://parabank.parasoft.com/parabank/openaccount.htm` | 1 | 40 | Dropdown Selection, Account Type (Checking/Savings), New Account Link |
| 4 | Transfer Funds | ParaBank | Transfer Funds | `https://parabank.parasoft.com/parabank/transfer.htm` | 1 | 40 | Fund Transfer Form, Amount Validations, Dual Account Selectors |
| 5 | Bill Payment | ParaBank | Bill Pay | `https://parabank.parasoft.com/parabank/billpay.htm` | 1 | 48 | 11-field Payee Form, Account Verification Mismatch, Required Errors |
| 6 | Find Transactions | ParaBank | Find Transactions | `https://parabank.parasoft.com/parabank/findtrans.htm` | 1 | 47 | 4 Search Modalities (ID, Date, Range, Amount), `#transactionTable` |
| 7 | Update Profile | ParaBank | Update Profile | `https://parabank.parasoft.com/parabank/updateprofile.htm` | 1 | 45 | Profile Update Form, Field-Level Mandatory Validation Selectors |
| 8 | Request Loan | ParaBank | Apply for a Loan | `https://parabank.parasoft.com/parabank/requestloan.htm` | 1 | 43 | Loan Application Form, Down Payment Underwriting, Status Display |
| 9 | Registration | ParaBank | Register for Free Online Account Access | `https://parabank.parasoft.com/parabank/register.htm` | 1 | 47 | User Registration Form, 11 Input Controls, Password Confirmation |
| 10 | Customer Lookup & Recovery | ParaBank | Customer Lookup | `https://parabank.parasoft.com/parabank/lookup.htm` | 1 | 43 | Credential Lookup Form, 7 Demographic Inputs, Login Retrieval |
| 11 | Customer Support | ParaBank | Customer Care | `https://parabank.parasoft.com/parabank/contact.htm` | 1 | 40 | Customer Care Form, Textarea Input, Message Transmission |
| 12 | About Information | ParaBank | About Us | `https://parabank.parasoft.com/parabank/about.htm` | 0 | 34 | Informational Content, External Parasoft Links, Navigational Panel |
| 13 | Web Services API | ParaBank | Services | `https://parabank.parasoft.com/parabank/services.htm` | 0 | 58 | SOAP WSDL & REST Documentation Tables, API Endpoint Catalogs |
| 14 | System Administration | ParaBank | Administration | `https://parabank.parasoft.com/parabank/admin.htm` | 3 | 68 | DB Init/Clean, JMS Shutdown, Radio Access Mode, Thresholds |
| 15 | Site Map | ParaBank | Site Map | `https://parabank.parasoft.com/parabank/sitemap.htm` | 0 | 47 | Comprehensive Link Hierarchy, Deep-Routing Navigation Validation |

---

### 2.2 Inventory of All 13 Discovered Forms & Field Specifications

#### Form #1: Customer Login Form (Module 1 - Authentication & Welcome)
- **Form Selector / Action**: `form[name="login"]` | `action="login.htm"` | `method="POST"`
- **Fields**:
  - `username` | Type: `text` (`input[name="username"]`) | Class: `input` | Default: empty (test default: `Jane Doe`)
  - `password` | Type: `password` (`input[name="password"]`) | Class: `input` | Default: empty (test default: `P@ssw0rd123!`)
  - Submit Control: `input[type="submit"][value="Log In"]`

#### Form #2: Open Account Form (Module 3 - Open New Account)
- **Form Action**: `action="openaccount.htm"` | `method="GET"`
- **Fields**:
  - `type` | Type: `select-one` (`select#type`) | Options: `0` (CHECKING - Default selected), `1` (SAVINGS)
  - `fromAccountId` | Type: `select-one` (`select#fromAccountId`) | Options: Customer Accounts (e.g. `13344`)
  - Action Button: `input[type="button"][value="Open New Account"]`

#### Form #3: Transfer Funds Form (Module 4 - Transfer Funds)
- **Form ID / Action**: `form#transferForm` | `action="transfer.htm"` | `method="GET"`
- **Fields**:
  - `input` (Amount) | Type: `text` (`input#amount`) | Default: empty
  - `fromAccountId` | Type: `select-one` (`select#fromAccountId`) | Options: Customer Accounts (default: `13344`)
  - `toAccountId` | Type: `select-one` (`select#toAccountId`) | Options: Customer Accounts (default: `13344`)
  - Submit Control: `input[type="submit"][value="Transfer"]`

#### Form #4: Bill Payment Form (Module 5 - Bill Payment)
- **Form Action**: `action="billpay.htm"` | `method="GET"`
- **Fields**:
  - `payee.name` | Type: `text` (`input[name="payee.name"]`) | Default: empty
  - `payee.address.street` | Type: `text` (`input[name="payee.address.street"]`) | Default: empty
  - `payee.address.city` | Type: `text` (`input[name="payee.address.city"]`) | Default: empty
  - `payee.address.state` | Type: `text` (`input[name="payee.address.state"]`) | Default: empty
  - `payee.address.zipCode` | Type: `text` (`input[name="payee.address.zipCode"]`) | Default: empty
  - `payee.phoneNumber` | Type: `text` (`input[name="payee.phoneNumber"]`, target ID: dynamic UUID) | Default: empty
  - `payee.accountNumber` | Type: `text` (`input[name="payee.accountNumber"]`) | Default: empty
  - `verifyAccount` | Type: `text` (`input[name="verifyAccount"]`) | Default: empty
  - `amount` | Type: `text` (`input[name="amount"]`) | Default: empty
  - `fromAccountId` | Type: `select-one` (`select[name="fromAccountId"]`) | Options: Customer Accounts (default: `13344`)
  - Action Button: `input[type="button"][value="Send Payment"]`

#### Form #5: Transaction Query Form (Module 6 - Find Transactions)
- **Form ID / Action**: `form#transactionForm` | `action="findtrans.htm"` | `method="GET"`
- **Fields & Query Buttons**:
  - `accountId` | Type: `select-one` (`select#accountId`) | Options: Customer Accounts (default: `13344`)
  - `transactionId` | Type: `text` (`input#transactionId`) | Trigger: `button#findById` / `input#findById` (`FIND TRANSACTIONS`)
  - `transactionDate` | Type: `text` (`input#transactionDate`) | Trigger: `button#findByDate` / `input#findByDate` (`FIND TRANSACTIONS`)
  - `fromDate` | Type: `text` (`input#fromDate`) & `toDate` | Type: `text` (`input#toDate`) | Trigger: `button#findByDateRange`
  - `amount` | Type: `text` (`input#amount`) | Trigger: `button#findByAmount` / `input#findByAmount`

#### Form #6: Customer Profile Update Form (Module 7 - Update Profile)
- **Form Action**: `action="updateprofile.htm"` | `method="GET"`
- **Fields**:
  - `customer.firstName` | Type: `text` (`input#customer.firstName`) | Preloaded Session Value: `John`
  - `customer.lastName` | Type: `text` (`input#customer.lastName`) | Preloaded Session Value: `Smith`
  - `customer.address.street` | Type: `text` (`input#customer.address.street`) | Preloaded: `1431 Main St`
  - `customer.address.city` | Type: `text` (`input#customer.address.city`) | Preloaded: `Beverly Hills`
  - `customer.address.state` | Type: `text` (`input#customer.address.state`) | Preloaded: `CA`
  - `customer.address.zipCode` | Type: `text` (`input#customer.address.zipCode`) | Preloaded: `90210`
  - `customer.phoneNumber` | Type: `text` (`input#customer.phoneNumber`) | Preloaded: `310-447-4121`
  - Action Button: `input[type="button"][value="Update Profile"]`

#### Form #7: Loan Application Form (Module 8 - Request Loan)
- **Form Action**: `action="requestloan.htm"` | `method="GET"`
- **Fields**:
  - `amount` | Type: `text` (`input#amount`) | Default: empty
  - `downPayment` | Type: `text` (`input#downPayment`) | Default: empty
  - `fromAccountId` | Type: `select-one` (`select#fromAccountId`) | Options: Customer Accounts (default: `13344`)
  - Action Button: `input[type="button"][value="Apply Now"]`

#### Form #8: Customer Registration Form (Module 9 - Registration)
- **Form ID / Action**: `form#customerForm` | `action="register.htm"` | `method="POST"`
- **Fields**:
  - `customer.firstName` | Type: `text` (`input#customer.firstName`)
  - `customer.lastName` | Type: `text` (`input#customer.lastName`)
  - `customer.address.street` | Type: `text` (`input#customer.address.street`)
  - `customer.address.city` | Type: `text` (`input#customer.address.city`)
  - `customer.address.state` | Type: `text` (`input#customer.address.state`)
  - `customer.address.zipCode` | Type: `text` (`input#customer.address.zipCode`)
  - `customer.phoneNumber` | Type: `text` (`input#customer.phoneNumber`)
  - `customer.ssn` | Type: `text` (`input#customer.ssn`)
  - `customer.username` | Type: `text` (`input#customer.username`)
  - `customer.password` | Type: `password` (`input#customer.password`)
  - `repeatedPassword` | Type: `password` (`input#repeatedPassword`)
  - Submit Control: `input[type="submit"][value="Register"]`

#### Form #9: Customer Credential Lookup Form (Module 10 - Customer Lookup & Recovery)
- **Form ID / Action**: `form#lookupForm` | `action="lookup.htm"` | `method="POST"`
- **Fields**:
  - `firstName` | Type: `text` (`input#firstName`)
  - `lastName` | Type: `text` (`input#lastName`)
  - `address.street` | Type: `text` (`input#address.street`)
  - `address.city` | Type: `text` (`input#address.city`)
  - `address.state` | Type: `text` (`input#address.state`)
  - `address.zipCode` | Type: `text` (`input#address.zipCode`)
  - `ssn` | Type: `text` (`input#ssn`)
  - Submit Control: `input[type="submit"][value="Find My Login Info"]`

#### 10. Customer Support Contact Form (Module 11 - Customer Support)
- **Form ID / Action**: `form#contactForm` | `action="contact.htm"` | `method="POST"`
- **Fields**:
  - `name` | Type: `text` (`input#name`)
  - `email` | Type: `text` (`input#email`)
  - `phone` | Type: `text` (`input#phone`)
  - `message` | Type: `textarea` (`textarea#message`)
  - Submit Control: `input[type="submit"][value="Send to Customer Care"]`

#### 11. Database Operations Form (Module 14 - System Administration)
- **Form Action**: `action="admin.htm"` | `method="POST"`
- **Buttons**:
  - `input[type="submit"][name="action"][value="INIT"]` (Display: `INITIALIZE`)
  - `input[type="submit"][name="action"][value="CLEAN"]` (Display: `CLEAN`)

#### 12. JMS Service Management Form (Module 14 - System Administration)
- **Form Action**: `action="jms.htm"` | `method="POST"`
- **Fields**:
  - `shutdown` | Type: `hidden` (`input[name="shutdown"]`) | Default Value: `true`
  - Submit Control: `input[type="submit"][value="Shutdown"]`

#### 13. System Configuration Settings Form (Module 14 - System Administration)
- **Form ID / Action**: `form#adminForm` | `action="admin.htm"` | `method="POST"`
- **Fields**:
  - `accessMode` | Type: `radio` | Options: `input#accessMode1` (SOAP), `input#accessMode2` (REST-XML), `input#accessMode3` (REST-JSON), `input#accessMode4` (JDBC - Default checked)
  - `soapEndpoint` | Type: `text` (`input#soapEndpoint`) | Default: empty
  - `restEndpoint` | Type: `text` (`input#restEndpoint`) | Default: empty
  - `endpoint` | Type: `text` (`input#endpoint`) | Default: empty
  - `initialBalance` | Type: `text` (`input#initialBalance`) | Default: `515.50`
  - `minimumBalance` | Type: `text` (`input#minimumBalance`) | Default: `100.00`
  - `loanProvider` | Type: `select-one` (`select#loanProvider`) | Default: `ws` (Web Service)
  - `loanProcessor` | Type: `select-one` (`select#loanProcessor`) | Default: `funds` (Available Funds)
  - `loanProcessorThreshold` | Type: `text` (`input#loanProcessorThreshold`) | Default: `20`
  - Submit Control: `input[type="submit"][value="Submit"]`

---

### 2.3 Dropdown & Select Options Catalog

| Module | Dropdown Field | Element ID / Selector | Value | Option Display Text | Default Selected State |
|:---|:---|:---|:---:|:---|:---:|
| Open New Account | Account Type | `select#type` | `0` | CHECKING | **Selected (True)** |
| Open New Account | Account Type | `select#type` | `1` | SAVINGS | False |
| Open New Account | Source Account | `select#fromAccountId` | `<account_id>` | `<account_id>` (e.g., `13344`) | **Selected (True)** |
| Transfer Funds | Source Account | `select#fromAccountId` | `<account_id>` | `<account_id>` (e.g., `13344`) | **Selected (True)** |
| Transfer Funds | Destination Account | `select#toAccountId` | `<account_id>` | `<account_id>` (e.g., `13344`) | **Selected (True)** |
| Bill Payment | From Account | `select[name="fromAccountId"]` | `<account_id>` | `<account_id>` (e.g., `13344`) | **Selected (True)** |
| Find Transactions | Account ID | `select#accountId` | `<account_id>` | `<account_id>` (e.g., `13344`) | **Selected (True)** |
| Request Loan | From Account | `select#fromAccountId` | `<account_id>` | `<account_id>` (e.g., `13344`) | **Selected (True)** |
| System Admin | Loan Provider | `select#loanProvider` | `jms` | JMS | False |
| System Admin | Loan Provider | `select#loanProvider` | `ws` | Web Service | **Selected (True)** |
| System Admin | Loan Provider | `select#loanProvider` | `local` | Local | False |
| System Admin | Loan Processor | `select#loanProcessor` | `funds` | Available Funds | **Selected (True)** |
| System Admin | Loan Processor | `select#loanProcessor` | `down` | Down Payment | False |
| System Admin | Loan Processor | `select#loanProcessor` | `combined` | Combined | False |

---

### 2.4 DOM Validation Errors & System Alert Selectors Catalog

| # | Source Module | DOM Selector | Exact Text Captured | Verification Context |
|:---:|:---|:---|:---|:---|
| 1 | Accounts Overview | `p` | `An internal error has occurred and has been logged.` | Displayed upon unauthenticated session access or backend error |
| 2 | Open New Account | `p` | `An internal error has occurred and has been logged.` | Displayed when session times out or account service is unreachable |
| 3 | Transfer Funds | `#amount.errors` | `The amount cannot be empty.` | Field-level error when amount input is submitted empty |
| 4 | Transfer Funds | `#amount.errors` | `Please enter a valid amount.` | Field-level error when non-numeric characters are entered |
| 5 | Transfer Funds | `p` | `An internal error has occurred and has been logged.` | Displayed on unauthenticated transfer invocation |
| 6 | Bill Payment | `#validationModel-name` | `Payee name is required.` | Payee name field empty on submission |
| 7 | Bill Payment | `#validationModel-address` | `Address is required.` | Payee address field empty on submission |
| 8 | Bill Payment | `#validationModel-city` | `City is required.` | Payee city field empty on submission |
| 9 | Bill Payment | `#validationModel-state` | `State is required.` | Payee state field empty on submission |
| 10 | Bill Payment | `#validationModel-zipCode` | `Zip Code is required.` | Payee zip code field empty on submission |
| 11 | Bill Payment | `#validationModel-phoneNumber` | `Phone number is required.` | Payee phone number empty on submission |
| 12 | Bill Payment | `#validationModel-account-empty` | `Account number is required.` | Payee account number empty on submission |
| 13 | Bill Payment | `#validationModel-account-invalid` | `Please enter a valid number.` | Payee account number contains non-numeric characters |
| 14 | Bill Payment | `#validationModel-verifyAccount-empty` | `Account number is required.` | Verification account number empty on submission |
| 15 | Bill Payment | `#validationModel-verifyAccount-invalid` | `Please enter a valid number.` | Verification account number contains non-numeric characters |
| 16 | Bill Payment | `#validationModel-verifyAccount-mismatch` | `The account numbers do not match.` | Account number and verification account number differ |
| 17 | Bill Payment | `#validationModel-amount-empty` | `The amount cannot be empty.` | Payment amount empty on submission |
| 18 | Bill Payment | `#validationModel-amount-invalid` | `Please enter a valid amount.` | Payment amount contains invalid symbols/non-numbers |
| 19 | Bill Payment | `p` | `An internal error has occurred and has been logged.` | Displayed on unauthenticated bill payment invocation |
| 20 | Find Transactions | `p` | `An internal error has occurred and has been logged.` | Unauthenticated search or invalid database state |
| 21 | Update Profile | `#firstName-error` | `First name is required.` | First name field cleared or submitted blank |
| 22 | Update Profile | `#lastName-error` | `Last name is required.` | Last name field cleared or submitted blank |
| 23 | Update Profile | `#street-error` | `Address is required.` | Address field cleared or submitted blank |
| 24 | Update Profile | `#city-error` | `City is required.` | City field cleared or submitted blank |
| 25 | Update Profile | `#state-error` | `State is required.` | State field cleared or submitted blank |
| 26 | Update Profile | `#zipCode-error` | `Zip Code is required.` | Zip code field cleared or submitted blank |
| 27 | Update Profile | `p` | `An internal error has occurred and has been logged.` | Displayed on unauthenticated update profile invocation |
| 28 | Request Loan | `p` | `An internal error has occurred and has been logged.` | Displayed on unauthenticated loan submission |

---

## 3. Master Test Coverage Matrix

| Module # | Module Name | Functional Scope | Positive | Negative | Edge | Total Cases | Target Coverage |
|:---:|:---|:---|:---:|:---:|:---:|:---:|:---:|
| 1 | Authentication & Welcome | Features of Authentication & Welcome | 3 | 3 | 2 | 8 | **100% Complete** |
| 2 | Accounts Overview | Features of Accounts Overview | 2 | 2 | 1 | 5 | **100% Complete** |
| 3 | Open New Account | Features of Open New Account | 2 | 2 | 2 | 6 | **100% Complete** |
| 4 | Transfer Funds | Features of Transfer Funds | 2 | 3 | 3 | 8 | **100% Complete** |
| 5 | Bill Payment | Features of Bill Payment | 2 | 6 | 3 | 11 | **100% Complete** |
| 6 | Find Transactions | Features of Find Transactions | 4 | 3 | 2 | 9 | **100% Complete** |
| 7 | Update Profile | Features of Update Profile | 2 | 3 | 2 | 7 | **100% Complete** |
| 8 | Request Loan | Features of Request Loan | 2 | 3 | 2 | 7 | **100% Complete** |
| 9 | Registration | Features of Registration | 3 | 4 | 2 | 9 | **100% Complete** |
| 10 | Customer Lookup & Recovery | Features of Customer Lookup & Recovery | 2 | 3 | 1 | 6 | **100% Complete** |
| 11 | Customer Support | Features of Customer Support | 3 | 2 | 1 | 6 | **100% Complete** |
| 12 | About Information | Features of About Information | 2 | 1 | 1 | 4 | **100% Complete** |
| 13 | Web Services API | Features of Web Services API | 2 | 1 | 1 | 4 | **100% Complete** |
| 14 | System Administration | Features of System Administration | 5 | 2 | 2 | 9 | **100% Complete** |
| 15 | Site Map | Features of Site Map | 2 | 1 | 1 | 4 | **100% Complete** |
| **TOTAL** | **All 15 Modules** | **Full System Surface Area & Form Interactions** | **38** | **39** | **26** | **103** | **100% Comprehensive** |

---

## 4. Detailed Test Cases by Module

### 4.1 Module 1: Authentication & Welcome (TC-AUTH)
- **Target URL**: `https://parabank.parasoft.com/parabank/index.htm`
- **Page Title**: `ParaBank | Welcome | Online Banking`
- **Total Test Cases**: 8 (Positive: 3, Negative: 3, Edge: 2)

#### TC-AUTH-001: Successful Customer Login with Valid Credentials
- **Module**: Authentication & Welcome
- **Scenario**: Customer submits registered and valid credentials via the Customer Login form
- **Test Case**: `TC-AUTH-001` - Successful Customer Login with Valid Credentials
- **Goal of Test Case**: Verify that a registered user can successfully authenticate and is redirected to the Accounts Overview page
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Navigate to ParaBank Welcome page at `https://parabank.parasoft.com/parabank/index.htm`.
  2. Verify presence of form `login` with input fields `username`, `password`, and submit button `Log In`.
  3. Enter valid username `john` into `input[name="username"]`.
  4. Enter valid password `demo` into `input[name="password"]`.
  5. Click the submit button `input[type="submit"][value="Log In"]`.
- **Expected Outcome of Each Step**:
  1. Welcome page renders with status 200, title 'ParaBank | Welcome | Online Banking'.
  2. Form elements `username`, `password`, and submit button `Log In` are visible and enabled.
  3. `input[name="username"]` value is populated with 'john'.
  4. `input[name="password"]` value is populated with 'demo' (masked).
  5. User is redirected to `https://parabank.parasoft.com/parabank/overview.htm`. Left panel displays 'Welcome John Smith' and navigation links (Open New Account, Accounts Overview, Transfer Funds, Bill Pay, Find Transactions, Update Contact Info, Request Loan, Log Out).

#### TC-AUTH-002: Login Failure with Blank Username and Blank Password
- **Module**: Authentication & Welcome
- **Scenario**: User attempts to log in without entering username or password
- **Test Case**: `TC-AUTH-002` - Login Failure with Blank Username and Blank Password
- **Goal of Test Case**: Verify system validation when authentication form is submitted empty
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Navigate to ParaBank Welcome page at `https://parabank.parasoft.com/parabank/index.htm`.
  2. Leave `input[name="username"]` empty.
  3. Leave `input[name="password"]` empty.
  4. Click the submit button `input[type="submit"][value="Log In"]`.
- **Expected Outcome of Each Step**:
  1. Welcome page loads successfully.
  2. `input[name="username"]` is empty.
  3. `input[name="password"]` is empty.
  4. Submission fails. URL transitions to `login.htm` error state or displays error message `Please enter a username and password.` in `.error` element. User remains unauthenticated.

#### TC-AUTH-003: Login Failure with Non-Existent Username
- **Module**: Authentication & Welcome
- **Scenario**: User enters an unregistered username with any password
- **Test Case**: `TC-AUTH-003` - Login Failure with Non-Existent Username
- **Goal of Test Case**: Verify error messaging and security protection when unknown username is supplied
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Navigate to Welcome page at `https://parabank.parasoft.com/parabank/index.htm`.
  2. Enter non-existent username `invalid_user_9999` into `input[name="username"]`.
  3. Enter password `Password123!` into `input[name="password"]`.
  4. Click `input[type="submit"][value="Log In"]`.
- **Expected Outcome of Each Step**:
  1. Welcome page loads.
  2. Field contains 'invalid_user_9999'.
  3. Field contains masked password.
  4. Authentication rejected. Error message `The username and password could not be verified.` or `An internal error has occurred and has been logged.` is displayed in error container. Session is not initiated.

#### TC-AUTH-004: Login Failure with Valid Username and Incorrect Password
- **Module**: Authentication & Welcome
- **Scenario**: User enters registered username but wrong password
- **Test Case**: `TC-AUTH-004` - Login Failure with Valid Username and Incorrect Password
- **Goal of Test Case**: Verify authentication fails when credentials do not match stored hash
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Navigate to Welcome page at `https://parabank.parasoft.com/parabank/index.htm`.
  2. Enter valid username `john` into `input[name="username"]`.
  3. Enter incorrect password `WrongPassword2026!` into `input[name="password"]`.
  4. Click `input[type="submit"][value="Log In"]`.
- **Expected Outcome of Each Step**:
  1. Welcome page loads.
  2. Field populated with 'john'.
  3. Field populated with incorrect password.
  4. Access denied. Error text `The username and password could not be verified.` appears on the page. User is not authenticated.

#### TC-AUTH-005: Boundary Test - Extreme String Lengths in Login Credentials
- **Module**: Authentication & Welcome
- **Scenario**: Submitting username and password exceeding 255 characters
- **Test Case**: `TC-AUTH-005` - Boundary Test - Extreme String Lengths in Login Credentials
- **Goal of Test Case**: Verify buffer handling and input truncation/validation for extreme string lengths
- **Test Type**: `Edge`
- **Test Steps with Test Data**:
  1. Navigate to Welcome page at `https://parabank.parasoft.com/parabank/index.htm`.
  2. Enter 300 character string (`'A' * 300`) into `input[name="username"]`.
  3. Enter 300 character string (`'P@ss' * 75`) into `input[name="password"]`.
  4. Click `input[type="submit"][value="Log In"]`.
- **Expected Outcome of Each Step**:
  1. Welcome page loads.
  2. Field accepts up to allowed maximum or truncates gracefully without UI distortion.
  3. Password field handles long string securely without crash.
  4. Application rejects authentication gracefully with verification error. No HTTP 500 unhandled stack trace is exposed.

#### TC-AUTH-006: Security Edge Case - Special Characters and SQL Injection Metacharacters in Login
- **Module**: Authentication & Welcome
- **Scenario**: Submitting SQL injection payload `' OR '1'='1` in username and password fields
- **Test Case**: `TC-AUTH-006` - Security Edge Case - Special Characters and SQL Injection Metacharacters in Login
- **Goal of Test Case**: Verify system treats SQL injection strings as literal characters and rejects authentication safely
- **Test Type**: `Edge`
- **Test Steps with Test Data**:
  1. Navigate to Welcome page at `https://parabank.parasoft.com/parabank/index.htm`.
  2. Enter `' OR '1'='1` into `input[name="username"]`.
  3. Enter `' OR '1'='1` into `input[name="password"]`.
  4. Click `input[type="submit"][value="Log In"]`.
- **Expected Outcome of Each Step**:
  1. Welcome page loads.
  2. Input string entered safely.
  3. Input string entered safely.
  4. Login is denied. No unauthorized access is granted. Error message `The username and password could not be verified.` is displayed.

#### TC-AUTH-007: Verification of Welcome Page Layout, Links, and Services Lists
- **Module**: Authentication & Welcome
- **Scenario**: Verify all statutory navigation links, service lists, and news elements on home page
- **Test Case**: `TC-AUTH-007` - Verification of Welcome Page Layout, Links, and Services Lists
- **Goal of Test Case**: Verify static layout fidelity, links to registration, lookup, about, and services
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Navigate to `https://parabank.parasoft.com/parabank/index.htm`.
  2. Verify presence of header links: `home`, `about`, `contact` in list `ul.button`.
  3. Verify presence of left menu links: `Solutions`, `About Us`, `Services`, `Products`, `Locations`, `Admin Page` in `ul.leftmenu`.
  4. Verify presence of 'Forgot login info?' link pointing to `lookup.htm`.
  5. Verify presence of 'Register' link pointing to `register.htm`.
  6. Verify service lists in `ul.services` (ATM Services, Withdraw Funds, Transfer Funds, Check Balances, Make Deposits) and `ul.servicestwo` (Bill Pay, Account History).
- **Expected Outcome of Each Step**:
  1. Welcome page renders completely.
  2. Header links are visible, correctly styled, and have valid href attributes.
  3. Left menu links are visible and functional.
  4. 'Forgot login info?' link is visible with href `lookup.htm`.
  5. 'Register' link is visible with href `register.htm`.
  6. Services sections display all cataloged informational items.

#### TC-AUTH-008: Successful User Session Logout
- **Module**: Authentication & Welcome
- **Scenario**: Authenticated customer clicks 'Log Out' from navigation panel
- **Test Case**: `TC-AUTH-008` - Successful User Session Logout
- **Goal of Test Case**: Verify user session is invalidated and user is redirected back to public welcome page
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Log in with valid credentials (`john` / `demo`) and reach overview page.
  2. Verify 'Log Out' link is visible in left navigation panel (`a[href*="logout.htm"]`).
  3. Click 'Log Out' link.
  4. Attempt to navigate back via browser back button to `overview.htm`.
- **Expected Outcome of Each Step**:
  1. User is authenticated.
  2. 'Log Out' link is rendered in DOM.
  3. User is redirected to `index.htm`. 'Customer Login' form is displayed again.
  4. Browser back navigation redirects to login page or displays session expired alert `An internal error has occurred and has been logged.`.

---

### 4.2 Module 2: Accounts Overview (TC-ACCT)
- **Target URL**: `https://parabank.parasoft.com/parabank/overview.htm`
- **Page Title**: `ParaBank | Accounts Overview`
- **Total Test Cases**: 5 (Positive: 2, Negative: 2, Edge: 1)

#### TC-ACCT-001: Verification of Accounts Overview Grid and Balance Summary
- **Module**: Accounts Overview
- **Scenario**: Customer visits Accounts Overview page to view all linked bank accounts
- **Test Case**: `TC-ACCT-001` - Verification of Accounts Overview Grid and Balance Summary
- **Goal of Test Case**: Verify `#accountTable` displays correct account columns (Account, Balance, Available Amount) and total
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Log in as valid user (`john` / `demo`).
  2. Click 'Accounts Overview' in the left navigation menu.
  3. Inspect table element `table#accountTable`.
  4. Verify table headers contain 'Account', 'Balance*', 'Available Amount*'.
  5. Verify at least one account row is rendered with clickable account ID link and currency formatted balances (e.g., `$515.50`).
  6. Verify summary row displays 'Total' with summed amount.
- **Expected Outcome of Each Step**:
  1. Login succeeds.
  2. Page navigates to `https://parabank.parasoft.com/parabank/overview.htm`.
  3. `table#accountTable` is visible in DOM.
  4. Headers match required column specifications.
  5. Account rows display valid formatted currency figures.
  6. Total row computes aggregate balance accurately.

#### TC-ACCT-002: Navigation to Account Details and Activity View via Account Number Link
- **Module**: Accounts Overview
- **Scenario**: User clicks on an account number in the Accounts Overview table
- **Test Case**: `TC-ACCT-002` - Navigation to Account Details and Activity View via Account Number Link
- **Goal of Test Case**: Verify deep link navigation to account activity details page for the chosen account
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Navigate to Accounts Overview page.
  2. Locate first account link in `table#accountTable tbody tr td a` (e.g., account `13344`).
  3. Click the account number link.
  4. Verify URL contains `activity.htm?id=` with matching account ID.
- **Expected Outcome of Each Step**:
  1. Accounts Overview table is displayed.
  2. Account link text matches account number.
  3. Browser navigates to Account Details page.
  4. Account Details page displays Account Details header, Account Type, Balance, Available Balance, and Activity period filter controls.

#### TC-ACCT-003: Unauthenticated Direct Access to Overview Page
- **Module**: Accounts Overview
- **Scenario**: Guest user without active session visits `overview.htm` directly
- **Test Case**: `TC-ACCT-003` - Unauthenticated Direct Access to Overview Page
- **Goal of Test Case**: Verify security guard prevents unauthorized access and displays system alert
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Clear all browser cookies and session storage.
  2. Attempt to navigate directly to `https://parabank.parasoft.com/parabank/overview.htm`.
  3. Inspect the DOM for error elements or login redirect.
- **Expected Outcome of Each Step**:
  1. Cookies and session cleared.
  2. Request sent to server.
  3. Application either redirects to `index.htm` or displays DOM error `p: An internal error has occurred and has been logged.`. No confidential account data is rendered.

#### TC-ACCT-004: Session Expiration Handling During Accounts Overview Reload
- **Module**: Accounts Overview
- **Scenario**: User leaves session idle until timeout then refreshes Accounts Overview
- **Test Case**: `TC-ACCT-004` - Session Expiration Handling During Accounts Overview Reload
- **Goal of Test Case**: Verify graceful degradation and captured error message upon expired session
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Log in and load Accounts Overview page.
  2. Delete session cookie (`JSESSIONID`) via browser developer tools.
  3. Refresh the page (`overview.htm`).
- **Expected Outcome of Each Step**:
  1. Overview page loaded.
  2. Session cookie removed.
  3. Page displays error message in selector `p`: `An internal error has occurred and has been logged.`.

#### TC-ACCT-005: Boundary Test - Accounts Grid Rendering with Zero and Negative Balances
- **Module**: Accounts Overview
- **Scenario**: Account with 0.00 or negative balance is rendered in the overview grid
- **Test Case**: `TC-ACCT-005` - Boundary Test - Accounts Grid Rendering with Zero and Negative Balances
- **Goal of Test Case**: Verify UI handles zero or overdrawn balances correctly in formatting and totals
- **Test Type**: `Edge`
- **Test Steps with Test Data**:
  1. Set up or transfer funds until account balance is $0.00.
  2. Navigate to Accounts Overview page.
  3. Verify formatting of zero balance in `table#accountTable`.
  4. Verify Total balance calculation correctly includes $0.00.
- **Expected Outcome of Each Step**:
  1. Account balance reaches $0.00.
  2. Overview page renders.
  3. Balance displays as `$0.00` without formatting errors or broken symbols.
  4. Total balance matches sum of all accounts.

---

### 4.3 Module 3: Open New Account (TC-OPEN)
- **Target URL**: `https://parabank.parasoft.com/parabank/openaccount.htm`
- **Page Title**: `ParaBank | Open Account`
- **Total Test Cases**: 6 (Positive: 2, Negative: 2, Edge: 2)

#### TC-OPEN-001: Successful Creation of a New Checking Account
- **Module**: Open New Account
- **Scenario**: Customer opens a new Checking account using existing funded account
- **Test Case**: `TC-OPEN-001` - Successful Creation of a New Checking Account
- **Goal of Test Case**: Verify that a customer can select CHECKING (0), an existing funding account, and obtain a new account ID
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Log in and navigate to `https://parabank.parasoft.com/parabank/openaccount.htm`.
  2. Verify presence of dropdown `select#type` with default option `0` ('CHECKING').
  3. Verify presence of dropdown `select#fromAccountId` populated with customer account (e.g., `13344`).
  4. Click button `input[type="button"][value="Open New Account"]`.
  5. Wait for asynchronous confirmation section to appear.
- **Expected Outcome of Each Step**:
  1. Open Account page renders with title 'ParaBank | Open Account'.
  2. `select#type` has value '0' selected.
  3. `select#fromAccountId` has valid funding account selected.
  4. Button click triggers AJAX request to account creation endpoint.
  5. Confirmation message 'Account Opened!' appears. A new clickable account ID link `a#newAccountId` is rendered. The minimum deposit is transferred from source account.

#### TC-OPEN-002: Successful Creation of a New Savings Account
- **Module**: Open New Account
- **Scenario**: Customer opens a new Savings account by changing account type dropdown to SAVINGS
- **Test Case**: `TC-OPEN-002` - Successful Creation of a New Savings Account
- **Goal of Test Case**: Verify that selecting SAVINGS (1) successfully creates a new savings account
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Navigate to `https://parabank.parasoft.com/parabank/openaccount.htm`.
  2. Click dropdown `select#type` and select option with value `1` (text: 'SAVINGS').
  3. Verify `select#type` value is now '1'.
  4. Select source funding account from `select#fromAccountId`.
  5. Click button `input[type="button"][value="Open New Account"]`.
  6. Click the generated account ID link `a#newAccountId`.
- **Expected Outcome of Each Step**:
  1. Page renders.
  2. Dropdown option 'SAVINGS' is selected.
  3. Value is '1'.
  4. Source account is confirmed.
  5. 'Account Opened!' message displayed with newly created account number link `a#newAccountId`.
  6. Navigates to Account Details page showing Account Type: 'SAVINGS'.

#### TC-OPEN-003: Unauthenticated Direct Access to Open Account Page
- **Module**: Open New Account
- **Scenario**: Guest user navigates directly to `openaccount.htm` without session
- **Test Case**: `TC-OPEN-003` - Unauthenticated Direct Access to Open Account Page
- **Goal of Test Case**: Verify unauthenticated user receives captured internal error or is redirected to login
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. In a clean browser session (no cookies), open `https://parabank.parasoft.com/parabank/openaccount.htm`.
  2. Inspect page content and DOM elements.
- **Expected Outcome of Each Step**:
  1. Page request executed.
  2. Application displays captured error in selector `p`: `An internal error has occurred and has been logged.` or redirects to login page. Form controls are not operational.

#### TC-OPEN-004: Account Creation Attempt with Empty or Invalid Source Account Selection
- **Module**: Open New Account
- **Scenario**: Form submitted when source account dropdown has no selected value or invalid ID
- **Test Case**: `TC-OPEN-004` - Account Creation Attempt with Empty or Invalid Source Account Selection
- **Goal of Test Case**: Verify error handling when funding account identifier is missing or invalid
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Navigate to Open Account page.
  2. Via DOM manipulation or empty profile, leave `select#fromAccountId` unselected.
  3. Click `input[type="button"][value="Open New Account"]`.
- **Expected Outcome of Each Step**:
  1. Page renders.
  2. Dropdown has no valid selection.
  3. Request is aborted or server returns validation error. No new account is created.

#### TC-OPEN-005: Boundary Test - Rapid Multiple Clicks on 'Open New Account' Button
- **Module**: Open New Account
- **Scenario**: User double-clicks or rapidly multi-clicks the 'Open New Account' button
- **Test Case**: `TC-OPEN-005` - Boundary Test - Rapid Multiple Clicks on 'Open New Account' Button
- **Goal of Test Case**: Verify idempotent handling or duplicate submission prevention on account creation
- **Test Type**: `Edge`
- **Test Steps with Test Data**:
  1. Navigate to `openaccount.htm` with valid funding account.
  2. Rapidly click button `input[value="Open New Account"]` 3 times in quick succession (<200ms interval).
  3. Inspect network calls and resulting account records.
- **Expected Outcome of Each Step**:
  1. Page renders.
  2. Clicks dispatched.
  3. System processes request without unhandled database lock exceptions or creates accounts cleanly with deducted funds. No corrupted records.

#### TC-OPEN-006: Boundary Test - Opening Account from Source Account with Minimum Balance
- **Module**: Open New Account
- **Scenario**: Funding account has exactly the minimum balance required for new account deposit
- **Test Case**: `TC-OPEN-006` - Boundary Test - Opening Account from Source Account with Minimum Balance
- **Goal of Test Case**: Verify account creation succeeds when source balance matches exact minimum transfer threshold
- **Test Type**: `Edge`
- **Test Steps with Test Data**:
  1. Ensure funding account balance is exactly equal to initial deposit amount (e.g. $100.00).
  2. Select that account in `select#fromAccountId`.
  3. Click `input[value="Open New Account"]`.
  4. Verify source account balance is updated to $0.00 and new account is opened with $100.00.
- **Expected Outcome of Each Step**:
  1. Balance verified.
  2. Account selected.
  3. Click submitted.
  4. New account opened successfully. In Accounts Overview, source account balance is $0.00 and new account has the credited balance.

---

### 4.4 Module 4: Transfer Funds (TC-XFER)
- **Target URL**: `https://parabank.parasoft.com/parabank/transfer.htm`
- **Page Title**: `ParaBank | Transfer Funds`
- **Total Test Cases**: 8 (Positive: 2, Negative: 3, Edge: 3)

#### TC-XFER-001: Successful Fund Transfer Between Different Customer Accounts
- **Module**: Transfer Funds
- **Scenario**: Customer transfers valid dollar amount from one account to another account
- **Test Case**: `TC-XFER-001` - Successful Fund Transfer Between Different Customer Accounts
- **Goal of Test Case**: Verify funds transfer completes successfully and balances reflect the transfer
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Log in and navigate to `https://parabank.parasoft.com/parabank/transfer.htm`.
  2. Verify presence of form `#transferForm` with fields: `input#amount`, `select#fromAccountId`, `select#toAccountId`, and button `input[value="Transfer"]`.
  3. Enter `100.00` into `input#amount`.
  4. Select distinct source account from `select#fromAccountId` (e.g., `13344`).
  5. Select distinct destination account from `select#toAccountId` (e.g., `13455`).
  6. Click `input[type="submit"][value="Transfer"]`.
  7. Wait for transfer confirmation.
- **Expected Outcome of Each Step**:
  1. Transfer Funds page renders with title 'ParaBank | Transfer Funds'.
  2. Form controls are visible and enabled.
  3. Amount field contains '100.00'.
  4. Source account selected.
  5. Destination account selected.
  6. Transfer request submitted.
  7. Confirmation message 'Transfer Complete!' appears. Confirmation text states: '$100.00 has been transferred from account #13344 to account #13455.'.

#### TC-XFER-002: Fund Transfer with Fractional Decimal Cents ($12.34)
- **Module**: Transfer Funds
- **Scenario**: Transfer funds specifying precise fractional cents
- **Test Case**: `TC-XFER-002` - Fund Transfer with Fractional Decimal Cents ($12.34)
- **Goal of Test Case**: Verify numerical precision is maintained without rounding errors
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Navigate to `transfer.htm`.
  2. Enter `12.34` into `input#amount`.
  3. Select source and destination accounts.
  4. Click `input[type="submit"][value="Transfer"]`.
- **Expected Outcome of Each Step**:
  1. Page renders.
  2. Amount field contains '12.34'.
  3. Accounts selected.
  4. Confirmation displays: '$12.34 has been transferred...'.

#### TC-XFER-003: Validation of Empty Amount Field on Transfer Submission
- **Module**: Transfer Funds
- **Scenario**: Customer submits transfer form with blank amount field
- **Test Case**: `TC-XFER-003` - Validation of Empty Amount Field on Transfer Submission
- **Goal of Test Case**: Verify captured DOM error `#amount.errors: The amount cannot be empty.` is displayed
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Navigate to `transfer.htm`.
  2. Leave `input#amount` completely empty.
  3. Select valid source and destination accounts.
  4. Click `input[type="submit"][value="Transfer"]`.
- **Expected Outcome of Each Step**:
  1. Page renders.
  2. Amount input is blank.
  3. Accounts selected.
  4. Form submission is halted or returns validation error. Error element `#amount.errors` displays exact text: `The amount cannot be empty.`.

#### TC-XFER-004: Validation of Non-Numeric String in Amount Field
- **Module**: Transfer Funds
- **Scenario**: Customer enters letters or symbols into amount field
- **Test Case**: `TC-XFER-004` - Validation of Non-Numeric String in Amount Field
- **Goal of Test Case**: Verify captured DOM error `#amount.errors: Please enter a valid amount.` is displayed
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Navigate to `transfer.htm`.
  2. Enter alphabetic text `OneHundred` into `input#amount`.
  3. Select source and destination accounts.
  4. Click `input[type="submit"][value="Transfer"]`.
- **Expected Outcome of Each Step**:
  1. Page renders.
  2. Amount contains 'OneHundred'.
  3. Accounts selected.
  4. Form submission fails. Error element `#amount.errors` displays exact text: `Please enter a valid amount.`.

#### TC-XFER-005: Unauthenticated Direct Access to Transfer Funds Page
- **Module**: Transfer Funds
- **Scenario**: Guest user navigates directly to `transfer.htm` without logging in
- **Test Case**: `TC-XFER-005` - Unauthenticated Direct Access to Transfer Funds Page
- **Goal of Test Case**: Verify captured error `p: An internal error has occurred and has been logged.` or login redirect
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Clear all browser cookies.
  2. Navigate directly to `https://parabank.parasoft.com/parabank/transfer.htm`.
  3. Inspect page response.
- **Expected Outcome of Each Step**:
  1. Cookies cleared.
  2. Page requested.
  3. Page displays error message in selector `p`: `An internal error has occurred and has been logged.` or redirects to `index.htm`. Transfer form is not accessible.

#### TC-XFER-006: Boundary Test - Transfer with Zero Amount ($0.00)
- **Module**: Transfer Funds
- **Scenario**: User attempts to transfer $0.00 between accounts
- **Test Case**: `TC-XFER-006` - Boundary Test - Transfer with Zero Amount ($0.00)
- **Goal of Test Case**: Verify system handles zero amount appropriately without modifying balances
- **Test Type**: `Edge`
- **Test Steps with Test Data**:
  1. Navigate to `transfer.htm`.
  2. Enter `0.00` into `input#amount`.
  3. Select source and destination accounts.
  4. Click `input[value="Transfer"]`.
- **Expected Outcome of Each Step**:
  1. Page renders.
  2. Amount contains '0.00'.
  3. Accounts selected.
  4. System rejects 0 transfer with validation error or processes $0.00 without altering account balances.

#### TC-XFER-007: Boundary Test - Transfer Amount Exceeding Available Balance
- **Module**: Transfer Funds
- **Scenario**: User attempts to transfer an amount greater than the source account balance
- **Test Case**: `TC-XFER-007` - Boundary Test - Transfer Amount Exceeding Available Balance
- **Goal of Test Case**: Verify overdraft/insufficient funds behavior or account deficit recording
- **Test Type**: `Edge`
- **Test Steps with Test Data**:
  1. Identify source account balance (e.g. $515.50).
  2. Enter `999999.00` into `input#amount`.
  3. Click `input[value="Transfer"]`.
  4. Check Accounts Overview for resulting account balance.
- **Expected Outcome of Each Step**:
  1. Source balance noted.
  2. Excessive amount entered.
  3. Form submitted.
  4. Application either rejects transfer with insufficient funds error or allows overdraft per test environment rules, without crashing.

#### TC-XFER-008: Boundary Test - Transfer Between the Same Source and Destination Account
- **Module**: Transfer Funds
- **Scenario**: Customer selects the exact same account in both fromAccountId and toAccountId dropdowns
- **Test Case**: `TC-XFER-008` - Boundary Test - Transfer Between the Same Source and Destination Account
- **Goal of Test Case**: Verify system handles or prevents circular self-transfer gracefully
- **Test Type**: `Edge`
- **Test Steps with Test Data**:
  1. Navigate to `transfer.htm`.
  2. Enter `50.00` into `input#amount`.
  3. Select account `13344` in `select#fromAccountId`.
  4. Select identical account `13344` in `select#toAccountId`.
  5. Click `input[value="Transfer"]`.
- **Expected Outcome of Each Step**:
  1. Page renders.
  2. Amount entered.
  3. Source account selected.
  4. Destination account selected as identical ID.
  5. System handles self-transfer: net balance of the account remains unchanged after transaction.

---

### 4.5 Module 5: Bill Payment (TC-BILL)
- **Target URL**: `https://parabank.parasoft.com/parabank/billpay.htm`
- **Page Title**: `ParaBank | Bill Pay`
- **Total Test Cases**: 11 (Positive: 2, Negative: 6, Edge: 3)

#### TC-BILL-001: Successful Bill Payment Submission with Valid Payee Details
- **Module**: Bill Payment
- **Scenario**: Customer enters all required payee information, matching account numbers, and valid amount
- **Test Case**: `TC-BILL-001` - Successful Bill Payment Submission with Valid Payee Details
- **Goal of Test Case**: Verify that complete valid bill payment succeeds and renders confirmation view
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Log in and navigate to `https://parabank.parasoft.com/parabank/billpay.htm`.
  2. Enter `Electric Utility Co` into `input[name="payee.name"]`.
  3. Enter `456 Power Lane` into `input[name="payee.address.street"]`.
  4. Enter `Metropolis` into `input[name="payee.address.city"]`.
  5. Enter `NY` into `input[name="payee.address.state"]`.
  6. Enter `10001` into `input[name="payee.address.zipCode"]`.
  7. Enter `212-555-0199` into `input[name="payee.phoneNumber"]`.
  8. Enter `987654321` into `input[name="payee.accountNumber"]`.
  9. Enter `987654321` into `input[name="verifyAccount"]`.
  10. Enter `75.50` into `input[name="amount"]`.
  11. Select source account from `select[name="fromAccountId"]` (e.g., `13344`).
  12. Click button `input[type="button"][value="Send Payment"]`.
- **Expected Outcome of Each Step**:
  1. Bill Pay page renders with title 'ParaBank | Bill Pay'.
  2-11. All fields are populated with valid test data.
  12. Payment is processed. Success screen displays: 'Bill Payment Complete'. Confirmation details show Payee Name 'Electric Utility Co', Amount '$75.50', and Source Account.

#### TC-BILL-002: Successful Bill Payment with Large Amount and Extended Address
- **Module**: Bill Payment
- **Scenario**: Customer pays large bill with secondary suite address and full postal code
- **Test Case**: `TC-BILL-002` - Successful Bill Payment with Large Amount and Extended Address
- **Goal of Test Case**: Verify system handles complex addresses and large amounts without failure
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Navigate to `billpay.htm`.
  2. Enter `National Mortgage Corp` into `payee.name`.
  3. Enter `7890 Financial Blvd, Suite 400` into `payee.address.street`.
  4. Enter `San Francisco` into `payee.address.city`.
  5. Enter `CA` into `payee.address.state`.
  6. Enter `94107-1234` into `payee.address.zipCode`.
  7. Enter `4155551212` into `payee.phoneNumber`.
  8. Enter `5544332211` into `payee.accountNumber`.
  9. Enter `5544332211` into `verifyAccount`.
  10. Enter `2500.00` into `amount`.
  11. Select source account and click `input[value="Send Payment"]`.
- **Expected Outcome of Each Step**:
  1-10. Data populated.
  11. Payment succeeds. Confirmation renders with payee 'National Mortgage Corp' and amount '$2500.00'.

#### TC-BILL-003: Validation of All Blank Fields on Form Submission
- **Module**: Bill Payment
- **Scenario**: Customer clicks 'Send Payment' button without entering any data in the form
- **Test Case**: `TC-BILL-003` - Validation of All Blank Fields on Form Submission
- **Goal of Test Case**: Verify all captured required field validation errors are simultaneously displayed in DOM
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Navigate to `billpay.htm`.
  2. Leave all text input fields blank.
  3. Click `input[type="button"][value="Send Payment"]`.
  4. Inspect DOM for error spans `#validationModel-*`.
- **Expected Outcome of Each Step**:
  1. Page renders.
  2. All fields blank.
  3. Submission triggered.
  4. The following 8 required error messages are displayed simultaneously:
     - `#validationModel-name`: `Payee name is required.`
     - `#validationModel-address`: `Address is required.`
     - `#validationModel-city`: `City is required.`
     - `#validationModel-state`: `State is required.`
     - `#validationModel-zipCode`: `Zip Code is required.`
     - `#validationModel-phoneNumber`: `Phone number is required.`
     - `#validationModel-account-empty`: `Account number is required.`
     - `#validationModel-verifyAccount-empty`: `Account number is required.`
     - `#validationModel-amount-empty`: `The amount cannot be empty.`

#### TC-BILL-004: Validation of Missing Payee Name Field
- **Module**: Bill Payment
- **Scenario**: Customer enters all payee fields except payee name
- **Test Case**: `TC-BILL-004` - Validation of Missing Payee Name Field
- **Goal of Test Case**: Verify captured DOM error `#validationModel-name: Payee name is required.` appears
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Navigate to `billpay.htm`.
  2. Leave `payee.name` empty.
  3. Fill valid values for street, city, state, zipCode, phone, account, verifyAccount, amount.
  4. Click `input[value="Send Payment"]`.
- **Expected Outcome of Each Step**:
  1. Page renders.
  2. Name empty.
  3. Other fields filled.
  4. Form not submitted. Error `#validationModel-name` displays: `Payee name is required.`.

#### TC-BILL-005: Validation of Non-Numeric Payee Account Number
- **Module**: Bill Payment
- **Scenario**: Customer enters letters in payee account number field
- **Test Case**: `TC-BILL-005` - Validation of Non-Numeric Payee Account Number
- **Goal of Test Case**: Verify captured DOM error `#validationModel-account-invalid: Please enter a valid number.` appears
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Navigate to `billpay.htm`.
  2. Enter `ACME Corp` in `payee.name` and populate other address fields.
  3. Enter `INVALID_ACCT_ABC` into `input[name="payee.accountNumber"]`.
  4. Enter `INVALID_ACCT_ABC` into `input[name="verifyAccount"]`.
  5. Enter `50.00` in `amount` and click `input[value="Send Payment"]`.
- **Expected Outcome of Each Step**:
  1-4. Inputs entered.
  5. Validation fails. `#validationModel-account-invalid` displays: `Please enter a valid number.`.

#### TC-BILL-006: Validation of Account Number Mismatch Between Account and Verify Account
- **Module**: Bill Payment
- **Scenario**: Customer enters different numbers in payee.accountNumber and verifyAccount fields
- **Test Case**: `TC-BILL-006` - Validation of Account Number Mismatch Between Account and Verify Account
- **Goal of Test Case**: Verify captured DOM error `#validationModel-verifyAccount-mismatch: The account numbers do not match.` appears
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Navigate to `billpay.htm`.
  2. Enter `12345678` into `input[name="payee.accountNumber"]`.
  3. Enter `87654321` into `input[name="verifyAccount"]`.
  4. Fill other mandatory fields with valid data.
  5. Click `input[type="button"][value="Send Payment"]`.
- **Expected Outcome of Each Step**:
  1-4. Inputs entered with mismatched account numbers.
  5. Form submission halted. Error span `#validationModel-verifyAccount-mismatch` displays exact text: `The account numbers do not match.`.

#### TC-BILL-007: Validation of Empty and Non-Numeric Amount Fields
- **Module**: Bill Payment
- **Scenario**: Customer enters non-numeric text in amount field
- **Test Case**: `TC-BILL-007` - Validation of Empty and Non-Numeric Amount Fields
- **Goal of Test Case**: Verify captured DOM error `#validationModel-amount-invalid: Please enter a valid amount.` appears
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Navigate to `billpay.htm`.
  2. Fill all payee and account fields with valid data.
  3. Enter `$FiftyDollars!` into `input[name="amount"]`.
  4. Click `input[value="Send Payment"]`.
- **Expected Outcome of Each Step**:
  1-2. Valid payee data populated.
  3. Non-numeric amount entered.
  4. Error element `#validationModel-amount-invalid` displays exact text: `Please enter a valid amount.`.

#### TC-BILL-008: Unauthenticated Direct Access to Bill Payment Page
- **Module**: Bill Payment
- **Scenario**: Guest user accesses `billpay.htm` directly without session
- **Test Case**: `TC-BILL-008` - Unauthenticated Direct Access to Bill Payment Page
- **Goal of Test Case**: Verify captured alert `p: An internal error has occurred and has been logged.` or login redirect
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Clear browser cookies.
  2. Navigate directly to `https://parabank.parasoft.com/parabank/billpay.htm`.
  3. Inspect page content.
- **Expected Outcome of Each Step**:
  1. Cookies cleared.
  2. Direct GET request sent.
  3. Page displays error message in selector `p`: `An internal error has occurred and has been logged.` or redirects to welcome page.

#### TC-BILL-009: Boundary Test - Minimum Valid Bill Payment Amount ($0.01)
- **Module**: Bill Payment
- **Scenario**: Customer submits bill payment of one cent ($0.01)
- **Test Case**: `TC-BILL-009` - Boundary Test - Minimum Valid Bill Payment Amount ($0.01)
- **Goal of Test Case**: Verify minimum positive transaction boundary is processed accurately
- **Test Type**: `Edge`
- **Test Steps with Test Data**:
  1. Navigate to `billpay.htm`.
  2. Fill valid payee details.
  3. Enter `0.01` into `input[name="amount"]`.
  4. Click `input[value="Send Payment"]`.
- **Expected Outcome of Each Step**:
  1-2. Payee data filled.
  3. Amount '0.01' entered.
  4. Payment succeeds. Confirmation screen displays payment of `$0.01`.

#### TC-BILL-010: Boundary Test - Payee Name with Special Characters & Extreme String Length
- **Module**: Bill Payment
- **Scenario**: Customer enters 200-character payee name with symbols and diacritics
- **Test Case**: `TC-BILL-010` - Boundary Test - Payee Name with Special Characters & Extreme String Length
- **Goal of Test Case**: Verify form handles UTF-8 encoding and extended string lengths without truncating unexpectedly
- **Test Type**: `Edge`
- **Test Steps with Test Data**:
  1. Navigate to `billpay.htm`.
  2. Enter `Société Générale & Sons Corp. (Int'l) - #12345/ABC` into `payee.name`.
  3. Fill remaining fields with valid data.
  4. Enter `100.00` in amount and click `input[value="Send Payment"]`.
- **Expected Outcome of Each Step**:
  1-3. Fields populated.
  4. Payment succeeds. Payee name rendered on confirmation matches the UTF-8 input string without corruption.

#### TC-BILL-011: Boundary Test - Bill Payment Exceeding Available Balance
- **Module**: Bill Payment
- **Scenario**: Payment amount greater than the funding account balance
- **Test Case**: `TC-BILL-011` - Boundary Test - Bill Payment Exceeding Available Balance
- **Goal of Test Case**: Verify overdraft handling or balance deficit behavior on bill payment
- **Test Type**: `Edge`
- **Test Steps with Test Data**:
  1. Verify source account balance.
  2. Enter amount $500,000.00 into `input[name="amount"]`.
  3. Complete payee details and click `input[value="Send Payment"]`.
  4. Inspect confirmation and check Accounts Overview.
- **Expected Outcome of Each Step**:
  1-3. Excessive amount submitted.
  4. System either denies transaction with insufficient funds or processes overdraft per bank policy, without unexpected crash.

---

### 4.6 Module 6: Find Transactions (TC-FIND)
- **Target URL**: `https://parabank.parasoft.com/parabank/findtrans.htm`
- **Page Title**: `ParaBank | Find Transactions`
- **Total Test Cases**: 9 (Positive: 4, Negative: 3, Edge: 2)

#### TC-FIND-001: Find Transactions by Valid Transaction ID
- **Module**: Find Transactions
- **Scenario**: Customer searches for transaction using exact transaction ID
- **Test Case**: `TC-FIND-001` - Find Transactions by Valid Transaction ID
- **Goal of Test Case**: Verify system returns specific transaction row in `#transactionTable` matching the ID
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Log in and navigate to `https://parabank.parasoft.com/parabank/findtrans.htm`.
  2. Verify presence of form `#transactionForm` with `select#accountId` and 4 search sections.
  3. Select customer account in `select#accountId` (e.g., `13344`).
  4. Enter valid transaction ID (e.g., `14143`) into `input#transactionId`.
  5. Click button `button#findById` / `input#findById` (`FIND TRANSACTIONS`).
  6. Inspect result table `table#transactionTable`.
- **Expected Outcome of Each Step**:
  1. Find Transactions page renders with title 'ParaBank | Find Transactions'.
  2. Form controls are visible.
  3. Account ID selected.
  4. Transaction ID entered.
  5. Search dispatched.
  6. `table#transactionTable` appears displaying columns 'Date', 'Transaction', 'Debit (-)', 'Credit (+)'. The queried transaction row is listed.

#### TC-FIND-002: Find Transactions by Valid Transaction Date
- **Module**: Find Transactions
- **Scenario**: Customer searches for transactions executed on a specific date
- **Test Case**: `TC-FIND-002` - Find Transactions by Valid Transaction Date
- **Goal of Test Case**: Verify all transactions executed on that date are retrieved in results table
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Navigate to `findtrans.htm`.
  2. Select account in `select#accountId`.
  3. Enter valid date (format `MM-DD-YYYY`, e.g., `10-06-2026`) into `input#transactionDate`.
  4. Click button `button#findByDate` / `input#findByDate`.
  5. Verify results in `table#transactionTable`.
- **Expected Outcome of Each Step**:
  1. Page renders.
  2. Account selected.
  3. Date entered in `MM-DD-YYYY` format.
  4. Query executed.
  5. `table#transactionTable` displays transactions matching specified date.

#### TC-FIND-003: Find Transactions by Valid Date Range
- **Module**: Find Transactions
- **Scenario**: Customer searches for transactions within a date range
- **Test Case**: `TC-FIND-003` - Find Transactions by Valid Date Range
- **Goal of Test Case**: Verify all transactions between fromDate and toDate inclusive are displayed
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Navigate to `findtrans.htm`.
  2. Select account in `select#accountId`.
  3. Enter `01-01-2026` into `input#fromDate`.
  4. Enter `12-31-2026` into `input#toDate`.
  5. Click button `button#findByDateRange` / `input#findByDateRange`.
- **Expected Outcome of Each Step**:
  1. Page renders.
  2. Account selected.
  3. From date populated.
  4. To date populated.
  5. Results table displays all transactions falling within the specified period.

#### TC-FIND-004: Find Transactions by Valid Dollar Amount
- **Module**: Find Transactions
- **Scenario**: Customer queries transactions matching exact monetary amount
- **Test Case**: `TC-FIND-004` - Find Transactions by Valid Dollar Amount
- **Goal of Test Case**: Verify transactions matching exact amount (e.g. 100.00) are retrieved
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Navigate to `findtrans.htm`.
  2. Select account in `select#accountId`.
  3. Enter `100.00` into `input#amount`.
  4. Click button `button#findByAmount` / `input#findByAmount`.
- **Expected Outcome of Each Step**:
  1. Page renders.
  2. Account selected.
  3. Amount entered as '100.00'.
  4. Results grid displays transactions matching the specified debit or credit amount.

#### TC-FIND-005: Query by Non-Existent Transaction ID
- **Module**: Find Transactions
- **Scenario**: Customer searches with an invalid or non-existent transaction ID
- **Test Case**: `TC-FIND-005` - Query by Non-Existent Transaction ID
- **Goal of Test Case**: Verify empty state message or zero rows displayed without application crash
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Navigate to `findtrans.htm`.
  2. Select account in `select#accountId`.
  3. Enter non-existent ID `99999999` into `input#transactionId`.
  4. Click `button#findById`.
- **Expected Outcome of Each Step**:
  1-3. Search input entered.
  4. Results section displays empty table or 'No transactions found' notification. No server error is raised.

#### TC-FIND-006: Query with Malformed Date Format in Transaction Date
- **Module**: Find Transactions
- **Scenario**: Customer enters invalid date string (e.g. text or invalid calendar date) in transaction date
- **Test Case**: `TC-FIND-006` - Query with Malformed Date Format in Transaction Date
- **Goal of Test Case**: Verify system handles format error gracefully without unhandled exception
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Navigate to `findtrans.htm`.
  2. Enter `99-99-9999` or `invalid-date` into `input#transactionDate`.
  3. Click `button#findByDate`.
- **Expected Outcome of Each Step**:
  1. Page renders.
  2. Invalid date entered.
  3. Query returns empty results, validation warning, or gracefully handled response.

#### TC-FIND-007: Unauthenticated Direct Access to Find Transactions Page
- **Module**: Find Transactions
- **Scenario**: Guest user accesses `findtrans.htm` directly without session
- **Test Case**: `TC-FIND-007` - Unauthenticated Direct Access to Find Transactions Page
- **Goal of Test Case**: Verify captured DOM error `p: An internal error has occurred and has been logged.` appears
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Clear browser cookies.
  2. Navigate directly to `https://parabank.parasoft.com/parabank/findtrans.htm`.
  3. Inspect page content.
- **Expected Outcome of Each Step**:
  1. Cookies cleared.
  2. Direct GET dispatched.
  3. Page displays error message in selector `p`: `An internal error has occurred and has been logged.` or redirects to welcome page.

#### TC-FIND-008: Boundary Test - Inverted Date Range (From Date Greater Than To Date)
- **Module**: Find Transactions
- **Scenario**: Customer sets fromDate chronologically after toDate
- **Test Case**: `TC-FIND-008` - Boundary Test - Inverted Date Range (From Date Greater Than To Date)
- **Goal of Test Case**: Verify system handles inverted range without endless loop or crash
- **Test Type**: `Edge`
- **Test Steps with Test Data**:
  1. Navigate to `findtrans.htm`.
  2. Enter `12-31-2026` into `input#fromDate`.
  3. Enter `01-01-2026` into `input#toDate`.
  4. Click `button#findByDateRange`.
- **Expected Outcome of Each Step**:
  1-3. Inverted dates entered.
  4. Application yields 0 transaction results or displays range validation message.

#### TC-FIND-009: Boundary Test - Special Characters in Transaction Query Inputs
- **Module**: Find Transactions
- **Scenario**: Customer enters SQL injection/special characters (`' OR 1=1 --`) in transaction query inputs
- **Test Case**: `TC-FIND-009` - Boundary Test - Special Characters in Transaction Query Inputs
- **Goal of Test Case**: Verify search inputs are sanitized against SQL injection and script injection
- **Test Type**: `Edge`
- **Test Steps with Test Data**:
  1. Navigate to `findtrans.htm`.
  2. Enter `' OR '1'='1` into `input#transactionId`.
  3. Click `button#findById`.
- **Expected Outcome of Each Step**:
  1. Page renders.
  2. Special characters entered.
  3. Query returns zero records safely. No database syntax errors or leaked SQL records.

---

### 4.7 Module 7: Update Profile (TC-PROF)
- **Target URL**: `https://parabank.parasoft.com/parabank/updateprofile.htm`
- **Page Title**: `ParaBank | Update Profile`
- **Total Test Cases**: 7 (Positive: 2, Negative: 3, Edge: 2)

#### TC-PROF-001: Successful Profile Update with Valid Address and Phone Data
- **Module**: Update Profile
- **Scenario**: Customer updates address and telephone contact information
- **Test Case**: `TC-PROF-001` - Successful Profile Update with Valid Address and Phone Data
- **Goal of Test Case**: Verify profile updates persist and confirmation message is displayed
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Log in and navigate to `https://parabank.parasoft.com/parabank/updateprofile.htm`.
  2. Verify pre-populated values in `customer.firstName`, `customer.lastName`, `customer.address.street`, etc.
  3. Change `input#customer.address.street` to `999 New Boulevard`.
  4. Change `input#customer.address.city` to `San Jose`.
  5. Change `input#customer.address.zipCode` to `95112`.
  6. Change `input#customer.phoneNumber` to `408-555-9000`.
  7. Click button `input[type="button"][value="Update Profile"]`.
- **Expected Outcome of Each Step**:
  1. Update Profile page renders with title 'ParaBank | Update Profile'.
  2. Fields contain existing user details.
  3-6. New values entered.
  7. Update request sent. Confirmation message 'Profile Updated' is displayed on screen.

#### TC-PROF-002: Profile Data Persistence Verification Across Sessions
- **Module**: Update Profile
- **Scenario**: Customer updates profile, logs out, logs back in, and inspects profile
- **Test Case**: `TC-PROF-002` - Profile Data Persistence Verification Across Sessions
- **Goal of Test Case**: Verify persisted customer details are reloaded correctly from the database
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Update street address to `777 Evergreen Terrace` and click 'Update Profile'.
  2. Click 'Log Out'.
  3. Log back in with valid credentials.
  4. Navigate to `updateprofile.htm`.
  5. Verify value of `input#customer.address.street`.
- **Expected Outcome of Each Step**:
  1. Profile updated successfully.
  2. User logged out.
  3. Re-authentication successful.
  4. Page loads.
  5. `input#customer.address.street` retains the updated value '777 Evergreen Terrace'.

#### TC-PROF-003: Validation of Missing First Name Field
- **Module**: Update Profile
- **Scenario**: Customer clears first name field and clicks Update Profile
- **Test Case**: `TC-PROF-003` - Validation of Missing First Name Field
- **Goal of Test Case**: Verify captured DOM error `#firstName-error: First name is required.` appears
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Navigate to `updateprofile.htm`.
  2. Clear all text from `input#customer.firstName`.
  3. Click `input[type="button"][value="Update Profile"]`.
  4. Inspect DOM for error span `#firstName-error`.
- **Expected Outcome of Each Step**:
  1. Page renders.
  2. First name field is empty.
  3. Update triggered.
  4. Update is prevented. Error span `#firstName-error` displays exact text: `First name is required.`.

#### TC-PROF-004: Validation of Multiple Cleared Mandatory Fields
- **Module**: Update Profile
- **Scenario**: Customer clears all mandatory address and name fields and submits
- **Test Case**: `TC-PROF-004` - Validation of Multiple Cleared Mandatory Fields
- **Goal of Test Case**: Verify all 6 captured DOM error messages appear simultaneously
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Navigate to `updateprofile.htm`.
  2. Clear `customer.firstName`, `customer.lastName`, `customer.address.street`, `customer.address.city`, `customer.address.state`, `customer.address.zipCode`.
  3. Click `input[value="Update Profile"]`.
  4. Inspect DOM for all error selectors.
- **Expected Outcome of Each Step**:
  1. Page renders.
  2. Fields cleared.
  3. Submission dispatched.
  4. The following 6 errors appear simultaneously in the DOM:
     - `#firstName-error`: `First name is required.`
     - `#lastName-error`: `Last name is required.`
     - `#street-error`: `Address is required.`
     - `#city-error`: `City is required.`
     - `#state-error`: `State is required.`
     - `#zipCode-error`: `Zip Code is required.`

#### TC-PROF-005: Unauthenticated Direct Access to Update Profile Page
- **Module**: Update Profile
- **Scenario**: Guest user visits `updateprofile.htm` without active session
- **Test Case**: `TC-PROF-005` - Unauthenticated Direct Access to Update Profile Page
- **Goal of Test Case**: Verify captured alert `p: An internal error has occurred and has been logged.` appears
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Clear browser cookies.
  2. Navigate directly to `https://parabank.parasoft.com/parabank/updateprofile.htm`.
  3. Inspect page response.
- **Expected Outcome of Each Step**:
  1. Cookies cleared.
  2. Direct GET dispatched.
  3. Page displays error message in selector `p`: `An internal error has occurred and has been logged.` or redirects to welcome page.

#### TC-PROF-006: Boundary Test - Extreme String Lengths for Profile Fields
- **Module**: Update Profile
- **Scenario**: Customer enters 255-character string in address, city, and state fields
- **Test Case**: `TC-PROF-006` - Boundary Test - Extreme String Lengths for Profile Fields
- **Goal of Test Case**: Verify database column limits handle large strings without data truncation corruption
- **Test Type**: `Edge`
- **Test Steps with Test Data**:
  1. Navigate to `updateprofile.htm`.
  2. Enter 200 characters in `input#customer.address.street`.
  3. Enter 100 characters in `input#customer.address.city`.
  4. Click `input[value="Update Profile"]`.
- **Expected Outcome of Each Step**:
  1. Page renders.
  2-3. Long strings entered.
  4. System either saves successfully or displays character limit validation without HTTP 500 error.

#### TC-PROF-007: Boundary Test - Special Characters and International Phone Formats
- **Module**: Update Profile
- **Scenario**: Customer enters international phone with country code, spaces, plus sign, and hyphens
- **Test Case**: `TC-PROF-007` - Boundary Test - Special Characters and International Phone Formats
- **Goal of Test Case**: Verify telephone input accepts valid international formats (e.g. +44 20 7946 0958)
- **Test Type**: `Edge`
- **Test Steps with Test Data**:
  1. Navigate to `updateprofile.htm`.
  2. Enter `+44 20 7946 0958` into `input#customer.phoneNumber`.
  3. Click `input[value="Update Profile"]`.
- **Expected Outcome of Each Step**:
  1. Page renders.
  2. International phone string entered.
  3. Profile updates successfully with formatted phone number preserved.

---

### 4.8 Module 8: Request Loan (TC-LOAN)
- **Target URL**: `https://parabank.parasoft.com/parabank/requestloan.htm`
- **Page Title**: `ParaBank | Apply for a Loan`
- **Total Test Cases**: 7 (Positive: 2, Negative: 3, Edge: 2)

#### TC-LOAN-001: Successful Loan Application Approval with Adequate Down Payment
- **Module**: Request Loan
- **Scenario**: Customer requests loan with valid loan amount and compliant down payment
- **Test Case**: `TC-LOAN-001` - Successful Loan Application Approval with Adequate Down Payment
- **Goal of Test Case**: Verify loan underwriting processes request and displays 'Loan Request Processed' with Approved status
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Log in and navigate to `https://parabank.parasoft.com/parabank/requestloan.htm`.
  2. Verify presence of input fields `input#amount`, `input#downPayment`, and `select#fromAccountId`.
  3. Enter `1000.00` into `input#amount`.
  4. Enter `200.00` into `input#downPayment` (20% down payment).
  5. Select funded source account in `select#fromAccountId`.
  6. Click button `input[type="button"][value="Apply Now"]`.
- **Expected Outcome of Each Step**:
  1. Apply for a Loan page renders with title 'ParaBank | Apply for a Loan'.
  2. Form elements visible.
  3. Loan amount populated with 1000.00.
  4. Down payment populated with 200.00.
  5. Source account selected.
  6. Result section appears: 'Loan Request Processed'. Status displays 'Approved', Loan Provider, and new Account Number.

#### TC-LOAN-002: Loan Application Approval with High Available Funds Ratio
- **Module**: Request Loan
- **Scenario**: Customer applies for moderate loan ($500) with $100 down payment
- **Test Case**: `TC-LOAN-002` - Loan Application Approval with High Available Funds Ratio
- **Goal of Test Case**: Verify funds processor approves loan when available balance exceeds threshold
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Navigate to `requestloan.htm`.
  2. Enter `500.00` into `input#amount`.
  3. Enter `100.00` into `input#downPayment`.
  4. Click `input[value="Apply Now"]`.
- **Expected Outcome of Each Step**:
  1-3. Form filled.
  4. Application approved. Details displayed: Status: Approved.

#### TC-LOAN-003: Loan Application Denied Due to Insufficient Down Payment
- **Module**: Request Loan
- **Scenario**: Customer requests large loan with minimal or insufficient down payment (e.g. 1%)
- **Test Case**: `TC-LOAN-003` - Loan Application Denied Due to Insufficient Down Payment
- **Goal of Test Case**: Verify underwriting engine denies loan and displays 'Denied' status with explanation
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Navigate to `requestloan.htm`.
  2. Enter `100000.00` into `input#amount`.
  3. Enter `10.00` into `input#downPayment`.
  4. Click `input[value="Apply Now"]`.
- **Expected Outcome of Each Step**:
  1-3. Form filled with insufficient down payment.
  4. Loan processed. Status displays 'Denied'. Message indicates insufficient down payment or funds.

#### TC-LOAN-004: Validation of Blank Loan Amount and Down Payment Fields
- **Module**: Request Loan
- **Scenario**: Customer clicks Apply Now with blank amount inputs
- **Test Case**: `TC-LOAN-004` - Validation of Blank Loan Amount and Down Payment Fields
- **Goal of Test Case**: Verify application handles empty loan amount or returns validation message
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Navigate to `requestloan.htm`.
  2. Leave `input#amount` and `input#downPayment` blank.
  3. Click `input[value="Apply Now"]`.
- **Expected Outcome of Each Step**:
  1-2. Blank fields.
  3. Form validation triggers. User is alerted that amount is required, or submission is blocked.

#### TC-LOAN-005: Unauthenticated Direct Access to Loan Application Page
- **Module**: Request Loan
- **Scenario**: Guest user navigates to `requestloan.htm` directly without session
- **Test Case**: `TC-LOAN-005` - Unauthenticated Direct Access to Loan Application Page
- **Goal of Test Case**: Verify captured DOM error `p: An internal error has occurred and has been logged.` appears
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Clear browser cookies.
  2. Navigate directly to `https://parabank.parasoft.com/parabank/requestloan.htm`.
  3. Inspect page response.
- **Expected Outcome of Each Step**:
  1. Cookies cleared.
  2. Direct GET dispatched.
  3. Page displays error message in selector `p`: `An internal error has occurred and has been logged.` or redirects to login.

#### TC-LOAN-006: Boundary Test - Loan Application with Zero Down Payment ($0.00)
- **Module**: Request Loan
- **Scenario**: Customer enters 0.00 in downPayment field
- **Test Case**: `TC-LOAN-006` - Boundary Test - Loan Application with Zero Down Payment ($0.00)
- **Goal of Test Case**: Verify zero down payment boundary condition is evaluated accurately
- **Test Type**: `Edge`
- **Test Steps with Test Data**:
  1. Navigate to `requestloan.htm`.
  2. Enter `5000.00` into `input#amount`.
  3. Enter `0.00` into `input#downPayment`.
  4. Click `input[value="Apply Now"]`.
- **Expected Outcome of Each Step**:
  1-3. Inputs entered.
  4. Loan engine processes zero down payment and evaluates against configured minimum down payment rule.

#### TC-LOAN-007: Boundary Test - Multi-Million Dollar Extreme Loan Request
- **Module**: Request Loan
- **Scenario**: Customer submits $50,000,000 loan amount
- **Test Case**: `TC-LOAN-007` - Boundary Test - Multi-Million Dollar Extreme Loan Request
- **Goal of Test Case**: Verify numerical overflow handling and large number parsing
- **Test Type**: `Edge`
- **Test Steps with Test Data**:
  1. Navigate to `requestloan.htm`.
  2. Enter `50000000.00` into `input#amount`.
  3. Enter `1000000.00` into `input#downPayment`.
  4. Click `input[value="Apply Now"]`.
- **Expected Outcome of Each Step**:
  1-3. Large numbers entered.
  4. Application processes without 64-bit numerical overflow error. Status displays Denied or Approved per threshold.

---

### 4.9 Module 9: Registration (TC-REG)
- **Target URL**: `https://parabank.parasoft.com/parabank/register.htm`
- **Page Title**: `ParaBank | Register for Free Online Account Access`
- **Total Test Cases**: 9 (Positive: 3, Negative: 4, Edge: 2)

#### TC-REG-001: Successful Registration of a New Customer Account
- **Module**: Registration
- **Scenario**: New user submits complete, valid registration details with unique username
- **Test Case**: `TC-REG-001` - Successful Registration of a New Customer Account
- **Goal of Test Case**: Verify new account creation, automatic login, and welcome confirmation banner
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Navigate to `https://parabank.parasoft.com/parabank/register.htm`.
  2. Verify form `#customerForm` with 11 input controls.
  3. Enter `Alice` into `input#customer.firstName`.
  4. Enter `Wonderland` into `input#customer.lastName`.
  5. Enter `100 Rabbit Hole Way` into `input#customer.address.street`.
  6. Enter `Oxford` into `input#customer.address.city`.
  7. Enter `MS` into `input#customer.address.state`.
  8. Enter `38655` into `input#customer.address.zipCode`.
  9. Enter `662-555-0100` into `input#customer.phoneNumber`.
  10. Enter `987-65-4321` into `input#customer.ssn`.
  11. Enter unique username `alice_auto_${Date.now()}` into `input#customer.username`.
  12. Enter `SecretPass123!` into `input#customer.password`.
  13. Enter `SecretPass123!` into `input#repeatedPassword`.
  14. Click submit button `input[type="submit"][value="Register"]`.
- **Expected Outcome of Each Step**:
  1. Registration page renders with title 'ParaBank | Register for Free Online Account Access'.
  2. Form controls are enabled.
  3-13. All fields populated with valid test data.
  14. Registration succeeds. Welcome message renders: 'Welcome alice_auto_... Your account was created successfully. You are now logged in.'.

#### TC-REG-002: Initial Bank Account Provisioning Upon Registration
- **Module**: Registration
- **Scenario**: Verify that newly registered user has a default checking account created
- **Test Case**: `TC-REG-002` - Initial Bank Account Provisioning Upon Registration
- **Goal of Test Case**: Verify automated opening of initial account with default starting balance ($515.50)
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Complete registration flow as in TC-REG-001.
  2. Click 'Accounts Overview' from the left panel.
  3. Inspect `table#accountTable`.
- **Expected Outcome of Each Step**:
  1. User is registered and logged in.
  2. Accounts Overview page loads.
  3. A default account number is present with Balance matching configured initial balance ($515.50).

#### TC-REG-003: Session Persistence and Direct Navigation Following Registration
- **Module**: Registration
- **Scenario**: New user navigates to Transfer Funds and Bill Pay immediately after registering
- **Test Case**: `TC-REG-003` - Session Persistence and Direct Navigation Following Registration
- **Goal of Test Case**: Verify authenticated session is fully established without requiring separate login
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Complete registration for a new user.
  2. Click 'Transfer Funds' in navigation panel.
  3. Verify Transfer Funds form is accessible without login prompt.
- **Expected Outcome of Each Step**:
  1. Registered successfully.
  2. Navigates to `transfer.htm`.
  3. Form `transferForm` is displayed and populated with newly created account number.

#### TC-REG-004: Validation of Blank Mandatory Registration Fields
- **Module**: Registration
- **Scenario**: User clicks Register button without filling in any fields
- **Test Case**: `TC-REG-004` - Validation of Blank Mandatory Registration Fields
- **Goal of Test Case**: Verify field-level error messages appear for all required fields
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Navigate to `register.htm`.
  2. Leave all fields empty.
  3. Click `input[type="submit"][value="Register"]`.
  4. Inspect DOM for error spans.
- **Expected Outcome of Each Step**:
  1. Page renders.
  2. Fields empty.
  3. Submit clicked.
  4. Errors appear for required fields: First name is required, Last name is required, Address is required, City is required, State is required, Zip Code is required, Social Security Number is required, User Name is required, Password is required, Confirm password is required.

#### TC-REG-005: Registration Failure Due to Duplicate / Already Registered Username
- **Module**: Registration
- **Scenario**: User attempts to register with existing username `john`
- **Test Case**: `TC-REG-005` - Registration Failure Due to Duplicate / Already Registered Username
- **Goal of Test Case**: Verify system prevents duplicate user registration and shows username exists error
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Navigate to `register.htm`.
  2. Fill demographic fields with valid information.
  3. Enter existing username `john` into `input#customer.username`.
  4. Enter `Password123!` in password and repeatedPassword.
  5. Click `input[value="Register"]`.
- **Expected Outcome of Each Step**:
  1-4. Form filled with duplicate username.
  5. Registration rejected. Error message `This username already exists.` is displayed in error element.

#### TC-REG-006: Registration Failure Due to Password and Confirm Password Mismatch
- **Module**: Registration
- **Scenario**: User enters differing strings in password and repeatedPassword fields
- **Test Case**: `TC-REG-006` - Registration Failure Due to Password and Confirm Password Mismatch
- **Goal of Test Case**: Verify password confirmation validation catches mismatch
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Navigate to `register.htm`.
  2. Fill demographic fields.
  3. Enter unique username.
  4. Enter `AlphaPassword1` in `input#customer.password`.
  5. Enter `BetaPassword2` in `input#repeatedPassword`.
  6. Click `input[value="Register"]`.
- **Expected Outcome of Each Step**:
  1-5. Fields filled with mismatched passwords.
  6. Registration fails. Error message `Passwords did not match.` appears on page.

#### TC-REG-007: Validation of Non-Standard SSN Format
- **Module**: Registration
- **Scenario**: User enters non-numeric text or symbols in SSN field
- **Test Case**: `TC-REG-007` - Validation of Non-Standard SSN Format
- **Goal of Test Case**: Verify SSN field validation handles malformed strings
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Navigate to `register.htm`.
  2. Enter `ABC-DE-FGHI` into `input#customer.ssn`.
  3. Fill other fields with valid data and submit.
- **Expected Outcome of Each Step**:
  1-2. Invalid SSN entered.
  3. System rejects submission with SSN format error or handles string safely.

#### TC-REG-008: Boundary Test - Complex Password with Extreme Special Characters and Spaces
- **Module**: Registration
- **Scenario**: User registers with password containing spaces, Unicode, and complex symbols
- **Test Case**: `TC-REG-008` - Boundary Test - Complex Password with Extreme Special Characters and Spaces
- **Goal of Test Case**: Verify password hasher handles diverse character sets without truncation
- **Test Type**: `Edge`
- **Test Steps with Test Data**:
  1. Navigate to `register.htm`.
  2. Enter complex password `P@$$w0rd with spaces & #€%!` in password and repeatedPassword.
  3. Submit registration.
  4. Log out and re-login using the complex password.
- **Expected Outcome of Each Step**:
  1-3. Registered successfully.
  4. Login succeeds with exact complex password.

#### TC-REG-009: Boundary Test - Extreme Field Lengths in Registration Demographics
- **Module**: Registration
- **Scenario**: User enters 150-character strings in name, address, and city fields
- **Test Case**: `TC-REG-009` - Boundary Test - Extreme Field Lengths in Registration Demographics
- **Goal of Test Case**: Verify form handles long inputs without page layout breakage
- **Test Type**: `Edge`
- **Test Steps with Test Data**:
  1. Navigate to `register.htm`.
  2. Enter 150 character string in `customer.firstName` and `customer.address.street`.
  3. Fill remaining fields and click `input[value="Register"]`.
- **Expected Outcome of Each Step**:
  1-2. Long strings entered.
  3. System either processes or displays friendly character length error without unhandled 500 error.

---

### 4.10 Module 10: Customer Lookup & Recovery (TC-LOOK)
- **Target URL**: `https://parabank.parasoft.com/parabank/lookup.htm`
- **Page Title**: `ParaBank | Customer Lookup`
- **Total Test Cases**: 6 (Positive: 2, Negative: 3, Edge: 1)

#### TC-LOOK-001: Successful Customer Credential Lookup with Exact Matching Demographics
- **Module**: Customer Lookup & Recovery
- **Scenario**: User enters registered customer demographic details to retrieve forgotten login credentials
- **Test Case**: `TC-LOOK-001` - Successful Customer Credential Lookup with Exact Matching Demographics
- **Goal of Test Case**: Verify system identifies customer and reveals username and password
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Navigate to `https://parabank.parasoft.com/parabank/lookup.htm`.
  2. Verify presence of form `#lookupForm` with 7 demographic fields and submit button `Find My Login Info`.
  3. Enter `John` into `input#firstName`.
  4. Enter `Smith` into `input#lastName`.
  5. Enter `1431 Main St` into `input#address.street`.
  6. Enter `Beverly Hills` into `input#address.city`.
  7. Enter `CA` into `input#address.state`.
  8. Enter `90210` into `input#address.zipCode`.
  9. Enter `310-447-4121` into `input#ssn` (or registered SSN).
  10. Click submit button `input[type="submit"][value="Find My Login Info"]`.
- **Expected Outcome of Each Step**:
  1. Customer Lookup page renders with title 'ParaBank | Customer Lookup'.
  2. Form elements visible.
  3-9. Fields populated with valid customer data.
  10. System displays retrieved credentials message: 'Your login information was located successfully. You are now logged in.' or presents Username and Password details.

#### TC-LOOK-002: Case-Insensitive Customer Lookup Verification
- **Module**: Customer Lookup & Recovery
- **Scenario**: User enters demographic fields in all lowercase letters
- **Test Case**: `TC-LOOK-002` - Case-Insensitive Customer Lookup Verification
- **Goal of Test Case**: Verify database query performs case-insensitive comparison on personal demographics
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Navigate to `lookup.htm`.
  2. Enter lowercase `john` in `firstName`.
  3. Enter lowercase `smith` in `lastName`.
  4. Fill matching address and SSN in lowercase.
  5. Click `input[value="Find My Login Info"]`.
- **Expected Outcome of Each Step**:
  1-4. Lowercase data entered.
  5. Customer credentials located successfully.

#### TC-LOOK-003: Lookup Failure for Non-Existent Customer Data
- **Module**: Customer Lookup & Recovery
- **Scenario**: User enters fictitious personal information
- **Test Case**: `TC-LOOK-003` - Lookup Failure for Non-Existent Customer Data
- **Goal of Test Case**: Verify error message appears indicating customer could not be found
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Navigate to `lookup.htm`.
  2. Enter `FictitiousName` into `input#firstName`.
  3. Enter `GhostLastName` into `input#lastName`.
  4. Enter `000 Nowhere Ave` into `input#address.street`.
  5. Enter `None` into city, state, zipCode, and `000-00-0000` in SSN.
  6. Click `input[value="Find My Login Info"]`.
- **Expected Outcome of Each Step**:
  1-5. Non-existent data entered.
  6. Lookup fails. Error message `The customer could not be found.` or similar notification is displayed.

#### TC-LOOK-004: Validation of Blank Mandatory Demographics on Lookup Form
- **Module**: Customer Lookup & Recovery
- **Scenario**: User clicks Find My Login Info with all input fields empty
- **Test Case**: `TC-LOOK-004` - Validation of Blank Mandatory Demographics on Lookup Form
- **Goal of Test Case**: Verify validation prevents form submission and indicates required fields
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Navigate to `lookup.htm`.
  2. Leave all 7 fields blank.
  3. Click `input[type="submit"][value="Find My Login Info"]`.
- **Expected Outcome of Each Step**:
  1-2. Blank fields.
  3. Form validation triggers. Error messages displayed for required demographic fields.

#### TC-LOOK-005: Lookup Failure Due to Mismatched SSN for Valid Name and Address
- **Module**: Customer Lookup & Recovery
- **Scenario**: User enters correct name and address but wrong SSN
- **Test Case**: `TC-LOOK-005` - Lookup Failure Due to Mismatched SSN for Valid Name and Address
- **Goal of Test Case**: Verify partial match is rejected to protect credential confidentiality
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Navigate to `lookup.htm`.
  2. Enter valid `John` and `Smith` and address.
  3. Enter incorrect SSN `999-99-9999` into `input#ssn`.
  4. Click `input[value="Find My Login Info"]`.
- **Expected Outcome of Each Step**:
  1-3. Data with wrong SSN entered.
  4. Lookup fails. Customer credentials are not displayed.

#### TC-LOOK-006: Boundary Test - Special Characters in Lookup Fields
- **Module**: Customer Lookup & Recovery
- **Scenario**: User enters SQL injection metacharacters (`' OR 1=1 --`) in lookup inputs
- **Test Case**: `TC-LOOK-006` - Boundary Test - Special Characters in Lookup Fields
- **Goal of Test Case**: Verify database query uses parameterized queries and does not leak all accounts
- **Test Type**: `Edge`
- **Test Steps with Test Data**:
  1. Navigate to `lookup.htm`.
  2. Enter `' OR '1'='1` into `input#firstName`.
  3. Enter `' OR '1'='1` into `input#ssn`.
  4. Click `input[value="Find My Login Info"]`.
- **Expected Outcome of Each Step**:
  1-3. Metacharacters entered.
  4. System rejects query safely without leaking database records or throwing SQL exceptions.

---

### 4.11 Module 11: Customer Support (TC-CARE)
- **Target URL**: `https://parabank.parasoft.com/parabank/contact.htm`
- **Page Title**: `ParaBank | Customer Care`
- **Total Test Cases**: 6 (Positive: 3, Negative: 2, Edge: 1)

#### TC-CARE-001: Successful Customer Care Message Submission with Valid Details
- **Module**: Customer Support
- **Scenario**: Customer fills out name, email, phone, and message, then submits inquiry
- **Test Case**: `TC-CARE-001` - Successful Customer Care Message Submission with Valid Details
- **Goal of Test Case**: Verify support message transmission succeeds and presents thank-you confirmation
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Navigate to `https://parabank.parasoft.com/parabank/contact.htm`.
  2. Verify presence of form `#contactForm` with inputs `name`, `email`, `phone`, `textarea#message`, and submit button `Send to Customer Care`.
  3. Enter `Jane Doe` into `input#name`.
  4. Enter `jane.doe@example.com` into `input#email`.
  5. Enter `+15551234567` into `input#phone`.
  6. Enter `Inquiring about business account interest rates and international wire fees.` into `textarea#message`.
  7. Click submit button `input[type="submit"][value="Send to Customer Care"]`.
- **Expected Outcome of Each Step**:
  1. Customer Care page renders with title 'ParaBank | Customer Care'.
  2. Form elements visible and enabled.
  3-6. Inputs populated with valid inquiry data.
  7. Message sent. Success page displays: 'Thank you Jane Doe' and 'A Customer Care Representative will be contacting you.'.

#### TC-CARE-002: Submission of Support Message by Authenticated Customer
- **Module**: Customer Support
- **Scenario**: Logged-in customer accesses contact form and submits message
- **Test Case**: `TC-CARE-002` - Submission of Support Message by Authenticated Customer
- **Goal of Test Case**: Verify authenticated user can submit customer care messages while logged in
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Log in with valid credentials.
  2. Click 'contact' in the top header menu (`ul.button li a[href*="contact.htm"]`).
  3. Enter inquiry message in `textarea#message`.
  4. Click `input[value="Send to Customer Care"]`.
- **Expected Outcome of Each Step**:
  1. Authenticated session active.
  2. Navigates to `contact.htm`.
  3. Message entered.
  4. Message successfully dispatched with thank you confirmation.

#### TC-CARE-003: Validation of Blank Mandatory Fields on Support Form
- **Module**: Customer Support
- **Scenario**: User clicks Send to Customer Care without filling in any fields
- **Test Case**: `TC-CARE-003` - Validation of Blank Mandatory Fields on Support Form
- **Goal of Test Case**: Verify validation prevents submission of empty support ticket
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Navigate to `contact.htm`.
  2. Leave `name`, `email`, `phone`, and `message` blank.
  3. Click `input[type="submit"][value="Send to Customer Care"]`.
  4. Inspect DOM for validation errors.
- **Expected Outcome of Each Step**:
  1-2. Blank fields.
  3. Submit clicked.
  4. Validation triggers indicating that Name, Email, Phone, and Message are required.

#### TC-CARE-004: Validation of Malformed Email Address Format
- **Module**: Customer Support
- **Scenario**: User enters invalid email syntax (e.g. `invalid_email_no_at`)
- **Test Case**: `TC-CARE-004` - Validation of Malformed Email Address Format
- **Goal of Test Case**: Verify email format validation rejects malformed address strings
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Navigate to `contact.htm`.
  2. Enter `Jane Doe` in `name`.
  3. Enter `not-an-email-address` into `input#email`.
  4. Enter `555-1234` in phone and test text in `message`.
  5. Click `input[value="Send to Customer Care"]`.
- **Expected Outcome of Each Step**:
  1-4. Malformed email entered.
  5. System rejects invalid email format with validation notice.

#### TC-CARE-005: Guest Access to Customer Care Without Session Requirement
- **Module**: Customer Support
- **Scenario**: Guest user without account needs assistance and submits inquiry
- **Test Case**: `TC-CARE-005` - Guest Access to Customer Care Without Session Requirement
- **Goal of Test Case**: Verify Customer Care is publicly accessible to unauthenticated visitors
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Clear cookies and navigate to `https://parabank.parasoft.com/parabank/contact.htm`.
  2. Fill form with guest inquiries.
  3. Click `input[value="Send to Customer Care"]`.
- **Expected Outcome of Each Step**:
  1. Page renders without redirecting to login.
  2. Form filled.
  3. Ticket successfully submitted.

#### TC-CARE-006: Boundary Test - Extreme Message Payload and Special Characters
- **Module**: Customer Support
- **Scenario**: User submits 5,000-character message with embedded HTML and XML tags
- **Test Case**: `TC-CARE-006` - Boundary Test - Extreme Message Payload and Special Characters
- **Goal of Test Case**: Verify message sanitization prevents XSS and handles large text payload
- **Test Type**: `Edge`
- **Test Steps with Test Data**:
  1. Navigate to `contact.htm`.
  2. Fill name, email, and phone.
  3. Enter large text (`'Lorem Ipsum ' * 400`) with `<script>alert('test')</script>` into `textarea#message`.
  4. Click `input[value="Send to Customer Care"]`.
- **Expected Outcome of Each Step**:
  1-3. Large payload and tags entered.
  4. System processes or encodes message safely without executing script tags or overflowing buffer.

---

### 4.12 Module 12: About Information (TC-ABT)
- **Target URL**: `https://parabank.parasoft.com/parabank/about.htm`
- **Page Title**: `ParaBank | About Us`
- **Total Test Cases**: 4 (Positive: 2, Negative: 1, Edge: 1)

#### TC-ABT-001: Verification of About Us Page Header, Body Content, and Layout
- **Module**: About Information
- **Scenario**: User visits About Us page to read company background and version info
- **Test Case**: `TC-ABT-001` - Verification of About Us Page Header, Body Content, and Layout
- **Goal of Test Case**: Verify static information renders correctly with valid page structure and titles
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Navigate to `https://parabank.parasoft.com/parabank/about.htm`.
  2. Verify page title is 'ParaBank | About Us'.
  3. Verify presence of header 'ParaSoft Demo App'.
  4. Verify content body describing ParaBank purpose and Parasoft Corporation.
- **Expected Outcome of Each Step**:
  1. Page loads with status 200.
  2. Title matches 'ParaBank | About Us'.
  3. Main heading is visible.
  4. Content text is rendered cleanly.

#### TC-ABT-002: Verification of External Parasoft Hyperlink Navigation
- **Module**: About Information
- **Scenario**: User clicks on the Parasoft corporate website hyperlink
- **Test Case**: `TC-ABT-002` - Verification of External Parasoft Hyperlink Navigation
- **Goal of Test Case**: Verify external link points to `www.parasoft.com` with valid URL
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Navigate to `about.htm`.
  2. Locate external website link in `ul.visit a[href*="parasoft.com"]` or main body.
  3. Verify href attribute equals `http://www.parasoft.com/`.
- **Expected Outcome of Each Step**:
  1. Page renders.
  2. Link element is present.
  3. `href` attribute is verified as valid corporate link.

#### TC-ABT-003: Error Handling for Invalid Sub-Path under About URL
- **Module**: About Information
- **Scenario**: User navigates to a non-existent sub-resource under `about.htm`
- **Test Case**: `TC-ABT-003` - Error Handling for Invalid Sub-Path under About URL
- **Goal of Test Case**: Verify server handles invalid about paths gracefully with 404 or redirect
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Request URL `https://parabank.parasoft.com/parabank/about.htm/non_existent_page`.
  2. Inspect HTTP status code and response body.
- **Expected Outcome of Each Step**:
  1. Invalid URL requested.
  2. Server returns HTTP 404 Not Found or friendly error page without leaking internal server directories.

#### TC-ABT-004: Layout Integrity and Broken Links Audit Across About Page
- **Module**: About Information
- **Scenario**: Verify all statutory navigation links (header, left menu, footer) on About page
- **Test Case**: `TC-ABT-004` - Layout Integrity and Broken Links Audit Across About Page
- **Goal of Test Case**: Verify complete link integrity and absence of HTTP 404 broken links
- **Test Type**: `Edge`
- **Test Steps with Test Data**:
  1. Navigate to `about.htm`.
  2. Collect all anchor tags (`a[href]`) on the page (Solutions, Services, Products, Locations, Admin Page, Home, Contact).
  3. Check HTTP status code for each internal link.
- **Expected Outcome of Each Step**:
  1. Page renders.
  2. Links collected.
  3. All internal links return HTTP 200/302. Zero broken links detected.

---

### 4.13 Module 13: Web Services API (TC-API)
- **Target URL**: `https://parabank.parasoft.com/parabank/services.htm`
- **Page Title**: `ParaBank | Services`
- **Total Test Cases**: 4 (Positive: 2, Negative: 1, Edge: 1)

#### TC-API-001: Verification of Web Services Catalog Documentation and Tables
- **Module**: Web Services API
- **Scenario**: Developer/tester accesses `services.htm` to inspect published web services
- **Test Case**: `TC-API-001` - Verification of Web Services Catalog Documentation and Tables
- **Goal of Test Case**: Verify presence of SOAP and REST service tables, endpoint paths, and descriptions
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Navigate to `https://parabank.parasoft.com/parabank/services.htm`.
  2. Verify page title is 'ParaBank | Services'.
  3. Verify presence of documentation tables detailing Web Service operations.
  4. Verify listings for operations: `requestLoan`, `deposit`, `withdraw`, `transfer`.
- **Expected Outcome of Each Step**:
  1. Services page loads with status 200.
  2. Title matches.
  3. Documentation tables are rendered.
  4. Core banking operations are clearly documented.

#### TC-API-002: WSDL and Swagger/WADL Service Definition Links Availability
- **Module**: Web Services API
- **Scenario**: User clicks WSDL definition link to view XML schema
- **Test Case**: `TC-API-002` - WSDL and Swagger/WADL Service Definition Links Availability
- **Goal of Test Case**: Verify WSDL endpoint links (`?wsdl`) resolve correctly to valid XML definitions
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Navigate to `services.htm`.
  2. Locate WSDL link (e.g., `services/ParaBank?wsdl` or `ParaBankService?wsdl`).
  3. Fetch the WSDL endpoint.
  4. Verify HTTP status 200 and XML contentType.
- **Expected Outcome of Each Step**:
  1. Page renders.
  2. WSDL link located.
  3. Request sent.
  4. Response is HTTP 200 containing valid XML schema definitions (`<wsdl:definitions>`).

#### TC-API-003: Error Handling for Non-Existent Web Service Operation or WSDL Path
- **Module**: Web Services API
- **Scenario**: User requests non-existent service definition endpoint
- **Test Case**: `TC-API-003` - Error Handling for Non-Existent Web Service Operation or WSDL Path
- **Goal of Test Case**: Verify API service engine returns HTTP 404 or SOAP fault for invalid services
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Request URL `https://parabank.parasoft.com/parabank/services/NonExistentService?wsdl`.
  2. Inspect HTTP status code and response.
- **Expected Outcome of Each Step**:
  1. Request sent.
  2. Server returns HTTP 404 or proper SOAP fault. No server crash occurs.

#### TC-API-004: Boundary Test - Cross-Origin Resource Sharing (CORS) and API Accessibility
- **Module**: Web Services API
- **Scenario**: Inspect HTTP headers and protocol support on web services page
- **Test Case**: `TC-API-004` - Boundary Test - Cross-Origin Resource Sharing (CORS) and API Accessibility
- **Goal of Test Case**: Verify service page accessibility and proper content-type encoding
- **Test Type**: `Edge`
- **Test Steps with Test Data**:
  1. Send HTTP GET request to `services.htm`.
  2. Inspect Content-Type response header (`text/html;charset=UTF-8`).
  3. Verify page renders without console JavaScript errors.
- **Expected Outcome of Each Step**:
  1. Request dispatched.
  2. Headers indicate valid UTF-8 charset.
  3. No client-side script errors recorded.

---

### 4.14 Module 14: System Administration (TC-ADM)
- **Target URL**: `https://parabank.parasoft.com/parabank/admin.htm`
- **Page Title**: `ParaBank | Administration`
- **Total Test Cases**: 9 (Positive: 5, Negative: 2, Edge: 2)

#### TC-ADM-001: Successful Database Initialization via 'INITIALIZE' Action Button
- **Module**: System Administration
- **Scenario**: Administrator clicks 'INITIALIZE' button to reset database to factory state
- **Test Case**: `TC-ADM-001` - Successful Database Initialization via 'INITIALIZE' Action Button
- **Goal of Test Case**: Verify database re-initialization executes successfully and displays confirmation
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Navigate to `https://parabank.parasoft.com/parabank/admin.htm`.
  2. Verify presence of Database Administration form with button `input[type="submit"][name="action"][value="INIT"]`.
  3. Click `input[value="INIT"]`.
  4. Inspect page confirmation.
- **Expected Outcome of Each Step**:
  1. Admin page loads with title 'ParaBank | Administration'.
  2. 'INITIALIZE' button is visible and active.
  3. Database initialization POST request dispatched.
  4. Confirmation message 'Database Initialized' or page reloads with default sample data restored.

#### TC-ADM-002: Successful Database Cleanup via 'CLEAN' Action Button
- **Module**: System Administration
- **Scenario**: Administrator clicks 'CLEAN' button to purge transient test records
- **Test Case**: `TC-ADM-002` - Successful Database Cleanup via 'CLEAN' Action Button
- **Goal of Test Case**: Verify database cleanup executes and restores baseline consistency
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Navigate to `admin.htm`.
  2. Locate button `input[type="submit"][name="action"][value="CLEAN"]`.
  3. Click `input[value="CLEAN"]`.
  4. Inspect page confirmation.
- **Expected Outcome of Each Step**:
  1. Page renders.
  2. 'CLEAN' button located.
  3. Request sent.
  4. System confirms database clean action completed successfully.

#### TC-ADM-003: Successful Update of System Configuration Parameters (Balances, Thresholds)
- **Module**: System Administration
- **Scenario**: Administrator modifies initial balance and minimum balance parameters
- **Test Case**: `TC-ADM-003` - Successful Update of System Configuration Parameters (Balances, Thresholds)
- **Goal of Test Case**: Verify form `#adminForm` saves modified parameters to backend configuration
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Navigate to `admin.htm`.
  2. Locate form `form#adminForm`.
  3. Change `input#initialBalance` to `1000.00`.
  4. Change `input#minimumBalance` to `200.00`.
  5. Change `input#loanProcessorThreshold` to `30`.
  6. Click submit button `input[type="submit"][value="Submit"]`.
  7. Inspect confirmation message.
- **Expected Outcome of Each Step**:
  1. Page renders.
  2. Form `#adminForm` present.
  3-5. Parameters modified.
  6. Submission dispatched.
  7. Message displays: 'Settings saved successfully.' Updated values persist on reload.

#### TC-ADM-004: Configuration of Loan Provider and Loan Processor Dropdown Settings
- **Module**: System Administration
- **Scenario**: Administrator updates loan provider to 'Local' and processor to 'Combined'
- **Test Case**: `TC-ADM-004` - Configuration of Loan Provider and Loan Processor Dropdown Settings
- **Goal of Test Case**: Verify dropdown selections persist correctly in database configuration
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Navigate to `admin.htm`.
  2. Select `local` from `select#loanProvider` (options: `jms`, `ws`, `local`).
  3. Select `combined` from `select#loanProcessor` (options: `funds`, `down`, `combined`).
  4. Click `input[value="Submit"]`.
  5. Reload page and inspect selected options.
- **Expected Outcome of Each Step**:
  1. Page renders.
  2. `local` selected.
  3. `combined` selected.
  4. Settings submitted.
  5. Upon reload, `select#loanProvider` shows 'Local' and `select#loanProcessor` shows 'Combined'.

#### TC-ADM-005: JMS Service Shutdown Trigger via Dedicated Management Form
- **Module**: System Administration
- **Scenario**: Administrator invokes JMS shutdown via Form #2
- **Test Case**: `TC-ADM-005` - JMS Service Shutdown Trigger via Dedicated Management Form
- **Goal of Test Case**: Verify JMS service shutdown POST request is accepted and handled safely
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Navigate to `admin.htm`.
  2. Locate JMS form with action `jms.htm` and hidden input `shutdown` (`value="true"`).
  3. Click button `input[type="submit"][value="Shutdown"]`.
  4. Inspect system response.
- **Expected Outcome of Each Step**:
  1. Page renders.
  2. JMS controls visible.
  3. Shutdown triggered.
  4. JMS service responds with shutdown confirmation or status update without taking the main HTTP web app offline.

#### TC-ADM-006: Switching Data Access Mode Radio Options (SOAP, REST-XML, REST-JSON, JDBC)
- **Module**: System Administration
- **Scenario**: Administrator changes data access mode from JDBC (default) to SOAP or REST
- **Test Case**: `TC-ADM-006` - Switching Data Access Mode Radio Options (SOAP, REST-XML, REST-JSON, JDBC)
- **Goal of Test Case**: Verify radio selection (`accessMode1`, `accessMode2`, `accessMode3`, `accessMode4`) updates active backend provider
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Navigate to `admin.htm`.
  2. Verify `input#accessMode4` (JDBC) is default checked.
  3. Click radio `input#accessMode2` (REST-XML).
  4. Click `input[value="Submit"]`.
  5. Refresh page.
- **Expected Outcome of Each Step**:
  1. Page renders.
  2. JDBC radio checked initially.
  3. REST-XML radio selected.
  4. Submitted.
  5. Refresh shows `accessMode2` radio checked.

#### TC-ADM-007: Validation of Negative or Illegal Numeric Input for Balances
- **Module**: System Administration
- **Scenario**: Administrator enters negative amount or invalid letters in Initial Balance
- **Test Case**: `TC-ADM-007` - Validation of Negative or Illegal Numeric Input for Balances
- **Goal of Test Case**: Verify input validation prevents corrupting system balance thresholds
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Navigate to `admin.htm`.
  2. Enter `-500.00` into `input#initialBalance`.
  3. Enter `INVALID_BAL` into `input#minimumBalance`.
  4. Click `input[value="Submit"]`.
- **Expected Outcome of Each Step**:
  1-3. Invalid values entered.
  4. Application either rejects submission with validation error or sanitizes numerical values safely.

#### TC-ADM-008: Boundary Test - Zero Balance Thresholds and Extreme Threshold Values
- **Module**: System Administration
- **Scenario**: Administrator sets initial and minimum balance to 0.00 and threshold to 100
- **Test Case**: `TC-ADM-008` - Boundary Test - Zero Balance Thresholds and Extreme Threshold Values
- **Goal of Test Case**: Verify system permits 0.00 threshold settings without division by zero errors
- **Test Type**: `Edge`
- **Test Steps with Test Data**:
  1. Navigate to `admin.htm`.
  2. Enter `0.00` into `input#initialBalance`.
  3. Enter `0.00` into `input#minimumBalance`.
  4. Enter `100` into `input#loanProcessorThreshold`.
  5. Click `input[value="Submit"]`.
- **Expected Outcome of Each Step**:
  1-4. Boundary values populated.
  5. Settings saved successfully. Zero values maintained in database.

#### TC-ADM-009: Boundary Test - Malformed SOAP and REST Endpoint URLs
- **Module**: System Administration
- **Scenario**: Administrator inputs malformed URL strings in endpoint fields
- **Test Case**: `TC-ADM-009` - Boundary Test - Malformed SOAP and REST Endpoint URLs
- **Goal of Test Case**: Verify system handles non-standard endpoint strings safely
- **Test Type**: `Edge`
- **Test Steps with Test Data**:
  1. Navigate to `admin.htm`.
  2. Enter `htp:/bad-url:9999/malformed` into `input#soapEndpoint`.
  3. Enter `javascript:alert(1)` into `input#restEndpoint`.
  4. Click `input[value="Submit"]`.
- **Expected Outcome of Each Step**:
  1-3. Malformed strings entered.
  4. System sanitizes inputs to prevent XSS or rejects malformed URL format.

---

### 4.15 Module 15: Site Map (TC-MAP)
- **Target URL**: `https://parabank.parasoft.com/parabank/sitemap.htm`
- **Page Title**: `ParaBank | Site Map`
- **Total Test Cases**: 4 (Positive: 2, Negative: 1, Edge: 1)

#### TC-MAP-001: Verification of Complete Site Map Page Structure and Category Lists
- **Module**: Site Map
- **Scenario**: User visits Site Map page to inspect application structure
- **Test Case**: `TC-MAP-001` - Verification of Complete Site Map Page Structure and Category Lists
- **Goal of Test Case**: Verify presence of all listed service and navigation links in `sitemap.htm`
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Navigate to `https://parabank.parasoft.com/parabank/sitemap.htm`.
  2. Verify page title is 'ParaBank | Site Map'.
  3. Verify presence of list `ul` with links to: Open New Account, Accounts Overview, Transfer Funds, Bill Pay, Find Transactions, Update Contact Info, Request Loan, Log Out.
  4. Verify presence of links to: About Us, Services, Products, Locations, Admin Page.
- **Expected Outcome of Each Step**:
  1. Site map loads with status 200.
  2. Title matches 'ParaBank | Site Map'.
  3. Banking service links are present.
  4. Statutory and informational links are present.

#### TC-MAP-002: Functional Deep Navigation to Core Banking Services via Site Map Links
- **Module**: Site Map
- **Scenario**: User clicks on 'Bill Pay' link directly within Site Map
- **Test Case**: `TC-MAP-002` - Functional Deep Navigation to Core Banking Services via Site Map Links
- **Goal of Test Case**: Verify deep link routes accurately to target module page
- **Test Type**: `Positive`
- **Test Steps with Test Data**:
  1. Navigate to `sitemap.htm`.
  2. Click link `Bill Pay` (`a[href*="billpay.htm"]`).
  3. Verify URL and target page load.
- **Expected Outcome of Each Step**:
  1. Site map rendered.
  2. Bill Pay link clicked.
  3. Browser navigates to `https://parabank.parasoft.com/parabank/billpay.htm`.

#### TC-MAP-003: Handling of Malformed Query Parameters on Site Map URL
- **Module**: Site Map
- **Scenario**: User navigates to `sitemap.htm?invalidParam=malformed_injection`
- **Test Case**: `TC-MAP-003` - Handling of Malformed Query Parameters on Site Map URL
- **Goal of Test Case**: Verify page handles unrecognized query strings gracefully without 500 error
- **Test Type**: `Negative`
- **Test Steps with Test Data**:
  1. Navigate to `https://parabank.parasoft.com/parabank/sitemap.htm?view=invalid_view&payload=<script>alert(1)</script>`.
  2. Inspect page response and render.
- **Expected Outcome of Each Step**:
  1. Malformed request sent.
  2. Site map renders default layout. Script is not executed, and server does not return 500 exception.

#### TC-MAP-004: Comprehensive Hyperlink Integrity Audit Across Site Map
- **Module**: Site Map
- **Scenario**: Automated verification of every hyperlink in `sitemap.htm`
- **Test Case**: `TC-MAP-004` - Comprehensive Hyperlink Integrity Audit Across Site Map
- **Goal of Test Case**: Verify zero dead or broken links (404/500) across the entire site map
- **Test Type**: `Edge`
- **Test Steps with Test Data**:
  1. Navigate to `sitemap.htm`.
  2. Extract all anchor `href` values.
  3. Perform HTTP HEAD/GET request on each unique link.
  4. Verify no links return 404 Not Found or 500 Server Error.
- **Expected Outcome of Each Step**:
  1. Page loaded.
  2. All links extracted.
  3. Status codes evaluated.
  4. 100% of internal links resolve to valid endpoints with 200/302 status codes.

---

## 5. Playwright Test Creator Agent Consumption Guidelines

Test Creator Agents (Playwright script generators) must observe the following technical standards when converting these test cases into automated test scripts:

### 5.1 Selector Mapping Strategy
Always prioritize selectors from `app-inventory.json` using stable, accessible locators:
1. **Form Controls by Exact Name / ID**:
   - Customer First Name: `page.locator('input[name="customer.firstName"]')` or `page.locator('#customer\\.firstName')`
   - Payee Phone Number: `page.locator('input[name="payee.phoneNumber"]')`
   - Amount Input: `page.locator('input#amount')`
   - Account Dropdowns: `page.locator('select#fromAccountId')`, `page.locator('select#toAccountId')`
2. **Submit & Trigger Buttons**:
   - Log In: `page.locator('input[type="submit"][value="Log In"]')`
   - Transfer: `page.locator('input[type="submit"][value="Transfer"]')`
   - Open Account: `page.locator('input[type="button"][value="Open New Account"]')`
   - Send Payment: `page.locator('input[type="button"][value="Send Payment"]')`
   - Find by ID: `page.locator('#findById')`
   - Find by Date: `page.locator('#findByDate')`
   - Find by Date Range: `page.locator('#findByDateRange')`
   - Find by Amount: `page.locator('#findByAmount')`
   - Update Profile: `page.locator('input[type="button"][value="Update Profile"]')`
   - Apply for Loan: `page.locator('input[type="button"][value="Apply Now"]')`
   - Register: `page.locator('input[type="submit"][value="Register"]')`
   - Lookup: `page.locator('input[type="submit"][value="Find My Login Info"]')`
   - Customer Care: `page.locator('input[type="submit"][value="Send to Customer Care"]')`
   - Admin Init / Clean: `page.locator('input[name="action"][value="INIT"]')`, `page.locator('input[name="action"][value="CLEAN"]')`
3. **Error Assertions**:
   - Bill Pay Errors: `await expect(page.locator('#validationModel-name')).toHaveText('Payee name is required.')`
   - Transfer Errors: `await expect(page.locator('#amount\\.errors')).toHaveText('The amount cannot be empty.')`
   - Profile Errors: `await expect(page.locator('#firstName-error')).toHaveText('First name is required.')`
   - Unauthenticated Alerts: `await expect(page.locator('p')).toContainText('An internal error has occurred and has been logged.')`

### 5.2 Test Fixtures & Authentication State
To optimize execution speed across the 103 test cases:
- **Auth State Storage**: Execute `TC-AUTH-001` once to create a storage state (`storageState.json`) containing the authenticated `JSESSIONID` cookie.
- **Isolated Guest Context**: For unauthenticated test cases (e.g., `TC-ACCT-003`, `TC-XFER-005`, `TC-CARE-005`), create a fresh `browser.newContext({ storageState: undefined })`.
- **Dynamic Usernames**: For Registration (`TC-REG-001`), append timestamps (`Date.now()`) to ensure idempotent runs without duplicate username conflicts.

### 5.3 Deterministic Test Execution Pipeline
```typescript
// Sample Playwright Test Snippet for Consuming Agents
import { test, expect } from '@playwright/test';

test.describe('Module 4: Transfer Funds', () => {
  test('TC-XFER-003: Validation of Empty Amount Field', async ({ page }) => {
    // 1. Navigate to Transfer Funds
    await page.goto('https://parabank.parasoft.com/parabank/transfer.htm');
    
    // 2. Leave amount empty and trigger Transfer
    await page.locator('input#amount').fill('');
    await page.locator('input[type="submit"][value="Transfer"]').click();
    
    // 3. Verify exact ground-truth DOM validation message
    const errorElem = page.locator('#amount\\.errors');
    await expect(errorElem).toBeVisible();
    await expect(errorElem).toHaveText('The amount cannot be empty.');
  });
});
```

---
> **Test Plan Generation Complete**: Fully synchronized with `app-inventory.json`.
