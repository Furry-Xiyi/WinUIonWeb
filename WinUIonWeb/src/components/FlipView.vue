<!-- components/FlipView.vue -->
<template>
  <div
    ref="rootRef"
    class="win-flip-view"
    :class="[
      orientationClass,
      { disabled: !isEnabled, rtl: isRtl, focused: hasFocus }
    ]"
    :style="rootStyle"
    role="listbox"
    :tabindex="rootTabIndex"
    :aria-disabled="!isEnabled"
    :aria-orientation="orientationClass"
    :aria-activedescendant="activeDescendantId"
    :aria-label="automationName"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    @keydown="onKeyDown"
    @wheel="onWheel"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerCancel"
    @lostpointercapture="onLostPointerCapture"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchCancel">
    <div class="flip-view-track" :style="trackStyle" aria-live="polite">
      <div
        v-for="(item, index) in items"
        :id="itemId(index)"
        :key="getItemKey(item, index)"
        class="flip-view-item"
        :class="{ selected: index === selectedIndex }"
        :style="itemStyle"
        role="option"
        :aria-selected="index === selectedIndex"
        :aria-posinset="index + 1"
        :aria-setsize="items.length"
        :tabindex="index === selectedIndex ? 0 : -1"
        @focusin="onItemFocus(index)">
        <component :is="ItemRenderer" :item="item" :index="index" />
      </div>
    </div>

    <button
      type="button"
      class="flip-btn prev"
      :class="{ visible: previousButtonVisible }"
      :disabled="!isEnabled || selectedIndex <= 0"
      :aria-hidden="!previousButtonVisible"
      :aria-label="previousLabel"
      tabindex="-1"
      @pointerenter="onButtonEnter"
      @pointerleave="onButtonLeave"
      @click="prev">
      <span class="icon flip-arrow" aria-hidden="true">{{ previousGlyph }}</span>
    </button>
    <button
      type="button"
      class="flip-btn next"
      :class="{ visible: nextButtonVisible }"
      :disabled="!isEnabled || selectedIndex >= items.length - 1"
      :aria-hidden="!nextButtonVisible"
      :aria-label="nextLabel"
      tabindex="-1"
      @pointerenter="onButtonEnter"
      @pointerleave="onButtonLeave"
      @click="next">
      <span class="icon flip-arrow" aria-hidden="true">{{ nextGlyph }}</span>
    </button>
  </div>
</template>

<script lang="ts">
import { CollectionItemTemplate, CollectionItemsPanel } from './CollectionProperties'

export default {
  inheritAttrs: false,
  ItemTemplate: CollectionItemTemplate,
  ItemsPanel: CollectionItemsPanel
}
</script>

<script setup lang="ts">
// @ts-nocheck The public XAML property casing is intentionally preserved.
import {
  computed,
  defineComponent,
  Fragment,
  getCurrentInstance,
  h,
  inject,
  nextTick,
  onBeforeUnmount,
  provide,
  ref,
  useAttrs,
  useSlots,
  watch
} from 'vue'
import { useI18n } from './i18n/index'
import { xamlResourceDictionaryKey } from './Page.vue'
import { getCollectionProperty, getVNodeChildren } from './CollectionProperties'
import { materializeXamlVNode, resolveXamlHandler, resolveXamlValue, xamlItemContextKey } from './xamlRuntime'

const props = defineProps({
  ItemsSource: { type: [String, Array, Object], default: null },
  SelectedIndex: { type: [Number, String], default: undefined },
  SelectedItem: { type: [Object, String, Number, Boolean], default: undefined },
  Orientation: { type: String, default: undefined },
  FlowDirection: { type: String, default: undefined },
  HorizontalContentAlignment: { type: String, default: 'Stretch' },
  VerticalContentAlignment: { type: String, default: 'Stretch' },
  IsEnabled: { type: [Boolean, String], default: true },
  IsTabStop: { type: [Boolean, String], default: false },
  ItemTemplate: { type: [String, Object], default: undefined },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' },
  MinHeight: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' },
  MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' },
  Padding: { type: [String, Number], default: '' },
  Background: { type: [String, Object], default: '' },
  BorderBrush: { type: [String, Object], default: '' },
  BorderThickness: { type: [String, Number], default: '' },
  CornerRadius: { type: [String, Number], default: '' }
})

