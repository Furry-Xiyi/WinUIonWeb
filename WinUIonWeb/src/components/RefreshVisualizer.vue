<template>
  <div ref="rootRef" class="win-refresh-visualizer" v-bind="rootAttrs" :style="rootStyle" aria-hidden="true">
    <ContentOutlet />
  </div>
</template>

<script lang="ts">
import { RefreshVisualizerContent } from './RefreshProperties'
export { RefreshVisualizerContent }
export default { Content: RefreshVisualizerContent }
</script>

<script setup lang="ts">
import { cloneVNode, computed, defineComponent, getCurrentInstance, h, inject, isVNode, markRaw, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, useSlots, watch, type VNode } from 'vue'
import { alignment, cssLength, xamlThickness } from './layout'
import { getRefreshVisualizerProperty, refreshChildren, refreshNodes } from './RefreshProperties'
import SymbolIcon from './SymbolIcon.vue'
import {
  createRefreshContext, DEFAULT_PULL_DIMENSION_SIZE, isFarPull, isVerticalPull,
  raiseRefreshRequested, refreshContextKey, type RefreshContext, type RefreshRequestedEventArgs,
  type RefreshStateChangedEventArgs, type RefreshVisualizerHandle, type RefreshVisualizerState
} from './refreshRuntime'
import { resolveXamlHandler, resolveXamlValue } from './xamlRuntime'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  Orientation: { type: String, default: 'Auto' }, Content: { type: [String, Object], default: '' },
  Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' }, MinHeight: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: 'Stretch' }, VerticalAlignment: { type: String, default: 'Stretch' },
  Background: { type: String, default: '{ThemeResource RefreshVisualizerBackground}' },
  Foreground: { type: String, default: '{ThemeResource RefreshVisualizerForeground}' },
  IsEnabled: { type: [Boolean, String], default: true }, Visibility: { type: String, default: 'Visible' }
})
const emit = defineEmits<{
  RefreshRequested: [sender: unknown, args: RefreshRequestedEventArgs]
  RefreshStateChanged: [sender: unknown, args: RefreshStateChangedEventArgs]
}>()
const instance = getCurrentInstance()
const slots = useSlots()
const attrs = useAttrs()
const rootAttrs = computed(() => {
  const { RefreshRequested: _requested, RefreshStateChanged: _changed, ...rest } = attrs
  return rest
})
const rootRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const provider = inject<RefreshContext | null>(refreshContextKey, null)
const context = provider ?? createRefreshContext()
const state = ref<RefreshVisualizerState>('Idle')
const interactionRatio = ref(0)
const isInteracting = ref(false)
let rotationAnimation: Animation | null = null
let scaleAnimation: Animation | null = null
let disposed = false
const value = (input: unknown) => resolveXamlValue(input, instance)
const startingAngle = computed(() => {
  switch (value(props.Orientation)) {
    case 'Normal': return 0
    case 'Rotate270DegreesCounterclockwise': return -Math.PI / 2
    case 'Rotate90DegreesCounterclockwise': return Math.PI / 2
    default: return context.pullDirection === 'LeftToRight' ? -Math.PI / 2 : context.pullDirection === 'RightToLeft' ? Math.PI / 2 : 0
  }
})
const vertical = computed(() => isVerticalPull(context.pullDirection))
const translate = (distance: number) => vertical.value ? `0px ${distance}px` : `${distance}px 0px`
const parallax = (progress: number) => (isFarPull(context.pullDirection) ? -1 : 1)
  * (1 - context.executionRatio) * context.visualizerRootSize * 0.5 * progress
