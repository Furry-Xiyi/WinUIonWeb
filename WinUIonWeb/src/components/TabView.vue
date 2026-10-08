<script lang="ts">
import { tabViewProperties } from './TabViewProperties'
export default { ...tabViewProperties }
</script>

<script setup lang="ts">
import { cloneVNode, computed, defineComponent, Fragment, getCurrentInstance, h, inject, isVNode, nextTick, onBeforeUnmount, onMounted, onUpdated, provide, ref, shallowReactive, shallowRef, triggerRef, useAttrs, useSlots, watch, type PropType, type VNode } from 'vue'
import TabViewItem from './TabViewItem.vue'
import FontIcon from './FontIcon.vue'
import { TabViewTemplateToolTip } from './tabViewToolTip'
import { useI18n } from './i18n/index'
import { frameworkLayoutStyle } from './frameworkLayout'
import { xamlThickness } from './layout'
import { getTabViewProperty, renderTabViewPresenter, tabViewChildren, tabViewItemLiveControlKey, tabViewItemOwnerKey, tabViewItemRecordKey, tabViewItemTransferKey, tabViewNodes, tabViewPropertyChildren, tabViewRootAttributes, tabViewText, tabViewTypeName } from './TabViewProperties'
import { activeTabViewDrag, cancelTabViewDrag, createTabViewDataPackage, endTabViewDrag, moveTabViewDrag, registerTabViewDragEndpoint, startTabViewDrag, type TabViewDragEndpoint, type TabViewDragSession } from './tabViewRuntime'
import { tabViewNativeDragBridgeKey, tabViewNativeDropHandledKey, type TabViewNativeDragBridge, type TabViewNativeDragPreview } from './tabViewNativeDragBridge'
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlControlIdentityKey, xamlNameScopeKey, xamlTemplateComponent } from './xamlRuntime'
import { xamlResourceDictionaryKey } from './Page.vue'
import { collectXamlResources, useXamlBrushResources } from './xamlBrushResources'
import { primitiveResourceScope, primitiveResourceStyles, xamlPrimitiveResourceKey } from './xamlPrimitives'
import { pivotTemplate } from './PivotProperties'
import { resolveAcrylicResource, resolveBrushStyle } from './AcrylicBrush'
import { xamlThemeKey } from './brushCore'
import './tabViewStyles.css'