const emit = defineEmits(['SelectionChanged', 'update:SelectedIndex', 'update:SelectedItem'])
const attrs = useAttrs()
const slots = useSlots()
const instance = getCurrentInstance()
const resources = inject(xamlResourceDictionaryKey, null)
const { t } = useI18n()

const rootRef = ref(null)
const currentIndex = ref(0)
const hasFocus = ref(false)
const keyboardInput = ref(false)
const showButtons = ref(false)
const keepButtonsVisible = ref(false)
let buttonsFadeTimer = null

const slotNodes = computed(() => slots.default?.() ?? [])
const declaredNodes = computed(() => slotNodes.value.filter((node) => !getCollectionProperty(node)))
const itemTemplateNode = computed(() => slotNodes.value.find((node) => getCollectionProperty(node) === 'itemTemplate'))
const itemsPanelNode = computed(() => slotNodes.value.find((node) => getCollectionProperty(node) === 'itemsPanel'))

const sourceItems = computed(() => {
  const resolved = resolveXamlValue(props.ItemsSource, instance)
  if (Array.isArray(resolved)) return resolved
  if (resolved && typeof resolved !== 'string' && typeof resolved[Symbol.iterator] === 'function') {
    return Array.from(resolved)
  }
  return null
})
const items = computed(() => sourceItems.value ?? declaredNodes.value)

const templateResourceKey = (value) => {
  if (typeof value !== 'string') return ''
  const marker = value.trim().match(/^\{\s*StaticResource\s+([^\s}]+)\s*\}$/i)
  if (marker) return marker[1]
  const cssMarker = value.trim().match(/^var\(--([^,)]+)\)$/)
  return cssMarker?.[1] ?? ''
}

const templateNodes = computed(() => {
  const propValue = props.ItemTemplate
  const resolvedProp = resolveXamlValue(propValue, instance)
  const resourceKey = templateResourceKey(propValue) || templateResourceKey(resolvedProp)
  if (resourceKey && resources?.[resourceKey]) {
    return getVNodeChildren(resources[resourceKey])
  }
  if (resolvedProp && typeof resolvedProp === 'object' && resolvedProp.type) {
    return getVNodeChildren(resolvedProp)
  }
  if (itemTemplateNode.value) {
    return getVNodeChildren(itemTemplateNode.value)
  }
  return []
})

const orientation = computed(() => {
  const panel = itemsPanelNode.value ? getVNodeChildren(itemsPanelNode.value)[0] : null
  return String(resolveXamlValue(panel?.props?.Orientation, instance) || resolveXamlValue(props.Orientation, instance) || 'Horizontal')
})
const orientationClass = computed(() => orientation.value.toLowerCase() === 'vertical' ? 'vertical' : 'horizontal')
const flowDirection = computed(() => String(resolveXamlValue(props.FlowDirection, instance) || 'LeftToRight'))
const isRtl = computed(() => flowDirection.value.toLowerCase() === 'righttoleft')
const isEnabled = computed(() => resolveXamlValue(props.IsEnabled, instance) !== false)
const isTabStop = computed(() => resolveXamlValue(props.IsTabStop, instance) === true)

const resolvedSelectedIndex = computed(() => {
  const value = resolveXamlValue(props.SelectedIndex, instance)
  if (value === undefined || value === null || value === '') return undefined
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : undefined
})
const resolvedSelectedItem = computed(() => resolveXamlValue(props.SelectedItem, instance))
const clampIndex = (value) => {
  const count = items.value.length
  if (!count) return 0
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return 0
  return Math.max(0, Math.min(count - 1, Math.trunc(numeric)))
}
const itemMatches = (left, right) => {
  if (Object.is(left, right)) return true
  if (!left || !right || typeof left !== 'object' || typeof right !== 'object') return false
  const leftKey = left.id ?? left.Id ?? left.key ?? left.Key
  const rightKey = right.id ?? right.Id ?? right.key ?? right.Key
  return leftKey !== undefined && rightKey !== undefined && leftKey === rightKey
}

