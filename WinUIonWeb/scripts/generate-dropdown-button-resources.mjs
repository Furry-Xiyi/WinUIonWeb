import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { baseParse, NodeTypes } from '@vue/compiler-dom'

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const filename = path.join(path.dirname(project), 'WinUI-Reference', 'controls', 'dev', 'DropDownButton', 'DropDownButton_themeresources.xaml')
const parsed = baseParse(fs.readFileSync(filename, 'utf8'))
const attribute = (node, name) => node.props.find(prop => prop.type === NodeTypes.ATTRIBUTE && prop.name === name)?.value?.content
const root = parsed.children.find(node => node.type === NodeTypes.ELEMENT)
const dictionaries = root.children.find(node => node.type === NodeTypes.ELEMENT && node.tag === 'ResourceDictionary.ThemeDictionaries')
const aliases = Object.fromEntries(dictionaries.children.filter(node => node.type === NodeTypes.ELEMENT).map(node => [attribute(node, 'x:Key'), Object.fromEntries(node.children.filter(child => child.type === NodeTypes.ELEMENT && child.tag === 'StaticResource').map(child => [attribute(child, 'x:Key'), attribute(child, 'ResourceKey')]))]))
const resources = Object.fromEntries([...new Set(Object.values(aliases).flatMap(Object.keys))].map(key => [key, `var(--${key})`]))
resources.DefaultDropDownButtonStyle = 'DefaultDropDownButtonStyle'
fs.writeFileSync(path.join(project, 'src', 'components', 'dropDownButtonResources.ts'), `// Generated from the official DropDownButton theme dictionary.\nexport const dropDownButtonThemeResourceAliases = ${JSON.stringify(aliases, null, 2)} as const\nexport const dropDownButtonResources: Record<string, unknown> = ${JSON.stringify(resources, null, 2)}\n`)
const fallback = { SystemColorButtonTextColorBrush: 'ButtonText', SystemColorHighlightColorBrush: 'Highlight' }
const block = theme => Object.entries(aliases[theme]).map(([key, value]) => `  --${key}: var(--${value}${fallback[value] ? `, ${fallback[value]}` : ''});`).join('\n')
fs.writeFileSync(path.join(project, 'src', 'styles', 'dropDownButtonResources.css'), `/* Generated from WinUI-Reference DropDownButton_themeresources.xaml. */\n:root, html.theme-light, .theme-light, .example-theme-wrapper.theme-light, .win-theme-scope.theme-light {\n${block('Light')}\n}\nhtml.theme-dark, .theme-dark, .example-theme-wrapper.theme-dark, .win-theme-scope.theme-dark {\n${block('Default')}\n}\n.theme-highcontrast, .theme-high-contrast {\n${block('HighContrast')}\n}\n@media (forced-colors: active) {\n  :root, .theme-light, .theme-dark, .win-theme-scope {\n${block('HighContrast').split('\n').map(line => `  ${line}`).join('\n')}\n  }\n  .win-dropdown-button { forced-color-adjust: none; }\n}\n`)
console.log('Generated DropDownButton resources from official XAML')
