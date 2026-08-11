<template>
  <WinScrollViewer
    ref="scrollPresenterRef"
    class="win-scroll-view"
    :class="`content-orientation-${ContentOrientation.toLowerCase()}`"
    :Width="Width"
    :Height="Height"
    :HorizontalAlignment="HorizontalAlignment"
    :VerticalAlignment="VerticalAlignment"
    :IsTabStop="IsTabStop"
    :ZoomMode="ZoomMode"
    :MinZoomFactor="MinZoomFactor"
    :MaxZoomFactor="MaxZoomFactor"
    :ZoomFactor="ZoomFactor"
    :HorizontalScrollMode="HorizontalScrollMode"
    :VerticalScrollMode="VerticalScrollMode"
    :HorizontalScrollBarVisibility="HorizontalScrollBarVisibility"
    :VerticalScrollBarVisibility="VerticalScrollBarVisibility"
    :IsHorizontalScrollChainingEnabled="HorizontalScrollChainMode !== 'Never'"
    :IsVerticalScrollChainingEnabled="VerticalScrollChainMode !== 'Never'"
    @ViewChanging="onViewChanging"
    @ViewChanged="onViewChanged">
    <slot />
  </WinScrollViewer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import WinScrollViewer from './WinScrollViewer.vue'

type ScrollingScrollBarVisibility = 'Auto' | 'Visible' | 'Hidden'
type ScrollingContentOrientation = 'None' | 'Horizontal' | 'Vertical' | 'Both'
type ScrollingChainMode = 'Auto' | 'Always' | 'Never'
type ScrollingRailMode = 'Enabled' | 'Disabled'
type ScrollingScrollMode = 'Enabled' | 'Disabled' | 'Auto'
type ScrollingZoomMode = 'Enabled' | 'Disabled'
type ScrollingInputKinds = 'None' | 'Touch' | 'Pen' | 'MouseWheel' | 'Keyboard' | 'Gamepad' | 'All'

interface Props {
  HorizontalScrollBarVisibility?: ScrollingScrollBarVisibility
  VerticalScrollBarVisibility?: ScrollingScrollBarVisibility
  ContentOrientation?: ScrollingContentOrientation
  HorizontalScrollChainMode?: ScrollingChainMode
  VerticalScrollChainMode?: ScrollingChainMode
  HorizontalScrollRailMode?: ScrollingRailMode
  VerticalScrollRailMode?: ScrollingRailMode
  HorizontalScrollMode?: ScrollingScrollMode
  VerticalScrollMode?: ScrollingScrollMode
  ZoomChainMode?: ScrollingChainMode
  ZoomMode?: ScrollingZoomMode
  IgnoredInputKinds?: ScrollingInputKinds
  MinZoomFactor?: number
  MaxZoomFactor?: number
  ZoomFactor?: number
  HorizontalAnchorRatio?: number
  VerticalAnchorRatio?: number
  IsTabStop?: boolean
  Width?: number | string
  Height?: number | string
  HorizontalAlignment?: 'Left' | 'Center' | 'Right' | 'Stretch'
  VerticalAlignment?: 'Top' | 'Center' | 'Bottom' | 'Stretch'
}

const props = withDefaults(defineProps<Props>(), {
  HorizontalScrollBarVisibility: 'Auto',
  VerticalScrollBarVisibility: 'Auto',
  ContentOrientation: 'Vertical',
  HorizontalScrollChainMode: 'Auto',
  VerticalScrollChainMode: 'Auto',
  HorizontalScrollRailMode: 'Enabled',
  VerticalScrollRailMode: 'Enabled',
  HorizontalScrollMode: 'Auto',
  VerticalScrollMode: 'Auto',
  ZoomChainMode: 'Auto',
  ZoomMode: 'Disabled',
  IgnoredInputKinds: 'None',
  MinZoomFactor: 0.1,
  MaxZoomFactor: 10,
  ZoomFactor: 1,
  HorizontalAnchorRatio: 0,
  VerticalAnchorRatio: 0,
  IsTabStop: false,
  HorizontalAlignment: 'Stretch',
  VerticalAlignment: 'Stretch'
})

interface ScrollViewerView {
  HorizontalOffset: number
  VerticalOffset: number
  ZoomFactor: number
}

interface ViewChangedEventArgs {
  IsIntermediate: boolean
  HorizontalOffset: number
  VerticalOffset: number
  ZoomFactor: number
}

