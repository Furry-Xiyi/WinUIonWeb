import { defineComponent, Fragment, getCurrentInstance, inject, type VNode, type VNodeChild } from 'vue'

export const navigationViewItemRendererKey = Symbol.for('winui.navigationViewItemRenderer')
const itemRendererSetup = () => {
  const instance = getCurrentInstance()
  const render = inject<((node: VNode) => VNodeChild) | null>(navigationViewItemRendererKey, null)
  return () => render && instance ? render(instance.vnode) : null
}

export type NavigationViewPropertyName =
  | 'menuItems' | 'menuItemsSource' | 'footerMenuItems' | 'footerMenuItemsSource'
  | 'infoBadge' | 'icon' | 'content' | 'header' | 'headerTemplate'
  | 'paneHeader' | 'paneFooter' | 'paneCustomContent' | 'autoSuggestBox' | 'contentOverlay'
  | 'menuItemTemplate' | 'menuItemTemplateSelector' | 'menuItemContainerStyle'
  | 'menuItemContainerStyleSelector' | 'paneToggleButtonStyle' | 'itemTemplate'

const property = (name: NavigationViewPropertyName, owner: string, member: string) => defineComponent({
  name: `${owner}.${member}`,
  __navigationProperty: name,
  setup() { return () => null }
})

export const NavigationViewMenuItems = property('menuItems', 'NavigationView', 'MenuItems')
export const NavigationViewFooterMenuItems = property('footerMenuItems', 'NavigationView', 'FooterMenuItems')
export const NavigationViewItemInfoBadge = property('infoBadge', 'NavigationViewItem', 'InfoBadge')
export const NavigationViewItemMenuItems = property('menuItems', 'NavigationViewItem', 'MenuItems')
export const NavigationViewMenuItemsSource = property('menuItemsSource', 'NavigationView', 'MenuItemsSource')
export const NavigationViewFooterMenuItemsSource = property('footerMenuItemsSource', 'NavigationView', 'FooterMenuItemsSource')
export const NavigationViewHeader = property('header', 'NavigationView', 'Header')
export const NavigationViewHeaderTemplate = property('headerTemplate', 'NavigationView', 'HeaderTemplate')
export const NavigationViewContent = property('content', 'NavigationView', 'Content')
export const NavigationViewPaneHeader = property('paneHeader', 'NavigationView', 'PaneHeader')
export const NavigationViewPaneFooter = property('paneFooter', 'NavigationView', 'PaneFooter')
export const NavigationViewPaneCustomContent = property('paneCustomContent', 'NavigationView', 'PaneCustomContent')
export const NavigationViewAutoSuggestBox = property('autoSuggestBox', 'NavigationView', 'AutoSuggestBox')
export const NavigationViewContentOverlay = property('contentOverlay', 'NavigationView', 'ContentOverlay')
export const NavigationViewMenuItemTemplate = property('menuItemTemplate', 'NavigationView', 'MenuItemTemplate')
export const NavigationViewMenuItemTemplateSelector = property('menuItemTemplateSelector', 'NavigationView', 'MenuItemTemplateSelector')
export const NavigationViewMenuItemContainerStyle = property('menuItemContainerStyle', 'NavigationView', 'MenuItemContainerStyle')
export const NavigationViewMenuItemContainerStyleSelector = property('menuItemContainerStyleSelector', 'NavigationView', 'MenuItemContainerStyleSelector')
export const NavigationViewPaneToggleButtonStyle = property('paneToggleButtonStyle', 'NavigationView', 'PaneToggleButtonStyle')
export const NavigationViewItemIcon = property('icon', 'NavigationViewItem', 'Icon')
export const NavigationViewItemContent = property('content', 'NavigationViewItem', 'Content')
export const NavigationViewItemMenuItemsSource = property('menuItemsSource', 'NavigationViewItem', 'MenuItemsSource')
export const MenuItemTemplateSelectorItemTemplate = property('itemTemplate', 'MenuItemTemplateSelector', 'ItemTemplate')
export const MenuItemTemplateSelector = defineComponent({
  name: 'MenuItemTemplateSelector',
  ItemTemplate: MenuItemTemplateSelectorItemTemplate,
  setup() { return () => null }
})

// NavigationView owns the item containers. These XAML object elements carry
// their property values without adding content to the Frame visual tree.
export const NavigationViewItem = defineComponent({
  name: 'NavigationViewItem',
  __navigationItemType: 'Item',
  InfoBadge: NavigationViewItemInfoBadge,
  Icon: NavigationViewItemIcon,
  Content: NavigationViewItemContent,
  MenuItems: NavigationViewItemMenuItems,
  MenuItemsSource: NavigationViewItemMenuItemsSource,
  setup: itemRendererSetup
})

export const NavigationViewItemHeader = defineComponent({
  name: 'NavigationViewItemHeader',
  __navigationItemType: 'Header',
  setup: itemRendererSetup
})

export const NavigationViewItemSeparator = defineComponent({
  name: 'NavigationViewItemSeparator',
  __navigationItemType: 'Separator',
  setup: itemRendererSetup
})

export const getNavigationViewProperty = (node: VNode): NavigationViewPropertyName | undefined => {
  const type = node.type as { __navigationProperty?: NavigationViewPropertyName } | undefined
  if (type?.__navigationProperty) return type.__navigationProperty
  if (typeof node.type === 'string') {
    const match = node.type.match(/^(NavigationView|NavigationViewItem|MenuItemTemplateSelector)\.([A-Z][A-Za-z]+)$/)
    if (match) {
      const member = match[2]!
      const propertyName = `${member[0]!.toLowerCase()}${member.slice(1)}` as NavigationViewPropertyName
      if (navigationProperties.has(propertyName)) return propertyName
    }
  }
  return undefined
}

const navigationProperties = new Set<NavigationViewPropertyName>([
  'menuItems', 'menuItemsSource', 'footerMenuItems', 'footerMenuItemsSource', 'infoBadge', 'icon',
  'content', 'header', 'headerTemplate', 'paneHeader', 'paneFooter', 'paneCustomContent',
  'autoSuggestBox', 'contentOverlay', 'menuItemTemplate', 'menuItemTemplateSelector',
  'menuItemContainerStyle', 'menuItemContainerStyleSelector', 'paneToggleButtonStyle', 'itemTemplate'
])

export const navigationVNodeChildren = (node: VNode): VNode[] => {
  const children = Array.isArray(node.children)
    ? node.children as VNode[]
    : (node.children as { default?: () => VNode[] } | null)?.default?.() ?? []
  return (Array.isArray(children) ? children : [children]).flatMap(child =>
    child?.type === Fragment ? navigationVNodeChildren(child) : child ? [child] : [])
}

export const navigationItemType = (node: VNode): string => {
  const type = node.type as { name?: string; __name?: string; __navigationItemType?: string } | string
  if (typeof type !== 'string' && type?.__navigationItemType) return type.__navigationItemType
  const name = typeof type === 'string' ? type : type?.name ?? type?.__name
  if (name === 'NavigationViewItem') return 'Item'
  if (name === 'NavigationViewItemHeader') return 'Header'
  if (name === 'NavigationViewItemSeparator') return 'Separator'
  return ''
}
