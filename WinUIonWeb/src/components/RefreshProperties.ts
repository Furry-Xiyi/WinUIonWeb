import { Comment, defineComponent, Fragment, h, Text, type VNode } from 'vue'

// XAML property elements used by the PullToRefresh controls:
//
//   <RefreshContainer.Visualizer> / <RefreshContainer.Content>
//   <RefreshVisualizer.Content>
//
// RefreshContainer is a ContentControl, so a bare child is its Content, and the
// Visualizer is always an explicit property element. RefreshVisualizer is a
// Control whose Content holds the progress indicator. Each marker declares its
// role on the component type; the owning control collects the marker's children
// from its default slot and renders them through the matching outlet, so the
// property element never reaches the DOM itself.

export type RefreshContainerPropertyName = 'visualizer' | 'content'
export type RefreshVisualizerPropertyName = 'content'

const containerProperty = (name: RefreshContainerPropertyName) => defineComponent({
  name: `RefreshContainer.${name[0].toUpperCase()}${name.slice(1)}`,
  __refreshContainerProperty: name,
  setup(_, { slots }) {
    return () => h(Fragment, slots.default?.())
  }
})

const visualizerProperty = (name: RefreshVisualizerPropertyName) => defineComponent({
  name: `RefreshVisualizer.${name[0].toUpperCase()}${name.slice(1)}`,
  __refreshVisualizerProperty: name,
  setup(_, { slots }) {
    return () => h(Fragment, slots.default?.())
  }
})

export const RefreshContainerVisualizer = containerProperty('visualizer')
export const RefreshContainerContent = containerProperty('content')
export const RefreshVisualizerContent = visualizerProperty('content')

/** Property elements and content may be wrapped in compiler fragments. */
export const refreshNodes = (nodes: VNode[]): VNode[] => nodes.flatMap(node => {
  if (node.type === Comment || (node.type === Text && !String(node.children ?? '').trim())) return []
  if (node.type === Fragment && Array.isArray(node.children)) return refreshNodes(node.children as VNode[])
  return [node]
})

export const refreshChildren = (node: VNode): VNode[] => {
  if (Array.isArray(node.children)) return refreshNodes(node.children as VNode[])
  const children = node.children as { default?: () => VNode[] } | null
  return refreshNodes(children?.default?.() ?? [])
}

export const getRefreshContainerProperty = (node: VNode): RefreshContainerPropertyName | undefined => {
  const type = node.type as { __refreshContainerProperty?: RefreshContainerPropertyName } | undefined
  return type?.__refreshContainerProperty
}

export const getRefreshVisualizerProperty = (node: VNode): RefreshVisualizerPropertyName | undefined => {
  const type = node.type as { __refreshVisualizerProperty?: RefreshVisualizerPropertyName } | undefined
  return type?.__refreshVisualizerProperty
}

export const refreshContainerProperties = {
  Visualizer: RefreshContainerVisualizer,
  Content: RefreshContainerContent
}

export const refreshVisualizerProperties = {
  Content: RefreshVisualizerContent
}
