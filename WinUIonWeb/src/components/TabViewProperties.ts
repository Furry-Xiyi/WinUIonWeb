import { defineComponent, type InjectionKey, type VNode } from 'vue'
import { pivotChildren, pivotNodes, pivotRootAttributes, pivotText, pivotTypeName, renderPivotPresenter } from './PivotProperties'

const property = (owner: string, name: string) => defineComponent({
  name: `${owner}.${name}`, __tabViewPropertyOwner: owner, __tabViewProperty: name,
  ...(name === 'Resources' ? { __xamlResourceProperty: 'resources' } : {}), setup: () => () => null
})
export const TabViewTabItems = property('TabView', 'TabItems')
export const TabViewTabItemTemplate = property('TabView', 'TabItemTemplate')
export const TabViewTabStripHeader = property('TabView', 'TabStripHeader')
export const TabViewTabStripHeaderTemplate = property('TabView', 'TabStripHeaderTemplate')
export const TabViewTabStripFooter = property('TabView', 'TabStripFooter')
export const TabViewTabStripFooterTemplate = property('TabView', 'TabStripFooterTemplate')
export const TabViewResources = property('TabView', 'Resources')
export const TabViewKeyboardAccelerators = property('TabView', 'KeyboardAccelerators')
export const TabViewItemHeader = property('TabViewItem', 'Header')
export const TabViewItemHeaderTemplate = property('TabViewItem', 'HeaderTemplate')
export const TabViewItemIconSource = property('TabViewItem', 'IconSource')
export const TabViewItemContent = property('TabViewItem', 'Content')
export const TabViewItemContentTemplate = property('TabViewItem', 'ContentTemplate')
export const TabViewItemContextFlyout = property('TabViewItem', 'ContextFlyout')
export const TabViewItemResources = property('TabViewItem', 'Resources')
export const tabViewProperties = { TabItems: TabViewTabItems, TabItemTemplate: TabViewTabItemTemplate, TabStripHeader: TabViewTabStripHeader, TabStripHeaderTemplate: TabViewTabStripHeaderTemplate, TabStripFooter: TabViewTabStripFooter, TabStripFooterTemplate: TabViewTabStripFooterTemplate, Resources: TabViewResources, KeyboardAccelerators: TabViewKeyboardAccelerators }
export const tabViewItemProperties = { Header: TabViewItemHeader, HeaderTemplate: TabViewItemHeaderTemplate, IconSource: TabViewItemIconSource, Content: TabViewItemContent, ContentTemplate: TabViewItemContentTemplate, ContextFlyout: TabViewItemContextFlyout, Resources: TabViewItemResources }
export const getTabViewProperty = (node: VNode, owner: string): string | undefined => {
  const marker = node.type as { __tabViewPropertyOwner?: string; __tabViewProperty?: string }
  return marker?.__tabViewPropertyOwner === owner ? marker.__tabViewProperty : undefined
}
export const tabViewPropertyChildren = (nodes: VNode[], owner: string, name: string): VNode[] => {
  const node = nodes.find(node => getTabViewProperty(node, owner) === name)
  return node ? pivotChildren(node) : []
}
export { pivotChildren as tabViewChildren, pivotNodes as tabViewNodes, pivotRootAttributes as tabViewRootAttributes, pivotText as tabViewText, pivotTypeName as tabViewTypeName, renderPivotPresenter as renderTabViewPresenter }
export const tabViewItemIdentityKey = Symbol('WinUIonWeb.TabViewItemIdentity')
export const tabViewItemTransferKey = Symbol('WinUIonWeb.TabViewItemTransfer')
export const tabViewItemLiveControlKey = Symbol('WinUIonWeb.TabViewItemLiveControl')
export type TabViewItemOwner = {
  Api: () => Record<string, unknown>; Selected: (key: unknown) => boolean; Enabled: () => boolean;
  Compact: (key: unknown) => boolean; Width: (key: unknown) => number | undefined; OverlayMode: () => string;
  Dragging: (key: unknown) => boolean; Separator: (key: unknown) => boolean; CanDrag: () => boolean;
  ReorderHint: (key: unknown) => number; IsNativeDrag: () => boolean;
  TabIndex: (key: unknown) => number; PanelId: (key: unknown) => string; Select: (key: unknown) => void;
  SetFocused: (key: unknown) => void;
  Close: (key: unknown) => void; KeyDown: (event: KeyboardEvent, key: unknown) => void;
  PointerDown: (event: PointerEvent, key: unknown) => void; DragStart: (event: DragEvent, key: unknown) => void;
  DragEnd: (event: DragEvent) => void; SetElement: (key: unknown, element: HTMLElement | null) => void;
  SetContainer: (key: unknown, container: Record<string, unknown> | null) => void;
  Container: (key: unknown) => Record<string, unknown> | null
}
export const tabViewItemOwnerKey: InjectionKey<TabViewItemOwner> = Symbol('WinUIonWeb.TabViewItemOwner')
export const tabViewItemRecordKey: InjectionKey<unknown> = Symbol('WinUIonWeb.TabViewItemRecord')
