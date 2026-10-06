/**
 * Playwright DOM Extractor & Form Handler
 * 
 * Extracts:
 * 1. All objects with object type (tags, roles, component types)
 * 2. All object properties and their values (attributes, styles, states)
 * 3. All default values (defaultValue, defaultChecked, defaultSelected)
 * 4. All list values (<select> options, <datalist>, menus, listbox items, lists)
 * 5. All errors, warnings, popups, and validation messages
 * 6. Ensures all form field values are filled before step transition
 * 7. Maps page structure, modules, and features
 */

(function () {
  function getVisibleText(el) {
    if (!el) return '';
    return (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ');
  }

  function isElementVisible(el) {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
      return false;
    }
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function getElementAttributes(el) {
    const attrs = {};
    if (!el.attributes) return attrs;
    for (let i = 0; i < el.attributes.length; i++) {
      const attr = el.attributes[i];
      attrs[attr.name] = attr.value;
    }
    return attrs;
  }

  function determineObjectType(el) {
    const tag = el.tagName.toLowerCase();
    const role = el.getAttribute('role');
    const type = el.getAttribute('type');

    if (tag === 'input') {
      return `${type || 'text'}-input`;
    }
    if (tag === 'textarea') return 'textarea-input';
    if (tag === 'select') return 'dropdown-select';
    if (tag === 'button' || (role === 'button')) {
      return type === 'submit' ? 'submit-button' : (type === 'reset' ? 'reset-button' : 'button');
    }
    if (tag === 'a') return 'link';
    if (tag === 'form') return 'form';
    if (tag === 'dialog' || role === 'dialog' || role === 'alertdialog') return 'dialog-modal';
    if (tag === 'table') return 'table';
    if (tag === 'ul' || tag === 'ol') return 'list';
    if (tag === 'li') return 'list-item';
    if (tag === 'nav' || role === 'navigation') return 'navigation-bar';
    if (tag === 'header' || role === 'banner') return 'header-module';
    if (tag === 'footer' || role === 'contentinfo') return 'footer-module';
    if (tag === 'aside' || role === 'complementary') return 'sidebar';
    if (tag === 'main' || role === 'main') return 'main-content';
    if (tag.match(/^h[1-6]$/)) return `heading-${tag}`;
    if (role) return `aria-${role}`;

    return tag;
  }

  function extractDefaultValue(el) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'input') {
      const type = (el.getAttribute('type') || 'text').toLowerCase();
      if (type === 'checkbox' || type === 'radio') {
        return {
          defaultChecked: el.defaultChecked,
          currentChecked: el.checked
        };
      }
      return {
        defaultValue: el.defaultValue,
        currentValue: el.value
      };
    }
    if (tag === 'textarea') {
      return {
        defaultValue: el.defaultValue,
        currentValue: el.value
      };
    }
    if (tag === 'select') {
      const defaultOption = Array.from(el.options).find(o => o.defaultSelected);
      return {
        defaultSelected: defaultOption ? defaultOption.value : (el.options[0] ? el.options[0].value : ''),
        currentValue: el.value
      };
    }
    return null;
  }

  function extractListValues(el) {
    const tag = el.tagName.toLowerCase();
    const role = el.getAttribute('role');

    // <select> elements
    if (tag === 'select') {
      return {
        type: 'select-options',
        options: Array.from(el.options).map(opt => ({
          value: opt.value,
          text: opt.text.trim(),
          selected: opt.selected,
          defaultSelected: opt.defaultSelected,
          disabled: opt.disabled
        }))
      };
    }

    // <datalist> elements
    if (tag === 'datalist') {
      return {
        type: 'datalist-options',
        options: Array.from(el.querySelectorAll('option')).map(opt => ({
          value: opt.value,
          label: opt.label || opt.text
        }))
      };
    }

    // ARIA listbox or menu
    if (role === 'listbox' || role === 'menu' || role === 'radiogroup') {
      const items = el.querySelectorAll('[role="option"], [role="menuitem"], [role="radio"]');
      return {
        type: `aria-${role}-items`,
        items: Array.from(items).map(item => ({
          text: getVisibleText(item),
          value: item.getAttribute('data-value') || item.getAttribute('value') || getVisibleText(item),
          selected: item.getAttribute('aria-selected') === 'true' || item.getAttribute('aria-checked') === 'true'
        }))
      };
    }

    // Regular <ul>, <ol> items
    if (tag === 'ul' || tag === 'ol') {
      const items = Array.from(el.children).filter(c => c.tagName.toLowerCase() === 'li');
      return {
        type: `${tag}-items`,
        count: items.length,
        items: items.slice(0, 50).map(li => getVisibleText(li))
      };
    }

    return null;
  }

  function extractErrorsAndPopups() {
    const errorsAndPopups = {
      domErrors: [],
      warnings: [],
      popups: [],
      inputValidationErrors: []
    };

    // 1. On-page errors and alerts
    const alertSelectors = [
      '[role="alert"]',
      '[role="alertdialog"]',
      '.error',
      '.errors',
      '.alert',
      '.alert-danger',
      '.alert-warning',
      '.invalid-feedback',
      '.text-danger',
      '.warning',
      '[aria-invalid="true"]'
    ];

    const foundAlerts = document.querySelectorAll(alertSelectors.join(','));
    foundAlerts.forEach(el => {
      const text = getVisibleText(el);
      if (!text && !isElementVisible(el)) return;

      const className = el.className || '';
      const isWarning = className.includes('warning') || (el.getAttribute('role') === 'status');
      const item = {
        selector: el.id ? `#${el.id}` : el.tagName.toLowerCase(),
        text: text,
        role: el.getAttribute('role'),
        visible: isElementVisible(el)
      };

      if (isWarning) {
        errorsAndPopups.warnings.push(item);
      } else {
        errorsAndPopups.domErrors.push(item);
      }
    });

    // 2. Active popups and modals
    const popupSelectors = [
      'dialog[open]',
      '[aria-modal="true"]',
      '.modal.show',
      '.modal.open',
      '.popup',
      '.toast',
      '.tooltip',
      '.swal2-container',
      '.modal-content'
    ];
    const foundPopups = document.querySelectorAll(popupSelectors.join(','));
    foundPopups.forEach(el => {
      if (isElementVisible(el)) {
        errorsAndPopups.popups.push({
          type: el.tagName.toLowerCase() === 'dialog' ? 'native-dialog' : 'modal-popup',
          title: getVisibleText(el.querySelector('h1, h2, h3, .modal-title, .title') || el),
          text: getVisibleText(el).slice(0, 300),
          visible: true
        });
      }
    });

    // 3. Form input validation messages (HTML5)
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (input.validationMessage && !input.validity.valid) {
        errorsAndPopups.inputValidationErrors.push({
          name: input.name || input.id,
          type: input.type || input.tagName.toLowerCase(),
          message: input.validationMessage,
          value: input.value
        });
      }
    });

    return errorsAndPopups;
  }

  function getGeneratedSampleValue(input) {
    const type = (input.getAttribute('type') || 'text').toLowerCase();
    const name = (input.name || input.id || input.placeholder || '').toLowerCase();

    if (type === 'email' || name.includes('email')) {
      return 'test.user@example.com';
    }
    if (type === 'password' || name.includes('password')) {
      return 'P@ssw0rd123!';
    }
    if (type === 'tel' || name.includes('phone') || name.includes('tel')) {
      return '+15551234567';
    }
    if (type === 'number') {
      const min = parseFloat(input.min) || 1;
      return String(min);
    }
    if (type === 'date') {
      return new Date().toISOString().split('T')[0];
    }
    if (type === 'time') {
      return '12:00';
    }
    if (type === 'url' || name.includes('url') || name.includes('website')) {
      return 'https://example.com';
    }
    if (name.includes('ssn')) return '123-45-6789';
    if (name.includes('username') || name.includes('user')) return 'john';
    if (name.includes('amount')) return '100.00';
    if (name.includes('account')) return '13344';
    if (name.includes('first')) return 'Jane';
    if (name.includes('last')) return 'Doe';
    if (name.includes('name')) return 'Jane Doe';
    if (name.includes('city')) return 'Springfield';
    if (name.includes('state')) return 'CA';
    if (name.includes('zip') || name.includes('postal')) return '90210';
    if (name.includes('address') || name.includes('street')) return '123 Main Street';
    if (name.includes('message') || name.includes('comment') || name.includes('note')) return 'Automated test inquiry note regarding banking services.';
    if (name.includes('subject') || name.includes('title')) return 'Automated Test Title';
    if (name.includes('search') || type === 'search') return 'Test Query';

    return 'Sample Valid Input';
  }

  function fillAllFormFields(formOrContainer) {
    const scope = formOrContainer || document;
    const filledFields = [];
    const fields = scope.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]), select, textarea');

    fields.forEach(field => {
      if (field.disabled || field.readOnly) return;
      const tag = field.tagName.toLowerCase();
      const type = (field.getAttribute('type') || 'text').toLowerCase();

      let wasFilled = false;
      let prevVal = '';
      let newVal = '';

      if (tag === 'select') {
        prevVal = field.value;
        if (!field.value || field.value === '') {
          // Select first available non-empty option
          const validOption = Array.from(field.options).find(opt => opt.value && !opt.disabled);
          if (validOption) {
            field.value = validOption.value;
            field.dispatchEvent(new Event('change', { bubbles: true }));
            field.dispatchEvent(new Event('input', { bubbles: true }));
            wasFilled = true;
            newVal = field.value;
          }
        }
      } else if (type === 'checkbox') {
        prevVal = field.checked;
        if (!field.checked) {
          field.checked = true;
          field.dispatchEvent(new Event('change', { bubbles: true }));
          field.dispatchEvent(new Event('click', { bubbles: true }));
          wasFilled = true;
          newVal = true;
        }
      } else if (type === 'radio') {
        prevVal = field.checked;
        if (!field.checked) {
          const radioGroup = scope.querySelectorAll(`input[type="radio"][name="${field.name}"]`);
          const anyChecked = Array.from(radioGroup).some(r => r.checked);
          if (!anyChecked) {
            field.checked = true;
            field.dispatchEvent(new Event('change', { bubbles: true }));
            field.dispatchEvent(new Event('click', { bubbles: true }));
            wasFilled = true;
            newVal = true;
          }
        }
      } else if (tag === 'textarea') {
        prevVal = field.value;
        if (!field.value || field.value.trim() === '') {
          field.value = 'Automated multi-line sample input for testing forms.';
          field.dispatchEvent(new Event('input', { bubbles: true }));
          field.dispatchEvent(new Event('change', { bubbles: true }));
          wasFilled = true;
          newVal = field.value;
        }
      } else {
        // Standard text, number, email, date, etc.
        prevVal = field.value;
        if (!field.value || field.value.trim() === '') {
          const sample = getGeneratedSampleValue(field);
          field.value = sample;
          field.dispatchEvent(new Event('input', { bubbles: true }));
          field.dispatchEvent(new Event('change', { bubbles: true }));
          wasFilled = true;
          newVal = sample;
        }
      }

      filledFields.push({
        identifier: field.name || field.id || field.getAttribute('placeholder') || 'unnamed',
        type: type,
        tag: tag,
        required: field.required || field.getAttribute('aria-required') === 'true',
        wasEmpty: wasFilled,
        previousValue: prevVal,
        currentValue: newVal || field.value,
        isValid: field.checkValidity ? field.checkValidity() : true
      });
    });

    return filledFields;
  }

  function inferModuleAndFeatures() {
    const url = window.location.href;
    const pathname = window.location.pathname.toLowerCase();
    const title = document.title || '';

    let module = 'General';
    if (pathname.includes('openaccount')) {
      module = 'Open New Account';
    } else if (pathname.includes('overview')) {
      module = 'Accounts Overview';
    } else if (pathname.includes('transfer')) {
      module = 'Transfer Funds';
    } else if (pathname.includes('billpay')) {
      module = 'Bill Payment';
    } else if (pathname.includes('findtrans')) {
      module = 'Find Transactions';
    } else if (pathname.includes('updateprofile')) {
      module = 'Update Profile';
    } else if (pathname.includes('requestloan')) {
      module = 'Request Loan';
    } else if (pathname.includes('register')) {
      module = 'Registration';
    } else if (pathname.includes('lookup')) {
      module = 'Customer Lookup & Recovery';
    } else if (pathname.includes('contact')) {
      module = 'Customer Support';
    } else if (pathname.includes('about')) {
      module = 'About Information';
    } else if (pathname.includes('services')) {
      module = 'Web Services API';
    } else if (pathname.includes('admin')) {
      module = 'System Administration';
    } else if (pathname.includes('sitemap')) {
      module = 'Site Map';
    } else if (pathname.includes('activity')) {
      module = 'Account Activity';
    } else if (pathname.includes('index') || pathname.includes('login') || pathname.includes('auth')) {
      module = 'Authentication & Welcome';
    } else if (pathname.includes('dashboard') || pathname.includes('home')) {
      module = 'Dashboard';
    } else if (pathname.includes('profile') || pathname.includes('account') || pathname.includes('user')) {
      module = 'User Management';
    }

    const features = [];
    if (document.querySelector('form')) features.push('Interactive Form Submission');
    if (document.querySelector('input[type="password"]')) features.push('Secure Password Credential Input');
    if (document.querySelector('select')) features.push('Dropdown Selection Control');
    if (document.querySelector('nav, [role="navigation"], #headerPanel, ul.leftmenu, ul.button')) features.push('Site Navigation Panel');
    if (document.querySelector('table, [role="grid"]')) features.push('Data Table / Grid');
    if (document.querySelector('input[type="search"], input[name*="search"]')) features.push('Keyword Search');
    if (document.querySelector('dialog, [role="dialog"], [aria-modal="true"]')) features.push('Modal Dialog Popup');
    if (document.querySelector('ul, ol, [role="list"]')) features.push('Content List Display');
    if (document.querySelector('input[type="file"]')) features.push('File Upload Capability');
    if (document.querySelector('.error, .errors, [role="alert"]')) features.push('Error / Alert Notification');

    return {
      module: module,
      detectedFeatures: features,
      pageTitle: title,
      pageUrl: url
    };
  }

  // Master Extraction Routine
  function capturePageData(options = { autoFillForms: false }) {
    let formFillResults = [];
    if (options.autoFillForms) {
      formFillResults = fillAllFormFields();
    }

    const { module, detectedFeatures, pageTitle, pageUrl } = inferModuleAndFeatures();

    // Query all interactive & structural elements
    const selector = [
      'input', 'button', 'select', 'textarea', 'a[href]', 'form',
      'table', 'dialog', '[role]', '[data-testid]', 'h1, h2, h3',
      'ul', 'ol', 'nav', 'header', 'footer'
    ].join(',');

    const elements = Array.from(document.querySelectorAll(selector));
    const capturedObjects = [];
    const listValues = [];
    const defaultValues = [];

    elements.forEach((el, index) => {
      const objType = determineObjectType(el);
      const attrs = getElementAttributes(el);
      const text = getVisibleText(el);
      const isVisible = isElementVisible(el);

      const objectData = {
        index: index,
        objectType: objType,
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        name: el.name || null,
        role: el.getAttribute('role') || null,
        visible: isVisible,
        properties: {
          attributes: attrs,
          text: text ? text.slice(0, 150) : null,
          disabled: !!el.disabled,
          required: el.required || el.getAttribute('aria-required') === 'true'
        }
      };

      capturedObjects.push(objectData);

      // Collect default value if present
      const defVal = extractDefaultValue(el);
      if (defVal) {
        defaultValues.push({
          targetIndex: index,
          name: el.name || el.id || `${objType}-${index}`,
          objectType: objType,
          defaults: defVal
        });
      }

      // Collect list values if present
      const listVal = extractListValues(el);
      if (listVal) {
        listValues.push({
          targetIndex: index,
          name: el.name || el.id || `${objType}-${index}`,
          objectType: objType,
          list: listVal
        });
      }
    });

    const errorsAndPopups = extractErrorsAndPopups();

    // Grouping into forms
    const forms = Array.from(document.querySelectorAll('form')).map((f, fIdx) => {
      const fInputs = Array.from(f.querySelectorAll('input, select, textarea'));
      return {
        formIndex: fIdx,
        id: f.id || null,
        action: f.action || null,
        method: f.method || 'GET',
        fieldsCount: fInputs.length,
        allFieldsFilled: fInputs.every(input => {
          if (input.type === 'checkbox' || input.type === 'radio') return true;
          return input.value && input.value.trim().length > 0;
        }),
        fields: fInputs.map(input => ({
          name: input.name || input.id,
          type: input.type || input.tagName.toLowerCase(),
          required: input.required,
          currentValue: input.value
        }))
      };
    });

    return {
      timestamp: new Date().toISOString(),
      page: {
        url: pageUrl,
        title: pageTitle,
        module: module,
        features: detectedFeatures
      },
      forms: forms,
      formFillResults: formFillResults,
      objectsCount: capturedObjects.length,
      objects: capturedObjects,
      defaultValues: defaultValues,
      listValues: listValues,
      errorsWarningsAndPopups: errorsAndPopups
    };
  }

  // Expose to window for playwright-cli eval / run-code
  window.__playwrightExtractor = {
    capture: capturePageData,
    fillAllForms: fillAllFormFields,
    extractErrors: extractErrorsAndPopups,
    inferModule: inferModuleAndFeatures
  };

  return capturePageData({ autoFillForms: false });
})();
