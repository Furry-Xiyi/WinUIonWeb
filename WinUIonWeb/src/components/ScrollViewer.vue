<template>
  <div
    ref="rootRef"
    class="win-scroll-viewer"
    :class="[
      `zoom-mode-${effectiveZoomMode.toLowerCase()}`,
      {
        'is-disabled': !effectiveIsEnabled,
        'scrolling': isScrolling,
        'zooming': isZooming,
        'has-vertical-scrollbar': hasVerticalScrollBar,
        'has-horizontal-scrollbar': hasHorizontalScrollBar
      }
    ]"
    :style="scrollViewerStyle"
    v-acrylic-brush="backgroundStyle"
    @pointerenter="handleViewerPointerEnter"
    @pointermove="handleViewerPointerMove"
    @pointerleave="handleViewerPointerLeave"
  >
    <div
      ref="scrollViewerRef"
      class="win-scroll-viewer-viewport"
      :style="viewportStyle"
      :tabindex="effectiveIsTabStop ? 0 : -1"
      :aria-disabled="!effectiveIsEnabled || undefined"
      @scroll="handleScroll"
      @wheel="handleWheel"
      @keydown="handleKeyDown"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @touchcancel="handleTouchEnd"
    >
      <div
        ref="contentRef"
        class="scroll-content"
        :style="contentStyle"
      >
        <ContentOutlet />
      </div>
    </div>

    <div v-if="hasVerticalScrollBar" class="viewer-scrollbar-host viewer-scrollbar-host-vertical" :class="{ 'has-cross-scrollbar': hasHorizontalScrollBar }">
      <ScrollBar Orientation="Vertical" SmallChange="16" LargeChange="{x:Bind ScrollBars.Vertical.ViewportSize, Mode=OneWay}" Minimum="0" Maximum="{x:Bind ScrollBars.Vertical.Maximum, Mode=OneWay}" ViewportSize="{x:Bind ScrollBars.Vertical.ViewportSize, Mode=OneWay}" Value="{x:Bind ScrollBars.Vertical.Value, Mode=OneWay}" IndicatorMode="{x:Bind ScrollBars.IndicatorMode, Mode=OneWay}" IsEnabled="{x:Bind ScrollBars.IsEnabled, Mode=OneWay}" Scroll="VerticalScrollBar_Scroll" />
    </div>
    <div v-if="hasHorizontalScrollBar" class="viewer-scrollbar-host viewer-scrollbar-host-horizontal" :class="{ 'has-cross-scrollbar': hasVerticalScrollBar }">
      <ScrollBar Orientation="Horizontal" SmallChange="16" LargeChange="{x:Bind ScrollBars.Horizontal.ViewportSize, Mode=OneWay}" Minimum="0" Maximum="{x:Bind ScrollBars.Horizontal.Maximum, Mode=OneWay}" ViewportSize="{x:Bind ScrollBars.Horizontal.ViewportSize, Mode=OneWay}" Value="{x:Bind ScrollBars.Horizontal.Value, Mode=OneWay}" IndicatorMode="{x:Bind ScrollBars.IndicatorMode, Mode=OneWay}" IsEnabled="{x:Bind ScrollBars.IsEnabled, Mode=OneWay}" Scroll="HorizontalScrollBar_Scroll" />
    </div>
    <div v-if="hasVerticalScrollBar && hasHorizontalScrollBar" class="scrollbar-corner"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export const ScrollViewerTemplate = defineComponent({
  name: 'ScrollViewer.Template',
  __scrollViewerTemplate: true,
  setup() { return () => null }
})
export default { Template: ScrollViewerTemplate }
</script>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick, defineComponent, Fragment, getCurrentInstance, h, inject, provide, useAttrs, useSlots, type CSSProperties, type VNode } from 'vue'
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, xamlScopeKey } from './xamlRuntime'
import { boolValue, cssLength, xamlThickness } from './layout'
import ScrollBar from './ScrollBar.vue'
import { scrollBarOwnerKey, type ScrollBarScrollEventArgs } from './scrollBarOwner'
import { uiSettings } from './uiSettings'
import { useAcrylicBrushStyle } from './AcrylicBrush'
import { vAcrylicBrush } from './acrylicBrushVisual'

// Enums
type ScrollViewerZoomMode = 'Disabled' | 'Enabled'
type ScrollViewerScrollMode = 'Disabled' | 'Enabled' | 'Auto'
type ScrollViewerScrollBarVisibility = 'Disabled' | 'Auto' | 'Hidden' | 'Visible'
type ScrollViewerHorizontalAlignment = 'Left' | 'Center' | 'Right' | 'Stretch'
type ScrollViewerVerticalAlignment = 'Top' | 'Center' | 'Bottom' | 'Stretch'

