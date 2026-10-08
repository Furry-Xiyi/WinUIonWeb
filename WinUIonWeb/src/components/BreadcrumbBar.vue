<template>
  <nav
    ref="rootRef"
    v-bind="rootAttrs"
    :class="['win-breadcrumb-bar', attrs.class]"
    :style="[attrs.style, rootStyle]"
    role="navigation"
    :aria-disabled="IsEnabled ? undefined : 'true'"
    :dir="effectiveFlowDirection"
    @focusout="onFocusOut">
    <div class="win-breadcrumb-items-repeater" :style="repeaterStyle">
      <ItemOutlet index="-1" />
      <ItemOutlet v-for="(item, index) in Items" :key="getItemKey(item, index)" v-bind="{ item, index }" />
    </div>
  </nav>

  <Flyout
    ref="flyoutRef"
    Placement="Bottom"
    ShouldConstrainToRootBounds="False"
    FlyoutPresenterStyle="{x:Bind BreadcrumbBarTemplate.FlyoutPresenterStyle, Mode=OneWay}">
    <div class="win-breadcrumb-flyout-items" :dir="effectiveFlowDirection" :data-breadcrumb-owner="instanceId">
      <ItemOutlet
        v-for="({ Item: item, Index: index }, flyoutIndex) in flyoutItems"
        :key="getItemKey(item, index)"
        v-bind="{ item, index, flyoutIndex, dropDown: true }" />
    </div>
  </Flyout>
</template>

<script lang="ts">
import { CollectionItemTemplate } from './CollectionProperties'
export default { ItemTemplate: CollectionItemTemplate }
</script>

<script setup lang="ts">
import { cloneVNode, computed, defineComponent, Fragment, getCurrentInstance, h, inject, isVNode, nextTick, onBeforeUnmount, onMounted, provide, proxyRefs, ref, shallowReactive, shallowRef, unref, useAttrs, useSlots, watch, type VNode } from 'vue'
import BreadcrumbBarItem from './BreadcrumbBarItem.vue'
import Flyout from './Flyout.vue'
import { getCollectionProperty, getVNodeChildren } from './CollectionProperties'
import { breadcrumbBarItemContextKey } from './breadcrumbBarTemplate'
import { frameworkLayoutStyle } from './frameworkLayout'
import { xamlResourceDictionaryKey } from './Page.vue'
import { materializeXamlVNode, normalizeXamlNodes, resolveXamlHandler, resolveXamlResourceObject, resolveXamlValue, updateXamlBinding, xamlItemContextKey, xamlNameScopeKey, xamlScopeKey } from './xamlRuntime'

defineOptions({ name: 'BreadcrumbBar', inheritAttrs: false })
const props = defineProps({
  ItemsSource: { type: [String, Array, Object], default: null },
  ItemTemplate: { type: [String, Object, Function], default: undefined },
  IsEnabled: { type: [String, Boolean], default: true },
  FlowDirection: { type: String, default: '' },
  Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: 0 }, MinHeight: { type: [String, Number], default: 0 },
  MaxWidth: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' }, HorizontalAlignment: { type: String, default: 'Stretch' },
  VerticalAlignment: { type: String, default: 'Stretch' }, Visibility: { type: String, default: 'Visible' }
})
const emit = defineEmits(['ItemClicked', 'update:ItemsSource', 'update:ItemTemplate', 'update:IsEnabled', 'update:FlowDirection'])
const instance = getCurrentInstance()
const attrs = useAttrs()
const slots = useSlots()
const resources = inject<any>(xamlResourceDictionaryKey, null)
const inheritedScope = inject<Record<string, unknown>>(xamlScopeKey, {})
const rootRef = ref<HTMLElement | null>(null)
const flyoutRef = ref<any>(null)
const instanceId = `breadcrumb-${instance?.uid ?? 0}`
const overrides = shallowRef<Record<string, unknown>>({})
const resolve = (value: unknown) => resolveXamlValue(value, instance)
const property = (name: keyof typeof props) => name in overrides.value ? overrides.value[name] : resolve(props[name])
const dependencyProperty = (name: keyof typeof props) => computed({
  get: () => property(name),
  set: (value) => {
    overrides.value = { ...overrides.value, [name]: value }
    updateXamlBinding(props[name], value, instance)
    emit(`update:${name}` as 'update:ItemsSource', value)
  }
})
const ItemsSource = dependencyProperty('ItemsSource')
const ItemTemplate = dependencyProperty('ItemTemplate')
const IsEnabled = dependencyProperty('IsEnabled')
const FlowDirection = dependencyProperty('FlowDirection')
const publicApi = proxyRefs({ Element: rootRef, ItemsSource, ItemTemplate, IsEnabled, FlowDirection, Focus: () => focusItem(focusableIndices()[0]) })
for (const name of ['ItemsSource', 'ItemTemplate', 'IsEnabled', 'FlowDirection'] as const) watch(() => resolve(props[name]), () => {
  const values = { ...overrides.value }; delete values[name]; overrides.value = values
})