interface ViewChangingEventArgs {
  NextView: ScrollViewerView
  FinalView: ScrollViewerView
  IsInertial: boolean
}

const emit = defineEmits<{
  ExtentChanged: [args: ViewChangedEventArgs]
  StateChanged: [args: ViewChangedEventArgs]
  ViewChanged: [args: ViewChangedEventArgs]
  ScrollCompleted: [args: ViewChangedEventArgs]
  ZoomCompleted: [args: ViewChangedEventArgs]
  ScrollAnimationStarting: [args: Record<string, never>]
  ZoomAnimationStarting: [args: Record<string, never>]
  ScrollStarting: [args: Record<string, never>]
  ZoomStarting: [args: Record<string, never>]
}>()

const scrollPresenterRef = ref<InstanceType<typeof WinScrollViewer>>()
const lastView = ref({ IsIntermediate: false, HorizontalOffset: 0, VerticalOffset: 0, ZoomFactor: props.ZoomFactor })
const operationStartView = ref(lastView.value)
const interactionState = ref<'Idle' | 'Interaction' | 'Inertia' | 'Animation'>('Idle')

const onViewChanging = (args: ViewChangingEventArgs) => {
  if (interactionState.value === 'Idle') {
    operationStartView.value = lastView.value
    interactionState.value = 'Interaction'
  }
  const view = args.NextView
  const snapshot = {
    IsIntermediate: true,
    HorizontalOffset: view.HorizontalOffset,
    VerticalOffset: view.VerticalOffset,
    ZoomFactor: view.ZoomFactor
  }
  lastView.value = snapshot
  emit('StateChanged', snapshot)
}

const onViewChanged = (args: { IsIntermediate: boolean }) => {
  const snapshot: ViewChangedEventArgs = {
    IsIntermediate: args.IsIntermediate,
    HorizontalOffset: Number(scrollPresenterRef.value?.HorizontalOffset ?? 0),
    VerticalOffset: Number(scrollPresenterRef.value?.VerticalOffset ?? 0),
    ZoomFactor: Number(scrollPresenterRef.value?.ZoomFactor ?? props.ZoomFactor)
  }
  const previous = interactionState.value === 'Idle' ? lastView.value : operationStartView.value
  lastView.value = snapshot
  emit('ViewChanged', snapshot)
  if (snapshot.IsIntermediate) return
  if (snapshot.ZoomFactor !== previous.ZoomFactor) emit('ZoomCompleted', snapshot)
  if (snapshot.HorizontalOffset !== previous.HorizontalOffset || snapshot.VerticalOffset !== previous.VerticalOffset) {
    emit('ScrollCompleted', snapshot)
  }
  interactionState.value = 'Idle'
}

const ScrollTo = (horizontalOffset: number, verticalOffset: number, _options?: unknown) => (
  (void _options, scrollPresenterRef.value?.ScrollTo(horizontalOffset, verticalOffset) ?? -1)
)
const ScrollBy = (horizontalOffsetDelta: number, verticalOffsetDelta: number, _options?: unknown) => (
  (void _options, scrollPresenterRef.value?.ScrollBy(horizontalOffsetDelta, verticalOffsetDelta) ?? -1)
)
const AddScrollVelocity = (offsetsVelocity: { x?: number; y?: number } | [number, number], inertiaDecayRate?: number) => (
  scrollPresenterRef.value?.AddScrollVelocity(offsetsVelocity, inertiaDecayRate) ?? -1
)
const CancelScrollVelocity = () => scrollPresenterRef.value?.CancelScrollVelocity()
const ZoomTo = (zoomFactor: number, _centerPoint?: unknown, _options?: unknown) => (
  (void _centerPoint, void _options, scrollPresenterRef.value?.ZoomTo(zoomFactor) ?? -1)
)
const ZoomBy = (zoomFactorDelta: number, centerPoint?: unknown, options?: unknown) => (
  ZoomTo(lastView.value.ZoomFactor + zoomFactorDelta, centerPoint, options)
)
const AddZoomVelocity = (zoomFactorVelocity: number) => (
  ZoomTo(lastView.value.ZoomFactor + zoomFactorVelocity / 10)
)
const RegisterAnchorCandidate = (_element: Element) => { void _element }
const UnregisterAnchorCandidate = (_element: Element) => { void _element }

