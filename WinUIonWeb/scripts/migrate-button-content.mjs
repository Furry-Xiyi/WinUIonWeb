import fs from 'node:fs';
import path from 'node:path';
import { compileScript, parse } from '@vue/compiler-sfc';
import { baseParse, parserOptions } from '@vue/compiler-dom';
import { parseExpression } from '@babel/parser';

const targets = new Set(['Button', 'HyperlinkButton', 'RepeatButton', 'ToggleButton', 'SplitButton', 'ToggleSplitButton']);
const excluded = new Set([...targets].map((name) => `${name}.vue`).concat([...targets].map((name) => `${name}Page.vue`)));
const filesIn = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const file = path.join(directory, entry.name);
  return entry.isDirectory() ? filesIn(file) : file.endsWith('.vue') && !excluded.has(entry.name) ? [file] : [];
});
for (const file of filesIn('src')) {
  let source = fs.readFileSync(file, 'utf8');
  const { descriptor } = parse(source, { filename: file });
  if (!descriptor.template || !descriptor.scriptSetup) continue;
  if (!/<(?:Button|HyperlinkButton|RepeatButton|ToggleButton|SplitButton|ToggleSplitButton)(?=[\s/>])/.test(descriptor.template.content)) continue;
  const bindings = compileScript(descriptor, { id: file }).bindings;
  const changes = [];
  const declarations = [];
  let icons = false;
  let text = false;
  const expressionFor = (input) => {
    input = input.replaceAll('$t(', 't(');
    input = input.replace(/(['"])&#x([a-f\d]+);\1/gi, (_, quote, code) => JSON.stringify(String.fromCodePoint(parseInt(code, 16))));
    const edits = [];
    const visit = (node, parent, key) => {
      if (!node || typeof node !== 'object') return;
      if (node.type === 'Identifier') {
        const memberProperty = ['MemberExpression', 'OptionalMemberExpression'].includes(parent?.type) && key === 'property' && !parent.computed;
        const callTarget = ['CallExpression', 'OptionalCallExpression'].includes(parent?.type) && key === 'callee';
        if (!memberProperty && !callTarget && ['setup-ref', 'setup-maybe-ref'].includes(bindings[node.name])) edits.push({ start: node.start, end: node.end, value: `ButtonContentUnref(${node.name})` });
        else if (!memberProperty && bindings[node.name] === 'props') edits.push({ start: node.start, end: node.end, value: `props.${node.name}` });
      }
      for (const [childKey, child] of Object.entries(node)) {
        if (['loc', 'extra'].includes(childKey)) continue;
        if (Array.isArray(child)) child.forEach((entry) => visit(entry, node, childKey));
        else if (child && typeof child === 'object') visit(child, node, childKey);
      }
    };
    visit(parseExpression(input));
    for (const change of edits.sort((a, b) => b.start - a.start)) input = input.slice(0, change.start) + change.value + input.slice(change.end);
    return input;
  };
  const bind = (expression) => {
    if (/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/.test(expression)) return `{x:Bind ${expression}, Mode=OneWay}`;
    const name = `ButtonContent${declarations.length + 1}`;
    declarations.push(`const ${name} = ButtonContentComputed(() => ${expressionFor(expression)});`);
    return `{x:Bind ${name}, Mode=OneWay}`;
  };
  function visit(node, target = false) {
    if (node.type === 1 && targets.has(node.tag)) target = true;
    if (target && node.type === 1 && targets.has(node.tag) && node.children?.length === 1 && node.children[0].type === 5) {
      const binding = bind(node.children[0].content.content);
      changes.push({ start: descriptor.template.loc.start.offset + node.loc.start.offset, end: descriptor.template.loc.start.offset + node.loc.end.offset, value: `<${node.tag} ${node.props.map((prop) => prop.loc.source).join(' ')} Content="${binding}" />` });
      return;
    }
    if (target && node.type === 1 && node.tag === 'span' && node.children?.length === 1 && (node.children[0].type === 5 || node.children[0].type === 2)) {
      const icon = node.props.some((prop) => prop.type === 6 && prop.name === 'class' && prop.value?.content.split(/\s+/).includes('icon'));
      if (node.children[0].type === 2 && !icon) return;
      const interpolation = node.children[0].content.content;
      const attributes = node.props.map((prop) => prop.loc.source).join(' ');
      const binding = node.children[0].type === 5 ? bind(interpolation) : `&#x${node.children[0].content.codePointAt(0).toString(16)};`;
      icons ||= icon;
      text ||= !icon;
      changes.push({ start: descriptor.template.loc.start.offset + node.loc.start.offset, end: descriptor.template.loc.start.offset + node.loc.end.offset, value: `<${icon ? 'FontIcon' : 'TextBlock'} ${attributes} ${icon ? 'Glyph' : 'Text'}="${binding}" />` });
      return;
    }
    if (target && node.type === 1 && ['TextBlock', 'FontIcon', 'Image'].includes(node.tag)) {
      for (const prop of node.props) {
        if (prop.type === 7 && prop.name === 'bind' && prop.arg?.isStatic && prop.exp?.content && !['class', 'style', 'key'].includes(prop.arg.content)) {
          changes.push({ start: descriptor.template.loc.start.offset + prop.loc.start.offset, end: descriptor.template.loc.start.offset + prop.loc.end.offset, value: `${prop.arg.content}="${bind(prop.exp.content)}"` });
        }
      }
    }
    for (const child of node.children ?? []) visit(child, target);
  }
  const componentDirectory = path.relative(path.dirname(file), 'src/components').replaceAll('\\', '/');
  visit(baseParse(descriptor.template.content, parserOptions));
  if (!changes.length) continue;
  for (const change of changes.sort((a, b) => b.start - a.start)) source = source.slice(0, change.start) + change.value + source.slice(change.end);
  const imports = [];
  if (icons && !('FontIcon' in bindings)) imports.push(`import FontIcon from '${componentDirectory.startsWith('.') ? componentDirectory || '.' : `./${componentDirectory}`}/FontIcon.vue';`);
  if (text && !('TextBlock' in bindings)) imports.push(`import TextBlock from '${componentDirectory.startsWith('.') ? componentDirectory || '.' : `./${componentDirectory}`}/TextBlock.vue';`);
  if (declarations.length) imports.push("import { computed as ButtonContentComputed, unref as ButtonContentUnref } from 'vue';");
  if (declarations.some((line) => /\bt\(/.test(line)) && !('t' in bindings)) {
    if (!('useI18n' in bindings)) imports.push(`import { useI18n } from '${componentDirectory.startsWith('.') ? componentDirectory || '.' : `./${componentDirectory}`}/i18n/index';`);
    declarations.unshift('const { t } = useI18n();');
  }
  const scriptStart = source.indexOf('>', source.indexOf('<script setup')) + 1;
  source = source.slice(0, scriptStart) + '\n' + imports.join('\n') + source.slice(scriptStart);
  source = source.replace('</script>', declarations.join('\n') + '\n</script>');
  for (let attempt = 0; ; attempt += 1) {
    try { fs.writeFileSync(file, source); break; }
    catch (error) { if (attempt >= 4) throw error; Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100); }
  }
  console.log(`${file}: migrated ${changes.length} button content nodes`);
}
