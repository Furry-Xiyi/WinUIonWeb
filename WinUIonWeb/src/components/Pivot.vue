<template>
  <div ref="rootRef" v-bind="rootAttrs" class="win-pivot" :class="[attrs.class, requestedTheme ? `theme-${requestedTheme}` : '', { 'is-locked': locked, 'is-disabled': !enabled, 'win-theme-scope': requestedTheme }]"
    :style="[attrs.style, rootStyle]" :dir="flowDirection" :data-theme="requestedTheme" :aria-disabled="enabled ? undefined : 'true'"
    @keydown="onKeyDown" @focusin="onFocusChanged" @focusout="onFocusChanged" @pointerdown="onPointerDown" @pointermove="onPointerMove" @pointerup="onPointerUp"
    @pointercancel="cancelGesture" @lostpointercapture="onLostPointerCapture">
    <div class="win-pivot-root-element" data-part="RootElement">
      <div v-if="hasTitle" class="win-pivot-title-content-control" data-part="TitleContentControl"><TitleOutlet /></div>
      <div class="win-pivot-template-grid" :style="templateGridStyle">
        <div class="win-pivot-scroll-viewer" data-part="ScrollViewer">
          <div class="win-pivot-panel" data-part="Panel">
            <div class="win-pivot-layout-element" data-part="LayoutElement">
              <div class="win-pivot-left-header-presenter" data-part="LeftHeaderPresenter"><LeftHeaderOutlet /></div>
              <div ref="headerClipperRef" class="win-pivot-header-clipper" data-part="HeaderClipper"
                @pointerenter="onHeaderPointerEnter" @pointerleave="onHeaderPointerLeave" @scroll.passive="updateNavigationButtons">
                <div class="win-pivot-header-grid">
                  <div ref="headerPanelRef" class="win-pivot-header-panel" :data-part="usingStaticHeaders ? 'StaticHeader' : 'Header'" role="tablist">
                    <button v-for="item in orderedItems" :key="item.key" :ref="element => setHeaderRef(item.key, element)" :data-pivot-index="item.index"
                      class="win-pivot-header-item" :class="headerClass(item)" :id="headerId(item)" type="button" role="tab"
                      :disabled="!enabled || !item.enabled" :tabindex="item.key === selectedKey ? 0 : -1" :accesskey="pivotText(item.accessKey) || undefined"
                      :aria-selected="item.key === selectedKey" :aria-controls="panelId(item)"
                      @focus="focusedKey = item.key"
                      @keydown="onHeaderKeyDown($event)" @pointerdown="onHeaderPressed($event, item.key)"
                      @pointerup="clearPressedHeader" @pointercancel="clearPressedHeader" @lostpointercapture="clearPressedHeader"
                      @pointerenter="hoveredKey = item.key" @pointerleave="hoveredKey = null">
                      <div class="win-pivot-header-grid-content">
                        <div class="win-pivot-header-content-presenter"><HeaderOutlet :item="item" /></div>
                        <div class="win-pivot-selected-pipe" aria-hidden="true"></div>
                      </div>
                    </button>
                  </div>
                  <div class="win-pivot-focus-follower" :class="{ 'is-visible': showFocusFollower }" :style="focusFollowerStyle" data-part="FocusFollower" aria-hidden="true"></div>
                </div>
              </div>
              <button class="win-pivot-nav-button win-pivot-previous-button" :class="{ 'is-visible': showPreviousButton }" type="button"
                data-part="PreviousButton" tabindex="-1" aria-hidden="true" :disabled="!showPreviousButton || !enabled || locked"
                @pointerenter="onHeaderPointerEnter" @pointerleave="onHeaderPointerLeave">
                <span class="win-pivot-nav-glyph">&#xE76B;</span>
              </button>
              <button class="win-pivot-nav-button win-pivot-next-button" :class="{ 'is-visible': showNextButton }" type="button"
                data-part="NextButton" tabindex="-1" aria-hidden="true" :disabled="!showNextButton || !enabled || locked"
                @pointerenter="onHeaderPointerEnter" @pointerleave="onHeaderPointerLeave">
                <span class="win-pivot-nav-glyph">&#xE76C;</span>
              </button>
              <div class="win-pivot-right-header-presenter" data-part="RightHeaderPresenter"><RightHeaderOutlet /></div>
              <div ref="itemPresenterRef" class="win-pivot-item-presenter" data-part="PivotItemPresenter" :style="itemPresenterStyle">
                <ItemsOutlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { pivotProperties } from './PivotProperties'
export default { ...pivotProperties }
</script>

<script setup lang="ts">
import { cloneVNode, computed, defineComponent, Fragment, getCurrentInstance, h, nextTick, onBeforeUnmount, onMounted, onUpdated, provide, ref, shallowReactive, shallowRef, useAttrs, useSlots, watch, type ComponentPublicInstance, type PropType, type VNode } from 'vue'
import PivotItem from './PivotItem.vue'
import { frameworkLayoutStyle } from './frameworkLayout'
import { attachedValue, xamlThickness } from './layout'
import { getPivotProperty, pivotChildren, PivotItemContentTemplate, pivotItemContextKey, pivotItemIdentityKey, pivotNodes, pivotPropertyChildren, pivotRootAttributes, pivotText, pivotTypeName, renderPivotPresenter } from './PivotProperties'
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, updateXamlBinding } from './xamlRuntime'

