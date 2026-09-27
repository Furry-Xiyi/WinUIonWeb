import { defineComponent, Fragment, h, type VNode } from 'vue'
import { getControlExampleProperty, type ControlExamplePropertyName } from './ControlExampleProperties'

export type CollectionPropertyName = 'items' | 'resources' | 'itemTemplate' | 'itemTemplateSelector' | 'itemsPanel' | 'groupHeaderTemplate' | 'groupStyle' | 'groupStyleHeaderTemplate' | 'layout' | 'itemContainerStyle' | 'itemContainerStyleSelector' | 'itemContainerTransitions'

const property = (name: CollectionPropertyName) => defineComponent({
  name: `Collection.${name[0].toUpperCase()}${name.slice(1)}`,
  __collectionProperty: name,
  setup(_, { slots }) {
    return () => h(Fragment, slots.default?.())
  }
})

export const CollectionItemTemplate = property('itemTemplate')
export const CollectionItemTemplateSelector = property('itemTemplateSelector')
export const CollectionItemsPanel = property('itemsPanel')
export const CollectionItems = property('items')
export const CollectionResources = property('resources')
export const CollectionGroupHeaderTemplate = property('groupHeaderTemplate')
export const CollectionGroupStyle = property('groupStyle')
export const CollectionGroupStyleHeaderTemplate = property('groupStyleHeaderTemplate')
export const CollectionItemContainerStyle = property('itemContainerStyle')
export const CollectionItemContainerStyleSelector = property('itemContainerStyleSelector')
export const CollectionItemContainerTransitions = property('itemContainerTransitions')
// Style and Setter are structural XAML nodes. They intentionally render no
// visual wrapper; collection controls read their dependency-property values
// from the VNode tree and apply them to each generated item container.
export const XamlStyle = defineComponent({
  name: 'Style',
  setup(_, { slots }) { return () => h(Fragment, slots.default?.()) }
})

export const XamlSetter = defineComponent({
  name: 'Setter',
  setup(_, { slots }) { return () => h(Fragment, slots.default?.()) }
})

export const DataTemplate = defineComponent({
  name: 'DataTemplate',
  setup(_, { slots }) { return () => h(Fragment, slots.default?.()) }
})

// DataTemplateSelector is a structural resource container in XAML.  It must
// render as a fragment so collection controls can inspect the keyed templates
// without adding a DOM element to the item tree.  A selector declared with
// named properties (Normal="{StaticResource X}") carries the branch markers
// there; a collection control reads them to resolve the per-item selection.
export const DataTemplateSelector = defineComponent({
  name: 'DataTemplateSelector',
  setup(_, { slots }) { return () => h(Fragment, slots.default?.()) }
})

export const ItemsPanelTemplate = defineComponent({
  name: 'ItemsPanelTemplate',
  setup(_, { slots }) { return () => h(Fragment, slots.default?.()) }
})

// WinUI's ListView samples use ItemsStackPanel inside ItemsPanelTemplate. It
// is a structural panel marker for the web renderer; ListView reads its
// alignment and scrolling properties without adding a wrapper element.
export const ItemsStackPanel = defineComponent({
  name: 'ItemsStackPanel',
  setup(_, { slots }) { return () => h(Fragment, slots.default?.()) }
})

export const ItemsWrapGrid = defineComponent({
  name: 'ItemsWrapGrid',
  setup() { return () => null }
})

export const ControlTemplate = defineComponent({ name: 'ControlTemplate', setup(_, { slots }) { return () => h(Fragment, slots.default?.()) } })
export const ScrollContentPresenter = defineComponent({ name: 'ScrollContentPresenter', setup() { return () => null } })

/**
 * Layouts are XAML object elements, not interchangeable marker nodes. Keep
 * the concrete type on the VNode so collection controls can apply the right
 * panel (and so switching a layout in a Gallery sample is observable).
 */
const layout = (type: string) => defineComponent({
  name: type,
  __layoutType: type,
  setup(_, { slots }) { return () => h(Fragment, slots.default?.()) }
})

