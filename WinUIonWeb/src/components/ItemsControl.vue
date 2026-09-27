<template>
  <div ref="element" v-bind="attrs" class="win-items-control" :style="hostStyle" :tabindex="IsEnabled && IsTabStop ? 0 : undefined" :inert="IsEnabled ? undefined : true" :aria-disabled="IsEnabled ? undefined : true">
    <div class="win-items-presenter"><PanelOutlet /></div>
  </div>
</template>

<script lang="ts">
import { CollectionItems, CollectionResources, CollectionItemTemplate, CollectionItemTemplateSelector, CollectionItemsPanel } from './CollectionProperties'
export default { Items: CollectionItems, Resources: CollectionResources, ItemTemplate: CollectionItemTemplate, ItemTemplateSelector: CollectionItemTemplateSelector, ItemsPanel: CollectionItemsPanel }
</script>

<script setup lang="ts">
import { cloneVNode, Comment, computed, defineComponent, Fragment, getCurrentInstance, h, inject, isVNode, onScopeDispose, provide, proxyRefs, ref, shallowRef, Text, useAttrs, useSlots, watch, type VNode } from 'vue'
import ContentPresenter from './ContentPresenter.vue'
import StackPanel from './StackPanel.vue'
import { getCollectionProperty, getVNodeChildren } from './CollectionProperties'
import { frameworkLayoutStyle } from './frameworkLayout'
import { boolValue } from './layout'
import { xamlResourceDictionaryKey } from './Page.vue'
import { normalizeXamlNodes, resolveXamlResourceObject, resolveXamlValue, updateXamlBinding, xamlItemContextKey, xamlTemplateComponent } from './xamlRuntime'

