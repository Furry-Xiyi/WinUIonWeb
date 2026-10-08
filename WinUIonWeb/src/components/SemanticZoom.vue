<template>
  <div ref="rootRef" v-bind="forwardedAttrs" class="win-semantic-zoom" :class="{ 'zoomed-in': isZoomedIn, 'zoomed-out': !isZoomedIn, 'is-changing-view': isChangingView, 'is-disabled': !isEnabled }"
    :style="rootStyle" :tabindex="isEnabled && isTabStop ? 0 : -1" :aria-disabled="!isEnabled"
    @keydown="onKeyDown" @wheel.capture="onWheel" @semanticzoomrequest="onSemanticZoomRequest"
    @touchstart.capture="onLegacyTouch" @touchmove.capture="onLegacyTouch" @touchend.capture="onLegacyTouch" @touchcancel.capture="onLegacyTouch"
    @pointerdown="onPointerDown" @pointermove="onPointerMove" @pointerup="onPointerEnd" @pointercancel="onPointerEnd" @lostpointercapture="onPointerEnd">
    <ScrollViewer class="semantic-zoom-scroll-viewer" HorizontalScrollMode="{x:Bind templateHorizontalScrollMode, Mode=OneWay}" HorizontalScrollBarVisibility="Hidden"
      VerticalScrollMode="{x:Bind templateVerticalScrollMode, Mode=OneWay}" VerticalScrollBarVisibility="Hidden" ZoomMode="{x:Bind templateZoomMode, Mode=OneWay}"
      IsHorizontalRailEnabled="{x:Bind templateHorizontalRailEnabled, Mode=OneWay}" IsVerticalRailEnabled="{x:Bind templateVerticalRailEnabled, Mode=OneWay}"
      IsZoomChainingEnabled="True" IsZoomInertiaEnabled="False" IsScrollInertiaEnabled="True"
      HorizontalContentAlignment="Center" VerticalContentAlignment="Center" MinZoomFactor="0.5" MaxZoomFactor="1.0"
      AutomationProperties.AccessibilityView="Raw">
      <ScrollViewer.Template>
        <ControlTemplate TargetType="ScrollViewer"><ScrollContentPresenter x:Name="ScrollContentPresenter" /></ControlTemplate>
      </ScrollViewer.Template>
      <div class="semantic-zoom-surface" :style="surfaceStyle">
        <div ref="zoomedInPresenterRef" class="semantic-zoom-presenter zoomed-in-presenter" data-template-part="ZoomedInPresenter"
          :style="zoomedInPresenterStyle" :aria-hidden="!isZoomedIn" :inert="!isZoomedIn || !isEnabled ? true : undefined"><ZoomedInOutlet /></div>
        <div ref="zoomedOutPresenterRef" class="semantic-zoom-presenter zoomed-out-presenter" data-template-part="ZoomedOutPresenter"
          :style="zoomedOutPresenterStyle" :aria-hidden="isZoomedIn" :inert="isZoomedIn || !isEnabled ? true : undefined"><ZoomedOutOutlet /></div>
      </div>
    </ScrollViewer>
    <Button class="zoom-out-button" :class="{ visible: isZoomOutButtonVisible }" Width="12" Height="12" MinWidth="0" MinHeight="0" Padding="0" Margin="0,0,19,19"
      IsTabStop="False" HorizontalAlignment="Right" VerticalAlignment="Bottom" FontFamily="{ThemeResource SymbolThemeFontFamily}"
      FontSize="4" Content="&#xE0B8;" Click="ZoomOutButton_Click" IsEnabled="{x:Bind templateIsEnabled, Mode=OneWay}"
      AutomationProperties.Name="{x:Bind zoomOutLabel, Mode=OneWay}" />
  </div>
</template>

<script lang="ts">
const viewProperty = (name: string) => defineComponent({
  name: `SemanticZoom.${name}`, __semanticZoomProperty: name, setup() { return () => null }
})
export const SemanticZoomZoomedInView = viewProperty('ZoomedInView')
export const SemanticZoomZoomedOutView = viewProperty('ZoomedOutView')
export default { ZoomedInView: SemanticZoomZoomedInView, ZoomedOutView: SemanticZoomZoomedOutView }
</script>

