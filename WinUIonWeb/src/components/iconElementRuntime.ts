import { computed, reactive, ref, watch, type ComponentInternalInstance, type CSSProperties } from 'vue'
import { frameworkLayoutStyle } from './frameworkLayout'
import { textBrush, textFontWeight } from './TextInline'
import { resolveXamlValue, updateXamlBinding } from './xamlRuntime'
import './iconElementStyles.css'

/** Common FrameworkElement/IconElement dependency properties. */
export const iconElementProps = {
  Foreground: { type: [String, Object], default: '' },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: 0 },
  MinHeight: { type: [String, Number], default: 0 },
  MaxWidth: { type: [String, Number], default: '' },
  MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: 0 },
  HorizontalAlignment: { type: String, default: 'Stretch' },
  VerticalAlignment: { type: String, default: 'Stretch' },
  Visibility: { type: [String, Boolean], default: 'Visible' },
  Opacity: { type: [String, Number], default: 1 },
  IsHitTestVisible: { type: [Boolean, String], default: true },
  FlowDirection: { type: String, default: '' },
  RequestedTheme: { type: String, default: 'Default' }
}

export const iconBoolean = (value: unknown, fallback = false) => {
  if (value === undefined || value === null || value === '') return fallback
  return value === true || value === 'True' || value === 'true' || value === 1 || value === '1'
}

export const iconFontFamily = (value: unknown) => {
  const family = typeof value === 'string' ? value : ''
  if (!family) return '"Segoe Fluent Icons", "Segoe MDL2 Assets", "WinUIOnWebFontIcons"'
  return /Segoe (?:Fluent Icons|MDL2 Assets)|SymbolThemeFontFamily/.test(family)
    ? `${family}, "WinUIOnWebFontIcons"` : family
}

export const iconFontWeight = textFontWeight

export const useIconElement = (
  props: Record<string, unknown>,
  attrs: Record<string, unknown>,
  instance: ComponentInternalInstance | null,
  propertyNames: string[] = []
) => {
  const Element = ref<HTMLElement | null>(null)
  const local = reactive<Record<string, unknown>>({})
  const resolve = (value: unknown) => resolveXamlValue(value, instance)
  const read = (name: string) => name in local ? local[name] : resolve(props[name])
  const property = (name: string) => computed({
    get: () => read(name),
    set: (value: unknown) => { local[name] = value; updateXamlBinding(props[name], value, instance) }
  })
  const names = [...Object.keys(iconElementProps), ...propertyNames]
  for (const name of names) watch(() => resolve(props[name]), () => { delete local[name] })
  // Foreground remains inherited until explicitly set on IconElement.
  const layoutStyle = computed<CSSProperties>(() => {
    const values = Object.fromEntries(Object.keys(iconElementProps).map(name => [name, read(name)]))
    const style: CSSProperties = { flex: '0 0 auto', ...frameworkLayoutStyle(values, instance) }
    const foreground = read('Foreground')
    if (foreground !== undefined && foreground !== null && foreground !== '') style.color = textBrush(foreground)
    const direction = read('FlowDirection')
    if (direction === 'RightToLeft' || direction === 'LeftToRight') style.direction = direction === 'RightToLeft' ? 'rtl' : 'ltr'
    if (!iconBoolean(read('IsHitTestVisible'), true)) style.pointerEvents = 'none'
    if (read('Visibility') === false || read('Visibility') === 'Collapsed') style.display = 'none'
    return style
  })
  const rootAttrs = computed(() => {
    const result = Object.fromEntries(Object.entries(attrs).filter(([name]) => !['class', 'style', 'AutomationProperties.Name', 'AutomationProperties.AccessibilityView'].includes(name)))
    result.HorizontalAlignment = read('HorizontalAlignment')
    result.VerticalAlignment = read('VerticalAlignment')
    result['data-stack-panel-width'] = read('Width') === '' ? 'Auto' : read('Width')
    result['data-stack-panel-height'] = read('Height') === '' ? 'Auto' : read('Height')
    const automationName = resolve(attrs['AutomationProperties.Name'])
    if (automationName) { result.role = 'img'; result['aria-label'] = String(automationName) }
    const theme = read('RequestedTheme')
    if (theme === 'Light' || theme === 'Dark') {
      result['data-theme'] = String(theme).toLowerCase()
      result.class = `win-theme-scope theme-${String(theme).toLowerCase()}`
    }
    return result
  })
  const api: Record<string, unknown> = {
    Element,
    get ActualWidth() { return Element.value?.getBoundingClientRect().width ?? 0 },
    get ActualHeight() { return Element.value?.getBoundingClientRect().height ?? 0 }
  }
  for (const name of names) Object.defineProperty(api, name, {
    enumerable: true, configurable: true, get: () => read(name),
    set: (value: unknown) => { local[name] = value; updateXamlBinding(props[name], value, instance) }
  })
  return { Element, property, read, resolve, layoutStyle, rootAttrs, api }
}