const selectedIndex = computed(() => clampIndex(currentIndex.value))
const selectedItem = computed(() => items.value[selectedIndex.value])

watch([resolvedSelectedIndex, resolvedSelectedItem, items], ([externalIndex, externalItem, list]) => {
  let nextIndex = currentIndex.value
  if (externalIndex !== undefined) nextIndex = externalIndex
  else if (externalItem !== undefined) {
    const match = list.findIndex((item) => itemMatches(item, externalItem))
    if (match >= 0) nextIndex = match
  }
  const bounded = list.length ? Math.max(0, Math.min(list.length - 1, Math.trunc(Number(nextIndex) || 0))) : 0
  if (bounded !== currentIndex.value) {
    currentIndex.value = bounded
    if (hasFocus.value && keyboardInput.value) focusSelectedItem()
  }
}, { immediate: true })

// An ObservableVector can mutate in place, so its array identity does not
// change. Keep the selected container inside the new collection bounds.
watch(() => items.value.length, () => {
  const bounded = clampIndex(currentIndex.value)
  if (bounded !== currentIndex.value) {
    currentIndex.value = bounded
    if (hasFocus.value && keyboardInput.value) focusSelectedItem()
  }
})

const cssLength = (value) => {
  const resolved = resolveXamlValue(value, instance)
  if (resolved === '' || resolved === null || resolved === undefined || resolved === 'Auto') return undefined
  if (typeof resolved === 'number' || /^-?\d+(?:\.\d+)?$/.test(String(resolved).trim())) return `${resolved}px`
  return String(resolved)
}
const xamlThickness = (value) => {
  const resolved = resolveXamlValue(value, instance)
  if (resolved === '' || resolved === null || resolved === undefined || resolved === 'Auto') return undefined
  const parts = String(resolved).split(',').map((part) => cssLength(part.trim()))
  if (parts.length === 1) return parts[0]
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`
  return String(resolved)
}
const rootStyle = computed(() => {
  const background = resolveXamlValue(props.Background, instance)
  const borderBrush = resolveXamlValue(props.BorderBrush, instance)
  const borderThickness = xamlThickness(props.BorderThickness)
  return {
    width: cssLength(props.Width),
    height: cssLength(props.Height),
    minWidth: cssLength(props.MinWidth),
    minHeight: cssLength(props.MinHeight),
    maxWidth: cssLength(props.MaxWidth),
    maxHeight: cssLength(props.MaxHeight),
    margin: xamlThickness(props.Margin),
    padding: xamlThickness(props.Padding),
    background: background || undefined,
    borderColor: borderBrush || undefined,
    borderWidth: borderThickness,
    borderStyle: borderBrush || borderThickness ? 'solid' : undefined,
    borderRadius: xamlThickness(props.CornerRadius)
  }
})

const alignment = (value, fallback = 'stretch') => {
  const normalized = String(resolveXamlValue(value, instance) || fallback).toLowerCase()
  if (normalized === 'center') return 'center'
  if (normalized === 'left' || normalized === 'top') return normalized === 'left' ? 'flex-start' : 'flex-start'
  if (normalized === 'right' || normalized === 'bottom') return normalized === 'right' ? 'flex-end' : 'flex-end'
  return 'stretch'
}
const horizontalContentAlignment = computed(() => alignment(props.HorizontalContentAlignment))
const verticalContentAlignment = computed(() => alignment(props.VerticalContentAlignment))
const itemStyle = computed(() => ({
  // Flexbox has no useful main-axis `stretch`; size the content slot
  // explicitly so the default WinUI Stretch alignment fills each page.
  justifyContent: horizontalContentAlignment.value === 'stretch' ? 'flex-start' : horizontalContentAlignment.value,
  alignItems: verticalContentAlignment.value,
  '--flip-view-content-width': horizontalContentAlignment.value === 'stretch' ? '100%' : 'auto',
  '--flip-view-content-height': verticalContentAlignment.value === 'stretch' ? '100%' : 'auto'
}))

const getItemKey = (item, index) => {
  if (item && typeof item === 'object') return item.id ?? item.Id ?? item.key ?? item.Key ?? item.title ?? item.Title ?? index
  return `${typeof item}:${String(item)}:${index}`
}
const displayItem = (item) => {
  if (item === null || item === undefined) return ''
  if (typeof item === 'object') {
    return item.Title ?? item.title ?? item.Text ?? item.text ?? item.Name ?? item.name ?? ''
  }
  return String(item)
}
const itemId = (index) => `flip-view-item-${index}`
const activeDescendantId = computed(() => items.value.length ? itemId(selectedIndex.value) : undefined)
const rootTabIndex = computed(() => isTabStop.value || !items.value.length ? 0 : -1)

const ItemRenderer = defineComponent({
  name: 'FlipViewItemTemplate',
  props: {
    item: { type: null, default: undefined },
    index: { type: Number, default: 0 }
  },
  setup(itemProps) {
    provide(xamlItemContextKey, itemProps.item)
    return () => {
      if (templateNodes.value.length) {
        const rendered = materializeXamlVNode(templateNodes.value, itemProps.item, instance)
        return h(Fragment, Array.isArray(rendered) ? rendered : [rendered])
      }
      if (sourceItems.value === null && declaredNodes.value[itemProps.index]) {
        return h(Fragment, [declaredNodes.value[itemProps.index]])
      }
      const itemSlot = slots.item
      if (itemSlot) return h(Fragment, itemSlot({ item: itemProps.item, index: itemProps.index }))
      return h(Fragment, [h('span', displayItem(itemProps.item))])
    }
  }
})

const trackStyle = computed(() => {
  const offset = selectedIndex.value * 100
  if (orientationClass.value === 'vertical') return { transform: `translateY(-${offset}%)` }
  // The RTL template reverses the flex order. Translate from the reversed
  // index so the selected item remains in the viewport at every position.
  const horizontalOffset = isRtl.value
    ? (items.value.length - 1 - selectedIndex.value) * 100
    : offset
  return { transform: `translateX(-${horizontalOffset}%)` }
})

const invokeUnnormalizedHandler = (name, args) => {
  // Normalized XAML listeners are invoked by Vue's emit() path. Only invoke
  // the legacy raw attribute form here, preventing duplicate callbacks.
  if (attrs[`on${name}`]) return
  const raw = attrs[name]
  const handler = resolveXamlHandler(raw, instance)
  if (handler) handler(args)
}

const setSelectedIndex = (index, { focus = false } = {}) => {
  if (!isEnabled.value || !items.value.length) return false
  const bounded = clampIndex(index)
  const oldIndex = selectedIndex.value
  if (bounded === oldIndex) return false
  const oldItem = items.value[oldIndex]
  const nextItem = items.value[bounded]
  currentIndex.value = bounded
  emit('update:SelectedIndex', bounded)
  emit('update:SelectedItem', nextItem)
  const args = {
    AddedItems: nextItem === undefined ? [] : [nextItem],
    RemovedItems: oldItem === undefined ? [] : [oldItem],
    SelectedIndex: bounded,
    SelectedItem: nextItem
  }
  emit('SelectionChanged', args)
  invokeUnnormalizedHandler('SelectionChanged', args)
  showNavigationButtons()
  if (focus) focusSelectedItem()
  return true
}

function prev() {
  if (setSelectedIndex(selectedIndex.value - 1, { focus: keyboardInput.value })) showNavigationButtons()
}
function next() {
  if (setSelectedIndex(selectedIndex.value + 1, { focus: keyboardInput.value })) showNavigationButtons()
}

const now = () => (typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now())
let lastWheelTime = 0
let lastWheelDirection = 0
const wheelDelay = 200
function onWheel(event) {
  if (!isEnabled.value || event.ctrlKey) return
  const rawDelta = orientationClass.value === 'vertical'
    ? event.deltaY
    : (Math.abs(event.deltaX) >= Math.abs(event.deltaY) && event.deltaX !== 0 ? event.deltaX : event.deltaY)
  if (!rawDelta) return
  const direction = Math.sign(rawDelta)
  const timestamp = now()
  const canFlip = direction !== lastWheelDirection || timestamp - lastWheelTime > wheelDelay
  lastWheelTime = timestamp
  if (!canFlip) {
    event.preventDefault()
    return
  }
  const moved = rawDelta > 0
    ? setSelectedIndex(selectedIndex.value + 1)
    : setSelectedIndex(selectedIndex.value - 1)
  if (moved) {
    lastWheelDirection = direction
    event.preventDefault()
  }
  // At either edge leave the event unhandled so the containing ScrollViewer
  // can continue scrolling, matching WinUI's chaining behavior.
}

const pointerGesture = ref(null)
let activePointerId = null
let touchGesture = null
const gestureDistance = 30
const mainAxis = (event) => orientationClass.value === 'vertical' ? event.clientY : event.clientX
const crossAxis = (event) => orientationClass.value === 'vertical' ? event.clientX : event.clientY

function beginGesture(start, cross, pointerId = null) {
  pointerGesture.value = { start, last: start, cross, pointerId, cancelled: false }
}
function updateGesture(main, cross, event) {
  const gesture = pointerGesture.value
  if (!gesture) return
  gesture.last = main
  if (Math.abs(cross - gesture.cross) > Math.abs(main - gesture.start) + 8) {
    gesture.cancelled = true
    return
  }
  if (Math.abs(main - gesture.start) > 8) event.preventDefault()
}
function completeGesture(cancelled = false) {
  const gesture = pointerGesture.value
  pointerGesture.value = null
  const direction = gesture && !cancelled && !gesture.cancelled ? gesture.start - gesture.last : 0
  if (!gesture || !direction || Math.abs(direction) < gestureDistance || !isEnabled.value) return
  const forward = orientationClass.value === 'horizontal' && isRtl.value ? direction < 0 : direction > 0
  if (forward) next()
  else prev()
}

function onPointerDown(event) {
  if (!isEnabled.value) return
  if (event.pointerType === 'mouse' || !event.pointerType) {
    keyboardInput.value = false
    showNavigationButtons()
    return
  }
  activePointerId = event.pointerId
  // Pointer-capable browsers also dispatch TouchEvents. Once a pointer
  // gesture is active, discard any fallback touch state to avoid double flips.
  touchGesture = null
  beginGesture(mainAxis(event), crossAxis(event), event.pointerId)
  hideNavigationButtons()
  try { rootRef.value?.setPointerCapture?.(event.pointerId) } catch { /* capture can fail after cancellation */ }
}
function onPointerMove(event) {
  if (activePointerId !== event.pointerId) return
  updateGesture(mainAxis(event), crossAxis(event), event)
}
function onPointerUp(event) {
  if (activePointerId !== event.pointerId) return
  activePointerId = null
  touchGesture = null
  const gesture = pointerGesture.value
  try { rootRef.value?.releasePointerCapture?.(event.pointerId) } catch { /* already released */ }
  completeGesture(false)
  if (gesture) hideNavigationButtons()
}
function onPointerCancel(event) {
  if (activePointerId !== event.pointerId) return
  activePointerId = null
  touchGesture = null
  completeGesture(true)
  hideNavigationButtons()
}
function onLostPointerCapture(event) {
  if (activePointerId !== null && event.pointerId === activePointerId) {
    activePointerId = null
    completeGesture(true)
  }
}

function onTouchStart(event) {
  if (activePointerId !== null || !isEnabled.value) return
  const touch = event.touches?.[0]
  if (!touch) return
  touchGesture = { start: orientationClass.value === 'vertical' ? touch.clientY : touch.clientX, cross: orientationClass.value === 'vertical' ? touch.clientX : touch.clientY }
  beginGesture(touchGesture.start, touchGesture.cross)
  hideNavigationButtons()
}
function onTouchMove(event) {
  if (activePointerId !== null || !touchGesture) return
  const touch = event.touches?.[0]
  if (!touch) return
  const main = orientationClass.value === 'vertical' ? touch.clientY : touch.clientX
  const cross = orientationClass.value === 'vertical' ? touch.clientX : touch.clientY
  updateGesture(main, cross, event)
}
function onTouchEnd(event) {
  if (activePointerId !== null || !touchGesture) return
  const touch = event.changedTouches?.[0]
  if (touch) {
    const main = orientationClass.value === 'vertical' ? touch.clientY : touch.clientX
    const cross = orientationClass.value === 'vertical' ? touch.clientX : touch.clientY
    pointerGesture.value.last = main
    pointerGesture.value.cancelled = Math.abs(cross - touchGesture.cross) > Math.abs(main - touchGesture.start) + 8
    completeGesture(false)
  }
  touchGesture = null
  hideNavigationButtons()
}
function onTouchCancel() {
  if (activePointerId !== null) return
  touchGesture = null
  completeGesture(true)
  hideNavigationButtons()
}

function clearButtonsFadeTimer() {
  if (buttonsFadeTimer !== null) {
    clearTimeout(buttonsFadeTimer)
    buttonsFadeTimer = null
  }
}
function showNavigationButtons() {
  if (!isEnabled.value || items.value.length < 2) return
  clearButtonsFadeTimer()
  showButtons.value = true
  buttonsFadeTimer = setTimeout(() => {
    buttonsFadeTimer = null
    if (!keepButtonsVisible.value) showButtons.value = false
  }, 3000)
}
function hideNavigationButtons() {
  clearButtonsFadeTimer()
  if (!keepButtonsVisible.value) showButtons.value = false
}
function onMouseEnter() {
  if (isEnabled.value) showNavigationButtons()
}
function onMouseLeave() {
  if (!keepButtonsVisible.value) showNavigationButtons()
}
function onButtonEnter() {
  keepButtonsVisible.value = true
  showNavigationButtons()
}
function onButtonLeave() {
  keepButtonsVisible.value = false
  showNavigationButtons()
}

function focusSelectedItem() {
  nextTick(() => {
    const item = rootRef.value?.querySelector?.(`#${itemId(selectedIndex.value)}`)
    if (item && document.activeElement !== item) {
      try { item.focus({ preventScroll: true }) } catch { item.focus() }
    }
  })
}
function onFocusIn(event) {
  hasFocus.value = true
  showNavigationButtons()
  if (event.target === rootRef.value && items.value.length) focusSelectedItem()
}
function onFocusOut(event) {
  const nextTarget = event.relatedTarget
  if (!rootRef.value?.contains?.(nextTarget)) {
    hasFocus.value = false
    keyboardInput.value = false
    keepButtonsVisible.value = false
    hideNavigationButtons()
  }
}
function onItemFocus(index) {
  hasFocus.value = true
  if (index !== selectedIndex.value) setSelectedIndex(index, { focus: false })
}
function onKeyDown(event) {
  if (!isEnabled.value) return
  keyboardInput.value = true
  showNavigationButtons()
  const key = event.key
  const horizontal = orientationClass.value === 'horizontal'
  let target = null
  if ((horizontal && key === 'ArrowRight') || (!horizontal && key === 'ArrowDown') || key === 'PageDown') target = selectedIndex.value + 1
  else if ((horizontal && key === 'ArrowLeft') || (!horizontal && key === 'ArrowUp') || key === 'PageUp') target = selectedIndex.value - 1
  else if (key === 'Home') target = 0
  else if (key === 'End') target = items.value.length - 1
  if (target === null) return
  if (horizontal && isRtl.value && (key === 'ArrowLeft' || key === 'ArrowRight')) {
    target = key === 'ArrowLeft' ? selectedIndex.value + 1 : selectedIndex.value - 1
  }
  const moved = setSelectedIndex(target, { focus: true })
  if (moved) event.preventDefault()
}

