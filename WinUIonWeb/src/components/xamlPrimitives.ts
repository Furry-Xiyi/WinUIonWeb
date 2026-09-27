import { computed, defineComponent, Fragment, Text, watch, type ComputedRef, type VNode } from 'vue'
import { colorString, createSolidColorBrush } from './brushCore'
import { resolveXamlValue } from './xamlRuntime'
import type { XamlResourceFactoryContext } from './UICommandProperties'

export const xamlPrimitiveResourceKey = Symbol.for('WinUIonWeb.Xaml.PrimitiveResources')
const primitive = (name: string) => defineComponent({ name, __xamlPrimitive: name, setup: () => () => null })
export const XamlDouble = primitive('x:Double')
export const XamlInt32 = primitive('x:Int32')
export const XamlBoolean = primitive('x:Boolean')
export const Thickness = primitive('Thickness')
export const HorizontalAlignment = primitive('HorizontalAlignment')
export const VerticalAlignment = primitive('VerticalAlignment')
const ThemeDictionaries = defineComponent({ name: 'ResourceDictionary.ThemeDictionaries', __xamlThemeDictionaries: true, setup: () => () => null })
const MergedDictionaries = defineComponent({ name: 'ResourceDictionary.MergedDictionaries', __xamlResourceDictionary: true, setup: () => () => null })
export const ResourceDictionary = defineComponent({ name: 'ResourceDictionary', __xamlResourceDictionary: true, ThemeDictionaries, MergedDictionaries, setup: () => () => null })
export const StaticResource = defineComponent({
  name: 'StaticResource',
  __createXamlResource: (read: (name: string) => unknown, context: XamlResourceFactoryContext) =>
    computed(() => resolveXamlValue(`{StaticResource ${String(read('ResourceKey') ?? '')}}`, context.instance)),
  setup: () => () => null
})
export const SolidColorBrush = defineComponent({
  name: 'SolidColorBrush', __xamlBrush: true,
  __createXamlResource: (read: (name: string) => unknown, context?: { Dispose: (callback: () => void) => void }) => {
    const brush = createSolidColorBrush()
    const stop = watch(() => [read('Color'), read('Opacity')], ([color, opacity]) => {
      if (color !== undefined) brush.Color = colorString(color)
      if (opacity !== undefined) brush.Opacity = Math.max(0, Math.min(1, Number(opacity)))
    }, { immediate: true })
    context?.Dispose(stop)
    return brush
  }, setup: () => () => null
})
const childrenOf = (node: VNode): VNode[] => Array.isArray(node.children)
  ? node.children as VNode[]
  : (node.children as { default?: () => VNode[] } | null)?.default?.() ?? []
const textOf = (node: VNode): string => typeof node.children === 'string'
  ? node.children
  : childrenOf(node).map(child => child.type === Text ? String(child.children ?? '') : textOf(child)).join('')

// WinUI-Reference/controls/dev/dll/DensityStyles/Compact.xaml.
export const compactDensityResources: Readonly<Record<string, number | string>> = Object.freeze({
  ControlContentThemeFontSize: 14,
  ContentControlFontSize: 14,
  TextControlThemeMinHeight: 24,
  TextControlThemePadding: '2,2,6,1',
  ListViewItemMinHeight: 32,
  TreeViewItemMinHeight: 24,
  TreeViewItemMultiSelectCheckBoxMinHeight: 24,
  TreeViewItemPresenterMargin: 0,
  TreeViewItemPresenterPadding: 0,
  TimePickerHostPadding: '0,1,0,2',
  DatePickerHostPadding: '0,1,0,2',
  DatePickerHostMonthPadding: '9,0,0,1',
  ComboBoxEditableTextPadding: '10,0,30,0',
  ComboBoxMinHeight: 24,
  ComboBoxPadding: '12,1,0,3',
  NavigationViewItemOnLeftMinHeight: 32
})

export const primitiveResourceStyles = (values: Record<string, unknown>): Record<string, string> => {
  const styles: Record<string, string> = {}
  for (const [key, value] of Object.entries(values)) {
    if (typeof value === 'number') styles[`--${key}`] = `${value}px`
    else if (typeof value === 'string' && /^-?\d+(?:\.\d+)?(?:\s*,\s*-?\d+(?:\.\d+)?){0,3}$/.test(value)) {
      const parts = value.split(',').map(part => `${Number(part.trim())}px`)
      styles[`--${key}`] = parts.length === 4 ? [parts[1], parts[2], parts[3], parts[0]].join(' ')
        : parts.length === 2 ? [parts[1], parts[0]].join(' ') : parts.join(' ')
    }
  }
  return styles
}

/** Numeric XAML resources retain their value when used as GridLength/Height. */
export const primitiveResourceScope = (readNodes: () => VNode[], inherited?: ComputedRef<Record<string, unknown>> | null) => computed(() => {
  const values: Record<string, unknown> = { ...inherited?.value }
  const visit = (nodes: VNode[], inResources = false) => {
    for (const node of nodes) {
      if (!node || typeof node !== 'object') continue
      const type = node.type as { name?: string }
      const name = typeof node.type === 'string' ? node.type : type.name ?? ''
      if (node.type === Fragment || name === 'ResourceDictionary' || name === 'ResourceDictionary.ThemeDictionaries' || name === 'ResourceDictionary.MergedDictionaries') {
        if (inResources && name === 'ResourceDictionary' && node.props?.Source === 'ms-appx:///Microsoft.UI.Xaml/DensityStyles/Compact.xaml') Object.assign(values, compactDensityResources)
        visit(childrenOf(node), inResources)
      }
      else if (name.endsWith('.Resources')) visit(childrenOf(node), true)
      else if (inResources && ['x:Double', 'x:Int32', 'x:Boolean', 'x:String', 'Thickness', 'HorizontalAlignment', 'VerticalAlignment'].includes(name)) {
        const key = node.props?.['x:Key']
        if (typeof key !== 'string') continue
        const text = textOf(node).trim()
        const value = ['x:String', 'Thickness', 'HorizontalAlignment', 'VerticalAlignment'].includes(name) ? text : name === 'x:Boolean' ? text === 'True' : Number(text)
        if (typeof value !== 'number' || Number.isFinite(value)) values[key] = value
      }
    }
  }
  visit(readNodes())
  return values
})
