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
      @wheel.passive="handleWheel"
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
      class="scrollbar scrollbar-vertical"
      :class="{ 'visible': showVerticalScrollBar, 'expanded': isVerticalExpanded, 'contracting': isVerticalContracting }"
      @pointerenter="handleScrollBarPointerEnter('vertical', $event)"
      @pointerleave="handleScrollBarPointerLeave('vertical')"
    >
      <button class="scrollbar-button decrease icon" type="button" aria-hidden="true" tabindex="-1" @pointerdown.prevent="startLineScroll('vertical', -1, $event)"></button>
      <div class="scrollbar-track"></div>
      <div
        class="scrollbar-thumb"
        :style="verticalThumbStyle"
        @mousedown="startVerticalDrag"
      ></div>
      <button class="scrollbar-button increase icon" type="button" aria-hidden="true" tabindex="-1" @pointerdown.prevent="startLineScroll('vertical', 1, $event)"></button>
    </div>

    <div
      v-if="hasHorizontalScrollBar"
      class="scrollbar scrollbar-horizontal"
      :class="{ 'visible': showHorizontalScrollBar, 'expanded': isHorizontalExpanded, 'contracting': isHorizontalContracting }"
      @pointerenter="handleScrollBarPointerEnter('horizontal', $event)"
      @pointerleave="handleScrollBarPointerLeave('horizontal')"
    >
      <button class="scrollbar-button decrease icon" type="button" aria-hidden="true" tabindex="-1" @pointerdown.prevent="startLineScroll('horizontal', -1, $event)"></button>
      <div class="scrollbar-track"></div>
      <div
        class="scrollbar-thumb"
        :style="horizontalThumbStyle"
        @mousedown="startHorizontalDrag"
      ></div>
      <button class="scrollbar-button increase icon" type="button" aria-hidden="true" tabindex="-1" @pointerdown.prevent="startLineScroll('horizontal', 1, $event)"></button>
    </div>
    <div v-if="hasVerticalScrollBar && hasHorizontalScrollBar" class="scrollbar-corner"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

// Enums
type ZoomMode = 'Disabled' | 'Enabled'
type ScrollMode = 'Disabled' | 'Enabled' | 'Auto'
type ScrollBarVisibility = 'Disabled' | 'Auto' | 'Hidden' | 'Visible'
type ContentOrientation = 'None' | 'Horizontal' | 'Vertical' | 'Both'
type HorizontalAlignment = 'Left' | 'Center' | 'Right' | 'Stretch'
type VerticalAlignment = 'Top' | 'Center' | 'Bottom' | 'Stretch'

// Props - 100% aligned with official WinUI API
interface Props {
  zoomMode?: ZoomMode
  ZoomMode?: ZoomMode
  minZoomFactor?: number
  MinZoomFactor?: number
  maxZoomFactor?: number
  MaxZoomFactor?: number
  zoomFactor?: number
  ZoomFactor?: number
  horizontalScrollMode?: ScrollMode
  HorizontalScrollMode?: ScrollMode
  verticalScrollMode?: ScrollMode
  VerticalScrollMode?: ScrollMode
  horizontalScrollBarVisibility?: ScrollBarVisibility
  HorizontalScrollBarVisibility?: ScrollBarVisibility
  verticalScrollBarVisibility?: ScrollBarVisibility
  VerticalScrollBarVisibility?: ScrollBarVisibility
  contentOrientation?: ContentOrientation
  ContentOrientation?: ContentOrientation
  isVerticalScrollChainingEnabled?: boolean
  IsVerticalScrollChainingEnabled?: boolean
  isHorizontalScrollChainingEnabled?: boolean
  IsHorizontalScrollChainingEnabled?: boolean
  isTabStop?: boolean
  IsTabStop?: boolean
  width?: number | string
  Width?: number | string
  height?: number | string
  Height?: number | string
  horizontalAlignment?: HorizontalAlignment
  HorizontalAlignment?: HorizontalAlignment
  verticalAlignment?: VerticalAlignment
  VerticalAlignment?: VerticalAlignment
}