// Dependency properties from the WinUI ScrollViewer default template.
interface Props {
  Template?: string
  ZoomMode?: ScrollViewerZoomMode | string
  MinZoomFactor?: number | string
  MaxZoomFactor?: number | string
  HorizontalScrollMode?: ScrollViewerScrollMode | string
  VerticalScrollMode?: ScrollViewerScrollMode | string
  HorizontalScrollBarVisibility?: ScrollViewerScrollBarVisibility | string
  VerticalScrollBarVisibility?: ScrollViewerScrollBarVisibility | string
  IsVerticalScrollChainingEnabled?: boolean | string
  IsHorizontalScrollChainingEnabled?: boolean | string
  IsTabStop?: boolean | string
  IsEnabled?: boolean | string
  IsHorizontalRailEnabled?: boolean | string
  IsVerticalRailEnabled?: boolean | string
  IsDeferredScrollingEnabled?: boolean | string
  Width?: number | string
  Height?: number | string
  MinWidth?: number | string
  MaxWidth?: number | string
  MinHeight?: number | string
  MaxHeight?: number | string
  Margin?: string
  Padding?: string
  Background?: string | object
  BorderBrush?: string
  BorderThickness?: number | string
  CornerRadius?: number | string
  HorizontalContentAlignment?: ScrollViewerHorizontalAlignment | string
  VerticalContentAlignment?: ScrollViewerVerticalAlignment | string
  HorizontalAlignment?: ScrollViewerHorizontalAlignment | string
  VerticalAlignment?: ScrollViewerVerticalAlignment | string
}

const props = withDefaults(defineProps<Props>(), {
  ZoomMode: 'Disabled',
  MinZoomFactor: 0.1,
  MaxZoomFactor: 10.0,
  // WinUI's ScrollViewer defaults differ per axis: HorizontalScrollBarVisibility
  // keeps its Disabled dependency-property default while the default style sets
  // VerticalScrollBarVisibility to Visible (generic.xaml, `Style
  // TargetType="ScrollViewer"`).  Matching that pair is what makes a sample which
  // asks only for vertical scrolling leave the horizontal axis disabled, giving
  // its content a finite width to be measured against.
  HorizontalScrollMode: 'Auto',
  VerticalScrollMode: 'Auto',
  HorizontalScrollBarVisibility: 'Disabled',
  VerticalScrollBarVisibility: 'Visible',
  IsVerticalScrollChainingEnabled: true,
  IsHorizontalScrollChainingEnabled: true,
  IsTabStop: false,
  IsEnabled: true,
  IsHorizontalRailEnabled: true,
  IsVerticalRailEnabled: true,
  IsDeferredScrollingEnabled: false,
  HorizontalContentAlignment: 'Left',
  VerticalContentAlignment: 'Top',
  Padding: '0',
  BorderThickness: 0,
  BorderBrush: 'Transparent',
  Background: 'Transparent',
  CornerRadius: 0,
  Width: NaN,
  Height: NaN,
  HorizontalAlignment: 'Stretch',
  VerticalAlignment: 'Stretch'
})

// Official ScrollViewer events carry their sender and event arguments.
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

type ScrollViewerEventArgs = {
  ViewChanged: ViewChangedEventArgs
  ViewChanging: ViewChangingEventArgs
  DirectManipulationStarted: Record<string, never>
  DirectManipulationCompleted: Record<string, never>
  Loaded: Record<string, unknown>
}
const emit = defineEmits<{
  ViewChanged: [sender: Record<string, unknown>, args: ViewChangedEventArgs]
  ViewChanging: [sender: Record<string, unknown>, args: ViewChangingEventArgs]
  DirectManipulationStarted: [sender: Record<string, unknown>, args: Record<string, never>]
  DirectManipulationCompleted: [sender: Record<string, unknown>, args: Record<string, never>]
  Loaded: [sender: Record<string, unknown>, args: Record<string, unknown>]
}>()

const instance = getCurrentInstance()
const attrs = useAttrs()
const slots = useSlots()
function dispatch<K extends keyof ScrollViewerEventArgs>(name: K, args: ScrollViewerEventArgs[K]) {
  const dispatchEmit = emit as (name: K, sender: Record<string, unknown>, args: ScrollViewerEventArgs[K]) => void
  dispatchEmit(name, controlSender, args)
  // XAML event attributes also work when the ScrollViewer is composed directly
  // in another control. Normalized on<Event> listeners already receive emit.
  if (!instance?.vnode.props?.[`on${name}`]) resolveXamlHandler(attrs[name], instance)?.(controlSender, args)
}
const resolve = (value: unknown) => resolveXamlValue(value, instance)
const propertyNodes = computed(() => {
  const content: VNode[] = []
  let hasTemplate = false
  const collect = (nodes: VNode[]) => {
    for (const node of nodes) {
      if (node.type === Fragment && Array.isArray(node.children)) collect(node.children as VNode[])
      else if ((node.type as { __scrollViewerTemplate?: boolean; name?: string })?.__scrollViewerTemplate || (node.type as { name?: string })?.name === 'ScrollViewer.Template') hasTemplate = true
      else content.push(node)
    }
  }
  collect(slots.default?.() ?? [])
  return { content: normalizeXamlNodes(content, instance), hasTemplate }
})
const ContentOutlet = defineComponent({ setup: () => () => h(Fragment, propertyNodes.value.content) })
const inheritedScrollScope = inject<Record<string, unknown>>(xamlScopeKey, {})
const ScrollBars = computed(() => {
  scrollRevision.value; overflowRevision.value
  const port = scrollViewerRef.value
  return {
    Vertical: { Maximum: Math.max(0, (port?.scrollHeight ?? 0) - (port?.clientHeight ?? 0)), ViewportSize: port?.clientHeight ?? 0, Value: port?.scrollTop ?? 0 },
    Horizontal: { Maximum: Math.max(0, (port?.scrollWidth ?? 0) - (port?.clientWidth ?? 0)), ViewportSize: port?.clientWidth ?? 0, Value: port?.scrollLeft ?? 0 },
    IndicatorMode: indicatorMode.value === 'touch' ? 'TouchIndicator' : uiSettings.AutoHideScrollBars ? indicatorMode.value === 'mouse' ? 'MouseIndicator' : 'None' : 'MouseIndicator',
    IsEnabled: effectiveIsEnabled.value
  }
})
const scrollBarChanged = (axis: 'Vertical' | 'Horizontal', args: ScrollBarScrollEventArgs) => {
  const port = scrollViewerRef.value
  if (!port) return
  if (effectiveIsDeferredScrollingEnabled.value && args.ScrollEventType === 'ThumbTrack') {
    if (axis === 'Vertical') deferredVerticalOffset.value = args.NewValue
    else deferredHorizontalOffset.value = args.NewValue
    return
  }
  if (axis === 'Vertical') port.scrollTop = args.NewValue
  else port.scrollLeft = args.NewValue
  if (args.ScrollEventType === 'EndScroll') {
    deferredVerticalOffset.value = deferredHorizontalOffset.value = null
    finishViewChange()
  }
  scrollRevision.value += 1
}
const VerticalScrollBar_Scroll = (_sender: unknown, args: ScrollBarScrollEventArgs) => scrollBarChanged('Vertical', args)
const HorizontalScrollBar_Scroll = (_sender: unknown, args: ScrollBarScrollEventArgs) => scrollBarChanged('Horizontal', args)
provide(xamlScopeKey, { ...inheritedScrollScope, ScrollBars, VerticalScrollBar_Scroll, HorizontalScrollBar_Scroll })
provide(scrollBarOwnerKey, {
  autoHide: () => uiSettings.AutoHideScrollBars,
  onHover: (axis, over) => {
    if (axis === 'Vertical') isVerticalPointerOver.value = over; else isHorizontalPointerOver.value = over
    if (!over) scheduleIndicatorHide()
  },
  onPointerActivity: type => { lastIndicatorType = type === 'touch' ? 'touch' : 'mouse'; showIndicators(lastIndicatorType) },
  onInteraction: (axis, active) => {
    if (axis === 'Vertical') isDraggingVertical.value = active; else isDraggingHorizontal.value = active
    if (active) { cancelPendingAnimatedScrollForDirectInput(); beginDirectManipulation() }
    else { finishViewChange(); scheduleIndicatorHide() }
  }
})