const previousGlyph = computed(() => orientationClass.value === 'vertical' ? '\uEDDB' : '\uEDD9')
const nextGlyph = computed(() => orientationClass.value === 'vertical' ? '\uEDDC' : '\uEDDA')
const previousButtonVisible = computed(() => showButtons.value && selectedIndex.value > 0)
const nextButtonVisible = computed(() => showButtons.value && selectedIndex.value < items.value.length - 1)
const previousLabel = computed(() => t('text.previous'))
const nextLabel = computed(() => t('text.next'))
const automationName = computed(() => {
  const value = attrs['AutomationProperties.Name'] ?? attrs['automationproperties.name']
  return value ? String(resolveXamlValue(value, instance)) : undefined
})

// Vertical templates use a second pair of controls in WinUI's visual tree.
// CSS switches the same semantic buttons to the vertical edges without
// changing the item measurement or the public API.
watch(orientationClass, () => {
  lastWheelDirection = 0
  hideNavigationButtons()
})
watch(isEnabled, (enabled) => {
  if (!enabled) hideNavigationButtons()
})
onBeforeUnmount(() => {
  clearButtonsFadeTimer()
  pointerGesture.value = null
  touchGesture = null
  activePointerId = null
})

const exposedSelectedIndex = computed({
  get: () => selectedIndex.value,
  set: (value) => setSelectedIndex(value)
})
defineExpose({
  SelectedIndex: exposedSelectedIndex,
  SelectedItem: selectedItem,
  MovePrevious: prev,
  MoveNext: next
})
</script>

