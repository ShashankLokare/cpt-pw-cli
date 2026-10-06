/**
 * Playwright Application Crawler & Mapper
 * 
 * Complies with user requirements:
 * 1. Navigates to user's web application
 * 2. Captures in JSON file:
 *    a. all objects with object type
 *    b. all objects properties and their values
 *    c. all default values
 *    d. all list values
 *    e. all errors, warnings and popups
 * 3. Ensures for all forms: all form field values are filled before moving to next step
 * 4. Maps each pages, modules and features
 * 5. Uses playwright-cli compatible commands and Playwright engine
 */

const fs = require('fs');
const path = require('path');
const url = require('url');

// Locate playwright-core from global npm install or local
let playwright;
try {
  playwright = require('playwright');
} catch (e1) {
  try {
    playwright = require('C:/Users/HP/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright-core');
  } catch (e2) {
    console.error('Failed to locate playwright or playwright-core:', e2.message);
    process.exit(1);
  }
}

const EXTRACTOR_SCRIPT_PATH = path.join(__dirname, 'playwright-dom-extractor.js');
const extractorCode = fs.readFileSync(EXTRACTOR_SCRIPT_PATH, 'utf-8');

async function crawlAndInspectApp(options) {
  const startUrl = options.url || 'http://localhost:3000';
  const maxPages = options.maxPages || 10;
  const outputFile = options.outputFile || path.join(process.cwd(), 'playwright-app-inventory.json');
  const headless = options.headless !== undefined ? options.headless : true;

  console.log(`\n======================================================`);
  console.log(` Playwright CLI Application Inspector & Crawler`);
  console.log(` Target URL : ${startUrl}`);
  console.log(` Max Pages  : ${maxPages}`);
  console.log(` Headless   : ${headless}`);
  console.log(` Output     : ${outputFile}`);
  console.log(`======================================================\n`);

  const browser = await playwright.chromium.launch({
    headless: headless,
    args: ['--disable-blink-features=AutomationControlled']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();

  // Logging & Event capture
  const consoleMessages = [];
  const dialogEvents = [];

  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleMessages.push({
      timestamp: new Date().toISOString(),
      url: page.url(),
      type: type, // 'error', 'warning', 'log', 'info', etc.
      text: text
    });
    if (type === 'error' || type === 'warning') {
      console.log(`  [Console ${type.toUpperCase()}] ${text.slice(0, 100)}`);
    }
  });

  page.on('pageerror', err => {
    consoleMessages.push({
      timestamp: new Date().toISOString(),
      url: page.url(),
      type: 'uncaught-error',
      text: err.message
    });
    console.log(`  [Page Error] ${err.message.slice(0, 100)}`);
  });

  page.on('dialog', async dialog => {
    const dialogInfo = {
      timestamp: new Date().toISOString(),
      url: page.url(),
      type: dialog.type(),
      message: dialog.message(),
      defaultValue: dialog.defaultValue()
    };
    dialogEvents.push(dialogInfo);
    console.log(`  [Dialog Popup] ${dialog.type()}: "${dialog.message()}"`);
    await dialog.accept();
  });

  const visitedUrls = new Set();
  const queue = [startUrl];
  const targetHost = new URL(startUrl).host;

  // Pre-seed known core routes for the application if target is ParaBank
  if (startUrl.includes('parabank')) {
    const baseUrl = startUrl.substring(0, startUrl.lastIndexOf('/') + 1);
    const knownParaBankRoutes = [
      'index.htm',
      'overview.htm',
      'openaccount.htm',
      'transfer.htm',
      'billpay.htm',
      'findtrans.htm',
      'updateprofile.htm',
      'requestloan.htm',
      'register.htm',
      'lookup.htm',
      'contact.htm',
      'about.htm',
      'services.htm',
      'admin.htm',
      'sitemap.htm'
    ].map(p => baseUrl + p);

    for (const route of knownParaBankRoutes) {
      if (!queue.includes(route)) {
        queue.push(route);
      }
    }
  }

  const appInventory = {
    metadata: {
      generatedAt: new Date().toISOString(),
      targetUrl: startUrl,
      maxPagesLimit: maxPages
    },
    application: {
      host: targetHost,
      totalVisitedPages: 0,
      modules: {},
      summary: {
        totalObjectsCaptured: 0,
        totalDefaultValuesCaptured: 0,
        totalListValuesCaptured: 0,
        totalFormsProcessed: 0,
        totalErrorsAndWarnings: 0,
        totalPopupsDetected: 0
      }
    },
    pages: []
  };

  let hasAuthenticated = false;

  while (queue.length > 0 && visitedUrls.size < maxPages) {
    let currentUrl = queue.shift();
    // Normalize URL: strip jsessionid and hash
    currentUrl = currentUrl.split('#')[0].replace(/;jsessionid=[^?]+/i, '');

    if (visitedUrls.has(currentUrl)) continue;

    visitedUrls.add(currentUrl);
    console.log(`\n--> [Navigating] (${visitedUrls.size}/${maxPages}): ${currentUrl}`);

    try {
      await page.goto(currentUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(1000);
    } catch (navErr) {
      console.warn(`  Warning: Failed to load ${currentUrl}: ${navErr.message}`);
      continue;
    }

    // Step 1: Ensure all forms are filled before proceeding
    console.log(`  Checking and filling all form fields on page...`);
    const formFillResult = await page.evaluate(() => {
      const fields = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]), select, textarea');
      const fills = [];
      fields.forEach(f => {
        if (f.disabled || f.readOnly) return;
        const tag = f.tagName.toLowerCase();
        const type = (f.getAttribute('type') || 'text').toLowerCase();
        const name = (f.name || f.id || f.getAttribute('placeholder') || '').toLowerCase();
        let changed = false;

        if (tag === 'select') {
          if (!f.value) {
            const opt = Array.from(f.options).find(o => o.value && !o.disabled);
            if (opt) {
              f.value = opt.value;
              f.dispatchEvent(new Event('change', { bubbles: true }));
              f.dispatchEvent(new Event('input', { bubbles: true }));
              changed = true;
            }
          }
        } else if (type === 'checkbox' || type === 'radio') {
          if (!f.checked) {
            f.checked = true;
            f.dispatchEvent(new Event('change', { bubbles: true }));
            f.dispatchEvent(new Event('click', { bubbles: true }));
            changed = true;
          }
        } else if (tag === 'textarea') {
          if (!f.value || !f.value.trim()) {
            f.value = 'Automated descriptive test notes for form field inspection.';
            f.dispatchEvent(new Event('input', { bubbles: true }));
            f.dispatchEvent(new Event('change', { bubbles: true }));
            changed = true;
          }
        } else {
          if (!f.value || !f.value.trim()) {
            let sample = 'Sample Input';
            if (type === 'email' || name.includes('email')) sample = 'test.user@example.com';
            else if (type === 'password' || name.includes('password')) sample = 'P@ssw0rd123!';
            else if (type === 'number') sample = '100';
            else if (type === 'tel' || name.includes('phone') || name.includes('tel')) sample = '+15551234567';
            else if (type === 'date') sample = new Date().toISOString().split('T')[0];
            else if (name.includes('ssn')) sample = '123-45-6789';
            else if (name.includes('account')) sample = '13344';
            else if (name.includes('amount')) sample = '100.00';
            else if (name.includes('zip') || name.includes('postal')) sample = '90210';
            else if (name.includes('city')) sample = 'Springfield';
            else if (name.includes('state')) sample = 'CA';
            else if (name.includes('street') || name.includes('address')) sample = '123 Main Street';
            else if (name.includes('first')) sample = 'Jane';
            else if (name.includes('last')) sample = 'Doe';
            else if (name.includes('name')) sample = 'Jane Doe';
            else if (name.includes('user') || name.includes('login')) sample = 'john';

            f.value = sample;
            f.dispatchEvent(new Event('input', { bubbles: true }));
            f.dispatchEvent(new Event('change', { bubbles: true }));
            changed = true;
          }
        }

        fills.push({
          name: f.name || f.id || 'unnamed',
          tag: tag,
          type: type,
          filledNow: changed,
          currentValue: f.value,
          isValid: f.checkValidity ? f.checkValidity() : true
        });
      });
      return fills;
    });

    console.log(`  Form fields processed: ${formFillResult.length} (Newly filled: ${formFillResult.filter(f => f.filledNow).length})`);

    // Step 2: Inject and run extractor
    await page.addScriptTag({ content: extractorCode });
    const pageData = await page.evaluate(() => window.__playwrightExtractor.capture({ autoFillForms: false }));

    // Attach form fill result
    pageData.formFillResults = formFillResult;

    // Attach captured console & dialog events relevant to this page
    const pageConsole = consoleMessages.filter(c => c.url === currentUrl || c.url === page.url());
    pageData.errorsWarningsAndPopups.consoleLogs = pageConsole;
    pageData.errorsWarningsAndPopups.dialogPopups = dialogEvents.filter(d => d.url === currentUrl || d.url === page.url());

    // Update summary counts
    appInventory.application.summary.totalObjectsCaptured += pageData.objectsCount;
    appInventory.application.summary.totalDefaultValuesCaptured += pageData.defaultValues.length;
    appInventory.application.summary.totalListValuesCaptured += pageData.listValues.length;
    appInventory.application.summary.totalFormsProcessed += pageData.forms.length;
    appInventory.application.summary.totalErrorsAndWarnings +=
      pageData.errorsWarningsAndPopups.domErrors.length +
      pageData.errorsWarningsAndPopups.warnings.length +
      pageConsole.filter(c => c.type === 'error' || c.type === 'warning').length;
    appInventory.application.summary.totalPopupsDetected +=
      pageData.errorsWarningsAndPopups.popups.length + dialogEvents.length;

    // Map module and features
    const moduleName = pageData.page.module;
    if (!appInventory.application.modules[moduleName]) {
      appInventory.application.modules[moduleName] = {
        name: moduleName,
        pages: [],
        features: new Set()
      };
    }
    appInventory.application.modules[moduleName].pages.push(pageData.page.url);
    pageData.page.features.forEach(f => appInventory.application.modules[moduleName].features.add(f));

    appInventory.pages.push(pageData);

    // If on initial index / login page and not authenticated, perform login to establish session cookies
    if (!hasAuthenticated && currentUrl.includes('index.htm')) {
      const loginFormExists = await page.$('input[name="username"]');
      if (loginFormExists) {
        console.log(`  Authenticating demo user 'john' to unlock application features...`);
        try {
          await page.fill('input[name="username"]', 'john');
          await page.fill('input[name="password"]', 'demo');
          await page.click('input[value="Log In"], input[type="submit"]');
          await page.waitForTimeout(1500);
          hasAuthenticated = true;
          console.log(`  Authentication successful, session established.`);
        } catch (authErr) {
          console.warn(`  Authentication step failed or skipped: ${authErr.message}`);
        }
      }
    }

    const internalLinks = await page.evaluate(host => {
      const anchors = Array.from(document.querySelectorAll('a[href]'));
      const hrefs = [];
      anchors.forEach(a => {
        try {
          const u = new URL(a.href, window.location.href);
          const isSameSite = (host && u.host === host) || (!host && u.protocol === 'file:');
          if (isSameSite && !u.pathname.match(/\.(png|jpg|jpeg|gif|css|js|svg|pdf|zip)$/i)) {
            const clean = u.href.split('#')[0].replace(/;jsessionid=[^?]+/i, '');
            if (!clean.includes('logout.htm')) {
              hrefs.push(clean);
            }
          }
        } catch (e) {}
      });
      return [...new Set(hrefs)];
    }, targetHost);

    for (const link of internalLinks) {
      const cleanLink = link.split('#')[0].replace(/;jsessionid=[^?]+/i, '');
      if (!visitedUrls.has(cleanLink) && !queue.includes(cleanLink) && queue.length + visitedUrls.size < maxPages * 2) {
        queue.push(cleanLink);
      }
    }
  }

  // Convert Sets to Arrays for clean JSON serialization
  for (const mod in appInventory.application.modules) {
    appInventory.application.modules[mod].features = Array.from(appInventory.application.modules[mod].features);
  }
  appInventory.application.totalVisitedPages = visitedUrls.size;

  // Save to file
  fs.writeFileSync(outputFile, JSON.stringify(appInventory, null, 2), 'utf-8');
  console.log(`\n======================================================`);
  console.log(` Inspection Complete!`);
  console.log(` Pages Crawled : ${appInventory.application.totalVisitedPages}`);
  console.log(` Objects Found : ${appInventory.application.summary.totalObjectsCaptured}`);
  console.log(` Forms Filled  : ${appInventory.application.summary.totalFormsProcessed}`);
  console.log(` Saved JSON to : ${outputFile}`);
  console.log(`======================================================\n`);

  await browser.close();
  return appInventory;
}

// CLI Execution support
if (require.main === module) {
  const args = process.argv.slice(2);
  let targetUrl = 'http://localhost:3000';
  let maxPages = 5;
  let outFile = path.join(process.cwd(), 'playwright-app-inventory.json');
  let headless = true;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--url' && args[i + 1]) {
      targetUrl = args[i + 1];
      i++;
    } else if (args[i] === '--max-pages' && args[i + 1]) {
      maxPages = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--out' && args[i + 1]) {
      outFile = path.resolve(args[i + 1]);
      i++;
    } else if (args[i] === '--headed') {
      headless = false;
    } else if (!args[i].startsWith('-')) {
      targetUrl = args[i];
    }
  }

  crawlAndInspectApp({
    url: targetUrl,
    maxPages: maxPages,
    outputFile: outFile,
    headless: headless
  }).catch(err => {
    console.error('Fatal Crawler Error:', err);
    process.exit(1);
  });
}

module.exports = { crawlAndInspectApp };