const props = withDefaults(defineProps<Props>(), {
  zoomMode: 'Disabled',
  minZoomFactor: 0.1,
  maxZoomFactor: 10.0,
  zoomFactor: 1.0,
  horizontalScrollMode: 'Auto',
  verticalScrollMode: 'Auto',
  horizontalScrollBarVisibility: 'Auto',
  verticalScrollBarVisibility: 'Auto',
  isVerticalScrollChainingEnabled: true,
  isHorizontalScrollChainingEnabled: true,
  isTabStop: false,
  width: NaN,
  height: NaN,
  horizontalAlignment: 'Stretch',
  verticalAlignment: 'Stretch'
})

// Events - 100% aligned with official WinUI API
interface ViewChangedEventArgs {
  isIntermediate: boolean
  horizontalOffset: number
  verticalOffset: number
  zoomFactor: number
}

const emit = defineEmits<{
  viewChanged: [args: ViewChangedEventArgs]
  manipulationCompleted: [void]
}>()

// Refs
const rootRef = ref<HTMLDivElement>()
const scrollViewerRef = ref<HTMLDivElement>()
const contentRef = ref<HTMLDivElement>()
const currentZoomFactor = ref(props.ZoomFactor ?? props.zoomFactor)
const isScrolling = ref(false)
const isZooming = ref(false)
const showVerticalScrollBar = ref(false)
const showHorizontalScrollBar = ref(false)
const isVerticalExpanded = ref(false)
const isHorizontalExpanded = ref(false)
const isVerticalContracting = ref(false)
const isHorizontalContracting = ref(false)
const velocityAnimationFrame = ref<number>()

// Touch/Gesture state
const touchStartDistance = ref(0)
const touchStartZoom = ref(1)
const lastScrollTime = ref(0)
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
const activeLineScroll = ref<{ orientation: 'vertical' | 'horizontal', direction: number, lastTime: number } | null>(null)
const lineScrollAnimationFrame = ref<number>()
const dragStartY = ref(0)
const dragStartX = ref(0)
const dragStartScrollTop = ref(0)
const dragStartScrollLeft = ref(0)
const overflowRevision = ref(0)
const scrollRevision = ref(0)
let resizeObserver: ResizeObserver | undefined

const effectiveZoomMode = computed<ZoomMode>(() => props.ZoomMode ?? props.zoomMode ?? 'Disabled')
const effectiveMinZoomFactor = computed(() => props.MinZoomFactor ?? props.minZoomFactor ?? 0.1)
const effectiveMaxZoomFactor = computed(() => props.MaxZoomFactor ?? props.maxZoomFactor ?? 10)
const effectiveZoomFactor = computed(() => props.ZoomFactor ?? props.zoomFactor ?? 1)
const effectiveHorizontalScrollMode = computed<ScrollMode>(() => props.HorizontalScrollMode ?? props.horizontalScrollMode ?? 'Auto')
const effectiveVerticalScrollMode = computed<ScrollMode>(() => props.VerticalScrollMode ?? props.verticalScrollMode ?? 'Auto')
const effectiveHorizontalScrollBarVisibility = computed<ScrollBarVisibility>(() => props.HorizontalScrollBarVisibility ?? props.horizontalScrollBarVisibility ?? 'Auto')
const effectiveVerticalScrollBarVisibility = computed<ScrollBarVisibility>(() => props.VerticalScrollBarVisibility ?? props.verticalScrollBarVisibility ?? 'Auto')
const effectiveContentOrientation = computed<ContentOrientation>(() => props.ContentOrientation ?? props.contentOrientation ?? 'Vertical')
const effectiveIsVerticalScrollChainingEnabled = computed(() => props.IsVerticalScrollChainingEnabled ?? props.isVerticalScrollChainingEnabled ?? true)
const effectiveIsHorizontalScrollChainingEnabled = computed(() => props.IsHorizontalScrollChainingEnabled ?? props.isHorizontalScrollChainingEnabled ?? true)
const effectiveIsTabStop = computed(() => props.IsTabStop ?? props.isTabStop ?? false)
const effectiveWidth = computed(() => props.Width ?? props.width)
const effectiveHeight = computed(() => props.Height ?? props.height)
const effectiveHorizontalAlignment = computed<HorizontalAlignment>(() => props.HorizontalAlignment ?? props.horizontalAlignment ?? 'Stretch')
const effectiveVerticalAlignment = computed<VerticalAlignment>(() => props.VerticalAlignment ?? props.verticalAlignment ?? 'Stretch')