<script setup lang="ts">
import { computed, defineComponent, Fragment, getCurrentInstance, h, nextTick, onBeforeUnmount, onMounted, provide, proxyRefs, ref, useAttrs, useSlots, watch, type CSSProperties, type VNode } from 'vue'
import Button from './Button.vue'
import ScrollViewer from './ScrollViewer.vue'
import { useI18n } from './i18n/index'
import { normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlScopeKey } from './xamlRuntime'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  ZoomedInView: { type: Object, default: null }, ZoomedOutView: { type: Object, default: null },
  IsZoomedInViewActive: { type: [Boolean, String], default: true }, CanChangeViews: { type: [Boolean, String], default: true },
  IsZoomOutButtonEnabled: { type: [Boolean, String], default: false }, IsEnabled: { type: [Boolean, String], default: true },
  IsTabStop: { type: [Boolean, String], default: false }, TabNavigation: { type: String, default: 'Once' },
  Width: { type: [Number, String], default: '' }, Height: { type: [Number, String], default: '' },
  MinWidth: { type: [Number, String], default: '' }, MaxWidth: { type: [Number, String], default: '' },
  MinHeight: { type: [Number, String], default: '' }, MaxHeight: { type: [Number, String], default: '' },
  Margin: { type: [Number, String], default: 0 }, Padding: { type: [Number, String], default: 0 },
  Background: { type: String, default: 'Transparent' }, BorderBrush: { type: String, default: 'Transparent' }, BorderThickness: { type: [Number, String], default: 0 },
  'ScrollViewer.HorizontalScrollMode': { type: String, default: 'Disabled' }, 'ScrollViewer.VerticalScrollMode': { type: String, default: 'Disabled' },
  'ScrollViewer.IsHorizontalRailEnabled': { type: [Boolean, String], default: false }, 'ScrollViewer.IsVerticalRailEnabled': { type: [Boolean, String], default: false },
  'ScrollViewer.ZoomMode': { type: String, default: 'Disabled' }
})
interface Location { Item: unknown; Bounds: { X: number; Y: number; Width: number; Height: number }; ZoomPoint?: { X: number; Y: number } }
interface ViewChangedArgs { IsSourceZoomedInView: boolean; SourceItem: Location; DestinationItem: Location }
interface Request { Item?: unknown; OriginalSource?: HTMLElement; ZoomPoint?: { X: number; Y: number }; Gesture?: boolean }
interface SemanticView {
  IsActiveView?: boolean; IsZoomedInView?: boolean; SemanticZoomOwner?: unknown;
  InitializeViewChange?: () => void;
  StartViewChangeFrom?: (source: Location, destination: Location) => void;
  StartViewChangeTo?: (source: Location, destination: Location) => void;
  MakeVisible?: (location: Location) => void;
  CompleteViewChangeFrom?: (source: Location, destination: Location) => void;
  CompleteViewChangeTo?: (source: Location, destination: Location) => void; CompleteViewChange?: () => void;
}
const emit = defineEmits<{ 'update:IsZoomedInViewActive': [boolean]; ViewChangeStarted: [unknown, ViewChangedArgs]; ViewChangeCompleted: [unknown, ViewChangedArgs] }>()
const instance = getCurrentInstance(), attrs = useAttrs(), slots = useSlots()
const forwardedAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => !['ViewChangeStarted', 'ViewChangeCompleted'].includes(key))))
const { t } = useI18n()
const value = (property: keyof typeof props) => resolveXamlValue(props[property], instance)
const isEnabled = computed(() => value('IsEnabled') !== false), canChangeViews = computed(() => value('CanChangeViews') !== false)
const isTabStop = computed(() => value('IsTabStop') === true), zoomButtonEnabled = computed(() => value('IsZoomOutButtonEnabled') === true)
const zoomMode = computed(() => value('ScrollViewer.ZoomMode'))
const rootRef = ref<HTMLElement>(), zoomedInPresenterRef = ref<HTMLElement>(), zoomedOutPresenterRef = ref<HTMLElement>()
const isZoomedIn = ref(value('IsZoomedInViewActive') !== false), isChangingView = ref(false), isZoomOutButtonVisible = ref(false)
const gestureFactor = ref<number | null>(null)
const transitionFactor = ref<number | null>(null), zoomOrigin = ref('50% 50%')
const length = (input: unknown) => input === '' || input == null ? undefined : Number.isFinite(Number(input)) ? `${Number(input)}px` : String(input)
const thickness = (input: unknown) => {
  const parts = String(input ?? 0).split(',').map(length)
  return parts.length === 4 ? `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}` : parts.length === 2 ? `${parts[1]} ${parts[0]}` : parts[0]
}
const rootStyle = computed<CSSProperties>(() => ({
  width: length(value('Width')), height: length(value('Height')), minWidth: length(value('MinWidth')), maxWidth: length(value('MaxWidth')),
  minHeight: length(value('MinHeight')), maxHeight: length(value('MaxHeight')), margin: thickness(value('Margin')),
  touchAction: zoomMode.value === 'Enabled' ? 'none' : 'pan-x pan-y'
}))
const surfaceStyle = computed<CSSProperties>(() => ({ background: String(value('Background')), borderColor: String(value('BorderBrush')),
  borderWidth: thickness(value('BorderThickness')), padding: thickness(value('Padding')) }))
