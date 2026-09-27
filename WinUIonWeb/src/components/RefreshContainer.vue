<template>
  <div
    ref="rootRef"
    class="win-refresh-container"
    v-bind="rootAttrs"
    :style="rootStyle"
    :aria-disabled="enabled ? undefined : true"
    :inert="enabled ? undefined : true"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="cancelGesture"
    @lostpointercapture="onLostPointerCapture"
    @scroll.capture="updateScrollBoundary">
    <div class="refresh-container-content-presenter" :style="contentPresenterStyle">
      <ContentOutlet />
    </div>
    <div class="refresh-visualizer-presenter" :style="visualizerPresenterStyle" aria-hidden="true">
      <VisualizerOutlet />
    </div>
  </div>
</template>

<script lang="ts">
import { RefreshContainerContent, RefreshContainerVisualizer } from './RefreshProperties'
export { RefreshContainerContent, RefreshContainerVisualizer }
export default {
  Visualizer: RefreshContainerVisualizer,
  Content: RefreshContainerContent
}
</script>

<script setup lang="ts">
import { cloneVNode, computed, defineComponent, Fragment, getCurrentInstance, h, isVNode, nextTick, onBeforeUnmount, onMounted, provide, ref, useAttrs, useSlots, watch } from 'vue'
import { alignment, cssLength, xamlThickness } from './layout'
import { getRefreshContainerProperty, refreshChildren, refreshNodes } from './RefreshProperties'
import RefreshVisualizer from './RefreshVisualizer.vue'
import {
  createRefreshContext, DEFAULT_EXECUTION_RATIO, DEFAULT_PULL_DIMENSION_SIZE,
  INITIAL_OFFSET_THRESHOLD, isFarPull, isVerticalPull, raiseRefreshRequested,
  refreshContextKey, REFRESH_ANIMATION_DURATION, type RefreshRequestedEventArgs
} from './refreshRuntime'
import { resolveXamlHandler, resolveXamlValue } from './xamlRuntime'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  Visualizer: { type: [String, Object], default: '' },
  Content: { type: [String, Number, Object], default: '' },
  PullDirection: { type: String, default: 'TopToBottom' },
  Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' }, MinHeight: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' }, Padding: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: 'Stretch' }, VerticalAlignment: { type: String, default: 'Stretch' },
  HorizontalContentAlignment: { type: String, default: 'Left' }, VerticalContentAlignment: { type: String, default: 'Top' },
  Background: { type: String, default: '{ThemeResource RefreshContainerBackgroundBrush}' },
  Foreground: { type: String, default: '{ThemeResource RefreshContainerForegroundBrush}' },
  IsEnabled: { type: [Boolean, String], default: true }, Visibility: { type: String, default: 'Visible' }
})
const emit = defineEmits<{ RefreshRequested: [sender: unknown, args: RefreshRequestedEventArgs] }>()
const instance = getCurrentInstance()
const attrs = useAttrs()
const rootAttrs = computed(() => {
  const { RefreshRequested: _handler, ...rest } = attrs
  return rest
})
const slots = useSlots()
const rootRef = ref<HTMLElement | null>(null)
const visualizerRef = ref<{ RequestRefresh: () => void } | null>(null)
const value = (input: unknown) => resolveXamlValue(input, instance)
const direction = computed(() => {
  const name = value(props.PullDirection)
  return name === 'BottomToTop' || name === 'LeftToRight' || name === 'RightToLeft' ? name : 'TopToBottom'
})
const context = createRefreshContext({ pullDirection: direction.value, executionRatio: DEFAULT_EXECUTION_RATIO })
provide(refreshContextKey, context)
const vertical = computed(() => isVerticalPull(context.pullDirection))
const sign = computed(() => isFarPull(context.pullDirection) ? -1 : 1)
const enabled = computed(() => ![false, 'False', 'false'].includes(value(props.IsEnabled) as boolean | string))
const atBoundary = ref(false)
const activePointerId = ref<number | null>(null)
const pullDistance = ref(0)
let pointerStart = 0
let initialScrollOffset = 0
let interacting = false
let disposed = false
let adaptedViewport: HTMLElement | null = null
let previousTouchAction = ''
let previousOverscrollBehavior = ''

