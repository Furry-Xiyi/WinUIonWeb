import { Fragment, type VNode } from 'vue'
import { cloneXamlVNodeWithDefaults } from './xamlRuntime'

const childrenOf = (node: VNode): VNode[] => Array.isArray(node.children)
  ? node.children as VNode[]
  : (node.children as { default?: () => VNode[] } | null)?.default?.() ?? []

export const layoutResourceChildren = (nodes: VNode[], marker: string): VNode[] => {
  const styles: VNode[] = []
  const children: VNode[] = []
  const collect = (entries: VNode[]) => {
    for (const node of entries) {
      if (node.type === Fragment) collect(childrenOf(node))
      else if ((node.type as Record<string, unknown>)?.[marker]) styles.push(...childrenOf(node))
      else children.push(node)
    }
  }
  collect(nodes)
  return children.map((child) => {
    const type = child.type as { name?: string; __name?: string }
    const name = type.name ?? type.__name
    const defaults: Record<string, unknown> = {}
    for (const style of styles) {
      if (style.props?.['x:Key'] || style.props?.TargetType !== name) continue
      for (const setter of childrenOf(style)) {
        const property = setter.props?.Property
        if (typeof property === 'string') defaults[property] = setter.props?.Value
      }
    }
    return Object.keys(defaults).length ? cloneXamlVNodeWithDefaults(child, defaults) : child
  })
}
