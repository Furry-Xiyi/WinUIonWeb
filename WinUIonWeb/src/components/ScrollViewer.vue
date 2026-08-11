<template>
  <div
    ref="rootRef"
    class="win-scroll-viewer"
    :class="[
      `zoom-mode-${effectiveZoomMode.toLowerCase()}`,
      {
        'scrolling': isScrolling,
        'zooming': isZooming,
        'has-vertical-scrollbar': hasVerticalScrollBar,
        'has-horizontal-scrollbar': hasHorizontalScrollBar,
        'scrollbar-corner-visible': hasVerticalScrollBar && hasHorizontalScrollBar && (isVerticalExpanded || isHorizontalExpanded),
        'vertical-contracting': isVerticalContracting,
        'horizontal-contracting': isHorizontalContracting
      }
    ]"
    :style="scrollViewerStyle"
  >
    <div
      ref="scrollViewerRef"
      class="win-scroll-viewer-viewport"
      :style="viewportStyle"
      :tabindex="effectiveIsTabStop ? 0 : -1"
      @scroll="handleScroll"
      @wheel="handleWheel"
      @touchstart.passive="handleTouchStart"
      @touchmove.passive="handleTouchMove"
      @touchend.passive="handleTouchEnd"
    >
      <div
        ref="contentRef"
        class="scroll-content"
        :style="contentStyle"
      >
        <slot></slot>
      </div>
    </div>

    <div
      v-if="hasVerticalScrollBar"
      ref="verticalScrollBarRef"
      class="scrollbar scrollbar-vertical"
      :class="{ 'visible': showVerticalScrollBar, 'expanded': isVerticalExpanded, 'contracting': isVerticalContracting, 'dragging': isDraggingVertical, 'line-scrolling': activeLineScroll?.orientation === 'vertical' || isWheelScrolling, 'has-cross-scrollbar': hasHorizontalScrollBar }"
      @pointerenter="handleScrollBarPointerEnter('vertical', $event)"
      @pointerleave="handleScrollBarPointerLeave('vertical')"
      @pointerdown="handleScrollBarPointerDown('vertical', $event)"
      @wheel="handleScrollBarWheel"
    >
      <button class="scrollbar-button decrease icon" type="button" aria-hidden="true" tabindex="-1" @pointerdown.prevent="startLineScroll('vertical', -1, $event)"></button>
      <div class="scrollbar-track"></div>
      <div
        class="scrollbar-thumb"
        :style="verticalThumbStyle"
        @pointerdown.prevent.stop="startVerticalDrag"
      ></div>
      <button class="scrollbar-button increase icon" type="button" aria-hidden="true" tabindex="-1" @pointerdown.prevent="startLineScroll('vertical', 1, $event)"></button>
    </div>

    <div
      v-if="hasHorizontalScrollBar"
      ref="horizontalScrollBarRef"
      class="scrollbar scrollbar-horizontal"
      :class="{ 'visible': showHorizontalScrollBar, 'expanded': isHorizontalExpanded, 'contracting': isHorizontalContracting, 'dragging': isDraggingHorizontal, 'line-scrolling': activeLineScroll?.orientation === 'horizontal' || isWheelScrolling, 'has-cross-scrollbar': hasVerticalScrollBar }"
      @pointerenter="handleScrollBarPointerEnter('horizontal', $event)"
      @pointerleave="handleScrollBarPointerLeave('horizontal')"
      @pointerdown="handleScrollBarPointerDown('horizontal', $event)"
      @wheel="handleScrollBarWheel"
    >
      <button class="scrollbar-button decrease icon" type="button" aria-hidden="true" tabindex="-1" @pointerdown.prevent="startLineScroll('horizontal', -1, $event)"></button>
      <div class="scrollbar-track"></div>
      <div
        class="scrollbar-thumb"
        :style="horizontalThumbStyle"
        @pointerdown.prevent.stop="startHorizontalDrag"
      ></div>
      <button class="scrollbar-button increase icon" type="button" aria-hidden="true" tabindex="-1" @pointerdown.prevent="startLineScroll('horizontal', 1, $event)"></button>
    </div>
    <div v-if="hasVerticalScrollBar && hasHorizontalScrollBar" class="scrollbar-corner"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

// Enums
type ScrollViewerZoomMode = 'Disabled' | 'Enabled'
type ScrollViewerScrollMode = 'Disabled' | 'Enabled' | 'Auto'
type ScrollViewerScrollBarVisibility = 'Disabled' | 'Auto' | 'Hidden' | 'Visible'
type ScrollViewerHorizontalAlignment = 'Left' | 'Center' | 'Right' | 'Stretch'
type ScrollViewerVerticalAlignment = 'Top' | 'Center' | 'Bottom' | 'Stretch'

// Props - 100% aligned with official WinUI API
interface Props {
  ZoomMode?: ScrollViewerZoomMode
  MinZoomFactor?: number
  MaxZoomFactor?: number
  ZoomFactor?: number
  HorizontalScrollMode?: ScrollViewerScrollMode
  VerticalScrollMode?: ScrollViewerScrollMode
  HorizontalScrollBarVisibility?: ScrollViewerScrollBarVisibility
  VerticalScrollBarVisibility?: ScrollViewerScrollBarVisibility
  IsVerticalScrollChainingEnabled?: boolean
  IsHorizontalScrollChainingEnabled?: boolean
  IsTabStop?: boolean
  Width?: number | string
  Height?: number | string
  HorizontalAlignment?: ScrollViewerHorizontalAlignment
  VerticalAlignment?: ScrollViewerVerticalAlignment
}

const props = withDefaults(defineProps<Props>(), {
  ZoomMode: 'Disabled',
  MinZoomFactor: 0.1,
  MaxZoomFactor: 10.0,
  ZoomFactor: 1.0,
  HorizontalScrollMode: 'Auto',
  VerticalScrollMode: 'Auto',
  HorizontalScrollBarVisibility: 'Auto',
  VerticalScrollBarVisibility: 'Auto',
  IsVerticalScrollChainingEnabled: true,
  IsHorizontalScrollChainingEnabled: true,
  IsTabStop: false,
  Width: NaN,
  Height: NaN,
  HorizontalAlignment: 'Stretch',
  VerticalAlignment: 'Stretch'
})

// Events - 100% aligned with official WinUI API
interface ScrollViewerView {
  HorizontalOffset: number
  VerticalOffset: number
  ZoomFactor: number
}

interface ViewChangedEventArgs {
  IsIntermediate: boolean
}

interface ViewChangingEventArgs {
  NextView: ScrollViewerView
  FinalView: ScrollViewerView
  IsInertial: boolean
}

const emit = defineEmits<{
  ViewChanged: [args: ViewChangedEventArgs]
  ViewChanging: [args: ViewChangingEventArgs]
  DirectManipulationStarted: [args: Record<string, never>]
  DirectManipulationCompleted: [args: Record<string, never>]
}>()

// Refs
const rootRef = ref<HTMLDivElement>()
const scrollViewerRef = ref<HTMLDivElement>()
const contentRef = ref<HTMLDivElement>()
const verticalScrollBarRef = ref<HTMLDivElement>()
const horizontalScrollBarRef = ref<HTMLDivElement>()
const currentZoomFactor = ref(props.ZoomFactor)
const isScrolling = ref(false)
const isZooming = ref(false)
const showVerticalScrollBar = ref(false)
const showHorizontalScrollBar = ref(false)
const isVerticalExpanded = ref(false)
const isHorizontalExpanded = ref(false)
const isVerticalContracting = ref(false)
const isHorizontalContracting = ref(false)
const velocityAnimationFrame = ref<number>()
const velocityExpectedLeft = ref<number | null>(null)
const velocityExpectedTop = ref<number | null>(null)
const isWheelScrolling = ref(false)
const isDirectManipulationActive = ref(false)