const indicatorStyle = computed(() => {
  const progress = Math.min(interactionRatio.value / context.executionRatio, 1)
  const active = state.value === 'Interacting' || state.value === 'Pending'
  const angle = state.value === 'Interacting'
    ? startingAngle.value + Math.PI * progress * 2 : startingAngle.value
  return {
    justifySelf: 'center', alignSelf: 'center', transformOrigin: '50% 50%',
    opacity: state.value === 'Idle' || state.value === 'Interacting' ? '0.4' : '1',
    rotate: `${angle}rad`,
    // Pending keeps the provider's parallax expression, as in UpdateContent.
    translate: state.value === 'Refreshing'
      ? translate(provider ? parallax(1) : (isFarPull(context.pullDirection) ? -1 : 1) * context.visualizerRootSize)
      : active ? translate(parallax(progress)) : '0px 0px'
  }
})
const rootStyle = computed(() => {
  const style: Record<string, unknown> = {
    background: value(props.Background), color: value(props.Foreground),
    margin: xamlThickness(value(props.Margin)),
    justifySelf: alignment(value(props.HorizontalAlignment), 'horizontal'),
    alignSelf: alignment(value(props.VerticalAlignment), 'vertical'),
    minHeight: cssLength(value(props.MinHeight)) || '80px'
  }
  for (const key of ['Width', 'Height', 'MinWidth', 'MaxWidth', 'MaxHeight'] as const) {
    const length = cssLength(value(props[key]))
    if (length) style[key[0].toLowerCase() + key.slice(1)] = length
  }
  // OnPullDirectionChangedImpl sets the pull-axis dimension and clears the
  // cross-axis dimension. Orientation affects the glyph angle, not that axis.
  if (provider && !vertical.value) style.width ??= `${DEFAULT_PULL_DIMENSION_SIZE}px`
  else style.height ??= `${DEFAULT_PULL_DIMENSION_SIZE}px`
  if (value(props.Visibility) === 'Collapsed') style.display = 'none'
  if (value(props.Visibility) === 'Hidden') style.visibility = 'hidden'
  return style as import('vue').CSSProperties
})

const stopRotation = () => {
  rotationAnimation?.cancel()
  rotationAnimation = null
}
const stopAnimations = () => {
  stopRotation()
  scaleAnimation?.cancel()
  scaleAnimation = null
}
const startRotation = () => {
  stopRotation()
  if (!contentRef.value?.animate) return
  rotationAnimation = contentRef.value.animate(
    [{ rotate: `${startingAngle.value}rad` }, { rotate: `${startingAngle.value + Math.PI * 2}rad` }],
    { duration: 500, iterations: Infinity, easing: 'linear' }
  )
}
const startScale = () => {
  scaleAnimation?.cancel()
  if (!contentRef.value?.animate) return
  // ExecuteScaleUpAnimation: 1 -> 1.5 at 0.5 -> 1 at 1, 300ms.
  scaleAnimation = contentRef.value.animate(
    [{ scale: '1', offset: 0 }, { scale: '1.5', offset: 0.5 }, { scale: '1', offset: 1 }],
    { duration: 300, easing: 'cubic-bezier(0.5, 0, 0, 1)' }
  )
}
const invokeStateChanged = (args: RefreshStateChangedEventArgs) => {
  const sender = publicApi
  emit('RefreshStateChanged', sender, args)
  resolveXamlHandler(attrs.RefreshStateChanged, instance)?.(sender, args)
}
const setState = (next: RefreshVisualizerState) => {
  if (state.value === next || disposed) return
  const oldState = state.value
  state.value = next
  context.state = next
  if (next === 'Pending') { stopRotation(); startScale() }
  else if (next === 'Refreshing') startRotation()
  else if (next === 'Idle') stopAnimations()
  else stopRotation()
  invokeStateChanged({ OldState: oldState, NewState: next })
  context.containerStateChanged?.(oldState, next)
}
const RequestRefresh = () => {
  if (disposed || state.value === 'Refreshing') return
  setState('Refreshing')
  raiseRefreshRequested(args => {
    const sender = publicApi
    emit('RefreshRequested', sender, args)
    resolveXamlHandler(attrs.RefreshRequested, instance)?.(sender, args)
    context.containerRefreshRequested?.(args)
  }, () => {
    if (disposed) return
    interactionRatio.value = 0
    isInteracting.value = false
    setState('Idle')
  })
}
const setInteractionRatio = (ratio: number) => {
  const wasAtZero = interactionRatio.value === 0
  interactionRatio.value = Math.max(0, Math.min(1, ratio))
  if (!isInteracting.value) {
    if (state.value !== 'Refreshing') setState(ratio > 0 ? 'Peeking' : 'Idle')
    return
  }
  switch (state.value) {
    case 'Idle':
      if (wasAtZero) {
        if (ratio > context.executionRatio) setState('Pending')
        else if (ratio > 0) setState('Interacting')
      } else if (ratio > 0) setState('Peeking')
      break
    case 'Interacting':
      if (ratio <= 0) setState('Idle')
      else if (ratio > context.executionRatio) setState('Pending')
      break
    case 'Pending':
      if (ratio <= context.executionRatio) setState('Interacting')
      break
  }
}
const handle: RefreshVisualizerHandle = markRaw({
  setInteractionRatio,
  setIsInteractingForRefresh(next: boolean) {
    isInteracting.value = next
    if (next) return
    if (state.value === 'Pending') RequestRefresh()
    else if (state.value !== 'Refreshing') setState('Idle')
  },
  setInternalPullDirection(next) {
    context.pullDirection = next
    if (state.value !== 'Refreshing') setState('Idle')
    nextTick(measure)
  },
  RequestRefresh,
  get publicInstance() { return publicApi }
})