defineOptions({ name: 'Pivot', inheritAttrs: false })
const props = defineProps({
  Title: { type: null as unknown as PropType<unknown>, default: null }, TitleTemplate: { type: null as unknown as PropType<unknown>, default: null }, HeaderTemplate: { type: null as unknown as PropType<unknown>, default: null },
  LeftHeader: { type: null as unknown as PropType<unknown>, default: null }, LeftHeaderTemplate: { type: null as unknown as PropType<unknown>, default: null }, RightHeader: { type: null as unknown as PropType<unknown>, default: null }, RightHeaderTemplate: { type: null as unknown as PropType<unknown>, default: null },
  ItemsSource: { type: null as unknown as PropType<unknown>, default: null }, ItemTemplate: { type: null as unknown as PropType<unknown>, default: null }, ItemsPanel: { type: null as unknown as PropType<unknown>, default: null },
  SelectedIndex: { type: null as unknown as PropType<unknown>, default: undefined }, SelectedItem: { type: null as unknown as PropType<unknown>, default: undefined }, IsLocked: { type: null as unknown as PropType<unknown>, default: false },
  IsHeaderItemsCarouselEnabled: { type: null as unknown as PropType<unknown>, default: true }, HeaderFocusVisualPlacement: { type: null as unknown as PropType<unknown>, default: 'ItemHeaders' },
  IsEnabled: { type: null as unknown as PropType<unknown>, default: true }, IsTabStop: { type: null as unknown as PropType<unknown>, default: false }, Visibility: { type: null as unknown as PropType<unknown>, default: 'Visible' },
  Background: { type: null as unknown as PropType<unknown>, default: '{ThemeResource PivotBackground}' }, Foreground: { type: null as unknown as PropType<unknown>, default: '' }, Margin: { type: null as unknown as PropType<unknown>, default: 0 }, Padding: { type: null as unknown as PropType<unknown>, default: 0 },
  Width: { type: null as unknown as PropType<unknown>, default: '' }, Height: { type: null as unknown as PropType<unknown>, default: '' }, MinWidth: { type: null as unknown as PropType<unknown>, default: '' }, MinHeight: { type: null as unknown as PropType<unknown>, default: '' }, MaxWidth: { type: null as unknown as PropType<unknown>, default: '' }, MaxHeight: { type: null as unknown as PropType<unknown>, default: '' },
  HorizontalAlignment: { type: null as unknown as PropType<unknown>, default: 'Stretch' }, VerticalAlignment: { type: null as unknown as PropType<unknown>, default: 'Stretch' }, FlowDirection: { type: null as unknown as PropType<unknown>, default: '' }, RequestedTheme: { type: null as unknown as PropType<unknown>, default: 'Default' },
  Opacity: { type: null as unknown as PropType<unknown>, default: 1 }, IsHitTestVisible: { type: null as unknown as PropType<unknown>, default: true }
})
const emit = defineEmits(['SelectionChanged', 'PivotItemLoading', 'PivotItemLoaded', 'PivotItemUnloading', 'PivotItemUnloaded', 'update:SelectedIndex', 'update:SelectedItem'])
const instance = getCurrentInstance()
const attrs = useAttrs()
const slots = useSlots()
const rootRef = ref<HTMLElement | null>(null)
const headerClipperRef = ref<HTMLElement | null>(null)
const headerPanelRef = ref<HTMLElement | null>(null)
const itemPresenterRef = ref<HTMLElement | null>(null)
const headerRefs = new Map<unknown, HTMLElement>()
const itemRefs = new Map<unknown, ComponentPublicInstance>()
const selectedIndex = ref(-1)
const displayedKey = shallowRef<unknown>(null)
const focusedKey = shallowRef<unknown>(null)
const hoveredKey = shallowRef<unknown>(null)
const pressedKey = shallowRef<unknown>(null)
const loadedKeys = shallowRef(new Set<unknown>())
const headerOverflow = ref(false)
const headerPointerOver = ref(false)
const inheritedFlowDirection = ref('ltr')
const animationState = ref<'Idle' | 'FlyOut' | 'FlyIn'>('Idle')
const pointerOffset = ref(0)
const headerHasFocus = ref(false)
const keyboardFocus = ref(false)
const focusFollowerBounds = ref({ left: 0, width: 0, height: 48 })
const value = (source: unknown) => resolveXamlValue(source, instance)
const overrides = shallowReactive<Record<string, unknown>>({})
const property = (name: keyof typeof props): unknown => {
  const source = name in overrides ? overrides[name] : props[name]
  return /Template$/.test(name) && typeof source === 'string' && /^\{(?:StaticResource|ThemeResource)\s/.test(source) ? source : value(source)
}
const itemOverrides = shallowReactive(new Map<unknown, Record<string, unknown>>())
const enabled = computed(() => property('IsEnabled') !== false)
const locked = computed(() => property('IsLocked') === true)
const carousel = computed(() => property('IsHeaderItemsCarouselEnabled') !== false)
const usingStaticHeaders = computed(() => !carousel.value || !headerOverflow.value)
const flowDirection = computed(() => property('FlowDirection') === 'RightToLeft' ? 'rtl' : property('FlowDirection') === 'LeftToRight' ? 'ltr' : inheritedFlowDirection.value)
const requestedTheme = computed(() => ['Light', 'Dark'].includes(String(property('RequestedTheme'))) ? String(property('RequestedTheme')).toLowerCase() : undefined)
const rootAttrs = computed(() => pivotRootAttributes(attrs, instance))
const rootStyle = computed(() => ({ ...frameworkLayoutStyle({ ...Object.fromEntries(Object.keys(props).map(name => [name, property(name as keyof typeof props)])), Padding: '' }, instance), color: property('Foreground') ? String(property('Foreground')) : undefined }))
const templateGridStyle = computed(() => ({ margin: xamlThickness(property('Padding')) }))
const itemPresenterStyle = computed(() => ({ transform: pointerOffset.value ? `translate3d(${pointerOffset.value}px,0,0)` : undefined }))
const nodes = computed(() => pivotNodes(slots.default?.() ?? []))
const propertyNodes = (name: string) => pivotPropertyChildren(nodes.value, 'Pivot', name)
const hasTitle = computed(() => propertyNodes('title').length > 0 || property('Title') !== null && property('Title') !== undefined && property('Title') !== '' || Boolean(property('TitleTemplate')) || propertyNodes('titleTemplate').length > 0)
const presenterOutlet = (name: 'title' | 'leftHeader' | 'rightHeader', content: () => unknown, template: () => unknown) => defineComponent({
  setup: () => () => renderPivotPresenter(content(), propertyNodes(name), template(), propertyNodes(`${name}Template`), instance)
})
const TitleOutlet = presenterOutlet('title', () => property('Title'), () => property('TitleTemplate'))
const LeftHeaderOutlet = presenterOutlet('leftHeader', () => property('LeftHeader'), () => property('LeftHeaderTemplate'))
const RightHeaderOutlet = presenterOutlet('rightHeader', () => property('RightHeader'), () => property('RightHeaderTemplate'))
type PivotRecord = { key: PropertyKey; index: number; vnode: VNode | null; source: unknown; header: unknown; headerNodes: VNode[]; enabled: boolean; accessKey?: unknown }
const objectKeys = new WeakMap<object, number>()
const valueKeys = new Map<unknown, number>()
let nextObjectKey = 0
const sourceKey = (source: unknown, occurrence: number): PropertyKey => {
  if (!source || typeof source !== 'object') {
    if (!valueKeys.has(source)) valueKeys.set(source, ++nextObjectKey)
    return `source-value:${valueKeys.get(source)}:${occurrence}`
  }
  if (!objectKeys.has(source)) objectKeys.set(source, ++nextObjectKey)
  return `source-object:${objectKeys.get(source)}:${occurrence}`
}
const items = computed<PivotRecord[]>(() => {
  const source = property('ItemsSource')
  if (source && typeof (source as Iterable<unknown>)[Symbol.iterator] === 'function') {
    const occurrences = new Map<unknown, number>()
    return Array.from(source as Iterable<unknown>, (item, index) => {
      const occurrence = occurrences.get(item) ?? 0
      occurrences.set(item, occurrence + 1)
      const key = sourceKey(item, occurrence)
      const sourceProperty = (name: string, fallback: unknown) => name in (itemOverrides.get(key) ?? {}) ? itemOverrides.get(key)![name] : fallback
      return {
    key, index, vnode: null, source: item,
    header: sourceProperty('Header', item),
    headerNodes: [], enabled: sourceProperty('IsEnabled', !(item && typeof item === 'object' && 'IsEnabled' in item && value((item as { IsEnabled: unknown }).IsEnabled) === false)) !== false
      }
    })
  }
  const children = propertyNodes('items').length ? propertyNodes('items') : nodes.value.filter(node => !getPivotProperty(node, 'Pivot'))
  return children.filter(node => pivotTypeName(node) === 'PivotItem').map((node, index) => {
    const key = node.key ?? `item:${index}`
    const itemProperty = (name: string) => name in (itemOverrides.get(key) ?? {}) ? itemOverrides.get(key)![name] : value(node.props?.[name])
    return { key, index, vnode: node, source: node.props ?? {}, header: itemProperty('Header'), headerNodes: 'Header' in (itemOverrides.get(key) ?? {}) ? [] : pivotPropertyChildren(pivotChildren(node), 'PivotItem', 'header'), enabled: itemProperty('IsEnabled') !== false, accessKey: itemProperty('AccessKey') }
  })
})
const selectedRecord = computed(() => items.value[selectedIndex.value] ?? null)
const selectedKey = computed(() => selectedRecord.value?.key ?? null)
const showFocusFollower = computed(() => enabled.value && headerHasFocus.value && keyboardFocus.value && property('HeaderFocusVisualPlacement') === 'SelectedItemHeader')
const focusFollowerStyle = computed(() => ({ width: `${focusFollowerBounds.value.width}px`, height: `${focusFollowerBounds.value.height}px`, transform: `translateX(${focusFollowerBounds.value.left}px)` }))
const orderedItems = computed(() => {
  if (usingStaticHeaders.value || selectedIndex.value < 0) return items.value
  return [...items.value.slice(selectedIndex.value), ...items.value.slice(0, selectedIndex.value)]
})
const uid = `pivot-${instance?.uid ?? 0}`
const headerId = (item: PivotRecord) => `${uid}-header-${item.index}`
const panelId = (item: PivotRecord) => `${uid}-item-${item.index}`
const sourceOf = (item: PivotRecord | null | undefined): unknown => item?.vnode ? itemRefs.get(item.key)?.$?.exposed ?? item.vnode.component?.exposed ?? item.source : item?.source ?? null
const containerOf = (item: PivotRecord | null | undefined): unknown => item ? itemRefs.get(item.key)?.$?.exposed ?? item.vnode?.component?.exposed ?? null : null
const matchesItem = (item: PivotRecord, candidate: unknown): boolean => {
  if (sourceOf(item) === candidate || item.source === candidate) return true
  const identity = candidate && typeof candidate === 'object' ? (candidate as Record<symbol, unknown>)[pivotItemIdentityKey] : undefined
  return identity !== undefined && identity === (containerOf(item) as Record<symbol, unknown> | null)?.[pivotItemIdentityKey]
}
const showPreviousButton = computed(() => enabled.value && !locked.value && headerPointerOver.value && headerOverflow.value && items.value.length > 1 && (!usingStaticHeaders.value || selectedIndex.value > 0))
const showNextButton = computed(() => enabled.value && !locked.value && headerPointerOver.value && headerOverflow.value && items.value.length > 1 && (!usingStaticHeaders.value || selectedIndex.value < items.value.length - 1))
const HeaderOutlet = defineComponent({
  props: ['item'],
  setup: outletProps => () => {
    const item = outletProps.item as PivotRecord
    return renderPivotPresenter(item.header, item.headerNodes, property('HeaderTemplate'), propertyNodes('headerTemplate'), instance)
  }
})
const ItemsOutlet = defineComponent({
  setup: () => () => h(Fragment, items.value.map(item => {
    const itemRef = (element: Element | ComponentPublicInstance | null) => { if (element && !(element instanceof Element)) itemRefs.set(item.key, element); else itemRefs.delete(item.key) }
    const itemVNode = item.vnode ? cloneVNode(item.vnode, { key: item.key, ref: itemRef })
      : h(PivotItem, { key: item.key, Header: item.source, IsEnabled: item.source && typeof item.source === 'object' && 'IsEnabled' in item.source ? value((item.source as { IsEnabled: unknown }).IsEnabled) : true, Content: item.source, ContentTemplate: property('ItemTemplate'), ref: itemRef }, propertyNodes('itemTemplate').length ? { default: () => h(PivotItemContentTemplate, null, { default: () => propertyNodes('itemTemplate') }) } : undefined)
    return h('div', { key: item.key, class: 'win-pivot-item-host', style: { display: item.key === displayedKey.value ? 'grid' : 'none' }, role: 'tabpanel', id: panelId(item), 'aria-labelledby': headerId(item), inert: item.key !== displayedKey.value, 'aria-hidden': item.key !== displayedKey.value }, normalizeXamlNodes([itemVNode], instance))
  }))
})
provide(pivotItemContextKey, { isVisible: key => key === displayedKey.value, isLoaded: key => loadedKeys.value.has(key), isEnabled: () => enabled.value, select: key => { const item = items.value.find(item => item.key === key); if (item) void selectIndex(item.index, true) }, setProperty: (key, name, next) => {
  if (!['Header', 'IsEnabled', 'AccessKey'].includes(name)) return
  const current = itemOverrides.get(key)
  if (next === undefined) { if (current && name in current) { const copy = { ...current }; delete copy[name]; itemOverrides.set(key, copy) } return }
  if (current?.[name] !== next) itemOverrides.set(key, { ...current, [name]: next })
} })
const headerClass = (item: PivotRecord) => ({ 'is-selected': item.key === selectedKey.value, 'is-disabled': !enabled.value || !item.enabled, 'is-locked-unselected': locked.value && item.key !== selectedKey.value,
  'is-pointer-over': hoveredKey.value === item.key, 'is-pressed': pressedKey.value === item.key,
  'has-focus-visual': focusedKey.value === item.key && property('HeaderFocusVisualPlacement') === 'ItemHeaders',
  'has-selected-focus-visual': focusedKey.value === item.key && item.key === selectedKey.value && property('HeaderFocusVisualPlacement') !== 'ItemHeaders' })
const setHeaderRef = (key: unknown, element: Element | ComponentPublicInstance | null) => { if (element instanceof HTMLElement) headerRefs.set(key, element); else headerRefs.delete(key) }
const raise = (name: 'SelectionChanged' | 'PivotItemLoading' | 'PivotItemLoaded' | 'PivotItemUnloading' | 'PivotItemUnloaded', args: unknown) => {
  emit(name, publicApi, args)
  resolveXamlHandler(attrs[name], instance)?.(publicApi, args)
}
const pivotItemArgs = (item: PivotRecord) => Object.freeze({ Item: containerOf(item) })
const currentHost = () => Array.from(itemPresenterRef.value?.children ?? []).find(element => (element as HTMLElement).style.display !== 'none') as HTMLElement | undefined
let animations: Animation[] = []
let headerPanelAnimation: Animation | undefined
let animationToken = 0
let disposed = false
let mounted = false
let pendingRequest: { index: number; user: boolean; focus: boolean; direction?: number } | null = null
let observer: ResizeObserver | undefined
let mutationObserver: MutationObserver | undefined
let layoutFrame = 0
let pointerId: number | null = null
let pointerStartX = 0
let pointerStartY = 0
let pointerStartTime = 0
let gestureActive = false
const cancelContentAnimations = () => { for (const animation of animations) animation.cancel(); animations = [] }
const cancelHeaderAnimation = () => { headerPanelAnimation?.cancel(); headerPanelAnimation = undefined }
const cancelAnimations = () => { cancelContentAnimations(); cancelHeaderAnimation() }
const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const runAnimation = async (phase: 'FlyOut' | 'FlyIn', direction: number): Promise<void> => {
  const host = currentHost()
  if (!host?.animate || reducedMotion()) return
  const entering = phase === 'FlyIn'
  const offset = (entering ? 20 : -7) * direction
  const batch = [
    host.animate([{ transform: `translate3d(${entering ? offset : 0}px,0,0)` }, { transform: `translate3d(${entering ? 0 : offset}px,0,0)` }], { duration: entering ? 767 : 83, easing: entering ? 'cubic-bezier(0.1,0.9,0.2,1)' : 'linear', fill: 'both' }),
    host.animate([{ opacity: entering ? 0 : 1 }, { opacity: entering ? 1 : 0 }], { duration: entering ? 333 : 67, easing: entering ? 'cubic-bezier(0.1,0.9,0.2,1)' : 'linear', fill: 'both' })
  ]
  animations.push(...batch)
  try { await Promise.all(batch.map(animation => animation.finished)) } catch { /* A superseding selection cancels the old storyboard. */ }
  finally { if (entering) for (const animation of batch) animation.cancel(); animations = animations.filter(animation => !batch.includes(animation) || !entering) }
}
const applySlideInGroups = () => {
  if (reducedMotion()) return
  const host = currentHost()
  if (!host) return
  const targets = [host, ...Array.from(host.querySelectorAll<HTMLElement>('*'))]
  const direction = activeDirection
  for (const target of targets) {
    const group = attachedValue(target, 'Pivot.SlideInAnimationGroup')
    const number = ({ GroupOne: 1, GroupTwo: 2, GroupThree: 3 } as Record<string, number>)[group ?? '']
    if (!number || !target.animate) continue
    const offset = 40 * number * direction
    // PivotSlideInThemeAnimation: the first 350ms are linear. The last 350ms
    // use ExponentialEase(-ln(10)); sampled keyframes retain the native curve.
    const frames: Keyframe[] = [{ transform: `translate3d(${offset}px,0,0)`, offset: 0 }, { transform: `translate3d(${offset * 0.28335052129660765}px,0,0)`, offset: .5 }]
    for (let step = 1; step <= 40; step++) {
      const progress = step / 40
      const eased = (Math.exp(-2.302585093 * progress) - 1) / (Math.exp(-2.302585093) - 1)
      frames.push({ transform: `translate3d(${offset * .28335052129660765 * (1 - eased)}px,0,0)`, offset: .5 + progress * .5 })
    }
    const animation = target.animate(frames, { duration: 700, easing: 'linear', fill: 'both' })
    animations.push(animation)
    void animation.finished.catch(() => {}).finally(() => { animation.cancel(); animations = animations.filter(current => current !== animation) })
  }
}
let activeDirection = 1
const focusHeader = () => headerRefs.get(selectedKey.value)?.focus({ preventScroll: true })
const updateFocusFollower = () => {
  const header = headerRefs.get(selectedKey.value)
  if (header) focusFollowerBounds.value = { left: header.offsetLeft, width: header.offsetWidth, height: header.offsetHeight }
}
const onFocusChanged = (event: FocusEvent) => {
  const target = event.type === 'focusout' ? event.relatedTarget : event.target
  headerHasFocus.value = target instanceof Node && Boolean(headerClipperRef.value?.contains(target))
  if (event.type === 'focusin' && target instanceof Element) keyboardFocus.value = target.matches(':focus-visible')
  updateFocusFollower()
}
const ensureHeaderVisible = () => {
  const viewport = headerClipperRef.value
  const header = headerRefs.get(selectedKey.value)
  if (!viewport || !header) return
  const clip = viewport.getBoundingClientRect()
  const bounds = header.getBoundingClientRect()
  if (bounds.left < clip.left) viewport.scrollLeft += bounds.left - clip.left
  else if (bounds.right > clip.right) viewport.scrollLeft += bounds.right - clip.right
  updateFocusFollower()
}
const commitSelection = (index: number, oldItem: PivotRecord | null, removedSource = sourceOf(oldItem)) => {
  selectedIndex.value = index
  const newItem = items.value[index] ?? null
  emit('update:SelectedIndex', index)
  emit('update:SelectedItem', sourceOf(newItem))
  updateXamlBinding(props.SelectedIndex, index, instance)
  updateXamlBinding(props.SelectedItem, sourceOf(newItem), instance)
  if (oldItem?.key !== newItem?.key) raise('SelectionChanged', Object.freeze({ RemovedItems: oldItem ? [removedSource] : [], AddedItems: newItem ? [sourceOf(newItem)] : [] }))
}
const selectIndex = async (index: number, user = false, focus = false, direction?: number, previousItem?: PivotRecord | null) => {
  if (disposed || (user && (!enabled.value || locked.value))) return
  const item = items.value[index]
  if (!item || (user && !item.enabled)) return
  if (index === selectedIndex.value) { if (focus) focusHeader(); return }
  if (animationState.value !== 'Idle') {
    pendingRequest = { index, user, focus, direction }
    // FlyOut runs its full 83ms even when several header taps arrive together.
    // A newer selection may cancel FlyIn once the incoming item is visible.
    if (animationState.value === 'FlyIn') cancelAnimations()
    return
  }
  const token = ++animationToken
  const oldItem = previousItem ?? selectedRecord.value
  const removedSource = sourceOf(oldItem)
  const unloadingArgs = oldItem ? pivotItemArgs(oldItem) : null
  const animateSelection = mounted && Boolean(oldItem)
  const previousHeaderLeft = headerRefs.get(item.key)?.getBoundingClientRect().left ?? null
  const selectedHeaderLeft = headerRefs.get(selectedKey.value)?.getBoundingClientRect().left ?? null
  const headerAnimationStart = performance.now()
  cancelHeaderAnimation()
  if (animateSelection && !usingStaticHeaders.value && previousHeaderLeft !== null && selectedHeaderLeft !== null && headerPanelRef.value?.animate && !reducedMotion()) {
    const offset = previousHeaderLeft - selectedHeaderLeft
    headerPanelAnimation = headerPanelRef.value.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${-offset}px)` }], { duration: 850, easing: 'cubic-bezier(0.1,0.9,0.2,1)', fill: 'both' })
  }
  const contentHadFocus = Boolean(currentHost()?.contains(document.activeElement))
  activeDirection = (direction ?? (index < selectedIndex.value ? -1 : 1)) * (flowDirection.value === 'rtl' ? -1 : 1)
  animationState.value = 'FlyOut'
  if (animateSelection) await runAnimation('FlyOut', activeDirection)
  if (disposed || token !== animationToken) return
  loadedKeys.value = new Set([...loadedKeys.value, item.key])
  selectedIndex.value = index
  displayedKey.value = item.key
  focusedKey.value = item.key
  await nextTick()
  cancelContentAnimations()
  cancelHeaderAnimation()
  if (disposed || token !== animationToken) return
  if (animateSelection && !usingStaticHeaders.value && previousHeaderLeft !== null && headerRefs.get(item.key) && headerPanelRef.value?.animate && !reducedMotion()) {
    const nextHeaderLeft = headerRefs.get(item.key)!.getBoundingClientRect().left
    const headerDelta = previousHeaderLeft - nextHeaderLeft
    if (Math.abs(headerDelta) > 0.5) {
      const headerAnimation = headerPanelRef.value.animate([{ transform: `translateX(${headerDelta}px)` }, { transform: 'translateX(0)' }], { duration: 850, easing: 'cubic-bezier(0.1,0.9,0.2,1)', fill: 'both' })
      headerPanelAnimation = headerAnimation
      headerAnimation.currentTime = Math.min(850, performance.now() - headerAnimationStart)
      void headerAnimation.finished.catch(() => {}).finally(() => { headerAnimation.cancel(); if (headerPanelAnimation === headerAnimation) headerPanelAnimation = undefined })
    }
  }
  commitSelection(index, oldItem, removedSource)
  if (oldItem) { raise('PivotItemUnloading', unloadingArgs); raise('PivotItemUnloaded', unloadingArgs) }
  const args = pivotItemArgs(item)
  raise('PivotItemLoading', args)
  raise('PivotItemLoaded', args)
  ensureHeaderVisible()
  if (focus) focusHeader()
  else if (contentHadFocus) { const target = currentHost()?.querySelector<HTMLElement>('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href],[tabindex="0"]'); if (target) target.focus({ preventScroll: true }); else focusHeader() }
  animationState.value = 'FlyIn'
  applySlideInGroups()
  if (animateSelection) await runAnimation('FlyIn', activeDirection)
  if (disposed || token !== animationToken) return
  cancelContentAnimations()
  animationState.value = 'Idle'
  const request = pendingRequest
  pendingRequest = null
  if (request) void selectIndex(request.index, request.user, request.focus, request.direction)
}
const moveSelection = (delta: number, focus = false) => {
  if (!enabled.value || locked.value || !items.value.length) return false
  const count = items.value.length
  for (let offset = 1; offset < count; offset++) {
    let index = selectedIndex.value + delta * offset
    if (usingStaticHeaders.value && (index < 0 || index >= count)) return false
    index = (index + count * offset) % count
    if (items.value[index]?.enabled) { void selectIndex(index, true, focus, delta); return true }
  }
  return false
}
const onHeaderKeyDown = (event: KeyboardEvent) => {
  keyboardFocus.value = true
  if (event.defaultPrevented || !enabled.value || locked.value || event.ctrlKey || event.altKey || event.metaKey) return
  let handled = false
  const sign = flowDirection.value === 'rtl' ? -1 : 1
  if (event.key === 'ArrowLeft') handled = moveSelection(-sign, true)
  else if (event.key === 'ArrowRight') handled = moveSelection(sign, true)
  else if (event.key === 'Home' || event.key === 'End') { const records = event.key === 'Home' ? items.value : [...items.value].reverse(); const item = records.find(item => item.enabled); if (item && item.index !== selectedIndex.value) { void selectIndex(item.index, true, true); handled = true } }
  else if (event.key === 'ArrowDown') { const target = currentHost()?.querySelector<HTMLElement>('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href],[tabindex="0"]'); if (target) { target.focus(); handled = true } }
  if (handled) { event.preventDefault(); event.stopPropagation() }
}
const onKeyDown = (event: KeyboardEvent) => {
  keyboardFocus.value = true
  if (event.defaultPrevented || !event.ctrlKey || !enabled.value || locked.value) return
  const delta = event.key === 'PageUp' || (event.key === 'Tab' && event.shiftKey) ? -1 : event.key === 'PageDown' || event.key === 'Tab' ? 1 : 0
  if (delta) { moveSelection(delta, Boolean(headerClipperRef.value?.contains(document.activeElement))); event.preventDefault() }
}
const onRootClick = (event: MouseEvent) => {
  const target = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('.win-pivot-header-item,.win-pivot-nav-button') : null
  if (!target || target.disabled || target.closest('.win-pivot') !== rootRef.value) return
  if (target.hasAttribute('data-pivot-index')) void selectIndex(Number(target.dataset.pivotIndex), true, true)
  else moveSelection(target.classList.contains('win-pivot-previous-button') ? -1 : 1, true)
}
const onHeaderPointerEnter = (event: PointerEvent) => { if (event.pointerType !== 'touch') headerPointerOver.value = true }
const onHeaderPointerLeave = (event: PointerEvent) => { if (event.relatedTarget instanceof Node && rootRef.value?.querySelector('.win-pivot-layout-element')?.contains(event.relatedTarget) && (event.relatedTarget as Element).closest?.('.win-pivot-nav-button,.win-pivot-header-clipper')) return; headerPointerOver.value = false; hoveredKey.value = null }
const onHeaderPressed = (event: PointerEvent, key: unknown) => { if (event.button === 0 && enabled.value) pressedKey.value = key }
const clearPressedHeader = () => { pressedKey.value = null }
const cancelGesture = (event?: Event) => {
  if (event instanceof PointerEvent && pointerId !== event.pointerId) { clearPressedHeader(); return }
  const id = pointerId
  pointerId = null
  pointerOffset.value = 0
  gestureActive = false
  cancelHeaderAnimation()
  clearPressedHeader()
  if (id !== null && rootRef.value?.hasPointerCapture(id)) rootRef.value.releasePointerCapture(id)
}
const onLostPointerCapture = (event: PointerEvent) => {
  // Touch starts with an implicit capture on the hit child. Transferring it
  // to RootElement raises a bubbling loss on that child before the root gets
  // capture; that event must not cancel the gesture we just accepted.
  if (event.target === rootRef.value) cancelGesture(event)
}
const onPointerDown = (event: PointerEvent) => {
  keyboardFocus.value = false
  if (pointerId !== null || !event.isPrimary || event.button !== 0 || event.pointerType === 'mouse' || !enabled.value || locked.value || animationState.value !== 'Idle') return
  const target = event.target as Element
  if (target.closest('input,textarea,select,button,a,[contenteditable="true"],.win-pivot-header-clipper')) return
  pointerId = event.pointerId
  pointerStartX = event.clientX
  pointerStartY = event.clientY
  pointerStartTime = performance.now()
}
const onPointerMove = (event: PointerEvent) => {
  if (event.pointerId !== pointerId) return
  const dx = event.clientX - pointerStartX
  const dy = event.clientY - pointerStartY
  if (!gestureActive) {
    if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) { cancelGesture(event); return }
    if (Math.abs(dx) < 8) return
    gestureActive = true
    rootRef.value?.setPointerCapture(event.pointerId)
  }
  event.preventDefault()
  const delta = -Math.sign(dx) * (flowDirection.value === 'rtl' ? -1 : 1)
  const blocked = usingStaticHeaders.value && (selectedIndex.value + delta < 0 || selectedIndex.value + delta >= items.value.length)
  pointerOffset.value = blocked ? dx * .15 : dx
}
const onPointerUp = (event: PointerEvent) => {
  if (event.pointerId !== pointerId) { clearPressedHeader(); return }
  const dx = event.clientX - pointerStartX
  const width = itemPresenterRef.value?.clientWidth ?? 400
  const elapsed = Math.max(1, performance.now() - pointerStartTime)
  const shouldMove = gestureActive && (Math.abs(dx) >= Math.max(40, Math.min(100, width * .2)) || Math.abs(dx) > 12 && Math.abs(dx) / elapsed > .5)
  cancelGesture(event)
  if (shouldMove) moveSelection(-Math.sign(dx) * (flowDirection.value === 'rtl' ? -1 : 1))
}
const updateNavigationButtons = () => {
  const viewport = headerClipperRef.value
  const panel = headerPanelRef.value
  if (!viewport || !panel) return
  headerOverflow.value = panel.scrollWidth > viewport.clientWidth + 1
}
const updateLayout = () => {
  if (layoutFrame || disposed) return
  layoutFrame = requestAnimationFrame(() => { layoutFrame = 0; updateNavigationButtons(); ensureHeaderVisible() })
}
const publicApi = {
  get SelectedIndex() { return selectedIndex.value }, set SelectedIndex(next: number) { void selectIndex(Number(next)) },
  get SelectedItem() { return sourceOf(selectedRecord.value) }, set SelectedItem(next: unknown) { const item = items.value.find(item => matchesItem(item, next)); if (item) void selectIndex(item.index) },
  get Items() { return items.value.map(item => sourceOf(item)) },
  get IsLocked() { return locked.value }, get IsHeaderItemsCarouselEnabled() { return carousel.value },
  get ActualWidth() { return rootRef.value?.clientWidth ?? 0 }, get ActualHeight() { return rootRef.value?.clientHeight ?? 0 },
  ContainerFromIndex(index: number) { return containerOf(items.value[index]) },
  IndexFromContainer(container: unknown) { return items.value.findIndex(item => matchesItem(item, container)) },
  Focus() { focusHeader(); return Boolean(headerRefs.get(selectedKey.value)) }
}
defineExpose(publicApi)
for (const name of Object.keys(props) as (keyof typeof props)[]) {
  if (name === 'SelectedIndex' || name === 'SelectedItem') continue
  Object.defineProperty(publicApi, name, { enumerable: true, configurable: true, get: () => property(name),
    set: next => { overrides[name] = next; updateXamlBinding(props[name], next, instance) }
  })
  watch(() => value(props[name]), () => { delete overrides[name] })
}
watch(() => value(props.SelectedIndex), next => { if (next !== undefined && Number.isInteger(Number(next))) void selectIndex(Number(next)) })
watch(() => value(props.SelectedItem), next => { if (next === undefined) return; const index = items.value.findIndex(item => matchesItem(item, next)); if (index >= 0) void selectIndex(index) })
watch([enabled, locked], () => { cancelGesture(); clearPressedHeader(); if (!enabled.value) { headerPointerOver.value = false; hoveredKey.value = null } })
watch(items, async (nextItems, oldItems = []) => {
  const keys = nextItems.map(item => item.key)
  const oldKeys = oldItems.map(item => item.key)
  const previousItem = oldItems[selectedIndex.value] ?? null
  const previousKey = previousItem?.key
  if (keys.length === oldKeys.length && keys.every((key, index) => key === oldKeys[index])) return
  ++animationToken
  cancelAnimations()
  cancelGesture()
  animationState.value = 'Idle'
  pendingRequest = null
  const oldIndex = selectedIndex.value
  const existingIndex = previousKey === undefined ? -1 : keys.indexOf(previousKey)
  selectedIndex.value = existingIndex >= 0 ? existingIndex : -1
  loadedKeys.value = new Set([...loadedKeys.value].filter(key => keys.some(current => current === key)))
  if (!keys.length) { const args = previousItem ? pivotItemArgs(previousItem) : null; displayedKey.value = null; focusedKey.value = null; commitSelection(-1, previousItem); if (previousItem) { raise('PivotItemUnloading', args); raise('PivotItemUnloaded', args) } }
  else if (existingIndex < 0) {
    const requested = Number(value(props.SelectedIndex))
    const selectedItem = value(props.SelectedItem)
    const requestedItemIndex = selectedItem === undefined ? -1 : nextItems.findIndex(item => matchesItem(item, selectedItem))
    const index = requestedItemIndex >= 0 ? requestedItemIndex : Math.min(keys.length - 1, Math.max(0, Number.isInteger(requested) ? requested : oldIndex))
    await selectIndex(index, false, false, undefined, previousItem)
  }
  else { displayedKey.value = previousKey; if (existingIndex !== oldIndex) { emit('update:SelectedIndex', existingIndex); updateXamlBinding(props.SelectedIndex, existingIndex, instance) } }
  updateLayout()
}, { immediate: true })
watch([carousel, () => property('HeaderTemplate'), () => property('Title')], () => { cancelHeaderAnimation(); updateLayout() })
onMounted(async () => {
  mounted = true
  rootRef.value?.addEventListener('click', onRootClick)
  if (rootRef.value) inheritedFlowDirection.value = getComputedStyle(rootRef.value).direction
  if (typeof ResizeObserver !== 'undefined') { observer = new ResizeObserver(() => { cancelHeaderAnimation(); updateLayout() }); for (const target of [rootRef.value, headerClipperRef.value, headerPanelRef.value]) if (target) observer.observe(target) }
  if (typeof MutationObserver !== 'undefined' && headerPanelRef.value) { mutationObserver = new MutationObserver(updateLayout); mutationObserver.observe(headerPanelRef.value, { childList: true, subtree: true, characterData: true }) }
  window.addEventListener('blur', cancelGesture)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', cancelGesture)
  document.fonts?.ready.then(() => { if (!disposed) updateLayout() })
  await nextTick()
  updateLayout()
})
onUpdated(updateLayout)
onBeforeUnmount(() => {
  disposed = true
  rootRef.value?.removeEventListener('click', onRootClick)
  ++animationToken
  cancelAnimations()
  cancelGesture()
  observer?.disconnect()
  mutationObserver?.disconnect()
  if (layoutFrame) cancelAnimationFrame(layoutFrame)
  window.removeEventListener('blur', cancelGesture)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', cancelGesture)
})
</script>

<style scoped>
.win-pivot { display: grid; min-width: 0; min-height: 0; box-sizing: border-box; overflow: clip; color: var(--text-primary); background: var(--PivotBackground, transparent); font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', sans-serif); touch-action: pan-y; }
.win-pivot-root-element { display: grid; grid-template-rows: auto minmax(0, 1fr); min-width: 0; min-height: 0; }
.win-pivot-title-content-control { min-width: 0; margin: 14px 0 13px 12px; font-family: var(--PivotTitleFontFamily, inherit); font-size: var(--PivotTitleFontSize, 14px); font-weight: var(--PivotTitleThemeFontWeight, 700); line-height: 20px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.win-pivot-template-grid { grid-row: 2; display: grid; min-width: 0; min-height: 0; }
.win-pivot-scroll-viewer, .win-pivot-panel { display: grid; min-width: 0; min-height: 0; overflow: clip; }
.win-pivot-layout-element { position: relative; display: grid; grid-template-columns: auto minmax(0, 1fr) auto; grid-template-rows: 48px minmax(0, 1fr); min-width: 0; min-height: 0; }
.win-pivot-left-header-presenter { grid-row: 1; grid-column: 1; min-width: 0; overflow: clip; }
.win-pivot-right-header-presenter { grid-row: 1; grid-column: 3; min-width: 0; overflow: clip; }
.win-pivot-header-clipper { grid-row: 1; grid-column: 2; min-width: 0; height: 48px; overflow: hidden; scrollbar-width: none; background: var(--PivotHeaderBackground, transparent); }
.win-pivot-header-clipper::-webkit-scrollbar { display: none; }
.win-pivot-header-grid { position: relative; display: grid; min-width: 100%; width: max-content; height: 48px; }
.win-pivot-header-panel { grid-area: 1 / 1; display: flex; width: max-content; min-width: 100%; height: 48px; }
.win-pivot-header-item { appearance: none; position: relative; display: grid; min-width: 0; height: 48px; flex: 0 0 auto; padding: 0; margin: 0; border: 0; border-radius: 0; outline: none; box-sizing: border-box; font: inherit; text-align: start; cursor: default; background: var(--PivotHeaderItemBackgroundUnselected, transparent); color: var(--PivotHeaderItemForegroundUnselected, var(--text-secondary)); }
.win-pivot-header-grid-content { display: grid; padding: 0 12px; height: 48px; min-width: 0; box-sizing: border-box; }
.win-pivot-header-content-presenter { grid-area: 1 / 1; align-self: center; white-space: nowrap; font-family: var(--PivotHeaderItemFontFamily, inherit); font-size: var(--PivotHeaderItemFontSize, 24px); font-weight: var(--PivotHeaderItemThemeFontWeight, 350); line-height: 32px; letter-spacing: -.025em; transition: opacity 330ms linear, transform 330ms linear; }
.win-pivot-selected-pipe { grid-area: 1 / 1; align-self: end; height: 3px; margin-bottom: 2px; border-radius: var(--PivotHeaderItemSelectedPipeCornerRadius, 1.5px); background: var(--PivotHeaderItemSelectedPipeFill, var(--AccentFillColorDefaultBrush)); visibility: hidden; }
.win-pivot-header-item.is-selected { color: var(--PivotHeaderItemForegroundSelected, var(--text-primary)); background: var(--PivotHeaderItemBackgroundSelected, transparent); }
.win-pivot-header-item.is-selected .win-pivot-selected-pipe { visibility: visible; }
.win-pivot-header-item.is-pointer-over { color: var(--PivotHeaderItemForegroundUnselectedPointerOver, var(--text-primary)); background: var(--PivotHeaderItemBackgroundUnselectedPointerOver, transparent); }
.win-pivot-header-item.is-selected.is-pointer-over { color: var(--PivotHeaderItemForegroundSelectedPointerOver, var(--text-primary)); background: var(--PivotHeaderItemBackgroundSelectedPointerOver, transparent); }
.win-pivot-header-item.is-pressed { color: var(--PivotHeaderItemForegroundUnselectedPressed, var(--text-primary)); background: var(--PivotHeaderItemBackgroundUnselectedPressed, transparent); }
.win-pivot-header-item.is-selected.is-pressed { color: var(--PivotHeaderItemForegroundSelectedPressed, var(--text-primary)); background: var(--PivotHeaderItemBackgroundSelectedPressed, transparent); }
.win-pivot-header-item.is-disabled { color: var(--PivotHeaderItemForegroundDisabled, var(--text-disabled)); background: var(--PivotHeaderItemBackgroundDisabled, transparent); }
.win-pivot-header-item.is-disabled .win-pivot-selected-pipe { visibility: hidden; }
.win-pivot-header-item.is-locked-unselected .win-pivot-header-content-presenter { opacity: 0; transform: translateX(40px); }
.win-pivot-focus-follower { position: absolute; top: 0; left: 0; pointer-events: none; visibility: hidden; box-sizing: border-box; outline: 2px solid var(--focus-stroke-outer, var(--text-primary)); outline-offset: -2px; }
.win-pivot-focus-follower.is-visible { visibility: visible; }
.win-pivot-header-item:focus-visible .win-pivot-header-grid-content { outline: none; }
.win-pivot-header-item.has-focus-visual:focus-visible .win-pivot-header-grid-content { outline: 2px solid var(--focus-stroke-outer, var(--text-primary)); outline-offset: -2px; }
.win-pivot-nav-button { appearance: none; grid-row: 1; grid-column: 2; position: relative; z-index: 1; align-self: start; margin-top: 6px; width: 20px; height: 36px; box-sizing: border-box; padding: 0; border-style: solid; border-width: var(--PivotNavButtonBorderThemeThickness, 0px); border-radius: 0; opacity: 0; pointer-events: none; display: grid; place-items: center; }
.win-pivot-nav-button.is-visible { opacity: 1; pointer-events: auto; }
.win-pivot-previous-button { justify-self: start; background: var(--PivotPreviousButtonBackground); color: var(--PivotPreviousButtonForeground); border-color: var(--PivotPreviousButtonBorderBrush); }
.win-pivot-next-button { justify-self: end; background: var(--PivotNextButtonBackground); color: var(--PivotNextButtonForeground); border-color: var(--PivotNextButtonBorderBrush); }
.win-pivot-previous-button:hover { background: var(--PivotPreviousButtonBackgroundPointerOver); color: var(--PivotPreviousButtonForegroundPointerOver); border-color: var(--PivotPreviousButtonBorderBrushPointerOver); }
.win-pivot-next-button:hover { background: var(--PivotNextButtonBackgroundPointerOver); color: var(--PivotNextButtonForegroundPointerOver); border-color: var(--PivotNextButtonBorderBrushPointerOver); }
.win-pivot-previous-button:active { background: var(--PivotPreviousButtonBackgroundPressed); color: var(--PivotPreviousButtonForegroundPressed); border-color: var(--PivotPreviousButtonBorderBrushPressed); }
.win-pivot-next-button:active { background: var(--PivotNextButtonBackgroundPressed); color: var(--PivotNextButtonForegroundPressed); border-color: var(--PivotNextButtonBorderBrushPressed); }
.win-pivot-nav-glyph { font-family: var(--SymbolThemeFontFamily, 'Segoe Fluent Icons'); font-size: 12px; }
.win-pivot[dir='rtl'] .win-pivot-nav-glyph { transform: scaleX(-1); }
.win-pivot-item-presenter { grid-row: 2; grid-column: 1 / -1; display: grid; min-width: 0; min-height: 0; overflow: clip; }
.win-pivot-item-host { grid-area: 1 / 1; min-width: 0; min-height: 0; box-sizing: border-box; overflow: clip; }
@media (prefers-reduced-motion: reduce) { .win-pivot-header-content-presenter { transition-duration: 0ms; } }
</style>
