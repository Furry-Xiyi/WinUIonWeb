import fs from 'node:fs';
import path from 'node:path';
import { compileScript, parse } from '@vue/compiler-sfc';
import { baseParse, parserOptions } from '@vue/compiler-dom';
import { parseExpression } from '@babel/parser';

const names = new Set(['Button', 'HyperlinkButton', 'RepeatButton', 'ToggleButton', 'SplitButton', 'ToggleSplitButton']);
const excluded = new Set([...names].map((name) => `${name}.vue`).concat([...names].map((name) => `${name}Page.vue`)));
const propertyNames = { navigateUri: 'NavigateUri', content: 'Content', theme: 'Theme', isEnabled: 'IsEnabled', isChecked: 'IsChecked', click: 'Click' };
function filesIn(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? filesIn(file) : file.endsWith('.vue') && !excluded.has(entry.name) ? [file] : [];
  });
}
for (const file of filesIn('src')) {
  let source = fs.readFileSync(file, 'utf8');
  const descriptor = parse(source).descriptor;
  if (!descriptor.template) continue;
  const replacements = [];
  const declarations = [];
  let metadata = {};
  try { if (descriptor.scriptSetup) metadata = compileScript(descriptor, { id: file }).bindings; } catch (error) { console.log(`Skip script error ${file}: ${error.message}`); continue; }
  let bindingIndex = 0;
  function setupExpression(expression) {
    expression = expression.replaceAll('$t(', 't(');
    const edits = [];
    const root = parseExpression(expression);
    function walk(node, parent, key) {
      if (!node || typeof node !== 'object') return;
      if (node.type === 'Identifier' && ['setup-ref', 'setup-maybe-ref'].includes(metadata[node.name])) {
        const callTarget = parent?.type === 'CallExpression' && key === 'callee';
        const property = (parent?.type === 'MemberExpression' || parent?.type === 'OptionalMemberExpression') && key === 'property' && !parent.computed;
        const objectKey = (parent?.type === 'ObjectProperty' || parent?.type === 'ObjectMethod') && key === 'key' && !parent.computed;
        const explicitValue = (parent?.type === 'MemberExpression' || parent?.type === 'OptionalMemberExpression') && key === 'object' && parent.property?.name === 'value';
        if (!property && !objectKey && !explicitValue && !callTarget) {
          const assignment = parent?.type === 'AssignmentExpression' && key === 'left' || parent?.type === 'UpdateExpression';
          edits.push({ start: node.start, end: node.end, value: assignment ? `${node.name}.value` : `ButtonUnref(${node.name})` });
        }
      }
      for (const [childKey, child] of Object.entries(node)) {
        if (childKey === 'loc' || childKey === 'extra') continue;
        if (Array.isArray(child)) child.forEach((value) => walk(value, node, childKey));
        else if (child && typeof child === 'object') walk(child, node, childKey);
      }
    }
    walk(root);
    for (const edit of edits.sort((a, b) => b.start - a.start)) expression = expression.slice(0, edit.start) + edit.value + expression.slice(edit.end);
    return expression;
  }
  function binding(expression) {
    expression = expression.replaceAll('$t(', 't(');
    if (/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/.test(expression)) return `{x:Bind ${expression}, Mode=OneWay}`;
    const name = `ButtonBinding${++bindingIndex}`;
    declarations.push(`const ${name} = ButtonComputed(() => (${setupExpression(expression)}));`);
    return `{x:Bind ${name}, Mode=OneWay}`;
  }
  function visit(node) {
    if (node.type === 1 && names.has(node.tag)) {
      for (const prop of node.props) {
        let value;
        if (prop.type === 7 && prop.name === 'on' && prop.arg?.type === 4 && ['click', 'Click'].includes(prop.arg.content)) {
          if (/^[A-Za-z_$][\w$.]*$/.test(prop.exp?.content ?? '')) value = `Click="${prop.exp.content}"`;
          else if (prop.exp?.content) {
            const name = `ButtonClick${++bindingIndex}`;
            declarations.push(`const ${name} = (_sender, _args) => { ${setupExpression(prop.exp.content.replaceAll('$event', '_args'))} };`);
            value = `Click="${name}"`;
          }
        } else if (prop.type === 7 && prop.name === 'on' && prop.arg?.content === 'update:IsChecked') {
          if (prop.exp?.content === 'toggleFavorite') value = `Click="${prop.exp.content}"`;
          else if (prop.exp?.content) {
            const name = `ButtonChecked${++bindingIndex}`;
            declarations.push(`const ${name} = (sender) => ${prop.exp.content}(Boolean(sender.IsChecked));`);
            value = `Click="${name}"`;
          }
        } else if (prop.type === 7 && prop.name === 'bind' && !prop.arg && prop.exp?.content) {
          try {
            const object = parseExpression(prop.exp.content);
            if (object.type === 'ObjectExpression') {
              value = object.properties.map((property) => {
                const key = property.key.value ?? property.key.name;
                const name = { 'automationproperties.name': 'AutomationProperties.Name', 'tooltipservice.tooltip': 'ToolTipService.ToolTip' }[key] ?? key;
                return `${name}="${binding(prop.exp.content.slice(property.value.start, property.value.end))}"`;
              }).join(' ');
            }
          } catch { }
        } else if (prop.type === 7 && prop.name === 'bind' && prop.arg?.isStatic && prop.arg.content !== 'key' && prop.arg.content !== 'class' && prop.arg.content !== 'style') {
          let property = propertyNames[prop.arg.content] ?? prop.arg.content;
          let expression = prop.exp?.content;
          if (expression && property !== 'Flyout' && property !== 'Items') {
            if (property === 'disabled') { property = 'IsEnabled'; expression = expression.startsWith('!') ? expression.slice(1) : `!(${expression})`; }
            const literal = /^(true|false|\d+(\.\d+)?)$/.test(expression);
            value = `${property}="${literal ? expression === 'true' ? 'True' : expression === 'false' ? 'False' : expression : binding(expression)}"`;
          }
        } else if (prop.type === 6 && prop.name in propertyNames) {
          value = `${propertyNames[prop.name]}${prop.value ? `="${prop.value.content}"` : ''}`;
        } else if (prop.type === 6 && prop.name === 'primary') {
          value = 'Style="{StaticResource AccentButtonStyle}"';
        }
        if (value) replacements.push({ start: descriptor.template.loc.start.offset + prop.loc.start.offset, end: descriptor.template.loc.start.offset + prop.loc.end.offset, value });
      }
    }
    for (const child of node.children ?? []) visit(child);
  }
  try { visit(baseParse(descriptor.template.content, parserOptions)); } catch (error) { console.log(`Skip parse error ${file}: ${error.message}`); continue; }
  if (!replacements.length) continue;
  for (const change of replacements.sort((a, b) => b.start - a.start)) source = source.slice(0, change.start) + change.value + source.slice(change.end);
  if (declarations.length) {
    const typed = Boolean(descriptor.scriptSetup?.lang === 'ts');
    const typedDeclarations = declarations.map((line) => typed ? line.replace('(_sender, _args)', '(_sender: unknown, _args: unknown)').replace('(sender)', '(sender: { IsChecked?: boolean | null })') : line);
    source = source.replace('</script>', `${typedDeclarations.join('\n')}\n</script>`);
    const scriptStart = source.indexOf('>', source.indexOf('<script')) + 1;
    source = source.slice(0, scriptStart) + "\nimport { computed as ButtonComputed, unref as ButtonUnref } from 'vue';" + source.slice(scriptStart);
  }
  fs.writeFileSync(file, source);
  console.log(`${file}: migrated ${replacements.length} attributes`);
}
