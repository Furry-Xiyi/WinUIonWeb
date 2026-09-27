import { cloneVNode, defineComponent, Fragment, h, isVNode, markRaw, provide, reactive, shallowReactive, shallowRef, type ComponentInternalInstance, type VNode } from 'vue'
import SymbolIcon from './SymbolIcon.vue'
import { itemsViewElementKey } from './ItemsViewState'
import { selectorBarStyleSetter } from './selectorBarResources'
import { normalizeXamlNodes, resolveXamlValue, updateXamlBinding, xamlControlIdentityKey, xamlNameScopeKey, xamlScopeKey } from './xamlRuntime'

export const selectorBarItemKey = Symbol('WinUIonWeb.selectorBarItem')
export const selectorBarPointerFocusKey = Symbol('WinUIonWeb.selectorBarPointerFocus')
const property = (name: string) => defineComponent({
  name: `SelectorBar.${name}`, __selectorBarProperty: name,
  setup(_, { slots }) { return () => h(Fragment, slots.default?.()) }
})
export const SelectorBarItems = property('Items')
export const SelectorBarItemIcon = property('Icon')
export const SelectorBarItemChild = property('Child')

export const selectorBarItemDefaults: Record<string, unknown> = {
  Style: null,
  Text: '', Tag: '', Icon: null, Child: null, IsSelected: false, IsEnabled: true,
  IsTabStop: true, IsHitTestVisible: true, Visibility: 'Visible',
  BackgroundSizing: 'OuterBorderEdge', Background: 'Transparent', Foreground: '{ThemeResource SelectorBarItemForeground}',
  BorderBrush: '{ThemeResource SelectorBarItemBorderBrush}', BorderThickness: 1,
  Padding: '12,10,12,7', CornerRadius: '{ThemeResource ControlCornerRadius}',
  FontFamily: '{ThemeResource ContentControlThemeFontFamily}', FontSize: 14, FontWeight: 'Normal',
  HorizontalAlignment: 'Left', VerticalAlignment: 'Center',
  HorizontalContentAlignment: 'Left', VerticalContentAlignment: 'Top',
  Width: '', Height: '', MinWidth: 0, MinHeight: 0, MaxWidth: '', MaxHeight: '',
  Margin: 0, Opacity: 1, FlowDirection: 'LeftToRight',
  FocusVisualMargin: -2, UseSystemFocusVisuals: true
}

const elementNodeKey = Symbol('WinUIonWeb.selectorBarElementNode')
const elementTypeName = (node: VNode) => typeof node.type === 'string' ? node.type
  : (node.type as { name?: string; __name?: string })?.name || (node.type as { __name?: string })?.__name || ''

// An IconElement/UIElement has a stable dependency-property object, separate
// from its rendered VNode. The same hook used by ItemsView to realize an actual
// SelectorBarItem lets property elements render these objects directly.
export const createSelectorBarElement = (initialNode: VNode, owner: ComponentInternalInstance | null) => {
  let currentNode = initialNode
  const source = shallowRef(initialNode)
  const overrides = shallowReactive<Record<string, unknown>>({})
  const target: Record<PropertyKey, unknown> = {}
  let elementApi: Record<PropertyKey, unknown>
  // User-defined Icon/Child elements keep the declaration's scope even when
  // the item is realized inside the ScrollView's private control template.
  const ElementOutlet = defineComponent({
    name: 'SelectorBarPropertyElement',
    setup() {
      const scope = owner?.parent?.provides?.[xamlScopeKey] ?? owner?.provides?.[xamlScopeKey]
      const names = owner?.provides?.[xamlNameScopeKey]
      if (scope) provide(xamlScopeKey, scope)
      if (names) provide(xamlNameScopeKey, names)
      return () => h(Fragment, normalizeXamlNodes([renderElement()], owner))
    }
  })
  const renderElement = () => {
    const element = cloneVNode(source.value, overrides)
    const previousMounted = element.props?.onVnodeMounted
    const previousUpdated = element.props?.onVnodeUpdated
    const exposeElement = (vnode: VNode, previous: unknown) => {
      if (vnode.component) {
        vnode.component.exposed = elementApi as Record<string, unknown>
        vnode.component.exposeProxy = null
      }
      if (typeof previous === 'function') previous(vnode)
    }
    element.props = { ...element.props,
      onVnodeMounted: (vnode: VNode) => exposeElement(vnode, previousMounted),
      onVnodeUpdated: (vnode: VNode) => exposeElement(vnode, previousUpdated) }
    return element
  }
  Object.defineProperties(target, {
    [xamlControlIdentityKey]: { value: true },
    [elementNodeKey]: { get: () => currentNode },
    [itemsViewElementKey]: { value: () => h(ElementOutlet) },
    UpdateElementNode: { value: (next: VNode) => { currentNode = next; source.value = next } },
    Type: { get: () => elementTypeName(currentNode) }
  })
  elementApi = markRaw(new Proxy(target, {
    get(object, property, receiver) {
      if (Reflect.has(object, property)) return Reflect.get(object, property, receiver)
      if (typeof property !== 'string') return undefined
      if (property.startsWith('__v_')) return undefined
      if (property in overrides) return overrides[property]
      const value = source.value.props?.[property]
      if (value !== undefined) return resolveXamlValue(value, owner)
      return property === 'Symbol' && elementTypeName(source.value) === 'SymbolIcon' ? 'Emoji' : undefined
    },
    set(object, property, value, receiver) {
      if (Reflect.has(object, property)) return Reflect.set(object, property, value, receiver)
      if (typeof property !== 'string') return false
      overrides[property] = value
      const binding = source.value.props?.[property]
      updateXamlBinding(binding, value, owner)
      if (typeof binding === 'string' && /Mode\s*=\s*TwoWay/i.test(binding)
        && Object.is(resolveXamlValue(binding, owner), value)) delete overrides[property]
      return true
    },
    ownKeys: object => [...new Set([...Reflect.ownKeys(object), ...Object.keys(source.value.props ?? {}), ...Object.keys(overrides)])],
    getOwnPropertyDescriptor: (object, property) => Reflect.getOwnPropertyDescriptor(object, property)
      ?? (typeof property === 'string' && (property in (source.value.props ?? {}) || property in overrides)
        ? { configurable: true, enumerable: true, writable: true, value: undefined } : undefined)
  }))
  return elementApi
}