export const StackLayout = layout('StackLayout')
export const UniformGridLayout = layout('UniformGridLayout')
export const LinedFlowLayout = layout('LinedFlowLayout')
export const ActivityFeedLayout = layout('ActivityFeedLayout')
export const VariedImageSizeLayout = layout('VariedImageSizeLayout')

/**
 * `ItemsView.Layout` and `ItemsRepeater.Layout` are XAML property elements.
 * The property element itself must carry the collection-property marker so the
 * owning control claims it instead of rendering it as content, while the
 * concrete layout object element stays nested inside it.
 */
export const CollectionLayout = defineComponent({
  name: 'Collection.Layout',
  __collectionProperty: 'layout' as const,
  setup(_, { slots }) { return () => h(Fragment, slots.default?.()) }
})

export const getCollectionProperty = (node: VNode): CollectionPropertyName | undefined => {
  const type = node.type as { __collectionProperty?: CollectionPropertyName } | undefined
  if (type?.__collectionProperty) return type.__collectionProperty
  if (typeof node.type === 'string') {
    if (node.type.endsWith('.Items')) return 'items'
    if (node.type.endsWith('.Resources')) return 'resources'
    if (node.type.endsWith('.ItemTemplate')) return 'itemTemplate'
    if (node.type.endsWith('.ItemTemplateSelector')) return 'itemTemplateSelector'
    if (node.type.endsWith('.ItemsPanel')) return 'itemsPanel'
    if (node.type.endsWith('.GroupHeaderTemplate')) return 'groupHeaderTemplate'
    if (node.type.endsWith('.GroupStyle')) return 'groupStyle'
    if (node.type.endsWith('.HeaderTemplate') && node.type.startsWith('GroupStyle.')) return 'groupStyleHeaderTemplate'
    if (node.type.endsWith('.Layout')) return 'layout'
    if (node.type.endsWith('.ItemContainerStyle')) return 'itemContainerStyle'
    if (node.type.endsWith('.ItemContainerStyleSelector')) return 'itemContainerStyleSelector'
    if (node.type.endsWith('.ItemContainerTransitions')) return 'itemContainerTransitions'
  }
  return undefined
}

export const getXamlProperty = (node: VNode): CollectionPropertyName | ControlExamplePropertyName | undefined =>
  getCollectionProperty(node) ?? getControlExampleProperty(node)

export const getLayoutDescriptor = (nodes: VNode[]) => {
  const node = nodes.find(Boolean)
  if (!node) return undefined
  const type = node.type as { name?: string; __name?: string; __layoutType?: string } | string
  const typeName = typeof type === 'string' ? type : type?.__layoutType || type?.name || type?.__name || ''
  const props = { ...(node.props ?? {}) }
  const descriptor: Record<string, unknown> = { ...props }
  if (typeName) descriptor.Type = typeName
  return descriptor
}

const vnodeChildren = (node: VNode): VNode[] => {
  if (Array.isArray(node.children)) return node.children as VNode[]
  if (node.children && typeof node.children === 'object') {
    const slot = (node.children as { default?: () => unknown }).default
    if (typeof slot === 'function') {
      const result = slot()
      // A slot with a single child returns that VNode rather than an array.
      if (Array.isArray(result)) return result as VNode[]
      return result ? [result as VNode] : []
    }
  }
  return []
}

const unwrapTemplateContainers = (nodes: VNode[]): VNode[] => (Array.isArray(nodes) ? nodes : [nodes]).flatMap((node) => {
  if (!node) return []
  const type = node.type as { name?: string; __name?: string } | string
  const typeName = typeof type === 'string' ? type : type?.name || type?.__name || ''
  if (node.type === Fragment || /^(DataTemplate|ItemsPanelTemplate)$/i.test(typeName)) {
    return unwrapTemplateContainers(vnodeChildren(node))
  }
  return [node]
})

export const getVNodeChildren = (node: VNode): VNode[] =>
  unwrapTemplateContainers(vnodeChildren(node))
