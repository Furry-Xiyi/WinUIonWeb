import { cloneVNode, computed, Fragment, inject, onBeforeUnmount, provide, shallowReactive, shallowRef, unref, type ComponentInternalInstance, type Ref, type ShallowRef, type VNode } from 'vue'
import { xamlBrushResourceKey } from './brushCore'
import type { XamlResourceFactoryContext } from './UICommandProperties'
import { resolveXamlValue } from './xamlRuntime'

type ResourceFactory = (read: (name: string) => unknown, context: XamlResourceFactoryContext) => unknown
type ResourceType = { __xamlBrush?: boolean; __xamlDependencyObject?: boolean; __xamlResourceDictionary?: boolean; __xamlThemeDictionaries?: boolean; __createXamlResource?: ResourceFactory }
type ResourceValues = Record<string, unknown>
type ResourceRecord = { node: ShallowRef<VNode>; value: unknown; type: VNode['type']; factory: ResourceFactory; dispose: () => void }

const childrenOf = (node: VNode): VNode[] => Array.isArray(node.children)
  ? node.children as VNode[]
  : (node.children as { default?: () => VNode[] } | null)?.default?.() ?? []

export const xamlResourceKey = (node: VNode) => {
  const value = node.props?.['x:Key'] ?? node.props?.['x:Name']
  return typeof value === 'string' ? value.trim() : ''
}

// Resource declarations are recreated by Vue's slot render on each pass.
// Compare the dependency-property inputs instead of VNode identity so a
// stable brush does not retrigger its watchers during the owning host render.
export const xamlResourceNodesEqual = (left: VNode | undefined, right: VNode | undefined): boolean => {
  if (left === right) return true
  if (!left || !right || left.type !== right.type) return false
  const leftProps = left.props ?? {}
  const rightProps = right.props ?? {}
  // TwoWay normalization regenerates update callbacks on each render. The
  // original binding expression is the resource input, not callback identity.
  const dependencyKeys = (props: Record<string, unknown>) => Object.keys(props)
    .filter(key => key !== 'ref' && !key.startsWith('onVnode') && !key.startsWith('onUpdate:'))
  const leftKeys = dependencyKeys(leftProps)
  const rightKeys = dependencyKeys(rightProps)
  if (leftKeys.length !== rightKeys.length) return false
  if (!leftKeys.every(key => Object.prototype.hasOwnProperty.call(rightProps, key)
    && Object.is(leftProps[key], rightProps[key]))) return false
  // Brush VNodes such as RadialGradientBrush own a live collection of
  // property-element children. Compare those children instead of short
  // circuiting on the brush marker, otherwise replacing a GradientStop
  // binding would leave the rendered brush stale.
  if ((left.type as ResourceType).__xamlBrush && left.children === right.children) return true
  if (typeof left.children === 'string' || typeof right.children === 'string') return left.children === right.children
  const leftChildren = childrenOf(left)
  const rightChildren = childrenOf(right)
  return leftChildren.length === rightChildren.length
    && leftChildren.every((child, index) => xamlResourceNodesEqual(child, rightChildren[index]))
}

export const collectXamlResources = (nodes: VNode[], dictionary: Record<string, VNode>, theme = '') => {
  for (const node of nodes) {
    if (!node || typeof node !== 'object') continue
    if (node.type === Fragment) {
      collectXamlResources(childrenOf(node), dictionary, theme)
      continue
    }
    const type = node.type as ResourceType
    if (type.__xamlThemeDictionaries) {
      for (const entry of childrenOf(node)) collectXamlResources(childrenOf(entry), dictionary, xamlResourceKey(entry))
      continue
    }
    if (type.__xamlResourceDictionary) {
      collectXamlResources(childrenOf(node), dictionary, theme)
      continue
    }
    const key = xamlResourceKey(node)
    if (key) dictionary[theme ? `${theme}:${key}` : key] = theme ? cloneVNode(node, { __xamlResourceTheme: theme }) : node
  }
}

export const useXamlBrushResources = (instance: ComponentInternalInstance | null, names?: ResourceValues) => {
  const inherited = inject<ResourceValues | Ref<ResourceValues>>(xamlBrushResourceKey, {})
  const local = shallowReactive<ResourceValues>({})
  provide(xamlBrushResourceKey, computed(() => ({ ...unref(inherited), ...local })))
  const records = new Map<string, ResourceRecord>()
  const registeredNames = new Map<string, unknown>()
  onBeforeUnmount(() => {
    records.forEach(record => record.dispose())
    records.clear()
    if (names) for (const [name, value] of registeredNames) if (names[name] === value) delete names[name]
    registeredNames.clear()
  })

  const sync = (declarations: Record<string, VNode>) => {
    const brushes = Object.fromEntries(Object.entries(declarations).filter(([, node]) => {
      const type = node.type as ResourceType
      return type.__xamlBrush || type.__xamlDependencyObject
    }))
    for (const [key, record] of records) {
      const node = brushes[key]
      if (node?.type === record.type && (node.type as ResourceType).__createXamlResource === record.factory) continue
      record.dispose()
      records.delete(key)
    }
    const next: ResourceValues = {}
    const nextNames = new Map<string, unknown>()
    for (const [key, node] of Object.entries(brushes)) {
      const factory = (node.type as ResourceType).__createXamlResource
      if (!factory) continue
      let record = records.get(key)
      if (!record) {
        const source = shallowRef(node)
        const disposers: (() => void)[] = []
        record = {
          node: source, type: node.type, factory,
          value: factory(name => resolveXamlValue(source.value.props?.[name], instance), {
            instance, Node: () => source.value, Dispose: callback => disposers.push(callback)
          }),
          dispose: () => disposers.forEach(dispose => dispose())
        }
        records.set(key, record)
      }
      if (!xamlResourceNodesEqual(record.node.value, node)) record.node.value = node
      const name = xamlResourceKey(node)
      const theme = String(node.props?.__xamlResourceTheme ?? '')
      if (theme) {
        const variants = (next[name] ??= { __xamlThemeResource: true }) as ResourceValues
        variants[theme] = record.value
        if (theme === 'Default') nextNames.set(name, record.value)
      } else {
        next[name] = record.value
        nextNames.set(name, record.value)
      }
    }
    for (const key of Object.keys(local)) if (!(key in next)) delete local[key]
    for (const [key, value] of Object.entries(next)) {
      const variants = value as ResourceValues | undefined
      if (variants?.__xamlThemeResource) {
        const previous = local[key] as ResourceValues | undefined
        const target = previous?.__xamlThemeResource ? previous : shallowReactive<ResourceValues>({ __xamlThemeResource: true })
        for (const theme of Object.keys(target)) if (!(theme in variants)) delete target[theme]
        for (const [theme, brush] of Object.entries(variants)) if (target[theme] !== brush) target[theme] = brush
        if (local[key] !== target) local[key] = target
      } else if (local[key] !== value) local[key] = value
    }
    if (names) {
      for (const [name, value] of registeredNames) if (!nextNames.has(name) && names[name] === value) delete names[name]
      for (const [name, value] of nextNames) if (names[name] !== value) names[name] = value
      registeredNames.clear()
      nextNames.forEach((value, name) => registeredNames.set(name, value))
    }
  }
  return { sync }
}