// Touch/Gesture state
const touchStartDistance = ref(0)
const touchStartZoom = ref(1)
const scrollTimer = ref<number>()
const verticalHoverExpandTimer = ref<number>()
const horizontalHoverExpandTimer = ref<number>()
const verticalContractTimer = ref<number>()
const horizontalContractTimer = ref<number>()
const verticalContractAnimationTimer = ref<number>()
const horizontalContractAnimationTimer = ref<number>()
const isVerticalPointerOver = ref(false)
const isHorizontalPointerOver = ref(false)

// Drag state for custom scrollbars
const isDraggingVertical = ref(false)
const isDraggingHorizontal = ref(false)
const verticalInteractionToken = ref(0)
const horizontalInteractionToken = ref(0)
const lastNonMouseScrollBarPointerTime = ref(0)
const activeVerticalDragPointerId = ref<number | null>(null)
const activeHorizontalDragPointerId = ref<number | null>(null)
const activeLineScroll = ref<{ orientation: 'vertical' | 'horizontal', direction: number, lastTime: number } | null>(null)
const lineScrollAnimationFrame = ref<number>()
const wheelScrollAnimationFrame = ref<number>()
const wheelScrollTargetLeft = ref(0)
const wheelScrollTargetTop = ref(0)
const wheelScrollExpectedLeft = ref<number | null>(null)
const wheelScrollExpectedTop = ref<number | null>(null)
const dragStartY = ref(0)
const dragStartX = ref(0)
const dragStartScrollTop = ref(0)
const dragStartScrollLeft = ref(0)
const overflowRevision = ref(0)
const scrollRevision = ref(0)
let resizeObserver: ResizeObserver | undefined

const scrollBarContractDelay = 0
const scrollBarContractBeginTime = 500
const scrollBarContractDuration = 167
const scrollControllerSmallChange = 16
const scrollControllerInertiaDecayRate = 0.9995
const scrollControllerVelocityNeededPerPixel = 7.600855902349023
const scrollControllerMinMaxEpsilon = 0.001

const effectiveZoomMode = computed<ScrollViewerZoomMode>(() => props.ZoomMode)
const effectiveMinZoomFactor = computed(() => props.MinZoomFactor)
const effectiveMaxZoomFactor = computed(() => props.MaxZoomFactor)
const effectiveZoomFactor = computed(() => props.ZoomFactor)
const effectiveHorizontalScrollMode = computed<ScrollViewerScrollMode>(() => props.HorizontalScrollMode)
const effectiveVerticalScrollMode = computed<ScrollViewerScrollMode>(() => props.VerticalScrollMode)
const effectiveHorizontalScrollBarVisibility = computed<ScrollViewerScrollBarVisibility>(() => props.HorizontalScrollBarVisibility)
const effectiveVerticalScrollBarVisibility = computed<ScrollViewerScrollBarVisibility>(() => props.VerticalScrollBarVisibility)
const effectiveIsVerticalScrollChainingEnabled = computed(() => props.IsVerticalScrollChainingEnabled)
const effectiveIsHorizontalScrollChainingEnabled = computed(() => props.IsHorizontalScrollChainingEnabled)
const effectiveIsTabStop = computed(() => props.IsTabStop)
const effectiveWidth = computed(() => props.Width)
const effectiveHeight = computed(() => props.Height)
const effectiveHorizontalAlignment = computed<ScrollViewerHorizontalAlignment>(() => props.HorizontalAlignment)
const effectiveVerticalAlignment = computed<ScrollViewerVerticalAlignment>(() => props.VerticalAlignment)

const hasCssSize = (value: number | string | undefined) => (
  value !== undefined &&
  value !== null &&
  value !== '' &&
  !(typeof value === 'number' && Number.isNaN(value))
)

const cssSize = (value: number | string | undefined) => (
  typeof value === 'number' || (typeof value === 'string' && /^-?\d+(?:\.\d+)?$/.test(value.trim()))
    ? `${Number(value)}px`
    : value
)

// Computed styles
const scrollViewerStyle = computed(() => {
  const styles: Record<string, string> = {}

  if (hasCssSize(effectiveWidth.value)) {
    styles.width = cssSize(effectiveWidth.value) ?? ''
  }
  if (hasCssSize(effectiveHeight.value)) {
    styles.height = cssSize(effectiveHeight.value) ?? ''
  }

  const horizontalAlignment = {
    Left: 'flex-start',
    Center: 'center',
    Right: 'flex-end',
    Stretch: 'stretch'
  }[effectiveHorizontalAlignment.value]
  styles.justifySelf = horizontalAlignment
  styles.alignSelf = horizontalAlignment

  if (effectiveVerticalAlignment.value !== 'Stretch') {
    styles.verticalAlign = {
      Top: 'top',
      Center: 'middle',
      Bottom: 'bottom'
    }[effectiveVerticalAlignment.value] ?? 'top'
  }

  return styles
})

const viewportStyle = computed(() => {
  const styles: Record<string, string> = {}
  const overflowX = getOverflowValue(effectiveHorizontalScrollMode.value, effectiveHorizontalScrollBarVisibility.value)
  const overflowY = getOverflowValue(effectiveVerticalScrollMode.value, effectiveVerticalScrollBarVisibility.value)

  styles.overflowX = overflowX
  styles.overflowY = overflowY
  return styles
})

const contentStyle = computed(() => {
  const styles: Record<string, string> = {}

  // CSS zoom participates in layout, so extent and scrollbar geometry follow the
  // same scaled content size as ScrollPresenter instead of merely painting a
  // transform over an unscaled extent.
  const zoom = Math.max(effectiveMinZoomFactor.value, Math.min(effectiveMaxZoomFactor.value, currentZoomFactor.value))
  styles.zoom = String(zoom)

  styles.display = 'block'
  styles.width = '100%'
  styles.minWidth = '0'

  return styles
})

const computedVerticalScrollBarVisibility = computed(() => {
  overflowRevision.value
  if (effectiveVerticalScrollBarVisibility.value === 'Disabled') return 'hidden'
  if (effectiveVerticalScrollBarVisibility.value === 'Hidden') return 'hidden'
  if (effectiveVerticalScrollBarVisibility.value === 'Visible') return 'visible'

  // Auto mode - show only when content overflows
  if (!scrollViewerRef.value) return 'hidden'
  return scrollViewerRef.value.scrollHeight > scrollViewerRef.value.clientHeight ? 'auto' : 'hidden'
})

const computedHorizontalScrollBarVisibility = computed(() => {
  overflowRevision.value
  if (effectiveHorizontalScrollBarVisibility.value === 'Disabled') return 'hidden'
  if (effectiveHorizontalScrollBarVisibility.value === 'Hidden') return 'hidden'
  if (effectiveHorizontalScrollBarVisibility.value === 'Visible') return 'visible'

  // Auto mode
  if (!scrollViewerRef.value) return 'hidden'
  return scrollViewerRef.value.scrollWidth > scrollViewerRef.value.clientWidth ? 'auto' : 'hidden'
})

const hasVerticalScrollBar = computed(() => computedVerticalScrollBarVisibility.value !== 'hidden')
const hasHorizontalScrollBar = computed(() => computedHorizontalScrollBarVisibility.value !== 'hidden')

const verticalThumbStyle = computed(() => {
  scrollRevision.value
  if (!scrollViewerRef.value) return {}

  const container = scrollViewerRef.value
  const metrics = getScrollBarMetrics('vertical')
  const minimumThumbHeight = 30
  const thumbHeight = Math.max(minimumThumbHeight, (container.clientHeight / container.scrollHeight) * metrics.trackLength)
  const travel = Math.max(0, metrics.trackLength - thumbHeight)
  const maxScroll = Math.max(1, container.scrollHeight - container.clientHeight)
  const thumbTop = metrics.trackStart + (container.scrollTop / maxScroll) * travel

  return {
    height: `${thumbHeight}px`,
    transform: `translateY(${thumbTop}px)`
  }
})