// SemanticZoom_Partial applies the shared 0.5..1 zoom to a 2x surface,
// with a 0.5 correction on ZoomedInPresenter. At either resting endpoint
// the active view is unscaled; both views share the scale while switching.
const zoomFactor = computed(() => gestureFactor.value ?? transitionFactor.value ?? (isZoomedIn.value ? 1 : .5))
const zoomedInPresenterStyle = computed<CSSProperties>(() => ({ transform: `scale(${zoomFactor.value})`, transformOrigin: zoomOrigin.value }))
const zoomedOutPresenterStyle = computed<CSSProperties>(() => ({ transform: `scale(${zoomFactor.value * 2})`, transformOrigin: zoomOrigin.value }))
const nodes = computed(() => {
  const result: Record<string, VNode[]> = { ZoomedInView: [], ZoomedOutView: [] }
  const visit = (children: VNode[]) => {
    for (const node of children) {
      if (node.type === Fragment && Array.isArray(node.children)) { visit(node.children as VNode[]); continue }
      const marker = (node.type as { __semanticZoomProperty?: string })?.__semanticZoomProperty
      if (!marker) continue
      const content = node.children as { default?: () => VNode[] } | null
      result[marker] = normalizeXamlNodes(content?.default?.() ?? [], instance)
    }
  }
  visit(slots.default?.() ?? [])
  return result
})
const outlet = (name: 'ZoomedInView' | 'ZoomedOutView') => defineComponent({
  name: `SemanticZoom${name}Presenter`, setup() { return () => h(Fragment, nodes.value[name].length ? nodes.value[name] : props[name] ? [h(props[name])] : []) }
})
const ZoomedInOutlet = outlet('ZoomedInView'), ZoomedOutOutlet = outlet('ZoomedOutView')
const ControlTemplate = defineComponent({ name: 'ControlTemplate', setup() { return () => null } })
const ScrollContentPresenter = defineComponent({ name: 'ScrollContentPresenter', setup() { return () => null } })
const view = (zoomedIn: boolean): SemanticView | undefined => {
  const presenter = (zoomedIn ? zoomedInPresenterRef : zoomedOutPresenterRef).value
  for (const element of Array.from(presenter?.querySelectorAll('*') ?? [])) {
    const exposed = (element as HTMLElement & { __vueParentComponent?: { exposed?: SemanticView } }).__vueParentComponent?.exposed
    if (exposed && (exposed.StartViewChangeFrom || exposed.StartViewChangeTo)) return proxyRefs(exposed)
  }
  return undefined
}
let takeFocusAtCompletion = false
const sender = { get IsZoomedInViewActive() { return isZoomedIn.value }, ToggleActiveView: (request?: Request) => changeView(!isZoomedIn.value, request),
  HasFocus: () => !!rootRef.value?.contains(document.activeElement) || takeFocusAtCompletion && document.activeElement === document.body,
  StartBringIntoView: () => rootRef.value?.scrollIntoView({ block: 'nearest', inline: 'nearest' }) }