const hasCssSize = (value: number | string | undefined) => (
  value !== undefined &&
  value !== null &&
  value !== '' &&
  !(typeof value === 'number' && Number.isNaN(value))
)

const cssSize = (value: number | string | undefined) => (
  typeof value === 'number' ? `${value}px` : value
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

  // Alignment
  if (effectiveHorizontalAlignment.value !== 'Stretch') {
    styles.justifySelf = effectiveHorizontalAlignment.value.toLowerCase()
  }
  if (effectiveVerticalAlignment.value !== 'Stretch') {
    styles.alignSelf = effectiveVerticalAlignment.value.toLowerCase()
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

  if (effectiveZoomMode.value === 'Enabled') {
    const zoom = Math.max(effectiveMinZoomFactor.value, Math.min(effectiveMaxZoomFactor.value, currentZoomFactor.value))
    styles.transform = `scale(${zoom})`
    styles.transformOrigin = 'top left'
  }

  if (effectiveContentOrientation.value === 'Horizontal') {
    styles.display = 'inline-flex'
  } else if (effectiveContentOrientation.value === 'Both' || effectiveContentOrientation.value === 'None') {
    styles.display = 'inline-block'
  }

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
function getOverflowValue(scrollMode: ScrollMode, visibility: ScrollBarVisibility): string {
  if (scrollMode === 'Disabled' || visibility === 'Disabled') return 'hidden'
  if (visibility === 'Hidden') return 'scroll'
  if (visibility === 'Visible') return 'scroll'
  return 'auto' // Auto or default
}

function emitViewChanged(isIntermediate: boolean) {
  if (!scrollViewerRef.value) return

  emit('viewChanged', {
    isIntermediate,
    horizontalOffset: scrollViewerRef.value.scrollLeft,
    verticalOffset: scrollViewerRef.value.scrollTop,
    zoomFactor: currentZoomFactor.value
  })
}

function getScrollBarMetrics(orientation: 'vertical' | 'horizontal') {
  const container = scrollViewerRef.value
  if (!container) return { trackStart: 0, trackLength: 0 }

  const isVertical = orientation === 'vertical'
  const crossBarVisible = isVertical ? hasHorizontalScrollBar.value : hasVerticalScrollBar.value
  const extent = isVertical ? container.clientHeight : container.clientWidth
  const overlapAvoidance = crossBarVisible ? 12 : 0
  const buttonReserve = 12
  const trackStart = buttonReserve
  const trackEndReserve = buttonReserve + overlapAvoidance
  const trackLength = Math.max(30, extent - trackStart - trackEndReserve)

  return { trackStart, trackLength }
}

// Scroll handling
function handleScroll(event: Event) {
  const now = Date.now()
  const isIntermediate = now - lastScrollTime.value < 100
  lastScrollTime.value = now
  scrollRevision.value += 1

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
    emit('manipulationCompleted')
  }, 150)

  // Update scrollbar visibility
  updateScrollBarVisibility()
}

function updateScrollBarVisibility() {
  if (!scrollViewerRef.value) return

  showVerticalScrollBar.value = hasVerticalScrollBar.value
  showHorizontalScrollBar.value = hasHorizontalScrollBar.value
}

