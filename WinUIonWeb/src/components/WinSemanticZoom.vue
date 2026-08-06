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
    :tabindex="IsEnabled ? 0 : -1"
    @keydown="onKeyDown"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerEnd"
    @pointercancel="onPointerEnd"
    @wheel="onWheel">
    <div class="semantic-zoom-scroll-viewer">
      <div class="semantic-zoom-surface" :style="surfaceStyle">
        <div
          ref="zoomedInPresenterRef"
          class="semantic-zoom-presenter zoomed-in-presenter"
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
      class="zoom-out-button"
      :class="{ visible: isZoomOutButtonVisible }"
      type="button"
      tabindex="-1"
      :disabled="!IsEnabled"
      :aria-hidden="!isZoomOutButtonVisible"
      :aria-label="t('text.zoom-out')"
      @click="onZoomOutButtonClick">
      <span aria-hidden="true">&#xE0B8;</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch, type Component, type CSSProperties } from 'vue'
import { useI18n } from './i18n/index'

type ScrollViewerZoomMode = 'Disabled' | 'Enabled'

interface Props {
  ZoomedInView?: Component | string
  ZoomedOutView?: Component | string
  IsZoomedInViewActive?: boolean
  CanChangeViews?: boolean
  IsZoomOutButtonEnabled?: boolean
  IsEnabled?: boolean
  Width?: number | string
  Height?: number | string
  Background?: string
  BorderBrush?: string
  BorderThickness?: number | string
  Padding?: number | string
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

const props = withDefaults(defineProps<Props>(), {
  IsZoomedInViewActive: true,
  CanChangeViews: true,
  IsZoomOutButtonEnabled: false,
  IsEnabled: true,
  Background: 'transparent',
  BorderBrush: 'transparent',
  BorderThickness: 0,
  Padding: 0,
  'ScrollViewer.ZoomMode': 'Enabled'
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
const transformOrigin = ref({ x: 50, y: 50 })
const activePointers = new Map<number, { x: number, y: number }>()

let viewChangeTimer: number | undefined
let zoomOutButtonTimer: number | undefined
let gestureReturnTimer: number | undefined
let gestureStartDistance = 0
let gestureStartFactor = 1
let gestureStartedZoomedIn = true
let gestureActive = false
let queuedTarget: boolean | undefined

const viewTransitionDuration = 167
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
const presenterTransformOrigin = computed(() => `${transformOrigin.value.x}% ${transformOrigin.value.y}%`)
const zoomedInPresenterStyle = computed<CSSProperties>(() => ({
  transform: `scale(${effectiveZoomFactor.value})`,
  transformOrigin: presenterTransformOrigin.value
}))
const zoomedOutPresenterStyle = computed<CSSProperties>(() => ({
  transform: `scale(${effectiveZoomFactor.value * 2})`,
  transformOrigin: presenterTransformOrigin.value
}))
const isManipulating = computed(() => gestureFactor.value !== null && !isChangingView.value)

const animationDuration = () => (
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 0
    : viewTransitionDuration
)

const makeLocation = (element: HTMLElement | undefined): SemanticZoomLocation => {
  const rootBounds = rootRef.value?.getBoundingClientRect()
  const bounds = element?.getBoundingClientRect()

  return {
    Item: null,
    Bounds: {
      X: bounds && rootBounds ? bounds.left - rootBounds.left : 0,
      Y: bounds && rootBounds ? bounds.top - rootBounds.top : 0,
      Width: bounds?.width ?? 0,
      Height: bounds?.height ?? 0
    }
  }
}

const createEventArgs = (sourceIsZoomedInView: boolean): SemanticZoomViewChangedEventArgs => ({
  IsSourceZoomedInView: sourceIsZoomedInView,
  SourceItem: makeLocation(sourceIsZoomedInView ? zoomedInPresenterRef.value : zoomedOutPresenterRef.value),
  DestinationItem: makeLocation(sourceIsZoomedInView ? zoomedOutPresenterRef.value : zoomedInPresenterRef.value)
})

const clearViewChangeTimer = () => {
  if (viewChangeTimer === undefined) return
  window.clearTimeout(viewChangeTimer)
  viewChangeTimer = undefined
}

const hideZoomOutButton = () => {
  if (zoomOutButtonTimer !== undefined) window.clearTimeout(zoomOutButtonTimer)
  zoomOutButtonTimer = undefined
  isZoomOutButtonVisible.value = false
}

const beginViewChange = (targetIsZoomedInView: boolean) => {
  if (!props.CanChangeViews || targetIsZoomedInView === isZoomedIn.value) return false
  if (isChangingView.value) {
    queuedTarget = targetIsZoomedInView
    return false
  }

  const args = createEventArgs(isZoomedIn.value)
  clearViewChangeTimer()
  hideZoomOutButton()
  isChangingView.value = true
  gestureFactor.value = null
  emit('ViewChangeStarted', args)
  isZoomedIn.value = targetIsZoomedInView
  emit('update:IsZoomedInViewActive', targetIsZoomedInView)

  viewChangeTimer = window.setTimeout(() => {
    viewChangeTimer = undefined
    isChangingView.value = false
    emit('ViewChangeCompleted', args)

    const nextTarget = queuedTarget
    queuedTarget = undefined
    if (nextTarget !== undefined && nextTarget !== isZoomedIn.value) beginViewChange(nextTarget)
  }, animationDuration())

  return true
}

const ToggleActiveView = () => {
  beginViewChange(!isZoomedIn.value)
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

const setTransformOrigin = (clientX: number, clientY: number) => {
  const bounds = rootRef.value?.getBoundingClientRect()
  if (!bounds || bounds.width === 0 || bounds.height === 0) return
  transformOrigin.value = {
    x: Math.max(0, Math.min(100, ((clientX - bounds.left) / bounds.width) * 100)),
    y: Math.max(0, Math.min(100, ((clientY - bounds.top) / bounds.height) * 100))
  }
}

const pointerDistance = () => {
  const points = [...activePointers.values()]
  if (points.length < 2) return 0
  return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y)
}

const startPinchGesture = () => {
  if (!props.IsEnabled || !props.CanChangeViews || isChangingView.value || activePointers.size !== 2) return
  const points = [...activePointers.values()]
  gestureStartDistance = pointerDistance()
  if (gestureStartDistance <= 0) return

  gestureStartedZoomedIn = isZoomedIn.value
  gestureStartFactor = gestureStartedZoomedIn ? 1 : 0.5
  gestureFactor.value = gestureStartFactor
  gestureActive = true
  setTransformOrigin((points[0].x + points[1].x) / 2, (points[0].y + points[1].y) / 2)
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

  // WinUI maps a positive wheel delta to zoom-in and a negative delta to
  // zoom-out, matching ScrollViewer's keyboard/pointer direction.
  const targetIsZoomedInView = event.deltaY > 0
  if (targetIsZoomedInView === isZoomedIn.value) return
  setTransformOrigin(event.clientX, event.clientY)
  if (beginViewChange(targetIsZoomedInView)) event.preventDefault()
}

const onKeyDown = (event: KeyboardEvent) => {
  if (!event.ctrlKey || event.altKey || event.metaKey || !props.IsEnabled || !props.CanChangeViews) return
  const isZoomOutKey = event.key === '-' || event.key === '_' || event.code === 'NumpadSubtract'
  const isZoomInKey = event.key === '+' || event.key === '=' || event.code === 'NumpadAdd'
  if (!isZoomOutKey && !isZoomInKey) return

  const targetIsZoomedInView = isZoomInKey
  if (targetIsZoomedInView === isZoomedIn.value) return
  transformOrigin.value = { x: 50, y: 50 }
  if (beginViewChange(targetIsZoomedInView)) {
    event.preventDefault()
    event.stopPropagation()
  }
}

const onZoomOutButtonClick = () => {
  if (!props.IsEnabled) return
  transformOrigin.value = { x: 50, y: 50 }
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
  clearViewChangeTimer()
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
  will-change: opacity, transform;
  transition:
    opacity 167ms linear,
    transform 167ms cubic-bezier(0.1, 0.9, 0.2, 1),
    visibility 0ms linear 167ms;
}

.zoomed-in .zoomed-in-presenter,
.zoomed-out .zoomed-out-presenter {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transition:
    opacity 167ms linear,
    transform 167ms cubic-bezier(0.1, 0.9, 0.2, 1),
    visibility 0ms linear 0ms;
}

.is-manipulating .semantic-zoom-presenter {
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
  font-family: var(--SymbolThemeFontFamily, 'Segoe Fluent Icons', 'Segoe MDL2 Assets');
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