const horizontalThumbStyle = computed(() => {
  scrollRevision.value
  if (!scrollViewerRef.value) return {}

  const container = scrollViewerRef.value
  const metrics = getScrollBarMetrics('horizontal')
  const minimumThumbWidth = 30
  const thumbWidth = Math.max(minimumThumbWidth, (container.clientWidth / container.scrollWidth) * metrics.trackLength)
  const travel = Math.max(0, metrics.trackLength - thumbWidth)
  const maxScroll = Math.max(1, container.scrollWidth - container.clientWidth)
  const thumbLeft = metrics.trackStart + (container.scrollLeft / maxScroll) * travel

  return {
    width: `${thumbWidth}px`,
    transform: `translateX(${thumbLeft}px)`
  }
})

// Helper functions
function getOverflowValue(scrollMode: ScrollViewerScrollMode, visibility: ScrollViewerScrollBarVisibility): string {
  if (scrollMode === 'Disabled' || visibility === 'Disabled') return 'hidden'
  if (visibility === 'Hidden') return 'scroll'
  if (visibility === 'Visible') return 'scroll'
  return 'auto' // Auto or default
}

function emitViewChanged(isIntermediate: boolean) {
  if (!scrollViewerRef.value) return

  const view: ScrollViewerView = {
    HorizontalOffset: scrollViewerRef.value.scrollLeft,
    VerticalOffset: scrollViewerRef.value.scrollTop,
    ZoomFactor: currentZoomFactor.value
  }

  if (isIntermediate) {
    emit('ViewChanging', {
      NextView: view,
      FinalView: view,
      IsInertial: false
    })
  }
  emit('ViewChanged', { IsIntermediate: isIntermediate })
}

function beginDirectManipulation() {
  if (isDirectManipulationActive.value) return
  isDirectManipulationActive.value = true
  emit('DirectManipulationStarted', {})
}

function completeDirectManipulation() {
  if (!isDirectManipulationActive.value) return
  isDirectManipulationActive.value = false
  emit('DirectManipulationCompleted', {})
}

function getScrollBarMetrics(orientation: 'vertical' | 'horizontal') {
  const container = scrollViewerRef.value
  if (!container) return { trackStart: 0, trackLength: 0 }

  const isVertical = orientation === 'vertical'
  const scrollBar = isVertical ? verticalScrollBarRef.value : horizontalScrollBarRef.value
  const rect = scrollBar?.getBoundingClientRect()
  const measuredExtent = rect ? (isVertical ? rect.height : rect.width) : 0
  const crossBarVisible = isVertical ? hasHorizontalScrollBar.value : hasVerticalScrollBar.value
  const extent = measuredExtent || (isVertical ? container.clientHeight : container.clientWidth)
  const overlapAvoidance = crossBarVisible ? 12 : 0
  const buttonReserve = 12
  const trackStart = buttonReserve
  const trackEndReserve = buttonReserve + overlapAvoidance
  const trackLength = Math.max(30, extent - trackStart - trackEndReserve)

  return { trackStart, trackLength }
}

// Scroll handling
function handleScroll() {
  stopSmoothWheelScrollIfExternalScroll()
  stopScrollVelocityIfExternalScroll()

  scrollRevision.value += 1

  beginDirectManipulation()
  isScrolling.value = true

  // Clear previous timer
  if (scrollTimer.value) {
    clearTimeout(scrollTimer.value)
  }

  // Emit intermediate event
  emitViewChanged(true)

  // Set timer for final event
  scrollTimer.value = window.setTimeout(() => {
    isScrolling.value = false
    emitViewChanged(false)
    completeDirectManipulation()
  }, 150)

  // Update scrollbar visibility
  updateScrollBarVisibility()
}

function updateScrollBarVisibility() {
  if (!scrollViewerRef.value) return

  showVerticalScrollBar.value = hasVerticalScrollBar.value
  showHorizontalScrollBar.value = hasHorizontalScrollBar.value
}

function clearScrollBarTimers(orientation: 'vertical' | 'horizontal') {
  if (orientation === 'vertical') {
    if (verticalHoverExpandTimer.value) clearTimeout(verticalHoverExpandTimer.value)
    if (verticalContractTimer.value) clearTimeout(verticalContractTimer.value)
    if (verticalContractAnimationTimer.value) clearTimeout(verticalContractAnimationTimer.value)
    verticalHoverExpandTimer.value = undefined
    verticalContractTimer.value = undefined
    verticalContractAnimationTimer.value = undefined
  } else {
    if (horizontalHoverExpandTimer.value) clearTimeout(horizontalHoverExpandTimer.value)
    if (horizontalContractTimer.value) clearTimeout(horizontalContractTimer.value)
    if (horizontalContractAnimationTimer.value) clearTimeout(horizontalContractAnimationTimer.value)
    horizontalHoverExpandTimer.value = undefined
    horizontalContractTimer.value = undefined
    horizontalContractAnimationTimer.value = undefined
  }
}

function getScrollBarInteractionToken(orientation: 'vertical' | 'horizontal') {
  return orientation === 'vertical' ? verticalInteractionToken.value : horizontalInteractionToken.value
}

function bumpScrollBarInteractionToken(orientation: 'vertical' | 'horizontal') {
  if (orientation === 'vertical') {
    verticalInteractionToken.value += 1
    return verticalInteractionToken.value
  }
  horizontalInteractionToken.value += 1
  return horizontalInteractionToken.value
}

function beginScrollBarInteraction(orientation: 'vertical' | 'horizontal') {
  const token = bumpScrollBarInteractionToken(orientation)
  clearScrollBarTimers(orientation)
  if (orientation === 'vertical') {
    isVerticalContracting.value = false
    showVerticalScrollBar.value = hasVerticalScrollBar.value
  } else {
    isHorizontalContracting.value = false
    showHorizontalScrollBar.value = hasHorizontalScrollBar.value
  }
  scrollRevision.value += 1
  updateScrollBarVisibility()
  return token
}

function expandScrollBarAfterLayout(orientation: 'vertical' | 'horizontal', token = getScrollBarInteractionToken(orientation)) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (token !== getScrollBarInteractionToken(orientation)) return
      if (orientation === 'vertical') {
        if (!isVerticalPointerOver.value && activeLineScroll.value?.orientation !== 'vertical' && !isDraggingVertical.value) return
        isVerticalContracting.value = false
        isVerticalExpanded.value = hasVerticalScrollBar.value
      } else {
        if (!isHorizontalPointerOver.value && activeLineScroll.value?.orientation !== 'horizontal' && !isDraggingHorizontal.value) return
        isHorizontalContracting.value = false
        isHorizontalExpanded.value = hasHorizontalScrollBar.value
      }
      scrollRevision.value += 1
      updateScrollBarVisibility()
    })
  })
}

function expandScrollBarNow(orientation: 'vertical' | 'horizontal') {
  const token = beginScrollBarInteraction(orientation)
  if (orientation === 'vertical') {
    isVerticalExpanded.value = hasVerticalScrollBar.value
  } else {
    isHorizontalExpanded.value = hasHorizontalScrollBar.value
  }
  scrollRevision.value += 1
  updateScrollBarVisibility()
  return token
}

function markNonMouseScrollBarPointer(event: PointerEvent) {
  if (event.pointerType !== 'mouse') {
    lastNonMouseScrollBarPointerTime.value = performance.now()
  }
}

function isSyntheticHoverAfterTouch() {
  return performance.now() - lastNonMouseScrollBarPointerTime.value < 800
}

