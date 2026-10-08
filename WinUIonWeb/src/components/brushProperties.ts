import { Comment, computed, defineComponent, Fragment, onBeforeUnmount, shallowRef, Text, type ComponentInternalInstance, type VNode } from 'vue'
import { resolveXamlValue, xamlNameScopeKey } from './xamlRuntime'
import { useAcrylicBrushStyle } from './AcrylicBrush'
import { xamlResourceNodesEqual } from './xamlBrushResources'

export const brushProperty = (owner: string, property: string) => defineComponent({
  name: `${owner}.${property}`, __xamlBrushProperty: property, setup: () => () => null
})
const childrenOf = (node: VNode): VNode[] => Array.isArray(node.children) ? node.children as VNode[]
  : (node.children as { default?: () => VNode[] } | null)?.default?.() ?? []
export const isBrushProperty = (node: VNode) => Boolean((node.type as { __xamlBrushProperty?: string })?.__xamlBrushProperty)
export const useBrushProperty = (property: string, value: () => unknown, nodes: () => VNode[], instance: ComponentInternalInstance | null) => {
  const source = shallowRef<VNode>()
  let factoryType: unknown
  let brush: unknown
  let publishedName: string | undefined
  const names = instance?.provides[xamlNameScopeKey] as Record<string, unknown> | undefined
  let disposers: (() => void)[] = []
  const dispose = () => {
    disposers.forEach(stop => stop()); disposers = []
    if (publishedName && names && names[publishedName] === brush) delete names[publishedName]
    publishedName = undefined
  }
  onBeforeUnmount(dispose)
  const find = (children: VNode[]): VNode | undefined => {
    for (const node of children) {
      if (node.type === Fragment) { const result = find(childrenOf(node)); if (result) return result }
      if ((node.type as { __xamlBrushProperty?: string })?.__xamlBrushProperty === property) return childrenOf(node)
        .find(child => child.type !== Comment && !(child.type === Text && !String(child.children ?? '').trim()))
    }
  }
  const resolved = computed(() => {
    const node = find(nodes())
    if (!node) {
      if (factoryType) { dispose(); factoryType = undefined; source.value = undefined; brush = undefined }
      return resolveXamlValue(value(), instance)
    }
    const type = node.type as { __createXamlResource?: (read: (name: string) => unknown, context: { Dispose: (stop: () => void) => void; Node: () => VNode; instance: ComponentInternalInstance | null }) => unknown }
    if (node.type !== factoryType) {
      dispose()
      factoryType = node.type
      source.value = node
      brush = type.__createXamlResource?.(name => resolveXamlValue(source.value?.props?.[name], instance), { Dispose: stop => disposers.push(stop), Node: () => source.value!, instance })
    } else if (!xamlResourceNodesEqual(source.value, node)) source.value = node
    const name = node.props?.['x:Name'] ?? node.props?.['data-xaml-ref']
    if (publishedName && publishedName !== name && names && names[publishedName] === brush) { delete names[publishedName]; publishedName = undefined }
    if (typeof name === 'string' && names && names[name] !== brush) {
      names[name] = brush
      publishedName = name
    }
    return brush
  })
  return { value: resolved, style: useAcrylicBrushStyle(() => resolved.value, instance) }
}