function handleScrollBarPointerEnter(orientation: 'vertical' | 'horizontal', event: PointerEvent) {
  if (event.pointerType !== 'mouse') return
  if (orientation === 'vertical') {
    isVerticalPointerOver.value = true
    if (verticalHoverExpandTimer.value) clearTimeout(verticalHoverExpandTimer.value)
    if (verticalContractTimer.value) clearTimeout(verticalContractTimer.value)
    if (verticalContractAnimationTimer.value) clearTimeout(verticalContractAnimationTimer.value)
    isVerticalContracting.value = false
    showVerticalScrollBar.value = hasVerticalScrollBar.value
    verticalHoverExpandTimer.value = window.setTimeout(() => {
      isVerticalContracting.value = false
      isVerticalExpanded.value = hasVerticalScrollBar.value
      scrollRevision.value += 1
      updateScrollBarVisibility()
    }, 400)
  } else {
    isHorizontalPointerOver.value = true
    if (horizontalHoverExpandTimer.value) clearTimeout(horizontalHoverExpandTimer.value)
    if (horizontalContractTimer.value) clearTimeout(horizontalContractTimer.value)
    if (horizontalContractAnimationTimer.value) clearTimeout(horizontalContractAnimationTimer.value)
    isHorizontalContracting.value = false
    showHorizontalScrollBar.value = hasHorizontalScrollBar.value
    horizontalHoverExpandTimer.value = window.setTimeout(() => {
      isHorizontalContracting.value = false
      isHorizontalExpanded.value = hasHorizontalScrollBar.value
      scrollRevision.value += 1
      updateScrollBarVisibility()
    }, 400)
  }
}

function handleScrollBarPointerLeave(orientation: 'vertical' | 'horizontal') {
  if (orientation === 'vertical') {
    isVerticalPointerOver.value = false
    if (verticalHoverExpandTimer.value) clearTimeout(verticalHoverExpandTimer.value)
    if (!isDraggingVertical.value && activeLineScroll.value?.orientation !== 'vertical') {
      scheduleScrollBarContract('vertical')
    }
    return
  }

  isHorizontalPointerOver.value = false
  if (horizontalHoverExpandTimer.value) clearTimeout(horizontalHoverExpandTimer.value)
  if (!isDraggingHorizontal.value && activeLineScroll.value?.orientation !== 'horizontal') {
    scheduleScrollBarContract('horizontal')
  }
}

function scheduleScrollBarContract(orientation: 'vertical' | 'horizontal') {
  const timer = orientation === 'vertical' ? verticalContractTimer : horizontalContractTimer
  if (timer.value) clearTimeout(timer.value)

  timer.value = window.setTimeout(() => {
    if (orientation === 'vertical') {
      if (isVerticalPointerOver.value || isDraggingVertical.value || activeLineScroll.value?.orientation === 'vertical') return
      if (!isVerticalExpanded.value) return
      if (verticalContractAnimationTimer.value) clearTimeout(verticalContractAnimationTimer.value)
      verticalContractAnimationTimer.value = window.setTimeout(() => {
        if (isVerticalPointerOver.value || isDraggingVertical.value || activeLineScroll.value?.orientation === 'vertical') return
        isVerticalContracting.value = true
        isVerticalExpanded.value = false
        scrollRevision.value += 1
        verticalContractAnimationTimer.value = window.setTimeout(() => {
          isVerticalContracting.value = false
          scrollRevision.value += 1
        }, 167)
      }, 500)
    } else {
      if (isHorizontalPointerOver.value || isDraggingHorizontal.value || activeLineScroll.value?.orientation === 'horizontal') return
      if (!isHorizontalExpanded.value) return
      if (horizontalContractAnimationTimer.value) clearTimeout(horizontalContractAnimationTimer.value)
      horizontalContractAnimationTimer.value = window.setTimeout(() => {
        if (isHorizontalPointerOver.value || isDraggingHorizontal.value || activeLineScroll.value?.orientation === 'horizontal') return
        isHorizontalContracting.value = true
        isHorizontalExpanded.value = false
        scrollRevision.value += 1
        horizontalContractAnimationTimer.value = window.setTimeout(() => {
          isHorizontalContracting.value = false
          scrollRevision.value += 1
        }, 167)
      }, 500)
    }
    scrollRevision.value += 1
    updateScrollBarVisibility()
  }, 2000)
}