function triggerScrollBarHapticFeedback(event: PointerEvent) {
  if (event.pointerType === 'mouse') return
  try {
    navigator.vibrate?.(12)
  } catch {
    // Some browsers expose vibrate but reject it silently outside supported hardware.
  }
}

function getScrollBarPointerLineDirection(orientation: 'vertical' | 'horizontal', event: PointerEvent) {
  const target = event.currentTarget as HTMLElement | null
  const rect = target?.getBoundingClientRect()
  if (!rect) return 0

  const buttonExtent = 12
  if (orientation === 'vertical') {
    const y = event.clientY - rect.top
    if (y <= buttonExtent) return -1
    if (y >= rect.height - buttonExtent) return 1
    return 0
  }

  const x = event.clientX - rect.left
  if (x <= buttonExtent) return -1
  if (x >= rect.width - buttonExtent) return 1
  return 0
}

function handleScrollBarPointerEnter(orientation: 'vertical' | 'horizontal', event: PointerEvent) {
  if (event.pointerType !== 'mouse') return
  if (isSyntheticHoverAfterTouch()) return
  if (orientation === 'vertical') {
    isVerticalPointerOver.value = true
  } else {
    isHorizontalPointerOver.value = true
  }

  const token = beginScrollBarInteraction(orientation)
  expandScrollBarAfterLayout(orientation, token)
}

function handleScrollBarPointerDown(orientation: 'vertical' | 'horizontal', event: PointerEvent) {
  if (event.pointerType === 'mouse') return
  markNonMouseScrollBarPointer(event)
  if ((event.target as HTMLElement | null)?.closest('.scrollbar-thumb, .scrollbar-button')) return
  triggerScrollBarHapticFeedback(event)
  const direction = getScrollBarPointerLineDirection(orientation, event)
  if (direction !== 0) {
    event.preventDefault()
    startLineScroll(orientation, direction, event)
    return
  }
  expandScrollBarNow(orientation)
  event.preventDefault()
}

function handleScrollBarPointerLeave(orientation: 'vertical' | 'horizontal') {
  if (orientation === 'vertical') {
    isVerticalPointerOver.value = false
    if (!isDraggingVertical.value && activeLineScroll.value?.orientation !== 'vertical') {
      scheduleScrollBarContract('vertical')
    }
    return
  }

  isHorizontalPointerOver.value = false
  if (!isDraggingHorizontal.value && activeLineScroll.value?.orientation !== 'horizontal') {
    scheduleScrollBarContract('horizontal')
  }
}

function scheduleScrollBarContract(orientation: 'vertical' | 'horizontal') {
  const token = bumpScrollBarInteractionToken(orientation)
  const timer = orientation === 'vertical' ? verticalContractTimer : horizontalContractTimer
  if (timer.value) clearTimeout(timer.value)

  timer.value = window.setTimeout(() => {
    if (token !== getScrollBarInteractionToken(orientation)) return
    if (orientation === 'vertical') {
      if (isVerticalPointerOver.value || isDraggingVertical.value || activeLineScroll.value?.orientation === 'vertical') return
      if (!isVerticalExpanded.value) return
      if (verticalContractAnimationTimer.value) clearTimeout(verticalContractAnimationTimer.value)
      isVerticalContracting.value = true
      isVerticalExpanded.value = false
      scrollRevision.value += 1
      verticalContractAnimationTimer.value = window.setTimeout(() => {
        if (token !== getScrollBarInteractionToken(orientation)) return
        if (isVerticalPointerOver.value || isDraggingVertical.value || activeLineScroll.value?.orientation === 'vertical') {
          isVerticalContracting.value = false
          isVerticalExpanded.value = hasVerticalScrollBar.value
          return
        }
        isVerticalContracting.value = false
        scrollRevision.value += 1
      }, scrollBarContractBeginTime + scrollBarContractDuration)
    } else {
      if (isHorizontalPointerOver.value || isDraggingHorizontal.value || activeLineScroll.value?.orientation === 'horizontal') return
      if (!isHorizontalExpanded.value) return
      if (horizontalContractAnimationTimer.value) clearTimeout(horizontalContractAnimationTimer.value)
      isHorizontalContracting.value = true
      isHorizontalExpanded.value = false
      scrollRevision.value += 1
      horizontalContractAnimationTimer.value = window.setTimeout(() => {
        if (token !== getScrollBarInteractionToken(orientation)) return
        if (isHorizontalPointerOver.value || isDraggingHorizontal.value || activeLineScroll.value?.orientation === 'horizontal') {
          isHorizontalContracting.value = false
          isHorizontalExpanded.value = hasHorizontalScrollBar.value
          return
        }
        isHorizontalContracting.value = false
        scrollRevision.value += 1
      }, scrollBarContractBeginTime + scrollBarContractDuration)
    }
    scrollRevision.value += 1
    updateScrollBarVisibility()
  }, scrollBarContractDelay)
}

function scrollLine(orientation: 'vertical' | 'horizontal', direction: number, distance = scrollControllerSmallChange) {
  if (!scrollViewerRef.value) return false
  const delta = distance * direction
  let changed = false
  if (orientation === 'vertical') {
    changed = requestScrollByOffset(0, delta, true)
  } else {
    changed = requestScrollByOffset(delta, 0, true)
  }
  return changed
}

function startLineScroll(orientation: 'vertical' | 'horizontal', direction: number, event: PointerEvent) {
  if (!scrollViewerRef.value) return
  markNonMouseScrollBarPointer(event)
  triggerScrollBarHapticFeedback(event)
  expandScrollBarNow(orientation)

  ;(event.currentTarget as HTMLElement | null)?.setPointerCapture?.(event.pointerId)
  stopLineScroll()
  activeLineScroll.value = { orientation, direction, lastTime: performance.now() }
  const moved = scrollLine(orientation, direction)
  if (!moved) {
    activeLineScroll.value = null
    return
  }
  document.addEventListener('pointerup', stopLineScroll)
  document.addEventListener('pointercancel', stopLineScroll)
  lineScrollAnimationFrame.value = requestAnimationFrame(runLineScroll)
}

function runLineScroll(now: number) {
  const active = activeLineScroll.value
  if (!active) return

  const elapsed = Math.min(50, now - active.lastTime)
  active.lastTime = now
  const moved = scrollLine(active.orientation, active.direction, 320 * elapsed / 1000)
  if (!moved) {
    cancelLineScroll(false)
    return
  }
  lineScrollAnimationFrame.value = requestAnimationFrame(runLineScroll)
}

function stopLineScroll() {
  cancelLineScroll(true)
}

function cancelLineScroll(shouldScheduleContract: boolean) {
  const previousOrientation = activeLineScroll.value?.orientation
  activeLineScroll.value = null
  if (lineScrollAnimationFrame.value !== undefined) {
    cancelAnimationFrame(lineScrollAnimationFrame.value)
    lineScrollAnimationFrame.value = undefined
  }
  document.removeEventListener('pointerup', stopLineScroll)
  document.removeEventListener('pointercancel', stopLineScroll)

  if (!shouldScheduleContract) return

  if (previousOrientation === 'vertical' && !isVerticalPointerOver.value && !isDraggingVertical.value) {
    scheduleScrollBarContract('vertical')
  }
  if (previousOrientation === 'horizontal' && !isHorizontalPointerOver.value && !isDraggingHorizontal.value) {
    scheduleScrollBarContract('horizontal')
  }
}