// Refs
const rootRef = ref<HTMLDivElement>()
const scrollViewerRef = ref<HTMLDivElement>()
const contentRef = ref<HTMLDivElement>()
const currentZoomFactor = ref(1)
const isScrolling = ref(false)
const isZooming = ref(false)
const isWheelScrolling = ref(false)
const isDirectManipulationActive = ref(false)
const isRootPointerOver = ref(false)
const indicatorTimer = ref<number>()
const indicatorMode = ref<'none' | 'mouse' | 'touch'>('none')
let lastIndicatorType: 'mouse' | 'touch' = 'mouse'
const programmaticFrame = ref<number>()
let pendingViewChange = false
let lastIntermediateViewKey = ''
let lastFinalViewKey = ''
let programmaticAnimationActive = false
let programmaticGeneration = 0
let touchPoint: { x: number; y: number } | undefined
let touchZoomCenter: { x: number; y: number } | undefined

// Touch/Gesture state
const touchStartDistance = ref(0)
const touchStartZoom = ref(1)
const scrollTimer = ref<number>()
const isVerticalPointerOver = ref(false)
const isHorizontalPointerOver = ref(false)

// Drag state for custom scrollbars
const isDraggingVertical = ref(false)
const isDraggingHorizontal = ref(false)
const deferredVerticalOffset = ref<number | null>(null)
const deferredHorizontalOffset = ref<number | null>(null)
const wheelScrollAnimationFrame = ref<number>()
const wheelScrollTargetLeft = ref(0)
const wheelScrollTargetTop = ref(0)
const wheelScrollExpectedLeft = ref<number | null>(null)
const wheelScrollExpectedTop = ref<number | null>(null)
const overflowRevision = ref(0)
const scrollRevision = ref(0)
let resizeObserver: ResizeObserver | undefined
let resizeFrame: number | undefined

const scrollControllerVelocityNeededPerPixel = 7.600855902349023
const scrollControllerSmallChange = 16
const scrollControllerMinMaxEpsilon = 0.001