const sourceRevision = ref(0)
let unsubscribeSource: (() => void) | undefined
watch(ItemsSource, (source: any) => {
  unsubscribeSource?.()
  unsubscribeSource = undefined
  if (typeof source?.addEventListener === 'function') {
    const changed = () => { sourceRevision.value += 1 }
    source.addEventListener('CollectionChanged', changed)
    unsubscribeSource = () => source.removeEventListener('CollectionChanged', changed)
  }
}, { immediate: true })
const Items = computed(() => {
  void sourceRevision.value
  const source: any = ItemsSource.value
  if (Array.isArray(source)) return source
  if (source && Number.isFinite(source.Count)) return Array.from({ length: source.Count }, (_, index) => source.GetAt?.(index) ?? source[index])
  if (source && typeof source[Symbol.iterator] === 'function') return Array.from(source)
  return []
})
const rootAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([name]) => !['class', 'style', 'ItemClicked', 'onItemClicked'].includes(name))))
const inheritedDirection = ref('ltr')
const effectiveFlowDirection = computed(() => FlowDirection.value === 'RightToLeft' ? 'rtl' : FlowDirection.value === 'LeftToRight' ? 'ltr' : inheritedDirection.value)
const rootStyle = computed(() => frameworkLayoutStyle(props, instance))
const availableWidth = ref<number | null>(null)
const desiredHeight = ref(0)
const repeaterStyle = computed(() => ({
  '--breadcrumb-available-width': availableWidth.value === null ? undefined : `${availableWidth.value}px`,
  minHeight: desiredHeight.value ? `${desiredHeight.value}px` : undefined
}))
const firstRenderedIndex = ref(0)
const ellipsisIsRendered = ref(false)
const focusedIndex = ref<number | null>(null)
const itemRefs = new Map<number, any>()
const flyoutItemRefs = new Map<number, any>()
type CollectionFocusSnapshot = { item: unknown; occurrence: number; index: number; element: Element }
let previousItems = Items.value.slice()
let pendingCollectionFocus: CollectionFocusSnapshot | null = null
const flyoutItems = shallowRef<Array<{ Item: unknown; Index: number }>>([])
const visibleItemsCount = computed(() => Items.value.length - firstRenderedIndex.value)
const itemKeys = new WeakMap<object, number>()
let nextKey = 0
const getItemKey = (item: unknown, index: number) => {
  if (item && typeof item === 'object') {
    if (!itemKeys.has(item)) itemKeys.set(item, ++nextKey)
    return `item:${itemKeys.get(item)}:${index}`
  }
  return `${index}:${String(item)}`
}
const elementFor = (value: any): HTMLElement | null => unref(value?.Element) ?? value?.$el ?? value ?? null
const isEnabled = (index: number) => IsEnabled.value !== false && (index < 0 || itemRefs.get(index)?.IsEnabled !== false)
const focusableIndices = () => {
  const indices: number[] = []
  if (ellipsisIsRendered.value && isEnabled(-1)) indices.push(-1)
  for (let index = firstRenderedIndex.value; index < Items.value.length; index += 1) if (isEnabled(index)) indices.push(index)
  return indices
}
const getTabIndex = (index: number) => {
  const indices = focusableIndices()
  const target = indices.includes(focusedIndex.value as number) ? focusedIndex.value : indices[0]
  return target === index ? 0 : -1
}
const focusItem = (index: number) => {
  if (!focusableIndices().includes(index)) return false
  focusedIndex.value = index
  itemRefs.get(index)?.Focus?.()
  return document.activeElement === elementFor(itemRefs.get(index))
}
const ensureFocus = () => {
  const indices = focusableIndices()
  const active = document.activeElement
  const focusWasInside = rootRef.value?.contains(active) ?? false
  if (!indices.includes(focusedIndex.value as number)) {
    focusedIndex.value = indices[0] ?? null
    if (focusWasInside && focusedIndex.value !== null) nextTick(() => focusItem(focusedIndex.value as number))
  }
}
const onFocusOut = (event: FocusEvent) => {
  if (!rootRef.value?.contains(event.relatedTarget as Node | null)) {
    focusedIndex.value = null
    // A real move to another control takes precedence over deferred restoration
    // after a collection edit. DOM removal commonly reports a null target.
    if (event.relatedTarget && event.relatedTarget !== document.body && event.relatedTarget !== document.documentElement) pendingCollectionFocus = null
  }
}
const captureCollectionFocus = () => {
  const active = document.activeElement
  if (!active || !rootRef.value?.contains(active)) return
  const index = [...itemRefs].find(([, control]) => elementFor(control)?.contains(active))?.[0]
  if (index === undefined) return
  const item = previousItems[index]
  const occurrence = index < 0 ? 0 : previousItems.slice(0, index).filter(value => Object.is(value, item)).length
  pendingCollectionFocus = { item, occurrence, index, element: active }
}
const restoreCollectionFocus = () => {
  const snapshot = pendingCollectionFocus
  pendingCollectionFocus = null
  if (!snapshot) return
  const active = document.activeElement
  // Preserve explicit focus changes made while Vue patches and the layout is
  // measured. A removed focused container leaves body as the active element.
  if (active && active !== snapshot.element && active !== document.body && active !== document.documentElement) return
  const indices = focusableIndices()
  if (!indices.length) return
  let desiredIndex = snapshot.index
  if (snapshot.index >= 0) {
    let occurrence = 0
    desiredIndex = Items.value.findIndex(item => Object.is(item, snapshot.item) && occurrence++ === snapshot.occurrence)
    if (desiredIndex < 0) desiredIndex = snapshot.index
    else if (desiredIndex < firstRenderedIndex.value && ellipsisIsRendered.value) desiredIndex = -1
  }
  const target = indices.includes(desiredIndex) ? desiredIndex
    : indices.find(index => index >= desiredIndex) ?? indices[indices.length - 1]
  focusItem(target)
}
const raiseItemClicked = (item: unknown, index: number) => {
  if (!isEnabled(index)) return
  const args = Object.freeze({ Item: item, Index: index })
  resolveXamlHandler(attrs.ItemClicked ?? attrs.onItemClicked, instance)?.(publicApi, args)
  emit('ItemClicked', publicApi, args)
}
const closeFlyout = () => flyoutRef.value?.Hide?.()
const openFlyout = async () => {
  if (!isEnabled(-1) || !ellipsisIsRendered.value || firstRenderedIndex.value < 1) return
  // WinUI clones hidden items at open time and presents them in reverse order.
  flyoutItems.value = Items.value.slice(0, firstRenderedIndex.value).map((Item, Index) => ({ Item, Index })).reverse()
  await nextTick()
  void flyoutRef.value?.ShowAt?.(elementFor(itemRefs.get(-1)))
}
const onItemKeyDown = (event: KeyboardEvent, index: number) => {
  const forward = effectiveFlowDirection.value === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
  const backward = effectiveFlowDirection.value === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
  if (event.key !== forward && event.key !== backward) return
  const indices = focusableIndices()
  const position = indices.indexOf(index)
  const next = position + (event.key === forward ? 1 : -1)
  if (position < 0 || next < 0 || next >= indices.length) return
  event.preventDefault()
  focusItem(indices[next])
}
const onDropDownKeyDown = (event: KeyboardEvent, index: number) => {
  const indices = flyoutItems.value.map((_, i) => i).filter((i) => flyoutItemRefs.get(i)?.IsEnabled !== false)
  const position = indices.indexOf(index)
  let next = position
  if (event.key === 'ArrowDown') next = Math.min(indices.length - 1, position + 1)
  else if (event.key === 'ArrowUp') next = Math.max(0, position - 1)
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = indices.length - 1
  else return
  event.preventDefault()
  flyoutItemRefs.get(indices[next])?.Focus?.()
}