function scrollLine(orientation: 'vertical' | 'horizontal', direction: number, distance = 16) {
  if (!scrollViewerRef.value) return
  const delta = distance * direction
  if (orientation === 'vertical') {
    scrollViewerRef.value.scrollTop += delta
  } else {
    scrollViewerRef.value.scrollLeft += delta
  }
  scrollRevision.value += 1
  updateScrollBarVisibility()
}

function startLineScroll(orientation: 'vertical' | 'horizontal', direction: number, event: PointerEvent) {
  if (!scrollViewerRef.value) return
  if (orientation === 'vertical') {
    if (verticalContractTimer.value) clearTimeout(verticalContractTimer.value)
    if (verticalContractAnimationTimer.value) clearTimeout(verticalContractAnimationTimer.value)
    isVerticalContracting.value = false
    isVerticalExpanded.value = true
  } else {
    if (horizontalContractTimer.value) clearTimeout(horizontalContractTimer.value)
    if (horizontalContractAnimationTimer.value) clearTimeout(horizontalContractAnimationTimer.value)
    isHorizontalContracting.value = false
    isHorizontalExpanded.value = true
  }

  ;(event.currentTarget as HTMLElement | null)?.setPointerCapture?.(event.pointerId)
  stopLineScroll()
  scrollLine(orientation, direction)
  activeLineScroll.value = { orientation, direction, lastTime: performance.now() }
  document.addEventListener('pointerup', stopLineScroll)
  document.addEventListener('pointercancel', stopLineScroll)
  lineScrollAnimationFrame.value = requestAnimationFrame(runLineScroll)
}

