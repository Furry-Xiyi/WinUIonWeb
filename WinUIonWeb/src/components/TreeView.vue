<template>
  <div
    ref="containerRef"
    class="win-tree-view"
    :class="{
      disabled: !isEnabled,
      'pointer-dragging': pointerDragActive,
      'tree-content-transitions': transitionState.content,
      'tree-reorder-transitions': transitionState.reorder,
      'tree-entrance-transitions': transitionState.entrance
    }"
    :style="rootStyle"
    v-acrylic-brush="backgroundStyle"
    role="tree"
    :aria-disabled="!isEnabled"
    :aria-multiselectable="selectionMode === 'Multiple'"
    @dragover="onRootDragOver"
    @drop="onRootDrop">
    <ScrollViewer
      class="win-tree-viewport"
      VerticalScrollMode="{x:Bind ScrollSettings.VerticalScrollMode, Mode=OneWay}"
      VerticalScrollBarVisibility="{x:Bind ScrollSettings.VerticalScrollBarVisibility, Mode=OneWay}"
      HorizontalScrollMode="{x:Bind ScrollSettings.HorizontalScrollMode, Mode=OneWay}"
      HorizontalScrollBarVisibility="{x:Bind ScrollSettings.HorizontalScrollBarVisibility, Mode=OneWay}"
      IsHorizontalRailEnabled="{x:Bind ScrollSettings.IsHorizontalRailEnabled, Mode=OneWay}"
      IsVerticalRailEnabled="{x:Bind ScrollSettings.IsVerticalRailEnabled, Mode=OneWay}"
      IsVerticalScrollChainingEnabled="{x:Bind ScrollSettings.IsVerticalScrollChainingEnabled, Mode=OneWay}"
      IsHorizontalScrollChainingEnabled="{x:Bind ScrollSettings.IsHorizontalScrollChainingEnabled, Mode=OneWay}"
      IsEnabled="{x:Bind ScrollTemplateIsEnabled, Mode=OneWay}"
      ZoomMode="{x:Bind ScrollSettings.ZoomMode, Mode=OneWay}">
      <div
        ref="listRef"
        class="win-tree-content"
        :class="{ 'drag-sinking': isDragging || isExternalDragOver }"
        :style="contentPaddingStyle"
        @dragover="onViewportDragOver"
        @drop="onViewportDrop"
        @dragleave="onViewportDragLeave">
        <div
          v-for="entry in rows"
          :key="entry.node.Key"
          :id="rowId(entry)"
          class="win-tree-item"
          :class="rowClasses(entry)"
          :style="rowStyle(entry)"
          :tabindex="isEnabled && entry.node === activeNode ? 0 : -1"
          :aria-level="entry.depth + 1"
          :aria-posinset="entry.positionInSet"
          :aria-setsize="entry.setSize"
          :aria-expanded="entry.hasChildren ? entry.isExpanded : undefined"
          :aria-selected="selectionMode === 'None' ? undefined : entry.isSelected"
          :aria-checked="selectionMode === 'Multiple' ? checkboxAriaValue(entry) : undefined"
          role="treeitem"
          @focus="onRowFocus(entry)"
          @click="onRowClick($event, entry)"
          @pointerdown="onRowPointerDown($event, entry)"
          @pointermove="onRowPointerMove($event, entry)"
          @pointerup="onRowPointerUp($event)"
          @pointercancel="onRowPointerCancel($event)"
          @pointerleave="onRowPointerLeave($event, entry)"
          @lostpointercapture="onRowLostPointerCapture($event)"
          @keydown="onRowKeyDown($event, entry)"
          :draggable="false"
          @dragstart="onNativeDragStart($event, entry)"
          @dragend="onNativeDragEnd($event)">
          <div
            class="win-tree-presenter"
            :class="{ 'grid-padding-none': selectionMode === 'Multiple' }"
            :style="presenterStyle(entry)">
            <div
              v-if="selectionMode !== 'None' && selectionMode !== 'Multiple'"
              class="win-tree-selection-indicator"
              :class="{ active: entry.isSelected }"
              aria-hidden="true"></div>
            <div
              class="win-tree-multiselect-grid"
              :class="{ 'multi-selected': selectionMode === 'Multiple' && entry.selectionState === 'Selected' }"
              :style="{ paddingInlineStart: `${entry.depth * 16}px` }">
              <div
                v-if="selectionMode === 'Multiple'"
                class="win-tree-multiselect-slot"
                role="checkbox"
                :aria-checked="checkboxAriaValue(entry)"
                @pointerdown.stop
                @click.stop.prevent="onMultiSelectClick(entry)">
                <TreeViewItemScope :Node="entry.node">
                  <CheckBox
                    class="tree-selection-check"
                    IsChecked="{x:Bind IsChecked, Mode=OneWay}"
                    IsThreeState="True"
                    IsTabStop="False"
                    aria-hidden="true" />
                </TreeViewItemScope>
                <span
                  v-if="isPrimaryMultiDragRow(entry)"
                  class="win-tree-drag-count"
                  aria-hidden="true">{{ dragItemCount }}</span>
              </div>
              <div
                class="win-tree-chevron"
                :class="{ 'multi-select': selectionMode === 'Multiple' }"
                :style="{ opacity: entry.hasChildren ? 1 : 0 }"
                @pointerdown.stop="onChevronPointerDown($event, entry)">
                <span
                  class="win-tree-glyph"
                  :class="{ hidden: entry.isExpanded }"
                  :style="glyphStyle(entry)">{{ collapsedGlyph(entry) }}</span>
                <span
                  class="win-tree-glyph"
                  :class="{ hidden: !entry.isExpanded }"
                  :style="glyphStyle(entry)">{{ expandedGlyph(entry) }}</span>
              </div>
              <div class="win-tree-item-content" :style="contentStyle(entry)">
                <component :is="itemComponent(entry)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollViewer>
  </div>
</template>

<script lang="ts">
import {
  CollectionItemContainerStyle,
  CollectionItemContainerStyleSelector,
  CollectionItemContainerTransitions,
  CollectionItemTemplate,
  CollectionItemTemplateSelector
} from './CollectionProperties'

/**
 * `<TreeViewItem>` is a valid DataTemplate root in official XAML. WinUI treats
 * such a template as supplying the container itself, so the element carries the
 * item's Content, ItemsSource, IsExpanded and HasUnrealizedChildren. It renders
 * as a fragment: the TreeView reads these properties from the materialized
 * template and drives the real container visuals.
 */
export const XamlTreeViewItem = defineComponent({
  name: 'TreeViewItem',
  __treeViewItem: true,
  setup(_, { slots }) {
    return () => h(Fragment, slots.default?.())
  }
})

/**
 * `<TreeView.RootNodes>` holds `<TreeViewNode>` elements. Both are structural:
 * the TreeView consumes the declarative node tree instead of rendering it.
 */
export const TreeViewRootNodes = defineComponent({
  name: 'TreeView.RootNodes',
  __treeViewProperty: 'rootNodes',
  setup(_, { slots }) {
    return () => h(Fragment, slots.default?.())
  }
})

export const XamlTreeViewNode = defineComponent({
  name: 'TreeViewNode',
  __treeViewNode: true,
  setup(_, { slots }) {
    return () => h(Fragment, slots.default?.())
  }
})

/** `<TreeViewNode.Children>` holds further `<TreeViewNode>` elements. */
export const TreeViewNodeChildren = defineComponent({
  name: 'TreeViewNode.Children',
  __treeViewProperty: 'children',
  setup(_, { slots }) {
    return () => h(Fragment, slots.default?.())
  }
})

type SharedTreeDrag = {
  owner: symbol
  nodes: unknown[]
  items: unknown[]
  beginTransaction?: () => void
  commitTransaction?: () => void
  rollbackTransaction?: () => void
  detach: (node: unknown) => boolean
  commitSource: () => void
  complete: (dropResult: 'None' | 'Move', newParentItem: unknown) => void
  cleanup: () => void
  completed: boolean
}

let activeNativeTreeDrag: SharedTreeDrag | null = null

type SharedNodeVectorState = {
  owner: symbol
  parent: unknown
  isContentMode: boolean
  normalize: (value: unknown, list: unknown[]) => unknown
  changed: () => void
  replaceAt?: (index: number, value: unknown) => void
  replaceAll?: (values: Iterable<unknown>) => void
  restoreSnapshot?: (values: unknown[]) => void
}

/** Module-wide metadata lets a node vector be rehomed between TreeViews. */
const treeNodeVectorStateKey = Symbol('WinUIonWeb.TreeViewNodeVectorState')

export default {
  ItemTemplate: CollectionItemTemplate,
  ItemTemplateSelector: CollectionItemTemplateSelector,
  ItemContainerStyle: CollectionItemContainerStyle,
  ItemContainerStyleSelector: CollectionItemContainerStyleSelector,
  ItemContainerTransitions: CollectionItemContainerTransitions,
  RootNodes: TreeViewRootNodes
}
</script>

<script setup lang="ts">
import {
  computed,
  defineComponent,
  Fragment,
  getCurrentInstance,
  h,
  inject,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  shallowRef,
  useAttrs,
  useSlots,
  watch
} from 'vue'
import type { CSSProperties, VNode } from 'vue'
import { scrollViewerTemplateBindings } from './scrollViewerTemplateBindings'
import ScrollViewer from './ScrollViewer.vue'
import CheckBox from './CheckBox.vue'
import { getCollectionProperty, getVNodeChildren } from './CollectionProperties'
import { xamlResourceDictionaryKey } from './Page.vue'
import { useAcrylicBrushStyle } from './AcrylicBrush'
import { vAcrylicBrush } from './acrylicBrushVisual'
import {
  materializeXamlVNode,
  resolveXamlHandler,
  resolveXamlValue,
  xamlItemContextKey,
  xamlScopeKey
} from './xamlRuntime'

type TreeNodeSelectionState = 'UnSelected' | 'PartialSelected' | 'Selected'
type TreeViewSelectionMode = 'None' | 'Single' | 'Multiple'
type TreeItem = Record<string, unknown>

// A row namescope supplies the official binding to the existing CheckBox.
// It adds no DOM and owns no checkbox visuals, states or animations.
const TreeViewItemScope = defineComponent({
  name: 'TreeViewItemScope',
  props: { Node: { type: Object, required: true } },
  setup(props, { slots }) {
    provide(xamlScopeKey, {
      IsChecked: computed(() => props.Node.SelectionState === 'Selected'
        ? true : props.Node.SelectionState === 'PartialSelected' ? null : false)
    })
    return () => h(Fragment, slots.default?.())
  }
})

/** The flat vector TreeViewList keeps: one entry per realized node. */
type TreeNode = {
  /** The object supplied by ItemsSource/RootNodes. Its identity is never replaced by display content. */
  SourceItem: unknown
  /** The item exposed by TreeView events and SelectedItems. */
  Item: unknown
  /** TreeViewNode.Content: the ItemsSource item or declared node content. */
  Content: unknown
  /** The value rendered by the ContentPresenter. */
  PresenterContent: unknown
  Children: TreeNode[]
  /** The writable collection mirrored by Children. */
  ChildrenSource: unknown[]
  Parent: TreeNode | null
  IsExpanded: boolean
  HasUnrealizedChildren: boolean
  /** Read-only derived property exposed by the official TreeViewNode API. */
  readonly HasChildren: boolean
  SelectionState: TreeNodeSelectionState
  Depth: number
  IsContentMode: boolean
  /** Stable identity used as the render key: the source item object. */
  Key: PropertyKey
  /** The DataTemplate's binding context for this item. */
  Context: unknown
  /** TreeViewItem values supplied by a container-rooted DataTemplate. */
  ContainerProps: Record<string, unknown>
  /** Template-supplied content nodes, when the DataTemplate declared any. */
  Template: VNode[] | null
}

type TreeRow = {
  index: number
  node: TreeNode
  depth: number
  isExpanded: boolean
  hasChildren: boolean
  selectionState: TreeNodeSelectionState
  isSelected: boolean
  positionInSet: number
  setSize: number
}

const props = withDefaults(defineProps<{
  ItemsSource?: unknown[] | string
  RootNodes?: unknown[] | string
  SelectionMode?: TreeViewSelectionMode | string
  CanDragItems?: boolean | string
  CanReorderItems?: boolean | string
  AllowDrop?: boolean | string
  SelectedItem?: unknown
  SelectedItems?: unknown[] | string
  ItemTemplate?: unknown
  ItemTemplateSelector?: unknown
  ItemContainerStyle?: unknown
  ItemContainerStyleSelector?: unknown
  ItemContainerTransitions?: unknown
  FlowDirection?: string
  IsEnabled?: boolean | string
  HorizontalAlignment?: string
  VerticalAlignment?: string
  HorizontalContentAlignment?: string
  VerticalContentAlignment?: string
  Width?: string | number
  Height?: string | number
  MinWidth?: string | number
  MinHeight?: string | number
  MaxWidth?: string | number
  MaxHeight?: string | number
  Margin?: string | number
  Padding?: string | number
  Background?: string | object
  BorderBrush?: string
  BorderThickness?: string | number
  CornerRadius?: string | number
}>(), {
  ItemsSource: undefined,
  RootNodes: undefined,
  SelectionMode: 'Single',
  CanDragItems: true,
  CanReorderItems: true,
  AllowDrop: true,
  SelectedItem: undefined,
  SelectedItems: undefined,
  ItemTemplate: () => '',
  ItemTemplateSelector: () => '',
  ItemContainerStyle: undefined,
  ItemContainerStyleSelector: undefined,
  ItemContainerTransitions: undefined,
  FlowDirection: 'LeftToRight',
  IsEnabled: true,
  HorizontalAlignment: 'Stretch',
  VerticalAlignment: 'Stretch',
  HorizontalContentAlignment: 'Stretch',
  VerticalContentAlignment: 'Center',
  Width: '',
  Height: '',
  MinWidth: '',
  MinHeight: '',
  MaxWidth: '',
  MaxHeight: '',
  Margin: '',
  Padding: '',
  Background: '',
  BorderBrush: '',
  BorderThickness: '',
  CornerRadius: ''
})

const emit = defineEmits([
  'ItemInvoked',
  'SelectionChanged',
  'Expanding',
  'Collapsed',
  'DragItemsStarting',
  'DragItemsCompleted',
  'DragOver',
  'Drop',
  'update:ItemsSource',
  'update:RootNodes',
  'update:SelectedItem',
  'update:SelectedItems'
])

const slots = useSlots()
const attrs = useAttrs()
const instance = getCurrentInstance()
const inheritedScrollTemplateScope = inject(xamlScopeKey, {});
const ScrollSettings = scrollViewerTemplateBindings(name => attrs[name], instance);
provide(xamlScopeKey, { ...inheritedScrollTemplateScope, ScrollSettings, get ScrollTemplateIsEnabled() { return isEnabled.value } });
const pageResources = inject(xamlResourceDictionaryKey, null)
const containerRef = ref<HTMLElement>()
const listRef = ref<HTMLElement>()

/* ------------------------------------------------------------------ *
 * XAML lengths and Thickness are not CSS values.
 * ------------------------------------------------------------------ */

const cssLength = (value: unknown) => {
  const resolved = resolveXamlValue(value, instance)
  if (resolved === '' || resolved === undefined || resolved === null) return ''
  const text = String(resolved).trim()
  return /^-?\d+(?:\.\d+)?$/.test(text) ? `${Number(text)}px` : text
}

