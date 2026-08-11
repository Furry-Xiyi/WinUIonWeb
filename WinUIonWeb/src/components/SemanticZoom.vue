<template>
  <div
    ref="rootRef"
    class="win-semantic-zoom"
    :class="{
      'zoomed-in': isZoomedIn,
      'zoomed-out': !isZoomedIn,
      'is-changing-view': isChangingView,
      'is-manipulating': isManipulating,
      'is-disabled': !IsEnabled
    }"
    :style="rootStyle"
    :tabindex="IsEnabled && IsTabStop ? 0 : -1"
    @keydown="onKeyDown"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerEnd"
    @pointercancel="onPointerEnd"
    @semanticzoomrequest="onSemanticZoomRequest"
    @wheel="onWheel">
    <div class="semantic-zoom-scroll-viewer">
      <div class="semantic-zoom-surface" :style="surfaceStyle">
        <div
          ref="zoomedInPresenterRef"
          class="semantic-zoom-presenter zoomed-in-presenter"
          :class="zoomedInTransitionClass"
          :style="zoomedInPresenterStyle"
          :aria-hidden="!isZoomedIn"
          :inert="isZoomedIn ? undefined : true">
          <slot name="zoomedInView">
            <component :is="ZoomedInView" v-if="ZoomedInView" />
          </slot>
        </div>

        <div
          ref="zoomedOutPresenterRef"
          class="semantic-zoom-presenter zoomed-out-presenter"
          :class="zoomedOutTransitionClass"
          :style="zoomedOutPresenterStyle"
          :aria-hidden="isZoomedIn"
          :inert="isZoomedIn ? true : undefined">
          <slot name="zoomedOutView">
            <component :is="ZoomedOutView" v-if="ZoomedOutView" />
          </slot>
        </div>
      </div>
    </div>

    <button
      v-if="IsZoomOutButtonEnabled && isZoomOutButtonVisible"
      class="zoom-out-button"
      :class="{ visible: isZoomOutButtonVisible }"
      type="button"
      tabindex="-1"
      :disabled="!IsEnabled"
      :aria-label="t('text.zoom-out')"
      @click="onZoomOutButtonClick">
      <span aria-hidden="true">&#xE0B8;</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch, type Component, type CSSProperties } from 'vue'
import { useI18n } from './i18n/index'
import {
  createDrillInNavigationTransitionInfo,
  getNavigationTransitionInfoClassName,
  NavigationTrigger_BackNavigatingAway,
  NavigationTrigger_BackNavigatingTo,
  NavigationTrigger_NavigatingAway,
  NavigationTrigger_NavigatingTo
} from '../utils/navigationTransitionInfo'

type ScrollViewerZoomMode = 'Disabled' | 'Enabled'
type ScrollViewerScrollMode = 'Disabled' | 'Enabled' | 'Auto'

interface Props {
  ZoomedInView?: Component | string
  ZoomedOutView?: Component | string
  IsZoomedInViewActive?: boolean
  CanChangeViews?: boolean
  IsZoomOutButtonEnabled?: boolean
  IsEnabled?: boolean
  IsTabStop?: boolean
  TabNavigation?: 'Local' | 'Cycle' | 'Once'
  Width?: number | string
  Height?: number | string
  Background?: string
  BorderBrush?: string
  BorderThickness?: number | string
  Padding?: number | string
  'ScrollViewer.HorizontalScrollMode'?: ScrollViewerScrollMode
  'ScrollViewer.IsHorizontalRailEnabled'?: boolean
  'ScrollViewer.VerticalScrollMode'?: ScrollViewerScrollMode
  'ScrollViewer.IsVerticalRailEnabled'?: boolean
  'ScrollViewer.ZoomMode'?: ScrollViewerZoomMode
}

interface SemanticZoomBounds {
  X: number
  Y: number
  Width: number
  Height: number
}

interface SemanticZoomLocation {
  Item: unknown
  Bounds: SemanticZoomBounds
}

interface SemanticZoomViewChangedEventArgs {
  IsSourceZoomedInView: boolean
  SourceItem: SemanticZoomLocation
  DestinationItem: SemanticZoomLocation
}

interface SemanticZoomToggleRequest {
  Item?: unknown
  OriginalSource?: HTMLElement
}