const effectiveZoomMode = computed<ScrollViewerZoomMode>(() => resolve(props.ZoomMode) as ScrollViewerZoomMode)
const effectiveMinZoomFactor = computed(() => Math.max(0.01, Number(resolve(props.MinZoomFactor)) || 0.1))
const effectiveMaxZoomFactor = computed(() => Math.max(effectiveMinZoomFactor.value, Number(resolve(props.MaxZoomFactor)) || 10))
const effectiveHorizontalScrollMode = computed<ScrollViewerScrollMode>(() => resolve(props.HorizontalScrollMode) as ScrollViewerScrollMode)
const effectiveVerticalScrollMode = computed<ScrollViewerScrollMode>(() => resolve(props.VerticalScrollMode) as ScrollViewerScrollMode)
const effectiveHorizontalScrollBarVisibility = computed<ScrollViewerScrollBarVisibility>(() => resolve(props.HorizontalScrollBarVisibility) as ScrollViewerScrollBarVisibility)
const effectiveVerticalScrollBarVisibility = computed<ScrollViewerScrollBarVisibility>(() => resolve(props.VerticalScrollBarVisibility) as ScrollViewerScrollBarVisibility)
const effectiveIsVerticalScrollChainingEnabled = computed(() => boolValue(resolve(props.IsVerticalScrollChainingEnabled)))
const effectiveIsHorizontalScrollChainingEnabled = computed(() => boolValue(resolve(props.IsHorizontalScrollChainingEnabled)))
const effectiveIsTabStop = computed(() => boolValue(resolve(props.IsTabStop)) && effectiveIsEnabled.value)
const effectiveIsEnabled = computed(() => boolValue(resolve(props.IsEnabled)))
const effectiveIsDeferredScrollingEnabled = computed(() => boolValue(resolve(props.IsDeferredScrollingEnabled)))
const effectiveWidth = computed(() => resolve(props.Width) as number | string)
const effectiveHeight = computed(() => resolve(props.Height) as number | string)
const effectiveHorizontalAlignment = computed<ScrollViewerHorizontalAlignment>(() => resolve(props.HorizontalAlignment) as ScrollViewerHorizontalAlignment)
const effectiveVerticalAlignment = computed<ScrollViewerVerticalAlignment>(() => resolve(props.VerticalAlignment) as ScrollViewerVerticalAlignment)
const isScrollBarlessTemplate = computed(() => propertyNodes.value.hasTemplate || props.Template?.trim() === '{StaticResource ScrollViewerScrollBarlessTemplate}')

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
const backgroundStyle = useAcrylicBrushStyle(() => props.Background ?? 'Transparent', instance)
const scrollViewerStyle = computed(() => {
  const styles: CSSProperties & Record<string, unknown> = {
    ...backgroundStyle.value,
    borderColor: String(resolve(props.BorderBrush) ?? 'transparent'),
    borderWidth: xamlThickness(resolve(props.BorderThickness)),
    borderRadius: xamlThickness(resolve(props.CornerRadius)),
    margin: xamlThickness(resolve(props.Margin))
  }

  for (const name of ['MinWidth', 'MaxWidth', 'MinHeight', 'MaxHeight'] as const) {
    const value = resolve(props[name])
    if (value !== undefined && value !== '' && value !== null) {
      const cssName = name[0].toLowerCase() + name.slice(1)
      styles[cssName] = cssLength(value)
    }
  }

  if (hasCssSize(effectiveWidth.value)) {
    styles.width = cssSize(effectiveWidth.value) ?? ''
    styles.flexGrow = '0'
    styles.flexShrink = '1'
    styles.flexBasis = 'auto'
    styles.maxWidth = styles.maxWidth || '100%'
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
  styles.alignSelf = effectiveVerticalAlignment.value === 'Stretch'
    ? 'stretch'
    : ({ Top: 'start', Center: 'center', Bottom: 'end' }[effectiveVerticalAlignment.value] ?? 'stretch')
  // WinUI's default HorizontalAlignment is Stretch, which fills the width the
  // parent offers.  A CSS `align-self: stretch` only fills the *cross* axis of a
  // flex container, so when the repeater's ScrollViewer sits in the gallery's
  // row-direction display area it would otherwise be sized from its own content
  // and collapse to zero — taking every descendant measured against it with it.
  if (effectiveHorizontalAlignment.value === 'Stretch' && styles.width === undefined) {
    styles.flexGrow = '1'
    styles.flexShrink = '1'
    styles.flexBasis = hasCssSize(effectiveHeight.value) ? 'auto' : '0%'
    styles.minWidth = '0'
  }

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
  styles.padding = xamlThickness(resolve(props.Padding))
  // A finite MaxHeight/MaxWidth constrains the ScrollPresenter itself.  Without
  // these caps a percentage-sized viewport can resolve against its content's
  // auto size and let a templated flyout grow past the official boundary.
  styles.maxWidth = styles.maxWidth || '100%'
  styles.maxHeight = styles.maxHeight || '100%'
  styles.overscrollBehaviorX = effectiveIsHorizontalScrollChainingEnabled.value ? 'auto' : 'contain'
  styles.overscrollBehaviorY = effectiveIsVerticalScrollChainingEnabled.value ? 'auto' : 'contain'
  styles.touchAction = !effectiveIsEnabled.value || effectiveZoomMode.value === 'Enabled' ? 'none' : 'pan-x pan-y'
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
  const horizontal = resolve(props.HorizontalContentAlignment)
  const vertical = resolve(props.VerticalContentAlignment)
  if (horizontal === 'Center' || horizontal === 'Right') {
    styles.display = 'flex'
    styles.justifyContent = horizontal === 'Center' ? 'center' : 'flex-end'
  }
  if (vertical === 'Center' || vertical === 'Bottom') {
    styles.display = 'flex'
    styles.alignItems = vertical === 'Center' ? 'center' : 'flex-end'
    styles.minHeight = `${(scrollViewerRef.value?.clientHeight ?? 0) / zoom}px`
  }

  return styles
})

const computedVerticalScrollBarVisibility = computed(() => {
  overflowRevision.value
  if (isScrollBarlessTemplate.value) return 'hidden'
  if (effectiveVerticalScrollBarVisibility.value === 'Disabled') return 'hidden'
  if (effectiveVerticalScrollBarVisibility.value === 'Hidden') return 'hidden'
  if (effectiveVerticalScrollBarVisibility.value === 'Visible') return 'visible'

  // Auto mode - show only when content overflows
  if (!scrollViewerRef.value) return 'hidden'
  return scrollViewerRef.value.scrollHeight > scrollViewerRef.value.clientHeight ? 'auto' : 'hidden'
})

const computedHorizontalScrollBarVisibility = computed(() => {
  overflowRevision.value
  if (isScrollBarlessTemplate.value) return 'hidden'
  if (effectiveHorizontalScrollBarVisibility.value === 'Disabled') return 'hidden'
  if (effectiveHorizontalScrollBarVisibility.value === 'Hidden') return 'hidden'
  if (effectiveHorizontalScrollBarVisibility.value === 'Visible') return 'visible'

  // Auto mode
  if (!scrollViewerRef.value) return 'hidden'
  return scrollViewerRef.value.scrollWidth > scrollViewerRef.value.clientWidth ? 'auto' : 'hidden'
})

const hasVerticalScrollBar = computed(() => computedVerticalScrollBarVisibility.value !== 'hidden')
const hasHorizontalScrollBar = computed(() => computedHorizontalScrollBarVisibility.value !== 'hidden')

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
  const viewKey = `${view.HorizontalOffset}:${view.VerticalOffset}:${view.ZoomFactor}`
  if (isIntermediate) {
    if (lastIntermediateViewKey === viewKey) return
    lastIntermediateViewKey = viewKey
    pendingViewChange = true
  } else {
    if (!pendingViewChange && lastFinalViewKey === viewKey) return
    pendingViewChange = false
    lastFinalViewKey = viewKey
    lastIntermediateViewKey = viewKey
  }

  if (isIntermediate) {
    dispatch('ViewChanging', {
      NextView: view,
      FinalView: view,
      IsInertial: false
    })
  }
  dispatch('ViewChanged', { IsIntermediate: isIntermediate })
}