const xamlThickness = (value: unknown) => {
  const resolved = resolveXamlValue(value, instance)
  if (resolved === '' || resolved === undefined || resolved === null) return ''
  const parts = String(resolved).split(',').map((part) => cssLength(part.trim())).filter(Boolean)
  if (parts.length === 1) return parts[0]
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`
  return ''
}

const isEnabled = computed(() => resolveXamlValue(props.IsEnabled, instance) !== false)
const selectionMode = computed<TreeViewSelectionMode>(() => {
  const value = String(resolveXamlValue(props.SelectionMode, instance) ?? 'Single')
  return value === 'None' || value === 'Multiple' ? value : 'Single'
})
// WinUI keeps the visible roots under a hidden origin node. Declare its state
// before any immediate source watcher can build and normalize root nodes.
const rootSelectionState = ref<TreeNodeSelectionState>('UnSelected')
const canDragItems = computed(() => resolveXamlValue(props.CanDragItems, instance) === true && isEnabled.value)
const canReorderItems = computed(() => resolveXamlValue(props.CanReorderItems, instance) === true)
const allowDrop = computed(() => resolveXamlValue(props.AllowDrop, instance) === true)
const direction = computed(() => (resolveXamlValue(props.FlowDirection, instance) === 'RightToLeft' ? 'rtl' : 'ltr'))
const alignment = (value: unknown, axis: 'horizontal' | 'vertical') => {
  const name = String(resolveXamlValue(value, instance) ?? '')
  return axis === 'horizontal'
    ? ({ Left: 'start', Center: 'center', Right: 'end', Stretch: 'stretch' } as Record<string, string>)[name]
    : ({ Top: 'start', Center: 'center', Bottom: 'end', Stretch: 'stretch' } as Record<string, string>)[name]
}

const backgroundStyle = useAcrylicBrushStyle(() => props.Background || undefined, instance)
const rootStyle = computed<CSSProperties>(() => ({
  width: cssLength(props.Width) || undefined,
  height: cssLength(props.Height) || undefined,
  minWidth: cssLength(props.MinWidth) || undefined,
  minHeight: cssLength(props.MinHeight) || undefined,
  maxWidth: cssLength(props.MaxWidth) || undefined,
  maxHeight: cssLength(props.MaxHeight) || undefined,
  margin: xamlThickness(props.Margin) || undefined,
  ...backgroundStyle.value,
  borderColor: resolveXamlValue(props.BorderBrush, instance) as CSSProperties['borderColor'] || undefined,
  borderWidth: xamlThickness(props.BorderThickness) || undefined,
  borderStyle: xamlThickness(props.BorderThickness) ? 'solid' : undefined,
  borderRadius: cssLength(props.CornerRadius) || undefined,
  justifySelf: alignment(props.HorizontalAlignment, 'horizontal') || undefined,
  alignSelf: alignment(props.VerticalAlignment, 'vertical') || undefined,
  direction: direction.value
}))

const contentPaddingStyle = computed<CSSProperties>(() => ({
  padding: xamlThickness(props.Padding) || undefined
}))

/* ------------------------------------------------------------------ *
 * Item template resolution.
 *
 * TreeView.ItemTemplate is a DataTemplate, a DataTemplateSelector resource, or
 * a code-behind selector object. The official DataTemplates wrap the item in a
 * <TreeViewItem> root supplying Content/ItemsSource/IsExpanded; the TreeView
 * reads those values and renders the container itself, exactly as
 * ListViewBase treats a container-rooted ItemTemplate.
 * ------------------------------------------------------------------ */

const slotNodes = shallowRef(slots.default?.() ?? [])

const templateResourceKey = (value: unknown) => {
  if (typeof value !== 'string') return ''
  const marker = value.trim().match(/^\{\s*StaticResource\s+([^\s}]+)\s*\}$/i)
  if (marker) return marker[1]
  return value.trim().match(/^var\(--([^,)]+)\)$/)?.[1] ?? ''
}

/**
 * The resource name a collection property points at. A XAML `{StaticResource K}`
 * marker survives normalization either verbatim or as the CSS variable the
 * runtime materializes it into, and a code-behind binding may pass the bare key.
 */
const resourceNameOf = (value: unknown) => {
  const key = templateResourceKey(value)
  if (key) return key
  const resolved = resolveXamlValue(value, instance)
  if (typeof resolved !== 'string') return ''
  return templateResourceKey(resolved) || resolved.trim()
}

const typeNameOf = (node: unknown) => {
  const type = (node as VNode | undefined)?.type as { name?: string; __name?: string } | string | undefined
  return typeof type === 'string' ? type : type?.name || type?.__name || ''
}

const templateNodeKey = (node: VNode) => {
  const values = node?.props as Record<string, unknown> | undefined
  const key = values?.['x:Key'] ?? values?.['x:key'] ?? values?.Key ?? values?.key
  return typeof key === 'string' ? key : ''
}

const flattenSelectorNodes = (nodes: VNode[]): VNode[] => nodes.flatMap((node) => {
  if (!node) return []
  return node.type === Fragment || /DataTemplateSelector$/i.test(typeNameOf(node))
    ? flattenSelectorNodes(getVNodeChildren(node))
    : [node]
})

const itemTemplateNodes = computed<VNode[]>(() => {
  const bound = resolveXamlValue(props.ItemTemplate, instance)
  const key = templateResourceKey(bound)
  if (key && pageResources?.[key]) return getVNodeChildren(pageResources[key] as VNode)
  for (const node of slotNodes.value) {
    if (getCollectionProperty(node) !== 'itemTemplate') continue
    const templates = flattenSelectorNodes(getVNodeChildren(node))
      .filter((candidate) => /DataTemplate$/i.test(typeNameOf(candidate)))
    if (templates.length) {
      const selected = key ? templates.find((candidate) => templateNodeKey(candidate) === key) : templates[0]
      return getVNodeChildren(selected ?? templates[0])
    }
    return getVNodeChildren(node)
  }
  return []
})

/** The templates a XAML DataTemplateSelector resource names as its branches. */
const selectorBranches = computed(() => {
  const name = resourceNameOf(props.ItemTemplateSelector)
  const resource = name ? pageResources?.[name] : null
  if (!resource) return null
  const values = (resource as VNode).props ?? {}
  const branches: { Name: string; Key: string }[] = []
  for (const [propName, value] of Object.entries(values)) {
    if (/^(x:Key|x:key|Key|key)$/.test(propName)) continue
    const branchKey = resourceNameOf(value)
    if (branchKey) branches.push({ Name: propName, Key: branchKey })
  }
  return branches.length ? branches : null
})

/** The branch a selector declaration picks for an item, per its declared name. */
const selectorBranchFor = (item: unknown) => {
  const branches = selectorBranches.value
  if (!branches) return null
  const value = item as TreeItem | null | undefined
  if (value && typeof value === 'object' && 'Type' in value) {
    const type = String(value.Type)
    const byName = branches.find((branch) => branch.Name.toLowerCase().startsWith(type.toLowerCase()))
    if (byName) return byName
  }
  return branches[0]
}

const templateNodesForKey = (key: string) => {
  const resource = key ? pageResources?.[key] : null
  if (!resource) return null
  const candidate = resource as VNode
  const nodes = /DataTemplate$/i.test(typeNameOf(candidate))
    ? getVNodeChildren(candidate)
    : [candidate]
  return nodes.length ? nodes : null
}

const templateNodesFor = (item: unknown): VNode[] => {
  const boundSelector = resolveXamlValue(props.ItemTemplateSelector, instance)
  if (boundSelector && typeof (boundSelector as { SelectTemplateCore?: unknown }).SelectTemplateCore === 'function') {
    const selected = (boundSelector as { SelectTemplateCore: (value: unknown, container: unknown) => unknown })
      .SelectTemplateCore(item, treeViewApi)
    const key = resourceNameOf(selected)
    if (key) {
      const nodes = templateNodesForKey(key)
      if (nodes) return nodes
    }
  }
  const branch = selectorBranchFor(item)
  if (branch) {
    const nodes = templateNodesForKey(branch.Key)
    if (nodes) return nodes
  }
  return itemTemplateNodes.value
}

const isTreeViewItemNode = (node: unknown) => {
  const declaration = node as VNode | undefined
  return Boolean(declaration?.type && (declaration.type as { __treeViewItem?: boolean }).__treeViewItem)
}

/** The <TreeViewItem> root a DataTemplate may declare, bound to `item`. */
const treeViewItemRoot = (item: unknown) => {
  const nodes = templateNodesFor(item)
  if (!nodes.length) return null
  const materialized = materializeXamlVNode(nodes, item, instance)
  const list = (Array.isArray(materialized) ? materialized : [materialized]) as VNode[]
  return list.find(isTreeViewItemNode) ?? null
}

/* ------------------------------------------------------------------ *
 * Node model
 * ------------------------------------------------------------------ */

const childItemsFrom = (item: unknown): unknown[] => {
  const value = item as TreeItem | null | undefined
  if (value && typeof value === 'object') {
    if (Array.isArray(value.Children)) return value.Children as unknown[]
    if (Array.isArray(value.ItemsSource)) return value.ItemsSource as unknown[]
  }
  return []
}

const contentOf = (item: unknown) => {
  const value = item as TreeItem | null | undefined
  if (value && typeof value === 'object' && 'Content' in value) return resolveXamlValue(value.Content, instance)
  return item
}

/**
 * The DataTemplate's item context. `{x:Bind Name}` inside
 * <DataTemplate x:DataType="local:ExplorerItem"> binds against the source item
 * itself, so a plain data item keeps its own fields and a <TreeViewItem> root
 * additionally supplies Content / ItemsSource / IsExpanded.
 */
const itemContext = (item: unknown) => item

/** WinUI honors an item's own IsExpanded when the template does not set one. */
const declaredExpanded = (item: unknown, root: VNode | null) => {
  const props = (root?.props ?? {}) as Record<string, unknown>
  if (props.IsExpanded !== undefined) return resolveXamlValue(props.IsExpanded, instance) === true
  const source = item as TreeItem | null | undefined
  if (source && typeof source === 'object' && 'IsExpanded' in source) {
    return resolveXamlValue(source.IsExpanded, instance) === true
  }
  return false
}

const declaredFlag = (item: unknown, root: VNode | null, name: string) => {
  const props = (root?.props ?? {}) as Record<string, unknown>
  if (props[name] !== undefined) return resolveXamlValue(props[name], instance) === true
  const source = item as TreeItem | null | undefined
  if (source && typeof source === 'object' && name in source) {
    return resolveXamlValue(source[name], instance) === true
  }
  return false
}

type WinUIVector<T> = T[] & {
  readonly Size: number
  readonly Count: number
  GetAt: (index: number) => T
  SetAt: (index: number, value: T) => void
  InsertAt: (index: number, value: T) => void
  RemoveAt: (index: number) => void
  Append: (value: T) => void
  Add: (value: T) => void
  Insert: (index: number, value: T) => void
  Remove: (value: T) => boolean
  Contains: (value: T) => boolean
  IndexOf: (value: T) => number
  RemoveAtEnd: () => void
  Clear: () => void
  ReplaceAll: (values: Iterable<T>) => void
}

/** Add the projected IVector operations without changing normal Array use. */
const publishVectorSurface = <T>(list: T[]): WinUIVector<T> => {
  if (Object.prototype.hasOwnProperty.call(list, 'Append')) return list as WinUIVector<T>
  Object.defineProperties(list, {
    Size: { configurable: true, enumerable: false, get(this: T[]) { return this.length } },
    Count: { configurable: true, enumerable: false, get(this: T[]) { return this.length } },
    GetAt: { configurable: true, enumerable: false, value(this: T[], index: number) { return this[index] } },
    SetAt: {
      configurable: true,
      enumerable: false,
      value(this: T[], index: number, value: T) {
        const state = (this as unknown as Record<symbol, SharedNodeVectorState>)[treeNodeVectorStateKey]
        if (state?.replaceAt) state.replaceAt(index, value)
        else this.splice(index, 1, value)
      }
    },
    InsertAt: { configurable: true, enumerable: false, value(this: T[], index: number, value: T) { this.splice(index, 0, value) } },
    RemoveAt: { configurable: true, enumerable: false, value(this: T[], index: number) { this.splice(index, 1) } },
    Append: { configurable: true, enumerable: false, value(this: T[], value: T) { this.push(value) } },
    Add: { configurable: true, enumerable: false, value(this: T[], value: T) { this.push(value) } },
    Insert: { configurable: true, enumerable: false, value(this: T[], index: number, value: T) { this.splice(index, 0, value) } },
    Remove: {
      configurable: true,
      enumerable: false,
      value(this: T[], value: T) {
        const index = this.indexOf(value)
        if (index < 0) return false
        this.splice(index, 1)
        return true
      }
    },
    Contains: { configurable: true, enumerable: false, value(this: T[], value: T) { return this.includes(value) } },
    IndexOf: { configurable: true, enumerable: false, value(this: T[], value: T) { return this.indexOf(value) } },
    RemoveAtEnd: { configurable: true, enumerable: false, value(this: T[]) { this.pop() } },
    Clear: { configurable: true, enumerable: false, value(this: T[]) { this.splice(0, this.length) } },
    ReplaceAll: {
      configurable: true,
      enumerable: false,
      value(this: T[], values: Iterable<T>) {
        const state = (this as unknown as Record<symbol, SharedNodeVectorState>)[treeNodeVectorStateKey]
        if (state?.replaceAll) state.replaceAll(values)
        else this.splice(0, this.length, ...values)
      }
    }
  })
  return list as WinUIVector<T>
}

let notifyNodeVectorChanged: (parent: TreeNode | null) => void = () => {}
let suppressNodeVectorNotifications = 0
const pendingNodeVectorParents = new Set<TreeNode | null>()
let nodeVectorNotificationScheduled = false
const queueNodeVectorChanged = (parent: TreeNode | null) => {
  if (suppressNodeVectorNotifications) return
  pendingNodeVectorParents.add(parent)
  if (nodeVectorNotificationScheduled) return
  nodeVectorNotificationScheduled = true
  queueMicrotask(() => {
    nodeVectorNotificationScheduled = false
    const parents = [...pendingNodeVectorParents]
    pendingNodeVectorParents.clear()
    for (const changedParent of parents) notifyNodeVectorChanged(changedParent)
  })
}
const isTreeNode = (value: unknown): value is TreeNode => Boolean(
  value && typeof value === 'object'
  && Array.isArray((value as TreeNode).Children)
  && 'SelectionState' in (value as TreeNode)
  && 'SourceItem' in (value as TreeNode)
)

const vectorStateOf = (list: unknown[]): SharedNodeVectorState | undefined =>
  (list as unknown as Record<symbol, SharedNodeVectorState>)[treeNodeVectorStateKey]

const configureNodeVectorOwner = (
  list: TreeNode[],
  parent: TreeNode | null,
  isContentMode: boolean
) => {
  const state = vectorStateOf(list)
  if (!state) return
  state.owner = treeNodeVectorOwner
  state.parent = parent
  state.isContentMode = isContentMode
  state.changed = () => queueNodeVectorChanged(parent)
  state.normalize = (value, currentList) => {
    const depth = parent ? parent.Depth + 1 : 0
    const contentMode = parent?.IsContentMode ?? rootSource.value.isContentMode ?? isContentMode
    const node = isTreeNode(value) ? value : buildNode(value, parent, depth, contentMode)
    if (isTreeNode(value)) {
      const previousOwner = vectorStateOf(node.Children)?.owner
      for (let cursor = parent; cursor; cursor = cursor.Parent) {
        if (cursor === node) throw new Error('A TreeViewNode cannot be inserted into its own subtree.')
      }
      const previousSiblings = node.Parent ? node.Parent.Children : nodes.value
      const previousIndex = previousSiblings.indexOf(node)
      if (previousIndex >= 0 && previousSiblings !== currentList) {
        previousSiblings.splice(previousIndex, 1)
      } else if (previousIndex >= 0) {
        Array.prototype.splice.call(currentList, previousIndex, 1)
      }
      rehomeNodeVectorOwner(node, contentMode)
      if (previousOwner !== treeNodeVectorOwner || node.IsContentMode !== contentMode) {
        adoptNodeMode(node, contentMode)
      }
    }
    node.Parent = parent
    reindexNode(node, depth)
    reconcileAdoptedSelection(node, parent)
    return node
  }
}

function rehomeNodeVectorOwner(node: TreeNode, isContentMode: boolean) {
  configureNodeVectorOwner(node.Children, node, isContentMode)
  for (const child of node.Children) rehomeNodeVectorOwner(child, isContentMode)
}

/**
 * TreeViewNode.Children and TreeView.RootNodes are observable WinUI vectors.
 * Values appended by an Expanding handler are normalized into full nodes before
 * they enter the visual model, so public collection mutation cannot leave a
 * half-shaped object in the flattened list.
 */
const createNodeVector = (
  initial: TreeNode[],
  parent: TreeNode | null,
  isContentMode: boolean
): WinUIVector<TreeNode> => {
  const list = initial
  const nativePush = Array.prototype.push
  const nativePop = Array.prototype.pop
  const nativeShift = Array.prototype.shift
  const nativeUnshift = Array.prototype.unshift
  const nativeSplice = Array.prototype.splice
  const state: SharedNodeVectorState = markRaw({
    owner: treeNodeVectorOwner,
    parent,
    isContentMode,
    normalize: (value) => value,
    changed: () => {}
  })
  // Drag rollback bypasses normalization and user callbacks. The nodes have
  // already been normalized, and their metadata is restored separately.
  state.restoreSnapshot = (values) => nativeSplice.call(list, 0, list.length, ...values as TreeNode[])
  Object.defineProperty(list, treeNodeVectorStateKey, {
    configurable: false,
    enumerable: false,
    value: state
  })
  configureNodeVectorOwner(list, parent, isContentMode)
  const normalize = (value: unknown) => vectorStateOf(list)?.normalize(value, list) as TreeNode
  const detach = (node: TreeNode | undefined) => {
    if (!node || list.includes(node)) return
    node.Parent = null
    reindexNode(node, -1)
  }
  const changed = () => {
    const currentParent = vectorStateOf(list)?.parent as TreeNode | null | undefined
    if (currentParent && list.length === 0 && currentParent.IsExpanded) Collapse(currentParent)
    vectorStateOf(list)?.changed()
  }
  state.replaceAt = (index, value) => {
    const removed = nativeSplice.call(list, index, 1) as TreeNode[]
    for (const node of removed) detach(node)
    const normalized = normalize(value)
    nativeSplice.call(list, index, 0, normalized)
    changed()
  }
  state.replaceAll = (values) => {
    const currentParent = vectorStateOf(list)?.parent as TreeNode | null | undefined
    const incomingValues = Array.from(values)
    const removed = nativeSplice.call(list, 0, list.length) as TreeNode[]
    // ReplaceAll follows TreeViewNodeVector::ReplaceAll: clearing a visible
    // child vector collapses its parent before the replacement is inserted.
    if (removed.length && currentParent?.IsExpanded) Collapse(currentParent)
    for (const node of removed) detach(node)
    const normalized = incomingValues.map(normalize)
    nativePush.apply(list, normalized as TreeNode[])
    changed()
  }
  Object.defineProperties(list, {
    push: {
      configurable: true,
      enumerable: false,
      value: (...values: unknown[]) => {
        const length = nativePush.apply(list, values.map(normalize) as TreeNode[])
        changed()
        return length
      }
    },
    pop: {
      configurable: true,
      enumerable: false,
      value: () => {
        const value = nativePop.call(list) as TreeNode | undefined
        detach(value)
        changed()
        return value
      }
    },
    shift: {
      configurable: true,
      enumerable: false,
      value: () => {
        const value = nativeShift.call(list) as TreeNode | undefined
        detach(value)
        changed()
        return value
      }
    },
    unshift: {
      configurable: true,
      enumerable: false,
      value: (...values: unknown[]) => {
        const length = nativeUnshift.apply(list, values.map(normalize) as TreeNode[])
        changed()
        return length
      }
    },
    splice: {
      configurable: true,
      enumerable: false,
      value: (start: number, deleteCount?: number, ...values: unknown[]) => {
        const normalized = values.map(normalize)
        const removed = deleteCount === undefined
          ? (nativeSplice as (this: TreeNode[], start: number) => TreeNode[]).call(list, start)
          : nativeSplice.call(list, start, deleteCount, ...normalized) as TreeNode[]
        for (const node of removed) detach(node)
        changed()
        return removed
      }
    }
  })
  publishVectorSurface(list)
  return new Proxy(list, {
    set(target, property, value) {
      if (property === 'length') {
        const changedLength = Number(value) !== target.length
        const removed = Number(value) < target.length ? target.slice(Number(value)) : []
        const result = Reflect.set(target, property, value)
        for (const node of removed) detach(node)
        if (changedLength) changed()
        return result
      }
      if (/^\d+$/.test(String(property))) {
        const index = Number(property)
        if (index < target.length) {
          state.replaceAt?.(index, value)
          return true
        }
        const previous = target[Number(property)]
        const result = Reflect.set(target, property, normalize(value))
        if (previous && previous !== value) detach(previous)
        changed()
        return result
      }
      return Reflect.set(target, property, value)
    },
    deleteProperty(target, property) {
      if (!/^\d+$/.test(String(property))) return Reflect.deleteProperty(target, property)
      const index = Number(property)
      if (index < 0 || index >= target.length) return true
      const removed = nativeSplice.call(target, index, 1) as TreeNode[]
      for (const node of removed) detach(node)
      changed()
      return true
    }
  }) as WinUIVector<TreeNode>
}

function reindexNode(node: TreeNode, depth: number) {
  node.Depth = depth
  for (const child of node.Children) {
    child.Parent = node
    reindexNode(child, depth + 1)
  }
}

function reconcileAdoptedSelection(node: TreeNode, parent: TreeNode | null) {
  const adopted = allNodesFrom([node])
  if (selectionMode.value === 'None') {
    for (const current of adopted) applyNodeSelection(current, 'UnSelected')
    return
  }
  if (selectionMode.value === 'Multiple') {
    // ItemInserted updates only the inserted node from its parent's selection
    // state. Descendants retain their own state until an explicit subtree
    // selection operation is requested.
    applyNodeSelection(node, parent ? parent.SelectionState : rootSelectionState.value)
    return
  }
  const selected = adopted.find((current) => current.SelectionState === 'Selected')
  if (!selected) return
  for (const current of selectedNodeList.value) {
    if (current !== selected) applyNodeSelection(current, 'UnSelected')
  }
  for (const current of adopted) {
    applyNodeSelection(current, current === selected ? 'Selected' : 'UnSelected')
  }
}

const buildNode = (
  item: unknown,
  parent: TreeNode | null,
  depth: number,
  isContentMode: boolean
): TreeNode => {
  // ViewModel::GetAt exposes Content in ItemsSource mode and the
  // TreeViewNode itself in RootNodes mode.  Keep the node's Content separate
  // from a template-rooted TreeViewItem.Content, which only changes the
  // presenter and is not the public item identity.
  const nodeContent = isContentMode ? item : contentOf(item)
  const rawChildren = childItemsFrom(item)
  const node: TreeNode = {
    SourceItem: item,
    Item: null,
    Content: nodeContent,
    PresenterContent: nodeContent,
    Children: [],
    ChildrenSource: rawChildren,
    Parent: parent,
    IsExpanded: false,
    HasUnrealizedChildren: false,
    get HasChildren() {
      return this.Children.length > 0 || this.HasUnrealizedChildren
    },
    SelectionState: 'UnSelected',
    Depth: depth,
    IsContentMode: isContentMode,
    Key: item as PropertyKey,
    Template: null,
    Context: itemContext(item),
    ContainerProps: {}
  }
  node.Item = isContentMode ? node.Content : node
  // A RootNodes item template receives the TreeViewNode, while an
  // ItemsSource template receives the source item.
  node.Context = isContentMode ? itemContext(item) : node.Item
  // Children is always the same observable IVector surface, including for a
  // leaf or a node that has only unrealized children. Expanding handlers can
  // therefore call Children.Add/Append before the first child exists.
  node.Children = createNodeVector([], node, isContentMode)
  // RootNodes templates bind against TreeViewNode.Children. Populate the
  // literal child vector before materializing the template so that an
  // ItemsSource="{x:Bind Children}" declaration observes the real nodes.
  if (!isContentMode && rawChildren.length) {
    node.Children = createNodeVector(
      rawChildren.map((child) => buildNode(child, node, depth + 1, false)),
      node,
      false
    )
  }
  const hasPrebuiltRootChildren = !isContentMode && rawChildren.length > 0
  // RootNodes DataTemplates bind against TreeViewNode, which does not exist
  // until this point; ItemsSource templates bind directly against the item.
  const root = treeViewItemRoot(node.Context)
  const rootProps = (root?.props ?? {}) as Record<string, unknown>
  const declaredItems = resolveXamlValue(rootProps.ItemsSource, instance)
  const children = Array.isArray(declaredItems) ? declaredItems : rawChildren
  const usesPrebuiltRootChildren = hasPrebuiltRootChildren
    && (declaredItems === undefined || declaredItems === node.Children || children === rawChildren)
  const containerContent = resolveXamlValue(rootProps.Content, instance)
  node.ContainerProps = rootProps
  node.PresenterContent = containerContent !== undefined ? containerContent : nodeContent
  node.IsExpanded = declaredExpanded(item, root)
  node.HasUnrealizedChildren = declaredFlag(item, root, 'HasUnrealizedChildren')
  if (root) {
    const contentNodes = getVNodeChildren(root)
    if (contentNodes.length) {
      node.Template = materializeXamlVNode(contentNodes, node.Context, instance) as VNode[]
    }
  }
  if (isContentMode) {
    node.Children = createNodeVector(
      children.map((child) => buildNode(child, node, depth + 1, true)),
      node,
      true
    )
  } else if (!usesPrebuiltRootChildren && children.length) {
    node.Children = createNodeVector(
      children.map((child) => isTreeNode(child)
        ? child
        : buildNode(child, node, depth + 1, false)),
      node,
      false
    )
  }
  return node
}

/**
 * `<TreeView.RootNodes>` declares a literal node tree:
 *   <TreeViewNode Content="Root">
 *     <TreeViewNode.Children><TreeViewNode Content="Child" /></TreeViewNode.Children>
 *   </TreeViewNode>
 * The declared nodes become plain data items, which then flow through the same
 * template pipeline as an ItemsSource item.
 */
const declaredNodeCache = new Map<string, TreeItem>()
let declaredRootItems: unknown[] | null = null
const declaredNodeData = (node: VNode, declarationPath: string): TreeItem => {
  const cached = declaredNodeCache.get(declarationPath)
  if (cached) return cached
  const props = { ...(node.props ?? {}) } as TreeItem
  declaredNodeCache.set(declarationPath, props)
  const children: TreeItem[] = []
  for (const child of getVNodeChildren(node)) {
    const property = (child?.type as { __treeViewProperty?: string } | undefined)?.__treeViewProperty
    const nested = property === 'children' ? getVNodeChildren(child) : [child]
    for (const entry of nested) {
      if ((entry?.type as { __treeViewNode?: boolean } | undefined)?.__treeViewNode) {
        children.push(declaredNodeData(entry, `${declarationPath}.${children.length}`))
      }
    }
  }
  if (children.length) props.Children = children
  return props
}

const rootSource = computed<{ items: unknown[]; isContentMode: boolean; collection: unknown[] | null }>(() => {
  const source = resolveXamlValue(props.ItemsSource, instance)
  if (Array.isArray(source)) return { items: source, isContentMode: true, collection: source }
  const declarative = resolveXamlValue(props.RootNodes, instance)
  if (Array.isArray(declarative)) return { items: declarative, isContentMode: false, collection: declarative }
  for (const node of slotNodes.value) {
    if ((node.type as { __treeViewProperty?: string } | undefined)?.__treeViewProperty !== 'rootNodes') continue
    // XAML declarations initialize the node collection once. Parent renders
    // produce fresh VNodes but must retain subsequent drag and API mutations.
    declaredRootItems ??= getVNodeChildren(node)
      .filter((child) => (child?.type as { __treeViewNode?: boolean } | undefined)?.__treeViewNode)
      .map((child, index) => declaredNodeData(child, String(index)))
    return {
      items: declaredRootItems,
      isContentMode: false,
      collection: declaredRootItems
    }
  }
  return { items: [], isContentMode: false, collection: null }
})

const transitionState = computed(() => {
  const bound = resolveXamlValue(props.ItemContainerTransitions, instance)
  const propertyNode = slotNodes.value.find((node) => getCollectionProperty(node) === 'itemContainerTransitions')
  const candidates = bound && typeof bound === 'object'
    ? getVNodeChildren(bound as VNode)
    : propertyNode ? getVNodeChildren(propertyNode) : []
  const explicitlySet = Boolean(propertyNode) || (bound !== undefined && bound !== null && bound !== '')
  const names = candidates.map((node) => typeNameOf(node).toLowerCase())
  const has = (name: string) => names.some((candidate) => candidate.includes(name.toLowerCase()))
  // WinUI's TreeView default style includes all three transitions. An empty
  // explicit collection disables the corresponding default behavior.
  return {
    content: candidates.length ? has('contentthemetransition') : !explicitlySet,
    reorder: candidates.length ? has('reorderthemetransition') : !explicitlySet,
    entrance: candidates.length ? has('entrancethemetransition') : !explicitlySet
  }
})

const nodes = ref<TreeNode[]>([])
let rootNodesVectorInitialized = false
const selectionOrder: TreeNode[] = []
const selectionOrderVersion = ref(0)
const replaceSelectionOrder = (ordered: TreeNode[]) => {
  selectionOrder.splice(0, selectionOrder.length, ...ordered)
  selectionOrderVersion.value += 1
}
const activeNode = shallowRef<TreeNode | null>(null)
const nodeIds = new WeakMap<TreeNode, number>()
let nextNodeId = 1

const allNodesFrom = (roots: TreeNode[]) => {
  const result: TreeNode[] = []
  const walk = (list: TreeNode[]) => {
    for (const node of list) {
      result.push(node)
      walk(node.Children)
    }
  }
  walk(roots)
  return result
}

const treeViewApi: Record<string, unknown> = {}
const treeNodeVectorOwner = Symbol('WinUIonWeb.TreeViewOwner')
let syncSelectionVectors = () => {}
/** The array last handed back through update:ItemsSource. */
let emittedSource: unknown[] | null = null
let synchronizingSource = false
/**
 * A monotonically increasing revision of the node tree. Nodes are plain
 * objects whose `Children` arrays are spliced in place by reorder, so Vue
 * cannot observe a move through the array identity alone; every structural
 * mutation bumps this revision and the computed tree re-reads it.
 */
const treeVersion = ref(0)
const bumpTree = () => { treeVersion.value += 1 }

const rebuild = () => {
  const selectedSources = selectionOrder.map((node) => node.SourceItem)
  const previous = new Map<unknown, TreeNode[]>()
  const remember = (node: TreeNode) => {
    const matches = previous.get(node.SourceItem) ?? []
    matches.push(node)
    previous.set(node.SourceItem, matches)
    for (const child of node.Children) remember(child)
  }
  for (const node of nodes.value) remember(node)
  const activeSource = activeNode.value?.SourceItem
  const restore = (node: TreeNode) => {
    const old = previous.get(node.SourceItem)?.shift()
    if (old) {
      node.IsExpanded = old.IsExpanded
      node.SelectionState = old.SelectionState
    }
    for (const child of node.Children) restore(child)
  }
  const nextNodes = createNodeVector(
    rootSource.value.items.map((item) => buildNode(item, null, 0, rootSource.value.isContentMode)),
    null,
    rootSource.value.isContentMode
  )
  if (rootNodesVectorInitialized) {
    // Keep the public RootNodes vector identity stable across ItemsSource
    // replacement while replacing its projected contents in one operation.
    suppressNodeVectorNotifications += 1
    try {
      Array.prototype.splice.call(nodes.value, 0, nodes.value.length, ...nextNodes)
    } finally {
      suppressNodeVectorNotifications -= 1
    }
  } else {
    nodes.value = nextNodes
    rootNodesVectorInitialized = true
  }
  for (const node of nodes.value) restore(node)
  const rebuiltNodes = allNodesFrom(nodes.value)
  const ordered = selectedSources
    .map((source) => rebuiltNodes.find((node) => node.SourceItem === source && node.SelectionState === 'Selected'))
    .filter((node): node is TreeNode => Boolean(node))
  for (const node of rebuiltNodes) {
    if (node.SelectionState === 'Selected' && !ordered.includes(node)) ordered.push(node)
  }
  replaceSelectionOrder(ordered)
  activeNode.value = allNodesFrom(nodes.value).find((node) => node.SourceItem === activeSource)
    ?? nodes.value[0]
    ?? null
  bumpTree()
  syncSelectionVectors()
}

watch(rootSource, (next) => {
  if (synchronizingSource) return
  // Rebuilding is WinUI's response to replacing ItemsSource. A change this
  // TreeView produced itself (drag / keyboard reorder) must not discard the
  // live tree, so compare against the last projection we emitted.
  if (emittedSource && next.items.length === emittedSource.length && next.items.every((item, index) => item === emittedSource?.[index])) return
  emittedSource = null
  rebuild()
}, { immediate: true, deep: true })

/* ------------------------------------------------------------------ *
 * Flattening — TreeViewList renders the expanded subtree as a flat list.
 * ------------------------------------------------------------------ */

const flatNodes = computed<TreeNode[]>(() => {
  void treeVersion.value
  const result: TreeNode[] = []
  const walk = (list: TreeNode[]) => {
    for (const node of list) {
      result.push(node)
      if (node.IsExpanded) walk(node.Children)
    }
  }
  walk(nodes.value)
  return result
})

const allNodes = computed(() => {
  void treeVersion.value
  return allNodesFrom(nodes.value)
})

const rows = computed<TreeRow[]>(() => flatNodes.value.map((node, index) => ({
  index,
  node,
  depth: node.Depth,
  isExpanded: node.IsExpanded,
  hasChildren: node.HasChildren,
  selectionState: node.SelectionState,
  isSelected: node.SelectionState === 'Selected',
  positionInSet: (node.Parent ? node.Parent.Children : nodes.value).indexOf(node) + 1,
  setSize: (node.Parent ? node.Parent.Children : nodes.value).length
})))

const rowId = (entry: TreeRow) => {
  let id = nodeIds.get(entry.node)
  if (!id) {
    id = nextNodeId
    nextNodeId += 1
    nodeIds.set(entry.node, id)
  }
  return `win-tree-item-${id}`
}

const checkboxAriaValue = (entry: TreeRow) =>
  entry.selectionState === 'Selected' ? 'true' : entry.selectionState === 'PartialSelected' ? 'mixed' : 'false'

const onRowFocus = (entry: TreeRow) => {
  activeNode.value = entry.node
}

const onMultiSelectClick = (entry: TreeRow) => {
  if (!isEnabled.value) return
  activeNode.value = entry.node
  toggleNode(entry.node)
}

const containerValue = (node: TreeNode, name: string, fallback?: unknown) => {
  const value = node.ContainerProps[name]
  return resolveXamlValue(value === undefined ? fallback : value, instance, {
    item: node.SourceItem,
    Item: node.SourceItem
  })
}

const selectedContainerStyle = (node: TreeNode) => {
  const selector = resolveXamlValue(props.ItemContainerStyleSelector, instance)
  if (selector && typeof (selector as { SelectStyleCore?: unknown }).SelectStyleCore === 'function') {
    return (selector as { SelectStyleCore: (item: unknown, container: unknown) => unknown })
      .SelectStyleCore(node.Item, treeViewApi)
  }
  return resolveXamlValue(props.ItemContainerStyle, instance)
}

const applyContainerStyle = (target: CSSProperties, source: unknown) => {
  if (!source || typeof source !== 'object') return
  const values = source as Record<string, unknown>
  if (values.Background !== undefined) target.background = String(resolveXamlValue(values.Background, instance) ?? '')
  if (values.BorderBrush !== undefined) target.borderColor = String(resolveXamlValue(values.BorderBrush, instance) ?? '')
  if (values.BorderThickness !== undefined) {
    target.borderWidth = xamlThickness(values.BorderThickness)
    target.borderStyle = 'solid'
  }
  if (values.CornerRadius !== undefined) target.borderRadius = cssLength(values.CornerRadius)
  if (values.Margin !== undefined) target.margin = xamlThickness(values.Margin)
  if (values.Padding !== undefined) target.padding = xamlThickness(values.Padding)
  if (values.MinHeight !== undefined) target.minHeight = cssLength(values.MinHeight)
  if (values.Height !== undefined) target.height = cssLength(values.Height)
  if (values.MinWidth !== undefined) target.minWidth = cssLength(values.MinWidth)
  if (values.Width !== undefined) target.width = cssLength(values.Width)
}

const presenterStyle = (entry: TreeRow): CSSProperties => {
  const style: CSSProperties = {}
  applyContainerStyle(style, selectedContainerStyle(entry.node))
  applyContainerStyle(style, entry.node.ContainerProps)
  return style
}

const contentStyle = (entry: TreeRow): CSSProperties => ({
  justifyContent: alignment(
    containerValue(entry.node, 'HorizontalContentAlignment', props.HorizontalContentAlignment),
    'horizontal'
  ) as CSSProperties['justifyContent'],
  alignItems: alignment(
    containerValue(entry.node, 'VerticalContentAlignment', props.VerticalContentAlignment),
    'vertical'
  ) as CSSProperties['alignItems'],
  margin: xamlThickness(containerValue(entry.node, 'Padding')) || undefined
})

const glyphStyle = (entry: TreeRow): CSSProperties => ({
  '--tree-glyph-brush': String(containerValue(entry.node, 'GlyphBrush') ?? '') || undefined,
  fontSize: cssLength(containerValue(entry.node, 'GlyphSize', 8)) || '8px',
  opacity: String(containerValue(entry.node, 'GlyphOpacity', 1))
} as CSSProperties)

const collapsedGlyph = (entry: TreeRow) => String(containerValue(entry.node, 'CollapsedGlyph', '\uE76C') ?? '\uE76C')
const expandedGlyph = (entry: TreeRow) => String(containerValue(entry.node, 'ExpandedGlyph', '\uE70D') ?? '\uE70D')
const isPrimaryMultiDragRow = (entry: TreeRow) => isDragging.value
  && dragItemCount.value > 1
  && primaryDragNode.value === entry.node

const itemComponentCache = new WeakMap<TreeNode, unknown>()
const itemComponent = (entry: TreeRow) => {
  const node = entry.node
  const cached = itemComponentCache.get(node)
  if (cached) return cached
  const component = defineComponent({
    name: 'TreeViewItemTemplate',
    setup() {
      provide(xamlItemContextKey, node.Context)
      return () => {
        // A <TreeViewItem> root already supplied Content/ItemsSource; only the
        // content it declared is rendered here, bound to the item context.
        if (node.Template?.length) return h(Fragment, node.Template)
        const template = templateNodesFor(node.SourceItem)
        if (template.length) {
          const materialized = materializeXamlVNode(template, node.Context, instance)
          const list = (Array.isArray(materialized) ? materialized : [materialized]) as VNode[]
          const root = list.find(isTreeViewItemNode)
          if (root) {
            const children = getVNodeChildren(root)
            if (children.length) return h(Fragment, children)
          } else {
            return h(Fragment, list)
          }
        }
        return h('span', String(node.PresenterContent ?? ''))
      }
    }
  })
  itemComponentCache.set(node, component)
  return component
}

const rowClasses = (entry: TreeRow) => ({
  selected: entry.isSelected,
  'multi-select': selectionMode.value === 'Multiple',
  'can-drag': canDragItems.value,
  'dragging-source': isDragging.value && dragVisualNodes.value.includes(entry.node),
  'drag-shrink': (isDragging.value || isExternalDragOver.value)
    && !dragVisualNodes.value.includes(entry.node)
    && entry.index !== dragOverIndex.value,
  'reorder-target': entry.index === dragOverIndex.value,
  'drop-before': entry.index === dragOverIndex.value && dropMode.value === 'before',
  'drop-after': entry.index === dragOverIndex.value && dropMode.value === 'after',
  'drop-inside': entry.index === dragOverIndex.value && dropMode.value === 'inside'
})

const rowStyle = (entry: TreeRow): CSSProperties => {
  const offset = reorderOffsets.value.get(entry.index) ?? 0
  return offset
    ? {
        transform: `translateY(${offset}px)`,
        transition: transitionState.value.reorder
          ? 'transform 240ms cubic-bezier(0.1, 0.9, 0.2, 1)'
          : 'none'
      }
    : {}
}

const cacheTreeDragLayout = () => {
  const elements = rowElements()
  const entries: TreeDragLayoutEntry[] = []
  const contentTransform = listRef.value ? getComputedStyle(listRef.value).transform : 'none'
  let contentTranslateY = 0
  if (contentTransform && contentTransform !== 'none') {
    try {
      contentTranslateY = new DOMMatrixReadOnly(contentTransform).m42
    } catch {
      contentTranslateY = 0
    }
  }
  elements.forEach((element, index) => {
    const rect = element.getBoundingClientRect()
    const row = rows.value[index]
    if (!row) return
    entries.push({
      node: row.node,
      index,
      top: rect.top - contentTranslateY,
      bottom: rect.bottom - contentTranslateY,
      midY: rect.top - contentTranslateY + rect.height / 2,
      height: rect.height,
      slotSize: rect.height
    })
  })
  for (let index = 0; index < entries.length - 1; index += 1) {
    const distance = entries[index + 1].top - entries[index].top
    if (distance > 0) entries[index].slotSize = distance
  }
  cachedDragLayout = entries
  dragScrollViewport = containerRef.value?.querySelector<HTMLElement>('.win-scroll-viewer-viewport') ?? null
  dragLayoutScrollTop = dragScrollViewport?.scrollTop ?? 0
}

const shiftCachedTreeDragLayoutForScroll = () => {
  const viewport = dragScrollViewport
  if (!viewport || !cachedDragLayout.length) return
  const delta = viewport.scrollTop - dragLayoutScrollTop
  if (Math.abs(delta) < 0.01) return
  for (const entry of cachedDragLayout) {
    entry.top -= delta
    entry.bottom -= delta
    entry.midY -= delta
  }
  dragLayoutScrollTop = viewport.scrollTop
}

const treeDragInsertIndex = (clientY: number, excluded: number[]) => {
  if (!cachedDragLayout.length) cacheTreeDragLayout()
  const candidates = cachedDragLayout
    .map((entry) => ({ entry, index: rows.value.findIndex((row) => row.node === entry.node) }))
    .filter(({ index }) => index >= 0 && !excluded.includes(index))
  return candidates.find(({ entry }) => clientY < entry.midY)?.index
    ?? rows.value.length
}

const treeDragOverIndexAt = (clientY: number, excluded: number[]) => {
  if (!cachedDragLayout.length) cacheTreeDragLayout()
  const candidates = cachedDragLayout
    .map((entry) => ({ entry, index: rows.value.findIndex((row) => row.node === entry.node) }))
    .filter(({ index }) => index >= 0 && !excluded.includes(index))
  const hit = candidates.find(({ entry }) => {
    const relative = (clientY - entry.top) / Math.max(1, entry.height)
    return relative > 0.2 && relative < 0.8
  })
  return hit?.index ?? -1
}

const normalizeTreeInsertSlot = (slot: number) => {
  const sourceIndices = dragVisualNodes.value
    .map((node) => rows.value.findIndex((row) => row.node === node))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)
  if (!sourceIndices.length) return slot
  const min = sourceIndices[0]
  const max = sourceIndices[sourceIndices.length - 1]
  return max - min + 1 === sourceIndices.length && slot >= min && slot <= max + 1 ? -1 : slot
}

const updateTreeReorderOffsets = () => {
  const offsets = new Map<number, number>()
  const sourceIndices = dragVisualNodes.value
    .map((node) => rows.value.findIndex((row) => row.node === node))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)
  if ((!isDragging.value && !isExternalDragOver.value) || pendingDropSlot < 0 || pendingDropMode === 'inside') {
    reorderOffsets.value = offsets
    return
  }
  const sourceSet = new Set(sourceIndices)
  const sourceExtent = sourceIndices.reduce((total, index) => {
    const node = rows.value[index]?.node
    const entry = cachedDragLayout.find((candidate) => candidate.node === node)
    return total + (entry?.slotSize ?? entry?.height ?? 0)
  }, 0)
  if (!sourceIndices.length && externalDragHeight > 0) {
    for (const entry of cachedDragLayout) {
      if (entry.index >= pendingDropSlot) offsets.set(entry.index, externalDragHeight)
    }
  } else if (sourceExtent > 0) {
    const min = sourceIndices[0]
    const max = sourceIndices[sourceIndices.length - 1]
    if (pendingDropSlot > max) {
      for (const entry of cachedDragLayout) {
        if (!sourceSet.has(entry.index) && entry.index > max && entry.index < pendingDropSlot) offsets.set(entry.index, -sourceExtent)
      }
    } else if (pendingDropSlot < min) {
      for (const entry of cachedDragLayout) {
        if (!sourceSet.has(entry.index) && entry.index >= pendingDropSlot && entry.index < min) offsets.set(entry.index, sourceExtent)
      }
    }
  }
  reorderOffsets.value = offsets
}

const applyTreeLiveReorder = () => {
  if (!isDragging.value && !isExternalDragOver.value) return
  if (liveReorderTimer !== undefined) {
    window.clearTimeout(liveReorderTimer)
    liveReorderTimer = undefined
  }
  dropSlot.value = pendingDropSlot
  dropMode.value = pendingDropMode
  dragOverIndex.value = pendingDragOverIndex
  updateTreeReorderOffsets()
}

const scheduleTreeLiveReorder = (slot: number, mode: 'before' | 'after' | 'inside' | null, hover: number, immediate = false) => {
  const normalizedSlot = normalizeTreeInsertSlot(slot)
  const unchanged = pendingDropSlot === normalizedSlot
    && pendingDropMode === mode
    && pendingDragOverIndex === hover
  pendingDropSlot = normalizedSlot
  pendingDropMode = mode
  pendingDragOverIndex = hover
  if (mode === 'inside' || immediate) {
    applyTreeLiveReorder()
    return
  }
  if (unchanged && liveReorderTimer !== undefined) return
  if (dropSlot.value === pendingDropSlot
    && dropMode.value === pendingDropMode
    && dragOverIndex.value === pendingDragOverIndex
    && liveReorderTimer === undefined) return
  if (liveReorderTimer !== undefined) window.clearTimeout(liveReorderTimer)
  liveReorderTimer = window.setTimeout(() => {
    liveReorderTimer = undefined
    applyTreeLiveReorder()
  }, LIVE_REORDER_DELAY)
}

const flushTreeLiveReorder = () => {
  if (liveReorderTimer !== undefined) {
    window.clearTimeout(liveReorderTimer)
    liveReorderTimer = undefined
  }
  if (isDragging.value || isExternalDragOver.value) applyTreeLiveReorder()
}

const stopTreeEdgeScroll = () => {
  if (edgeScrollStartTimer !== undefined) window.clearTimeout(edgeScrollStartTimer)
  if (edgeScrollFrame !== undefined) window.cancelAnimationFrame(edgeScrollFrame)
  edgeScrollStartTimer = undefined
  edgeScrollFrame = undefined
  edgeScrollVelocity = 0
  edgeScrollLastTime = 0
  edgeScrollViewport = null
}

const updateTreeEdgeScroll = (clientY: number) => {
  const viewport = dragScrollViewport ?? containerRef.value?.querySelector<HTMLElement>('.win-scroll-viewer-viewport')
  if (!viewport) return
  const rect = viewport.getBoundingClientRect()
  // The six-pixel ReorderSink transform contributes to browser scrollHeight,
  // even though WinUI does not remeasure a transformed presenter. Use the
  // arranged content extent so the visual hint cannot create phantom scrolling.
  const maxScroll = Math.max(0, (listRef.value?.offsetHeight ?? viewport.scrollHeight) - viewport.clientHeight)
  if (!maxScroll || (clientY >= rect.top + EDGE_SCROLL_SIZE && clientY <= rect.bottom - EDGE_SCROLL_SIZE)) {
    stopTreeEdgeScroll()
    return
  }
  const distance = clientY < rect.top + EDGE_SCROLL_SIZE ? clientY - rect.top : rect.bottom - clientY
  const direction = clientY < rect.top + EDGE_SCROLL_SIZE ? -1 : 1
  if ((direction < 0 && viewport.scrollTop <= 0) || (direction > 0 && viewport.scrollTop >= maxScroll)) {
    stopTreeEdgeScroll()
    return
  }
  edgeScrollViewport = viewport
  const ratio = Math.max(0, Math.min(1, distance / EDGE_SCROLL_SIZE))
  edgeScrollVelocity = direction * (EDGE_SCROLL_MAX_SPEED - (EDGE_SCROLL_MAX_SPEED - EDGE_SCROLL_MIN_SPEED) * ratio)
  if (edgeScrollFrame !== undefined || edgeScrollStartTimer !== undefined) return
  edgeScrollStartTimer = window.setTimeout(() => {
    edgeScrollStartTimer = undefined
    edgeScrollLastTime = 0
    const tick = (now: number) => {
      if (!edgeScrollViewport || (!isDragging.value && !isExternalDragOver.value) || !edgeScrollVelocity) return stopTreeEdgeScroll()
      const elapsed = edgeScrollLastTime ? Math.min(50, now - edgeScrollLastTime) : 16
      edgeScrollLastTime = now
      const previous = edgeScrollViewport.scrollTop
      edgeScrollViewport.scrollTop = Math.max(0, Math.min(maxScroll, previous + edgeScrollVelocity * elapsed / 1000))
      if (edgeScrollViewport.scrollTop !== previous) {
        shiftCachedTreeDragLayoutForScroll()
        if (latestPointerPosition) {
          if (pointerDragDetail) updatePointerDropTarget(latestPointerPosition.x, latestPointerPosition.y)
          else if (targetDragSession) trackPointerOverPoint(latestPointerPosition.x, latestPointerPosition.y)
        }
        edgeScrollFrame = window.requestAnimationFrame(tick)
      } else stopTreeEdgeScroll()
    }
    edgeScrollFrame = window.requestAnimationFrame(tick)
  }, EDGE_SCROLL_DELAY)
}

/* ------------------------------------------------------------------ *
 * Selection — ViewModel::UpdateSelection and its cascades.
 * ------------------------------------------------------------------ */

const selectionStateBasedOnChildren = (node: Pick<TreeNode, 'Children'>): TreeNodeSelectionState => {
  let hasSelectedChildren = false
  let hasUnSelectedChildren = false
  for (const child of node.Children) {
    const state = child.SelectionState
    if (state === 'Selected') hasSelectedChildren = true
    else if (state === 'UnSelected') hasUnSelectedChildren = true
    if ((hasSelectedChildren && hasUnSelectedChildren) || state === 'PartialSelected') {
      return 'PartialSelected'
    }
  }
  return hasSelectedChildren ? 'Selected' : 'UnSelected'
}

const updateSelectionStateOfDescendants = (node: TreeNode, state: TreeNodeSelectionState) => {
  if (state === 'PartialSelected') return
  if (state === 'UnSelected') {
    for (let index = node.Children.length - 1; index >= 0; index -= 1) {
      const child = node.Children[index]
      updateSelectionStateOfDescendants(child, state)
      applyNodeSelection(child, state)
    }
  } else {
    for (const child of node.Children) {
      applyNodeSelection(child, state)
      updateSelectionStateOfDescendants(child, state)
    }
  }
}

const updateSelectionStateOfAncestors = (node: TreeNode) => {
  const parent = node.Parent
  if (!parent) return
  const previous = parent.SelectionState
  const next = selectionStateBasedOnChildren(parent)
  if (previous !== next) {
    applyNodeSelection(parent, next)
    updateSelectionStateOfAncestors(parent)
  }
}

const selectedNodeList = computed<TreeNode[]>(() => {
  void selectionOrderVersion.value
  // Public RootNodes/Children vector methods mutate their stable raw arrays
  // before the queued structural notification bumps treeVersion. Read the
  // current tree directly so Add(...); SelectedNodes.ReplaceAll(...) works in
  // the same call stack, as it does for WinRT IVector operations.
  const currentNodes = allNodesFrom(nodes.value)
  const available = new Set(currentNodes)
  const ordered = selectionOrder.filter((node) => available.has(node) && node.SelectionState === 'Selected')
  for (const node of currentNodes) {
    if (node.SelectionState === 'Selected' && !ordered.includes(node)) ordered.push(node)
  }
  return ordered
})
const selectedItems = computed<unknown[]>(() => selectedNodeList.value.map((node) => node.Item))

let selectionTracking = 0
let addedSelectedItems: unknown[] = []
let removedSelectedItems: unknown[] = []

const beginSelectionChanges = () => {
  // Tracking (and therefore the event) is disabled in Single mode; the inner
  // ListView raises it directly there.
  if (selectionMode.value === 'Single') return
  selectionTracking += 1
  if (selectionTracking === 1) {
    addedSelectedItems = []
    removedSelectedItems = []
  }
}

const endSelectionChanges = () => {
  if (selectionMode.value === 'Single') return
  selectionTracking -= 1
  if (selectionTracking !== 0) return
  // ViewModel::TrackItemSelected/TrackItemUnselected preserves the exact
  // transition order. That order is observable in SelectionChanged args and
  // can differ from both visual tree order and the final vector order.
  const added = [...addedSelectedItems]
  const removed = [...removedSelectedItems]
  addedSelectedItems = []
  removedSelectedItems = []
  if (!added.length && !removed.length) {
    syncSelectionVectors()
    return
  }
  raiseSelectionChanged(added, removed)
}

const applyNodeSelection = (node: TreeNode, state: TreeNodeSelectionState) => {
  const wasSelected = node.SelectionState === 'Selected'
  const isSelected = state === 'Selected'
  if (node.SelectionState === state) {
    // A selected node adopted from another TreeView already carries its state,
    // but still needs to enter this ViewModel's ordered selection vector.
    if (isSelected && !selectionOrder.includes(node)) {
      selectionOrder.push(node)
      selectionOrderVersion.value += 1
    }
    return
  }
  node.SelectionState = state
  if (wasSelected !== isSelected) {
    if (isSelected) {
      if (!selectionOrder.includes(node)) selectionOrder.push(node)
    } else {
      const orderIndex = selectionOrder.indexOf(node)
      if (orderIndex >= 0) selectionOrder.splice(orderIndex, 1)
    }
    selectionOrderVersion.value += 1
  }
  if (selectionTracking > 0 && wasSelected !== isSelected) {
    if (isSelected) addedSelectedItems.push(node.Item)
    else removedSelectedItems.push(node.Item)
  }
}

const updateSelection = (node: TreeNode, state: TreeNodeSelectionState) => {
  if (node.SelectionState === state) return
  applyNodeSelection(node, state)
  if (selectionMode.value !== 'Single') {
    updateSelectionStateOfDescendants(node, state)
    updateSelectionStateOfAncestors(node)
  }
}

const raiseSelectionChanged = (added: unknown[], removed: unknown[]) => {
  syncSelectionVectors()
  const args = { AddedItems: added, RemovedItems: removed }
  emit('SelectionChanged', treeViewApi, args)
  resolveXamlHandler(attrs.SelectionChanged, instance)?.(treeViewApi, args)
  emit('update:SelectedItems', selectedItems.value)
  emit('update:SelectedItem', selectedItems.value[0] ?? null)
}

const raiseSelectionDiff = (before: unknown[]) => {
  const beforeSet = new Set(before)
  const after = [...selectedItems.value]
  const afterSet = new Set(after)
  const added = after.filter((item) => !beforeSet.has(item))
  const removed = before.filter((item) => !afterSet.has(item))
  if (added.length || removed.length) raiseSelectionChanged(added, removed)
}

const selectNode = (node: TreeNode, isSelected: boolean) => {
  if (selectionMode.value === 'None') return
  if (isSelected === (node.SelectionState === 'Selected')) return

  if (selectionMode.value === 'Single') {
    // SelectNode: single selection clears every other node first.
    const previous = [...selectedItems.value]
    if (isSelected) {
      for (const other of selectedNodeList.value) {
        if (other !== node) applyNodeSelection(other, 'UnSelected')
      }
      applyNodeSelection(node, 'Selected')
      raiseSelectionChanged([node.Item], previous)
    } else {
      applyNodeSelection(node, 'UnSelected')
      raiseSelectionChanged([], [node.Item])
    }
    return
  }

  beginSelectionChanges()
  try {
    updateSelection(node, isSelected ? 'Selected' : 'UnSelected')
  } finally {
    endSelectionChanges()
  }
}

const selectAll = () => {
  if (selectionMode.value !== 'Multiple') return
  beginSelectionChanges()
  try {
    for (const node of nodes.value) updateSelection(node, 'Selected')
  } finally {
    endSelectionChanges()
  }
  // SelectAll updates the hidden origin even when the tree is currently empty.
  rootSelectionState.value = 'Selected'
}

type VectorMutation<T> = { removed: T[]; inserted: T[] }
type ProjectedVector<T> = { vector: WinUIVector<T>; sync: (values: readonly T[]) => void }

/** A stable vector whose mutations are projected back into selection state. */
const createProjectedVector = <T>(
  applyValues: (values: T[], mutation: VectorMutation<T>) => void
): ProjectedVector<T> => {
  const list: T[] = []
  let syncing = false
  let vector: WinUIVector<T>
  const desired = () => Array.from(list)
  const apply = (values: T[], mutation: VectorMutation<T>) => {
    if (!syncing) {
      applyValues(
        values.filter((value) => value !== undefined),
        {
          removed: mutation.removed.filter((value) => value !== undefined),
          inserted: mutation.inserted.filter((value) => value !== undefined)
        }
      )
    }
  }
  Object.defineProperties(list, {
    push: {
      configurable: true,
      enumerable: false,
      value: (...values: T[]) => {
        const next = desired()
        const result = next.push(...values)
        apply(next, { removed: [], inserted: values })
        return result
      }
    },
    pop: {
      configurable: true,
      enumerable: false,
      value: () => {
        const next = desired()
        const result = next.pop()
        apply(next, { removed: result === undefined ? [] : [result], inserted: [] })
        return result
      }
    },
    shift: {
      configurable: true,
      enumerable: false,
      value: () => {
        const next = desired()
        const result = next.shift()
        apply(next, { removed: result === undefined ? [] : [result], inserted: [] })
        return result
      }
    },
    unshift: {
      configurable: true,
      enumerable: false,
      value: (...values: T[]) => {
        const next = desired()
        const result = next.unshift(...values)
        apply(next, { removed: [], inserted: values })
        return result
      }
    },
    splice: {
      configurable: true,
      enumerable: false,
      value: (start: number, deleteCount?: number, ...values: T[]) => {
        const next = desired()
        const removed = deleteCount === undefined
          ? next.splice(start)
          : next.splice(start, deleteCount, ...values)
        apply(next, { removed, inserted: values })
        return removed
      }
    }
  })
  publishVectorSurface(list)
  vector = new Proxy(list, {
    set(target, property, value) {
      if (syncing || (property !== 'length' && !/^\d+$/.test(String(property)))) {
        return Reflect.set(target, property, value)
      }
      const next = desired()
      const removed = property === 'length' && Number(value) < next.length
        ? next.slice(Number(value))
        : /^\d+$/.test(String(property)) && Number(property) < next.length
          ? [next[Number(property)]]
          : []
      Reflect.set(next, property, value)
      const inserted = /^\d+$/.test(String(property)) ? [value as T] : []
      apply(next, { removed, inserted })
      return true
    },
    deleteProperty(target, property) {
      if (syncing || !/^\d+$/.test(String(property))) return Reflect.deleteProperty(target, property)
      const next = desired()
      const removed = next.splice(Number(property), 1)
      apply(next, { removed, inserted: [] })
      return true
    }
  }) as WinUIVector<T>
  return {
    vector,
    sync(values) {
      syncing = true
      Array.prototype.splice.call(list, 0, list.length, ...values)
      syncing = false
    }
  }
}

let applyingPublicSelection = false
const applySelectedNodes = (
  requested: TreeNode[],
  mutation: VectorMutation<TreeNode> = { removed: [...selectedNodeList.value], inserted: requested }
) => {
  if (applyingPublicSelection) return
  const currentNodes = allNodesFrom(nodes.value)
  const available = new Set(currentNodes)
  const unique = requested.filter((node, index) => available.has(node) && requested.indexOf(node) === index)
  const target = selectionMode.value === 'Single' ? unique.slice(-1) : unique
  const before = [...selectedItems.value]
  if (selectionMode.value === 'None') {
    syncSelectionVectors()
    return
  }
  applyingPublicSelection = true
  if (selectionMode.value === 'Multiple') beginSelectionChanges()
  try {
    if (selectionMode.value === 'Single') {
      for (const node of currentNodes) applyNodeSelection(node, 'UnSelected')
      if (target[0]) applyNodeSelection(target[0], 'Selected')
    } else {
      // Preserve the observable vector operation, not just its final set.
      // ReplaceAll and SetAt remove first and insert second; this matters when
      // removing a selected parent cascades to a child that is then reinserted.
      const removed = mutation.removed.filter((node) => available.has(node))
      const added = mutation.inserted.filter((node) => available.has(node))
      for (const node of removed) updateSelection(node, 'UnSelected')
      for (const node of added) updateSelection(node, 'Selected')
    }
  } finally {
    if (selectionMode.value === 'Multiple') endSelectionChanges()
    applyingPublicSelection = false
  }
  if (selectionMode.value === 'Single') raiseSelectionDiff(before)
  else syncSelectionVectors()
}

const selectedNodesProjection = createProjectedVector<TreeNode>(applySelectedNodes)
const selectedItemsProjection = createProjectedVector<unknown>((items, mutation) => {
  const currentNodes = allNodesFrom(nodes.value)
  const requested = items
    .map((item) => currentNodes.find((node) => node.Item === item))
    .filter((node): node is TreeNode => Boolean(node))
  const nodesFor = (values: unknown[]) => values
    .map((item) => currentNodes.find((node) => node.Item === item))
    .filter((node): node is TreeNode => Boolean(node))
  applySelectedNodes(requested, {
    removed: nodesFor(mutation.removed),
    inserted: nodesFor(mutation.inserted)
  })
})
syncSelectionVectors = () => {
  const selected = selectedNodeList.value
  if (selected.length !== selectionOrder.length
    || selected.some((node, index) => selectionOrder[index] !== node)) {
    replaceSelectionOrder(selected)
  }
  selectedNodesProjection.sync(selected)
  selectedItemsProjection.sync(selected.map((node) => node.Item))
}
syncSelectionVectors()

const toggleNode = (node: TreeNode) => selectNode(node, node.SelectionState !== 'Selected')

/* ------------------------------------------------------------------ *
 * Expand / collapse
 * ------------------------------------------------------------------ */

const raiseNodeEvent = (
  name: 'expanding' | 'collapsed',
  node: TreeNode
) => {
  // Expanding/Collapsed expose TreeViewNode.Content even though collection
  // APIs expose the TreeViewNode itself while RootNodes mode is active.
  const args = { Node: node, Item: node.Content }
  const eventName = name === 'expanding' ? 'Expanding' : 'Collapsed'
  emit(eventName, treeViewApi, args)
  const handlerName = name === 'expanding' ? 'Expanding' : 'Collapsed'
  resolveXamlHandler(attrs[handlerName], instance)?.(treeViewApi, args)
}

function Expand(node: TreeNode) {
  if (node.IsExpanded || (!node.Children.length && !node.HasUnrealizedChildren)) return
  node.IsExpanded = true
  bumpTree()
  raiseNodeEvent('expanding', node)
}

function Collapse(node: TreeNode) {
  if (!node.IsExpanded) return
  const focusedDescendant = activeNode.value ? isAncestorOf(node, activeNode.value) : false
  node.IsExpanded = false
  if (focusedDescendant) activeNode.value = node
  bumpTree()
  raiseNodeEvent('collapsed', node)
  if (focusedDescendant) nextTick(() => focusNode(node))
}

const toggleExpand = (node: TreeNode) => {
  if (node.IsExpanded) Collapse(node)
  else Expand(node)
}

const onChevronPointerDown = (event: PointerEvent, entry: TreeRow) => {
  if (!isEnabled.value || !entry.hasChildren) return
  event.preventDefault()
  event.stopPropagation()
  activeNode.value = entry.node
  toggleExpand(entry.node)
}

const raiseItemInvoked = (item: unknown) => {
  const args = { InvokedItem: item, Handled: false }
  emit('ItemInvoked', treeViewApi, args)
  resolveXamlHandler(attrs.ItemInvoked, instance)?.(treeViewApi, args)
}

/* ------------------------------------------------------------------ *
 * Keyboard — TreeViewItem::OnKeyDown / HandleExpandCollapse / HandleReorder.
 * ------------------------------------------------------------------ */

const isDirectionalKey = (key: string) =>
  key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight'

const rowElements = () =>
  Array.from(listRef.value?.querySelectorAll<HTMLElement>('.win-tree-item') ?? [])

const focusRowAt = (index: number) => {
  const row = rows.value[index]
  if (!row) return
  activeNode.value = row.node
  rowElements()[index]?.focus()
}

const focusNode = (node: TreeNode) => {
  const index = flatNodes.value.indexOf(node)
  if (index >= 0) focusRowAt(index)
}

const onRowKeyDown = (event: KeyboardEvent, entry: TreeRow) => {
  if (!isEnabled.value) return
  const node = entry.node

  // Shift+Alt+Arrow reorders; any modifier suppresses expand/collapse.
  if (canReorderItems.value && isDirectionalKey(event.key)
    && event.shiftKey && event.altKey && !event.ctrlKey) {
    event.preventDefault()
    reorderByKeyboard(node, event.key)
    return
  }

  if (isDirectionalKey(event.key) && !event.shiftKey && !event.altKey && !event.ctrlKey) {
    // RightToLeft inverts which arrow collapses and which expands.
    const reversed = direction.value === 'rtl'
    const collapseKey = (!reversed && event.key === 'ArrowLeft') || (reversed && event.key === 'ArrowRight')
    const expandKey = (!reversed && event.key === 'ArrowRight') || (reversed && event.key === 'ArrowLeft')
    let handled = false
    if (collapseKey) {
      if (node.IsExpanded) {
        Collapse(node)
        focusNode(node)
        handled = true
      } else if (node.Parent) {
        focusNode(node.Parent)
        handled = true
      }
    } else if (expandKey) {
      if (!node.IsExpanded && (node.Children.length || node.HasUnrealizedChildren)) {
        Expand(node)
        handled = true
      } else if (node.Children.length) {
        focusNode(node.Children[0])
        handled = true
      }
    }
    if (handled) {
      event.preventDefault()
      return
    }
  }

  // Space toggles the multi-select checkbox; TreeViewItem handles it only then.
  if (event.key === ' ' && selectionMode.value === 'Multiple') {
    event.preventDefault()
    toggleNode(node)
    return
  }

  if (event.key === 'Enter') {
    // Enter is not handled by TreeViewItem: it reaches ListView, which raises
    // ItemClick -> TreeView.ItemInvoked.
    event.preventDefault()
    raiseItemInvoked(node.Item)
    return
  }

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    const next = entry.index + (event.key === 'ArrowDown' ? 1 : -1)
    if (next >= 0 && next < rows.value.length) {
      event.preventDefault()
      focusRowAt(next)
    }
    return
  }

  if (event.key === ' ' && selectionMode.value === 'Single') {
    event.preventDefault()
    selectNode(node, true)
    return
  }

  if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault()
    focusRowAt(event.key === 'Home' ? 0 : rows.value.length - 1)
    return
  }

  if (event.key === 'PageDown' || event.key === 'PageUp') {
    event.preventDefault()
    const viewport = containerRef.value?.querySelector<HTMLElement>('.win-scroll-viewer-viewport')
    const stride = viewport ? Math.max(1, Math.floor(viewport.clientHeight / 32)) : 5
    const delta = event.key === 'PageDown' ? stride : -stride
    const next = Math.min(rows.value.length - 1, Math.max(0, entry.index + delta))
    const element = rowElements()[next]
    element?.focus()
    element?.scrollIntoView({ block: 'nearest' })
  }
}

const reorderByKeyboard = (node: TreeNode, key: string) => {
  const siblings = node.Parent ? node.Parent.Children : nodes.value
  const position = siblings.indexOf(node)
  if (position < 0) return
  const movingBack = key === 'ArrowUp' || (key === 'ArrowLeft' && position !== 0)
  const movingForward = key === 'ArrowDown' || key === 'ArrowRight'
  if (movingBack) {
    if (position <= 0) return
    siblings.splice(position, 1)
    siblings.splice(position - 1, 0, node)
  } else if (movingForward) {
    if (position >= siblings.length - 1) return
    siblings.splice(position, 1)
    siblings.splice(position + 1, 0, node)
  } else {
    return
  }
  // HandleReorder collapses an expanded node before moving it.
  if (node.IsExpanded) Collapse(node)
  bumpTree()
  emitSourceChange()
  nextTick(() => focusNode(node))
}

/* ------------------------------------------------------------------ *
 * Projection back to the page's data shape.
 * ------------------------------------------------------------------ */

/**
 * Project the live node tree onto the page's data shape. Children are written
 * back into the same array the item declared (Children or ItemsSource) so a
 * replaced source round-trips through the same contract, and so the identity
 * of that collection is preserved across repeated drops.
 */
const sameIdentitySequence = (left: readonly unknown[], right: readonly unknown[]) =>
  left.length === right.length && left.every((value, index) => value === right[index])

const projectNode = (node: TreeNode): unknown => {
  const source = node.IsContentMode ? node.Content : node.SourceItem
  if (source && typeof source === 'object') {
    const target = source as TreeItem
    const next = node.Children.map(projectNode)
    const collection = Array.isArray(target.Children)
      ? target.Children as unknown[]
      : Array.isArray(target.ItemsSource)
        ? target.ItemsSource as unknown[]
        : null
    if (collection) {
      if (!sameIdentitySequence(collection, next)) collection.splice(0, collection.length, ...next)
      node.ChildrenSource = collection
    } else if (next.length) {
      node.ChildrenSource = next
      target.Children = next
    }
  }
  return source
}

const emitSourceChange = () => {
  synchronizingSource = true
  const projected = nodes.value.map(projectNode)
  const collection = rootSource.value.collection
  if (collection && collection !== projected && !sameIdentitySequence(collection, projected)) {
    collection.splice(0, collection.length, ...projected)
  }
  emittedSource = collection ?? projected
  emit(rootSource.value.isContentMode ? 'update:ItemsSource' : 'update:RootNodes', emittedSource)
  nextTick(() => {
    synchronizingSource = false
    emittedSource = null
  })
}

notifyNodeVectorChanged = (parent) => {
  if (parent) {
    for (const child of parent.Children) reindexNode(child, parent.Depth + 1)
    if (selectionMode.value === 'Multiple') {
      applyNodeSelection(parent, selectionStateBasedOnChildren(parent))
      updateSelectionStateOfAncestors(parent)
    }
  } else {
    for (const node of nodes.value) reindexNode(node, 0)
  }
  if (activeNode.value && !allNodesFrom(nodes.value).includes(activeNode.value)) {
    activeNode.value = parent ?? flatNodes.value[0] ?? null
  }
  bumpTree()
  syncSelectionVectors()
  emitSourceChange()
}

/* ------------------------------------------------------------------ *
 * Drag and drop — TreeViewList::OnDragOver / MoveNodeInto / OnDrop.
 * ------------------------------------------------------------------ */

type PointerTreeDragDetail = {
  session: SharedTreeDrag
  clientX: number
  clientY: number
  accepted: boolean
  dropResult: 'None' | 'Move'
  newParentItem: unknown
}

const pointerDragOwner = Symbol('winuionweb-treeview-drag-owner')
const pointerDragOverEvent = 'winuionweb-treeview-pointer-drag-over'
const pointerDragLeaveEvent = 'winuionweb-treeview-pointer-drag-leave'
const pointerDropEvent = 'winuionweb-treeview-pointer-drop'

const DRAG_THRESHOLD = 8
const TOUCH_DRAG_HOLD_DELAY = 350
const LIVE_REORDER_DELAY = 200
const EDGE_SCROLL_SIZE = 100
const EDGE_SCROLL_DELAY = 50
const EDGE_SCROLL_MIN_SPEED = 150
const EDGE_SCROLL_MAX_SPEED = 1500
/** TreeViewItem: c_dragOverInterval — one second of hover expands a folder. */
const DRAG_OVER_EXPAND_DELAY = 1000

const isDragging = ref(false)
const isExternalDragOver = ref(false)
const dragNodes = ref<TreeNode[]>([])
/** Visible rows represented by the dragged subtree roots. */
const dragVisualNodes = ref<TreeNode[]>([])
const primaryDragNode = shallowRef<TreeNode | null>(null)
const dragItemCount = ref(0)
const dropSlot = ref(-1)
const dropMode = ref<'before' | 'after' | 'inside' | null>(null)
const dragOverIndex = ref(-1)
const reorderOffsets = ref(new Map<number, number>())

type TreeDragLayoutEntry = {
  node: TreeNode
  index: number
  top: number
  bottom: number
  midY: number
  height: number
  slotSize: number
}

let cachedDragLayout: TreeDragLayoutEntry[] = []
let dragLayoutScrollTop = 0
let dragScrollViewport: HTMLElement | null = null
let pendingDropSlot = -1
let pendingDropMode: 'before' | 'after' | 'inside' | null = null
let pendingDragOverIndex = -1
let liveReorderTimer: number | undefined
let externalDragHeight = 0
let latestPointerPosition: { x: number; y: number } | null = null
let edgeScrollStartTimer: number | undefined
let edgeScrollFrame: number | undefined
let edgeScrollVelocity = 0
let edgeScrollLastTime = 0
let edgeScrollViewport: HTMLElement | null = null

const pointerDrag = shallowRef<{
  pointerId: number
  pointerType: string
  index: number
  startX: number
  startY: number
  grabX: number
  grabY: number
  source: HTMLElement
} | null>(null)
const pointerDragActive = ref(false)
let pointerDragDetail: PointerTreeDragDetail | null = null
let dragPreviewElement: HTMLElement | null = null
let pointerDropTarget: HTMLElement | null = null
let nativeDragSession: SharedTreeDrag | null = null
let targetDragSession: SharedTreeDrag | null = null
let suppressClickUntil = 0
let expandTimer: number | undefined
let pendingExpandNode: TreeNode | null = null
let touchDragTimer: number | undefined

const clearTouchDragTimer = () => {
  if (touchDragTimer !== undefined) window.clearTimeout(touchDragTimer)
  touchDragTimer = undefined
}

const clearExpandTimer = () => {
  if (expandTimer !== undefined) window.clearTimeout(expandTimer)
  expandTimer = undefined
  pendingExpandNode = null
}

const armExpandTimer = (node: TreeNode | null) => {
  if (node === pendingExpandNode) return
  clearExpandTimer()
  if (!node || node.IsExpanded || (!node.Children.length && !node.HasUnrealizedChildren)) return
  pendingExpandNode = node
  expandTimer = window.setTimeout(() => {
    expandTimer = undefined
    if (pendingExpandNode === node && !node.IsExpanded) Expand(node)
    pendingExpandNode = null
  }, DRAG_OVER_EXPAND_DELAY)
}

const isAncestorOf = (candidate: TreeNode | null, node: TreeNode) => {
  let walk = node.Parent
  while (walk) {
    if (walk === candidate) return true
    walk = walk.Parent
  }
  return false
}

const subtreeRoots = (list: TreeNode[]) =>
  list.filter((node) => !list.some((other) => other !== node && isAncestorOf(other, node)))

const sessionNodes = (session: SharedTreeDrag | null) =>
  (session?.nodes ?? []).filter((node): node is TreeNode => Boolean(node && typeof node === 'object'))

const canDropOn = (node: TreeNode, session: SharedTreeDrag | null) =>
  !sessionNodes(session).some((dragged) => dragged === node || isAncestorOf(dragged, node))

type DragDetachSnapshot = {
  node: TreeNode
  siblings: TreeNode[]
  index: number
  parent: TreeNode | null
  depth: number
}

type DragNodeSnapshot = {
  parent: TreeNode | null
  depth: number
  isExpanded: boolean
  selectionState: TreeNode['SelectionState']
  presentation: Pick<TreeNode, 'Item' | 'Context' | 'IsContentMode' | 'PresenterContent' | 'ContainerProps' | 'Template' | 'HasUnrealizedChildren'>
}

type SourceDragTransaction = {
  detached: DragDetachSnapshot[]
  collections: Map<TreeNode[], TreeNode[]>
  nodeStates: Map<TreeNode, DragNodeSnapshot>
  selectionOrder: TreeNode[]
  activeNode: TreeNode | null
  originSelectionState: TreeNodeSelectionState
}

let sourceDragTransaction: SourceDragTransaction | null = null

const captureDragTransaction = (): SourceDragTransaction => {
  const currentNodes = allNodesFrom(nodes.value)
  return {
    detached: [],
    collections: new Map([nodes.value, ...currentNodes.map((node) => node.Children)].map((list) => [list, [...list]])),
    nodeStates: new Map(currentNodes.map((node) => [node, {
      parent: node.Parent,
      depth: node.Depth,
      isExpanded: node.IsExpanded,
      selectionState: node.SelectionState,
      presentation: {
        Item: node.Item, Context: node.Context, IsContentMode: node.IsContentMode,
        PresenterContent: node.PresenterContent, ContainerProps: node.ContainerProps,
        Template: node.Template, HasUnrealizedChildren: node.HasUnrealizedChildren
      }
    }])),
    selectionOrder: [...selectionOrder],
    activeNode: activeNode.value,
    originSelectionState: rootSelectionState.value
  }
}

const beginSourceDragTransaction = () => {
  sourceDragTransaction ??= captureDragTransaction()
}

const commitSourceDragTransaction = () => {
  sourceDragTransaction = null
}

const restoreDragTransaction = (transaction: SourceDragTransaction) => {
  for (const [list, contents] of transaction.collections) {
    vectorStateOf(list)?.restoreSnapshot?.(contents)
  }
  for (const [node, snapshot] of transaction.nodeStates) {
    node.Parent = snapshot.parent
    node.Depth = snapshot.depth
    node.IsExpanded = snapshot.isExpanded
    node.SelectionState = snapshot.selectionState
    Object.assign(node, snapshot.presentation)
    itemComponentCache.delete(node)
  }
  for (const node of nodes.value) rehomeNodeVectorOwner(node, node.IsContentMode)
  replaceSelectionOrder(transaction.selectionOrder)
  activeNode.value = transaction.activeNode
  rootSelectionState.value = transaction.originSelectionState
  bumpTree()
  syncSelectionVectors()
}

const rollbackSourceDragTransaction = () => {
  const transaction = sourceDragTransaction
  sourceDragTransaction = null
  if (transaction) restoreDragTransaction(transaction)
}

const detachOwnedNode = (value: unknown) => {
  const node = value as TreeNode
  const oldParent = node.Parent
  const siblings = oldParent ? oldParent.Children : nodes.value
  const index = siblings.indexOf(node)
  if (index < 0) return false
  if (sourceDragTransaction && !sourceDragTransaction.detached.some((entry) => entry.node === node)) {
    sourceDragTransaction.detached.push({
      node,
      siblings,
      index,
      parent: oldParent,
      depth: node.Depth
    })
  }
  siblings.splice(index, 1)
  // SelectedNodeChildrenChanged recomputes the source ancestors when a
  // selected child leaves.  This must run in the source TreeView because a
  // cross-tree target can use a different SelectionMode.
  if (selectionMode.value === 'Multiple' && oldParent?.Children.length) {
    applyNodeSelection(oldParent, selectionStateBasedOnChildren(oldParent))
    updateSelectionStateOfAncestors(oldParent)
  }
  return true
}

const raiseDragCompleted = (items: unknown[], dropResult: 'None' | 'Move', newParentItem: unknown) => {
  const args = { Items: items, DropResult: dropResult, NewParentItem: newParentItem }
  emit('DragItemsCompleted', treeViewApi, args)
  resolveXamlHandler(attrs.DragItemsCompleted, instance)?.(treeViewApi, args)
}

const createDragSession = (dragged: TreeNode[], eventItems: unknown[]): SharedTreeDrag => {
  const selectionBefore = [...selectedItems.value]
  const session: SharedTreeDrag = {
    owner: pointerDragOwner,
    nodes: [...dragged],
    items: eventItems,
    beginTransaction: beginSourceDragTransaction,
    commitTransaction: commitSourceDragTransaction,
    rollbackTransaction: rollbackSourceDragTransaction,
    detach: detachOwnedNode,
    commitSource: () => {
      if (activeNode.value && !allNodesFrom(nodes.value).includes(activeNode.value)) {
        activeNode.value = flatNodes.value[0] ?? null
      }
      bumpTree()
      try {
        raiseSelectionDiff(selectionBefore)
      } finally {
        emitSourceChange()
      }
    },
    complete: (dropResult, newParentItem) => {
      if (session.completed) return
      session.completed = true
      try {
        if (dropResult === 'None') rollbackSourceDragTransaction()
        else commitSourceDragTransaction()
        raiseDragCompleted(session.items, dropResult, newParentItem)
      } finally {
        session.cleanup()
      }
    },
    cleanup: () => resetDrag(),
    completed: false
  }
  return session
}

const beginSourceDrag = (entry: TreeRow, data: unknown) => {
  const selected = [...selectedNodeList.value]
  const multiple = selectionMode.value === 'Multiple' && selected.length > 0
  // TreeViewList moves the selected subtree roots whenever multi-select has a
  // selection. It replaces DragItemsStarting.Items only when more than one
  // item is selected; for one selected item the underlying dragged row stays
  // in the event vector.
  const eventNodes = multiple && selected.length > 1 ? selected : [entry.node]
  const dragged = subtreeRoots(multiple ? selected : [entry.node])
  const eventItems = eventNodes.map((node) => node.Item)
  const args = { Items: eventItems, Cancel: false, Data: data }
  emit('DragItemsStarting', treeViewApi, args)
  resolveXamlHandler(attrs.DragItemsStarting, instance)?.(treeViewApi, args)
  if (args.Cancel || !dragged.length) return null

  // Capture the complete source state before TreeView collapses the dragged
  // branch.  This is the state PointerDrag/DragItemsStarting cancellation must
  // restore if a target rejects the drop or a move throws midway through.
  beginSourceDragTransaction()

  try {
    if (!multiple) {
      for (const node of dragged) {
        if (node.IsExpanded) Collapse(node)
      }
    }
    dragNodes.value = dragged
    dragVisualNodes.value = rows.value
      .filter((row) => dragged.some((root) => row.node === root || isAncestorOf(root, row.node)))
      .map((row) => row.node)
    primaryDragNode.value = entry.node
    dragItemCount.value = multiple ? eventNodes.length : 1
    isDragging.value = true
    return createDragSession(dragged, eventItems)
  } catch (error) {
    rollbackSourceDragTransaction()
    resetDrag()
    throw error
  }
}

const updateReorderOffsets = () => updateTreeReorderOffsets()

const clearDropFeedback = () => {
  stopTreeEdgeScroll()
  if (liveReorderTimer !== undefined) {
    window.clearTimeout(liveReorderTimer)
    liveReorderTimer = undefined
  }
  pendingDropSlot = -1
  pendingDropMode = null
  pendingDragOverIndex = -1
  dropSlot.value = -1
  dropMode.value = null
  dragOverIndex.value = -1
  isExternalDragOver.value = false
  targetDragSession = null
  clearExpandTimer()
  updateTreeReorderOffsets()
}

const resolveDropTarget = (entry: TreeRow, clientY: number) => {
  const baseline = cachedDragLayout.find((candidate) => candidate.node === entry.node)
  if (!baseline) return
  const relative = (clientY - baseline.top) / Math.max(1, baseline.height)
  // TreeViewList drops INTO a row in its middle band; the outer bands insert
  // before/after it within its parent's children.
  const mode: 'before' | 'after' | 'inside' = relative < 0.2
    ? 'before'
    : relative > 0.8 ? 'after' : 'inside'
  scheduleTreeLiveReorder(mode === 'after' ? entry.index + 1 : entry.index, mode, entry.index)
  armExpandTimer(mode === 'inside' ? entry.node : null)
}

const addDragCountToPreview = (preview: HTMLElement) => {
  if (dragItemCount.value <= 1 || preview.querySelector('.win-tree-drag-count')) return
  const slot = preview.querySelector('.win-tree-multiselect-slot')
  if (!slot) return
  const badge = document.createElement('span')
  badge.className = 'win-tree-drag-count'
  badge.setAttribute('aria-hidden', 'true')
  badge.textContent = String(dragItemCount.value)
  slot.appendChild(badge)
}

const startPointerDrag = (event: PointerEvent, entry: TreeRow, force = false) => {
  const pending = pointerDrag.value
  if (!pending || pointerDragActive.value || !canDragItems.value) return
  if (!force && Math.hypot(event.clientX - pending.startX, event.clientY - pending.startY) < DRAG_THRESHOLD) return

  clearTouchDragTimer()
  const source = pending.source
  const session = beginSourceDrag(entry, null)
  if (!session) {
    pointerDrag.value = null
    return
  }
  pointerDragActive.value = true
  cacheTreeDragLayout()
  nextTick(() => {
    if (pointerDragActive.value) cacheTreeDragLayout()
  })
  pendingDropSlot = -1
  pendingDropMode = null
  pendingDragOverIndex = -1
  externalDragHeight = 0

  const preview = source.cloneNode(true) as HTMLElement
  preview.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'))
  preview.removeAttribute('id')
  preview.classList.remove('dragging-source', 'reorder-target')
  preview.classList.add('win-tree-drag-preview')
  preview.style.pointerEvents = 'none'
  // Vue applies the MultipleDraggingPrimary state on its next render.  The
  // drag image must be created synchronously during the pointer gesture, so
  // mirror the count into the clone instead of depending on that render.
  addDragCountToPreview(preview)
  const rect = source.getBoundingClientRect()
  Object.assign(preview.style, {
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    margin: '0',
    left: '0',
    top: '0'
  })
  document.body.appendChild(preview)
  dragPreviewElement = preview
  preview.style.transform = `translate3d(${event.clientX - pending.grabX}px, ${event.clientY - pending.grabY}px, 0)`

  pointerDragDetail = {
    session,
    clientX: event.clientX,
    clientY: event.clientY,
    accepted: false,
    dropResult: 'None',
    newParentItem: null
  }
}

/**
 * Find the tree under a point. The source TreeView is resolved from its own
 * bounds, so a drag it owns never depends on hit-testing (which a transient
 * overlay or the drag ghost can perturb). Other trees are found through
 * `elementsFromPoint` so cross-container drops still work.
 */
const treeViewAtPoint = (clientX: number, clientY: number) => {
  const own = containerRef.value
  if (own) {
    const rect = own.getBoundingClientRect()
    if (clientX >= rect.left && clientX <= rect.right
      && clientY >= rect.top && clientY <= rect.bottom) {
      return own
    }
  }
  const stack = document.elementsFromPoint(clientX, clientY)
  for (const element of stack) {
    const tree = element.closest<HTMLElement>('.win-tree-view')
    if (tree) return tree
  }
  return null
}

/** The row whose cached arranged rect contains the point, independent of overlays. */
const rowAtPoint = (clientX: number, clientY: number) => {
  if (!cachedDragLayout.length) cacheTreeDragLayout()
  const viewportRect = listRef.value?.getBoundingClientRect()
  if (viewportRect && (clientX < viewportRect.left || clientX > viewportRect.right)) return null
  for (const layout of cachedDragLayout) {
    const index = rows.value.findIndex((row) => row.node === layout.node)
    if (index < 0) continue
    if (clientY >= layout.top && clientY <= layout.bottom) {
      const element = rowElements()[index]
      const entry = rows.value[index]
      if (entry) return { entry, element }
    }
  }
  return null
}

const updatePointerDropTarget = (clientX: number, clientY: number) => {
  const detail = pointerDragDetail
  if (!detail) return
  detail.clientX = clientX
  detail.clientY = clientY
  latestPointerPosition = { x: clientX, y: clientY }
  const nextTarget = treeViewAtPoint(clientX, clientY)
  const previousTarget = pointerDropTarget
  if (pointerDropTarget && pointerDropTarget !== nextTarget) {
    pointerDropTarget.dispatchEvent(new CustomEvent<PointerTreeDragDetail>(pointerDragLeaveEvent, { detail }))
    pointerDropTarget = null
    clearExpandTimer()
  }
  if (!nextTarget) return
  detail.accepted = false
  nextTarget.dispatchEvent(new CustomEvent<PointerTreeDragDetail>(pointerDragOverEvent, { detail }))
  if (!detail.accepted && previousTarget === nextTarget) {
    nextTarget.dispatchEvent(new CustomEvent<PointerTreeDragDetail>(pointerDragLeaveEvent, { detail }))
  }
  pointerDropTarget = detail.accepted ? nextTarget : null
  isExternalDragOver.value = Boolean(pointerDropTarget) && !isDragging.value
}

/**
 * Resolve a drop target from a root-local point using the rows' own geometry.
 * This is the same 20/60/20 band the native DragOver path uses, so a pointer
 * drag, an external drop and a browser drag all land in the same slot.
 */
const trackPointerOverPoint = (clientX: number, clientY: number) => {
  const session = targetDragSession
  if (!session) return false
  if (!cachedDragLayout.length) cacheTreeDragLayout()
  const hit = rowAtPoint(clientX, clientY)
  if (!hit) {
    if (!cachedDragLayout.length) {
      scheduleTreeLiveReorder(0, 'after', -1, true)
      clearExpandTimer()
      return true
    }
    const first = cachedDragLayout[0]
    const last = cachedDragLayout[cachedDragLayout.length - 1]
    if (clientY < first.top) {
      scheduleTreeLiveReorder(first.index, 'before', first.index, true)
      dragOverIndex.value = first.index
      return true
    }
    if (clientY > last.bottom) {
      scheduleTreeLiveReorder(last.index + 1, 'after', last.index, true)
      dragOverIndex.value = last.index
      return true
    }
    scheduleTreeLiveReorder(-1, null, -1, true)
    clearExpandTimer()
    return false
  }
  if (!canDropOn(hit.entry.node, session)) {
    scheduleTreeLiveReorder(-1, null, -1, true)
    clearExpandTimer()
    return false
  }
  resolveDropTarget(hit.entry, clientY)
  return true
}

/** A TreeView only accepts a pointer drag when it is a valid drop target. */
const onPointerTreeDragOver = (event: Event) => {
  const detail = (event as CustomEvent<PointerTreeDragDetail>).detail
  if (!detail) return
  detail.accepted = false
  if (!allowDrop.value || !isEnabled.value) {
    clearDropFeedback()
    return
  }
  const ownsDrag = detail.session.owner === pointerDragOwner
  if (ownsDrag && !canReorderItems.value) {
    clearDropFeedback()
    return
  }
  targetDragSession = detail.session
  latestPointerPosition = { x: detail.clientX, y: detail.clientY }
  isExternalDragOver.value = !ownsDrag
  if (!cachedDragLayout.length) cacheTreeDragLayout()
  externalDragHeight = ownsDrag
    ? 0
    : Math.max(1, sessionNodes(detail.session).reduce((total, node) => {
      const layout = cachedDragLayout.find((entry) => entry.node === node)
      return total + (layout?.slotSize ?? layout?.height ?? 32)
    }, 0))
  detail.accepted = trackPointerOverPoint(detail.clientX, detail.clientY)
  if (detail.accepted) {
    const args = raiseDragEvent('dragOver', null, containerRef.value, 'Move')
    detail.accepted = args.AcceptedOperation === 'Move'
  }
  if (!detail.accepted) {
    clearDropFeedback()
  } else {
    updateTreeEdgeScroll(detail.clientY)
  }
  if (!ownsDrag) isExternalDragOver.value = detail.accepted
}

const onPointerTreeDragLeave = (event: Event) => {
  const detail = (event as CustomEvent<PointerTreeDragDetail>).detail
  if (!detail) return
  clearDropFeedback()
}

const onPointerTreeDrop = (event: Event) => {
  const detail = (event as CustomEvent<PointerTreeDragDetail>).detail
  if (!detail || !isEnabled.value) return
  const ownsDrag = detail.session.owner === pointerDragOwner
  if (!allowDrop.value) return
  if (ownsDrag && !canReorderItems.value) return
  targetDragSession = detail.session
  flushTreeLiveReorder()
  detail.dropResult = 'None'
  detail.newParentItem = null
  let outcome = { moved: false, newParentItem: null as unknown }
  try {
    const args = raiseDragEvent('drop', null, containerRef.value, 'Move')
    outcome = args.AcceptedOperation === 'Move'
      ? applyDrop(detail.session)
      : outcome
  } catch (error) {
    try {
      detail.session.rollbackTransaction?.()
    } catch (rollbackError) {
      console.error('TreeView pointer drop rollback failed.', rollbackError)
    }
    console.error('TreeView pointer drop failed.', error)
  }
  detail.dropResult = outcome.moved ? 'Move' : 'None'
  detail.newParentItem = outcome.newParentItem
}

const onRowPointerDown = (event: PointerEvent, entry: TreeRow) => {
  if (!isEnabled.value || !event.isPrimary || event.button !== 0) return
  activeNode.value = entry.node
  if ((event.target as HTMLElement | null)?.closest('.win-tree-chevron')) return
  if (!canDragItems.value) return
  // ListView's captured Pointer path handles mouse, touch and pen uniformly.
  // Native DragOver/Drop remains available for an external browser drag.
  const source = event.currentTarget as HTMLElement
  const rect = source.getBoundingClientRect()
  pointerDrag.value = {
    pointerId: event.pointerId,
    pointerType: event.pointerType,
    index: entry.index,
    startX: event.clientX,
    startY: event.clientY,
    grabX: event.clientX - rect.left,
    grabY: event.clientY - rect.top,
    source
  }
  clearTouchDragTimer()
  if (event.pointerType === 'touch') {
    touchDragTimer = window.setTimeout(() => {
      if (pointerDrag.value?.pointerId === event.pointerId) startPointerDrag(event, entry, true)
    }, TOUCH_DRAG_HOLD_DELAY)
  }
  try {
    source.setPointerCapture?.(event.pointerId)
  } catch {
    // A cancelled pointer cannot be captured; document listeners still run.
  }
}

const onRowPointerMove = (event: PointerEvent, entry: TreeRow) => {
  const pending = pointerDrag.value
  if (!pending || pending.pointerId !== event.pointerId || !canDragItems.value) return
  if (!pointerDragActive.value && pending.pointerType === 'touch') {
    const deltaX = event.clientX - pending.startX
    const deltaY = event.clientY - pending.startY
    if (Math.abs(deltaX) >= DRAG_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
      startPointerDrag(event, entry)
    } else if (Math.abs(deltaY) >= DRAG_THRESHOLD) {
      clearTouchDragTimer()
      releasePointerCapture()
      pointerDrag.value = null
    }
    if (!pointerDragActive.value) return
  }
  if (!pointerDragActive.value) startPointerDrag(event, entry)
  if (!pointerDragActive.value) return
  latestPointerPosition = { x: event.clientX, y: event.clientY }
  if (dragPreviewElement) {
    dragPreviewElement.style.transform = `translate3d(${event.clientX - pending.grabX}px, ${event.clientY - pending.grabY}px, 0)`
  }
  // The tree under the pointer owns the drop target geometry; ask it to
  // resolve the slot, then reflect the result for the ghost's position.
  updatePointerDropTarget(event.clientX, event.clientY)
  event.preventDefault()
}

const releasePointerCapture = () => {
  const pending = pointerDrag.value
  if (!pending) return
  try {
    if (pending.source.hasPointerCapture?.(pending.pointerId)) {
      pending.source.releasePointerCapture?.(pending.pointerId)
    }
  } catch {
    // Capture may already be gone.
  }
}

const onRowPointerUp = (event?: PointerEvent) => {
  clearTouchDragTimer()
  if (pointerDragActive.value) {
    suppressClickUntil = Date.now() + 250
    if (event) updatePointerDropTarget(event.clientX, event.clientY)
    const detail = pointerDragDetail
    releasePointerCapture()
    try {
      if (pointerDropTarget && detail) {
        pointerDropTarget.dispatchEvent(new CustomEvent<PointerTreeDragDetail>(pointerDropEvent, { detail }))
      }
    } catch (error) {
      console.error('TreeView pointer drop dispatch failed.', error)
    } finally {
      try {
        detail?.session.complete(detail.dropResult, detail.newParentItem)
      } catch (error) {
        console.error('TreeView drag completion handler failed.', error)
      } finally {
        resetDrag()
      }
    }
    return
  }
  pointerDrag.value = null
  pointerDragActive.value = false
}

const onRowPointerCancel = (_event?: PointerEvent) => {
  clearTouchDragTimer()
  if (!pointerDrag.value && !pointerDragActive.value) return
  try {
    if (pointerDragActive.value) pointerDragDetail?.session.complete('None', null)
  } catch (error) {
    console.error('TreeView drag cancellation handler failed.', error)
  } finally {
    releasePointerCapture()
    resetDrag()
  }
}

const onRowPointerLeave = (event: PointerEvent, _entry?: TreeRow) => {
  if (event.pointerType === 'mouse' && !pointerDragActive.value) pointerDrag.value = null
}

const onRowLostPointerCapture = (event: PointerEvent) => {
  if (pointerDrag.value?.pointerId !== event.pointerId) return
  if (pointerDragActive.value) return
  clearTouchDragTimer()
  pointerDrag.value = null
}

const resetDrag = () => {
  try {
    if (pointerDropTarget && pointerDragDetail) {
      pointerDropTarget.dispatchEvent(new CustomEvent<PointerTreeDragDetail>(pointerDragLeaveEvent, { detail: pointerDragDetail }))
    }
  } catch (error) {
    console.error('TreeView drag-leave cleanup failed.', error)
  } finally {
    clearTouchDragTimer()
    clearExpandTimer()
    stopTreeEdgeScroll()
    if (liveReorderTimer !== undefined) window.clearTimeout(liveReorderTimer)
    liveReorderTimer = undefined
    pendingDropSlot = -1
    pendingDropMode = null
    pendingDragOverIndex = -1
    cachedDragLayout = []
    dragScrollViewport = null
    latestPointerPosition = null
    externalDragHeight = 0
    pointerDropTarget = null
    releasePointerCapture()
    dragPreviewElement?.remove()
    dragPreviewElement = null
    pointerDragDetail = null
    isDragging.value = false
    isExternalDragOver.value = false
    dragNodes.value = []
    dragVisualNodes.value = []
    primaryDragNode.value = null
    dragItemCount.value = 0
    dropSlot.value = -1
    dropMode.value = null
    dragOverIndex.value = -1
    reorderOffsets.value = new Map()
    pointerDrag.value = null
    pointerDragActive.value = false
    targetDragSession = null
  }
}

const reindex = (node: TreeNode, depth: number) => {
  node.Depth = depth
  for (const child of node.Children) reindex(child, depth + 1)
}

const adoptNodeMode = (node: TreeNode, isContentMode: boolean) => {
  node.IsContentMode = isContentMode
  node.Item = isContentMode ? node.Content : node
  node.Context = isContentMode ? itemContext(node.Content) : node
  const root = treeViewItemRoot(node.Context)
  node.ContainerProps = (root?.props ?? {}) as Record<string, unknown>
  const containerContent = resolveXamlValue(node.ContainerProps.Content, instance)
  node.PresenterContent = containerContent !== undefined ? containerContent : node.Content
  node.HasUnrealizedChildren = declaredFlag(isContentMode ? node.Content : node.SourceItem, root, 'HasUnrealizedChildren')
  const contentNodes = root ? getVNodeChildren(root) : []
  node.Template = contentNodes.length
    ? materializeXamlVNode(contentNodes, node.Context, instance) as VNode[]
    : null
  itemComponentCache.delete(node)
  for (const child of node.Children) adoptNodeMode(child, isContentMode)
}

/** MoveNodeInto: the dragged subtrees become children of `target`. */
const moveNodesInto = (session: SharedTreeDrag, target: TreeNode) => {
  const moved: TreeNode[] = []
  for (const node of subtreeRoots(sessionNodes(session))) {
    if (node === target || isAncestorOf(node, target)) continue
    if (!session.detach(node)) continue
    node.Parent = target
    target.Children.push(node)
    reindex(node, target.Depth + 1)
    moved.push(node)
  }
  if (moved.length) Expand(target)
  return moved
}

/** Insert the dragged subtrees beside `reference` within its own parent. */
const insertNodesAt = (session: SharedTreeDrag, reference: TreeNode, before: boolean) => {
  const siblings = reference.Parent ? reference.Parent.Children : nodes.value
  if (!siblings.includes(reference)) return []
  // Every moved node is detached from wherever it currently lives first, so a
  // cross-parent move never leaves a copy behind in the old collection.
  const moving = subtreeRoots(sessionNodes(session))
    .filter((node) => node !== reference && !isAncestorOf(node, reference))
    .filter((node) => session.detach(node))
  // The reference index is read after detachment because removing a sibling
  // from the same array shifts it.
  let insertAt = siblings.indexOf(reference) + (before ? 0 : 1)
  for (const node of moving) {
    siblings.splice(insertAt, 0, node)
    insertAt += 1
    node.Parent = reference.Parent
    reindex(node, reference.Depth)
  }
  return moving
}

/**
 * Apply the resolved drop: MoveNodeInto for an inside drop, sibling insert
 * otherwise. Returns the NewParentItem the DragItemsCompleted args report.
 */
const applyDrop = (session: SharedTreeDrag): { moved: boolean; newParentItem: unknown } => {
  const slot = dropSlot.value
  const mode = dropMode.value
  if (!isEnabled.value || slot < 0 || !mode) return { moved: false, newParentItem: null }
  const ownsDrag = session.owner === pointerDragOwner
  const targetSelectionBefore = [...selectedItems.value]
  const movingRoots = subtreeRoots(sessionNodes(session))
  const before = new Map(movingRoots.map((node) => {
    const siblings = node.Parent ? node.Parent.Children : ownsDrag ? nodes.value : []
    return [node, { parent: node.Parent, index: siblings.indexOf(node) }]
  }))

  const reference = rows.value[mode === 'after' ? slot - 1 : slot]?.node
  if (rows.value.length && (!reference || !canDropOn(reference, session))) {
    return { moved: false, newParentItem: null }
  }
  const targetSnapshot = ownsDrag ? null : captureDragTransaction()
  session.beginTransaction?.()
  let movedNodes: TreeNode[] = []
  let newParentItem: unknown = null
  let moved = false
  try {
  if (!reference) {
    movedNodes = subtreeRoots(sessionNodes(session)).filter((node) => session.detach(node))
    for (const node of movedNodes) {
      node.Parent = null
      nodes.value.push(node)
      reindex(node, 0)
    }
  } else {
    if (mode === 'inside') {
      movedNodes = moveNodesInto(session, reference)
      newParentItem = reference.Item
    } else {
      movedNodes = insertNodesAt(session, reference, mode === 'before')
      newParentItem = reference.Parent?.Item ?? null
    }
  }
  if (!movedNodes.length) {
    session.rollbackTransaction?.()
    if (targetSnapshot) restoreDragTransaction(targetSnapshot)
    return { moved: false, newParentItem: null }
  }

  for (const node of movedNodes) adoptNodeMode(node, rootSource.value.isContentMode)

  moved = !ownsDrag || movedNodes.some((node) => {
    const previous = before.get(node)
    const siblings = node.Parent ? node.Parent.Children : nodes.value
    return !previous || previous.parent !== node.Parent || previous.index !== siblings.indexOf(node)
  })
  if (!moved) {
    session.rollbackTransaction?.()
    if (targetSnapshot) restoreDragTransaction(targetSnapshot)
    return { moved: false, newParentItem: null }
  }

  if (selectionMode.value === 'Multiple') {
    for (const node of movedNodes) {
      // The hidden origin node is never selected, so a root-level move starts
      // unselected even when another visible root is selected.
      const inheritedState = node.Parent?.SelectionState ?? 'UnSelected'
      applyNodeSelection(node, inheritedState)
      updateSelectionStateOfDescendants(node, inheritedState)
    }
    for (const node of movedNodes) updateSelectionStateOfAncestors(node)
  } else if (selectionMode.value === 'Single') {
    const selectedMoved = allNodesFrom(movedNodes).find((node) => node.SelectionState === 'Selected')
    if (selectedMoved) {
      for (const node of allNodes.value) {
        if (node !== selectedMoved) applyNodeSelection(node, 'UnSelected')
      }
      applyNodeSelection(selectedMoved, 'Selected')
    }
  } else {
    for (const node of allNodesFrom(movedNodes)) applyNodeSelection(node, 'UnSelected')
  }
  session.commitTransaction?.()
  } catch {
    // Restore the target first so it cannot retain nodes also restored to the
    // source. Vector snapshots avoid running a failing selector a second time.
    try {
      if (targetSnapshot) restoreDragTransaction(targetSnapshot)
    } finally {
      session.rollbackTransaction?.()
    }
    return { moved: false, newParentItem: null }
  }
  // Structural commit precedes public notifications. A callback exception is
  // reported without turning the completed move into a DropResult of None.
  try {
    try {
      if (!ownsDrag) session.commitSource()
    } finally {
      bumpTree()
      try {
        raiseSelectionDiff(targetSelectionBefore)
      } finally {
        emitSourceChange()
      }
    }
  } catch (error) {
    console.error('TreeView drop notification failed after the move was committed.', error)
  }
  return { moved: true, newParentItem }
}

const raiseDragEvent = (
  name: 'dragOver' | 'drop',
  dataTransfer: DataTransfer | null,
  originalSource: unknown,
  accepted: 'Move' | 'None'
) => {
  const args = { DataTransfer: dataTransfer, AcceptedOperation: accepted, OriginalSource: originalSource }
  emit(name === 'dragOver' ? 'DragOver' : 'Drop', treeViewApi, args)
  const handlerName = name === 'dragOver' ? 'DragOver' : 'Drop'
  resolveXamlHandler(attrs[handlerName], instance)?.(treeViewApi, args)
  return args
}

const acceptNativeDragAt = (event: DragEvent) => {
  const session = activeNativeTreeDrag
  if (!session || !isEnabled.value || !allowDrop.value) return null
  const ownsDrag = session.owner === pointerDragOwner
  if ((ownsDrag && !canReorderItems.value) || (!ownsDrag && !allowDrop.value)) return null
  targetDragSession = session
  latestPointerPosition = { x: event.clientX, y: event.clientY }
  if (!trackPointerOverPoint(event.clientX, event.clientY)) {
    clearDropFeedback()
    return null
  }
  const args = raiseDragEvent('dragOver', event.dataTransfer, event.target, 'Move')
  if (args.AcceptedOperation !== 'Move') {
    targetDragSession = null
    dropSlot.value = -1
    dropMode.value = null
    dragOverIndex.value = -1
    clearExpandTimer()
    updateReorderOffsets()
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'none'
    return null
  }
  event.preventDefault()
  updateTreeEdgeScroll(event.clientY)
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
  isExternalDragOver.value = !ownsDrag
  return session
}

const onViewportDragOver = (event: DragEvent) => {
  acceptNativeDragAt(event)
}

const onViewportDragLeave = (event: DragEvent) => {
  const related = event.relatedTarget
  if (related instanceof Node && containerRef.value?.contains(related)) return
  clearDropFeedback()
}

const onViewportDrop = (event: DragEvent) => {
  const session = activeNativeTreeDrag
  if (!session) return
  event.preventDefault()
  event.stopPropagation()
  const ownsDrag = session.owner === pointerDragOwner
  let outcome = { moved: false, newParentItem: null as unknown }
  try {
    if (isEnabled.value && allowDrop.value && (!ownsDrag || canReorderItems.value)) {
      targetDragSession = session
      flushTreeLiveReorder()
      const args = raiseDragEvent('drop', event.dataTransfer, event.target, 'Move')
      outcome = args.AcceptedOperation === 'Move'
        ? applyDrop(session)
        : outcome
    }
  } catch (error) {
    try {
      session.rollbackTransaction?.()
    } catch (rollbackError) {
      console.error('TreeView native drop rollback failed.', rollbackError)
    }
    console.error('TreeView native drop failed.', error)
  } finally {
    try {
      session.complete(outcome.moved ? 'Move' : 'None', outcome.newParentItem)
    } catch (error) {
      console.error('TreeView drag completion handler failed.', error)
    } finally {
      if (activeNativeTreeDrag === session) activeNativeTreeDrag = null
      try {
        session.cleanup()
      } finally {
        resetDrag()
      }
    }
  }
}

const onRootDragOver = (event: DragEvent) => {
  if (event.defaultPrevented) return
  acceptNativeDragAt(event)
}

const onRootDrop = (event: DragEvent) => {
  if (event.defaultPrevented || !activeNativeTreeDrag) return
  onViewportDrop(event)
}

const onNativeDragStart = (event: DragEvent, entry: TreeRow) => {
  if (!canDragItems.value || !event.dataTransfer) {
    event.preventDefault()
    return
  }
  activeNode.value = entry.node
  const session = beginSourceDrag(entry, event.dataTransfer)
  if (!session) {
    event.preventDefault()
    return
  }
  nativeDragSession = session
  activeNativeTreeDrag = session
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', String(entry.node.Content ?? ''))

  const source = event.currentTarget as HTMLElement
  const preview = source.cloneNode(true) as HTMLElement
  preview.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'))
  preview.removeAttribute('id')
  preview.classList.remove('dragging-source', 'reorder-target')
  preview.classList.add('win-tree-drag-preview')
  addDragCountToPreview(preview)
  const rect = source.getBoundingClientRect()
  Object.assign(preview.style, {
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    margin: '0',
    left: '-10000px',
    top: '0',
    transform: 'none'
  })
  document.body.appendChild(preview)
  event.dataTransfer.setDragImage(
    preview,
    Math.max(0, event.clientX - rect.left),
    Math.max(0, event.clientY - rect.top)
  )
  window.setTimeout(() => preview.remove(), 0)
}

const onNativeDragEnd = (_event?: DragEvent) => {
  const session = nativeDragSession
  suppressClickUntil = Date.now() + 250
  try {
    if (session && !session.completed) session.complete('None', null)
  } catch (error) {
    console.error('TreeView native drag cancellation handler failed.', error)
  } finally {
    if (activeNativeTreeDrag === session) activeNativeTreeDrag = null
    nativeDragSession = null
    resetDrag()
  }
}

/* ------------------------------------------------------------------ *
 * Pointer selection
 * ------------------------------------------------------------------ */

const onRowClick = (event: MouseEvent, entry: TreeRow) => {
  if (!isEnabled.value || isDragging.value || Date.now() < suppressClickUntil) return
  if ((event.target as HTMLElement | null)?.closest('.win-tree-chevron')) return
  raiseItemInvoked(entry.node.Item)
  // Multi-select is driven by the checkbox, never by clicking the row.
  if (selectionMode.value !== 'Single') return
  selectNode(entry.node, true)
}

/* ------------------------------------------------------------------ *
 * Lifecycle
 * ------------------------------------------------------------------ */

const onGlobalPointerMove = (event: PointerEvent) => {
  const pending = pointerDrag.value
  if (!pending || pending.pointerId !== event.pointerId || !pointerDragActive.value) return
  if (dragPreviewElement) {
    dragPreviewElement.style.transform = `translate3d(${event.clientX - pending.grabX}px, ${event.clientY - pending.grabY}px, 0)`
  }
  updatePointerDropTarget(event.clientX, event.clientY)
}

const onGlobalPointerUp = (event: PointerEvent) => {
  if (pointerDrag.value?.pointerId === event.pointerId) onRowPointerUp(event)
}

const onGlobalPointerCancel = (event: PointerEvent) => {
  if (pointerDrag.value?.pointerId === event.pointerId) onRowPointerCancel()
}

const cancelActiveInteractions = () => {
  const nativeSession = nativeDragSession
  try {
    if (pointerDragActive.value) pointerDragDetail?.session.complete('None', null)
  } catch (error) {
    console.error('TreeView pointer drag cancellation handler failed.', error)
  }
  try {
    if (nativeSession && !nativeSession.completed) nativeSession.complete('None', null)
  } catch (error) {
    console.error('TreeView native drag cancellation handler failed.', error)
  } finally {
    if (activeNativeTreeDrag === nativeSession) activeNativeTreeDrag = null
    nativeDragSession = null
    resetDrag()
  }
}

const onGlobalKeyDown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape' || (!pointerDrag.value && !nativeDragSession)) return
  event.preventDefault()
  cancelActiveInteractions()
}

const onVisibilityChange = () => {
  if (document.visibilityState === 'hidden') cancelActiveInteractions()
}

let globalListenersAttached = false

onMounted(() => {
  const root = containerRef.value
  root?.addEventListener(pointerDragOverEvent, onPointerTreeDragOver)
  root?.addEventListener(pointerDragLeaveEvent, onPointerTreeDragLeave)
  root?.addEventListener(pointerDropEvent, onPointerTreeDrop)
  document.addEventListener('pointermove', onGlobalPointerMove)
  document.addEventListener('pointerup', onGlobalPointerUp)
  document.addEventListener('pointercancel', onGlobalPointerCancel)
  document.addEventListener('keydown', onGlobalKeyDown, true)
  document.addEventListener('visibilitychange', onVisibilityChange)
  window.addEventListener('blur', cancelActiveInteractions)
  globalListenersAttached = true
})

onBeforeUnmount(() => {
  clearExpandTimer()
  if (globalListenersAttached) {
    document.removeEventListener('pointermove', onGlobalPointerMove)
    document.removeEventListener('pointerup', onGlobalPointerUp)
    document.removeEventListener('pointercancel', onGlobalPointerCancel)
    document.removeEventListener('keydown', onGlobalKeyDown, true)
    document.removeEventListener('visibilitychange', onVisibilityChange)
    window.removeEventListener('blur', cancelActiveInteractions)
    globalListenersAttached = false
  }
  const root = containerRef.value
  root?.removeEventListener(pointerDragOverEvent, onPointerTreeDragOver)
  root?.removeEventListener(pointerDragLeaveEvent, onPointerTreeDragLeave)
  root?.removeEventListener(pointerDropEvent, onPointerTreeDrop)
  cancelActiveInteractions()
})

const selectedNode = computed(() => selectedNodeList.value[0] ?? null)
const rowForNode = (node: TreeNode | null) => {
  if (!node) return null
  const index = flatNodes.value.indexOf(node)
  return index >= 0 ? rowElements()[index] ?? null : null
}
const nodeForContainer = (container: unknown) => {
  const element = container instanceof Element
    ? container.closest<HTMLElement>('.win-tree-item')
    : null
  if (!element) return null
  const index = rowElements().indexOf(element)
  return index >= 0 ? flatNodes.value[index] ?? null : null
}

Object.defineProperties(treeViewApi, {
  RootNodes: { enumerable: true, get: () => nodes.value },
  SelectedNodes: { enumerable: true, get: () => selectedNodesProjection.vector },
  SelectedItems: { enumerable: true, get: () => selectedItemsProjection.vector },
  SelectedNode: {
    enumerable: true,
    get: () => selectedNode.value,
    set: (value: unknown) => {
      const node = value && typeof value === 'object' && 'Item' in (value as Record<string, unknown>)
        ? value as TreeNode
        : allNodes.value.find((candidate) => candidate.Item === value) ?? null
      if (node) selectNode(node, true)
    }
  },
  SelectedItem: {
    enumerable: true,
    get: () => selectedNode.value?.Item ?? null,
    set: (value: unknown) => {
      if (value === null || value === undefined) {
        const previous = [...selectedItems.value]
        for (const node of [...selectedNodeList.value]) applyNodeSelection(node, 'UnSelected')
        if (previous.length) raiseSelectionChanged([], previous)
        return
      }
      const node = allNodes.value.find((candidate) => candidate.Item === value)
      if (node) selectNode(node, true)
    }
  },
  NodeFromContainer: { enumerable: true, value: nodeForContainer },
  ContainerFromNode: { enumerable: true, value: rowForNode },
  ItemFromContainer: { enumerable: true, value: (container: unknown) => nodeForContainer(container)?.Item ?? null },
  ContainerFromItem: { enumerable: true, value: (item: unknown) => rowForNode(allNodes.value.find((node) => node.Item === item) ?? null) }
})
Object.assign(treeViewApi, { SelectAll: selectAll, Expand, Collapse })

watch(selectionMode, (mode) => {
  if (mode === 'None' && allNodes.value.some((node) => node.SelectionState !== 'UnSelected')) {
    const previous = [...selectedItems.value]
    for (const node of allNodes.value) applyNodeSelection(node, 'UnSelected')
    if (previous.length) raiseSelectionChanged([], previous)
  } else if (mode === 'Single' && selectedNodeList.value.length > 1) {
    const [keep, ...removed] = selectedNodeList.value
    for (const node of allNodes.value) applyNodeSelection(node, node === keep ? 'Selected' : 'UnSelected')
    raiseSelectionChanged([], removed.map((node) => node.Item))
  }
}, { immediate: true })

watch(() => resolveXamlValue(props.SelectedItem, instance), (value) => {
  // An omitted binding leaves the control's default selection alone; an
  // explicit null is the official way to clear SelectedItem.
  if (value === undefined) return
  if (value === null) {
    const previous = [...selectedItems.value]
    if (!previous.length) return
    for (const node of [...selectedNodeList.value]) applyNodeSelection(node, 'UnSelected')
    raiseSelectionChanged([], previous)
    return
  }
  const node = allNodes.value.find((candidate) => candidate.Item === value)
  if (node && node.SelectionState !== 'Selected') selectNode(node, true)
}, { immediate: true })

watch(() => resolveXamlValue(props.SelectedItems, instance), (value) => {
  if (!Array.isArray(value) || selectionMode.value !== 'Multiple') return
  const target = new Set(value)
  const current = new Set(selectedItems.value)
  if (target.size === current.size && [...target].every((item) => current.has(item))) return

  const requestedNodes = value
    .map((item) => allNodes.value.find((candidate) => candidate.Item === item))
    .filter((node): node is TreeNode => Boolean(node))
  const requestedRoots = subtreeRoots(requestedNodes)

  beginSelectionChanges()
  try {
    for (const node of nodes.value) updateSelection(node, 'UnSelected')
    for (const node of requestedRoots) updateSelection(node, 'Selected')
  } finally {
    endSelectionChanges()
  }
}, { immediate: true, deep: true })

defineExpose(treeViewApi)
</script>

<style>
  .win-tree-view {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
    border-style: solid;
    border-width: 0;
    color: var(--TreeViewItemForeground, var(--TextFillColorPrimaryBrush, var(--text-primary)));
    font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', sans-serif);
    font-size: var(--ControlContentThemeFontSize, 14px);
    line-height: 20px;
  }

  .win-tree-viewport {
    width: 100%;
    height: 100%;
    min-height: 0;
    flex: 1 1 auto;
    max-height: inherit;
    box-sizing: border-box;
    position: relative;
  }

  .win-tree-viewport > .win-scroll-viewer-viewport {
    min-height: 0;
    max-height: inherit;
  }

  .win-tree-content {
    width: 100%;
    min-height: 100%;
    box-sizing: border-box;
    position: relative;
    transition: transform 240ms cubic-bezier(0.1, 0.9, 0.2, 1);
    will-change: transform;
  }

  .win-tree-content.drag-sinking {
    transform: translate3d(0, var(--ListViewItemReorderHintThemeOffset, 6px), 0);
  }

  /* The arranged slot is the ListViewItem: MinHeight and hit area live here so
     hover, selection and reorder never remeasure the item. */
  .win-tree-item {
    position: relative;
    isolation: isolate;
    display: block;
    width: 100%;
    min-width: var(--ListViewItemMinWidth, 88px);
    min-height: var(--TreeViewItemMinHeight, 28px);
    box-sizing: border-box;
    padding: 0;
    border: 0;
    cursor: default;
    user-select: none;
    outline: none;
  }

    .win-tree-view.tree-reorder-transitions .win-tree-item {
      transition: transform 240ms cubic-bezier(0.1, 0.9, 0.2, 1);
    }

    .win-tree-view.tree-entrance-transitions .win-tree-item:not(.win-tree-drag-preview) > .win-tree-presenter {
      animation: tree-view-entrance 187ms cubic-bezier(0.1, 0.9, 0.2, 1) backwards;
    }

    .win-tree-item.can-drag {
      cursor: grab;
      /* Preserve vertical ScrollViewer panning. A deliberate horizontal move
         (or press-and-hold) starts the Pointer drag path. */
      touch-action: pan-y;
    }

    .win-tree-view.pointer-dragging .win-tree-item {
      touch-action: none;
    }

    .win-tree-item.can-drag *,
    .win-tree-item.win-tree-drag-preview * {
      -webkit-user-drag: none;
    }

    .win-tree-item:focus-visible > .win-tree-presenter {
      outline: 2px solid var(--ListViewItemFocusVisualPrimaryBrush, var(--FocusStrokeColorOuterBrush, var(--text-primary)));
      outline-offset: -2px;
      box-shadow: inset 0 0 0 1px var(--ListViewItemFocusVisualSecondaryBrush, var(--FocusStrokeColorInnerBrush, white));
    }

    .win-tree-item.dragging-source {
      visibility: hidden;
      opacity: 0;
      pointer-events: none;
    }

    .win-tree-item.reorder-target {
      z-index: 2;
    }

    .win-tree-item.drag-shrink > .win-tree-presenter {
      opacity: var(--ListViewItemReorderThemeOpacity, .8);
    }

    .win-tree-item.reorder-target > .win-tree-presenter {
      /* The target remains a full-size, fully opaque hit surface.  Reordering
         feedback belongs to the surrounding presenters and insertion line,
         matching ListView's current ReorderingTarget visual state. */
      transform: none;
      opacity: 1;
    }

    .win-tree-item.win-tree-drag-preview {
      position: fixed;
      z-index: 2147483647;
      pointer-events: none;
      opacity: var(--ListViewItemDragThemeOpacity, .8);
      transition: none !important;
      will-change: transform;
      box-shadow: 0 8px 20px rgba(0, 0, 0, .18);
    }

  /* ContentPresenterGrid: Margin=TreeViewItemPresenterMargin (4,2),
     Padding=TreeViewItemPresenterPadding (0,3,0,5),
     CornerRadius=ControlCornerRadius. */
  .win-tree-presenter {
    position: relative;
    display: block;
    box-sizing: border-box;
    margin: var(--TreeViewItemPresenterMargin, 2px 4px);
    padding: var(--TreeViewItemPresenterPadding, 3px 0 5px 0);
    border: var(--TreeViewItemBorderThemeThickness, 0) solid var(--TreeViewItemBorderBrush, transparent);
    border-radius: var(--ControlCornerRadius, 4px);
    background: var(--TreeViewItemBackground, var(--SubtleFillColorTransparentBrush, transparent));
    color: var(--TreeViewItemForeground, var(--TextFillColorPrimaryBrush, var(--text-primary)));
    transition: transform 240ms cubic-bezier(0.1, 0.9, 0.2, 1),
      opacity 240ms cubic-bezier(0.1, 0.9, 0.2, 1),
      background-color var(--faster-duration, 83ms) linear;
  }

    /* TreeViewMultiSelectEnabled* sets ContentPresenterGrid.Padding to 0. */
    .win-tree-presenter.grid-padding-none {
      padding: 0;
    }

    .win-tree-item:hover > .win-tree-presenter {
      background: var(--TreeViewItemBackgroundPointerOver, var(--SubtleFillColorSecondaryBrush, var(--subtle-secondary)));
      color: var(--TreeViewItemForegroundPointerOver, var(--TextFillColorPrimaryBrush, var(--text-primary)));
      border-color: var(--TreeViewItemBorderBrushPointerOver, transparent);
    }

    .win-tree-item:active > .win-tree-presenter {
      background: var(--TreeViewItemBackgroundPressed, var(--SubtleFillColorTertiaryBrush, var(--subtle-tertiary)));
      color: var(--TreeViewItemForegroundPressed, var(--TextFillColorSecondaryBrush, var(--text-secondary)));
      border-color: var(--TreeViewItemBorderBrushPressed, transparent);
    }

    /* Single-selection paints the presenter; multi-selection paints the
       MultiSelectGrid instead, so the Selected state is scoped to :not(). */
    .win-tree-item.selected:not(.multi-select) > .win-tree-presenter {
      background: var(--TreeViewItemBackgroundSelected, var(--SubtleFillColorSecondaryBrush, var(--subtle-secondary)));
      color: var(--TreeViewItemForegroundSelected, var(--TextFillColorPrimaryBrush, var(--text-primary)));
      border-color: var(--TreeViewItemBorderBrushSelected, transparent);
    }

      .win-tree-item.selected:not(.multi-select):hover > .win-tree-presenter {
        background: var(--TreeViewItemBackgroundSelectedPointerOver, var(--SubtleFillColorTertiaryBrush, var(--subtle-tertiary)));
        color: var(--TreeViewItemForegroundSelectedPointerOver, var(--TextFillColorPrimaryBrush, var(--text-primary)));
        border-color: var(--TreeViewItemBorderBrushSelectedPointerOver, transparent);
      }

      .win-tree-item.selected:not(.multi-select):active > .win-tree-presenter {
        background: var(--TreeViewItemBackgroundSelectedPressed, var(--SubtleFillColorSecondaryBrush, var(--subtle-secondary)));
        color: var(--TreeViewItemForegroundSelectedPressed, var(--TextFillColorSecondaryBrush, var(--text-secondary)));
        border-color: var(--TreeViewItemBorderBrushSelectedPressed, transparent);
      }

    .win-tree-view.disabled .win-tree-presenter {
      background: var(--TreeViewItemBackgroundDisabled, var(--SubtleFillColorDisabledBrush, transparent));
      color: var(--TreeViewItemForegroundDisabled, var(--TextFillColorDisabledBrush, var(--text-disabled)));
      border-color: var(--TreeViewItemBorderBrushDisabled, transparent);
    }

    .win-tree-view.disabled .win-tree-item.selected > .win-tree-presenter {
      background: var(--TreeViewItemBackgroundSelectedDisabled, var(--SubtleFillColorDisabledBrush, transparent));
      color: var(--TreeViewItemForegroundSelectedDisabled, var(--TextFillColorDisabledBrush, var(--text-disabled)));
      border-color: var(--TreeViewItemBorderBrushSelectedDisabled, transparent);
    }

  /* Drop feedback is drawn on the presenter so the row keeps its arranged slot. */
  .win-tree-item.drop-before > .win-tree-presenter {
    box-shadow: inset 0 2px 0 var(--TreeViewItemSelectionIndicatorForeground, var(--AccentFillColorDefaultBrush, var(--accent-base)));
  }

  .win-tree-item.drop-after > .win-tree-presenter {
    box-shadow: inset 0 -2px 0 var(--TreeViewItemSelectionIndicatorForeground, var(--AccentFillColorDefaultBrush, var(--accent-base)));
  }

  .win-tree-item.drop-inside > .win-tree-presenter {
    background: var(--TreeViewItemBackgroundPressed, var(--SubtleFillColorTertiaryBrush, var(--subtle-tertiary)));
  }

  /* Rectangle x:Name="SelectionIndicator" Width="3" Height="16" RadiusX/Y="2"
     HorizontalAlignment="Left" VerticalAlignment="Center" Opacity="0". */
  .win-tree-selection-indicator {
    position: absolute;
    inset-inline-start: 0;
    top: 50%;
    width: 3px;
    height: 16px;
    transform: translateY(-50%);
    border-radius: 2px;
    background: var(--TreeViewItemSelectionIndicatorForeground, var(--AccentFillColorDefaultBrush, var(--accent-base)));
    opacity: 0;
    pointer-events: none;
    transition: opacity 83ms linear;
  }

    .win-tree-selection-indicator.active {
      opacity: 1;
    }

    .win-tree-item.selected:hover > .win-tree-presenter .win-tree-selection-indicator {
      background: var(--TreeViewItemSelectionIndicatorForegroundPointerOver, var(--TreeViewItemSelectionIndicatorForeground, var(--accent-base)));
    }

    .win-tree-item.selected:active > .win-tree-presenter .win-tree-selection-indicator {
      background: var(--TreeViewItemSelectionIndicatorForegroundPressed, var(--TreeViewItemSelectionIndicatorForeground, var(--accent-base)));
    }

    .win-tree-view.disabled .win-tree-item.selected > .win-tree-presenter .win-tree-selection-indicator {
      background: var(--TreeViewItemSelectionIndicatorForegroundDisabled, var(--TreeViewItemSelectionIndicatorForeground, var(--accent-base)));
    }

  /* Grid x:Name="MultiSelectGrid" Margin="0" Padding="Indentation"
     BorderThickness="0" CornerRadius="ControlCornerRadius". */
  .win-tree-multiselect-grid {
    display: grid;
    grid-template-columns: auto auto minmax(0, 1fr);
    align-items: center;
    box-sizing: border-box;
    margin: var(--TreeViewItemMultiSelectSelectedItemBorderMargin, 0);
    padding: 0;
    border: var(--TreeViewItemBorderThemeThickness, 0) solid transparent;
    border-radius: var(--ControlCornerRadius, 4px);
  }

    /* TreeViewMultiSelectEnabledSelected paints the multi-select surface. */
    .win-tree-multiselect-grid.multi-selected {
      background: var(--TreeViewItemBackgroundSelected, var(--SubtleFillColorSecondaryBrush, var(--subtle-secondary)));
      border-color: var(--TreeViewItemMultiSelectBorderBrushSelected, transparent);
    }

  /* CheckBox x:Name="MultiSelectCheckBox" Width="32" MinWidth="32"
     MinHeight=TreeViewItemMultiSelectCheckBoxMinHeight Margin="10,0,0,0"
     VerticalAlignment="Center" IsTabStop="False". */
  .tree-selection-check {
    width: 32px;
    min-width: 32px;
    min-height: var(--TreeViewItemMultiSelectCheckBoxMinHeight, 28px);
    margin-inline-start: 10px;
    padding: 0;
    justify-content: flex-start;
    /* The check is a presenter visual; the row owns the pointer interaction. */
    pointer-events: none;
  }

  .win-tree-multiselect-slot {
    position: relative;
    display: grid;
    place-items: center;
  }

  .win-tree-drag-count {
    position: absolute;
    inset: 50% auto auto 50%;
    min-width: 20px;
    height: 20px;
    padding: 0 4px;
    box-sizing: border-box;
    transform: translate(-50%, -50%);
    display: grid;
    place-items: center;
    border: 1px solid var(--SystemControlBackgroundChromeWhiteBrush, white);
    border-radius: var(--ControlCornerRadius, 4px);
    background: var(--SystemControlBackgroundAccentBrush, var(--accent-base));
    color: var(--SystemControlForegroundChromeWhiteBrush, white);
    font-size: 12px;
    line-height: 16px;
    pointer-events: none;
  }

    .win-tree-multiselect-slot:has(.win-tree-drag-count) .tree-selection-check {
      opacity: 0;
    }

  /* Grid x:Name="ExpandCollapseChevron" Padding="14,0" Opacity=GlyphOpacity.
     It is a Grid, so the two glyphs overlay each other; the template swaps
     which one is Visible and there is no rotation animation. */
  .win-tree-chevron {
    display: grid;
    align-items: center;
    justify-items: center;
    box-sizing: border-box;
    padding: 0 14px;
    background: transparent;
    color: var(--TreeViewItemForeground, var(--TextFillColorPrimaryBrush, var(--text-primary)));
    cursor: pointer;
  }

    .win-tree-chevron .win-tree-glyph {
      grid-area: 1 / 1;
    }

    /* TreeViewMultiSelectEnabled* sets ExpandCollapseChevron.Padding to 0,0,14,0. */
    .win-tree-chevron.multi-select {
      padding-inline: 0 14px;
    }

    .win-tree-item:hover > .win-tree-presenter .win-tree-chevron {
      color: var(--TreeViewItemForegroundPointerOver, var(--TextFillColorPrimaryBrush, var(--text-primary)));
    }

    .win-tree-item:active > .win-tree-presenter .win-tree-chevron {
      color: var(--TreeViewItemForegroundPressed, var(--TextFillColorSecondaryBrush, var(--text-secondary)));
    }

    .win-tree-item.selected > .win-tree-presenter .win-tree-chevron {
      color: var(--TreeViewItemForegroundSelected, var(--TextFillColorPrimaryBrush, var(--text-primary)));
    }

    .win-tree-item.selected:hover > .win-tree-presenter .win-tree-chevron {
      color: var(--TreeViewItemForegroundSelectedPointerOver, var(--TextFillColorPrimaryBrush, var(--text-primary)));
    }

    .win-tree-item.selected:active > .win-tree-presenter .win-tree-chevron {
      color: var(--TreeViewItemForegroundSelectedPressed, var(--TextFillColorSecondaryBrush, var(--text-secondary)));
    }

    .win-tree-view.disabled .win-tree-item > .win-tree-presenter .win-tree-chevron {
      color: var(--TreeViewItemForegroundDisabled, var(--TextFillColorDisabledBrush, var(--text-disabled)));
    }

    .win-tree-view.disabled .win-tree-item.selected > .win-tree-presenter .win-tree-chevron {
      color: var(--TreeViewItemForegroundSelectedDisabled, var(--TextFillColorDisabledBrush, var(--text-disabled)));
    }

  .win-tree-glyph {
    /* TextBlock Width="12" Height="12" Padding="2": padding sits inside those
       bounds, leaving the 8x8 box the GlyphSize=8 glyph is drawn in. */
    width: 12px;
    height: 12px;
    padding: 2px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--SymbolThemeFontFamily, 'Segoe Fluent Icons', 'Segoe MDL2 Assets', sans-serif);
    font-size: 8px;
    line-height: 1;
    color: var(--tree-glyph-brush, inherit);
  }

    .win-tree-glyph.hidden {
      visibility: hidden;
    }

  /* ContentPresenter MinHeight=TreeViewItemContentHeight (20). */
  .win-tree-item-content {
    display: flex;
    align-items: center;
    min-width: 0;
    min-height: var(--TreeViewItemContentHeight, 20px);
    overflow: hidden;
  }

    .win-tree-view.tree-content-transitions .win-tree-item-content {
      animation: tree-view-content 167ms cubic-bezier(0.1, 0.9, 0.2, 1) both;
    }

    .win-tree-item-content > * {
      min-width: 0;
      max-width: 100%;
    }

  @keyframes tree-view-entrance {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes tree-view-content {
    from { opacity: 0; }
    to { opacity: 1; }
  }
</style>
