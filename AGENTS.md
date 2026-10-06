# Playwright-CLI Inspection & Mapping Agent

This repository defines and configures the **`playwright-cli-agent`** designed for automated web application inspection, form validation, error detection, and architectural module mapping.

## Agent Responsibilities

1. **Navigation**: Navigates to user-specified web applications using `playwright-cli open` / `playwright-cli goto`.
2. **Comprehensive DOM Capture in JSON**:
   - **All Objects with Object Type**: Semantic categorization (`text-input`, `password-input`, `dropdown-select`, `submit-button`, `dialog-modal`, `table`, `list`, `navigation-bar`, etc.).
   - **All Object Properties & Values**: HTML attributes (`id`, `name`, `class`, `placeholder`, `aria-*`, `data-*`), bounding box, visibility, disabled, required, and text content.
   - **All Default Values**: `defaultValue`, `defaultChecked`, `defaultSelected` for inputs, textareas, checkboxes, radios, and selects.
   - **All List Values**: Dropdown `<select>` options, `<datalist>` items, ARIA listboxes/menus, and structured `<ul>`/`<ol>` items.
   - **All Errors, Warnings, and Popups**: Browser console errors and warnings (`playwright-cli console`), modal/native popups (`playwright-cli dialog-accept`), DOM alert elements (`[role="alert"]`, `.error`, `.alert-danger`), and HTML5 validation messages.
3. **Mandatory Form Completion Rule**:
   - Inspects all form fields on every page.
   - **Ensures all form field values are filled with valid data before proceeding to the next step or submitting**.
   - Validates that `checkValidity()` passes for all fields.
4. **Application Mapping**:
   - Hierarchically maps pages into functional **Modules** (e.g., Authentication, Dashboard, Settings, Checkout, Catalog) and **Features** (e.g., "Registration Form", "Live Search", "Data Table Grid").
   - Compiles everything into a structured JSON file (`playwright-app-inventory.json`).
5. **Adherence to `playwright-cli/SKILL.md`**:
   - Uses ref targeting (`e1`, `e2`) from snapshots.
   - Executes commands with appropriate escaping for Windows (`--%` for query strings with `&`).

## Execution Methods

### Method 1: Subagent Invocation (Antigravity)
The subagent `playwright-cli-agent` is registered and can be invoked directly:
```json
{
  "TypeName": "playwright-cli-agent",
  "Role": "Playwright Application Inspector",
  "Playwright Mode": "headed",
  "Prompt": "Navigate to http://localhost:3000, inspect all pages, fill all form fields before advancing, and export the map to playwright-app-inventory.json"
}
```

### Method 2: Automated Crawler Runner
Run the automated crawler directly from the terminal:
```bash
node scripts/crawler/playwright-crawler.js --url "http://localhost:3000" --max-pages 10 --out "artifacts/inventory/app-inventory.json"
```

### Method 3: Step-by-Step with `playwright-cli`
```bash
# 1. Open the browser
playwright-cli open https://example.com/

# 2. Run in-session step inspector & form filler
playwright-cli run-code --filename=scripts/inspector/playwright-cli-step.js

# 3. View console errors/warnings
playwright-cli console warning

# 4. Interact using snapshot refs
playwright-cli snapshot
playwright-cli click e12
```

---

# Test Planner Agent (`planner-agent`)

This repository also defines and configures the **`planner-agent`** designed for automated test strategy formulation, scenario decomposition, and test plan authoring based on the captured application inventory (`app-inventory.json`).

## Agent Responsibilities

1. **Inventory Parsing & Object Identification**:
   - Ingests `app-inventory.json`.
   - Identifies all DOM objects, object types, properties, modules, pages, forms, form fields, dropdown/list options, and captured validation messages.
2. **Feature Decomposition into Test Cases**:
   - Breaks down each functional module into distinct scenarios covering:
     - **Positive Cases**: Happy paths, valid submissions, proper data persistence.
     - **Negative Cases**: Mandatory field omissions, format mismatches, unauthorized access, invalid inputs.
     - **Edge Cases**: Boundary conditions, zero balances, special characters, maximum lengths.
3. **Structured Test Plan Architecture**:
   - Formats each test case hierarchically:
     `Module -> Scenario -> Test Case (ID & Title) -> Goal of Test Case -> Test Type -> Test Steps with Test Data -> Expected Outcome of Each Step`.
4. **Coverage Matrix per Module**:
   - Generates a traceability and test coverage matrix across all modules and features.
5. **Markdown Artifact Output**:
   - Produces a comprehensive Markdown file (`TEST_PLAN.md`) consumable by Test Creator Agents to generate automated test scripts.

---

# TypeScript Test Script Creator Agent (`ts-testscript-creator`)

Defined in `.agents/agents/ts-testscript-creator/agent.md`, this agent ingests `TEST_PLAN.md` and `app-inventory.json` to generate production-grade Playwright TypeScript (`.spec.ts`) automated test suites with Page Object Models, strict typings, resilient locators, and complete assertions.

## Agent Responsibilities

1. **Artifact Ingestion & Alignment**:
   - Ingests `TEST_PLAN.md` (all 103 test cases across 15 modules, including Positive, Negative, and Edge scenarios).
   - Ingests `app-inventory.json` to ensure 100% alignment with actual DOM element tags, attributes (`name`, `id`), option values, and validation error selectors.
2. **Page Object Model (POM) Scaffolding**:
   - Creates modular, typed Page Objects under `e2e/pages/` extending a common `BasePage`.
   - Encapsulates page actions, navigation, and resilient locator definitions (`getByRole`, `locator('input[name="..."]')`).
3. **Comprehensive Test Suite Generation**:
   - Generates `.spec.ts` test files under `e2e/tests/` mapped to modules.
   - Annotates tests with `@testcase <ID>`, `@type`, and `@goal`.
   - Implements web-first auto-waiting assertions (`toBeVisible()`, `toHaveText()`, `toHaveURL()`, `toBeChecked()`).
4. **Session Management & Fixtures**:
   - Configures authentication setup (`auth.setup.ts`) with session state caching (`storageState: '.auth/user.json'`).
   - Supplies custom test fixtures for authenticated and guest user journeys.
5. **Configuration & Execution**:
   - Prepares `playwright.config.ts` and `tsconfig.json`.
   - Validates generated suites with `npx playwright test`.

## Subagent Invocation (Antigravity)
```json
{
  "TypeName": "ts-testscript-creator",
  "Role": "TypeScript Test Script Creator",
  "Prompt": "Ingest TEST_PLAN.md and app-inventory.json, scaffold Page Object Models under e2e/pages/, generate Playwright TypeScript test specs under e2e/tests/ for all 15 modules, and configure playwright.config.ts."
}
```