defineExpose({
  ScrollTo,
  ScrollBy,
  AddScrollVelocity,
  CancelScrollVelocity,
  ZoomTo,
  ZoomBy,
  AddZoomVelocity,
  RegisterAnchorCandidate,
  UnregisterAnchorCandidate,
  ScrollPresenter: scrollPresenterRef,
  CurrentAnchor: ref<Element | null>(null),
  State: computed(() => interactionState.value),
  HorizontalOffset: computed(() => lastView.value.HorizontalOffset),
  VerticalOffset: computed(() => lastView.value.VerticalOffset),
  ZoomFactor: computed(() => lastView.value.ZoomFactor),
  ExtentWidth: computed(() => scrollPresenterRef.value?.scrollWidth ?? 0),
  ExtentHeight: computed(() => scrollPresenterRef.value?.scrollHeight ?? 0),
  ViewportWidth: computed(() => scrollPresenterRef.value?.clientWidth ?? 0),
  ViewportHeight: computed(() => scrollPresenterRef.value?.clientHeight ?? 0),
  ScrollableWidth: computed(() => Math.max(0, (scrollPresenterRef.value?.scrollWidth ?? 0) - (scrollPresenterRef.value?.clientWidth ?? 0))),
  ScrollableHeight: computed(() => Math.max(0, (scrollPresenterRef.value?.scrollHeight ?? 0) - (scrollPresenterRef.value?.clientHeight ?? 0))),
  ComputedHorizontalScrollBarVisibility: computed(() => {
    const width = scrollPresenterRef.value?.scrollWidth ?? 0
    const viewport = scrollPresenterRef.value?.clientWidth ?? 0
    if (props.HorizontalScrollBarVisibility === 'Visible') return 'Visible'
    if (props.HorizontalScrollBarVisibility === 'Hidden') return 'Collapsed'
    return width > viewport ? 'Visible' : 'Collapsed'
  }),
  ComputedVerticalScrollBarVisibility: computed(() => {
    const height = scrollPresenterRef.value?.scrollHeight ?? 0
    const viewport = scrollPresenterRef.value?.clientHeight ?? 0
    if (props.VerticalScrollBarVisibility === 'Visible') return 'Visible'
    if (props.VerticalScrollBarVisibility === 'Hidden') return 'Collapsed'
    return height > viewport ? 'Visible' : 'Collapsed'
  }),
  ComputedHorizontalScrollMode: computed(() => {
    if (props.HorizontalScrollMode === 'Disabled') return 'Disabled'
    if (props.HorizontalScrollMode === 'Enabled') return 'Enabled'
    if (props.ZoomMode === 'Enabled') return 'Enabled'
    return (scrollPresenterRef.value?.scrollWidth ?? 0) > (scrollPresenterRef.value?.clientWidth ?? 0) ? 'Enabled' : 'Disabled'
  }),
  ComputedVerticalScrollMode: computed(() => {
    if (props.VerticalScrollMode === 'Disabled') return 'Disabled'
    if (props.VerticalScrollMode === 'Enabled') return 'Enabled'
    if (props.ZoomMode === 'Enabled') return 'Enabled'
    return (scrollPresenterRef.value?.scrollHeight ?? 0) > (scrollPresenterRef.value?.clientHeight ?? 0) ? 'Enabled' : 'Disabled'
  })
})
</script>

<style scoped>
.win-scroll-view.content-orientation-none :deep(.scroll-content),
.win-scroll-view.content-orientation-both :deep(.scroll-content) {
  display: flex;
  justify-content: center;
  align-items: center;
  width: max-content;
  min-width: 100%;
  height: max-content;
  min-height: 100%;
}

.win-scroll-view.content-orientation-horizontal :deep(.scroll-content) {
  height: 100%;
  min-height: 0;
  width: max-content;
  min-width: 100%;
}

.win-scroll-view.content-orientation-vertical :deep(.scroll-content) {
  width: 100%;
  min-width: 0;
  height: max-content;
  min-height: 100%;
}

/* A vertical StackPanel measures Uniform images against its available width.
 * Keep the WinImage host and bitmap in that same 400px viewport instead of
 * allowing a larger natural bitmap to overflow to the left. */
.win-scroll-view.content-orientation-vertical :deep(.scroll-content > .win-stack-panel > .win-image-host) {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.win-scroll-view.content-orientation-vertical :deep(.scroll-content > .win-stack-panel > .win-image-host > .win-image.stretch-uniform) {
  width: 100%;
  max-width: 100%;
  height: auto;
}
</style>