let sequence = 0, animations: Animation[] = [], queued: { target: boolean; request?: Request } | undefined
let releaseGesture: (() => void) | undefined, gestureTransitionActive = false
let buttonTimer: ReturnType<typeof setTimeout> | undefined
const duration = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 0 : 167
const cancelAnimations = () => { for (const animation of animations) animation.cancel(); animations = [] }
const location = (element?: HTMLElement, item: unknown = null): Location => {
  const root = rootRef.value?.getBoundingClientRect(), bounds = element?.getBoundingClientRect()
  return { Item: item, Bounds: { X: bounds && root ? bounds.left - root.left : 0, Y: bounds && root ? bounds.top - root.top : 0, Width: bounds?.width ?? 0, Height: bounds?.height ?? 0 } }
}
const hideButton = () => { clearTimeout(buttonTimer); buttonTimer = undefined; isZoomOutButtonVisible.value = false }
const syncViews = () => {
  for (const zoomedIn of [true, false]) {
    const adapter = view(zoomedIn)
    if (adapter) { adapter.SemanticZoomOwner = sender; adapter.IsZoomedInView = zoomedIn; adapter.IsActiveView = zoomedIn === isZoomedIn.value }
  }
}
const changeView = (target: boolean, request?: Request) => {
  if (!canChangeViews.value || !isEnabled.value) return false
  if (isChangingView.value) { queued = { target, request }; return true }
  if (target === isZoomedIn.value) return false
  hideButton()
  const sourceIsZoomedIn = isZoomedIn.value
  const startFactor = zoomFactor.value, endFactor = target ? 1 : .5
  transitionFactor.value = startFactor
  gestureTransitionActive = request?.Gesture === true
  const surfaceBounds = rootRef.value?.getBoundingClientRect()
  zoomOrigin.value = request?.ZoomPoint && surfaceBounds
    ? `${request.ZoomPoint.X - surfaceBounds.left}px ${request.ZoomPoint.Y - surfaceBounds.top}px` : '50% 50%'
  const sourcePresenter = (sourceIsZoomedIn ? zoomedInPresenterRef : zoomedOutPresenterRef).value
  const targetPresenter = (target ? zoomedInPresenterRef : zoomedOutPresenterRef).value
  const source = view(sourceIsZoomedIn), destination = view(target)
  const args: ViewChangedArgs = { IsSourceZoomedInView: sourceIsZoomedIn,
    SourceItem: location(request?.OriginalSource ?? sourcePresenter, request?.Item), DestinationItem: location(targetPresenter) }
  args.SourceItem.ZoomPoint = request?.ZoomPoint
  takeFocusAtCompletion = !!rootRef.value?.contains(document.activeElement)
  source?.InitializeViewChange?.(); destination?.InitializeViewChange?.()
  source?.StartViewChangeFrom?.(args.SourceItem, args.DestinationItem)
  destination?.StartViewChangeTo?.(args.SourceItem, args.DestinationItem)
  isChangingView.value = true
  const activeSequence = ++sequence
  emit('ViewChangeStarted', sender, args); resolveXamlHandler(attrs.ViewChangeStarted, instance)?.(sender, args)
  isZoomedIn.value = target
  emit('update:IsZoomedInViewActive', target); updateXamlBinding(props.IsZoomedInViewActive, target, instance)
  syncViews(); destination?.MakeVisible?.(args.DestinationItem)
  void nextTick().then(async () => {
    if (activeSequence !== sequence) return
    destination?.MakeVisible?.(args.DestinationItem)
    // The template fades both presenters while the internal ScrollViewer
    // animates its shared zoom from 1 to 0.5 or back. A fade alone misses
    // the correction transforms from SemanticZoom_Partial.cpp.
    cancelAnimations()
    const ms = duration()
    if (ms && sourcePresenter?.animate && targetPresenter?.animate) {
      animations = [sourcePresenter.animate([{ opacity: 1 }, { opacity: 0 }], { duration: ms, easing: 'linear', fill: 'both' }),
        targetPresenter.animate([{ opacity: 0 }, { opacity: 1 }], { duration: ms, easing: 'linear', fill: 'both' })]
      const animateZoom = (from: number) => {
        for (const [presenter, correction] of [[zoomedInPresenterRef.value, 1], [zoomedOutPresenterRef.value, 2]] as const) {
          if (presenter) animations.push(presenter.animate([{ transform: `scale(${from * correction})` }, { transform: `scale(${endFactor * correction})` }],
            { duration: 250, easing: 'cubic-bezier(0.1,0.9,0.2,1)', fill: 'both' }))
        }
      }
      if (request?.Gesture) {
        await Promise.all(animations.map(animation => animation.finished.catch(() => undefined)))
        if (pointers.size >= 2) await new Promise<void>(resolve => { releaseGesture = resolve })
        if (activeSequence !== sequence) return
        const from = zoomFactor.value
        transitionFactor.value = from; gestureFactor.value = null
        animateZoom(from)
      } else animateZoom(startFactor)
      await Promise.all(animations.map(animation => animation.finished.catch(() => undefined)))
    }
    if (activeSequence !== sequence) return
    cancelAnimations(); gestureFactor.value = null; transitionFactor.value = null; gestureTransitionActive = false; zoomOrigin.value = '50% 50%'; isChangingView.value = false
    source?.CompleteViewChangeFrom?.(args.SourceItem, args.DestinationItem)
    destination?.CompleteViewChangeTo?.(args.SourceItem, args.DestinationItem)
    source?.CompleteViewChange?.(); destination?.CompleteViewChange?.()
    takeFocusAtCompletion = false
    emit('ViewChangeCompleted', sender, args); resolveXamlHandler(attrs.ViewChangeCompleted, instance)?.(sender, args)
    const pending = queued; queued = undefined
    if (pending) changeView(pending.target, pending.request)
  })
  return true
}
const onSemanticZoomRequest = (event: Event) => { if (changeView(!isZoomedIn.value, (event as CustomEvent<Request>).detail)) event.stopPropagation() }
const showButton = (event: PointerEvent) => {
  if (event.pointerType === 'touch' || !zoomButtonEnabled.value || !isZoomedIn.value || !isEnabled.value || isChangingView.value) return
  isZoomOutButtonVisible.value = true; clearTimeout(buttonTimer); buttonTimer = setTimeout(hideButton, duration() + 3000)
}
const pointers = new Map<number, { x: number; y: number }>()
let pinchDistance = 0, pinchStart = 1
const distance = () => { const points = [...pointers.values()]; return points.length === 2 ? Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y) : 0 }
const resetGesture = () => {
  const ids = [...pointers.keys()]
  if (isChangingView.value && gestureFactor.value !== null) transitionFactor.value = gestureFactor.value
  pointers.clear(); gestureFactor.value = null; pinchDistance = 0
  releaseGesture?.(); releaseGesture = undefined
  for (const id of ids) if (rootRef.value?.hasPointerCapture?.(id)) rootRef.value.releasePointerCapture(id)
}
const onPointerDown = (event: PointerEvent) => {
  if (!isEnabled.value || !canChangeViews.value || zoomMode.value === 'Disabled' || event.pointerType === 'mouse') return
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
  if (pointers.size === 2) {
    pinchDistance = distance(); pinchStart = isZoomedIn.value ? 1 : .5
    for (const id of pointers.keys()) rootRef.value?.setPointerCapture?.(id)
  }
}
const onPointerMove = (event: PointerEvent) => {
  showButton(event)
  if (!pointers.has(event.pointerId)) return
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
  if (!pinchDistance || isChangingView.value && !gestureTransitionActive || pointers.size !== 2) return
  const factor = Math.max(.5, Math.min(1, pinchStart * distance() / pinchDistance)); gestureFactor.value = factor; event.preventDefault()
  const points = [...pointers.values()], ZoomPoint = { X: (points[0].x + points[1].x) / 2, Y: (points[0].y + points[1].y) / 2 }
  if (isChangingView.value) return
  if (isZoomedIn.value && factor < .9) changeView(false, { ZoomPoint, Gesture: true })
  else if (!isZoomedIn.value && factor > .6) changeView(true, { ZoomPoint, Gesture: true })
}
const onPointerEnd = (event: PointerEvent) => {
  pointers.delete(event.pointerId)
  if (rootRef.value?.hasPointerCapture?.(event.pointerId)) rootRef.value.releasePointerCapture(event.pointerId)
  if (pointers.size < 2) { pinchDistance = 0; releaseGesture?.(); releaseGesture = undefined; if (!isChangingView.value) gestureFactor.value = null }
}
const onLegacyTouch = (event: TouchEvent) => { if (zoomMode.value === 'Enabled' && (pointers.size > 1 || isChangingView.value)) { event.stopPropagation(); event.preventDefault() } }
const onWheel = (event: WheelEvent) => { if (event.ctrlKey && zoomMode.value !== 'Disabled' && event.deltaY && changeView(event.deltaY < 0, { ZoomPoint: { X: event.clientX, Y: event.clientY } })) { event.preventDefault(); event.stopPropagation() } }
const onKeyDown = (event: KeyboardEvent) => {
  if (!event.ctrlKey || event.altKey || event.metaKey) return
  const zoomOut = ['-', '_'].includes(event.key) || event.code === 'NumpadSubtract', zoomIn = ['+', '='].includes(event.key) || event.code === 'NumpadAdd'
  if ((zoomIn || zoomOut) && changeView(zoomIn)) { event.preventDefault(); event.stopPropagation() }
}
provide(xamlScopeKey, {
  ZoomOutButton_Click: () => changeView(false), get templateIsEnabled() { return isEnabled.value }, get zoomOutLabel() { return t('text.zoom-out') },
  get templateHorizontalScrollMode() { return value('ScrollViewer.HorizontalScrollMode') }, get templateVerticalScrollMode() { return value('ScrollViewer.VerticalScrollMode') },
  get templateHorizontalRailEnabled() { return value('ScrollViewer.IsHorizontalRailEnabled') }, get templateVerticalRailEnabled() { return value('ScrollViewer.IsVerticalRailEnabled') },
  get templateZoomMode() { return zoomMode.value }
})
watch(() => value('IsZoomedInViewActive'), target => { if (typeof target === 'boolean') changeView(target) })
watch([isEnabled, canChangeViews, zoomButtonEnabled], () => { if (!isEnabled.value || !canChangeViews.value) { resetGesture(); queued = undefined }; if (!zoomButtonEnabled.value || !isEnabled.value) hideButton() })
onMounted(() => { syncViews(); window.addEventListener('blur', resetGesture) })
onBeforeUnmount(() => { sequence++; cancelAnimations(); hideButton(); resetGesture(); window.removeEventListener('blur', resetGesture) })
defineExpose({ ToggleActiveView: sender.ToggleActiveView, StartBringIntoView: sender.StartBringIntoView,
  IsZoomedInViewActive: computed({ get: () => isZoomedIn.value, set: target => { changeView(target) } }),
  ZoomedInView: computed(() => view(true)), ZoomedOutView: computed(() => view(false)) })