function runLineScroll(now: number) {
  const active = activeLineScroll.value
  if (!active) return

  const elapsed = Math.min(50, now - active.lastTime)
  active.lastTime = now
  scrollLine(active.orientation, active.direction, 320 * elapsed / 1000)
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
  if (effectiveZoomMode.value === 'Disabled') return

  // Ctrl+Wheel for zoom (standard browser behavior)
  if (event.ctrlKey) {
    const delta = -event.deltaY
    const zoomDelta = delta > 0 ? 1.1 : 0.9
    zoomToFactor(currentZoomFactor.value * zoomDelta)
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

// Touch/Pinch handling
function handleTouchStart(event: TouchEvent) {
  if (effectiveZoomMode.value === 'Disabled' || event.touches.length !== 2) return

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
    emit('manipulationCompleted')
  }
}

// Public methods (exposed for programmatic control)
function zoomToFactor(factor: number) {
  if (effectiveZoomMode.value === 'Disabled') return

  const clampedFactor = Math.max(effectiveMinZoomFactor.value, Math.min(effectiveMaxZoomFactor.value, factor))
  currentZoomFactor.value = clampedFactor
  overflowRevision.value += 1
  scrollRevision.value += 1

  emitViewChanged(true)
}

function changeView(
  horizontalOffset?: number | null,
  verticalOffset?: number | null,
  zoomFactor?: number | null
) {
  if (!scrollViewerRef.value) return

  setOffsets(horizontalOffset, verticalOffset)

  if (zoomFactor !== null && zoomFactor !== undefined) {
    zoomToFactor(zoomFactor)
  }

  emitViewChanged(false)
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
}

function ZoomTo(zoomFactor: number) {
  zoomToFactor(zoomFactor)
  return 0
}

function ScrollTo(horizontalOffset: number, verticalOffset: number) {
  cancelScrollVelocity()
  setOffsets(horizontalOffset, verticalOffset)
  emitViewChanged(false)
  return 0
}

function AddScrollVelocity(offsetsVelocity: { x?: number; y?: number } | [number, number]) {
  cancelScrollVelocity()
  const horizontalVelocity = Array.isArray(offsetsVelocity) ? offsetsVelocity[0] : offsetsVelocity.x ?? 0
  const verticalVelocity = Array.isArray(offsetsVelocity) ? offsetsVelocity[1] : offsetsVelocity.y ?? 0

  const scroll = () => {
    if (!scrollViewerRef.value) return
    scrollViewerRef.value.scrollLeft += horizontalVelocity / 60
    scrollViewerRef.value.scrollTop += verticalVelocity / 60
    scrollRevision.value += 1
    velocityAnimationFrame.value = requestAnimationFrame(scroll)
  }

  velocityAnimationFrame.value = requestAnimationFrame(scroll)
  return 0
}

// Custom scrollbar dragging
function startVerticalDrag(event: MouseEvent) {
  isDraggingVertical.value = true
  if (verticalContractTimer.value) clearTimeout(verticalContractTimer.value)
  isVerticalExpanded.value = true
  dragStartY.value = event.clientY
  dragStartScrollTop.value = scrollViewerRef.value?.scrollTop || 0

  document.addEventListener('mousemove', handleVerticalDrag)
  document.addEventListener('mouseup', stopVerticalDrag)
  event.preventDefault()
}

function handleVerticalDrag(event: MouseEvent) {
  if (!isDraggingVertical.value || !scrollViewerRef.value) return

  const deltaY = event.clientY - dragStartY.value
  const metrics = getScrollBarMetrics('vertical')
  const minimumThumbHeight = 30
  const thumbHeight = Math.max(minimumThumbHeight, (scrollViewerRef.value.clientHeight / scrollViewerRef.value.scrollHeight) * metrics.trackLength)
  const travel = Math.max(1, metrics.trackLength - thumbHeight)
  const maxScroll = Math.max(1, scrollViewerRef.value.scrollHeight - scrollViewerRef.value.clientHeight)
  scrollViewerRef.value.scrollTop = dragStartScrollTop.value + (deltaY / travel) * maxScroll
  scrollRevision.value += 1
}

function stopVerticalDrag() {
  isDraggingVertical.value = false
  document.removeEventListener('mousemove', handleVerticalDrag)
  document.removeEventListener('mouseup', stopVerticalDrag)
  if (!isVerticalPointerOver.value) {
    scheduleScrollBarContract('vertical')
  }
}

function startHorizontalDrag(event: MouseEvent) {
  isDraggingHorizontal.value = true
  if (horizontalContractTimer.value) clearTimeout(horizontalContractTimer.value)
  isHorizontalExpanded.value = true
  dragStartX.value = event.clientX
  dragStartScrollLeft.value = scrollViewerRef.value?.scrollLeft || 0

  document.addEventListener('mousemove', handleHorizontalDrag)
  document.addEventListener('mouseup', stopHorizontalDrag)
  event.preventDefault()
}

function handleHorizontalDrag(event: MouseEvent) {
  if (!isDraggingHorizontal.value || !scrollViewerRef.value) return

  const deltaX = event.clientX - dragStartX.value
  const metrics = getScrollBarMetrics('horizontal')
  const minimumThumbWidth = 30
  const thumbWidth = Math.max(minimumThumbWidth, (scrollViewerRef.value.clientWidth / scrollViewerRef.value.scrollWidth) * metrics.trackLength)
  const travel = Math.max(1, metrics.trackLength - thumbWidth)
  const maxScroll = Math.max(1, scrollViewerRef.value.scrollWidth - scrollViewerRef.value.clientWidth)
  scrollViewerRef.value.scrollLeft = dragStartScrollLeft.value + (deltaX / travel) * maxScroll
  scrollRevision.value += 1
}

function stopHorizontalDrag() {
  isDraggingHorizontal.value = false
  document.removeEventListener('mousemove', handleHorizontalDrag)
  document.removeEventListener('mouseup', stopHorizontalDrag)
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
  changeView,
  ZoomTo,
  ScrollTo,
  AddScrollVelocity,
  CancelScrollVelocity: cancelScrollVelocity,
  scrollViewerRef,
  scrollTop: computed(() => scrollViewerRef.value?.scrollTop || 0),
  scrollLeft: computed(() => scrollViewerRef.value?.scrollLeft || 0),
  scrollHeight: computed(() => scrollViewerRef.value?.scrollHeight || 0),
  scrollWidth: computed(() => scrollViewerRef.value?.scrollWidth || 0)
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
  resizeObserver?.disconnect()
  cancelScrollVelocity()

  document.removeEventListener('mousemove', handleVerticalDrag)
  document.removeEventListener('mouseup', stopVerticalDrag)
  document.removeEventListener('mousemove', handleHorizontalDrag)
  document.removeEventListener('mouseup', stopHorizontalDrag)
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
  outline: 2px solid var(--accent-fill-color-default, #0078d4);
  outline-offset: -2px;
}

.scroll-content {
  min-width: min-content;
  min-height: min-content;
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

.win-scroll-viewer.has-horizontal-scrollbar .scrollbar-vertical {
  bottom: 12px;
}

.win-scroll-viewer.has-vertical-scrollbar .scrollbar-horizontal {
  right: 12px;
}

.scrollbar-corner {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 12px;
  height: 12px;
  opacity: 0;
  background: var(--ScrollViewerScrollBarSeparatorBackground, var(--ControlFillColorTransparentBrush, transparent));
  transition: opacity 100ms linear 400ms;
}

.win-scroll-viewer.scrollbar-corner-visible .scrollbar-corner {
  opacity: 1;
}

.scrollbar-track {
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0;
  background: var(--ScrollBarTrackFill, var(--AcrylicInAppFillColorDefaultBrush, rgba(252, 252, 252, 0.78)));
  border: 0 solid var(--ScrollBarTrackStroke, transparent);
  border-radius: 6px;
  transition: opacity 83ms linear;
}

.scrollbar.expanded .scrollbar-track {
  opacity: 1;
  transition-delay: 400ms;
}

.scrollbar.contracting .scrollbar-track {
  opacity: 0;
  transition-delay: 0ms;
}

.scrollbar-thumb {
  position: absolute;
  z-index: 1;
  background: var(--ScrollBarThumbBackground, var(--ControlStrongFillColorDefaultBrush, var(--ctrl-strong-fill, rgba(0, 0, 0, 0.45))));
  border: 0 solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition:
    width 167ms cubic-bezier(0, 0, 0, 1),
    height 167ms cubic-bezier(0, 0, 0, 1),
    right 167ms cubic-bezier(0, 0, 0, 1),
    bottom 167ms cubic-bezier(0, 0, 0, 1),
    background 83ms linear;
}

.scrollbar-vertical .scrollbar-thumb {
  right: 2px;
  width: 8px;
  min-height: 30px;
  border: 3px solid transparent;
  background-clip: padding-box;
  border-radius: 4px;
}

.scrollbar-horizontal .scrollbar-thumb {
  left: 0;
  bottom: 2px;
  height: 8px;
  min-width: 30px;
  border: 3px solid transparent;
  background-clip: padding-box;
  border-radius: 4px;
}

.scrollbar-vertical.expanded .scrollbar-thumb {
  right: 0;
  width: 12px;
  min-height: 30px;
  border: 3px solid transparent;
  border-radius: 6px;
}

.scrollbar-horizontal.expanded .scrollbar-thumb {
  bottom: 0;
  height: 12px;
  min-width: 30px;
  border: 3px solid transparent;
  border-radius: 6px;
}

.scrollbar-vertical.contracting .scrollbar-thumb {
  right: 2px;
  width: 8px;
  min-height: 30px;
}

.scrollbar-horizontal.contracting .scrollbar-thumb {
  bottom: 2px;
  height: 8px;
  min-width: 30px;
}

.scrollbar-thumb:hover {
  background-color: var(--ScrollBarThumbFillPointerOver, var(--ControlStrongFillColorDefaultBrush, var(--ctrl-strong-fill)));
}

.scrollbar-thumb:active {
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
  font-family: 'WinUIOnWebIcons', 'Segoe Fluent Icons', 'Segoe MDL2 Assets', sans-serif;
  font-size: 8px;
  line-height: 1;
  pointer-events: none;
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
  transition-delay: 0ms, 0ms;
}

.scrollbar-button.decrease {
  top: 0;
  left: 0;
}

.scrollbar-button.increase {
  right: 0;
  bottom: 0;
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
