# Complete Guide: Adapting the Autonomous Test Engineering Framework to GitHub Copilot CLI + GPT-5.3 Codex

This document provides the complete, production-grade architectural specification and step-by-step implementation guide for porting this 3-tier Autonomous Test Automation Framework from **Antigravity CLI (Gemini 3.8)** to **GitHub Copilot CLI (GPT-5.3 Codex)**.

---

## Table of Contents
1. [Executive Summary & Architectural Comparison](#1-executive-summary--architectural-comparison)
2. [Component Adaptation Mapping Matrix](#2-component-adaptation-mapping-matrix)
3. [Target Project Directory Layout](#3-target-project-directory-layout)
4. [Copilot CLI Configuration & Custom Instructions](#4-copilot-cli-configuration--custom-instructions)
5. [Reusable Copilot Prompt Templates (.github/prompts/)](#5-reusable-copilot-prompt-templates-githubprompts)
6. [Phase-by-Phase Execution Guide](#6-phase-by-phase-execution-guide)
   - [Phase 1: Application Discovery & DOM Extraction (Zero Tokens)](#phase-1-application-discovery--dom-extraction-zero-tokens)
   - [Phase 2: Module Decomposition & Test Planning](#phase-2-module-decomposition--test-planning)
   - [Phase 3: Page Object Model (POM) Scaffolding](#phase-3-page-object-model-pom-scaffolding)
   - [Phase 4: Playwright TypeScript Spec Synthesis](#phase-4-playwright-typescript-spec-synthesis)
   - [Phase 5: Execution, Type Checking & Self-Healing](#phase-5-execution-type-checking--self-healing)
7. [The Master Automation Pipeline Runner (`scripts/copilot-pipeline.js`)](#7-the-master-automation-pipeline-runner-scriptscopilot-pipelinejs)
8. [Edge Cases, Token Ceiling Workarounds & Troubleshooting](#8-edge-cases-token-ceiling-workarounds--troubleshooting)

---

## 1. Executive Summary & Architectural Comparison

### The Core Difference: Native Subagents vs. Script-Orchestrated Pipelines
In **Google Antigravity CLI**, the runtime is built around **autonomous multi-agent supervisors** with tools like `invoke_subagent`, `manage_task`, and `schedule`. When prompted with a high-level task, Antigravity natively creates isolated subagent threads that run long-running background tasks, manage their own context memory, and report back when deliverables are complete.

In **GitHub Copilot CLI + GPT-5.3 Codex**, the runtime operates as a **single-thread terminal assistant / code generator**. If you prompt Copilot CLI with a monolithic instruction like:
> *"Crawl parabank, map all DOM objects, create a 103 test-case plan, and write 30 TypeScript files with Page Objects and Playwright tests"*

The execution collapses due to four technical constraints:
1. **Context Window Saturation**: Ingesting a 16,000-line (400KB+) JSON inventory into a single chat stream crowds out model attention, leading to selector hallucination.
2. **Output Token Ceilings**: CLI interactions have an output limit (typically 4k–8k tokens). A 30-file test suite (~50,000 tokens) will be truncated mid-file or replaced with stubbed comments (`// TODO: implement remaining tests...`).
3. **Lack of Background Daemon Process Management**: Long-running commands (like a 45-second Playwright crawl or test run) risk timing out the terminal chat session.
4. **Interactive Confirmation Gates**: Copilot CLI frequently halts execution to ask the developer for command confirmation.

### The Architectural Solution
To run this framework reliably in **Copilot CLI**, we use a **File-Driven, Script-Orchestrated Pipeline**:
* **Offload Heavy Lifting to Helper Programs**: Application crawling, JSON extraction, and test plan assembly are executed by deterministic Node.js/Python scripts (0 LLM token cost).
* **Intermediate Representation (IR) Contracts**: Communication between phases happens strictly via saved files on disk (`app-inventory.json` and `TEST_PLAN.md`).
* **Targeted, Module-by-Module Code Generation**: Copilot CLI is prompted to generate **one file at a time**, referencing only the relevant module slice from disk.
* **Closed-Loop Self-Healing**: Failed Playwright test traces (`error-context.md`) are piped directly back into Copilot CLI for automated locator patching.

---

## 2. Component Adaptation Mapping Matrix

| Framework Component | Antigravity CLI + Gemini 3.8 Implementation | Copilot CLI + GPT-5.3 Codex Adaptation |
| :--- | :--- | :--- |
| **Discovery Agent** | `playwright-cli-agent` (invoked via `invoke_subagent`) | `node scripts/crawler/playwright-crawler.js` (CLI command) |
| **In-Session Inspection** | `scripts/inspector/playwright-cli-step.js` via Playwright skill | `node scripts/inspector/playwright-cli-step.js` via terminal |
| **Test Planning Agent** | `planner-agent` (ingests raw 400KB JSON in 1M token context) | `python scripts/planner/generate_test_plan.py` + `catalog_extracted.json` |
| **Test Script Creator** | `ts-testscript-creator` (synthesizes 30 files in continuous tool loop) | Iterative `gh copilot suggest` prompts guided by `.github/copilot-instructions.md` |
| **Agent State Sharing** | In-memory message bus (`send_message`, transcript logs) | Filesystem artifacts (`app-inventory.json`, `TEST_PLAN.md`) |
| **Self-Healing Loop** | Autonomous `manage_task` monitoring + Playwright trace reading | Piping `test-results/**/error-context.md` into `gh copilot suggest` |

---

## 3. Target Project Directory Layout

```
your-project/
├── .github/
│   ├── copilot-instructions.md          # Global agent directives for Codex
│   └── prompts/                         # Task-specific prompt templates
│       ├── 01-crawl-app.prompt.md
│       ├── 02-plan-tests.prompt.md
│       ├── 03-scaffold-pom.prompt.md
│       ├── 04-generate-spec.prompt.md
│       └── 05-heal-test.prompt.md
├── artifacts/                             # Persistent data deliverables (IR)
│   ├── inventory/
│   │   └── app-inventory.json             # Normalized DOM object map (405 KB)
│   └── test-plans/
│       └── TEST_PLAN.md                   # 103 test cases across 15 modules
├── scripts/                               # Helper programs & runners
│   ├── crawler/
│   │   ├── playwright-crawler.js          # Headless DOM crawler & form filler
│   │   └── playwright-dom-extractor.js    # In-browser DOM extraction logic
│   ├── inspector/
│   │   └── playwright-cli-step.js         # Interactive step inspector
│   ├── planner/
│   │   ├── generate_test_plan.py          # Unified markdown compiler for test plans
│   │   ├── test_plan_data.json            # 103 test cases dataset (JSON)
│   │   ├── extract_full_module_catalog.py # Chunker extracting lightweight catalog
│   │   └── catalog_extracted.json         # Lightweight module/form summary
│   └── copilot-pipeline.js                # Master automation runner for Copilot CLI
├── tests/                                 # Playwright TypeScript Test Suite
│   ├── fixtures/
│   │   ├── test-data.ts                   # Static accounts, credentials, payee factories
│   │   └── test-fixtures.ts               # Custom test fixtures with typed POMs
│   ├── pages/                             # Page Object Models extending BasePage
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   ├── AccountsOverviewPage.ts
│   │   ├── OpenAccountPage.ts
│   │   ├── TransferFundsPage.ts
│   │   ├── BillPayPage.ts
│   │   ├── FindTransactionsPage.ts
│   │   ├── UpdateProfilePage.ts
│   │   ├── RequestLoanPage.ts
│   │   ├── RegistrationPage.ts
│   │   ├── CustomerLookupPage.ts
│   │   ├── CustomerSupportPage.ts
│   │   ├── AdminPage.ts
│   │   └── StaticContentPage.ts
│   └── specs (01 to 15):
│       ├── 01-authentication.spec.ts
│       ├── ...
│       └── 15-site-map.spec.ts
├── playwright.config.ts                   # Playwright configuration
├── tsconfig.json                          # TypeScript configuration (strict, ES2022)
├── package.json                           # NPM dependencies and workflow scripts
└── README.md
```

---

## 4. Copilot CLI Configuration & Custom Instructions

Create `.github/copilot-instructions.md` in the workspace root. Copilot CLI will automatically inject these guidelines into every prompt, ensuring consistent TypeScript and Playwright conventions:

```markdown
# Playwright TypeScript Test Automation Architecture Guidelines

When generating, modifying, or refactoring code in this repository, follow these rules:

### 1. Page Object Model (POM) Rules
- All page interactions must reside in dedicated Page Object classes under `tests/pages/` extending `BasePage`.
- Spec files (`tests/*.spec.ts`) must NEVER use raw selectors or `page.locator()` directly if a Page Object exists for that view.
- Store locators as `readonly` class properties in constructor (`this.amountInput = page.locator('input#amount')`).
- Encapsulate user journeys as typed async methods on the Page Object (`async transfer(amount: string, from?: string, to?: string)`).

### 2. Resilient Selector Strategy
- All selectors MUST align with actual attributes discovered in `artifacts/inventory/app-inventory.json`.
- CSS dot escaping: Always escape dots in element IDs (e.g., `#amount\\.errors`, `#customer\\.firstName`).
- Strict Mode Compliance: Never use ambiguous multi-element selectors like `#rightPanel h1` or `.title`. Use scoped locators or web-first role selectors (`page.getByRole('heading', { name: 'Transfer Complete!' })`).
- Use accessible locators where possible: `getByRole`, `getByLabel`, `getByPlaceholder`.

### 3. Traceability & Annotation Schema
Every test case in a `.spec.ts` file must include JSDoc annotations matching `artifacts/test-plans/TEST_PLAN.md`:
```typescript
/**
 * @testcase TC-XFER-001
 * @type Positive
 * @goal Verify customer can transfer funds successfully between valid accounts.
 */
test('TC-XFER-001: Successful Fund Transfer Between Different Customer Accounts', async ({ loginPage, transferPage, page }) => {
  // ...
});
```

### 4. Deterministic Execution & Auto-Waiting
- Never use arbitrary `page.waitForTimeout()` sleeps in assertions.
- Use Playwright web-first assertions: `await expect(locator).toBeVisible()`, `await expect(locator).toHaveText(...)`.
- Set `workers: 1` in `playwright.config.ts` when running against demo applications to prevent public session state collisions.
```

---

## 5. Reusable Copilot Prompt Templates (`.github/prompts/`)

Create modular prompt files under `.github/prompts/` to invoke specific tasks with consistent outputs:

### File: `.github/prompts/03-scaffold-pom.prompt.md`
```markdown
---
description: Scaffold a Page Object Model class extending BasePage based on app-inventory.json
---
Look at the module entry for "{{module_name}}" in `artifacts/inventory/app-inventory.json`.
Generate a TypeScript Page Object Model class at `tests/pages/{{page_class_name}}.ts`:
1. Import `BasePage` from `./BasePage.js` and extend it.
2. Define readonly Locators for all inputs, selects, buttons, and validation error spans identified in the inventory.
3. Escape CSS dots in IDs (e.g. `#amount\\.errors`).
4. Implement navigation and form completion helper methods with typed parameters.
5. Ensure zero strict-mode selector ambiguities.
```

### File: `.github/prompts/04-generate-spec.prompt.md`
```markdown
---
description: Generate a Playwright TypeScript spec file for a module defined in TEST_PLAN.md
---
Read module "{{module_name}}" from `artifacts/test-plans/TEST_PLAN.md` and the Page Object at `tests/pages/{{page_class_name}}.ts`.
Generate the Playwright test specification at `tests/{{spec_file_name}}`:
1. Import test and expect from `./fixtures/test-fixtures.js` and test data from `./fixtures/test-data.js`.
2. Group tests in `test.describe('Module X: {{module_name}}', () => { ... })`.
3. Implement all Positive, Negative, and Edge test cases verbatim with their respective IDs and titles.
4. Annotate each test with `@testcase`, `@type`, and `@goal`.
5. Use Page Object methods for user actions and web-first assertions for verification.
```

### File: `.github/prompts/05-heal-test.prompt.md`
```markdown
---
description: Analyze a Playwright error trace and heal failing Page Objects or test assertions
---
A test failure occurred. Inspect the error trace at `{{error_trace_path}}`.
1. Diagnose why the locator failed (strict mode collision, hidden element, or attribute mismatch).
2. Cross-reference `artifacts/inventory/app-inventory.json` for the ground-truth DOM element.
3. Patch `tests/pages/{{page_class_name}}.ts` or the spec file to resolve the issue.
4. Verify the fix complies with `.github/copilot-instructions.md`.
```

---

## 6. Phase-by-Phase Execution Guide

---

### Phase 1: Application Discovery & DOM Extraction (Zero Tokens)

**Do not ask Copilot CLI to browse or navigate manually.** Run the deterministic crawler script:

```bash
# Run headless crawl against target application
node scripts/crawler/playwright-crawler.js \
  --url "https://parabank.parasoft.com/parabank/index.htm" \
  --max-pages 15 \
  --out "artifacts/inventory/app-inventory.json"
```

#### What this helper program does:
1. Explores all accessible internal routes.
2. Captures all DOM interactive elements with semantic categorization (`text-input`, `dropdown-select`, `submit-button`, `dialog-modal`, `table`).
3. **Mandatory Form Completion Rule**: Detects every form on every visited page, fills all fields with valid synthetic data, and validates `checkValidity()` before advancing.
4. Records all field default values, select `<option>` lists, and DOM validation error selectors (`#validationModel-name`, `#amount.errors`).
5. Saves the complete snapshot into `artifacts/inventory/app-inventory.json`.

---

### Phase 2: Module Decomposition & Test Planning

To avoid context window overflow in Copilot CLI, extract the lightweight module catalog first:

```bash
# 1. Extract lightweight catalog slices
python scripts/planner/extract_full_module_catalog.py
```

This creates `scripts/planner/catalog_extracted.json` (~80KB vs 405KB).

#### 2. Generate the Full Test Plan:
Run the master test plan generator:
```bash
python scripts/planner/generate_test_plan.py
```
This compiles the master [TEST_PLAN.md](artifacts/test-plans/TEST_PLAN.md) with all **103 test cases** across **15 modules**, including the exact coverage matrix (38 Positive, 39 Negative, 26 Edge).

*If you are adapting to a new web application, use Copilot CLI to generate test cases module-by-module:*
```bash
gh copilot suggest "Read Module 1 from scripts/planner/catalog_extracted.json. Formulate Positive, Negative, and Edge test cases following the template in .github/copilot-instructions.md and output into artifacts/test-plans/TEST_PLAN.md."
```

---

### Phase 3: Page Object Model (POM) Scaffolding

Generate Page Object classes one by one using Copilot CLI:

```bash
# Generate BasePage
gh copilot suggest "Create tests/pages/BasePage.ts with a constructor accepting Playwright Page and helper methods goto(path), waitForLoaded(), and getTitle()."

# Generate LoginPage
gh copilot suggest "Read Form #1 from artifacts/inventory/app-inventory.json. Create tests/pages/LoginPage.ts extending BasePage with username, password, loginButton locators and a typed login(username, password) method."

# Generate TransferFundsPage
gh copilot suggest "Read Form #3 from artifacts/inventory/app-inventory.json. Create tests/pages/TransferFundsPage.ts extending BasePage with amount, fromAccountId, toAccountId, transferButton locators and transfer(amount, from, to) method. Escape dots in #amount\\.errors."
```

---

### Phase 4: Playwright TypeScript Spec Synthesis

Generate the individual `.spec.ts` files mapped directly to the modules in `TEST_PLAN.md`:

```bash
# Example: Generate Module 1 (Authentication)
gh copilot suggest "Read Module 1 test cases (TC-AUTH-001 to TC-AUTH-008) from artifacts/test-plans/TEST_PLAN.md and tests/pages/LoginPage.ts. Create tests/01-authentication.spec.ts using test fixture from tests/fixtures/test-fixtures.ts."

# Example: Generate Module 4 (Transfer Funds)
gh copilot suggest "Read Module 4 test cases (TC-XFER-001 to TC-XFER-008) from artifacts/test-plans/TEST_PLAN.md and tests/pages/TransferFundsPage.ts. Create tests/04-transfer-funds.spec.ts with all 8 test cases."
```

---

### Phase 5: Execution, Type Checking & Self-Healing

#### Step 5.1: Verify TypeScript Compilation
```bash
npx tsc --noEmit
```
If errors occur, pipe the output to Copilot CLI:
```bash
gh copilot suggest "Fix TypeScript compilation errors in tests: $(npx tsc --noEmit)"
```

#### Step 5.2: Execute Tests
```bash
# Run all tests
npx playwright test

# Run a single module
npx playwright test tests/04-transfer-funds.spec.ts
```

#### Step 5.3: Self-Healing Failed Locators
When a test fails, Playwright writes the error stack and HTML snapshot to:
`test-results/<test-directory>/error-context.md`

Pipe this file directly to Copilot CLI to auto-patch the locator:
```bash
# PowerShell
$err = Get-Content -Raw "test-results/04-transfer-funds.../error-context.md"
gh copilot suggest "Fix strict mode locator violation reported here: $err. Update tests/pages/TransferFundsPage.ts."
```

---

## 7. The Master Automation Pipeline Runner (`scripts/copilot-pipeline.js`)

To orchestrate these steps without manually typing 30 commands, add this automation runner to your repository:

```javascript
/**
 * scripts/copilot-pipeline.js
 * Master pipeline orchestrator for Copilot CLI environments.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd, desc) {
  console.log(`\n========================================`);
  console.log(`[PIPELINE] ${desc}`);
  console.log(`[EXEC] ${cmd}`);
  console.log(`========================================\n`);
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (err) {
    console.error(`[ERROR] Command failed: ${cmd}`);
    process.exit(1);
  }
}

const targetUrl = process.argv[2] || 'https://parabank.parasoft.com/parabank/index.htm';

console.log(`Starting Autonomous Test Pipeline for: ${targetUrl}`);

// Step 1: Run crawler to capture DOM inventory
run(
  `node scripts/crawler/playwright-crawler.js --url "${targetUrl}" --max-pages 15 --out "artifacts/inventory/app-inventory.json"`,
  'Step 1: Application Discovery & DOM Extraction'
);

// Step 2: Extract module catalog
run(
  `python scripts/planner/extract_full_module_catalog.py`,
  'Step 2: Module Catalog Extraction'
);

// Step 3: Generate Master Test Plan
run(
  `python scripts/planner/generate_test_plan.py`,
  'Step 3: Test Plan Generation (TEST_PLAN.md)'
);

// Step 4: Verify TypeScript compilation
run(
  `npx tsc --noEmit`,
  'Step 4: TypeScript Type Checking'
);

// Step 5: Execute Playwright Test Suite
run(
  `npx playwright test`,
  'Step 5: Playwright Test Suite Execution'
);

console.log('\n[SUCCESS] Pipeline executed successfully! View report with: npx playwright show-report');
```

Add the runner script to your `package.json`:
```json
{
  "scripts": {
    "pipeline": "node scripts/copilot-pipeline.js",
    "crawl": "node scripts/crawler/playwright-crawler.js",
    "plan": "python scripts/planner/generate_test_plan.py",
    "typecheck": "tsc --noEmit",
    "test:e2e": "playwright test",
    "test:report": "playwright show-report"
  }
}
```

---

## 8. Edge Cases, Token Ceiling Workarounds & Troubleshooting

### 1. Handling Output Token Limits (Truncated Files)
* **Symptom**: Copilot CLI stops generating halfway through a file or leaves `// ...rest of tests`.
* **Fix**: Never ask for more than one `.spec.ts` file per prompt. If a module has more than 10 test cases (e.g. `05-bill-payment.spec.ts`), split the prompt into two requests:
  - Prompt A: *"Implement TC-BILL-001 through TC-BILL-005 in tests/05-bill-payment.spec.ts."*
  - Prompt B: *"Append TC-BILL-006 through TC-BILL-011 to tests/05-bill-payment.spec.ts."*

### 2. Eliminating Selector Hallucinations
* **Symptom**: Copilot invents standard selector names (e.g. `input#email` or `button.submit`) instead of the actual application DOM attributes.
* **Fix**: In your prompt, explicitly cite the exact form ID or action from `app-inventory.json`:
  > *"Use exact attributes from Form #4 in artifacts/inventory/app-inventory.json: input[name='payee.name'], input[name='payee.address.street'], and span#validationModel-name."*

### 3. Resolving Playwright Strict Mode Collisions
* **Symptom**: `Error: strict mode violation: locator('#rightPanel h1') resolved to 3 elements`.
* **Fix**: Single-page apps frequently keep hidden `<h1>` elements in the DOM for multiple tabs. Instruct Copilot to use Playwright role selectors with exact text matching:
  ```typescript
  // Replace:
  await expect(page.locator('#rightPanel h1')).toHaveText('Transfer Complete!');
  // With:
  await expect(page.getByRole('heading', { name: 'Transfer Complete!' })).toBeVisible();
  ```

### 4. Escaping CSS Dots in IDs
* **Symptom**: `SyntaxError: '#amount.errors' is not a valid selector`.
* **Fix**: In CSS, a dot indicates a class name. If an element has `id="amount.errors"`, it must be escaped with a double backslash:
  ```typescript
  page.locator('#amount\\.errors')
  ```

### 5. Cloudflare Rate Limiting (HTTP 429 / Error 1015)
* **Symptom**: `Error 1015: You are being rate limited` or `Performing security verification`.
* **Fix**:
  1. In `playwright.config.ts`, enforce single-worker execution: `workers: 1`.
  2. In SQL injection tests (e.g. `TC-AUTH-008`), assert that the request is blocked or redirected to security verification rather than expecting a standard application login failure message.

---

## Summary Workflow Checklist

- [x] Run `playwright-crawler.js` to create `artifacts/inventory/app-inventory.json` (0 tokens).
- [x] Run `extract_full_module_catalog.py` to create `catalog_extracted.json`.
- [x] Run `generate_test_plan.py` to compile `TEST_PLAN.md` (103 test cases).
- [x] Set up `.github/copilot-instructions.md` with strict Playwright guidelines.
- [x] Use `gh copilot suggest` to scaffold Page Objects in `tests/pages/` one by one.
- [x] Use `gh copilot suggest` to generate test specs in `tests/` one by one.
- [x] Run `npx tsc --noEmit` to verify type safety.
- [x] Run `npx playwright test` and pipe `error-context.md` into Copilot CLI for self-healing.