<style>
  .win-flip-view {
    position: relative;
    display: flex;
    width: 100%;
    min-width: 0;
    min-height: 1px;
    box-sizing: border-box;
    overflow: hidden;
    isolation: isolate;
    border-radius: var(--ControlCornerRadius, 4px);
    background: var(--FlipViewBackground, var(--SolidBackgroundFillColorBaseBrush, var(--ctrl-solid-fill)));
    border: 0 solid transparent;
    color: var(--TextFillColorPrimaryBrush, var(--text-primary));
    outline: none;
    touch-action: pan-y;
  }

  .win-flip-view.vertical {
    touch-action: pan-x;
  }

  .win-flip-view.disabled {
    opacity: var(--ControlDisabledOpacity, .36);
    pointer-events: none;
  }

  .flip-view-track {
    display: flex;
    flex: 0 0 100%;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 1px;
    transition: transform 333ms cubic-bezier(.1, .9, .2, 1);
    will-change: transform;
  }

  .win-flip-view.vertical .flip-view-track {
    flex-direction: column;
  }

  .win-flip-view.rtl.horizontal .flip-view-track {
    flex-direction: row-reverse;
  }

  .flip-view-item {
    position: relative;
    display: flex;
    flex: 0 0 100%;
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 1px;
    overflow: hidden;
    box-sizing: border-box;
    background: var(--FlipViewItemBackground, transparent);
    outline: none;
  }

  .flip-view-item > * {
    width: var(--flip-view-content-width, auto);
    height: var(--flip-view-content-height, auto);
    min-width: 0;
    min-height: 0;
    max-width: 100%;
    max-height: 100%;
  }

  /* Data-template roots fill the FlipView page; their children decide their
     own alignment (the bound-data sample uses a 120px image above a 60px
     caption inside this stable 180px viewport). */
  .flip-view-item > .win-grid,
  .flip-view-item > .win-border {
    width: 100%;
    height: 100%;
    min-height: 0;
  }

  .flip-view-item > .win-grid > .win-image-host,
  .flip-view-item > .win-grid > .win-border {
    min-width: 0;
  }

  .flip-view-item:focus-visible {
    z-index: 1;
    outline: 2px solid var(--FocusVisualPrimaryBrush, var(--accent-base));
    outline-offset: -2px;
  }

  .win-flip-view img {
    max-width: 100%;
    max-height: 100%;
  }

  .flip-btn {
    position: absolute;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    margin: 1px;
    padding: 0;
    border: var(--FlipViewButtonBorderThemeThickness, 0) solid var(--FlipViewNextPreviousButtonBorderBrush, var(--ControlStrokeColorDefaultBrush, transparent));
    border-radius: var(--ControlCornerRadius, 4px);
    background: var(--FlipViewNextPreviousButtonBackground, var(--AcrylicInAppFillColorDefaultBrush, rgba(255, 255, 255, .72)));
    color: var(--FlipViewNextPreviousArrowForeground, var(--ControlStrongFillColorDefaultBrush, var(--ctrl-strong-fill)));
    cursor: pointer;
    opacity: 0;
    pointer-events: none;
    transition: opacity 167ms cubic-bezier(.1, .9, .2, 1), background 83ms linear, color 83ms linear;
  }

  .flip-btn.visible {
    opacity: 1;
    pointer-events: auto;
  }

  .flip-btn:disabled {
    cursor: default;
  }

  .win-flip-view.horizontal .flip-btn {
    top: 50%;
    width: 16px;
    height: 38px;
    transform: translateY(-50%);
  }

  .win-flip-view.horizontal .flip-btn.prev { left: 0; }
  .win-flip-view.horizontal .flip-btn.next { right: 0; }

  .win-flip-view.vertical .flip-btn {
    left: 50%;
    width: 38px;
    height: 16px;
    transform: translateX(-50%);
  }

  .win-flip-view.vertical .flip-btn.prev { top: 0; }
  .win-flip-view.vertical .flip-btn.next { bottom: 0; }

  .flip-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
    pointer-events: none;
    background: var(--FlipViewNextPreviousButtonBackground, var(--AcrylicInAppFillColorDefaultBrush, rgba(255, 255, 255, .72)));
  }

  .flip-btn:hover {
    background: var(--FlipViewNextPreviousButtonBackgroundPointerOver, var(--AcrylicInAppFillColorDefaultBrush, rgba(255, 255, 255, .84)));
    border-color: var(--FlipViewNextPreviousButtonBorderBrushPointerOver, var(--ControlStrokeColorDefaultBrush, transparent));
    color: var(--FlipViewNextPreviousArrowForegroundPointerOver, var(--TextFillColorSecondaryBrush, var(--text-secondary)));
  }

  .flip-btn:active {
    background: var(--FlipViewNextPreviousButtonBackgroundPressed, var(--AcrylicInAppFillColorDefaultBrush, rgba(255, 255, 255, .92)));
    border-color: var(--FlipViewNextPreviousButtonBorderBrushPressed, var(--ControlStrokeColorDefaultBrush, transparent));
    color: var(--FlipViewNextPreviousArrowForegroundPressed, var(--TextFillColorSecondaryBrush, var(--text-secondary)));
  }

  .flip-btn:active .flip-arrow {
    transform: scale(.875);
  }

  .flip-btn .flip-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-family: var(--SymbolThemeFontFamily, 'Segoe Fluent Icons', 'Segoe MDL2 Assets', sans-serif);
    font-size: var(--FlipViewButtonFontSize, 8px);
    font-weight: 400;
    line-height: 1;
    transition: transform 100ms ease, color 83ms linear;
  }

  .win-flip-view.rtl.horizontal .flip-btn.prev .flip-arrow,
  .win-flip-view.rtl.horizontal .flip-btn.next .flip-arrow {
    transform: scaleX(-1);
  }

  .win-flip-view.rtl.horizontal .flip-btn:active .flip-arrow {
    transform: scaleX(-1) scale(.875);
  }
</style>
