<script lang="ts">
import { computed, defineComponent, Fragment, getCurrentInstance, h, inject, onBeforeUnmount, provide, shallowReactive, shallowRef, unref, type ShallowRef, type VNode } from 'vue'
import type { XamlResourceFactoryContext } from './UICommandProperties'
import { normalizeXamlNodes, resolveXamlValue, xamlNameScopeKey } from './xamlRuntime'
import { primitiveResourceScope, primitiveResourceStyles, xamlPrimitiveResourceKey } from './xamlPrimitives'
import { collectXamlResources, useXamlBrushResources, xamlResourceKey, xamlResourceNodesEqual } from './xamlBrushResources'
import { xamlThemeKey } from './brushCore'
import { frameworkLayoutStyle } from './frameworkLayout'

/**
 * Page publishes resources and RequestedTheme to its content. Explicit
 * framework-element attributes create the content host that arranges children.
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
const pageHostAttributes = new Set(['class', 'style', 'RequestedTheme', 'Width', 'Height', 'MinWidth', 'MinHeight', 'MaxWidth', 'MaxHeight', 'Margin', 'Padding', 'HorizontalAlignment', 'VerticalAlignment', 'Background', 'BorderBrush', 'BorderThickness', 'CornerRadius', 'Visibility', 'IsHitTestVisible', 'Opacity'])

export default defineComponent({
  name: 'Page',
  inheritAttrs: false,
  Resources: PageResources,
  setup(_, { slots, attrs }) {
    const instance = getCurrentInstance()
    const inheritedTheme = inject(xamlThemeKey, null) ?? inject('winuiTheme', null)
    const requestedTheme = computed(() => resolveXamlValue(attrs.RequestedTheme, instance))
    const actualTheme = computed(() => {
      const value = requestedTheme.value
      if (value === 'Light' || value === 'Dark') return value
      return unref(inheritedTheme)
    })
    provide(xamlThemeKey, actualTheme)
    // Resource declarations are rebuilt from the slot tree during render. A
    // reactive dictionary would schedule Page again while that render is
    // still mutating it, which is the source of the recursive-update loop in
    // resource-heavy Gallery pages. Brush values remain reactive through
    // useXamlBrushResources; the declaration map itself is structural.
    const resources: Record<string, VNode> = {}
    const inheritedPrimitiveResources = inject(xamlPrimitiveResourceKey, null)
    const primitives = primitiveResourceScope(() => slots.default?.() ?? [], inheritedPrimitiveResources)
    const localPrimitives = primitiveResourceScope(() => slots.default?.() ?? [])
    provide(xamlPrimitiveResourceKey, primitives)
    // The owning page's code-behind and its visual Page must share x:Name
    // instances. A second registry here disconnects Click handlers from the
    // controls mounted by the Page's child templates.
    const names = inject<Record<string, unknown> | null>(xamlNameScopeKey, null)
      ?? shallowReactive<Record<string, unknown>>({})
    const brushResources = useXamlBrushResources(instance, names)
    const objectResources = new Map<string, {
      node: ShallowRef<VNode>; value: unknown; dispose: () => void;
      type: unknown; factory: unknown;
    }>()
    const unpublish = (key: string, resource: { node: ShallowRef<VNode>; value: unknown }) => {
      const node = resource.node.value
      const theme = node.props?.__xamlResourceTheme
      const name = xamlResourceKey(node)
      if (theme) {
        if (names[name] === resource.value) delete names[name]
      } else {
        if (names[key] === resource.value) delete names[key]
      }
    }
    onBeforeUnmount(() => {
      objectResources.forEach((resource, key) => {
        resource.dispose()
        unpublish(key, resource)
      })
      objectResources.clear()
    })
    provide(xamlResourceDictionaryKey, resources)
    provide(xamlNameScopeKey, names)

    return () => {
      const children = slots.default?.() ?? []
      const nextResources: Record<string, VNode> = {}
      for (const node of children) {
        if (!node || typeof node !== 'object' || !isResourceProperty(node as VNode)) continue
        collectXamlResources(vnodeChildren(node as VNode), nextResources)
      }
      for (const key of Object.keys(resources)) {
        if (!(key in nextResources)) delete resources[key]
      }
      for (const [key, node] of Object.entries(nextResources)) {
        if (!xamlResourceNodesEqual(resources[key], node)) resources[key] = node
      }
      for (const node of Object.values(nextResources)) {
        if (node.props?.__xamlResourceTheme === 'Default') {
          const key = xamlResourceKey(node)
          if (!xamlResourceNodesEqual(resources[key], node)) resources[key] = node
        }
      }
      brushResources.sync(nextResources)
      for (const [key, node] of Object.entries(nextResources)) {
        if ((node.type as { __xamlBrush?: boolean; __xamlDependencyObject?: boolean }).__xamlBrush
          || (node.type as { __xamlDependencyObject?: boolean }).__xamlDependencyObject) {
          const previous = objectResources.get(key)
          if (previous) {
            previous.dispose()
            unpublish(key, previous)
            objectResources.delete(key)
          }
          continue
        }
        const factory = (node.type as { __createXamlResource?: (read: (name: string) => unknown, context: XamlResourceFactoryContext) => unknown }).__createXamlResource
        let resource = objectResources.get(key)
        // A resource key can be reused while a page is still mounted (for
        // example when a template switches from XamlUICommand to a Style).
        // Do not keep the old object, watcher, or namescope entry attached to
        // the new declaration.
        if (resource && (resource.type !== node.type || resource.factory !== factory)) {
          resource.dispose()
          unpublish(key, resource)
          objectResources.delete(key)
          resource = undefined
        }
        if (!factory) continue
        if (!resource) {
          const source = shallowRef(node)
          const disposers: (() => void)[] = []
          resource = { type: node.type, factory, node: source, value: factory(name => resolveXamlValue(source.value.props?.[name], instance), {
            instance, Node: () => source.value, Dispose: callback => disposers.push(callback)
          }), dispose: () => disposers.forEach(dispose => dispose()) }
          objectResources.set(key, resource)
        }
        if (!xamlResourceNodesEqual(resource.node.value, node)) resource.node.value = node
        const theme = node.props?.__xamlResourceTheme
        const name = xamlResourceKey(node)
        if (theme) {
          if (theme === 'Default' && names[name] !== resource.value) names[name] = resource.value
        } else {
          if (names[key] !== resource.value) names[key] = resource.value
        }
      }
      for (const key of objectResources.keys()) {
        if (!(key in nextResources)) {
          const resource = objectResources.get(key)
          resource?.dispose()
          if (resource) unpublish(key, resource)
          objectResources.delete(key)
        }
      }
      const mountedResources = Object.values(nextResources).filter(node =>
        ['CommandBarFlyout', 'MenuFlyout'].includes((node.type as { name?: string }).name ?? ''))
      const content = [
        ...normalizeXamlNodes(mountedResources, instance),
        ...normalizeXamlNodes(children.filter((node) => !(node && typeof node === 'object' && isResourceProperty(node as VNode))) as VNode[], instance)
      ]
      const resourceStyles = primitiveResourceStyles(localPrimitives.value)
      const hostAttrs = Object.fromEntries(Object.entries(attrs).filter(([name]) => name !== 'RequestedTheme'))
      // A themed or sized Page is a real content host, so its child alignment
      // is measured against the Page rather than the surrounding document.
      const hasPageAttributes = Object.keys(attrs).some(name => pageHostAttributes.has(name))
      const needsHost = hasPageAttributes || Object.keys(resourceStyles).length > 0
      return needsHost ? h('div', {
        ...hostAttrs,
        class: ['win-page', attrs.class, requestedTheme.value === 'Light' ? 'win-theme-scope theme-light' : requestedTheme.value === 'Dark' ? 'win-theme-scope theme-dark' : undefined],
        style: [{ ...(hasPageAttributes ? { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)' } : {}), minWidth: '0', minHeight: '0', maxWidth: '100%', ...resourceStyles, ...frameworkLayoutStyle(attrs, instance) }, attrs.style]
      }, content) : h(Fragment, content)
    }
  }
})
</script>