// Zoom handling (wheel/pinch)
function handleWheel(event: WheelEvent) {
  cancelPendingAnimatedScrollForDirectInput()

  // Ctrl+Wheel for zoom (standard browser behavior)
  if (event.ctrlKey && effectiveZoomMode.value !== 'Disabled') {
    const delta = -event.deltaY
    const zoomDelta = delta > 0 ? 1.1 : 0.9
    zoomToFactor(currentZoomFactor.value * zoomDelta)
    event.preventDefault()
    event.stopPropagation()
    return
  }

  // Handle scroll chaining
  if (!effectiveIsVerticalScrollChainingEnabled.value && scrollViewerRef.value) {
    const atTop = scrollViewerRef.value.scrollTop === 0
    const atBottom = scrollViewerRef.value.scrollTop + scrollViewerRef.value.clientHeight >= scrollViewerRef.value.scrollHeight

    if ((event.deltaY < 0 && atTop) || (event.deltaY > 0 && atBottom)) {
      event.preventDefault()
    }
  }

  if (!effectiveIsHorizontalScrollChainingEnabled.value && scrollViewerRef.value) {
    const atLeft = scrollViewerRef.value.scrollLeft === 0
    const atRight = scrollViewerRef.value.scrollLeft + scrollViewerRef.value.clientWidth >= scrollViewerRef.value.scrollWidth

    if ((event.deltaX < 0 && atLeft) || (event.deltaX > 0 && atRight)) {
      event.preventDefault()
    }
  }
}

function normalizeWheelDelta(event: WheelEvent) {
  let deltaX = event.deltaX
  let deltaY = event.deltaY

  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    deltaX *= 16
    deltaY *= 16
  } else if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE && scrollViewerRef.value) {
    deltaX *= scrollViewerRef.value.clientWidth
    deltaY *= scrollViewerRef.value.clientHeight
  }

  return { deltaX, deltaY }
}

function handleScrollBarWheel(event: WheelEvent) {
  const { deltaX, deltaY } = normalizeWheelDelta(event)

  if (requestScrollByOffset(deltaX, deltaY, true)) {
    event.preventDefault()
    event.stopPropagation()
    return
  }

  const verticalBlocked = !effectiveIsVerticalScrollChainingEnabled.value && deltaY !== 0
  const horizontalBlocked = !effectiveIsHorizontalScrollChainingEnabled.value && deltaX !== 0
  if (verticalBlocked || horizontalBlocked) {
    event.preventDefault()
    event.stopPropagation()
  }
}

function requestScrollByOffset(horizontalOffsetDelta = 0, verticalOffsetDelta = 0, animated = true) {
  const container = scrollViewerRef.value
  if (!container) return false

  const maxLeft = Math.max(0, container.scrollWidth - container.clientWidth)
  const maxTop = Math.max(0, container.scrollHeight - container.clientHeight)
  const baseLeft = wheelScrollAnimationFrame.value === undefined ? container.scrollLeft : wheelScrollTargetLeft.value
  const baseTop = wheelScrollAnimationFrame.value === undefined ? container.scrollTop : wheelScrollTargetTop.value
  let targetLeft = Math.max(0, Math.min(maxLeft, baseLeft + horizontalOffsetDelta))
  let targetTop = Math.max(0, Math.min(maxTop, baseTop + verticalOffsetDelta))

  if (targetLeft - 0 < scrollControllerMinMaxEpsilon) targetLeft = 0
  if (maxLeft - targetLeft < scrollControllerMinMaxEpsilon) targetLeft = maxLeft
  if (targetTop - 0 < scrollControllerMinMaxEpsilon) targetTop = 0
  if (maxTop - targetTop < scrollControllerMinMaxEpsilon) targetTop = maxTop

  const changedX = horizontalOffsetDelta !== 0 && (
    Math.abs(targetLeft - container.scrollLeft) > 0.01 ||
    Math.abs(targetLeft - wheelScrollTargetLeft.value) > 0.01
  )
  const changedY = verticalOffsetDelta !== 0 && (
    Math.abs(targetTop - container.scrollTop) > 0.01 ||
    Math.abs(targetTop - wheelScrollTargetTop.value) > 0.01
  )
  const changed = changedX || changedY

  if (!changed) return false

  cancelScrollVelocity()
  wheelScrollTargetLeft.value = targetLeft
  wheelScrollTargetTop.value = targetTop

  if (animated) {
    startSmoothWheelScroll()
  } else {
    container.scrollLeft = targetLeft
    container.scrollTop = targetTop
    scrollRevision.value += 1
    updateScrollBarVisibility()
    emitViewChanged(false)
  }

  return true
}

function startSmoothWheelScroll() {
  if (!scrollViewerRef.value) return
  isWheelScrolling.value = true
  if (wheelScrollAnimationFrame.value !== undefined) return
  wheelScrollAnimationFrame.value = requestAnimationFrame(runSmoothWheelScroll)
}

function runSmoothWheelScroll() {
  const container = scrollViewerRef.value
  if (!container) {
    stopSmoothWheelScroll()
    return
  }

  const deltaLeft = wheelScrollTargetLeft.value - container.scrollLeft
  const deltaTop = wheelScrollTargetTop.value - container.scrollTop
  const doneLeft = Math.abs(deltaLeft) < 0.5
  const doneTop = Math.abs(deltaTop) < 0.5

  if (doneLeft && doneTop) {
    container.scrollLeft = wheelScrollTargetLeft.value
    container.scrollTop = wheelScrollTargetTop.value
    wheelScrollExpectedLeft.value = container.scrollLeft
    wheelScrollExpectedTop.value = container.scrollTop
    scrollRevision.value += 1
    emitViewChanged(false)
    stopSmoothWheelScroll()
    return
  }

  const controllerStep = Math.min(0.45, Math.max(0.24, 1 / Math.sqrt(scrollControllerVelocityNeededPerPixel)))
  if (!doneLeft) container.scrollLeft += deltaLeft * controllerStep
  if (!doneTop) container.scrollTop += deltaTop * controllerStep
  wheelScrollExpectedLeft.value = container.scrollLeft
  wheelScrollExpectedTop.value = container.scrollTop
  scrollRevision.value += 1
  updateScrollBarVisibility()
  emitViewChanged(true)
  wheelScrollAnimationFrame.value = requestAnimationFrame(runSmoothWheelScroll)
}

function stopSmoothWheelScroll() {
  if (wheelScrollAnimationFrame.value !== undefined) {
    cancelAnimationFrame(wheelScrollAnimationFrame.value)
    wheelScrollAnimationFrame.value = undefined
  }
  if (scrollViewerRef.value) {
    wheelScrollTargetLeft.value = scrollViewerRef.value.scrollLeft
    wheelScrollTargetTop.value = scrollViewerRef.value.scrollTop
  }
  wheelScrollExpectedLeft.value = null
  wheelScrollExpectedTop.value = null
  isWheelScrolling.value = false
}

function cancelPendingAnimatedScrollForDirectInput() {
  cancelLineScroll(false)
  cancelScrollVelocity()
  stopSmoothWheelScroll()
}

function stopSmoothWheelScrollIfExternalScroll() {
  const container = scrollViewerRef.value
  if (!container || wheelScrollAnimationFrame.value === undefined) return

  const expectedLeft = wheelScrollExpectedLeft.value
  const expectedTop = wheelScrollExpectedTop.value
  if (expectedLeft === null || expectedTop === null) {
    stopSmoothWheelScroll()
    return
  }

  const isExpectedSmoothScroll =
    Math.abs(container.scrollLeft - expectedLeft) < 0.75 &&
    Math.abs(container.scrollTop - expectedTop) < 0.75

  if (!isExpectedSmoothScroll) {
    stopSmoothWheelScroll()
  }
}

// Touch/Pinch handling
function handleTouchStart(event: TouchEvent) {
  cancelPendingAnimatedScrollForDirectInput()

  if (effectiveZoomMode.value === 'Disabled' || event.touches.length !== 2) return
  beginDirectManipulation()

  const touch1 = event.touches[0]
  const touch2 = event.touches[1]

  touchStartDistance.value = Math.hypot(
    touch2.clientX - touch1.clientX,
    touch2.clientY - touch1.clientY
  )
  touchStartZoom.value = currentZoomFactor.value
}