defineOptions({ name: 'ItemsControl', inheritAttrs: false })
const props = defineProps({
  ItemsSource: { type: [String, Array, Object], default: null }, ItemTemplate: { type: null, default: undefined }, ItemTemplateSelector: { type: null, default: undefined }, ItemsPanel: { type: null, default: undefined },
  IsEnabled: { type: [String, Boolean], default: true }, IsTabStop: { type: [String, Boolean], default: true },
  Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' }, MinWidth: { type: [String, Number], default: 0 }, MinHeight: { type: [String, Number], default: 0 }, MaxWidth: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' }, Padding: { type: [String, Number], default: '' }, Background: { type: [String, Object], default: '' }, BorderBrush: { type: String, default: '' }, BorderThickness: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: 'Stretch' }, VerticalAlignment: { type: String, default: 'Stretch' }, Visibility: { type: String, default: 'Visible' }
})
const attrs = useAttrs(), slots = useSlots(), instance = getCurrentInstance(), element = ref<HTMLElement | null>(null)
const overrides = shallowRef<Record<string, unknown>>({})
const resolve = (value: unknown) => resolveXamlValue(value, instance)
const value = (name: keyof typeof props) => name in overrides.value ? overrides.value[name] : resolve(props[name])
const childrenOf = (node: VNode): VNode[] => Array.isArray(node.children) ? node.children as VNode[] : (node.children as { default?: () => VNode[] })?.default?.() ?? []
const nameOf = (node: VNode) => typeof node.type === 'string' ? node.type : (node.type as { name?: string; __name?: string })?.name ?? (node.type as { __name?: string })?.__name ?? ''
const flatten = (nodes: VNode[]): VNode[] => nodes.flatMap(node => node.type === Fragment ? flatten(childrenOf(node)) : node.type === Comment || node.type === Text && !String(node.children ?? '').trim() ? [] : [node])
const declarations = computed(() => flatten(slots.default?.() ?? []))
const propertyNodes = (name: string) => declarations.value.filter(node => getCollectionProperty(node) === name)
const directItems = computed(() => declarations.value.flatMap(node => getCollectionProperty(node) === 'items' ? childrenOf(node) : getCollectionProperty(node) ? [] : [node]))
const inheritedResources = inject<Record<string, VNode>>(xamlResourceDictionaryKey, {})
const resources = computed(() => {
  const result: Record<string, VNode> = { ...inheritedResources }
  const visit = (nodes: VNode[]) => { for (const node of flatten(nodes)) { if (nameOf(node) === 'ResourceDictionary') visit(childrenOf(node)); else if (node.props?.['x:Key']) result[String(node.props['x:Key'])] = node } }
  for (const node of propertyNodes('resources')) visit(childrenOf(node))
  return result
})
provide(xamlResourceDictionaryKey, new Proxy({}, { get: (_target, key) => resources.value[String(key)], ownKeys: () => Object.keys(resources.value), getOwnPropertyDescriptor: () => ({ configurable: true, enumerable: true }) }))
const objectProperty = (name: 'ItemTemplate' | 'ItemTemplateSelector' | 'ItemsPanel', property: string) => {
  const source = name in overrides.value ? overrides.value[name] : props[name]
  const key = typeof source === 'string' ? source.match(/^\{(?:StaticResource|ThemeResource)\s+([^}]+)\}$/)?.[1] : undefined
  return key ? resources.value[key] ?? resolveXamlResourceObject(key, instance) : resolve(source) ?? childrenOf(propertyNodes(property)[0] ?? {} as VNode)[0]
}
const revision = ref(0), source = computed(() => value('ItemsSource'))
let detachSource = () => {}
watch(source, collection => {
  detachSource()
  const observable = collection as { addEventListener?: (name: string, handler: () => void) => void; removeEventListener?: (name: string, handler: () => void) => void } | null
  const changed = () => { revision.value += 1 }
  for (const event of ['CollectionChanged', 'VectorChanged']) observable?.addEventListener?.(event, changed)
  detachSource = () => { for (const event of ['CollectionChanged', 'VectorChanged']) observable?.removeEventListener?.(event, changed) }
}, { immediate: true, flush: 'sync' })
onScopeDispose(() => detachSource())
const items = computed<unknown[]>(() => {
  void revision.value
  const collection = source.value as any
  if (collection == null) return directItems.value
  if (Array.isArray(collection)) return collection
  if (typeof collection[Symbol.iterator] === 'function') return Array.from(collection)
  const count = Number(collection.Count ?? collection.Size ?? collection.length ?? 0)
  return Array.from({ length: Number.isFinite(count) ? Math.max(0, count) : 0 }, (_, index) => collection.GetAt?.(index) ?? collection[index])
})
const disabledNodes = (node: VNode): VNode => {
  const type = node.type as { props?: Record<string, unknown> }
  const copy = cloneVNode(node, type?.props?.IsEnabled ? { IsEnabled: false } : {})
  if (Array.isArray(node.children)) copy.children = node.children.map(child => isVNode(child) ? disabledNodes(child) : child)
  else if (node.children && typeof node.children === 'object') copy.children = Object.fromEntries(Object.entries(node.children).map(([key, slot]) => [key, typeof slot === 'function' ? (...args: unknown[]) => (slot as (...args: unknown[]) => VNode[])(...args).map(disabledNodes) : slot])) as VNode['children']
  return copy
}
const ItemOutlet = defineComponent({ props: ['item', 'index'], setup: itemProps => {
  provide(xamlItemContextKey, computed(() => itemProps.item))
  return () => {
    const selector = objectProperty('ItemTemplateSelector', 'itemTemplateSelector') as any
    const template = selector?.SelectTemplate?.(itemProps.item, api) ?? selector?.SelectTemplateCore?.(itemProps.item, api) ?? objectProperty('ItemTemplate', 'itemTemplate')
    if (!template && isVNode(itemProps.item)) return h(Fragment, normalizeXamlNodes([IsEnabled.value ? itemProps.item : disabledNodes(itemProps.item)], instance))
    const disabledTemplate = !IsEnabled.value && isVNode(template) ? (item: unknown) => disabledNodes(xamlTemplateComponent(getVNodeChildren(template), item, instance)) : template
    return h(ContentPresenter, { Content: itemProps.item, ContentTemplate: disabledTemplate, HorizontalContentAlignment: 'Stretch', VerticalContentAlignment: 'Stretch', 'data-index': itemProps.index })
  }
} })
const PanelOutlet = defineComponent({ setup: () => () => {
  const panelDefinition = objectProperty('ItemsPanel', 'itemsPanel')
  const panel = isVNode(panelDefinition) && nameOf(panelDefinition) === 'ItemsPanelTemplate' ? getVNodeChildren(panelDefinition)[0] : isVNode(panelDefinition) ? panelDefinition : undefined
  const children = () => items.value.map((item, index) => h(ItemOutlet, { key: isVNode(item) ? item.key ?? index : index, item, index }))
  return panel ? h(panel.type as any, panel.props, { default: children }) : h(StackPanel, { Orientation: 'Vertical' }, { default: children })
} })
const IsEnabled = computed(() => boolValue(value('IsEnabled'))), IsTabStop = computed(() => boolValue(value('IsTabStop')))
const hostStyle = computed(() => ({ ...frameworkLayoutStyle({ ...props, ...overrides.value }, instance), borderStyle: value('BorderThickness') === '' ? undefined : 'solid' }))
const writable = (name: keyof typeof props) => computed({ get: () => value(name), set: next => { overrides.value = { ...overrides.value, [name]: next }; updateXamlBinding(props[name], next, instance) } })
const api = proxyRefs({ Element: element, Name: computed(() => attrs['data-xaml-ref'] ?? attrs['x:Name'] ?? ''), Items: items, ItemsSource: writable('ItemsSource'), ItemTemplate: writable('ItemTemplate'), ItemTemplateSelector: writable('ItemTemplateSelector'), ItemsPanel: writable('ItemsPanel'), IsEnabled: writable('IsEnabled'), IsTabStop: writable('IsTabStop') })
defineExpose(api)
</script>

<style scoped>
.win-items-control, .win-items-presenter { box-sizing: border-box; min-width: 0; min-height: 0; }
.win-items-presenter { width: 100%; }
</style>