// RefreshContainer.xaml: Root -> ContentPresenter + RefreshVisualizerPresenter.
// The content supplies its own ScrollViewer; the container never inserts one.
const nodes = computed(() => refreshNodes(slots.default?.() ?? []))
const propertyNodes = (name: 'content' | 'visualizer') => {
  const property = nodes.value.find(node => getRefreshContainerProperty(node) === name)
  return property ? refreshChildren(property) : []
}
const ContentOutlet = defineComponent({
  setup() {
    return () => {
      const property = propertyNodes('content')
      const children = property.length ? property : nodes.value.filter(node => !getRefreshContainerProperty(node))
      if (children.length) return h(Fragment, children.map(node => cloneVNode(node, {
        style: {
          justifySelf: node.props?.HorizontalAlignment ? alignment(value(node.props.HorizontalAlignment), 'horizontal') : undefined,
          alignSelf: node.props?.VerticalAlignment ? alignment(value(node.props.VerticalAlignment), 'vertical') : undefined
        }
      })))
      const content = value(props.Content)
      return isVNode(content) ? cloneVNode(content) : typeof content === 'string' || typeof content === 'number' ? content : null
    }
  }
})
const VisualizerOutlet = defineComponent({
  setup() {
    return () => {
      const property = propertyNodes('visualizer')
      if (property.length) return h(Fragment, property)
      const visualizer = value(props.Visualizer)
      return isVNode(visualizer) ? cloneVNode(visualizer) : h(RefreshVisualizer, { ref: visualizerRef })
    }
  }
})

context.containerRefreshRequested = (visualizerArgs) => {
  const deferral = visualizerArgs.GetDeferral()
  raiseRefreshRequested(args => {
    emit('RefreshRequested', publicApi, args)
    resolveXamlHandler(attrs.RefreshRequested, instance)?.(publicApi, args)
  }, () => deferral.Complete())
}
context.containerStateChanged = (_oldState, next) => {
  if (next === 'Idle' && activePointerId.value === null) pullDistance.value = 0
}

// ScrollViewerIRefreshInfoProviderDefaultAnimationHandler.cpp. Only transforms
// change during interaction, so content and surrounding examples keep their size.
const size = computed(() => context.visualizerSize || DEFAULT_PULL_DIMENSION_SIZE)
const contentOffset = computed(() => sign.value * (context.state === 'Refreshing'
  ? size.value * context.executionRatio : Math.min(size.value, pullDistance.value)))
const visualizerOffset = computed(() => sign.value * (context.state === 'Refreshing'
  ? -size.value * (1 - context.executionRatio) : -size.value + Math.min(size.value, pullDistance.value)))
const transform = (offset: number) => vertical.value ? `translateY(${offset}px)` : `translateX(${offset}px)`
const transition = computed(() => activePointerId.value === null
  ? `transform ${REFRESH_ANIMATION_DURATION}ms cubic-bezier(0.5, 0, 0, 1)` : 'none')
