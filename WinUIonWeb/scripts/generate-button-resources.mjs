import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { baseParse, NodeTypes } from '@vue/compiler-dom'

const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const workspace = path.dirname(project)
const adapt = node => ({
  localName: node.tag.split(':').pop(),
  children: node.children.filter(child => child.type === NodeTypes.ELEMENT).map(adapt),
  textContent: node.children.filter(child => child.type === NodeTypes.TEXT).map(child => child.content).join(''),
  getAttribute: name => node.props.find(property => property.type === NodeTypes.ATTRIBUTE && property.name === name)?.value?.content ?? null,
  getAttributeNS: (_namespace, name) => node.props.find(property => property.type === NodeTypes.ATTRIBUTE && property.name === `x:${name}`)?.value?.content ?? null
})
const aliases = { Default: {}, Light: {}, HighContrast: {} }
const values = { Default: {}, Light: {}, HighContrast: {} }
const constants = {}
const kinds = {}
const styles = {}
const xKey = node => node.getAttributeNS('http://schemas.microsoft.com/winfx/2006/xaml', 'Key')
function read(node, target, theme) {
  const key = xKey(node)
  if (!key) return
  kinds[key] = node.localName
  if (node.localName === 'StaticResource') {
    target[key] = node.getAttribute('ResourceKey')
    if (theme) aliases[theme][key] = target[key]
  } else if (node.localName === 'SolidColorBrush') {
    target[key] = node.getAttribute('Color')
    if (theme) values[theme][key] = target[key]
  } else if (node.localName === 'Style') styles[key] = key
  else if (['Thickness', 'Double', 'Int32', 'Boolean', 'BackgroundSizing'].includes(node.localName)) {
    const text = node.textContent.trim()
    const value = text && Number.isFinite(Number(text)) ? Number(text) : text === 'True' ? true : text === 'False' ? false : text
    constants[key] = value
    target[key] = value
  }
}
for (const name of ['Button', 'HyperlinkButton', 'RepeatButton', 'ToggleButton', 'SplitButton']) {
  const directory = name === 'SplitButton' ? 'SplitButton' : 'CommonStyles'
  const filename = path.join(workspace, 'WinUI-Reference', 'controls', 'dev', directory, `${name}_themeresources.xaml`)
  const parsed = baseParse(fs.readFileSync(filename, 'utf8'))
  const dictionaryRoot = adapt(parsed.children.find(node => node.type === NodeTypes.ELEMENT))
  for (const node of dictionaryRoot.children) {
    if (node.localName === 'ResourceDictionary.ThemeDictionaries') {
      for (const dictionary of node.children) {
        const theme = xKey(dictionary)
        for (const resource of dictionary.children) read(resource, {}, theme)
      }
    } else read(node, constants)
  }
}
const cssColor = color => {
  if (color?.startsWith('{ThemeResource ')) return cssAlias(color.slice(15, -1))
  if (!/^#[0-9a-f]{8}$/i.test(color)) return color === 'Transparent' ? 'transparent' : color
  const [alpha, red, green, blue] = [1, 3, 5, 7].map(index => parseInt(color.slice(index, index + 2), 16))
  return `rgba(${red}, ${green}, ${blue}, ${Number((alpha / 255).toFixed(6))})`
}
function readBorderBrushes() {
const commonFile = path.join(workspace, 'WinUI-Reference', 'controls', 'dev', 'CommonStyles', 'Common_themeresources_any.xaml')
const commonParsed = baseParse(fs.readFileSync(commonFile, 'utf8'))
const commonRoot = adapt(commonParsed.children.find(node => node.type === NodeTypes.ELEMENT))
const borderBrushes = { Default: {}, Light: {}, HighContrast: {} }
for (const dictionary of commonRoot.children.find(node => node.localName === 'ResourceDictionary.ThemeDictionaries').children) {
  const theme = xKey(dictionary)
  if (!(theme in borderBrushes)) continue
  const colors = Object.fromEntries(dictionary.children.filter(node => node.localName === 'Color').map(node => [xKey(node), node.textContent.trim()]))
  const color = value => {
    const key = value?.match(/^\{(?:StaticResource|ThemeResource) ([^}]+)\}$/)?.[1]
    return key ? colors[key] ? cssColor(colors[key]) : cssAlias(key) : cssColor(value)
  }
  const dependencies = new Set(Object.values(aliases).flatMap(Object.values));
  for (const key of dependencies) {
    const brush = dictionary.children.find(node => xKey(node) === key);
    if (brush?.localName === 'SolidColorBrush' && /^(?:ControlFill|TextFill|SubtleFill|FocusStroke)/.test(key)) {
      borderBrushes[theme][key] = color(brush.getAttribute('Color'));
    }
  }
  const defaultStroke = dictionary.children.find(node => xKey(node) === 'ControlStrokeColorDefaultBrush')
  borderBrushes[theme].ButtonControlStrokeColorDefaultBrush = color(defaultStroke?.getAttribute('Color') || '{ThemeResource SystemColorWindowTextColor}')
  for (const key of ['ControlElevationBorderBrush', 'AccentControlElevationBorderBrush']) {
    const brush = dictionary.children.find(node => xKey(node) === key)
    if (brush.localName === 'SolidColorBrush') {
      borderBrushes[theme][`Button${key}`] = color(brush.getAttribute('Color'))
      continue
    }
    const [startX, startY] = brush.getAttribute('StartPoint').split(',').map(Number)
    const [endX, endY] = brush.getAttribute('EndPoint').split(',').map(Number)
    if (startX !== endX || brush.getAttribute('MappingMode') !== 'Absolute') throw new Error(`Unsupported official button border geometry: ${key}`)
    const reverse = brush.children.find(node => node.localName === 'LinearGradientBrush.RelativeTransform')?.children.some(node => node.localName === 'ScaleTransform' && Number(node.getAttribute('ScaleY')) === -1)
    const length = Math.abs(endY - startY)
    const stops = brush.children.find(node => node.localName === 'LinearGradientBrush.GradientStops').children.map(node => `${color(node.getAttribute('Color'))} ${Number((Number(node.getAttribute('Offset')) * length).toFixed(6))}px`)
    borderBrushes[theme][`Button${key}`] = `linear-gradient(${reverse ? 0 : 180}deg, ${stops.join(', ')})`
  }
}
return borderBrushes
}
const systemColors = {
  SystemColorButtonFaceColorBrush: 'ButtonFace', SystemColorButtonFaceColor: 'ButtonFace', SystemColorButtonTextColorBrush: 'ButtonText', SystemColorButtonTextColor: 'ButtonText',
  SystemColorHighlightTextColorBrush: 'HighlightText', SystemColorHighlightTextColor: 'HighlightText', SystemColorHighlightColorBrush: 'Highlight', SystemColorHighlightColor: 'Highlight',
  SystemColorWindowColorBrush: 'Canvas', SystemColorWindowColor: 'Canvas', SystemColorGrayTextColorBrush: 'GrayText', SystemColorGrayTextColor: 'GrayText',
  SystemColorWindowTextColorBrush: 'CanvasText', SystemColorWindowTextColor: 'CanvasText',
  SystemControlBackgroundBaseLowBrush: 'Canvas', SystemControlBackgroundBaseMediumLowBrush: 'ButtonFace', SystemControlForegroundBaseHighBrush: 'ButtonText',
  SystemControlHighlightBaseHighBrush: 'HighlightText', SystemControlHighlightBaseMediumLowBrush: 'Highlight', SystemControlDisabledBaseMediumLowBrush: 'GrayText',
  SystemControlHighlightAccentBrush: 'Highlight', SystemControlForegroundAccentBrush: 'Highlight', SystemControlHighlightAltAccentBrush: 'HighlightText',
  SystemControlBackgroundChromeWhiteBrush: 'HighlightText', SystemControlHighlightAltChromeWhiteBrush: 'HighlightText', SystemControlBackgroundBaseHighBrush: 'Canvas',
  SystemControlHyperlinkTextBrush: 'LinkText', SystemControlPageTextBaseMediumBrush: 'CanvasText', SystemControlPageBackgroundTransparentBrush: 'transparent',
  SystemControlForegroundTransparentBrush: 'transparent', SystemControlDisabledTransparentBrush: 'transparent', SystemControlHighlightTransparentBrush: 'transparent',
  SystemControlHighlightAltTransparentBrush: 'transparent', SystemControlTransparentBrush: 'transparent'
}
function cssAlias(key) {
  if (key in systemColors) return `var(--${key}, ${systemColors[key]})`
  if (key === 'ControlElevationBorderBrush') return 'var(--ButtonControlElevationBorderBrush)'
  if (key === 'AccentControlElevationBorderBrush') return 'var(--ButtonAccentControlElevationBorderBrush)'
  if (key === 'ControlStrokeColorDefaultBrush') return 'var(--ButtonControlStrokeColorDefaultBrush)'
  if (key === 'TextOnAccentFillColorDisabled') return 'var(--TextOnAccentFillColorDisabled, var(--TextOnAccentFillColorDisabledBrush))'
  if (key === 'SubtleFillColorDisabledBrush') return 'var(--SubtleFillColorDisabledBrush, transparent)'
  return `var(--${key})`
}
const borderBrushes = readBorderBrushes()
const sorted = object => Object.fromEntries(Object.entries(object).sort(([a], [b]) => a.localeCompare(b)))
const resourceKeys = new Set([...Object.keys(constants), ...Object.keys(styles), ...Object.values(aliases).flatMap(Object.keys), ...Object.values(values).flatMap(Object.keys)])
const resources = Object.fromEntries([...resourceKeys].sort().map(key => [key, constants[key] ?? styles[key] ?? `var(--${key})`]))
fs.writeFileSync(path.join(project, 'src', 'components', 'buttonResources.ts'), `// Generated from WinUI-Reference CommonStyles and SplitButton theme dictionaries.\nexport const buttonThemeResourceAliases = ${JSON.stringify(Object.fromEntries(Object.entries(aliases).map(([theme, data]) => [theme, sorted(data)])), null, 2)} as const\n\nexport const buttonResources: Record<string, unknown> = ${JSON.stringify(resources, null, 2)}\n`)
const cssValue = (key, value) => {
  if (typeof value === 'number') return `${value}px`
  if (kinds[key] !== 'Thickness') return value
  const parts = String(value).split(',').map(number => `${Number(number)}px`)
  return parts.length === 4 ? [parts[1], parts[2], parts[3], parts[0]].join(' ') : parts.length === 2 ? [parts[1], parts[0]].join(' ') : parts.join(' ')
}
const cssConstants = Object.entries(constants).filter(([key]) => kinds[key] !== 'Style' && kinds[key] !== 'StaticResource').map(([key, value]) => `  --${key}: ${cssValue(key, value)};`)
const block = theme => [...Object.entries(borderBrushes[theme]).map(([key, value]) => `  --${key}: ${value};`), ...Object.entries(aliases[theme]).map(([key, value]) => `  --${key}: ${cssAlias(value)};`), ...Object.entries(values[theme]).map(([key, value]) => `  --${key}: ${cssColor(value)};`)].join('\n')
const lightScope = ':root, html.theme-light, .theme-light, .example-theme-wrapper.theme-light, .win-theme-scope.theme-light'
const darkScope = 'html.theme-dark, .theme-dark, .example-theme-wrapper.theme-dark, .win-theme-scope.theme-dark'
let css = `/* Generated from the official WinUI button theme resource dictionaries. */\n:root, .theme-light, .theme-dark, .theme-highcontrast, .theme-high-contrast {\n${cssConstants.join('\n')}\n}\n\n${lightScope} {\n${block('Light')}\n}\n\n${darkScope} {\n${block('Default')}\n}\n\n.theme-highcontrast, .theme-high-contrast {\n${block('HighContrast')}\n}\n\n@media (forced-colors: active) {\n  ${lightScope}, ${darkScope} {\n${block('HighContrast').split('\n').map(line => `  ${line}`).join('\n')}\n  }\n  .win-btn, .win-hyperlink-button, .win-split-button { forced-color-adjust: none; }\n}\n`
fs.writeFileSync(path.join(project, 'src', 'styles', 'buttonResources.css'), css)
console.log(`Generated ${resourceKeys.size} button resources from the official XML dictionaries`)