// Animate Content itself. FrameworkElements are direct children of the Root
// grid in RefreshVisualizer.cpp, with no extra indicator or progress-ring host.
const ContentOutlet = defineComponent({
  setup() {
    return () => {
      const children = refreshNodes(slots.default?.() ?? [])
      const property = children.find(node => getRefreshVisualizerProperty(node) === 'content')
      const content = value(props.Content)
      const candidates = property ? refreshChildren(property) : children
      const node = candidates[0] ?? (isVNode(content) ? content : h(SymbolIcon, {
        Symbol: 'Refresh', FontSize: '20', style: { width: '30px', height: '30px' }
      }))
      const register = (vnode: VNode) => {
        const element = vnode.el instanceof HTMLElement ? vnode.el : null
        if (contentRef.value === element) return
        stopAnimations()
        contentRef.value = element
        if (state.value === 'Refreshing') startRotation()
        else if (state.value === 'Pending') startScale()
      }
      return cloneVNode(node, {
        style: indicatorStyle.value,
        onVnodeMounted: register,
        onVnodeUpdated: register
      })
    }
  }
})
let resizeObserver: ResizeObserver | undefined
const measure = () => {
  const element = rootRef.value
  if (!element) return
  const extent = vertical.value ? element.offsetHeight : element.offsetWidth
  if (extent > 0) {
    context.visualizerSize = extent
    context.visualizerRootSize = extent
  }
}
watch(startingAngle, () => { if (state.value === 'Refreshing') startRotation() })
onMounted(() => {
  context.visualizerHandle = handle
  measure()
  if (typeof ResizeObserver === 'function') {
    resizeObserver = new ResizeObserver(measure)
    if (rootRef.value) resizeObserver.observe(rootRef.value)
  }
})
onBeforeUnmount(() => {
  disposed = true
  resizeObserver?.disconnect()
  stopAnimations()
  if (context.visualizerHandle === handle) context.visualizerHandle = null
})
const publicApi = markRaw({
  RequestRefresh,
  get State() { return state.value },
  get Content() { return contentRef.value }
})
defineExpose(publicApi)
</script>

<style scoped>
.win-refresh-visualizer {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
  min-width: 0;
  box-sizing: border-box;
  overflow: hidden;
  pointer-events: none;
}
</style>