const props = withDefaults(defineProps<Props>(), {
  IsZoomedInViewActive: true,
  CanChangeViews: true,
  IsZoomOutButtonEnabled: false,
  IsEnabled: true,
  IsTabStop: false,
  TabNavigation: 'Once',
  Background: 'transparent',
  BorderBrush: 'transparent',
  BorderThickness: 0,
  Padding: 0,
  'ScrollViewer.HorizontalScrollMode': 'Disabled',
  'ScrollViewer.IsHorizontalRailEnabled': false,
  'ScrollViewer.VerticalScrollMode': 'Disabled',
  'ScrollViewer.IsVerticalRailEnabled': false,
  'ScrollViewer.ZoomMode': 'Disabled'
})

const emit = defineEmits<{
  'update:IsZoomedInViewActive': [value: boolean]
  ViewChangeStarted: [args: SemanticZoomViewChangedEventArgs]
  ViewChangeCompleted: [args: SemanticZoomViewChangedEventArgs]
}>()

const { t } = useI18n()
const rootRef = ref<HTMLDivElement>()
const zoomedInPresenterRef = ref<HTMLDivElement>()
const zoomedOutPresenterRef = ref<HTMLDivElement>()
const isZoomedIn = ref(props.IsZoomedInViewActive)
const isChangingView = ref(false)
const isZoomOutButtonVisible = ref(false)
const gestureFactor = ref<number | null>(null)
const activePointers = new Map<number, { x: number, y: number }>()

let zoomOutButtonTimer: number | undefined
let gestureReturnTimer: number | undefined
let gestureStartDistance = 0
let gestureStartFactor = 1
let gestureStartedZoomedIn = true
let gestureActive = false
let viewChangeSequence = 0
let runningViewAnimations: Animation[] = []
let queuedChange: { targetIsZoomedInView: boolean, request?: SemanticZoomToggleRequest } | undefined

const fadeTransitionDuration = 167
const drillInTransition = createDrillInNavigationTransitionInfo()
const zoomedInTransitionClass = ref('')
const zoomedOutTransitionClass = ref('')
const upperThresholdLow = 0.9
const lowerThresholdHigh = 0.6

const cssLength = (value: number | string | undefined) => {
  if (value === undefined || value === null || value === '') return undefined
  if (typeof value === 'number') return `${value}px`
  const trimmed = value.trim()
  return trimmed !== '' && !Number.isNaN(Number(trimmed)) ? `${Number(trimmed)}px` : value
}

const xamlThickness = (value: number | string | undefined) => {
  if (value === undefined || value === null || value === '') return undefined
  if (typeof value === 'number') return `${value}px`

  const values = value.split(',').map(part => cssLength(part.trim()))
  if (values.length === 1) return values[0]
  if (values.length === 2) return `${values[1]} ${values[0]}`
  if (values.length === 4) return `${values[1]} ${values[2]} ${values[3]} ${values[0]}`
  return value
}

const rootStyle = computed<CSSProperties>(() => ({
  width: cssLength(props.Width),
  height: cssLength(props.Height),
  // Keep the host borderless; the WinUI template does not draw a frame.
  border: '0 solid transparent'
}))

const surfaceStyle = computed<CSSProperties>(() => ({
  background: props.Background,
  borderColor: props.BorderBrush,
  borderWidth: xamlThickness(props.BorderThickness),
  borderStyle: 'solid',
  padding: xamlThickness(props.Padding)
}))

const effectiveZoomFactor = computed(() => gestureFactor.value ?? (isZoomedIn.value ? 1 : 0.5))
const zoomedInPresenterStyle = computed<CSSProperties>(() => ({
  transform: gestureFactor.value === null ? 'none' : `scale(${effectiveZoomFactor.value})`
}))
const zoomedOutPresenterStyle = computed<CSSProperties>(() => ({
  transform: gestureFactor.value === null ? 'none' : `scale(${effectiveZoomFactor.value * 2})`
}))
const isManipulating = computed(() => gestureFactor.value !== null && !isChangingView.value)

const animationDuration = () => (
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 0
    : fadeTransitionDuration
)

const makeLocation = (element: HTMLElement | undefined, item: unknown = null): SemanticZoomLocation => {
  const rootBounds = rootRef.value?.getBoundingClientRect()
  const bounds = element?.getBoundingClientRect()

  return {
    Item: item,
    Bounds: {
      X: bounds && rootBounds ? bounds.left - rootBounds.left : 0,
      Y: bounds && rootBounds ? bounds.top - rootBounds.top : 0,
      Width: bounds?.width ?? 0,
      Height: bounds?.height ?? 0
    }
  }
}