const slotNodes = shallowRef(slots.default?.() ?? [])
const templateNodes = computed<VNode[]>(() => {
  const raw = 'ItemTemplate' in overrides.value ? overrides.value.ItemTemplate : props.ItemTemplate
  const key = typeof raw === 'string' ? raw.match(/^\{(?:StaticResource|ThemeResource)\s+([^}]+)\}$/)?.[1] : null
  const resource = key ? resources?.[key] ?? resolveXamlResourceObject(key, instance) : null
  if (isVNode(resource)) return getVNodeChildren(resource)
  if (isVNode(ItemTemplate.value)) return getVNodeChildren(ItemTemplate.value)
  if (Array.isArray(ItemTemplate.value)) return ItemTemplate.value
  const marker = slotNodes.value.find((node) => getCollectionProperty(node) === 'itemTemplate')
  return marker ? getVNodeChildren(marker) : []
})

const ItemOutlet = defineComponent({
  name: 'BreadcrumbBarElementFactory',
  props: { item: { type: null, default: undefined }, index: { type: [Number, String], required: true }, dropDown: Boolean, flyoutIndex: { type: Number, default: -1 } },
  setup(outletProps) {
    const outletInstance = getCurrentInstance()
    const index = () => Number(outletProps.index)
    const context = {
      get enabled() { return IsEnabled.value !== false },
      get direction() { return effectiveFlowDirection.value },
      get flyoutOpen() { return Boolean(flyoutRef.value?.IsOpen) },
      get type() { return outletProps.dropDown ? 'EllipsisDropDown' : index() === -1 ? 'Ellipsis' : index() === Items.value.length - 1 ? 'LastItem' : 'Inline' },
      get hidden() { return !outletProps.dropDown && (index() === -1 ? !ellipsisIsRendered.value : index() < firstRenderedIndex.value) },
      get tabIndex() { return outletProps.dropDown ? 0 : getTabIndex(index()) },
      activate() {
        if (outletProps.dropDown) { closeFlyout(); raiseItemClicked(outletProps.item, index()) }
        else if (index() === -1) void openFlyout()
        else raiseItemClicked(outletProps.item, index())
      },
      gotFocus() { if (!outletProps.dropDown) focusedIndex.value = index() },
      keyDown(event: KeyboardEvent) { if (outletProps.dropDown) onDropDownKeyDown(event, outletProps.flyoutIndex); else onItemKeyDown(event, index()) }
    }
    provide(breadcrumbBarItemContextKey, context)
    provide(xamlItemContextKey, computed(() => outletProps.item))
    provide(xamlNameScopeKey, shallowReactive({}))
    const setRef = (control: any) => {
      const map = outletProps.dropDown ? flyoutItemRefs : itemRefs
      const key = outletProps.dropDown ? outletProps.flyoutIndex : index()
      if (control) map.set(key, control)
      else map.delete(key)
    }
    return () => {
      const values = {
        Content: outletProps.item,
        ref: setRef,
        'aria-posinset': outletProps.dropDown ? outletProps.flyoutIndex + 1 : index() < 0 ? undefined : index() - firstRenderedIndex.value + 1,
        'aria-setsize': outletProps.dropDown ? flyoutItems.value.length : visibleItemsCount.value
      }
      if (index() === -1) return h(BreadcrumbBarItem, values)
      const nodes = templateNodes.value
      if (nodes.length) {
        const materialized = normalizeXamlNodes(materializeXamlVNode(nodes, outletProps.item, outletInstance) as VNode[], outletInstance)
        const root = materialized.find((node) => node.type === BreadcrumbBarItem || (node.type as any)?.name === 'BreadcrumbBarItem')
        // BreadcrumbElementFactory assigns Content(args.Data()) even when
        // the supplied DataTemplate already produced a BreadcrumbBarItem.
        if (root) return cloneVNode(root, values)
        return h(BreadcrumbBarItem, values, { default: () => materialized })
      }
      const template = ItemTemplate.value
      if (template && (typeof template === 'function' || typeof template === 'object')) return h(BreadcrumbBarItem, values, { default: () => [h(template as any)] })
      return h(BreadcrumbBarItem, values)
    }
  }
})