export const selectorBarElementFactory = (owner: ComponentInternalInstance | null) => {
  const symbols = new Map<string | number, Record<PropertyKey, unknown>>()
  const nodes = new WeakMap<object, Record<PropertyKey, unknown>>()
  return (name: string, value: unknown): unknown => {
    if (value === undefined || value === null || value === '') return null
    if (typeof value === 'object' && typeof (value as Record<PropertyKey, unknown>)[itemsViewElementKey] === 'function') return value
    if (name === 'Icon' && (typeof value === 'string' || typeof value === 'number')) {
      let element = symbols.get(value)
      if (!element) { element = createSelectorBarElement(h(SymbolIcon, { Symbol: value }), owner); symbols.set(value, element) }
      return element
    }
    if (isVNode(value)) {
      let element = nodes.get(value)
      if (!element) { element = createSelectorBarElement(value, owner); nodes.set(value, element) }
      return element
    }
    return value
  }
}

/** The dependency-property object belongs to its item, not its array index. */
export const createSelectorBarItem = (initialNode: VNode, owner: ComponentInternalInstance | null,
  selectionChanged: (item: Record<PropertyKey, unknown>, selected: boolean) => void) => {
  const node = shallowRef(initialNode)
  const overrides = reactive<Record<string, unknown>>({})
  // Keep the public element facade identity stable when it is stored in the
  // reactive item record; deep reactive wrapping would create a second Proxy
  // and break x:Name/property getter identity checks.
  const propertyValues = shallowReactive<Record<string, unknown>>({})
  const propertyOverrides = reactive<Record<string, boolean>>({})
  const makeElement = selectorBarElementFactory(owner)
  const api: Record<PropertyKey, unknown> = {}
  let synchronizing = false
  for (const [name, fallback] of Object.entries(selectorBarItemDefaults)) {
    Object.defineProperty(api, name, {
      enumerable: true,
      get: () => {
        if ((name === 'Icon' || name === 'Child') && name in propertyValues && !propertyOverrides[name]) return propertyValues[name]
        const style = name === 'Style' ? undefined : selectorBarStyleSetter(api.Style, name, 'SelectorBarItem')
        const value = resolveXamlValue(name in overrides ? overrides[name] : node.value.props?.[name] ?? style ?? fallback, owner)
        return name === 'Icon' || name === 'Child' ? makeElement(name, value) : value
      },
      set: value => {
        const previous = api[name]
        if (name === 'Icon' || name === 'Child') propertyOverrides[name] = true
        overrides[name] = value
        if (previous === value || synchronizing) return
        updateXamlBinding(node.value.props?.[name], value, owner)
        if (name === 'IsSelected') selectionChanged(api, value === true || value === 'True')
      }
    })
  }
  Object.defineProperties(api, {
    [xamlControlIdentityKey]: { value: true },
    [selectorBarItemKey]: { value: true },
    [itemsViewElementKey]: { value: () => cloneVNode(node.value) },
    SetPropertyElement: { value: (name: string, elementNode: VNode | null) => {
      if (propertyOverrides[name]) return
      if (elementNode == null) {
        delete propertyValues[name]
      } else {
        const previous = propertyValues[name] as Record<PropertyKey, unknown> | undefined
        const previousNode = previous?.[elementNodeKey] as VNode | undefined
        if (previousNode && previousNode.type === elementNode.type && previousNode.key === elementNode.key) {
          (previous.UpdateElementNode as (next: VNode) => void)(elementNode)
        } else propertyValues[name] = createSelectorBarElement(elementNode, owner)
      }
    } },
    HasPropertyElementOverride: { value: (name: string) => Boolean(propertyOverrides[name]) },
    SynchronizeBoundProperty: { value: (name: string) => { delete overrides[name]; delete propertyOverrides[name] } },
    UpdateNode: { value: (next: VNode) => { node.value = next } },
    SynchronizeSelection: { value: (selected: boolean) => {
      synchronizing = true
      const previous = api.IsSelected
      overrides.IsSelected = selected
      if (previous !== selected) updateXamlBinding(node.value.props?.IsSelected, selected, owner)
      synchronizing = false
    } }
  })
  return api
}