function handleTouchMove(event: TouchEvent) {
  if (effectiveZoomMode.value === 'Disabled' || event.touches.length !== 2) return

  const touch1 = event.touches[0]
  const touch2 = event.touches[1]

  const currentDistance = Math.hypot(
    touch2.clientX - touch1.clientX,
    touch2.clientY - touch1.clientY
  )

  const scale = currentDistance / touchStartDistance.value
  zoomToFactor(touchStartZoom.value * scale)

  isZooming.value = true
}

function handleTouchEnd() {
  if (isZooming.value) {
    isZooming.value = false
    emitViewChanged(false)
    completeDirectManipulation()
  }
}

// Public methods (exposed for programmatic control)
function zoomToFactor(factor: number) {
  const clampedFactor = Math.max(effectiveMinZoomFactor.value, Math.min(effectiveMaxZoomFactor.value, factor))
  currentZoomFactor.value = clampedFactor
  overflowRevision.value += 1
  scrollRevision.value += 1

  emitViewChanged(true)
}

function ChangeView(
  horizontalOffset?: number | null,
  verticalOffset?: number | null,
  zoomFactor?: number | null
) {
  if (!scrollViewerRef.value) return false
  cancelPendingAnimatedScrollForDirectInput()

  setOffsets(horizontalOffset, verticalOffset)

  if (zoomFactor !== null && zoomFactor !== undefined) {
    zoomToFactor(zoomFactor)
  }

  emitViewChanged(false)
  return true
}

function setOffsets(
  horizontalOffset?: number | null,
  verticalOffset?: number | null
) {
  if (!scrollViewerRef.value) return

  if (horizontalOffset !== null && horizontalOffset !== undefined) {
    scrollViewerRef.value.scrollLeft = horizontalOffset
  }

  if (verticalOffset !== null && verticalOffset !== undefined) {
    scrollViewerRef.value.scrollTop = verticalOffset
  }
  scrollRevision.value += 1
}

function cancelScrollVelocity() {
  if (velocityAnimationFrame.value !== undefined) {
    cancelAnimationFrame(velocityAnimationFrame.value)
    velocityAnimationFrame.value = undefined
  }
  velocityExpectedLeft.value = null
  velocityExpectedTop.value = null
}

function stopScrollVelocityIfExternalScroll() {
  const container = scrollViewerRef.value
  if (!container || velocityAnimationFrame.value === undefined) return

  const expectedLeft = velocityExpectedLeft.value
  const expectedTop = velocityExpectedTop.value
  if (expectedLeft === null || expectedTop === null) {
    cancelScrollVelocity()
    return
  }

  const isExpectedVelocityScroll =
    Math.abs(container.scrollLeft - expectedLeft) < 0.75 &&
    Math.abs(container.scrollTop - expectedTop) < 0.75

  if (!isExpectedVelocityScroll) {
    cancelScrollVelocity()
  }
}

function ZoomTo(zoomFactor: number) {
  zoomToFactor(zoomFactor)
  return 0
}

function ZoomBy(zoomFactorDelta: number) {
  zoomToFactor(currentZoomFactor.value + zoomFactorDelta)
  return 0
}

function ScrollTo(horizontalOffset: number, verticalOffset: number) {
  cancelPendingAnimatedScrollForDirectInput()
  setOffsets(horizontalOffset, verticalOffset)
  emitViewChanged(false)
  return 0
}

function ScrollBy(horizontalOffsetDelta: number, verticalOffsetDelta: number) {
  requestScrollByOffset(horizontalOffsetDelta, verticalOffsetDelta, true)
  return 0
}

function AddScrollVelocity(
  offsetsVelocity: { x?: number; y?: number } | [number, number],
  inertiaDecayRate = scrollControllerInertiaDecayRate
) {
  cancelPendingAnimatedScrollForDirectInput()
  let horizontalVelocity = Array.isArray(offsetsVelocity) ? offsetsVelocity[0] : offsetsVelocity.x ?? 0
  let verticalVelocity = Array.isArray(offsetsVelocity) ? offsetsVelocity[1] : offsetsVelocity.y ?? 0
  let lastTimestamp = performance.now()

  const scroll = (timestamp: number) => {
    if (!scrollViewerRef.value) return
    const elapsedSeconds = Math.min(0.05, Math.max(0, (timestamp - lastTimestamp) / 1000))
    lastTimestamp = timestamp
    const container = scrollViewerRef.value
    const maxLeft = Math.max(0, container.scrollWidth - container.clientWidth)
    const maxTop = Math.max(0, container.scrollHeight - container.clientHeight)
    const nextLeft = Math.max(0, Math.min(maxLeft, container.scrollLeft + horizontalVelocity * elapsedSeconds))
    const nextTop = Math.max(0, Math.min(maxTop, container.scrollTop + verticalVelocity * elapsedSeconds))
    const moved = Math.abs(nextLeft - container.scrollLeft) > 0.01 || Math.abs(nextTop - container.scrollTop) > 0.01

    container.scrollLeft = nextLeft
    container.scrollTop = nextTop
    velocityExpectedLeft.value = container.scrollLeft
    velocityExpectedTop.value = container.scrollTop
    scrollRevision.value += 1
    updateScrollBarVisibility()
    emitViewChanged(true)

    const decay = Math.pow(inertiaDecayRate, elapsedSeconds * 1000)
    horizontalVelocity *= decay
    verticalVelocity *= decay

    if (!moved || (Math.abs(horizontalVelocity) < 0.5 && Math.abs(verticalVelocity) < 0.5)) {
      velocityAnimationFrame.value = undefined
      velocityExpectedLeft.value = null
      velocityExpectedTop.value = null
      emitViewChanged(false)
      return
    }

    velocityAnimationFrame.value = requestAnimationFrame(scroll)
  }

  velocityAnimationFrame.value = requestAnimationFrame(scroll)
  return 0
}

// Custom scrollbar dragging
function startVerticalDrag(event: PointerEvent) {
  cancelPendingAnimatedScrollForDirectInput()
  markNonMouseScrollBarPointer(event)
  triggerScrollBarHapticFeedback(event)
  expandScrollBarNow('vertical')
  isDraggingVertical.value = true
  activeVerticalDragPointerId.value = event.pointerId
  ;(event.currentTarget as HTMLElement | null)?.setPointerCapture?.(event.pointerId)
  dragStartY.value = event.clientY
  dragStartScrollTop.value = scrollViewerRef.value?.scrollTop || 0

  document.addEventListener('pointermove', handleVerticalDrag)
  document.addEventListener('pointerup', stopVerticalDrag)
  document.addEventListener('pointercancel', stopVerticalDrag)
  event.preventDefault()
}

function handleVerticalDrag(event: PointerEvent) {
  if (!isDraggingVertical.value || !scrollViewerRef.value) return
  if (activeVerticalDragPointerId.value !== null && event.pointerId !== activeVerticalDragPointerId.value) return

  const deltaY = event.clientY - dragStartY.value
  const metrics = getScrollBarMetrics('vertical')
  const minimumThumbHeight = 30
  const thumbHeight = Math.max(minimumThumbHeight, (scrollViewerRef.value.clientHeight / scrollViewerRef.value.scrollHeight) * metrics.trackLength)
  const travel = Math.max(1, metrics.trackLength - thumbHeight)
  const maxScroll = Math.max(1, scrollViewerRef.value.scrollHeight - scrollViewerRef.value.clientHeight)
  scrollViewerRef.value.scrollTop = dragStartScrollTop.value + (deltaY / travel) * maxScroll
  scrollRevision.value += 1
  event.preventDefault()
}

