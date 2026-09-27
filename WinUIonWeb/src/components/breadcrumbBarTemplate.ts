import { defineComponent, type VNode } from 'vue'
import { cloneXamlVNodeWithDefaults } from './xamlRuntime'

// Generated containers obtain private layout state from their owner. No
// additional public item states or compatibility props are exposed.
export const breadcrumbBarItemContextKey = Symbol('WinUI.BreadcrumbBarItemContext')
export const ContentTemplate = defineComponent({
  name: 'BreadcrumbBarItem.ContentTemplate',
  __breadcrumbBarItemProperty: 'ContentTemplate',
  setup() { return () => null }
})

/**
 * WinUI text font properties inherit from ContentPresenter. The web TextBlock
 * supplies default CSS fonts, so let template TextBlocks opt into inheritance
 * only where the author has supplied neither a font property nor a Style.
 * An explicit Style retains its own font setters and explicit properties win.
 */
export const inheritBreadcrumbTextFonts = (nodes: VNode[]): VNode[] => nodes.map((node) => {
  if (!node || typeof node !== 'object') return node
  const type = node.type as { name?: string; __name?: string; __file?: string } | string
  const name = typeof type === 'string' ? type : type?.name || type?.__name || type?.__file?.split(/[\\/]/).pop()?.replace(/\.vue$/, '')
  const defaults: Record<string, unknown> = {}
  if (name === 'TextBlock' && !('Style' in (node.props ?? {}))) {
    for (const property of ['FontFamily', 'FontSize', 'FontWeight']) {
      // A normalized but unresolved binding still owns its property; do not
      // replace it with an inherited default before materialization.
      if (!(property in (node.props ?? {}))) defaults[property] = 'inherit'
    }
    // TextBlock treats any FontSize prop as an explicit local font and changes
    // its CSS line-height to normal. An inherited font must retain the
    // template presenter's LineHeight=20 unless the author specified bounds.
    if (defaults.FontSize && !('LineHeight' in (node.props ?? {})) && !('TextLineBounds' in (node.props ?? {}))) defaults.LineHeight = 'inherit'
  }
  const clone = cloneXamlVNodeWithDefaults(node, defaults)
  if (Array.isArray(node.children)) clone.children = inheritBreadcrumbTextFonts(node.children as VNode[])
  else if (node.children && typeof node.children === 'object') {
    const children = { ...(node.children as Record<string, unknown>) }
    for (const [name, slot] of Object.entries(children)) {
      if (typeof slot !== 'function') continue
      children[name] = (...args: unknown[]) => {
        const result = slot(...args)
        return inheritBreadcrumbTextFonts(Array.isArray(result) ? result : result ? [result] : [])
      }
    }
    clone.children = children
  }
  return clone
})