function beginDirectManipulation() {
  if (scrollTimer.value !== undefined) clearTimeout(scrollTimer.value)
  scrollTimer.value = window.setTimeout(finishViewChange, 150)
  if (isDirectManipulationActive.value) return
  isDirectManipulationActive.value = true
  dispatch('DirectManipulationStarted', {})
}

function completeDirectManipulation() {
  if (!isDirectManipulationActive.value) return
  isDirectManipulationActive.value = false
  dispatch('DirectManipulationCompleted', {})
}

// Scroll handling
function handleScroll() {
  stopSmoothWheelScrollIfExternalScroll()

  scrollRevision.value += 1

  isScrolling.value = true

  // Clear previous timer
  if (scrollTimer.value) {
    clearTimeout(scrollTimer.value)
  }

  // Emit intermediate event
  emitViewChanged(true)

  // Set timer for final event
  scrollTimer.value = window.setTimeout(finishViewChange, 150)

  // Update scrollbar visibility
  showIndicators(lastIndicatorType)
}

function updateScrollBarVisibility() {
  // The shared ScrollBar resolves visibility and geometry from this revision.
  overflowRevision.value += 1
}

function scheduleIndicatorHide() {
  if (indicatorTimer.value !== undefined) clearTimeout(indicatorTimer.value)
  indicatorTimer.value = undefined
  if (!effectiveIsEnabled.value) { indicatorMode.value = 'none'; return }
  if (!uiSettings.AutoHideScrollBars) { indicatorMode.value = 'mouse'; return }
  if (isVerticalPointerOver.value || isHorizontalPointerOver.value || isDraggingVertical.value || isDraggingHorizontal.value) return
  indicatorTimer.value = window.setTimeout(() => {
    indicatorTimer.value = undefined
    if (isVerticalPointerOver.value || isHorizontalPointerOver.value || isDraggingVertical.value || isDraggingHorizontal.value || isZooming.value || touchPoint || isScrolling.value) {
      scheduleIndicatorHide()
      return
    }
    indicatorMode.value = 'none'
    updateScrollBarVisibility()
  }, indicatorMode.value === 'touch' ? 500 : 2000)
}

function showIndicators(type: 'mouse' | 'touch') {
  if (!effectiveIsEnabled.value) return
  // MouseIndicator wins while it is already visible, as in ShowIndicators.
  indicatorMode.value = type === 'mouse' || indicatorMode.value === 'mouse' ? 'mouse' : 'touch'
  updateScrollBarVisibility()
  scheduleIndicatorHide()
}

function handleViewerPointerEnter(event: PointerEvent) {
  if (event.pointerType !== 'mouse') return
  isRootPointerOver.value = true
  lastIndicatorType = 'mouse'
  showIndicators('mouse')
}

function handleViewerPointerMove(event: PointerEvent) {
  if (event.pointerType !== 'mouse' || !effectiveIsEnabled.value) return
  lastIndicatorType = 'mouse'
  showIndicators('mouse')
}

function handleViewerPointerLeave() {
  isRootPointerOver.value = false
  isVerticalPointerOver.value = false
  isHorizontalPointerOver.value = false
  scheduleIndicatorHide()
}