const contentPresenterStyle = computed(() => ({
  transform: transform(contentOffset.value), transition: transition.value,
  justifyItems: alignment(value(props.HorizontalContentAlignment), 'horizontal'),
  alignItems: alignment(value(props.VerticalContentAlignment), 'vertical')
}))
const visualizerPresenterStyle = computed(() => ({
  transform: transform(visualizerOffset.value), transition: transition.value,
  ...(vertical.value
    ? { left: '0', right: '0', [isFarPull(context.pullDirection) ? 'bottom' : 'top']: '0' }
    : { top: '0', bottom: '0', [isFarPull(context.pullDirection) ? 'right' : 'left']: '0' })
}))
const rootStyle = computed(() => {
  const style: Record<string, unknown> = {
    background: value(props.Background), color: value(props.Foreground),
    justifySelf: alignment(value(props.HorizontalAlignment), 'horizontal'),
    alignSelf: alignment(value(props.VerticalAlignment), 'vertical'),
    margin: xamlThickness(value(props.Margin)), padding: xamlThickness(value(props.Padding)),
    // Resolve touch-action before pointerdown. Permit scrolling toward the
    // content and reserve only the outward pull for the adapter.
    touchAction: enabled.value && atBoundary.value
      ? ({ TopToBottom: 'pan-x pan-down', BottomToTop: 'pan-x pan-up', LeftToRight: 'pan-y pan-right', RightToLeft: 'pan-y pan-left' }[context.pullDirection])
      : 'pan-x pan-y'
  }
  for (const key of ['Width', 'Height', 'MinWidth', 'MinHeight', 'MaxWidth', 'MaxHeight'] as const) {
    const length = cssLength(value(props[key]))
    if (length) style[key[0].toLowerCase() + key.slice(1)] = length
  }
  if (value(props.Visibility) === 'Collapsed') style.display = 'none'
  if (value(props.Visibility) === 'Hidden') style.visibility = 'hidden'
  return style
})

const viewport = () => rootRef.value?.querySelector<HTMLElement>('.win-scroll-viewer-viewport, .win-scroll-presenter') ?? null
const offset = (element: HTMLElement) => vertical.value ? element.scrollTop : element.scrollLeft
const withinBoundary = (element: HTMLElement) => {
  const position = offset(element)
  const extent = vertical.value ? element.scrollHeight - element.clientHeight : element.scrollWidth - element.clientWidth
  return isFarPull(context.pullDirection) ? position >= Math.max(0, extent) - INITIAL_OFFSET_THRESHOLD : position < INITIAL_OFFSET_THRESHOLD
}
const updateScrollBoundary = () => {
  const scroller = viewport()
  atBoundary.value = Boolean(scroller && withinBoundary(scroller))
  // The viewport is the browser's nearest scroll container, so its own
  // touch-action must reserve the outward gesture (an ancestor is ignored).
  if (scroller) {
    if (adaptedViewport !== scroller) {
      if (adaptedViewport) {
        adaptedViewport.style.touchAction = previousTouchAction
        adaptedViewport.style.overscrollBehavior = previousOverscrollBehavior
      }
      adaptedViewport = scroller
      previousTouchAction = scroller.style.touchAction
      previousOverscrollBehavior = scroller.style.overscrollBehavior
    }
    scroller.style.touchAction = String(rootStyle.value.touchAction)
    scroller.style.overscrollBehavior = 'contain'
  }
  if (activePointerId.value !== null && scroller && Math.abs(offset(scroller) - initialScrollOffset) >= INITIAL_OFFSET_THRESHOLD) cancelGesture()
}
const publishRatio = () => context.publishInteractionRatio(Math.min(1, pullDistance.value / size.value))
const setInteracting = (next: boolean) => {
  if (interacting === next) return
  interacting = next
  context.publishIsInteractingForRefresh(next)
}
const releaseCapture = (pointerId: number | null) => {
  if (pointerId !== null && rootRef.value?.hasPointerCapture?.(pointerId)) rootRef.value.releasePointerCapture(pointerId)
}
const cancelGesture = (event?: PointerEvent) => {
  if (event && activePointerId.value !== event.pointerId) return
  const pointerId = activePointerId.value
  activePointerId.value = null
  pullDistance.value = 0
  // Clear Pending before publishing the release: cancellation must never
  // enter RequestRefresh through InteractingForRefreshChanged.
  publishRatio()
  setInteracting(false)
  releaseCapture(pointerId)
}
const onPointerDown = (event: PointerEvent) => {
  if (activePointerId.value !== null) {
    if (activePointerId.value !== event.pointerId) cancelGesture()
    return
  }
  // The official ScrollViewer adapter redirects touch pointers only.
  if (!enabled.value || event.pointerType !== 'touch' || !event.isPrimary || event.button > 0 || context.state === 'Refreshing') return
  const scroller = viewport()
  if (!scroller || !withinBoundary(scroller) || !(event.target instanceof Node) || !scroller.contains(event.target)) return
  activePointerId.value = event.pointerId
  pointerStart = vertical.value ? event.clientY : event.clientX
  initialScrollOffset = offset(scroller)
  pullDistance.value = 0
  publishRatio()
  setInteracting(true)
}
const onPointerMove = (event: PointerEvent) => {
  if (activePointerId.value !== event.pointerId) return
  const scroller = viewport()
  if (!scroller || !withinBoundary(scroller) || Math.abs(offset(scroller) - initialScrollOffset) >= INITIAL_OFFSET_THRESHOLD) {
    cancelGesture()
    return
  }
  const delta = sign.value * ((vertical.value ? event.clientY : event.clientX) - pointerStart)
  pullDistance.value = Math.max(0, delta)
  if (delta > 0) {
    event.preventDefault()
    rootRef.value?.setPointerCapture?.(event.pointerId)
  }
  publishRatio()
}
const onPointerUp = (event: PointerEvent) => {
  if (activePointerId.value !== event.pointerId) return
  activePointerId.value = null
  setInteracting(false)
  pullDistance.value = 0
  if (context.state !== 'Refreshing') publishRatio()
  releaseCapture(event.pointerId)
}
const onLostPointerCapture = (event: PointerEvent) => {
  // Transferring the implicit touch capture from a ListViewItem to Root also
  // bubbles lostpointercapture from that item; only losing Root's capture
  // cancels the adapter's own gesture.
  if (event.target === rootRef.value && activePointerId.value === event.pointerId) cancelGesture(event)
}
const onWindowBlur = () => cancelGesture()
const onVisibilityChanged = () => { if (document.hidden) cancelGesture() }
const RequestRefresh = () => {
  if (disposed || context.state === 'Refreshing') return
  cancelGesture()
  context.visualizerHandle?.RequestRefresh()
}

