import { Comment, defineComponent, Fragment, h, isVNode, Text, type ComponentInternalInstance, type InjectionKey, type VNode } from 'vue'
import { normalizeXamlNodes, resolveXamlResourceObject, resolveXamlValue, xamlTemplateComponent } from './xamlRuntime'
import { xamlResourceDictionaryKey } from './Page.vue'

export type PivotPropertyName = 'items' | 'itemTemplate' | 'itemsPanel' | 'title' | 'titleTemplate' | 'headerTemplate' | 'leftHeader' | 'leftHeaderTemplate' | 'rightHeader' | 'rightHeaderTemplate'
export type PivotItemPropertyName = 'header' | 'content' | 'contentTemplate'
const property = (owner: 'Pivot' | 'PivotItem', name: string) => defineComponent({ name: `${owner}.${name[0]!.toUpperCase()}${name.slice(1)}`, __pivotPropertyOwner: owner, __pivotProperty: name, setup: () => () => null })
export const PivotItems = property('Pivot', 'items')
export const PivotItemTemplate = property('Pivot', 'itemTemplate')
export const PivotItemsPanel = property('Pivot', 'itemsPanel')
export const PivotTitle = property('Pivot', 'title')
export const PivotTitleTemplate = property('Pivot', 'titleTemplate')
export const PivotHeaderTemplate = property('Pivot', 'headerTemplate')
export const PivotLeftHeader = property('Pivot', 'leftHeader')
export const PivotLeftHeaderTemplate = property('Pivot', 'leftHeaderTemplate')
export const PivotRightHeader = property('Pivot', 'rightHeader')
export const PivotRightHeaderTemplate = property('Pivot', 'rightHeaderTemplate')
export const PivotItemHeader = property('PivotItem', 'header')
export const PivotItemContent = property('PivotItem', 'content')
export const PivotItemContentTemplate = property('PivotItem', 'contentTemplate')
export const pivotProperties = { Items: PivotItems, ItemTemplate: PivotItemTemplate, ItemsPanel: PivotItemsPanel, Title: PivotTitle, TitleTemplate: PivotTitleTemplate, HeaderTemplate: PivotHeaderTemplate, LeftHeader: PivotLeftHeader, LeftHeaderTemplate: PivotLeftHeaderTemplate, RightHeader: PivotRightHeader, RightHeaderTemplate: PivotRightHeaderTemplate }
export const pivotItemProperties = { Header: PivotItemHeader, Content: PivotItemContent, ContentTemplate: PivotItemContentTemplate }
export const pivotTypeName = (node: VNode): string => typeof node.type === 'string' ? node.type : (node.type as { name?: string; __name?: string }).name ?? (node.type as { __name?: string }).__name ?? ''
export const pivotNodes = (nodes: VNode[]): VNode[] => nodes.flatMap(node => { if (node.type === Comment || (node.type === Text && !String(node.children ?? '').trim())) return []; if (node.type === Fragment && Array.isArray(node.children)) return pivotNodes(node.children as VNode[]); return [node] })
export const pivotChildren = (node: VNode): VNode[] => { if (Array.isArray(node.children)) return pivotNodes(node.children as VNode[]); const children = node.children as { default?: () => VNode[] } | null; return pivotNodes(children?.default?.() ?? []) }
export const getPivotProperty = (node: VNode, owner: 'Pivot' | 'PivotItem'): string | undefined => { const type = node.type as { __pivotPropertyOwner?: string; __pivotProperty?: string }; return type?.__pivotPropertyOwner === owner ? type.__pivotProperty : undefined }
export const pivotPropertyChildren = (nodes: VNode[], owner: 'Pivot' | 'PivotItem', name: string): VNode[] => { const node = nodes.find(node => getPivotProperty(node, owner) === name); return node ? pivotChildren(node) : [] }
export const pivotText = (value: unknown): string => typeof value === 'string' || typeof value === 'number' ? String(value) : ''
export const pivotTemplate = (value: unknown, instance: ComponentInternalInstance | null): unknown => {
  const resource = typeof value === 'string' ? value.match(/^\{(?:StaticResource|ThemeResource)\s+([^}]+)\}$/)?.[1] : undefined
  if (!resource) return resolveXamlValue(value, instance)
  const resources = (instance as unknown as { provides?: Record<symbol, unknown> } | null)?.provides?.[xamlResourceDictionaryKey] as Record<string, unknown> | undefined
  return resources?.[resource.trim()] ?? resolveXamlResourceObject(resource.trim(), instance)
}
export const renderPivotContent = (content: unknown, template: unknown, nodes: VNode[], instance: ComponentInternalInstance | null): VNode | VNode[] | string | null => { const resolvedTemplate = pivotTemplate(template, instance); const templateNodes = nodes.length ? nodes : isVNode(resolvedTemplate) ? [resolvedTemplate] : Array.isArray(resolvedTemplate) ? resolvedTemplate.filter(isVNode) : []; if (templateNodes.length) return xamlTemplateComponent(templateNodes.flatMap(node => pivotTypeName(node) === 'DataTemplate' ? pivotChildren(node) : [node]), content, instance); if (typeof resolvedTemplate === 'object' && resolvedTemplate !== null || typeof resolvedTemplate === 'function') return h(resolvedTemplate as Parameters<typeof h>[0], { Content: content, DataContext: content }); if (isVNode(content)) return normalizeXamlNodes([content], instance); return pivotText(content) || null }
export const renderPivotPresenter = (content: unknown, contentNodes: VNode[], template: unknown, templateNodes: VNode[], instance: ComponentInternalInstance | null) => {
  if (!contentNodes.length) return renderPivotContent(content, template, templateNodes, instance)
  if (!template && !templateNodes.length) return h(Fragment, normalizeXamlNodes(contentNodes, instance))
  return renderPivotContent(contentNodes.length === 1 ? contentNodes[0] : h(Fragment, contentNodes), template, templateNodes, instance)
}
export const pivotRootAttributes = (attrs: Record<string, unknown>, instance: ComponentInternalInstance | null) => {
  const result = Object.fromEntries(Object.entries(attrs).filter(([name]) => !['class', 'style'].includes(name) && (!/^[A-Z]|^x:/.test(name) || /^[A-Z]\w*\./.test(name))))
  if (attrs['AutomationProperties.Name']) result['aria-label'] = resolveXamlValue(attrs['AutomationProperties.Name'], instance)
  if (attrs['AutomationProperties.HeadingLevel']) { result.role = 'heading'; result['aria-level'] = Number(String(resolveXamlValue(attrs['AutomationProperties.HeadingLevel'], instance)).replace('Level', '')) }
  return result
}
export type PivotItemContext = { isVisible: (key: unknown) => boolean; isLoaded: (key: unknown) => boolean; isEnabled: () => boolean; select: (key: unknown) => void; setProperty: (key: unknown, name: string, value: unknown) => void }
export const pivotItemContextKey: InjectionKey<PivotItemContext> = Symbol('WinUIonWeb.PivotItem')
/** Identity is shared by the public control, Vue ref wrapper, and XAML namescope wrapper. */
export const pivotItemIdentityKey = Symbol('WinUIonWeb.PivotItemIdentity')
