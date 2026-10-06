/**
 * Playwright-CLI Step Inspector Function
 * Designed for execution via:
 *   playwright-cli run-code --filename=scripts/playwright-cli-step.js
 *
 * Runs inside the current playwright-cli browser session:
 * 1. Fills any unfilled form fields in the active page
 * 2. Extracts all objects, properties, default values, list values, errors/warnings/popups
 * 3. Identifies page module & features
 * 4. Returns JSON string of captured inspection state
 */
async page => {
  // 1. Autofill all unfilled fields in all forms
  const fillSummary = await page.evaluate(() => {
    const fields = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]), select, textarea');
    let filledCount = 0;
    fields.forEach(f => {
      if (f.disabled || f.readOnly) return;
      const tag = f.tagName.toLowerCase();
      const type = (f.getAttribute('type') || 'text').toLowerCase();
      let changed = false;

      if (tag === 'select') {
        if (!f.value) {
          const opt = Array.from(f.options).find(o => o.value && !o.disabled);
          if (opt) {
            f.value = opt.value;
            f.dispatchEvent(new Event('change', { bubbles: true }));
            changed = true;
          }
        }
      } else if (type === 'checkbox' || type === 'radio') {
        if (!f.checked) {
          f.checked = true;
          f.dispatchEvent(new Event('change', { bubbles: true }));
          changed = true;
        }
      } else if (tag === 'textarea') {
        if (!f.value || !f.value.trim()) {
          f.value = 'Automated sample notes for form progression.';
          f.dispatchEvent(new Event('input', { bubbles: true }));
          f.dispatchEvent(new Event('change', { bubbles: true }));
          changed = true;
        }
      } else {
        if (!f.value || !f.value.trim()) {
          let sample = 'Sample Text';
          if (type === 'email') sample = 'agent.test@example.com';
          else if (type === 'password') sample = 'SecurePassword123!';
          else if (type === 'number') sample = '1';
          else if (type === 'tel') sample = '+15551234567';
          else if (type === 'date') sample = new Date().toISOString().split('T')[0];

          f.value = sample;
          f.dispatchEvent(new Event('input', { bubbles: true }));
          f.dispatchEvent(new Event('change', { bubbles: true }));
          changed = true;
        }
      }
      if (changed) filledCount++;
    });
    return { totalFields: fields.length, newlyFilled: filledCount };
  });

  // 2. Perform deep DOM inspection
  const inspection = await page.evaluate(() => {
    function getVisibleText(el) {
      if (!el) return '';
      return (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ');
    }

    function determineObjectType(el) {
      const tag = el.tagName.toLowerCase();
      const role = el.getAttribute('role');
      const type = el.getAttribute('type');
      if (tag === 'input') return `${type || 'text'}-input`;
      if (tag === 'textarea') return 'textarea-input';
      if (tag === 'select') return 'dropdown-select';
      if (tag === 'button' || role === 'button') return type === 'submit' ? 'submit-button' : 'button';
      if (tag === 'a') return 'link';
      if (tag === 'form') return 'form';
      if (tag === 'dialog' || role === 'dialog') return 'dialog-modal';
      if (tag === 'table') return 'table';
      if (tag === 'ul' || tag === 'ol') return 'list';
      if (tag === 'nav' || role === 'navigation') return 'navigation-bar';
      if (tag === 'header' || role === 'banner') return 'header-module';
      if (tag === 'footer' || role === 'contentinfo') return 'footer-module';
      if (tag.match(/^h[1-6]$/)) return `heading-${tag}`;
      if (role) return `aria-${role}`;
      return tag;
    }

    const elements = Array.from(document.querySelectorAll('input, button, select, textarea, a[href], form, table, dialog, [role], h1, h2, h3, ul, ol, nav, header, footer'));
    const objects = [];
    const defaultValues = [];
    const listValues = [];

    elements.forEach((el, idx) => {
      const objType = determineObjectType(el);
      const attrs = {};
      for (let i = 0; i < el.attributes.length; i++) {
        attrs[el.attributes[i].name] = el.attributes[i].value;
      }

      objects.push({
        index: idx,
        objectType: objType,
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        name: el.name || null,
        role: el.getAttribute('role') || null,
        properties: {
          attributes: attrs,
          text: getVisibleText(el).slice(0, 100),
          disabled: !!el.disabled,
          required: el.required || el.getAttribute('aria-required') === 'true'
        }
      });

      // Default values
      if (el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea') {
        defaultValues.push({
          name: el.name || el.id || `field-${idx}`,
          objectType: objType,
          defaultValue: el.defaultValue,
          currentValue: el.value,
          defaultChecked: el.defaultChecked,
          currentChecked: el.checked
        });
      } else if (el.tagName.toLowerCase() === 'select') {
        const defaultOpt = Array.from(el.options).find(o => o.defaultSelected);
        defaultValues.push({
          name: el.name || el.id || `select-${idx}`,
          objectType: objType,
          defaultSelected: defaultOpt ? defaultOpt.value : (el.options[0] ? el.options[0].value : ''),
          currentValue: el.value
        });

        // List values for select
        listValues.push({
          name: el.name || el.id || `select-${idx}`,
          objectType: objType,
          options: Array.from(el.options).map(o => ({
            value: o.value,
            text: o.text.trim(),
            selected: o.selected
          }))
        });
      } else if (el.tagName.toLowerCase() === 'ul' || el.tagName.toLowerCase() === 'ol') {
        listValues.push({
          name: el.id || `list-${idx}`,
          objectType: objType,
          items: Array.from(el.querySelectorAll('li')).slice(0, 20).map(li => getVisibleText(li))
        });
      }
    });

    // Errors, Warnings, Popups
    const domErrors = [];
    const warnings = [];
    document.querySelectorAll('[role="alert"], .error, .alert-danger, .invalid-feedback, [aria-invalid="true"]').forEach(e => {
      domErrors.push({ text: getVisibleText(e), tag: e.tagName.toLowerCase() });
    });
    document.querySelectorAll('[role="status"], .warning, .alert-warning').forEach(e => {
      warnings.push({ text: getVisibleText(e), tag: e.tagName.toLowerCase() });
    });
    const popups = [];
    document.querySelectorAll('dialog[open], [aria-modal="true"], .modal.show').forEach(e => {
      popups.push({ text: getVisibleText(e).slice(0, 150) });
    });

    // Module & Features
    const pathname = window.location.pathname.toLowerCase();
    let module = 'General';
    if (pathname.includes('auth') || pathname.includes('login')) module = 'Authentication';
    else if (pathname.includes('dash') || pathname.includes('home')) module = 'Dashboard';
    else if (pathname.includes('user') || pathname.includes('account')) module = 'User Management';
    else if (pathname.includes('cart') || pathname.includes('order')) module = 'Orders & Checkout';

    const features = [];
    if (document.querySelector('form')) features.push('Forms');
    if (document.querySelector('nav')) features.push('Navigation');
    if (document.querySelector('table')) features.push('Tables');
    if (document.querySelector('ul, ol')) features.push('Lists');

    return {
      url: window.location.href,
      title: document.title,
      module,
      features,
      objectsCount: objects.length,
      objects,
      defaultValues,
      listValues,
      errorsWarningsAndPopups: { domErrors, warnings, popups }
    };
  });

  return JSON.stringify({ fillSummary, inspection }, null, 2);
}