const createEventArgs = (
  sourceIsZoomedInView: boolean,
  request?: SemanticZoomToggleRequest
): SemanticZoomViewChangedEventArgs => ({
  IsSourceZoomedInView: sourceIsZoomedInView,
  SourceItem: makeLocation(
    request?.OriginalSource ?? (sourceIsZoomedInView ? zoomedInPresenterRef.value : zoomedOutPresenterRef.value),
    request?.Item
  ),
  DestinationItem: makeLocation(sourceIsZoomedInView ? zoomedOutPresenterRef.value : zoomedInPresenterRef.value)
})

const clearViewAnimations = () => {
  for (const animation of runningViewAnimations) animation.cancel()
  runningViewAnimations = []
}

const runViewChangeAnimation = (targetIsZoomedInView: boolean) => {
  if (animationDuration() === 0) return Promise.resolve()

  const source = targetIsZoomedInView ? zoomedOutPresenterRef.value : zoomedInPresenterRef.value
  const destination = targetIsZoomedInView ? zoomedInPresenterRef.value : zoomedOutPresenterRef.value
  if (!source || !destination || typeof source.animate !== 'function') return Promise.resolve()

  const animations = [
    ...source.getAnimations(),
    ...destination.getAnimations()
  ]
  runningViewAnimations = animations
  return Promise.all(animations.map(animation => animation.finished.catch(() => undefined))).then(() => undefined)
}

const hideZoomOutButton = () => {
  if (zoomOutButtonTimer !== undefined) window.clearTimeout(zoomOutButtonTimer)
  zoomOutButtonTimer = undefined
  isZoomOutButtonVisible.value = false
}

const beginViewChange = (targetIsZoomedInView: boolean, request?: SemanticZoomToggleRequest) => {
  if (!props.CanChangeViews || targetIsZoomedInView === isZoomedIn.value) return false
  if (isChangingView.value) {
    queuedChange = { targetIsZoomedInView, request }
    return true
  }

  const args = createEventArgs(isZoomedIn.value, request)
  clearViewAnimations()
  hideZoomOutButton()
  isChangingView.value = true
  gestureFactor.value = null
  const drillInClass = (trigger: string) => getNavigationTransitionInfoClassName(drillInTransition, trigger)
  if (targetIsZoomedInView) {
    zoomedInTransitionClass.value = drillInClass(NavigationTrigger_NavigatingTo)
    zoomedOutTransitionClass.value = drillInClass(NavigationTrigger_NavigatingAway)
  } else {
    zoomedInTransitionClass.value = drillInClass(NavigationTrigger_BackNavigatingAway)
    zoomedOutTransitionClass.value = drillInClass(NavigationTrigger_BackNavigatingTo)
  }
  emit('ViewChangeStarted', args)
  isZoomedIn.value = targetIsZoomedInView
  emit('update:IsZoomedInViewActive', targetIsZoomedInView)

  const sequence = ++viewChangeSequence
  void nextTick().then(() => runViewChangeAnimation(targetIsZoomedInView)).then(() => {
    if (sequence !== viewChangeSequence) return
    clearViewAnimations()
    isChangingView.value = false
    zoomedInTransitionClass.value = ''
    zoomedOutTransitionClass.value = ''
    emit('ViewChangeCompleted', args)

    const nextChange = queuedChange
    queuedChange = undefined
    if (nextChange && nextChange.targetIsZoomedInView !== isZoomedIn.value) {
      beginViewChange(nextChange.targetIsZoomedInView, nextChange.request)
    }
  })

  return true
}

const ToggleActiveView = (request?: SemanticZoomToggleRequest) => {
  beginViewChange(!isZoomedIn.value, request)
}

const onSemanticZoomRequest = (event: Event) => {
  const requestEvent = event as CustomEvent<SemanticZoomToggleRequest>
  ToggleActiveView(requestEvent.detail)
  event.stopPropagation()
}

const showZoomOutButton = () => {
  if (
    !props.IsEnabled ||
    !props.IsZoomOutButtonEnabled ||
    !isZoomedIn.value ||
    isChangingView.value
  ) return

  isZoomOutButtonVisible.value = true
  if (zoomOutButtonTimer !== undefined) window.clearTimeout(zoomOutButtonTimer)
  zoomOutButtonTimer = window.setTimeout(hideZoomOutButton, animationDuration() + 3000)
}