function stopVerticalDrag(event?: PointerEvent) {
  if (event && activeVerticalDragPointerId.value !== null && event.pointerId !== activeVerticalDragPointerId.value) return
  isDraggingVertical.value = false
  activeVerticalDragPointerId.value = null
  document.removeEventListener('pointermove', handleVerticalDrag)
  document.removeEventListener('pointerup', stopVerticalDrag)
  document.removeEventListener('pointercancel', stopVerticalDrag)
  if (!isVerticalPointerOver.value) {
    scheduleScrollBarContract('vertical')
  }
}

function startHorizontalDrag(event: PointerEvent) {
  cancelPendingAnimatedScrollForDirectInput()
  markNonMouseScrollBarPointer(event)
  triggerScrollBarHapticFeedback(event)
  expandScrollBarNow('horizontal')
  isDraggingHorizontal.value = true
  activeHorizontalDragPointerId.value = event.pointerId
  ;(event.currentTarget as HTMLElement | null)?.setPointerCapture?.(event.pointerId)
  dragStartX.value = event.clientX
  dragStartScrollLeft.value = scrollViewerRef.value?.scrollLeft || 0

  document.addEventListener('pointermove', handleHorizontalDrag)
  document.addEventListener('pointerup', stopHorizontalDrag)
  document.addEventListener('pointercancel', stopHorizontalDrag)
  event.preventDefault()
}

function handleHorizontalDrag(event: PointerEvent) {
  if (!isDraggingHorizontal.value || !scrollViewerRef.value) return
  if (activeHorizontalDragPointerId.value !== null && event.pointerId !== activeHorizontalDragPointerId.value) return

  const deltaX = event.clientX - dragStartX.value
  const metrics = getScrollBarMetrics('horizontal')
  const minimumThumbWidth = 30
  const thumbWidth = Math.max(minimumThumbWidth, (scrollViewerRef.value.clientWidth / scrollViewerRef.value.scrollWidth) * metrics.trackLength)
  const travel = Math.max(1, metrics.trackLength - thumbWidth)
  const maxScroll = Math.max(1, scrollViewerRef.value.scrollWidth - scrollViewerRef.value.clientWidth)
  scrollViewerRef.value.scrollLeft = dragStartScrollLeft.value + (deltaX / travel) * maxScroll
  scrollRevision.value += 1
  event.preventDefault()
}

function stopHorizontalDrag(event?: PointerEvent) {
  if (event && activeHorizontalDragPointerId.value !== null && event.pointerId !== activeHorizontalDragPointerId.value) return
  isDraggingHorizontal.value = false
  activeHorizontalDragPointerId.value = null
  document.removeEventListener('pointermove', handleHorizontalDrag)
  document.removeEventListener('pointerup', stopHorizontalDrag)
  document.removeEventListener('pointercancel', stopHorizontalDrag)
  if (!isHorizontalPointerOver.value) {
    scheduleScrollBarContract('horizontal')
  }
}

// Watch for external zoomFactor changes
watch(effectiveZoomFactor, (newValue) => {
  currentZoomFactor.value = newValue
})

// Expose methods for parent components
defineExpose({
  zoomToFactor,
  ChangeView,
  ZoomTo,
  ZoomBy,
  ZoomToFactor: ZoomTo,
  ZoomFactor: computed(() => currentZoomFactor.value),
  HorizontalOffset: computed(() => scrollViewerRef.value?.scrollLeft || 0),
  VerticalOffset: computed(() => scrollViewerRef.value?.scrollTop || 0),
  ViewportWidth: computed(() => scrollViewerRef.value?.clientWidth || 0),
  ViewportHeight: computed(() => scrollViewerRef.value?.clientHeight || 0),
  ExtentWidth: computed(() => scrollViewerRef.value?.scrollWidth || 0),
  ExtentHeight: computed(() => scrollViewerRef.value?.scrollHeight || 0),
  ScrollableWidth: computed(() => Math.max(0, (scrollViewerRef.value?.scrollWidth || 0) - (scrollViewerRef.value?.clientWidth || 0))),
  ScrollableHeight: computed(() => Math.max(0, (scrollViewerRef.value?.scrollHeight || 0) - (scrollViewerRef.value?.clientHeight || 0))),
  ComputedHorizontalScrollBarVisibility: computed(() => hasHorizontalScrollBar.value ? 'Visible' : 'Collapsed'),
  ComputedVerticalScrollBarVisibility: computed(() => hasVerticalScrollBar.value ? 'Visible' : 'Collapsed'),
  ScrollTo,
  ScrollBy,
  AddScrollVelocity,
  CancelScrollVelocity: cancelScrollVelocity,
  scrollViewerRef,
  scrollTop: computed(() => scrollViewerRef.value?.scrollTop || 0),
  scrollLeft: computed(() => scrollViewerRef.value?.scrollLeft || 0),
  scrollHeight: computed(() => scrollViewerRef.value?.scrollHeight || 0),
  scrollWidth: computed(() => scrollViewerRef.value?.scrollWidth || 0),
  clientHeight: computed(() => scrollViewerRef.value?.clientHeight || 0),
  clientWidth: computed(() => scrollViewerRef.value?.clientWidth || 0)
})

// Lifecycle
onMounted(() => {
  void nextTick(() => {
    updateScrollBarVisibility()
    if (scrollViewerRef.value) {
      emitViewChanged(false)
    }
    resizeObserver = new ResizeObserver(() => {
      overflowRevision.value += 1
      scrollRevision.value += 1
      updateScrollBarVisibility()
    })
    if (rootRef.value) resizeObserver.observe(rootRef.value)
    if (scrollViewerRef.value) resizeObserver.observe(scrollViewerRef.value)
    if (contentRef.value) resizeObserver.observe(contentRef.value)
  })
})

onBeforeUnmount(() => {
  if (scrollTimer.value) {
    clearTimeout(scrollTimer.value)
  }
  if (verticalHoverExpandTimer.value) clearTimeout(verticalHoverExpandTimer.value)
  if (horizontalHoverExpandTimer.value) clearTimeout(horizontalHoverExpandTimer.value)
  if (verticalContractTimer.value) clearTimeout(verticalContractTimer.value)
  if (horizontalContractTimer.value) clearTimeout(horizontalContractTimer.value)
  if (verticalContractAnimationTimer.value) clearTimeout(verticalContractAnimationTimer.value)
  if (horizontalContractAnimationTimer.value) clearTimeout(horizontalContractAnimationTimer.value)
  cancelLineScroll(false)
  stopSmoothWheelScroll()
  resizeObserver?.disconnect()
  cancelScrollVelocity()

  document.removeEventListener('pointermove', handleVerticalDrag)
  document.removeEventListener('pointerup', stopVerticalDrag)
  document.removeEventListener('pointercancel', stopVerticalDrag)
  document.removeEventListener('pointermove', handleHorizontalDrag)
  document.removeEventListener('pointerup', stopHorizontalDrag)
  document.removeEventListener('pointercancel', stopHorizontalDrag)
})
</script>

<style scoped>
.win-scroll-viewer {
  position: relative;
  display: block;
  box-sizing: border-box;
  background: transparent;
  border-radius: 0;
  min-width: 0;
  min-height: 0;
}

.win-scroll-viewer-viewport {
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
  scrollbar-width: none;
  -ms-overflow-style: none;
  contain: layout style paint;
  will-change: scroll-position;
}

.win-scroll-viewer-viewport:focus-visible {
  outline: 2px solid var(--accent-base);
  outline-offset: -2px;
}

.scroll-content {
  width: 100%;
  min-width: 0;
  min-height: max-content;
  transition: transform 0.1s ease-out;
  will-change: transform;
}