// Zoom handling (wheel/pinch)
function handleWheel(event: WheelEvent) {
  lastIndicatorType = 'mouse'
  if (!effectiveIsEnabled.value) {
    event.preventDefault()
    return
  }
  cancelPendingAnimatedScrollForDirectInput()

  // Ctrl+Wheel for zoom (standard browser behavior)
  if (event.ctrlKey && effectiveZoomMode.value !== 'Disabled') {
    const delta = -event.deltaY
    const zoomDelta = delta > 0 ? 1.1 : 0.9
    beginDirectManipulation()
    const bounds = scrollViewerRef.value?.getBoundingClientRect()
    setZoomFactor(currentZoomFactor.value * zoomDelta, bounds ? { x: event.clientX - bounds.left, y: event.clientY - bounds.top } : undefined)
    event.preventDefault()
    event.stopPropagation()
    return
  }
  beginDirectManipulation()

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

function requestScrollByOffset(horizontalOffsetDelta = 0, verticalOffsetDelta = 0, animated = true) {
  const container = scrollViewerRef.value
  if (!container) return false
  if (effectiveHorizontalScrollMode.value === 'Disabled' || effectiveHorizontalScrollBarVisibility.value === 'Disabled') horizontalOffsetDelta = 0
  if (effectiveVerticalScrollMode.value === 'Disabled' || effectiveVerticalScrollBarVisibility.value === 'Disabled') verticalOffsetDelta = 0

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
  programmaticGeneration += 1
  if (programmaticFrame.value !== undefined) cancelAnimationFrame(programmaticFrame.value)
  programmaticFrame.value = undefined
  programmaticAnimationActive = false
  stopSmoothWheelScroll()
  // A focused item may have requested a native smooth bring-into-view scroll.
  // Direct input takes over at its current offset, including thumb dragging.
  const container = scrollViewerRef.value
  container?.scrollTo({ left: container.scrollLeft, top: container.scrollTop, behavior: 'instant' })
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
  lastIndicatorType = 'touch'
  if (!effectiveIsEnabled.value) return
  showIndicators('touch')
  cancelPendingAnimatedScrollForDirectInput()
  beginDirectManipulation()
  if (effectiveZoomMode.value === 'Disabled') return
  if (event.touches.length === 1) {
    const touch = event.touches[0]
    touchPoint = { x: touch.clientX, y: touch.clientY }
    return
  }
  if (event.touches.length !== 2) return
  touchPoint = undefined

  const touch1 = event.touches[0]
  const touch2 = event.touches[1]

  touchStartDistance.value = Math.hypot(
    touch2.clientX - touch1.clientX,
    touch2.clientY - touch1.clientY
  )
  touchStartZoom.value = currentZoomFactor.value
  const bounds = scrollViewerRef.value?.getBoundingClientRect()
  touchZoomCenter = bounds ? { x: (touch1.clientX + touch2.clientX) / 2 - bounds.left, y: (touch1.clientY + touch2.clientY) / 2 - bounds.top } : undefined
  event.preventDefault()
}

function handleTouchMove(event: TouchEvent) {
  if (!effectiveIsEnabled.value || effectiveZoomMode.value === 'Disabled') return
  if (event.touches.length === 1 && touchPoint && scrollViewerRef.value) {
    const touch = event.touches[0]
    const deltaX = touchPoint.x - touch.clientX
    const deltaY = touchPoint.y - touch.clientY
    if (effectiveHorizontalScrollMode.value !== 'Disabled' && effectiveHorizontalScrollBarVisibility.value !== 'Disabled') scrollViewerRef.value.scrollLeft += deltaX
    if (effectiveVerticalScrollMode.value !== 'Disabled' && effectiveVerticalScrollBarVisibility.value !== 'Disabled') scrollViewerRef.value.scrollTop += deltaY
    touchPoint = { x: touch.clientX, y: touch.clientY }
    event.preventDefault()
    return
  }
  if (event.touches.length !== 2 || touchStartDistance.value <= 0) return

  const touch1 = event.touches[0]
  const touch2 = event.touches[1]

  const currentDistance = Math.hypot(
    touch2.clientX - touch1.clientX,
    touch2.clientY - touch1.clientY
  )

  const scale = currentDistance / touchStartDistance.value
  setZoomFactor(touchStartZoom.value * scale, touchZoomCenter)

  isZooming.value = true
  event.preventDefault()
}

function handleTouchEnd(event: TouchEvent) {
  if (event.touches.length === 1) {
    touchPoint = { x: event.touches[0].clientX, y: event.touches[0].clientY }
    return
  }
  touchPoint = undefined
  touchZoomCenter = undefined
  touchStartDistance.value = 0
  isZooming.value = false
  finishViewChange()
}

function handleKeyDown(event: KeyboardEvent) {
  if (!effectiveIsEnabled.value || event.target !== scrollViewerRef.value || event.altKey || event.ctrlKey || event.metaKey) return
  const container = scrollViewerRef.value
  if (!container) return
  let horizontal = 0
  let vertical = 0
  if (event.key === 'ArrowLeft') horizontal = -scrollControllerSmallChange
  else if (event.key === 'ArrowRight') horizontal = scrollControllerSmallChange
  else if (event.key === 'ArrowUp') vertical = -scrollControllerSmallChange
  else if (event.key === 'ArrowDown') vertical = scrollControllerSmallChange
  else if (event.key === 'PageUp') vertical = -container.clientHeight
  else if (event.key === 'PageDown') vertical = container.clientHeight
  else if (event.key === 'Home') vertical = -container.scrollTop
  else if (event.key === 'End') vertical = container.scrollHeight - container.clientHeight - container.scrollTop
  else return
  if (effectiveHorizontalScrollMode.value === 'Disabled' || effectiveHorizontalScrollBarVisibility.value === 'Disabled') horizontal = 0
  if (effectiveVerticalScrollMode.value === 'Disabled' || effectiveVerticalScrollBarVisibility.value === 'Disabled') vertical = 0
  if (requestScrollByOffset(horizontal, vertical)) {
    beginDirectManipulation()
    event.preventDefault()
  }
}

// Public methods (exposed for programmatic control)
function setZoomFactor(factor: number, center?: { x: number; y: number }) {
  if (!Number.isFinite(factor)) return
  const clampedFactor = Math.max(effectiveMinZoomFactor.value, Math.min(effectiveMaxZoomFactor.value, factor))
  if (Math.abs(clampedFactor - currentZoomFactor.value) < 0.0001) return
  const previousZoom = currentZoomFactor.value
  const container = scrollViewerRef.value
  const centerPoint = center ?? { x: 0, y: 0 }
  const left = container ? (container.scrollLeft + centerPoint.x) * clampedFactor / previousZoom - centerPoint.x : 0
  const top = container ? (container.scrollTop + centerPoint.y) * clampedFactor / previousZoom - centerPoint.y : 0
  currentZoomFactor.value = clampedFactor
  overflowRevision.value += 1
  scrollRevision.value += 1
  void nextTick(() => {
    if (container) {
      container.scrollLeft = Math.max(0, left)
      container.scrollTop = Math.max(0, top)
    }
    scrollRevision.value += 1
    updateScrollBarVisibility()
    emitViewChanged(true)
    if (scrollTimer.value !== undefined) clearTimeout(scrollTimer.value)
    scrollTimer.value = window.setTimeout(finishViewChange, 150)
  })
}

function finishViewChange() {
  if (programmaticAnimationActive || isDraggingHorizontal.value || isDraggingVertical.value || isZooming.value || touchPoint) return
  if (scrollTimer.value !== undefined) clearTimeout(scrollTimer.value)
  scrollTimer.value = undefined
  isScrolling.value = false
  emitViewChanged(false)
  completeDirectManipulation()
  scheduleIndicatorHide()
}

function ChangeView(
  horizontalOffset?: number | null,
  verticalOffset?: number | null,
  zoomFactor?: number | null,
  disableAnimation = false
) {
  if (!scrollViewerRef.value) return false
  if ([horizontalOffset, verticalOffset, zoomFactor].some(value => value !== undefined && value !== null && !Number.isFinite(value))) return false
  cancelPendingAnimatedScrollForDirectInput()
  const container = scrollViewerRef.value
  const targetZoom = Math.max(effectiveMinZoomFactor.value, Math.min(effectiveMaxZoomFactor.value, zoomFactor ?? currentZoomFactor.value))
  const from = { x: container.scrollLeft, y: container.scrollTop, zoom: currentZoomFactor.value }
  const target = { x: Math.max(0, horizontalOffset ?? from.x), y: Math.max(0, verticalOffset ?? from.y), zoom: targetZoom }
  const generation = programmaticGeneration
  if (disableAnimation || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    currentZoomFactor.value = target.zoom
    void nextTick(() => {
      if (generation !== programmaticGeneration) return
      setOffsets(target.x, target.y)
      overflowRevision.value += 1
      updateScrollBarVisibility()
      finishViewChange()
    })
    return true
  }
  programmaticAnimationActive = true
  const startTime = performance.now()
  const animate = (time: number) => {
    if (generation !== programmaticGeneration) return
    const progress = Math.min(1, (time - startTime) / 300)
    const eased = 1 - (1 - progress) ** 3
    currentZoomFactor.value = from.zoom + (target.zoom - from.zoom) * eased
    void nextTick(() => {
      if (!programmaticAnimationActive || generation !== programmaticGeneration) return
      setOffsets(from.x + (target.x - from.x) * eased, from.y + (target.y - from.y) * eased)
      overflowRevision.value += 1
      emitViewChanged(true)
      if (progress < 1) programmaticFrame.value = requestAnimationFrame(animate)
      else {
        programmaticAnimationActive = false
        programmaticFrame.value = undefined
        finishViewChange()
      }
    })
  }
  programmaticFrame.value = requestAnimationFrame(animate)
  return true
}

function ZoomToFactor(factor: number) { return ChangeView(null, null, factor, true) }

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

const measure = (name: 'scrollLeft' | 'scrollTop' | 'clientWidth' | 'clientHeight' | 'scrollWidth' | 'scrollHeight') => {
  scrollRevision.value
  overflowRevision.value
  return scrollViewerRef.value?.[name] ?? 0
}
const publicProperties = {
  ZoomFactor: computed(() => currentZoomFactor.value),
  MinZoomFactor: effectiveMinZoomFactor,
  MaxZoomFactor: effectiveMaxZoomFactor,
  IsDeferredScrollingEnabled: effectiveIsDeferredScrollingEnabled,
  HorizontalOffset: computed(() => measure('scrollLeft')),
  VerticalOffset: computed(() => measure('scrollTop')),
  ViewportWidth: computed(() => measure('clientWidth')),
  ViewportHeight: computed(() => measure('clientHeight')),
  ExtentWidth: computed(() => measure('scrollWidth')),
  ExtentHeight: computed(() => measure('scrollHeight')),
  ScrollableWidth: computed(() => Math.max(0, measure('scrollWidth') - measure('clientWidth'))),
  ScrollableHeight: computed(() => Math.max(0, measure('scrollHeight') - measure('clientHeight'))),
  ComputedHorizontalScrollBarVisibility: computed(() => hasHorizontalScrollBar.value ? 'Visible' : 'Collapsed'),
  ComputedVerticalScrollBarVisibility: computed(() => hasVerticalScrollBar.value ? 'Visible' : 'Collapsed')
}
const controlSender: Record<string, unknown> = { ChangeView, ZoomToFactor }
for (const [name, value] of Object.entries(publicProperties)) {
  Object.defineProperty(controlSender, name, { enumerable: true, get: () => value.value })
}
// The viewport handle is private implementation access for existing controls'
// focus/bring-into-view logic; public samples use the WinUI property names.
defineExpose({ ...publicProperties, ChangeView, ZoomToFactor, scrollViewerRef })

watch(effectiveIsDeferredScrollingEnabled, () => {
  // The native property change synchronizes cached offsets even mid-drag.
  if (scrollViewerRef.value) {
    if (deferredVerticalOffset.value !== null) scrollViewerRef.value.scrollTop = deferredVerticalOffset.value
    if (deferredHorizontalOffset.value !== null) scrollViewerRef.value.scrollLeft = deferredHorizontalOffset.value
  }
  deferredVerticalOffset.value = deferredHorizontalOffset.value = null
  scrollRevision.value += 1
})
watch(() => uiSettings.AutoHideScrollBars, () => {
  if (indicatorTimer.value !== undefined) clearTimeout(indicatorTimer.value)
  indicatorTimer.value = undefined
  if (!uiSettings.AutoHideScrollBars || isVerticalPointerOver.value || isHorizontalPointerOver.value || isDraggingVertical.value || isDraggingHorizontal.value) showIndicators(lastIndicatorType)
  else { indicatorMode.value = 'none'; updateScrollBarVisibility() }
})

watch([effectiveMinZoomFactor, effectiveMaxZoomFactor], () => {
  if (currentZoomFactor.value < effectiveMinZoomFactor.value || currentZoomFactor.value > effectiveMaxZoomFactor.value) ZoomToFactor(currentZoomFactor.value)
})
watch(effectiveIsEnabled, enabled => {
  if (enabled) return
  cancelPendingAnimatedScrollForDirectInput()
  handleViewerPointerLeave()
  finishViewChange()
})
watch([effectiveHorizontalScrollBarVisibility, effectiveVerticalScrollBarVisibility, effectiveHorizontalScrollMode, effectiveVerticalScrollMode], () => {
  void nextTick(() => {
    overflowRevision.value += 1
    scrollRevision.value += 1
    updateScrollBarVisibility()
  })
})

// Lifecycle
onMounted(() => {
  void nextTick(() => {
    updateScrollBarVisibility()
    dispatch('Loaded', { OriginalSource: controlSender })
    if (scrollViewerRef.value) {
      emitViewChanged(false)
    }
    resizeObserver = new ResizeObserver(() => {
      if (resizeFrame !== undefined) cancelAnimationFrame(resizeFrame)
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = undefined
        overflowRevision.value += 1
        scrollRevision.value += 1
        updateScrollBarVisibility()
      })
    })
    if (rootRef.value) resizeObserver.observe(rootRef.value)
    if (scrollViewerRef.value) resizeObserver.observe(scrollViewerRef.value)
    if (contentRef.value) resizeObserver.observe(contentRef.value)
  })
})

