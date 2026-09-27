import { computed, defineComponent, Fragment, getCurrentInstance, h, inject, isVNode, provide, shallowRef, watch, type VNode } from 'vue'
import { xamlResourceDictionaryKey } from './Page.vue'
import { getVNodeChildren } from './CollectionProperties'
import { resolveXamlValue, updateXamlBinding, xamlTemplateComponent } from './xamlRuntime'

const propertyChildren = (node: VNode): VNode[] => {
  if (Array.isArray(node.children)) return node.children as VNode[]
  const children = (node.children as { default?: () => VNode | VNode[] })?.default?.()
  return Array.isArray(children) ? children : children ? [children] : []
}

export const buttonContentProperty = (owner: string, property: 'ContentTemplate' | 'ContentTransitions' | 'Resources') => defineComponent({
  name: `${owner}.${property}`,
  __buttonContentProperty: property,
  setup() { return () => null }
})

export const getButtonContentProperty = (node: VNode) => {
  const type = node.type as { name?: string; __name?: string; __buttonContentProperty?: string } | string
  if (typeof type !== 'string' && type?.__buttonContentProperty) return type.__buttonContentProperty
  const name = typeof type === 'string' ? type : type?.name ?? type?.__name ?? ''
  const match = name.match(/^(?:Button|HyperlinkButton|RepeatButton|ToggleButton|SplitButton|ToggleSplitButton|DropDownButton)\.(ContentTemplate|ContentTransitions|Resources)$/)
  return match?.[1]
}

export const useButtonContent = (props: Record<string, unknown>, readNodes: () => VNode[], instance: ReturnType<typeof getCurrentInstance>) => {
  const inheritedResources = inject<Record<string, VNode>>(xamlResourceDictionaryKey, {})
  const properties = computed(() => {
    const result: Record<string, VNode[]> = { ContentTemplate: [], ContentTransitions: [], Resources: [] }
    const collect = (nodes: VNode[]) => { for (const node of nodes) {
      if (node.type === Fragment && Array.isArray(node.children)) { collect(node.children as VNode[]); continue }
      const property = getButtonContentProperty(node)
      if (property) {
        result[property].push(...propertyChildren(node))
      }
    } }
    collect(readNodes())
    return result
  })
  const resources = computed(() => {
    const collect = (nodes: VNode[]): VNode[] => nodes.flatMap(node => {
      const type = node.type as { name?: string; __name?: string } | string
      const name = typeof type === 'string' ? type : type?.name ?? type?.__name
      return node.type === Fragment || name === 'ResourceDictionary' ? collect(propertyChildren(node)) : [node]
    })
    return Object.fromEntries(collect(properties.value.Resources).filter(node => node.props?.['x:Key']).map(node => [node.props!['x:Key'], node]))
  })
  provide(xamlResourceDictionaryKey, new Proxy(inheritedResources, { get: (source, key: string) => resources.value[key] ?? source[key] }))
  const resolveTemplate = (value: unknown) => {
    const resolved = resolveXamlValue(value, instance)
    if (typeof resolved !== 'string') return resolved
    const key = value?.toString().match(/^\{\s*(?:ThemeResource|StaticResource)\s+([^\s}]+)\s*\}$/)?.[1] ?? resolved.match(/^var\(--([^,)]+)\)$/)?.[1]
    return key ? resources.value[key] ?? inheritedResources[key] ?? resolved : resolved
  }
  const property = (name: 'ContentTemplate' | 'ContentTransitions') => {
    const source = computed(() => resolveTemplate(props[name]))
    const local = shallowRef<unknown>(undefined)
    watch(source, () => { local.value = undefined })
    return computed({ get: () => {
      if (local.value !== undefined) return local.value
      const declared = properties.value[name]
      // ContentTemplate is a single DataTemplate; TransitionCollection is a
      // collection and must retain every declared transition child.
      if (name === 'ContentTransitions') return declared.length ? declared.flatMap(node => {
        const type = node.type as { name?: string; __name?: string } | string
        const typeName = typeof type === 'string' ? type : type?.name ?? type?.__name
        return typeName === 'TransitionCollection' ? propertyChildren(node) : [node]
      }) : source.value
      return declared[0] ?? source.value
    },
      set: value => { local.value = value; updateXamlBinding(props[name], value, instance) } })
  }
  const ContentTemplate = property('ContentTemplate')
  const ContentTransitions = property('ContentTransitions')
  const renderTemplate = (value: unknown) => {
    const template = ContentTemplate.value
    if (isVNode(template)) {
      const type = template.type as { name?: string; __name?: string }
      return xamlTemplateComponent((type?.name ?? type?.__name) === 'DataTemplate' ? getVNodeChildren(template) : [template], value, instance)
    }
    if (typeof template === 'function') return template(value)
    if (template && typeof template === 'object' && ('render' in template || 'setup' in template)) return h(template as any, { Content: value })
    return null
  }
  return { ContentTemplate, ContentTransitions, renderTemplate }
}