.scrollbar {
  position: absolute;
  opacity: 1;
  background: transparent;
  transition: opacity 83ms linear;
  pointer-events: auto;
  z-index: 1;
  min-width: 0;
  min-height: 0;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
}

.scrollbar.visible {
  opacity: 1;
  pointer-events: auto;
}

.scrollbar-vertical {
  top: 0;
  right: 0;
  bottom: 0;
  width: 12px;
  height: auto;
}

.scrollbar-horizontal {
  left: 0;
  right: 0;
  bottom: 0;
  width: auto;
  height: 12px;
}

.scrollbar-corner {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 12px;
  height: 12px;
  opacity: 0;
  background: var(--ScrollViewerScrollBarSeparatorBackground, var(--ControlFillColorTransparentBrush, transparent));
  transition: opacity 83ms linear;
}

.win-scroll-viewer.scrollbar-corner-visible .scrollbar-corner {
  opacity: 1;
}

.scrollbar-track {
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0;
  isolation: isolate;
  background: transparent;
  background-image: none;
  border: 0 solid var(--ScrollBarTrackStroke, transparent);
  border-radius: 6px;
  -webkit-backdrop-filter: var(--flyout-backdrop, blur(30px));
  backdrop-filter: var(--flyout-backdrop, blur(30px));
  transition: opacity 83ms linear;
}

.scrollbar-track::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  border-radius: inherit;
  background: var(--ScrollBarTrackFill, color-mix(in srgb, var(--flyout-bg, Canvas) 78%, transparent));
}

.scrollbar-vertical.has-cross-scrollbar .scrollbar-track {
  bottom: 12px;
}

.scrollbar-horizontal.has-cross-scrollbar .scrollbar-track {
  right: 12px;
}

.scrollbar.expanded .scrollbar-track {
  opacity: 1;
  transition-delay: 400ms;
}

.scrollbar.contracting .scrollbar-track {
  opacity: 0;
  transition-delay: 500ms;
}

.scrollbar-thumb {
  position: absolute;
  z-index: 1;
  box-sizing: border-box;
  background: transparent;
  border: 0;
  border-radius: 3px;
  cursor: pointer;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  transition:
    width 167ms cubic-bezier(0, 0, 0, 1),
    height 167ms cubic-bezier(0, 0, 0, 1),
    right 167ms cubic-bezier(0, 0, 0, 1),
    bottom 167ms cubic-bezier(0, 0, 0, 1),
    transform 167ms cubic-bezier(0, 0, 0, 1),
    background 83ms linear;
  transition-delay: 0ms, 0ms, 0ms, 0ms, 0ms, 0ms;
}

.scrollbar.dragging .scrollbar-thumb,
.scrollbar.line-scrolling .scrollbar-thumb {
  transition: none;
}

.scrollbar-thumb::before {
  content: "";
  position: absolute;
  inset: 3px;
  border-radius: 999px;
  background: var(--ScrollBarThumbBackground, var(--ControlStrongFillColorDefaultBrush, var(--ctrl-strong-fill, rgba(0, 0, 0, 0.45))));
  transition: background-color 83ms linear;
}

.scrollbar-vertical .scrollbar-thumb {
  right: 0;
  width: 8px;
  min-height: 30px;
  border-radius: 3px;
}

.scrollbar-horizontal .scrollbar-thumb {
  left: 0;
  bottom: 0;
  height: 8px;
  min-width: 30px;
  border-radius: 3px;
}

.scrollbar-vertical.expanded .scrollbar-thumb {
  right: 0;
  width: 12px;
  min-height: 30px;
  border-radius: 3px;
  transition-delay: 400ms, 400ms, 400ms, 400ms, 400ms, 0ms;
}

.scrollbar-horizontal.expanded .scrollbar-thumb {
  bottom: 0;
  height: 12px;
  min-width: 30px;
  border-radius: 3px;
  transition-delay: 400ms, 400ms, 400ms, 400ms, 400ms, 0ms;
}

.scrollbar-vertical.contracting .scrollbar-thumb {
  right: 0;
  width: 8px;
  min-height: 30px;
  border-radius: 3px;
  transition-delay: 500ms, 500ms, 500ms, 500ms, 500ms, 0ms;
}

.scrollbar-horizontal.contracting .scrollbar-thumb {
  bottom: 0;
  height: 8px;
  min-width: 30px;
  border-radius: 3px;
  transition-delay: 500ms, 500ms, 500ms, 500ms, 500ms, 0ms;
}

.scrollbar-thumb:hover::before {
  background-color: var(--ScrollBarThumbFillPointerOver, var(--ControlStrongFillColorDefaultBrush, var(--ctrl-strong-fill)));
}

.scrollbar-thumb:active::before {
  background-color: var(--ScrollBarThumbFillPressed, var(--ControlStrongFillColorDefaultBrush, var(--ctrl-strong-fill)));
}

.scrollbar-button {
  position: absolute;
  z-index: 2;
  border: 0;
  padding: 0;
  width: 12px;
  height: 12px;
  min-width: 12px;
  min-height: 12px;
  display: grid;
  place-items: center;
  opacity: 0;
  color: var(--ScrollBarButtonArrowForeground, var(--ControlStrongFillColorDefaultBrush, var(--ctrl-strong-fill)));
  background: var(--ScrollBarButtonBackground, transparent);
  font-size: 8px;
  line-height: 1;
  pointer-events: none;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  transition: opacity 83ms linear 500ms, color 83ms linear;
}

.scrollbar.expanded .scrollbar-button {
  opacity: 1;
  pointer-events: auto;
  transition-delay: 400ms, 0ms;
}

.scrollbar.contracting .scrollbar-button {
  opacity: 0;
  pointer-events: none;
  transition-delay: 500ms, 0ms;
}

.scrollbar-button.decrease {
  top: 0;
  left: 0;
}

.scrollbar-button.increase {
  right: 0;
  bottom: 0;
}

.scrollbar-vertical.has-cross-scrollbar .scrollbar-button.increase {
  bottom: 12px;
}

.scrollbar-horizontal.has-cross-scrollbar .scrollbar-button.increase {
  right: 12px;
}

.scrollbar-vertical .scrollbar-button.decrease {
  padding-top: 4px;
}

.scrollbar-vertical .scrollbar-button.increase {
  padding-bottom: 4px;
}

.scrollbar-horizontal .scrollbar-button.decrease {
  padding-left: 4px;
}

.scrollbar-horizontal .scrollbar-button.increase {
  padding-right: 4px;
}

.scrollbar-button:hover {
  color: var(--ScrollBarButtonArrowForegroundPointerOver, var(--text-secondary));
}

.scrollbar-button:active {
  color: var(--ScrollBarButtonArrowForegroundPressed, var(--text-secondary));
  transform: scale(0.875);
}

@media (hover: none) and (pointer: coarse), (any-pointer: coarse) {
  .scrollbar-button {
    pointer-events: auto;
  }
}

/* Visual States */
.win-scroll-viewer.scrolling .scroll-content {
  /* Smooth scrolling indicator */
}

.win-scroll-viewer.zooming .scroll-content {
  transition: transform 0.05s ease-out;
}

/* Zoom mode disabled - prevent any zoom gestures */
.zoom-mode-disabled {
  touch-action: pan-x pan-y;
}

.zoom-mode-enabled {
  touch-action: none; /* Enable pinch-zoom */
}

/* Hide native scrollbars when using custom ones */
.win-scroll-viewer::-webkit-scrollbar {
  display: none;
}

.win-scroll-viewer-viewport::-webkit-scrollbar {
  display: none;
}

@media (prefers-reduced-motion: reduce) {
  .scroll-content,
  .scrollbar,
  .scrollbar-track,
  .scrollbar-button,
  .scrollbar-thumb {
    transition: none;
  }
}
</style>