watch(direction, next => {
  cancelGesture()
  context.pullDirection = next
  context.visualizerHandle?.setInternalPullDirection(next)
  nextTick(updateScrollBoundary)
})
watch(enabled, next => {
  if (!next) cancelGesture()
  nextTick(updateScrollBoundary)
})
let resizeObserver: ResizeObserver | undefined
onMounted(() => {
  updateScrollBoundary()
  if (typeof ResizeObserver === 'function') {
    resizeObserver = new ResizeObserver(updateScrollBoundary)
    if (rootRef.value) resizeObserver.observe(rootRef.value)
  }
  window.addEventListener('blur', onWindowBlur)
  document.addEventListener('visibilitychange', onVisibilityChanged)
})
onBeforeUnmount(() => {
  disposed = true
  cancelGesture()
  resizeObserver?.disconnect()
  if (adaptedViewport) {
    adaptedViewport.style.touchAction = previousTouchAction
    adaptedViewport.style.overscrollBehavior = previousOverscrollBehavior
  }
  context.containerRefreshRequested = null
  context.containerStateChanged = null
  window.removeEventListener('blur', onWindowBlur)
  document.removeEventListener('visibilitychange', onVisibilityChanged)
})
const publicApi = { RequestRefresh, get Visualizer() { return context.visualizerHandle?.publicInstance ?? visualizerRef.value } }
defineExpose(publicApi)
</script>

<style scoped>
.win-refresh-container {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
  min-width: 0;
  min-height: 0;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  overscroll-behavior: contain;
}
.refresh-container-content-presenter {
  display: grid;
  min-width: 0;
  min-height: 0;
  max-width: 100%;
  background: transparent;
  will-change: transform;
}
.refresh-visualizer-presenter {
  position: absolute;
  display: grid;
  pointer-events: none;
  will-change: transform;
}
</style>
