import json

with open('app-inventory.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

catalog = []

for i, p in enumerate(data['pages']):
    page_obj = p['page']
    mod_name = page_obj['module']
    url = page_obj['url']
    title = page_obj['title']
    features = page_obj['features']
    
    forms_list = []
    for f_idx, form in enumerate(p.get('forms', [])):
        form_id = form.get('id')
        form_name = form.get('name')
        form_action = form.get('action')
        form_method = form.get('method')
        fields_info = []
        for fld in form.get('fields', []):
            fields_info.append({
                'name': fld.get('name'),
                'type': fld.get('type'),
                'id': fld.get('id'),
                'value': fld.get('value')
            })
        forms_list.append({
            'index': f_idx + 1,
            'id': form_id,
            'name': form_name,
            'action': form_action,
            'method': form_method,
            'fields': fields_info
        })
        
    default_vals = []
    for dv in p.get('defaultValues', []):
        default_vals.append({
            'name': dv.get('name'),
            'objectType': dv.get('objectType'),
            'defaults': dv.get('defaults')
        })
        
    dropdowns = []
    for lv in p.get('listValues', []):
        if lv.get('objectType') == 'dropdown-select':
            dropdowns.append({
                'name': lv.get('name'),
                'options': lv.get('list', {}).get('options', [])
            })
            
    lists = []
    for lv in p.get('listValues', []):
        if lv.get('objectType') != 'dropdown-select':
            lists.append({
                'name': lv.get('name'),
                'items': lv.get('list', {}).get('items', [])
            })
            
    dom_errors = p.get('errorsWarningsAndPopups', {}).get('domErrors', [])
    
    # Extract tables, headings, and buttons from objects
    tables = []
    headings = []
    buttons = []
    inputs = []
    for obj in p.get('objects', []):
        ot = obj.get('objectType')
        tag = obj.get('tag')
        props = obj.get('properties', {})
        attrs = props.get('attributes', {})
        text = (props.get('text') or '').strip()
        oid = obj.get('id') or attrs.get('id')
        oname = obj.get('name') or attrs.get('name')
        
        if tag in ['h1', 'h2', 'h3'] or ot.startswith('heading'):
            headings.append({'tag': tag, 'text': text})
        elif tag == 'table' or ot == 'table':
            tables.append({'class': attrs.get('class'), 'id': oid, 'text': text[:100]})
        elif ot in ['button', 'submit-input'] or attrs.get('type') in ['submit', 'button']:
            buttons.append({'value': attrs.get('value'), 'text': text, 'class': attrs.get('class'), 'id': oid})
        elif 'input' in ot or tag in ['input', 'select', 'textarea']:
            inputs.append({'tag': tag, 'type': attrs.get('type'), 'name': oname, 'id': oid, 'class': attrs.get('class')})
            
    catalog.append({
        'moduleNumber': i + 1,
        'module': mod_name,
        'url': url,
        'title': title,
        'features': features,
        'forms': forms_list,
        'defaultValues': default_vals,
        'dropdowns': dropdowns,
        'lists': lists,
        'domErrors': dom_errors,
        'headings': headings,
        'tables': tables,
        'buttons': buttons,
        'inputs': inputs
    })

with open('catalog_extracted.json', 'w', encoding='utf-8') as f:
    json.dump(catalog, f, indent=2)

print(f"Extracted {len(catalog)} modules successfully.")
