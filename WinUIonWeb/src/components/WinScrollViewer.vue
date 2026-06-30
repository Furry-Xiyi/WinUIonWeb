<template>
  <div
    ref="scrollViewerRef"
    class="win-scroll-viewer"
    :class="[
      `zoom-mode-${zoomMode.toLowerCase()}`,
      { 'scrolling': isScrolling, 'zooming': isZooming }
    ]"
    :style="scrollViewerStyle"
    :tabindex="isTabStop ? 0 : -1"
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

    <!-- Custom Scrollbars -->
    <div
      v-if="computedVerticalScrollBarVisibility !== 'hidden'"
      class="scrollbar scrollbar-vertical"
      :class="{ 'visible': showVerticalScrollBar }"
    >
      <div
        class="scrollbar-thumb"
        :style="verticalThumbStyle"
        @mousedown="startVerticalDrag"
      ></div>
    </div>

    <div
      v-if="computedHorizontalScrollBarVisibility !== 'hidden'"
      class="scrollbar scrollbar-horizontal"
      :class="{ 'visible': showHorizontalScrollBar }"
    >
      <div
        class="scrollbar-thumb"
        :style="horizontalThumbStyle"
        @mousedown="startHorizontalDrag"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

// Enums
type ZoomMode = 'Disabled' | 'Enabled'
type ScrollMode = 'Disabled' | 'Enabled' | 'Auto'
type ScrollBarVisibility = 'Disabled' | 'Auto' | 'Hidden' | 'Visible'
type HorizontalAlignment = 'Left' | 'Center' | 'Right' | 'Stretch'
type VerticalAlignment = 'Top' | 'Center' | 'Bottom' | 'Stretch'