let resizeObserver: ResizeObserver | undefined
let frame = 0
let unmounted = false
const measure = () => {
  frame = 0
  const root = rootRef.value
  if (!root || unmounted) return
  const style = getComputedStyle(root)
  const width = Math.max(0, root.clientWidth - parseFloat(style.paddingLeft || '0') - parseFloat(style.paddingRight || '0'))
  inheritedDirection.value = getComputedStyle(root.parentElement ?? root).direction === 'rtl' ? 'rtl' : 'ltr'
  availableWidth.value = width
  const measureItem = (index: number) => {
    const element = elementFor(itemRefs.get(index))
    if (!element) return { width: 0, height: 0 }
    const bounds = element.getBoundingClientRect()
    const itemStyle = getComputedStyle(element)
    return {
      width: bounds.width + parseFloat(itemStyle.marginLeft || '0') + parseFloat(itemStyle.marginRight || '0'),
      height: bounds.height + parseFloat(itemStyle.marginTop || '0') + parseFloat(itemStyle.marginBottom || '0')
    }
  }
  const dimensions = Items.value.map((_, index) => measureItem(index))
  desiredHeight.value = dimensions.reduce((height, item) => Math.max(height, item.height), 0)
  const totalWidth = dimensions.reduce((sum, item) => sum + item.width, 0)
  ellipsisIsRendered.value = totalWidth > width
  if (!ellipsisIsRendered.value || !Items.value.length) {
    firstRenderedIndex.value = 0
    closeFlyout()
  } else {
    let index = Items.value.length - 1
    let usedWidth = dimensions[index].width + measureItem(-1).width
    for (let previous = index - 1; previous >= 0; previous -= 1) {
      if (usedWidth + dimensions[previous].width > width) break
      usedWidth += dimensions[previous].width
      index = previous
    }
    firstRenderedIndex.value = index
  }
  ensureFocus()
  restoreCollectionFocus()
}
const requestMeasure = () => { if (frame || unmounted) return; frame = requestAnimationFrame(measure) }
const observeItems = () => {
  resizeObserver?.disconnect()
  if (rootRef.value) resizeObserver?.observe(rootRef.value)
  itemRefs.forEach((control) => { const element = elementFor(control); if (element) resizeObserver?.observe(element) })
}
watch(Items, async () => {
  closeFlyout()
  // The pre-flush watcher still sees the focused container before Vue replaces
  // it. Keep an independent array snapshot: deep-watch oldValue aliases the
  // live source after unshift/splice and cannot identify the previous item.
  captureCollectionFocus()
  previousItems = Items.value.slice()
  await nextTick()
  observeItems()
  requestMeasure()
}, { deep: true })
watch(ItemTemplate, async () => { closeFlyout(); await nextTick(); observeItems(); requestMeasure() })
watch([IsEnabled, FlowDirection], () => { if (IsEnabled.value === false) closeFlyout(); requestMeasure() })
onMounted(async () => {
  if (typeof ResizeObserver !== 'undefined') resizeObserver = new ResizeObserver(requestMeasure)
  await nextTick()
  observeItems()
  requestMeasure()
  document.fonts?.ready.then(requestMeasure)
})
onBeforeUnmount(() => { unmounted = true; pendingCollectionFocus = null; unsubscribeSource?.(); resizeObserver?.disconnect(); if (frame) cancelAnimationFrame(frame) })
provide(xamlScopeKey, { ...inheritedScope, BreadcrumbBarTemplate: {
  FlyoutPresenterStyle: {
    Background: '{ThemeResource BreadcrumbBarEllipsisFlyoutPresenterBackground}',
    BorderBrush: '{ThemeResource BreadcrumbBarEllipsisFlyoutPresenterBorderBrush}',
    BorderThickness: '{ThemeResource BreadcrumbBarEllipsisFlyoutPresenterBorderThemeThickness}',
    Padding: '0,2', MinHeight: 40, MaxWidth: '{ThemeResource FlyoutThemeMaxWidth}', CornerRadius: '{ThemeResource OverlayCornerRadius}',
    'ScrollViewer.HorizontalScrollMode': 'Disabled', 'ScrollViewer.HorizontalScrollBarVisibility': 'Disabled',
    'ScrollViewer.VerticalScrollMode': 'Auto', 'ScrollViewer.VerticalScrollBarVisibility': 'Auto',
    'ScrollViewer.IsHorizontalRailEnabled': false, 'ScrollViewer.IsVerticalRailEnabled': false, 'ScrollViewer.ZoomMode': 'Disabled'
  }
} })
defineExpose({ Element: rootRef, ItemsSource, ItemTemplate, IsEnabled, FlowDirection, Focus: () => focusItem(focusableIndices()[0]) })
</script>

<style scoped>
.win-breadcrumb-bar { box-sizing: border-box; display: block; width: 100%; min-width: 0; min-height: 0; overflow: hidden; }
.win-breadcrumb-items-repeater { position: relative; display: flex; align-items: stretch; width: 100%; min-width: 0; overflow: hidden; white-space: nowrap; }
.win-breadcrumb-flyout-items { display: flex; flex-direction: column; align-items: stretch; min-width: 0; max-width: 100%; }
</style>