</script>

<style scoped>
.win-semantic-zoom { position: relative; display: block; box-sizing: border-box; width: 100%; height: 100%; min-width: 0; min-height: 0; overflow: hidden; isolation: isolate; touch-action: pan-x pan-y; }
.semantic-zoom-scroll-viewer { position: absolute; inset: 0; width: 100%; height: 100%; }
.semantic-zoom-scroll-viewer :deep(.scroll-content) { width: 100%; height: 100%; min-height: 100%; }
.semantic-zoom-surface { position: relative; display: grid; grid-template-columns: minmax(0,1fr); grid-template-rows: minmax(0,1fr); width: 100%; height: 100%; min-width: 0; min-height: 0; box-sizing: border-box; overflow: hidden; border: 0 solid transparent; }
.semantic-zoom-presenter { position: relative; grid-area: 1 / 1; width: 100%; height: 100%; box-sizing: border-box; min-width: 0; min-height: 0; overflow: hidden; opacity: 0; visibility: hidden; pointer-events: none; transform-origin: center; }
.win-semantic-zoom :deep(.semantic-zoom-view-changing .scrollbar) { visibility: hidden; }
.semantic-zoom-presenter :deep(.win-grid-view), .semantic-zoom-presenter :deep(.win-list-view) { width: 100%; height: 100%; min-width: 0; min-height: 0; }
.zoomed-in .zoomed-in-presenter, .zoomed-out .zoomed-out-presenter { opacity: 1; visibility: visible; pointer-events: auto; }
.is-changing-view .semantic-zoom-presenter { visibility: visible; pointer-events: none; will-change: opacity; }
.win-semantic-zoom :deep(.zoom-out-button) { position: absolute; right: 0; bottom: 0; z-index: 2; min-width: 12px; min-height: 12px; opacity: 0; visibility: hidden; pointer-events: none; transition: opacity 167ms linear; }
.win-semantic-zoom :deep(.zoom-out-button.visible) { opacity: 1; visibility: visible; pointer-events: auto; }
.is-disabled { pointer-events: none; }
@media (prefers-reduced-motion: reduce) { .win-semantic-zoom :deep(.zoom-out-button) { transition: none; } }
</style>