// Props - 100% aligned with official WinUI API
interface Props {
  zoomMode?: ZoomMode
  minZoomFactor?: number
  maxZoomFactor?: number
  zoomFactor?: number
  horizontalScrollMode?: ScrollMode
  verticalScrollMode?: ScrollMode
  horizontalScrollBarVisibility?: ScrollBarVisibility
  verticalScrollBarVisibility?: ScrollBarVisibility
  isVerticalScrollChainingEnabled?: boolean
  isHorizontalScrollChainingEnabled?: boolean
  isTabStop?: boolean
  width?: number | string
  height?: number | string
  horizontalAlignment?: HorizontalAlignment
  verticalAlignment?: VerticalAlignment
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
const scrollViewerRef = ref<HTMLDivElement>()
const contentRef = ref<HTMLDivElement>()
const currentZoomFactor = ref(props.zoomFactor)
const isScrolling = ref(false)
const isZooming = ref(false)
const showVerticalScrollBar = ref(false)
const showHorizontalScrollBar = ref(false)

// Touch/Gesture state
const touchStartDistance = ref(0)
const touchStartZoom = ref(1)
const lastScrollTime = ref(0)
const scrollTimer = ref<number>()

// Drag state for custom scrollbars
const isDraggingVertical = ref(false)
const isDraggingHorizontal = ref(false)
const dragStartY = ref(0)
const dragStartX = ref(0)
const dragStartScrollTop = ref(0)
const dragStartScrollLeft = ref(0)

// Computed styles
const scrollViewerStyle = computed(() => {
  const styles: Record<string, string> = {}

  if (!isNaN(props.width as number)) {
    styles.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  if (!isNaN(props.height as number)) {
    styles.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }

  // Alignment
  if (props.horizontalAlignment !== 'Stretch') {
    styles.justifySelf = props.horizontalAlignment.toLowerCase()
  }
  if (props.verticalAlignment !== 'Stretch') {
    styles.alignSelf = props.verticalAlignment.toLowerCase()
  }

  // Overflow based on ScrollMode
  const overflowX = getOverflowValue(props.horizontalScrollMode, props.horizontalScrollBarVisibility)
  const overflowY = getOverflowValue(props.verticalScrollMode, props.verticalScrollBarVisibility)

  styles.overflowX = overflowX
  styles.overflowY = overflowY

  return styles
})

const contentStyle = computed(() => {
  const styles: Record<string, string> = {}

  if (props.zoomMode === 'Enabled') {
    const zoom = Math.max(props.minZoomFactor, Math.min(props.maxZoomFactor, currentZoomFactor.value))
    styles.transform = `scale(${zoom})`
    styles.transformOrigin = 'top left'
  }

  return styles
})

const computedVerticalScrollBarVisibility = computed(() => {
  if (props.verticalScrollBarVisibility === 'Disabled') return 'hidden'
  if (props.verticalScrollBarVisibility === 'Hidden') return 'hidden'
  if (props.verticalScrollBarVisibility === 'Visible') return 'visible'

  // Auto mode - show only when content overflows
  if (!scrollViewerRef.value) return 'hidden'
  return scrollViewerRef.value.scrollHeight > scrollViewerRef.value.clientHeight ? 'auto' : 'hidden'
})

const computedHorizontalScrollBarVisibility = computed(() => {
  if (props.horizontalScrollBarVisibility === 'Disabled') return 'hidden'
  if (props.horizontalScrollBarVisibility === 'Hidden') return 'hidden'
  if (props.horizontalScrollBarVisibility === 'Visible') return 'visible'

  // Auto mode
  if (!scrollViewerRef.value) return 'hidden'
  return scrollViewerRef.value.scrollWidth > scrollViewerRef.value.clientWidth ? 'auto' : 'hidden'
})

const verticalThumbStyle = computed(() => {
  if (!scrollViewerRef.value) return {}

  const container = scrollViewerRef.value
  const thumbHeight = (container.clientHeight / container.scrollHeight) * container.clientHeight
  const thumbTop = (container.scrollTop / container.scrollHeight) * container.clientHeight

  return {
    height: `${thumbHeight}px`,
    transform: `translateY(${thumbTop}px)`
  }
})

const horizontalThumbStyle = computed(() => {
  if (!scrollViewerRef.value) return {}

  const container = scrollViewerRef.value
  const thumbWidth = (container.clientWidth / container.scrollWidth) * container.clientWidth
  const thumbLeft = (container.scrollLeft / container.scrollWidth) * container.clientWidth

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

// Scroll handling
function handleScroll(event: Event) {
  const now = Date.now()
  const isIntermediate = now - lastScrollTime.value < 100
  lastScrollTime.value = now

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

  showVerticalScrollBar.value =
    computedVerticalScrollBarVisibility.value !== 'hidden' &&
    (isScrolling.value || computedVerticalScrollBarVisibility.value === 'visible')

  showHorizontalScrollBar.value =
    computedHorizontalScrollBarVisibility.value !== 'hidden' &&
    (isScrolling.value || computedHorizontalScrollBarVisibility.value === 'visible')
}

// Zoom handling (wheel/pinch)
function handleWheel(event: WheelEvent) {
  if (props.zoomMode === 'Disabled') return

  // Ctrl+Wheel for zoom (standard browser behavior)
  if (event.ctrlKey) {
    const delta = -event.deltaY
    const zoomDelta = delta > 0 ? 1.1 : 0.9
    zoomToFactor(currentZoomFactor.value * zoomDelta)
  }

  // Handle scroll chaining
  if (!props.isVerticalScrollChainingEnabled && scrollViewerRef.value) {
    const atTop = scrollViewerRef.value.scrollTop === 0
    const atBottom = scrollViewerRef.value.scrollTop + scrollViewerRef.value.clientHeight >= scrollViewerRef.value.scrollHeight

    if ((event.deltaY < 0 && atTop) || (event.deltaY > 0 && atBottom)) {
      event.preventDefault()
    }
  }

  if (!props.isHorizontalScrollChainingEnabled && scrollViewerRef.value) {
    const atLeft = scrollViewerRef.value.scrollLeft === 0
    const atRight = scrollViewerRef.value.scrollLeft + scrollViewerRef.value.clientWidth >= scrollViewerRef.value.scrollWidth

    if ((event.deltaX < 0 && atLeft) || (event.deltaX > 0 && atRight)) {
      event.preventDefault()
    }
  }
}

// Touch/Pinch handling
function handleTouchStart(event: TouchEvent) {
  if (props.zoomMode === 'Disabled' || event.touches.length !== 2) return

  const touch1 = event.touches[0]
  const touch2 = event.touches[1]

  touchStartDistance.value = Math.hypot(
    touch2.clientX - touch1.clientX,
    touch2.clientY - touch1.clientY
  )
  touchStartZoom.value = currentZoomFactor.value
}

function handleTouchMove(event: TouchEvent) {
  if (props.zoomMode === 'Disabled' || event.touches.length !== 2) return

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
  if (props.zoomMode === 'Disabled') return

  const clampedFactor = Math.max(props.minZoomFactor, Math.min(props.maxZoomFactor, factor))
  currentZoomFactor.value = clampedFactor

  emitViewChanged(true)
}

function changeView(
  horizontalOffset?: number | null,
  verticalOffset?: number | null,
  zoomFactor?: number | null
) {
  if (!scrollViewerRef.value) return

  if (horizontalOffset !== null && horizontalOffset !== undefined) {
    scrollViewerRef.value.scrollLeft = horizontalOffset
  }

  if (verticalOffset !== null && verticalOffset !== undefined) {
    scrollViewerRef.value.scrollTop = verticalOffset
  }

  if (zoomFactor !== null && zoomFactor !== undefined) {
    zoomToFactor(zoomFactor)
  }

  emitViewChanged(false)
}

// Custom scrollbar dragging
function startVerticalDrag(event: MouseEvent) {
  isDraggingVertical.value = true
  dragStartY.value = event.clientY
  dragStartScrollTop.value = scrollViewerRef.value?.scrollTop || 0

  document.addEventListener('mousemove', handleVerticalDrag)
  document.addEventListener('mouseup', stopVerticalDrag)
  event.preventDefault()
}

function handleVerticalDrag(event: MouseEvent) {
  if (!isDraggingVertical.value || !scrollViewerRef.value) return

  const deltaY = event.clientY - dragStartY.value
  const scrollRatio = scrollViewerRef.value.scrollHeight / scrollViewerRef.value.clientHeight
  scrollViewerRef.value.scrollTop = dragStartScrollTop.value + (deltaY * scrollRatio)
}

function stopVerticalDrag() {
  isDraggingVertical.value = false
  document.removeEventListener('mousemove', handleVerticalDrag)
  document.removeEventListener('mouseup', stopVerticalDrag)
}

function startHorizontalDrag(event: MouseEvent) {
  isDraggingHorizontal.value = true
  dragStartX.value = event.clientX
  dragStartScrollLeft.value = scrollViewerRef.value?.scrollLeft || 0

  document.addEventListener('mousemove', handleHorizontalDrag)
  document.addEventListener('mouseup', stopHorizontalDrag)
  event.preventDefault()
}

function handleHorizontalDrag(event: MouseEvent) {
  if (!isDraggingHorizontal.value || !scrollViewerRef.value) return

  const deltaX = event.clientX - dragStartX.value
  const scrollRatio = scrollViewerRef.value.scrollWidth / scrollViewerRef.value.clientWidth
  scrollViewerRef.value.scrollLeft = dragStartScrollLeft.value + (deltaX * scrollRatio)
}

function stopHorizontalDrag() {
  isDraggingHorizontal.value = false
  document.removeEventListener('mousemove', handleHorizontalDrag)
  document.removeEventListener('mouseup', stopHorizontalDrag)
}

// Watch for external zoomFactor changes
watch(() => props.zoomFactor, (newValue) => {
  currentZoomFactor.value = newValue
})

// Expose methods for parent components
defineExpose({
  zoomToFactor,
  changeView,
  scrollTop: computed(() => scrollViewerRef.value?.scrollTop || 0),
  scrollLeft: computed(() => scrollViewerRef.value?.scrollLeft || 0),
  scrollHeight: computed(() => scrollViewerRef.value?.scrollHeight || 0),
  scrollWidth: computed(() => scrollViewerRef.value?.scrollWidth || 0)
})

// Lifecycle
onMounted(() => {
  updateScrollBarVisibility()

  // Initial state
  if (scrollViewerRef.value) {
    emitViewChanged(false)
  }
})

onBeforeUnmount(() => {
  if (scrollTimer.value) {
    clearTimeout(scrollTimer.value)
  }

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
  background: var(--control-fill-color-default, transparent);
  border-radius: var(--control-corner-radius, 4px);
}

.win-scroll-viewer:focus-visible {
  outline: 2px solid var(--accent-fill-color-default, #0078d4);
  outline-offset: -2px;
}

.scroll-content {
  min-width: min-content;
  min-height: min-content;
  transition: transform 0.1s ease-out;
  will-change: transform;
}

/* Custom Scrollbars */
.scrollbar {
  position: absolute;
  background: var(--subtle-fill-color-secondary, rgba(0, 0, 0, 0.05));
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.scrollbar.visible {
  opacity: 1;
  pointer-events: auto;
}

.win-scroll-viewer:hover .scrollbar,
.win-scroll-viewer.scrolling .scrollbar,
.win-scroll-viewer.zooming .scrollbar {
  opacity: 1;
  pointer-events: auto;
}

.scrollbar-vertical {
  top: 0;
  right: 0;
  width: 12px;
  height: 100%;
}

.scrollbar-horizontal {
  left: 0;
  bottom: 0;
  width: 100%;
  height: 12px;
}

.scrollbar-thumb {
  position: absolute;
  background: var(--control-strong-fill-color-default, rgba(0, 0, 0, 0.4));
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.1s ease;
}

.scrollbar-vertical .scrollbar-thumb {
  left: 2px;
  right: 2px;
  min-height: 30px;
}

.scrollbar-horizontal .scrollbar-thumb {
  top: 2px;
  bottom: 2px;
  min-width: 30px;
}

.scrollbar-thumb:hover {
  background: var(--control-strong-fill-color-secondary, rgba(0, 0, 0, 0.5));
}

.scrollbar-thumb:active {
  background: var(--control-strong-fill-color-tertiary, rgba(0, 0, 0, 0.6));
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

.win-scroll-viewer {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Performance optimizations */
.win-scroll-viewer {
  will-change: scroll-position;
  contain: layout style paint;
}

@media (prefers-reduced-motion: reduce) {
  .scroll-content,
  .scrollbar,
  .scrollbar-thumb {
    transition: none;
  }
}
</style>