defineOptions({ name: 'TabView', inheritAttrs: false })
const props = defineProps({
  TabWidthMode: { type: null as unknown as PropType<unknown>, default: 'Equal' as unknown }, CloseButtonOverlayMode: { type: null as unknown as PropType<unknown>, default: 'Auto' as unknown },
  TabStripHeader: { type: null as unknown as PropType<unknown>, default: null as unknown }, TabStripHeaderTemplate: { type: null as unknown as PropType<unknown>, default: null as unknown },
  TabStripFooter: { type: null as unknown as PropType<unknown>, default: null as unknown }, TabStripFooterTemplate: { type: null as unknown as PropType<unknown>, default: null as unknown },
  IsAddTabButtonVisible: { type: null as unknown as PropType<unknown>, default: true as unknown }, AddTabButtonCommand: { type: null as unknown as PropType<unknown>, default: null as unknown }, AddTabButtonCommandParameter: { type: null as unknown as PropType<unknown>, default: null as unknown },
  TabItemsSource: { type: null as unknown as PropType<unknown>, default: null as unknown }, TabItemTemplate: { type: null as unknown as PropType<unknown>, default: null as unknown }, TabItemTemplateSelector: { type: null as unknown as PropType<unknown>, default: null as unknown },
  CanDragTabs: { type: null as unknown as PropType<unknown>, default: false as unknown }, CanReorderTabs: { type: null as unknown as PropType<unknown>, default: true as unknown }, AllowDropTabs: { type: null as unknown as PropType<unknown>, default: true as unknown }, CanTearOutTabs: { type: null as unknown as PropType<unknown>, default: false as unknown },
  SelectedIndex: { type: null as unknown as PropType<unknown>, default: 0 as unknown }, SelectedItem: { type: null as unknown as PropType<unknown>, default: undefined as unknown },
  IsEnabled: { type: null as unknown as PropType<unknown>, default: true as unknown }, IsTabStop: { type: null as unknown as PropType<unknown>, default: false as unknown }, Visibility: { type: null as unknown as PropType<unknown>, default: 'Visible' as unknown },
  Background: { type: null as unknown as PropType<unknown>, default: '{ThemeResource TabViewBackground}' as unknown }, Foreground: { type: null as unknown as PropType<unknown>, default: '' as unknown }, BorderBrush: { type: null as unknown as PropType<unknown>, default: '' as unknown }, BorderThickness: { type: null as unknown as PropType<unknown>, default: 0 as unknown }, CornerRadius: { type: null as unknown as PropType<unknown>, default: 0 as unknown },
  Margin: { type: null as unknown as PropType<unknown>, default: 0 as unknown }, Padding: { type: null as unknown as PropType<unknown>, default: '{ThemeResource TabViewHeaderPadding}' as unknown },
  Width: { type: null as unknown as PropType<unknown>, default: '' as unknown }, Height: { type: null as unknown as PropType<unknown>, default: '' as unknown }, MinWidth: { type: null as unknown as PropType<unknown>, default: '' as unknown }, MinHeight: { type: null as unknown as PropType<unknown>, default: '' as unknown }, MaxWidth: { type: null as unknown as PropType<unknown>, default: '' as unknown }, MaxHeight: { type: null as unknown as PropType<unknown>, default: '' as unknown },
  HorizontalAlignment: { type: null as unknown as PropType<unknown>, default: 'Stretch' as unknown }, VerticalAlignment: { type: null as unknown as PropType<unknown>, default: 'Top' as unknown }, RequestedTheme: { type: null as unknown as PropType<unknown>, default: 'Default' as unknown }, FlowDirection: { type: null as unknown as PropType<unknown>, default: '' as unknown }, Opacity: { type: null as unknown as PropType<unknown>, default: 1 as unknown }, IsHitTestVisible: { type: null as unknown as PropType<unknown>, default: true as unknown }
})
const emit = defineEmits(['Loaded', 'SelectionChanged', 'TabCloseRequested', 'TabDroppedOutside', 'AddTabButtonClick', 'TabItemsChanged', 'TabDragStarting', 'TabDragCompleted', 'TabStripDragOver', 'TabStripDrop', 'TabTearOutWindowRequested', 'TabTearOutRequested', 'ExternalTornOutTabsDropping', 'ExternalTornOutTabsDropped', 'update:SelectedIndex', 'update:SelectedItem'])
const instance = getCurrentInstance()
const attrs = useAttrs()
const slots = useSlots()
const { t } = useI18n()
const nativeDragBridge = inject<TabViewNativeDragBridge | null>(tabViewNativeDragBridgeKey, null)
const rootRef = ref<HTMLElement | null>(null)
const stripRef = ref<HTMLElement | null>(null)
const scrollerRef = ref<HTMLElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
const itemsPresenterRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const footerContentRef = ref<HTMLElement | null>(null)
const addButtonRef = ref<HTMLElement | null>(null)
const addContainerRef = ref<HTMLElement | null>(null)
const scrollDecreaseButtonRef = ref<HTMLElement | null>(null)
const scrollIncreaseButtonRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const overrides = shallowReactive<Record<string, unknown>>({})
const localItems = shallowRef<unknown[] | null>(null)
const realizedContent = shallowReactive(new Map<unknown, { Content: unknown; Template: unknown }>())
const selectedKey = shallowRef<unknown>(null)
const focusedKey = shallowRef<unknown>(null)
const containers = new Map<unknown, Record<string, any>>()
const elements = new Map<unknown, HTMLElement>()
const containerVersion = ref(0)
const availableWidth = ref(0)
const overflow = ref(false)
const scrollOffset = ref(0)
const scrollMaximum = ref(0)
const dropIndex = ref(-1)
const stripHovered = ref(false)
const frozenWidth = ref<number | null>(null)
const inheritedDirection = ref('ltr')
let disposed = false
let observer: ResizeObserver | undefined
let layoutFrame = 0
let layoutMeasured = false
let pendingPointer: { Key: unknown; Id: number; X: number; Y: number } | null = null
let suppressClick = false
let clickResetTimer = 0
let scrollRepeatTimer = 0
let scrollRepeatInterval = 0
let scrollHasRepeated = false
let nativeDragElement: HTMLElement | null = null
let nativeDragEndListener: ((event: DragEvent) => void) | null = null
const layoutAnimations = new Map<unknown, Animation>()
let lastCollectionChange = 0
let unregister: (() => void) | undefined
const tearOutRequests = new Map<unknown, AbortController>()
const externalDropControllers = new Set<AbortController>()
const value = (source: unknown) => resolveXamlValue(source, instance)
const property = (name: keyof typeof props): unknown => {
  const source = name in overrides ? overrides[name] : props[name]
  return /Template$/.test(name) && typeof source === 'string' && /^\{(?:StaticResource|ThemeResource)\s/.test(source) ? source : value(source)
}
const enabled = computed(() => property('IsEnabled') !== false)
const widthMode = computed(() => String(property('TabWidthMode')))
const direction = computed(() => property('FlowDirection') === 'RightToLeft' ? 'rtl' : property('FlowDirection') === 'LeftToRight' ? 'ltr' : inheritedDirection.value)
const requestedTheme = computed(() => ['Light', 'Dark'].includes(String(property('RequestedTheme'))) ? String(property('RequestedTheme')).toLowerCase() : undefined)
const nodes = computed(() => tabViewNodes(slots.default?.() ?? []))
const children = (name: string) => tabViewPropertyChildren(nodes.value, 'TabView', name)
const inheritedPrimitives = inject(xamlPrimitiveResourceKey, null)
const primitives = primitiveResourceScope(() => nodes.value, inheritedPrimitives)
provide(xamlPrimitiveResourceKey, primitives)
const inheritedResources = inject<Record<string, VNode>>(xamlResourceDictionaryKey, {})
const resources: Record<string, VNode> = Object.create(inheritedResources)
provide(xamlResourceDictionaryKey, resources)
const names = inject<Record<string, unknown>>(xamlNameScopeKey, {})
const brushResources = useXamlBrushResources(instance, names)
const resourceNames = shallowRef<string[]>([])
const inheritedTheme = inject<unknown>(xamlThemeKey, null)
provide(xamlThemeKey, computed(() => requestedTheme.value ?? (inheritedTheme && typeof inheritedTheme === 'object' && 'value' in inheritedTheme ? inheritedTheme.value : inheritedTheme)))
const resourceBrushStyles = computed(() => Object.fromEntries(resourceNames.value.map(name => { const brush = resolveAcrylicResource(name, instance); return [`--${name}`, resolveBrushStyle(brush, instance).background] }).filter(([, paint]) => paint !== undefined)))
const metric = (name: string, fallback: number) => { const number = Number(primitives.value[name] ?? value(`{ThemeResource ${name}}`)); return Number.isFinite(number) ? number : fallback }
type RecordEntry = { Key: string; Item: unknown; Index: number; Node: VNode | null }
const keys = new WeakMap<object, string>()
const primitiveKeys = new Map<unknown, string>()
let identity = 0
const keyOf = (item: unknown) => { const store = item && typeof item === 'object' ? keys : primitiveKeys; if (!store.has(item as object)) store.set(item as object, `tab-${++identity}`); return store.get(item as object)! }
const entries = computed<RecordEntry[]>(() => {
  const source = property('TabItemsSource')
  const items = source && typeof (source as Iterable<unknown>)[Symbol.iterator] === 'function' ? Array.from(source as Iterable<unknown>) : localItems.value ?? (children('TabItems').length ? children('TabItems') : nodes.value.filter(node => !getTabViewProperty(node, 'TabView')))
  const occurrences = new Map<unknown, number>()
  return items.map((item, index) => { const stable = isVNode(item) ? item.props?.__tabViewRecordKey ?? item.key ?? `tab-view-${instance?.uid}:markup:${index}` : keyOf(item); const occurrence = occurrences.get(stable) ?? 0; occurrences.set(stable, occurrence + 1); return { Key: `${String(stable)}${occurrence ? `:duplicate:${occurrence}` : ''}`, Item: item, Index: index, Node: isVNode(item) ? item : null } })
})
const selectedIndex = computed(() => entries.value.findIndex(entry => entry.Key === selectedKey.value))
const selectedRecord = computed(() => entries.value[selectedIndex.value] ?? null)
const containerOf = (entry: RecordEntry | null | undefined) => { containerVersion.value; return entry ? containers.get(entry.Key) ?? null : null }
const sourceOf = (entry: RecordEntry | null | undefined) => entry ? entry.Node ? entry.Node.props?.__tabViewPublicItem ?? containerOf(entry) ?? entry.Item : entry.Item : null
const entryFor = (item: unknown) => entries.value.find(entry => entry.Item === item || sourceOf(entry) === item || containerOf(entry) === item)
const itemEnabled = (entry: RecordEntry) => containerOf(entry)?.IsEnabled !== false && value(entry.Node?.props?.IsEnabled ?? (entry.Item as Record<string, unknown> | null)?.IsEnabled ?? true) !== false
const panelId = (key: unknown) => `tab-view-${instance?.uid}-${String(key).replace(/[^a-z\d_-]/gi, '-')}-panel`
const equalWidth = computed(() => frozenWidth.value ?? Math.max(metric('TabViewItemMinWidth', 100), Math.min(metric('TabViewItemMaxWidth', 240), (availableWidth.value - 8) / Math.max(1, entries.value.length + (dropIndex.value >= 0 && activeTabViewDrag.value?.Source !== endpoint ? 1 : 0)))))
const rootAttrs = computed(() => tabViewRootAttributes(attrs, instance))
const rootStyle = computed(() => ({ ...frameworkLayoutStyle({ ...Object.fromEntries(Object.keys(props).map(name => [name, property(name as keyof typeof props)])), Padding: '', BorderThickness: '', BorderBrush: '', CornerRadius: '' }, instance), ...primitiveResourceStyles(primitives.value), ...resourceBrushStyles.value, minWidth: property('MinWidth') !== '' ? `min(${Number(property('MinWidth'))}px, 100%)` : undefined, color: property('Foreground') ? String(property('Foreground')) : undefined }))
const listStyle = computed(() => ({ padding: xamlThickness(property('Padding')) }))
const contentStyle = computed(() => ({ borderWidth: xamlThickness(property('BorderThickness')), borderColor: property('BorderBrush') ? String(property('BorderBrush')) : undefined, borderRadius: `${Number(property('CornerRadius')) || 0}px` }))
const raise = (name: string, args: unknown) => {
  const listener = instance?.vnode.props?.[`on${name}`]
  // Vue's casing diagnostic treats official Loaded as an in-DOM listener.
  // Invoke the canonical listener once, as the other XAML controls do.
  if (name === 'Loaded' && listener) {
    for (const handler of Array.isArray(listener) ? listener : [listener]) if (typeof handler === 'function') handler(publicApi, args)
    return
  }
  emit(name as 'SelectionChanged', publicApi, args)
  if (!listener) resolveXamlHandler(attrs[name], instance)?.(publicApi, args)
}
const raiseAsync = async (name: string, args: unknown) => {
  const handler = instance?.vnode.props?.[`on${name}`]
  const handlers = Array.isArray(handler) ? handler : handler ? [handler] : []
  for (const callback of handlers) if (typeof callback === 'function') await callback(publicApi, args)
  await resolveXamlHandler(attrs[name], instance)?.(publicApi, args)
}
const ensureVisible = (key = selectedKey.value) => { const item = elements.get(key); const scroller = scrollerRef.value; if (!item || !scroller) return; const bounds = item.getBoundingClientRect(); const viewport = scroller.getBoundingClientRect(); if (bounds.left < viewport.left) scroller.scrollBy({ left: bounds.left - viewport.left }); else if (bounds.right > viewport.right) scroller.scrollBy({ left: bounds.right - viewport.right }); updateScroll() }
const select = async (index: number, notify = true, removedItem?: unknown) => {
  const next = entries.value[index] ?? null
  if (next && !itemEnabled(next)) return
  if (next?.Key === selectedKey.value || !next && selectedKey.value === null) return
  const previous = removedItem === undefined ? sourceOf(selectedRecord.value) : removedItem
  const moveFocus = contentRef.value?.contains(document.activeElement) ?? false
  selectedKey.value = next?.Key ?? null
  if (next) { const container = containerOf(next); if (container) realizedContent.set(next.Key, { Content: container.Content, Template: container.ContentTemplate }) }
  const item = sourceOf(next)
  emit('update:SelectedIndex', next?.Index ?? -1); emit('update:SelectedItem', item)
  updateXamlBinding(props.SelectedIndex, next?.Index ?? -1, instance); updateXamlBinding(props.SelectedItem, item, instance)
  if (notify) raise('SelectionChanged', { RemovedItems: previous === null ? [] : [previous], AddedItems: item === null ? [] : [item] })
  await nextTick(); ensureVisible()
  if (moveFocus) { const focusable = contentRef.value?.querySelector<HTMLElement>('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]'); (focusable ?? elements.get(next?.Key))?.focus() }
}
const editableItems = () => entries.value.map(entry => entry.Node ? cloneVNode(entry.Node, { __tabViewRecordKey: entry.Key }) : entry.Item)
const replaceItems = (next: unknown[]) => {
  next = next.map(item => item && typeof item === 'object' && !isVNode(item) && (item as Record<symbol, unknown>)[tabViewItemTransferKey] ? (item as Record<symbol, unknown>)[tabViewItemTransferKey] : item)
  const source = property('TabItemsSource')
  if (Array.isArray(source)) source.splice(0, source.length, ...next)
  else if (source && typeof source === 'object' && 'ReplaceAll' in source && typeof source.ReplaceAll === 'function') source.ReplaceAll(next)
  else if (source && typeof source === 'object' && 'Clear' in source && 'Append' in source && typeof source.Clear === 'function' && typeof source.Append === 'function') { source.Clear(); const append = source.Append; next.forEach(item => append.call(source, item)) }
  else if (source) throw new TypeError('TabItemsSource must expose a mutable collection to move tabs.')
  else localItems.value = next
}
const changed = (change: string, index: number, mutate: (items: unknown[]) => void) => { const next = editableItems(); mutate(next); replaceItems(next); raise('TabItemsChanged', { CollectionChange: change, Index: index }) }
const collectionMethods = {
  GetAt: (index: number) => sourceOf(entries.value[index]), Add: (item: unknown) => changed('ItemInserted', entries.value.length, next => { next.push(item) }),
  Append: (item: unknown) => collectionMethods.Add(item), Insert: (index: number, item: unknown) => collectionMethods.InsertAt(index, item),
  InsertAt: (index: number, item: unknown) => changed('ItemInserted', index, next => { next.splice(index, 0, item) }),
  SetAt: (index: number, item: unknown) => changed('ItemChanged', index, next => { next.splice(index, 1, item) }),
  RemoveAt: (index: number) => { if (index < 0 || index >= entries.value.length) return; changed('ItemRemoved', index, next => { next.splice(index, 1) }) },
  Remove: (item: unknown) => { const entry = entryFor(item); if (entry) collectionMethods.RemoveAt(entry.Index); return Boolean(entry) },
  RemoveAtEnd: () => collectionMethods.RemoveAt(entries.value.length - 1), Clear: () => changed('Reset', 0, next => { next.length = 0 }),
  IndexOf: (item: unknown) => entryFor(item)?.Index ?? -1, Contains: (item: unknown) => Boolean(entryFor(item)), ReplaceAll: (items: unknown[]) => { replaceItems([...items]); raise('TabItemsChanged', { CollectionChange: 'Reset', Index: 0 }) }
}
const collection = new Proxy(collectionMethods, { get(target, key) { if (key === 'Count' || key === 'Size' || key === 'length') return entries.value.length; if (key === Symbol.iterator) return function* () { for (const entry of entries.value) yield sourceOf(entry) }; if (key in target) return target[key as keyof typeof target]; if (typeof key === 'string' && /^\d+$/.test(key)) return sourceOf(entries.value[Number(key)]); const all = entries.value.map(sourceOf); const member = all[key as keyof typeof all]; return typeof member === 'function' ? member.bind(all) : member } })
const close = async (key: unknown) => {
  const entry = entries.value.find(entry => entry.Key === key)
  const container = containerOf(entry)
  if (!enabled.value || !entry || !itemEnabled(entry) || container?.IsClosable === false) return
  const hadFocus = elements.get(key)?.contains(document.activeElement)
  if (widthMode.value === 'Equal' && stripHovered.value) frozenWidth.value = equalWidth.value
  const args = { Item: sourceOf(entry), Tab: container }
  raise('TabCloseRequested', args); container?.RaiseCloseRequested?.(args)
  await nextTick()
  if (hadFocus && !entries.value.some(current => current.Key === key)) (elements.get(entries.value[Math.min(entry.Index, entries.value.length - 1)]?.Key) ?? addButtonRef.value)?.focus()
}
const add = () => {
  if (!enabled.value) return
  const command = property('AddTabButtonCommand') as { CanExecute?: (parameter: unknown) => boolean; Execute?: (parameter: unknown) => unknown } | null
  const parameter = property('AddTabButtonCommandParameter')
  if (command && command.CanExecute?.(parameter) === false) return
  command?.Execute?.(parameter); raise('AddTabButtonClick', {})
}
const commandEnabled = computed(() => { const command = property('AddTabButtonCommand') as { CanExecute?: (parameter: unknown) => boolean } | null; return enabled.value && command?.CanExecute?.(property('AddTabButtonCommandParameter')) !== false })
const moveFocus = (key: unknown, delta: number) => { const current = entries.value.findIndex(entry => entry.Key === key); const order = entries.value.filter(itemEnabled); const index = order.findIndex(entry => entry.Index === current); const next = order[index + delta]; if (next) { focusedKey.value = next.Key; elements.get(next.Key)?.focus(); ensureVisible(next.Key) } else if (delta > 0) addButtonRef.value?.focus() }
const headerKeyDown = (event: KeyboardEvent, key: unknown) => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
  event.preventDefault(); event.stopPropagation()
  const entry = entries.value.find(entry => entry.Key === key)
  const delta = (event.key === 'ArrowRight' ? 1 : -1) * (direction.value === 'rtl' ? -1 : 1)
  if (event.altKey && event.shiftKey && property('CanReorderTabs') !== false && entry) { const index = Math.max(0, Math.min(entries.value.length - 1, entry.Index + delta)); const next = editableItems(); const [item] = next.splice(entry.Index, 1); next.splice(index, 0, item); replaceItems(next); raise('TabItemsChanged', { CollectionChange: 'Reset', Index: index }); nextTick(() => elements.get(key)?.focus()); return }
  if (event.key === 'Home' || event.key === 'End') { const order = entries.value.filter(itemEnabled); const next = event.key === 'Home' ? order[0] : order.at(-1); if (next) elements.get(next.Key)?.focus(); return }
  moveFocus(key, delta)
}
const keyDown = (event: KeyboardEvent) => {
  if (!enabled.value) return
  if (event.key === 'Escape') { pendingPointer = null; cancelTabViewDrag(); cancelExternalDrag(); for (const request of tearOutRequests.values()) request.abort(); return }
  for (const accelerator of children('KeyboardAccelerators')) {
    const settings = accelerator.props ?? {}
    if (value(settings.IsEnabled ?? true) === false) continue
    const modifiers = String(value(settings.Modifiers) ?? '')
    const key = String(value(settings.Key) ?? '')
    const matches = event.key.toLowerCase() === key.replace(/^Number/, '').toLowerCase()
      && event.ctrlKey === /Control/.test(modifiers) && event.shiftKey === /Shift/.test(modifiers) && event.altKey === /Menu|Alt/.test(modifiers)
    if (!matches) continue
    const args = { Handled: false, Element: publicApi, OriginalEvent: event }
    const sender = { Key: key, Modifiers: modifiers, IsEnabled: true }
    const handler = settings.onInvoked ?? settings.Invoked
    resolveXamlHandler(handler, instance)?.(sender, args)
    if (args.Handled) { event.preventDefault(); return }
  }
  if (event.ctrlKey && event.key === 'F4') { event.preventDefault(); if (selectedRecord.value) void close(selectedRecord.value.Key); return }
  if (event.ctrlKey && event.key === 'Tab') { event.preventDefault(); const order = entries.value.filter(itemEnabled); if (!order.length) return; const current = order.findIndex(entry => entry.Key === selectedKey.value); const next = order[(current + (event.shiftKey ? -1 : 1) + order.length) % order.length]!; void select(next.Index); return }
}
const RequestTearOut = async (item: unknown) => {
  const entry = entryFor(item)
  if (!entry || !enabled.value || property('CanTearOutTabs') !== true || tearOutRequests.has(entry.Key)) return false
  const controller = new AbortController()
  tearOutRequests.set(entry.Key, controller)
  const args = { Items: [sourceOf(entry)], Tabs: [containerOf(entry)], SourceTabView: publicApi, Signal: controller.signal, NewWindowId: null as unknown, Cancel: false }
  try {
    await raiseAsync('TabTearOutWindowRequested', args)
    if (disposed || !enabled.value || property('CanTearOutTabs') !== true || controller.signal.aborted || args.Cancel || args.NewWindowId === null || args.NewWindowId === undefined) { controller.abort(); return false }
    const requested = { Items: args.Items, Tabs: args.Tabs, SourceTabView: publicApi, Signal: controller.signal, NewWindowId: args.NewWindowId, Cancel: false }
    await raiseAsync('TabTearOutRequested', requested)
    if (requested.Cancel) controller.abort()
    return !controller.signal.aborted && !requested.Cancel
  } catch { controller.abort(); return false }
  finally { tearOutRequests.delete(entry.Key) }
}
const createDragVisual = (key: unknown) => {
  const element = elements.get(key)
  if (!element) return undefined
  const ghost = element.cloneNode(true) as HTMLElement
  ghost.classList.remove('is-dragging', 'is-pressed', 'is-pointer-over')
  ghost.classList.add('win-tab-view-drag-ghost', 'is-drag-visual')
  ghost.inert = true; ghost.draggable = false
  ghost.setAttribute('aria-hidden', 'true')
  for (const tip of ghost.querySelectorAll('[role="tooltip"],.win-tooltip,.win-tool-tip')) tip.remove()
  for (const child of [ghost, ...ghost.querySelectorAll<HTMLElement>('*')]) {
    for (const attribute of [...child.attributes]) if (['id', 'role', 'tabindex', 'aria-controls', 'aria-selected', 'aria-describedby', 'title'].includes(attribute.name) || /^tooltipservice\./i.test(attribute.name)) child.removeAttribute(attribute.name)
    if (child.hasAttribute('draggable')) child.draggable = false
  }
  const computed = getComputedStyle(element)
  // A drag visual lives outside the page's RequestedTheme scope. Keep the
  // source resources so native and touch pictures use the same palette.
  for (let index = 0; index < computed.length; index++) { const name = computed[index]; if (name?.startsWith('--')) ghost.style.setProperty(name, computed.getPropertyValue(name)) }
  const bounds = element.getBoundingClientRect()
  ghost.style.width = `${bounds.width}px`
  ghost.style.height = `${bounds.height}px`
  ghost.style.fontFamily = computed.fontFamily
  ghost.style.direction = computed.direction
  ghost.style.opacity = '1'
  const visual = element.querySelector<HTMLElement>('.win-tab-view-tab-drag-visual')
  if (visual) ghost.style.setProperty('--TabViewItemHeaderDragBackground', getComputedStyle(visual).backgroundColor)
  document.body.append(ghost)
  return ghost
}
const beginDrag = (key: unknown, native: boolean, event: PointerEvent | DragEvent) => {
  const entry = entries.value.find(entry => entry.Key === key)
  if (!entry || !enabled.value || !itemEnabled(entry)) return null
  const args = { Cancel: false, Data: createTabViewDataPackage(), Item: sourceOf(entry), Tab: containerOf(entry) }
  raise('TabDragStarting', args)
  if (args.Cancel) return null
  const session: TabViewDragSession = { Source: endpoint, Key: key, Item: args.Item, Tab: args.Tab, Data: args.Data, Controller: new AbortController(), Native: native, CanLeaveSource: property('CanDragTabs') === true || property('CanTearOutTabs') === true, X: event.clientX, Y: event.clientY, Target: null, DropIndex: -1 }
  if (!native) session.Ghost = createDragVisual(key)
  startTabViewDrag(session); if (clickResetTimer) window.clearTimeout(clickResetTimer); suppressClick = true; return session
}
const pointerDown = (event: PointerEvent, key: unknown) => { if (event.button !== 0 || property('CanReorderTabs') === false && property('CanDragTabs') !== true && property('CanTearOutTabs') !== true) return; pendingPointer = { Key: key, Id: event.pointerId, X: event.clientX, Y: event.clientY } }
const pointerMove = (event: PointerEvent) => {
  const pending = pendingPointer
  if (pending && pending.Id === event.pointerId && !activeTabViewDrag.value && (Math.abs(event.clientX - pending.X) > 8 || Math.abs(event.clientY - pending.Y) > 8)) { const session = beginDrag(pending.Key, false, event); if (!session) { pendingPointer = null; return }; session.PointerId = event.pointerId; try { stripRef.value?.setPointerCapture(event.pointerId) } catch { /* The browser can release a pointer while the drag-start handler runs. */ } }
  const session = activeTabViewDrag.value
  if (!session || session.Source !== endpoint || session.Native || session.PointerId !== event.pointerId) return
  event.preventDefault(); moveTabViewDrag(event.clientX, event.clientY, event)
}
const pointerUp = (event: PointerEvent) => {
  pendingPointer = null
  const session = activeTabViewDrag.value
  if (session?.Source !== endpoint || session.Native || session.PointerId !== event.pointerId) return
  moveTabViewDrag(event.clientX, event.clientY, event)
  if (!session.Target && inAnyStrip(event)) cancelTabViewDrag()
  else void endTabViewDrag(event)
  if (stripRef.value?.hasPointerCapture(event.pointerId)) stripRef.value.releasePointerCapture(event.pointerId)
}
const pointerCancel = () => { pendingPointer = null; if (activeTabViewDrag.value?.Source === endpoint && !activeTabViewDrag.value.Native) cancelTabViewDrag() }
const cancelExternalDrag = () => { dropIndex.value = -1; for (const request of externalDropControllers) request.abort() }
const clearNativeDragEndListener = () => {
  if (nativeDragElement && nativeDragEndListener) nativeDragElement.removeEventListener('dragend', nativeDragEndListener)
  nativeDragElement = null; nativeDragEndListener = null
}
const windowBlur = () => {
  pendingPointer = null; endScrollRepeat(); dropIndex.value = -1
  // A browser-native drag can move to another document as focus changes.
  // Its drop/end handshake, rather than blur, decides ownership or cancellation.
  if (activeTabViewDrag.value?.Source === endpoint && !activeTabViewDrag.value.Native) cancelTabViewDrag()
}
const windowKeyDown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') return
  // Native HTML drag does not require keyboard focus on the dragged tab.
  // Capture Escape at the window before an unrelated focused host handles it.
  pendingPointer = null
  if (activeTabViewDrag.value?.Source === endpoint) cancelTabViewDrag()
  cancelExternalDrag()
  for (const request of tearOutRequests.values()) request.abort()
}
const nativeDragStart = (event: DragEvent, key: unknown) => {
  pendingPointer = null
  if (property('CanDragTabs') !== true) { event.preventDefault(); return }
  // Only promote the Pointer gesture that preceded this native dragstart.
  // A retained native session belongs to an earlier browser gesture.
  let session = activeTabViewDrag.value?.Source === endpoint && activeTabViewDrag.value.Key === key && !activeTabViewDrag.value.Native ? activeTabViewDrag.value : null
  if (!session && activeTabViewDrag.value) cancelTabViewDrag()
  if (session && !session.Native) { const pointerId = session.PointerId; session.Ghost?.remove(); session.Ghost = undefined; session.Native = true; session.PointerId = undefined; if (pointerId !== undefined && stripRef.value?.hasPointerCapture(pointerId)) stripRef.value.releasePointerCapture(pointerId); triggerRef(activeTabViewDrag) }
  if (!session) session = beginDrag(key, true, event)
  if (!session) { event.preventDefault(); return }
  clearNativeDragEndListener()
  // A successful host move can remove the original TabViewItem before the
  // browser dispatches dragend. Retain a direct listener on that source node.
  nativeDragElement = elements.get(key) ?? null
  const originatingSession = session
  nativeDragEndListener = event => nativeDragEnd(event, originatingSession)
  nativeDragElement?.addEventListener('dragend', nativeDragEndListener)
  if (event.dataTransfer) {
    // MIME types remain readable during protected dragenter/dragover events.
    // A unique token distinguishes this gesture from a foreign or old drag,
    // including TabViews that do not register a framework host adapter.
    session.NativeDragToken = `application/x-winui-tab-token-${crypto.randomUUID()}`
    event.dataTransfer.setData(session.NativeDragToken, endpoint.Id)
    event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('application/x-winui-tab', endpoint.Id)
    const text = tabViewText(containerOf(entries.value.find(entry => entry.Key === key))?.Header); event.dataTransfer.setData('text/plain', text)
    const picture = createDragVisual(key)
    if (picture) {
      picture.style.transform = 'translate3d(-10000px,0,0)'
      const bounds = elements.get(key)?.getBoundingClientRect()
      event.dataTransfer.setDragImage(picture, bounds ? event.clientX - bounds.left : 0, bounds ? event.clientY - bounds.top : 0)
      requestAnimationFrame(() => picture.remove())
    }
  }
  nativeDragBridge?.Start(publicApi, event, [session.Item], [session.Tab], session.Controller.signal, result => {
    if (activeTabViewDrag.value !== session) return
    // A confirmed target can remove the dragged source node before dragend.
    // Completion therefore also follows the authenticated host acknowledgement.
    session.NativeDropObserved = true
    if (result === 'Move') void endTabViewDrag(event, 'Move')
    else cancelTabViewDrag()
  })
}
const externalDragArgs = (event: DragEvent, preview: TabViewNativeDragPreview, index: number, signal?: AbortSignal) => {
  const packageValue = createTabViewDataPackage()
  packageValue.Properties.Items = preview.Items
  packageValue.Properties.SourceWindowId = preview.SourceWindowId
  packageValue.Properties.SourceId = preview.SourceId
  packageValue.SetData('Tab', preview.Items[0])
  const data = preview.Data ?? packageValue.GetView()
  return { Data: data, DataView: data, Signal: signal, AcceptedOperation: 'Move', Handled: false, OriginalSource: stripRef.value, DropIndex: index,
    GetPosition: (relative: { Element?: HTMLElement } | HTMLElement) => { const target = relative instanceof HTMLElement ? relative : relative?.Element; const bounds = target?.getBoundingClientRect(); return { X: event.clientX - (bounds?.left ?? 0), Y: event.clientY - (bounds?.top ?? 0) } }, OriginalEvent: event }
}
const externalDroppingArgs = (preview: TabViewNativeDragPreview, index: number, signal?: AbortSignal) => ({
  Items: preview.Items, Tabs: preview.Tabs, SourceWindowId: preview.SourceWindowId, SourceId: preview.SourceId, Signal: signal, DropIndex: index, AllowDrop: true,
})
const nativeExternalPreview = (event: DragEvent) => {
  if (!enabled.value || property('AllowDropTabs') === false) return null
  const bounds = scrollerRef.value?.getBoundingClientRect()
  if (!bounds || event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) return null
  return nativeDragBridge?.Preview(publicApi, event) ?? null
}
const nativeEventSession = (event: DragEvent) => {
  const session = activeTabViewDrag.value
  return session?.Native && session.NativeDragToken && Array.from(event.dataTransfer?.types ?? []).includes(session.NativeDragToken) ? session : null
}
const prepareExternalDrag = () => {
  const session = activeTabViewDrag.value
  // An authenticated new gesture supersedes an old, unobserved source drag.
  // Keep a pending observed transaction until its host acknowledgement settles.
  if (session && !session.NativeDropObserved) cancelTabViewDrag()
}
const nativeDragOver = (event: DragEvent) => {
  // Foreign authentication takes precedence over local bookkeeping. A browser
  // can omit dragend and leave the receiver with a previous native session.
  const preview = nativeExternalPreview(event)
  if (!preview) {
    const session = nativeEventSession(event)
    if (!session) { dropIndex.value = -1; return }
    moveTabViewDrag(event.clientX, event.clientY, event)
    if (activeTabViewDrag.value?.Target === endpoint) { event.preventDefault(); if (event.dataTransfer) event.dataTransfer.dropEffect = 'move' }
    return
  }
  prepareExternalDrag()
  const index = insertionIndex(event.clientX)
  const args = externalDragArgs(event, preview, index)
  raise('TabStripDragOver', args)
  const dropping = externalDroppingArgs(preview, index)
  raise('ExternalTornOutTabsDropping', dropping)
  if (args.AcceptedOperation === 'None' || !dropping.AllowDrop) {
    dropIndex.value = -1
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'none'
    return
  }
  dropIndex.value = index
  const scroller = scrollerRef.value, bounds = scroller?.getBoundingClientRect()
  if (scroller && bounds && overflow.value) { if (event.clientX - bounds.left < 24) scroller.scrollLeft -= 12; else if (bounds.right - event.clientX < 24) scroller.scrollLeft += 12 }
  event.preventDefault(); if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
}
const nativeDragLeave = (event: DragEvent) => {
  if (event.relatedTarget instanceof Node && stripRef.value?.contains(event.relatedTarget)) return
  dropIndex.value = -1
}
const nativeDrop = (event: DragEvent) => {
  const preview = nativeExternalPreview(event)
  if (preview && nativeDragBridge) {
    prepareExternalDrag()
    event.preventDefault(); event.stopPropagation()
    const index = insertionIndex(event.clientX), controller = new AbortController()
    externalDropControllers.add(controller)
    // The bridge marks the authenticated source drop as observed immediately,
    // before an official drop handler or host transaction can await.
    void nativeDragBridge.Drop(publicApi, event, index, async signal => {
      const args = externalDragArgs(event, preview, index, signal)
      await raiseAsync('TabStripDrop', args)
      if (disposed || !enabled.value || property('AllowDropTabs') === false || signal.aborted || args.AcceptedOperation === 'None') return false
      const dropping = externalDroppingArgs(preview, index, signal)
      raise('ExternalTornOutTabsDropping', dropping)
      return { Accepted: dropping.AllowDrop && !signal.aborted && !disposed, Handled: args.Handled }
    }, controller.signal).then(async result => {
      if (result !== 'Move') return
      const args = { Items: preview.Items, Tabs: preview.Tabs, SourceWindowId: preview.SourceWindowId, SourceId: preview.SourceId, Signal: controller.signal, DropIndex: index }
      Object.defineProperty(args, tabViewNativeDropHandledKey, { value: true })
      // This is the official post-transfer notification. A host adapter has
      // already updated both collections; observers must not repeat the move.
      try { await raiseAsync('ExternalTornOutTabsDropped', args) } catch { /* Committed ownership is independent of notification observers. */ }
    }).catch(() => {}).finally(() => { externalDropControllers.delete(controller); dropIndex.value = -1 })
    return
  }
  const session = nativeEventSession(event)
  if (!session) { dropIndex.value = -1; return }
  event.preventDefault(); event.stopPropagation(); moveTabViewDrag(event.clientX, event.clientY, event)
  if (session.Target !== endpoint) { cancelTabViewDrag(); return }
  session.NativeDropObserved = true
  void endTabViewDrag(event)
}
const nativeDragEnd = (event: DragEvent, originatingSession?: TabViewDragSession) => {
  const session = activeTabViewDrag.value
  if (session?.Source !== endpoint || originatingSession && session !== originatingSession || nativeEventSession(event) !== session) return
  clearNativeDragEndListener()
  const externalCompletion = nativeDragBridge?.End(publicApi, event)
  if (externalCompletion) {
    session.NativeDropObserved = true
    void externalCompletion.then(result => {
      if (activeTabViewDrag.value !== session) return
      if (result === 'Move') void endTabViewDrag(event, 'Move')
      else cancelTabViewDrag()
    }, () => { if (activeTabViewDrag.value === session) cancelTabViewDrag() })
    return
  }
  if (session.NativeDropObserved) return
  // Chromium consumes Escape while a native drag is active. A None result
  // without a real drop is cancellation, not evidence of a tear-out gesture.
  if (event.dataTransfer?.dropEffect === 'move') void endTabViewDrag(event, 'Move')
  else cancelTabViewDrag()
}
const inAnyStrip = (event: MouseEvent) => {
  if (event.composedPath().some(node => node instanceof Element && node.matches('.win-tab-view-tab-container-grid'))) return true
  return [...document.querySelectorAll<HTMLElement>('.win-tab-view-tab-container-grid')].some(element => { const bounds = element.getBoundingClientRect(); return event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom })
}
const windowDragOver = (event: DragEvent) => {
  const session = nativeEventSession(event)
  if (session?.Source !== endpoint || !session.Native || !session.CanLeaveSource || event.defaultPrevented) return
  moveTabViewDrag(event.clientX, event.clientY, event)
  if (!session.Target && !inAnyStrip(event)) { event.preventDefault(); if (event.dataTransfer) event.dataTransfer.dropEffect = 'move' }
}
const windowDrop = (event: DragEvent) => {
  const session = nativeEventSession(event)
  if (session?.Source !== endpoint || !session.Native || !session.CanLeaveSource || event.defaultPrevented) return
  moveTabViewDrag(event.clientX, event.clientY, event)
  if (session.Target) { session.NativeDropObserved = true; event.preventDefault(); void endTabViewDrag(event) }
  else if (!inAnyStrip(event)) { session.NativeDropObserved = true; event.preventDefault(); void endTabViewDrag(event, 'None') }
}
const insertionIndex = (x: number) => { const order = direction.value === 'rtl' ? [...entries.value].reverse() : entries.value; const viewport = scrollerRef.value?.getBoundingClientRect(); for (const entry of order) { const element = elements.get(entry.Key); if (!element || !viewport || !scrollerRef.value) continue; const left = viewport.left + element.offsetLeft - scrollerRef.value.scrollLeft; if (x < left + element.offsetWidth / 2) return direction.value === 'rtl' ? entry.Index + 1 : entry.Index }; return direction.value === 'rtl' ? 0 : entries.value.length }
const dragArgs = (session: TabViewDragSession, event: Event | null) => ({ Data: session.Data.GetView(), DataView: session.Data.GetView(), Signal: session.Controller.signal, AcceptedOperation: 'Move', Handled: false, OriginalSource: stripRef.value, DropIndex: session.DropIndex, GetPosition: (relative: { Element?: HTMLElement } | HTMLElement) => { const target = relative instanceof HTMLElement ? relative : relative?.Element; const bounds = target?.getBoundingClientRect(); return { X: session.X - (bounds?.left ?? 0), Y: session.Y - (bounds?.top ?? 0) } }, OriginalEvent: event })
const endpoint: TabViewDragEndpoint = {
  Id: `tab-view-${instance?.uid}`, Element: () => scrollerRef.value,
  CanAccept: session => enabled.value && property('AllowDropTabs') !== false && (session.Source === endpoint ? property('CanReorderTabs') !== false : session.CanLeaveSource),
  Over(session, event) { session.DropIndex = insertionIndex(session.X); const args = dragArgs(session, event); raise('TabStripDragOver', args); if (args.AcceptedOperation === 'None') return false; dropIndex.value = session.DropIndex; const scroller = scrollerRef.value; const bounds = scroller?.getBoundingClientRect(); if (scroller && bounds && overflow.value) { if (session.X - bounds.left < 24) scroller.scrollLeft -= 12; else if (bounds.right - session.X < 24) scroller.scrollLeft += 12 }; return true },
  Leave() { dropIndex.value = -1 },
  async Drop(session, event) {
    const before = entries.value.map(entry => entry.Item)
    const args = dragArgs(session, event)
    await raiseAsync('TabStripDrop', args)
    if (disposed || activeTabViewDrag.value !== session || session.Controller.signal.aborted || args.AcceptedOperation === 'None') return 'None'
    if (args.Handled || entries.value.length !== before.length || entries.value.some((entry, index) => entry.Item !== before[index])) return 'Move'
    if (session.Source === endpoint) { const entry = entryFor(session.Item) ?? entries.value.find(entry => entry.Key === session.Key); if (!entry) return 'None'; const next = editableItems(); const [item] = next.splice(entry.Index, 1); const index = Math.max(0, Math.min(next.length, session.DropIndex - (entry.Index < session.DropIndex ? 1 : 0))); next.splice(index, 0, item); replaceItems(next); raise('TabItemsChanged', { CollectionChange: 'Reset', Index: index }); await select(index); return 'Move' }
    const sourceApi = (session.Tab as { ParentTabView?: Record<string, any> } | null)?.ParentTabView
    const sourceItems = sourceApi?.TabItems
    if (!sourceItems) return 'None'
    const item = sourceItems.GetAt(sourceItems.IndexOf(session.Item))
    if (item === undefined || item === null) return 'None'
    const external = { Items: [session.Item], Tabs: [session.Tab], SourceTabView: sourceApi, Signal: session.Controller.signal, DropIndex: session.DropIndex, AllowDrop: true }
    raise('ExternalTornOutTabsDropping', external)
    if (!external.AllowDrop) return 'None'
    const externalHandler = instance?.vnode.props?.onExternalTornOutTabsDropped || attrs.ExternalTornOutTabsDropped
    if (externalHandler) {
      const dropped = { Items: external.Items, Tabs: external.Tabs, SourceTabView: sourceApi, Signal: session.Controller.signal, DropIndex: session.DropIndex, Cancel: false }
      await raiseAsync('ExternalTornOutTabsDropped', dropped)
      if (dropped.Cancel) session.Controller.abort()
      return !dropped.Cancel && !session.Controller.signal.aborted && activeTabViewDrag.value === session && !disposed ? 'Move' : 'None'
    }
    const sourceIndex = sourceItems.IndexOf(item)
    sourceItems.RemoveAt(sourceIndex)
    try { collectionMethods.InsertAt(session.DropIndex, item) }
    catch (error) { sourceItems.InsertAt(sourceIndex, item); throw error }
    await select(session.DropIndex); raise('ExternalTornOutTabsDropped', { Items: external.Items, Tabs: external.Tabs, SourceTabView: sourceApi, Signal: session.Controller.signal, DropIndex: session.DropIndex }); return 'Move'
  },
  Complete(session, result, cancelled) { clearNativeDragEndListener(); pendingPointer = null; dropIndex.value = -1; clickResetTimer = window.setTimeout(() => { clickResetTimer = 0; if (activeTabViewDrag.value?.Source !== endpoint) suppressClick = false }, 0); raise('TabDragCompleted', { Item: session.Item, Tab: session.Tab, DropResult: result }); if (result === 'None' && !cancelled && session.CanLeaveSource) { raise('TabDroppedOutside', { Item: session.Item, Tab: session.Tab }); if (property('CanTearOutTabs') === true) void RequestTearOut(session.Item) } }
}
const owner = {
  Api: () => publicApi, Selected: (key: unknown) => selectedKey.value === key, Enabled: () => enabled.value,
  Compact: (key: unknown) => widthMode.value === 'Compact' && selectedKey.value !== key, Width: () => widthMode.value === 'Equal' ? equalWidth.value : undefined,
  ReorderHint: (key: unknown) => { const index = entries.value.findIndex(entry => entry.Key === key); return dropIndex.value >= 0 && index === Math.min(dropIndex.value, entries.value.length - 1) && activeTabViewDrag.value?.Key !== key ? metric('ListViewItemReorderHintThemeOffset', 10) * (direction.value === 'rtl' ? -1 : 1) : 0 },
  IsNativeDrag: () => activeTabViewDrag.value?.Native ?? false,
  OverlayMode: () => String(property('CloseButtonOverlayMode')), Dragging: (key: unknown) => activeTabViewDrag.value?.Source === endpoint && activeTabViewDrag.value.Key === key,
  Separator: (key: unknown) => { const index = entries.value.findIndex(entry => entry.Key === key); return selectedKey.value !== key && entries.value[index + 1]?.Key !== selectedKey.value },
  CanDrag: () => property('CanDragTabs') === true, TabIndex: (key: unknown) => (focusedKey.value ?? selectedKey.value ?? entries.value[0]?.Key) === key ? 0 : -1,
  PanelId: panelId, SetFocused: (key: unknown) => { focusedKey.value = key }, Select: (key: unknown) => { if (!suppressClick) void select(entries.value.findIndex(entry => entry.Key === key)) }, Close: (key: unknown) => { void close(key) }, KeyDown: headerKeyDown, PointerDown: pointerDown, DragStart: nativeDragStart, DragEnd: nativeDragEnd,
  SetElement: (key: unknown, element: HTMLElement | null) => { if (element) elements.set(key, element); else elements.delete(key); updateLayout() },
  Container: (key: unknown) => containers.get(key) ?? null,
  SetContainer: (key: unknown, container: Record<string, unknown> | null) => { if (container) { const entry = entries.value.find(entry => entry.Key === key); const identity = entry?.Node?.props?.__tabViewPublicItem as Record<string | symbol, any> | undefined; if (identity && identity !== container) identity[tabViewItemLiveControlKey] = container; const published = identity ?? container; if (entry) Object.defineProperty(container, tabViewItemTransferKey, { configurable: true, get: () => entry.Node ? cloneVNode(entry.Node, { __tabViewRecordKey: entry.Key, __tabViewPublicItem: published }) : entry.Item }); containers.set(key, published) } else containers.delete(key); containerVersion.value++ }
}
provide(tabViewItemOwnerKey, owner)
const ItemHost = defineComponent({ props: { Entry: { type: Object as PropType<RecordEntry>, required: true } }, setup(hostProps) { provide(tabViewItemRecordKey, hostProps.Entry.Key); return () => {
  const entry = hostProps.Entry
  if (entry.Node) { const declaration = cloneVNode(entry.Node, { key: entry.Key }); if (declaration.props) { declaration.props = { ...declaration.props }; delete declaration.props.__tabViewRecordKey; delete declaration.props.__tabViewPublicItem }; return h(Fragment, normalizeXamlNodes([declaration], instance)) }
  const templateNodes = children('TabItemTemplate')
  const selector = property('TabItemTemplateSelector') as { SelectTemplate?: (item: unknown, owner: unknown) => unknown } | null
  const template = pivotTemplate(selector?.SelectTemplate?.(entry.Item, publicApi) ?? property('TabItemTemplate'), instance)
  const declarations = templateNodes.length ? templateNodes : isVNode(template) ? [template] : Array.isArray(template) ? template.filter(isVNode) : []
  if (declarations.length) return xamlTemplateComponent(declarations.flatMap(node => tabViewTypeName(node) === 'DataTemplate' ? tabViewChildren(node) : [node]), entry.Item, instance)
  return h(TabViewItem, { key: entry.Key, ...(entry.Item && typeof entry.Item === 'object' ? entry.Item as Record<string, unknown> : { Header: entry.Item }), DataContext: entry.Item })
} } })
const presenter = (name: 'TabStripHeader' | 'TabStripFooter') => defineComponent({ setup: () => () => renderTabViewPresenter(property(name), children(name), property(`${name}Template`), children(`${name}Template`), instance) })
const HeaderOutlet = presenter('TabStripHeader')
const FooterOutlet = presenter('TabStripFooter')
const ContentPanel = defineComponent({ props: { Entry: { type: Object as PropType<RecordEntry>, required: true } }, setup(panelProps) {
  // Each TabView content UIElement can host a Page/UserControl with its own
  // x:Name declarations. Repeated sample pages must not replace one another's
  // SourceElement/TextBox names in the outer Gallery page namescope.
  provide(xamlNameScopeKey, shallowReactive<Record<string, unknown>>({}))
  return () => { const entry = panelProps.Entry; const current = containerOf(entry); const saved = realizedContent.get(entry.Key); return h('div', { class: 'win-tab-view-content-panel', hidden: entry.Key !== selectedKey.value, inert: entry.Key !== selectedKey.value ? true : undefined, 'aria-hidden': entry.Key !== selectedKey.value }, [renderTabViewPresenter(current ? current.Content : saved?.Content, [], current ? current.ContentTemplate : saved?.Template, [], instance)]) }
} })
const ContentOutlet = defineComponent({ setup: () => () => { const selected = selectedRecord.value; const container = containerOf(selected); if (selected && container) { const existing = realizedContent.get(selected.Key); if (!existing) realizedContent.set(selected.Key, { Content: container.Content, Template: container.ContentTemplate }) }; return h(Fragment, entries.value.filter(entry => realizedContent.has(entry.Key)).map(entry => h(ContentPanel, { key: entry.Key, Entry: entry }))) } })
const ResourcesOutlet = defineComponent({ setup: () => () => { const local: Record<string, VNode> = {}; collectXamlResources(children('Resources'), local); for (const key of Object.keys(resources)) if (!Object.hasOwn(local, key)) delete resources[key]; Object.assign(resources, local); brushResources.sync(local); const nextNames = [...new Set(Object.entries(local).filter(([, node]) => (node.type as { __xamlBrush?: boolean }).__xamlBrush).map(([key]) => key.replace(/^(Light|Dark|Default|HighContrast):/, '')))]; if (nextNames.join('|') !== resourceNames.value.join('|')) resourceNames.value = nextNames; return h(Fragment, normalizeXamlNodes(children('KeyboardAccelerators'), instance)) } })
const publicApi: Record<string | symbol, any> = {
  get Element() { return rootRef.value }, get TabItems() { return collection }, get SelectedIndex() { return selectedIndex.value }, set SelectedIndex(next: number) { void select(Number(next)) },
  get SelectedItem() { return sourceOf(selectedRecord.value) }, set SelectedItem(next: unknown) { const entry = entryFor(next); if (entry) void select(entry.Index); else if (next === null) void select(-1) },
  ContainerFromIndex: (index: number) => containerOf(entries.value[index]), ContainerFromItem: (item: unknown) => containerOf(entryFor(item)), IndexFromContainer: (container: unknown) => entryFor(container)?.Index ?? -1,
  Focus() { (elements.get(selectedKey.value) ?? addButtonRef.value)?.focus(); return Boolean(elements.size || addButtonRef.value) }, RequestTearOut,
  get ActualWidth() { return rootRef.value?.clientWidth ?? 0 }, get ActualHeight() { return rootRef.value?.clientHeight ?? 0 }
}
Object.defineProperty(publicApi, xamlControlIdentityKey, { value: publicApi })
for (const name of Object.keys(props) as (keyof typeof props)[]) {
  if (name === 'SelectedIndex' || name === 'SelectedItem') continue
  Object.defineProperty(publicApi, name, { enumerable: true, configurable: true, get: () => property(name), set: next => { overrides[name] = next; updateXamlBinding(props[name], next, instance) } })
  watch(() => value(props[name]), () => { delete overrides[name] })
}
function updateScroll() {
  const element = scrollerRef.value
  if (!element) return
  scrollOffset.value = Math.abs(element.scrollLeft)
  scrollMaximum.value = Math.max(0, element.scrollWidth - element.clientWidth)
  // Compare with the capacity before the two template arrows are present.
  // Using the current viewport would keep the arrows visible after tabs close.
  overflow.value = element.scrollWidth > (layoutMeasured ? availableWidth.value : element.clientWidth) + 1
}
function updateLayout() {
  if (disposed || layoutFrame) return
  layoutFrame = requestAnimationFrame(() => {
    layoutFrame = 0
    const root = stripRef.value
    if (root) {
      const listStyle = listRef.value ? getComputedStyle(listRef.value) : null
      const padding = (parseFloat(listStyle?.paddingLeft ?? '') || 0) + (parseFloat(listStyle?.paddingRight ?? '') || 0)
      const footerContent = footerContentRef.value
      let footerDesiredWidth = 0
      if (footerContent) {
        // Measure the desired size independently of the star column's arranged
        // width, then let a Stretch footer fill that column. Restore before paint.
        const previousWidth = footerContent.style.width, previousMaxWidth = footerContent.style.maxWidth
        footerContent.style.width = 'max-content'; footerContent.style.maxWidth = 'none'
        footerDesiredWidth = footerContent.scrollWidth
        footerContent.style.width = previousWidth; footerContent.style.maxWidth = previousMaxWidth
      }
      const nextWidth = Math.max(0, root.clientWidth - (headerRef.value?.offsetWidth ?? 2) - footerDesiredWidth - (addContainerRef.value?.offsetWidth ?? 0) - padding)
      if (layoutMeasured && Math.abs(nextWidth - availableWidth.value) > .5) frozenWidth.value = null
      layoutMeasured = true
      availableWidth.value = nextWidth
    }
    updateScroll()
  })
}
const scroll = (delta: number) => scrollerRef.value?.scrollBy({ left: delta * 50 * (direction.value === 'rtl' ? -1 : 1), behavior: 'smooth' })
const stripWheel = (event: WheelEvent) => {
  // TabScrollViewerStyle enables only horizontal scrolling. Consume the
  // gesture at both ends so the enclosing Gallery/page does not scroll.
  if (event.cancelable) event.preventDefault()
  event.stopPropagation()
  const scroller = scrollerRef.value
  if (!scroller || !enabled.value) return
  const lineHeight = parseFloat(getComputedStyle(elements.values().next().value ?? scroller).lineHeight) || 16
  const unit = event.deltaMode === 1 ? lineHeight : event.deltaMode === 2 ? scroller.clientWidth : 1
  const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY)
  const amount = horizontal ? event.deltaX : event.deltaY * (direction.value === 'rtl' ? -1 : 1)
  scroller.scrollLeft += amount * unit
  updateScroll()
}
const endScrollRepeat = () => { if (scrollRepeatTimer) clearTimeout(scrollRepeatTimer); if (scrollRepeatInterval) clearInterval(scrollRepeatInterval); scrollRepeatTimer = 0; scrollRepeatInterval = 0 }
const beginScrollRepeat = (event: PointerEvent, delta: number) => {
  if (!enabled.value || event.button !== 0) return
  endScrollRepeat(); scrollHasRepeated = true; scroll(delta)
  const button = event.currentTarget as HTMLElement
  try { button.setPointerCapture(event.pointerId) } catch { /* A released pointer still performs its initial RepeatButton click. */ }
  scrollRepeatTimer = window.setTimeout(() => { scroll(delta); scrollRepeatInterval = window.setInterval(() => scroll(delta), 100) }, 50)
}
const scrollClick = (delta: number) => { if (!scrollHasRepeated) scroll(delta); scrollHasRepeated = false }
const leaveStrip = () => { stripHovered.value = false; frozenWidth.value = null; updateLayout() }
watch(() => value(props.SelectedIndex), next => { if (Number.isInteger(Number(next))) void select(Number(next)) })
watch(() => value(props.SelectedItem), next => { if (next === undefined) return; const entry = entryFor(next); if (entry) void select(entry.Index) })
watch(entries, (next, previous = []) => {
  const positions = new Map([...elements].map(([key, element]) => [key, element.getBoundingClientRect()]))
  const now = performance.now()
  const animateLayout = previous.length > 0 && now - lastCollectionChange > 100
  lastCollectionChange = now
  if (animateLayout) void nextTick(() => {
    if (disposed || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    for (const entry of next) {
      const element = elements.get(entry.Key)
      const previousPosition = positions.get(entry.Key)
      if (!element?.animate || !previousPosition) continue
      const destination = element.getBoundingClientRect()
      const x = previousPosition.left - destination.left
      const y = previousPosition.top - destination.top
      if (Math.abs(x) < 1 && Math.abs(y) < 1) continue
      layoutAnimations.get(entry.Key)?.cancel()
      const animation = element.animate([{ transform: `translate3d(${x}px,${y}px,0)` }, { transform: 'translate3d(0,0,0)' }], { duration: 200, easing: 'cubic-bezier(0.1,0.9,0.2,1)' })
      layoutAnimations.set(entry.Key, animation)
      void animation.finished.catch(() => {}).finally(() => { if (layoutAnimations.get(entry.Key) === animation) { layoutAnimations.delete(entry.Key); animation.cancel() } })
    }
  })
  const priorIndex = previous.findIndex(entry => entry.Key === selectedKey.value)
  for (const key of realizedContent.keys()) if (!next.some(entry => entry.Key === key)) realizedContent.delete(key)
  const sameItemIndex = next.findIndex(entry => entry.Key === selectedKey.value)
  if (sameItemIndex >= 0) { if (priorIndex !== sameItemIndex) { emit('update:SelectedIndex', sameItemIndex); updateXamlBinding(props.SelectedIndex, sameItemIndex, instance) }; updateLayout(); return }
  const requestedItem = value(props.SelectedItem)
  const requested = requestedItem === undefined ? null : next.find(entry => entry.Item === requestedItem)
  const start = requested?.Index ?? Math.max(0, Math.min(next.length - 1, priorIndex < 0 ? Number(value(props.SelectedIndex)) || 0 : priorIndex))
  const nextItem = next.slice(start).find(itemEnabled) ?? [...next.slice(0, start)].reverse().find(itemEnabled)
  void select(nextItem?.Index ?? -1, previous.length > 0, sourceOf(previous[priorIndex])); updateLayout()
}, { immediate: true })
watch([enabled, widthMode, () => property('CanDragTabs'), () => property('CanReorderTabs'), () => property('CanTearOutTabs'), () => property('AllowDropTabs')], () => { pointerCancel(); if (activeTabViewDrag.value?.Source === endpoint) cancelTabViewDrag(); cancelExternalDrag(); endScrollRepeat(); if (!enabled.value || property('CanTearOutTabs') !== true) for (const request of tearOutRequests.values()) request.abort(); frozenWidth.value = null; updateLayout() })
onMounted(async () => {
  unregister = registerTabViewDragEndpoint(endpoint)
  if (rootRef.value) inheritedDirection.value = getComputedStyle(rootRef.value).direction
  if (typeof ResizeObserver !== 'undefined') {
    // Defer measuring to the next frame; writing widths while ResizeObserver
    // delivers its notifications can recursively resize the observed strip.
    observer = new ResizeObserver(updateLayout)
    for (const element of [rootRef.value, headerRef.value, footerContentRef.value, scrollerRef.value, itemsPresenterRef.value]) if (element) observer.observe(element)
  }
  window.addEventListener('pointermove', pointerMove, { passive: false }); window.addEventListener('pointerup', pointerUp); window.addEventListener('pointercancel', pointerCancel); window.addEventListener('blur', windowBlur); window.addEventListener('keydown', windowKeyDown, true); window.addEventListener('dragover', windowDragOver); window.addEventListener('drop', windowDrop)
  await nextTick(); updateLayout(); raise('Loaded', { OriginalSource: publicApi })
})
onUpdated(updateLayout)
onBeforeUnmount(() => { disposed = true; clearNativeDragEndListener(); cancelExternalDrag(); endScrollRepeat(); for (const animation of layoutAnimations.values()) animation.cancel(); layoutAnimations.clear(); for (const request of tearOutRequests.values()) request.abort(); unregister?.(); observer?.disconnect(); if (layoutFrame) cancelAnimationFrame(layoutFrame); if (clickResetTimer) clearTimeout(clickResetTimer); window.removeEventListener('pointermove', pointerMove); window.removeEventListener('pointerup', pointerUp); window.removeEventListener('pointercancel', pointerCancel); window.removeEventListener('blur', windowBlur); window.removeEventListener('keydown', windowKeyDown, true); window.removeEventListener('dragover', windowDragOver); window.removeEventListener('drop', windowDrop) })
defineExpose(publicApi)
</script>

<template>
  <div ref="rootRef" v-bind="rootAttrs" class="win-tab-view" :class="[attrs.class, requestedTheme ? `theme-${requestedTheme}` : '', { 'is-disabled': !enabled, 'win-theme-scope': requestedTheme, 'is-dragging': activeTabViewDrag?.Source === endpoint }]"
    :style="[attrs.style, rootStyle]" :dir="direction" :data-theme="requestedTheme" :aria-disabled="!enabled" @keydown="keyDown">
    <ResourcesOutlet />
    <div ref="stripRef" class="win-tab-view-tab-container-grid" data-part="TabContainerGrid" @pointerenter="stripHovered = true" @pointerleave="leaveStrip" @lostpointercapture="pendingPointer = null"
      @dragenter="nativeDragOver" @dragover="nativeDragOver" @drop="nativeDrop" @dragleave="nativeDragLeave" @wheel="stripWheel">
      <div ref="headerRef" class="win-tab-view-left-content-presenter" data-part="LeftContentPresenter"><HeaderOutlet /></div>
      <div ref="listRef" class="win-tab-view-list-view" data-part="TabListView" :style="listStyle">
        <div v-if="overflow" class="win-tab-view-scroll-button-container is-decrease"><button ref="scrollDecreaseButtonRef" class="win-tab-view-scroll-button" type="button" tabindex="-1" :disabled="!enabled || scrollOffset <= 0" :aria-label="t('TabViewScrollDecreaseButtonTooltip')" data-part="ScrollDecreaseButton" @pointerdown="beginScrollRepeat($event, -1)" @pointerup="endScrollRepeat" @pointercancel="endScrollRepeat" @lostpointercapture="endScrollRepeat" @click="scrollClick(-1)"><FontIcon class="win-tab-view-glyph" Glyph="&#xEDD9;" MirroredWhenRightToLeft="True" FontSize="{ThemeResource TabViewItemScrollButonFontSize}" FontFamily="{ThemeResource SymbolThemeFontFamily}" /></button></div>
        <div ref="scrollerRef" class="win-tab-view-scroll-viewer" data-part="ScrollViewer" @scroll.passive="updateScroll">
          <div ref="itemsPresenterRef" class="win-tab-view-items-presenter" role="tablist" data-part="TabsItemsPresenter">
            <div class="win-tab-view-items-edge" aria-hidden="true"></div>
            <ItemHost v-for="entry in entries" :key="entry.Key" :Entry="entry" />
            <div class="win-tab-view-items-edge" aria-hidden="true"></div>
          </div>
          <div v-if="dropIndex >= 0" class="win-tab-view-drop-indicator" :style="{ left: `${dropIndex < entries.length ? (elements.get(entries[dropIndex]?.Key)?.offsetLeft ?? 4) : (scrollerRef?.scrollWidth ?? 4) - 4}px` }" aria-hidden="true"></div>
        </div>
        <div v-if="overflow" class="win-tab-view-scroll-button-container is-increase"><button ref="scrollIncreaseButtonRef" class="win-tab-view-scroll-button" type="button" tabindex="-1" :disabled="!enabled || scrollOffset >= scrollMaximum - 1" :aria-label="t('TabViewScrollIncreaseButtonTooltip')" data-part="ScrollIncreaseButton" @pointerdown="beginScrollRepeat($event, 1)" @pointerup="endScrollRepeat" @pointercancel="endScrollRepeat" @lostpointercapture="endScrollRepeat" @click="scrollClick(1)"><FontIcon class="win-tab-view-glyph" Glyph="&#xEDDA;" MirroredWhenRightToLeft="True" FontSize="{ThemeResource TabViewItemScrollButonFontSize}" FontFamily="{ThemeResource SymbolThemeFontFamily}" /></button></div>
      </div>
      <div v-if="property('IsAddTabButtonVisible') !== false" ref="addContainerRef" class="win-tab-view-add-container"><button ref="addButtonRef" class="win-tab-view-add-button" type="button" data-part="AddButton" :disabled="!commandEnabled" :aria-label="t('TabViewAddButtonName')" @click="add"><span class="win-tab-view-glyph">&#xE710;</span></button></div>
      <div ref="footerRef" class="win-tab-view-right-content-presenter" data-part="RightContentPresenter"><div ref="footerContentRef" class="win-tab-view-right-content-content"><FooterOutlet /></div></div>
    </div>
    <div ref="contentRef" class="win-tab-view-content-presenter" data-part="TabContentPresenter" :id="panelId(selectedKey)" role="tabpanel" :style="contentStyle"><ContentOutlet /></div>
    <TabViewTemplateToolTip :Owner="addButtonRef" :Content="t('TabViewAddButtonTooltip')" :IsEnabled="commandEnabled" />
    <TabViewTemplateToolTip :Owner="scrollDecreaseButtonRef" :Content="t('TabViewScrollDecreaseButtonTooltip')" :IsEnabled="enabled && scrollOffset > 0" />
    <TabViewTemplateToolTip :Owner="scrollIncreaseButtonRef" :Content="t('TabViewScrollIncreaseButtonTooltip')" :IsEnabled="enabled && scrollOffset < scrollMaximum - 1" />
  </div>
</template>