onBeforeUnmount(() => {
  programmaticGeneration += 1
  if (programmaticFrame.value !== undefined) cancelAnimationFrame(programmaticFrame.value)
  programmaticAnimationActive = false
  if (indicatorTimer.value !== undefined) clearTimeout(indicatorTimer.value)
  if (scrollTimer.value) {
    clearTimeout(scrollTimer.value)
  }
  stopSmoothWheelScroll()
  resizeObserver?.disconnect()
  if (resizeFrame !== undefined) cancelAnimationFrame(resizeFrame)

})
</script>

<style scoped>
.win-scroll-viewer {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
  box-sizing: border-box;
  background: transparent;
  border-style: solid;
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
  outline: 2px solid var(--FocusVisualPrimaryBrush, var(--SystemControlFocusVisualPrimaryBrush, var(--FocusStrokeColorOuterBrush, var(--text-primary))));
  outline-offset: -2px;
  box-shadow: inset 0 0 0 3px var(--FocusVisualSecondaryBrush, var(--SystemControlFocusVisualSecondaryBrush, var(--FocusStrokeColorInnerBrush, var(--app-bg))));
}

.scroll-content {
  width: 100%;
  min-width: 0;
  min-height: max-content;
}

.viewer-scrollbar-host { position: absolute; display: grid; grid-template-columns: minmax(0,1fr); grid-template-rows: minmax(0,1fr); box-sizing: border-box; z-index: 2; min-width: 0; min-height: 0; }
/* An absolute ScrollViewer host applies the official Margin around the 12px
   bar. ScrollView's Grid host applies that same margin as its 14px cell inset. */
.viewer-scrollbar-host-vertical { top: var(--ScrollViewerScrollBarMargin,1px); right: var(--ScrollViewerScrollBarMargin,1px); bottom: var(--ScrollViewerScrollBarMargin,1px); width: 12px; }
.viewer-scrollbar-host-horizontal { left: var(--ScrollViewerScrollBarMargin,1px); right: var(--ScrollViewerScrollBarMargin,1px); bottom: var(--ScrollViewerScrollBarMargin,1px); height: 12px; }
.viewer-scrollbar-host-vertical.has-cross-scrollbar { bottom: 15px; }
.viewer-scrollbar-host-horizontal.has-cross-scrollbar { right: 15px; }
.scrollbar-corner { position: absolute; right: 0; bottom: 0; width: 14px; height: 14px; background: var(--ScrollViewerScrollBarSeparatorBackground, var(--ControlFillColorTransparentBrush)); }

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
  .scroll-content {
    transition: none;
  }
}
</style>