const pointerDistance = () => {
  const points = [...activePointers.values()]
  if (points.length < 2) return 0
  return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y)
}

const startPinchGesture = () => {
  if (
    !props.IsEnabled ||
    !props.CanChangeViews ||
    props['ScrollViewer.ZoomMode'] === 'Disabled' ||
    isChangingView.value ||
    activePointers.size !== 2
  ) return
  gestureStartDistance = pointerDistance()
  if (gestureStartDistance <= 0) return

  gestureStartedZoomedIn = isZoomedIn.value
  gestureStartFactor = gestureStartedZoomedIn ? 1 : 0.5
  gestureFactor.value = gestureStartFactor
  gestureActive = true
}

const updatePinchGesture = (event: PointerEvent) => {
  if (!gestureActive || gestureStartDistance <= 0) return
  const nextFactor = Math.max(0.5, Math.min(1, gestureStartFactor * (pointerDistance() / gestureStartDistance)))
  gestureFactor.value = nextFactor
  event.preventDefault()

  if (gestureStartedZoomedIn && nextFactor < upperThresholdLow) {
    gestureActive = false
    beginViewChange(false)
  } else if (!gestureStartedZoomedIn && nextFactor > lowerThresholdHigh) {
    gestureActive = false
    beginViewChange(true)
  }
}

const returnGestureToActiveView = () => {
  if (!gestureActive) return
  gestureActive = false
  gestureFactor.value = null
  if (gestureReturnTimer !== undefined) window.clearTimeout(gestureReturnTimer)
  gestureReturnTimer = window.setTimeout(() => {
    gestureReturnTimer = undefined
  }, animationDuration())
}

const onPointerDown = (event: PointerEvent) => {
  if (event.pointerType !== 'touch') return
  activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
  rootRef.value?.setPointerCapture?.(event.pointerId)
  if (activePointers.size === 2) startPinchGesture()
}

const onPointerMove = (event: PointerEvent) => {
  if (event.pointerType !== 'touch') showZoomOutButton()
  if (!activePointers.has(event.pointerId)) return
  activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
  if (activePointers.size === 2) updatePinchGesture(event)
}

const onPointerEnd = (event: PointerEvent) => {
  if (!activePointers.has(event.pointerId)) return
  activePointers.delete(event.pointerId)
  if (rootRef.value?.hasPointerCapture?.(event.pointerId)) rootRef.value.releasePointerCapture(event.pointerId)
  if (activePointers.size < 2) returnGestureToActiveView()
}

const onWheel = (event: WheelEvent) => {
  if (
    !event.ctrlKey ||
    !props.IsEnabled ||
    !props.CanChangeViews ||
    props['ScrollViewer.ZoomMode'] === 'Disabled'
  ) return

  // Browser deltaY is negative for wheel-up. WinUI's mouse wheel delta is
  // positive for wheel-up, which switches from the zoomed-out view to the
  // zoomed-in view.
  const targetIsZoomedInView = event.deltaY < 0
  if (targetIsZoomedInView === isZoomedIn.value) return
  if (beginViewChange(targetIsZoomedInView)) event.preventDefault()
}

const onKeyDown = (event: KeyboardEvent) => {
  if (!event.ctrlKey || event.altKey || event.metaKey || !props.IsEnabled || !props.CanChangeViews) return
  const isZoomOutKey = event.key === '-' || event.key === '_' || event.code === 'NumpadSubtract'
  const isZoomInKey = event.key === '+' || event.key === '=' || event.code === 'NumpadAdd'
  if (!isZoomOutKey && !isZoomInKey) return

  const targetIsZoomedInView = isZoomInKey
  if (targetIsZoomedInView === isZoomedIn.value) return
  if (beginViewChange(targetIsZoomedInView)) {
    event.preventDefault()
    event.stopPropagation()
  }
}

const onZoomOutButtonClick = () => {
  if (!props.IsEnabled) return
  beginViewChange(false)
}

watch(() => props.IsZoomedInViewActive, value => {
  if (value !== isZoomedIn.value) beginViewChange(value)
})

