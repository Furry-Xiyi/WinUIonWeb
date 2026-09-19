<script lang="ts">
import { defineComponent, Fragment, h, provide, shallowReactive, type VNode } from 'vue'

/**
 * A small XAML Page host.  Its only job is to make page-level resources
 * available to descendants while keeping `<Page.Resources>` out of the
 * visual tree, just as WinUI's Page does.
 */
export const xamlResourceDictionaryKey = Symbol('WinUIonWeb.xamlResourceDictionary')

const PageResources = defineComponent({
  name: 'Page.Resources',
  __xamlResourceProperty: 'resources',
  setup() {
    return () => null
  }
})

const vnodeChildren = (node: VNode): VNode[] => {
  if (Array.isArray(node.children)) return node.children as VNode[]
  if (node.children && typeof node.children === 'object') {
    const slot = (node.children as { default?: () => VNode[] }).default
    return typeof slot === 'function' ? slot() : []
  }
  return []
}

const isResourceProperty = (node: VNode) =>
  Boolean((node.type as { __xamlResourceProperty?: string } | undefined)?.__xamlResourceProperty)

const resourceKey = (node: VNode) => {
  const props = node.props as Record<string, unknown> | null
  const value = props?.['x:Key'] ?? props?.['x:key'] ?? props?.Key ?? props?.key
  return typeof value === 'string' && value.trim() ? value.trim() : ''
}

const collectResources = (nodes: VNode[], dictionary: Record<string, VNode>) => {
  for (const node of nodes) {
    if (!node || typeof node !== 'object') continue
    if (node.type === Fragment) {
      collectResources(vnodeChildren(node), dictionary)
      continue
    }
    const key = resourceKey(node)
    if (key) dictionary[key] = node
  }
}

export default defineComponent({
  name: 'Page',
  Resources: PageResources,
  setup(_, { slots }) {
    const resources = shallowReactive<Record<string, VNode>>({})
    provide(xamlResourceDictionaryKey, resources)

    return () => {
      const children = slots.default?.() ?? []
      const nextResources: Record<string, VNode> = {}
      for (const node of children) {
        if (!node || typeof node !== 'object' || !isResourceProperty(node as VNode)) continue
        collectResources(vnodeChildren(node as VNode), nextResources)
      }
      for (const key of Object.keys(resources)) {
        if (!(key in nextResources)) delete resources[key]
      }
      Object.assign(resources, nextResources)
      return h(Fragment, children.filter((node) => !(node && typeof node === 'object' && isResourceProperty(node as VNode))))
    }
  }
})
</script>