watch(() => props.CanChangeViews, canChangeViews => {
  if (canChangeViews && props.IsZoomedInViewActive !== isZoomedIn.value) {
    beginViewChange(props.IsZoomedInViewActive)
  }
})

watch(
  [() => props.IsZoomOutButtonEnabled, () => props.IsEnabled, isZoomedIn],
  ([isButtonEnabled, isEnabled, zoomedIn]) => {
    if (!isButtonEnabled || !isEnabled || !zoomedIn) hideZoomOutButton()
  }
)

onBeforeUnmount(() => {
  viewChangeSequence += 1
  clearViewAnimations()
  hideZoomOutButton()
  if (gestureReturnTimer !== undefined) window.clearTimeout(gestureReturnTimer)
  activePointers.clear()
})

defineExpose({ ToggleActiveView })
</script>

<style scoped>
.win-semantic-zoom {
  position: relative;
  display: block;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border: 0;
  isolation: isolate;
  touch-action: pan-x pan-y;
}

.semantic-zoom-scroll-viewer,
.semantic-zoom-surface,
.semantic-zoom-presenter {
  position: absolute;
  inset: 0;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
}

.semantic-zoom-scroll-viewer {
  overflow: hidden;
}

.semantic-zoom-surface {
  display: grid;
  overflow: hidden;
  border: 0 solid transparent;
}

.semantic-zoom-presenter {
  display: block;
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform-origin: 50% 50%;
  will-change: opacity;
  transition:
    opacity 167ms cubic-bezier(0.17, 0.17, 0, 1),
    visibility 0ms linear 167ms;
}

.zoomed-in .zoomed-in-presenter,
.zoomed-out .zoomed-out-presenter {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transition:
    opacity 167ms cubic-bezier(0.17, 0.17, 0, 1),
    visibility 0ms linear 0ms;
}

.is-changing-view .semantic-zoom-presenter {
  visibility: visible;
  transition: none;
}

.is-manipulating .semantic-zoom-presenter {
  will-change: opacity, transform;
  transition: none;
}

.zoom-out-button {
  position: absolute;
  right: 19px;
  bottom: 19px;
  z-index: 2;
  display: grid;
  place-items: center;
  box-sizing: border-box;
  width: 12px;
  min-width: 12px;
  height: 12px;
  min-height: 12px;
  margin: 0;
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--ButtonBorderBrush, var(--ctrl-border, transparent));
  border-radius: 0;
  background: var(--ButtonBackground, var(--ctrl-fill-default, rgba(255, 255, 255, 0.2)));
  color: var(--ButtonForeground, var(--text-primary, #fff));
  font-family: 'WinUIOnWebIcons';
  font-size: 4px;
  font-weight: 400;
  line-height: 1;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  user-select: none;
  transition:
    opacity 167ms linear,
    visibility 0ms linear 167ms,
    background-color 83ms linear,
    border-color 83ms linear,
    color 83ms linear,
    transform 83ms linear;
}

.zoom-out-button.visible {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transition-delay: 0ms;
}

.is-changing-view .zoom-out-button {
  transition: none;
}

.zoom-out-button:hover {
  border-color: var(--ButtonBorderBrushPointerOver, var(--ctrl-border));
  background: var(--ButtonBackgroundPointerOver, var(--ctrl-fill-secondary));
  color: var(--ButtonForegroundPointerOver, var(--text-primary));
}

.zoom-out-button:active {
  border-color: var(--ButtonBorderBrushPressed, var(--ctrl-border));
  background: var(--ButtonBackgroundPressed, var(--ctrl-fill-tertiary));
  color: var(--ButtonForegroundPressed, var(--text-secondary));
  transform: scale(0.96);
}

.zoom-out-button:disabled {
  border-color: var(--ButtonBorderBrushDisabled, transparent);
  background: var(--ButtonBackgroundDisabled, var(--ctrl-fill-disabled));
  color: var(--ButtonForegroundDisabled, var(--text-disabled));
}

.win-semantic-zoom.is-disabled {
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .semantic-zoom-presenter,
  .zoom-out-button {
    transition-duration: 0ms;
  }
}

@media (forced-colors: active) {
  .zoom-out-button {
    border-color: ButtonText;
    background: ButtonFace;
    color: ButtonText;
    forced-color-adjust: none;
  }

  .zoom-out-button:hover {
    border-color: Highlight;
    background: Highlight;
    color: HighlightText;
  }
}
</style>
