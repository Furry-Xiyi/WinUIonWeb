<template>
  <Grid x:Name="PART_Root" v-bind="rootAttrs" class="win-scroll-view"
        Width="{x:Bind properties.Width, Mode=OneWay}" Height="{x:Bind properties.Height, Mode=OneWay}"
        MinWidth="{x:Bind properties.MinWidth, Mode=OneWay}" MinHeight="{x:Bind properties.MinHeight, Mode=OneWay}"
        MaxWidth="{x:Bind properties.MaxWidth, Mode=OneWay}" MaxHeight="{x:Bind properties.MaxHeight, Mode=OneWay}"
        Margin="{x:Bind properties.Margin, Mode=OneWay}"
        HorizontalAlignment="{x:Bind properties.HorizontalAlignment, Mode=OneWay}" VerticalAlignment="{x:Bind properties.VerticalAlignment, Mode=OneWay}"
        BorderBrush="{x:Bind properties.BorderBrush, Mode=OneWay}" BorderThickness="{x:Bind properties.BorderThickness, Mode=OneWay}"
        CornerRadius="{x:Bind properties.CornerRadius, Mode=OneWay}">
    <Grid.RowDefinitions><RowDefinition Height="*" /><RowDefinition Height="Auto" /></Grid.RowDefinitions>
    <Grid.ColumnDefinitions><ColumnDefinition Width="*" /><ColumnDefinition Width="Auto" /></Grid.ColumnDefinitions>
    <ScrollPresenter x:Name="PART_ScrollPresenter" Grid.ColumnSpan="2" Grid.RowSpan="2"><slot /></ScrollPresenter>
    <Grid Grid.Row="1" class="horizontal-scrollbar-host" Visibility="{x:Bind horizontalVisibility, Mode=OneWay}" Padding="{ThemeResource ScrollViewScrollBarsMargin}">
      <ScrollBar x:Name="PART_HorizontalScrollBar" Orientation="Horizontal" SmallChange="16" LargeChange="{x:Bind ScrollBars.Horizontal.ViewportSize, Mode=OneWay}" Minimum="0" Maximum="{x:Bind ScrollBars.Horizontal.Maximum, Mode=OneWay}" ViewportSize="{x:Bind ScrollBars.Horizontal.ViewportSize, Mode=OneWay}" Value="{x:Bind ScrollBars.Horizontal.Value, Mode=OneWay}" IndicatorMode="{x:Bind ScrollBars.IndicatorMode, Mode=OneWay}" IsEnabled="{x:Bind enabled, Mode=OneWay}" Scroll="HorizontalScrollBar_Scroll" />
    </Grid>
    <Grid Grid.Column="1" class="vertical-scrollbar-host" Visibility="{x:Bind verticalVisibility, Mode=OneWay}" Padding="{ThemeResource ScrollViewScrollBarsMargin}">
      <ScrollBar x:Name="PART_VerticalScrollBar" Orientation="Vertical" SmallChange="16" LargeChange="{x:Bind ScrollBars.Vertical.ViewportSize, Mode=OneWay}" Minimum="0" Maximum="{x:Bind ScrollBars.Vertical.Maximum, Mode=OneWay}" ViewportSize="{x:Bind ScrollBars.Vertical.ViewportSize, Mode=OneWay}" Value="{x:Bind ScrollBars.Vertical.Value, Mode=OneWay}" IndicatorMode="{x:Bind ScrollBars.IndicatorMode, Mode=OneWay}" IsEnabled="{x:Bind enabled, Mode=OneWay}" Scroll="VerticalScrollBar_Scroll" />
    </Grid>
    <ScrollBarsSeparator x:Name="PART_ScrollBarsSeparator" Grid.Row="1" Grid.Column="1" />
  </Grid>
</template>
<script setup lang="ts">
import { cloneVNode, computed, defineComponent, Fragment, getCurrentInstance, h, inject, nextTick, onBeforeUnmount, onMounted, provide, reactive, ref, shallowReactive, useAttrs, useSlots, watch, withDirectives, unref, type CSSProperties, type VNode } from 'vue'
import Grid from './Grid.vue'
import RowDefinition from './RowDefinition.vue'
import ColumnDefinition from './ColumnDefinition.vue'
import ScrollBar from './ScrollBar.vue'
import { scrollBarOwnerKey, type ScrollBarScrollEventArgs } from './scrollBarOwner'
import { uiSettings } from './uiSettings'
import { useAcrylicBrushStyle } from './AcrylicBrush'
import { vAcrylicBrush } from './acrylicBrushVisual'
import { boolValue, xamlThickness } from './layout'
import { resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlNameScopeKey, xamlScopeKey } from './xamlRuntime'

defineOptions({ inheritAttrs: false })
type ScrollOptions = { AnimationMode?: 'Auto' | 'Enabled' | 'Disabled'; SnapPointsMode?: 'Default' | 'Ignore' }
type Point = { x: number; y: number }
type Vector = Point & { z?: number }
type Easing = { Type: 'CubicBezier'; ControlPoint1: Point; ControlPoint2: Point } | { Type: 'Step'; StepCount: number }
type KeyFrame = { Progress: number; Value: Vector | number; EasingFunction?: Easing }
type CompositionAnimation = { Duration: number; KeyFrames: KeyFrame[]; Compositor: typeof compositor; InsertKeyFrame: (progress: number, value: Vector | number, easing?: Easing) => void }
const props = withDefaults(defineProps<{
  Content?: unknown; ContentOrientation?: string; HorizontalScrollBarVisibility?: string; VerticalScrollBarVisibility?: string;
  HorizontalScrollChainMode?: string; VerticalScrollChainMode?: string; ZoomChainMode?: string;
  HorizontalScrollRailMode?: string; VerticalScrollRailMode?: string; HorizontalScrollMode?: string; VerticalScrollMode?: string;
  ZoomMode?: string; IgnoredInputKinds?: string | number; MinZoomFactor?: number | string; MaxZoomFactor?: number | string;
  HorizontalAnchorRatio?: number | string; VerticalAnchorRatio?: number | string; IsTabStop?: boolean | string; IsEnabled?: boolean | string;
  Width?: number | string; Height?: number | string; MinWidth?: number | string; MinHeight?: number | string; MaxWidth?: number | string; MaxHeight?: number | string;
  HorizontalAlignment?: string; VerticalAlignment?: string; Background?: string | object; BorderBrush?: string; BorderThickness?: number | string; CornerRadius?: number | string; Padding?: number | string; Margin?: number | string;
}>(), {
  ContentOrientation: 'Vertical', HorizontalScrollBarVisibility: 'Auto', VerticalScrollBarVisibility: 'Auto',
  HorizontalScrollChainMode: 'Auto', VerticalScrollChainMode: 'Auto', ZoomChainMode: 'Auto',
  HorizontalScrollRailMode: 'Enabled', VerticalScrollRailMode: 'Enabled', HorizontalScrollMode: 'Auto', VerticalScrollMode: 'Auto',
  ZoomMode: 'Disabled', IgnoredInputKinds: 'None', MinZoomFactor: 0.1, MaxZoomFactor: 10, HorizontalAnchorRatio: 0, VerticalAnchorRatio: 0,
  IsTabStop: false, IsEnabled: true, Width: '', Height: '', MinWidth: 0, MinHeight: 0, MaxWidth: '', MaxHeight: '',
  HorizontalAlignment: 'Stretch', VerticalAlignment: 'Stretch', Background: 'Transparent', BorderBrush: '', BorderThickness: 0,
  CornerRadius: '{ThemeResource ControlCornerRadius}', Padding: 0, Margin: 0
})
const emit = defineEmits(['ExtentChanged', 'StateChanged', 'ViewChanged', 'ScrollAnimationStarting', 'ZoomAnimationStarting', 'ScrollCompleted', 'ZoomCompleted', 'ScrollStarting', 'ZoomStarting', 'AnchorRequested', 'BringingIntoView', 'Loaded'])
const instance = getCurrentInstance()
const attrs = useAttrs()
const rootAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([name]) =>
  !/^(?:x:Name|ExtentChanged|StateChanged|ViewChanged|ScrollAnimationStarting|ZoomAnimationStarting|ScrollCompleted|ZoomCompleted|ScrollStarting|ZoomStarting|AnchorRequested|BringingIntoView|Loaded)$/i.test(name)
)))
const slots = useSlots()
const inheritedScope = inject<Record<string, unknown>>(xamlScopeKey, {})
const overrides = reactive<Record<string, unknown>>({})
const properties = computed(() => Object.fromEntries(Object.entries(props).map(([key, value]) => [key, key in overrides ? overrides[key] : resolveXamlValue(value, instance)])))
const property = (name: string) => properties.value[name]
const enabled = computed(() => boolValue(property('IsEnabled')))
const viewport = ref<HTMLDivElement | null>(null)
const content = ref<HTMLDivElement | null>(null)
const surface = ref<HTMLDivElement | null>(null)
const metrics = reactive({ ViewportWidth: 0, ViewportHeight: 0, ExtentWidth: 0, ExtentHeight: 0, HorizontalOffset: 0, VerticalOffset: 0 })
const zoom = ref(1)
const state = ref('Idle')
const currentAnchor = ref<Element | null>(null)
const anchorCandidates = new Set<Element>()
const scrollableWidth = computed(() => Math.max(0, metrics.ExtentWidth * zoom.value - metrics.ViewportWidth))
const scrollableHeight = computed(() => Math.max(0, metrics.ExtentHeight * zoom.value - metrics.ViewportHeight))
const computedMode = (axis: 'Horizontal' | 'Vertical') => {
  const mode = String(property(`${axis}ScrollMode`))
  return mode === 'Auto' ? property('ZoomMode') === 'Enabled' || (axis === 'Horizontal' ? scrollableWidth.value : scrollableHeight.value) > 0 ? 'Enabled' : 'Disabled' : mode
}
const visibility = (axis: 'Horizontal' | 'Vertical') => property(`${axis}ScrollBarVisibility`) === 'Hidden' ? 'Collapsed' : property(`${axis}ScrollBarVisibility`) === 'Visible' || (axis === 'Horizontal' ? scrollableWidth.value : scrollableHeight.value) > 0 ? 'Visible' : 'Collapsed'
const horizontalVisibility = computed(() => visibility('Horizontal'))
const verticalVisibility = computed(() => visibility('Vertical'))
const indicator = ref<'NoIndicator' | 'TouchIndicator' | 'MouseIndicator'>('NoIndicator')
const ScrollBars = computed(() => {
  metrics.HorizontalOffset; metrics.VerticalOffset; metrics.ViewportWidth; metrics.ViewportHeight; metrics.ExtentWidth; metrics.ExtentHeight; zoom.value
  const port = viewport.value
  return {
    Vertical: { Maximum: Math.max(0, (port?.scrollHeight ?? 0) - (port?.clientHeight ?? 0)), ViewportSize: port?.clientHeight ?? 0, Value: metrics.VerticalOffset },
    Horizontal: { Maximum: Math.max(0, (port?.scrollWidth ?? 0) - (port?.clientWidth ?? 0)), ViewportSize: port?.clientWidth ?? 0, Value: metrics.HorizontalOffset },
    IndicatorMode: indicator.value === 'TouchIndicator' ? 'TouchIndicator' : uiSettings.AutoHideScrollBars ? indicator.value === 'NoIndicator' ? 'None' : indicator.value : 'MouseIndicator'
  }
})
const VerticalScrollBar_Scroll = (_sender: unknown, args: ScrollBarScrollEventArgs) => { setOffsets(metrics.HorizontalOffset, args.NewValue); if (args.ScrollEventType === 'EndScroll') changeState('Idle') }
const HorizontalScrollBar_Scroll = (_sender: unknown, args: ScrollBarScrollEventArgs) => { setOffsets(args.NewValue, metrics.VerticalOffset); if (args.ScrollEventType === 'EndScroll') changeState('Idle') }
provide(scrollBarOwnerKey, {
  autoHide: () => uiSettings.AutoHideScrollBars,
  onHover: (axis, over) => { hoveredBar.value = over ? axis : ''; if (!over) showIndicator() },
  onPointerActivity: type => { lastPointerKind = type; showIndicator() },
  onInteraction: (axis, active) => { pressedBar.value = active ? axis : ''; if (active) { complete(true); changeState('Interaction') } else { changeState('Idle'); showIndicator() } }
})
const hoveredBar = ref('')
const pressedBar = ref('')
let lastPointerKind = 'mouse'
let indicatorTimer: ReturnType<typeof setTimeout> | undefined
let settleTimer: ReturnType<typeof setTimeout> | undefined
let observer: ResizeObserver | undefined
let mutationObserver: MutationObserver | undefined
let frame = 0
let measureFrame = 0
let correlation = 0
let operation: { Id: number; Kind: 'Scroll' | 'Zoom' } | null = null
const publicSender = new Proxy({} as Record<string, unknown>, { get: (_target, key) => unref(exposed[key as string]), set: (_target, key, next) => { const current = exposed[key as string] as { value?: unknown }; if (current && typeof current === 'object' && 'value' in current) current.value = next; else exposed[key as string] = next; return true } })
const event = (name: string, args: Record<string, unknown> = {}) => {
  emit(name, publicSender, args)
  if (!attrs[`on${name}`]) resolveXamlHandler(attrs[name], instance)?.(publicSender, args)
}
const changeState = (next: string) => { if (state.value !== next) { state.value = next; event('StateChanged') } }
const showIndicator = (type = lastPointerKind === 'touch' ? 'TouchIndicator' : 'MouseIndicator' as 'MouseIndicator' | 'TouchIndicator') => {
  if (indicatorTimer) clearTimeout(indicatorTimer)
  indicatorTimer = undefined
  if (!enabled.value) { indicator.value = 'NoIndicator'; return }
  if (!uiSettings.AutoHideScrollBars) { indicator.value = 'MouseIndicator'; return }
  // Mouse indicators dominate until the current indication has ended.
  indicator.value = type === 'MouseIndicator' || indicator.value === 'MouseIndicator' ? 'MouseIndicator' : type
  const scheduleHide = () => {
    indicatorTimer = setTimeout(() => {
      indicatorTimer = undefined
      if (hoveredBar.value || pressedBar.value || state.value === 'Interaction') { scheduleHide(); return }
      indicator.value = 'NoIndicator'
    }, indicator.value === 'TouchIndicator' ? 500 : 2000)
  }
  if (!hoveredBar.value && !pressedBar.value) scheduleHide()
}
const ScrollView_PointerEntered = (e: PointerEvent) => {
  if (e.pointerType !== 'touch') { lastPointerKind = e.pointerType || 'mouse'; showIndicator('MouseIndicator') }
}
const ScrollView_PointerMoved = (e: PointerEvent) => {
  if (e.pointerType !== 'touch' && enabled.value) { lastPointerKind = e.pointerType || 'mouse'; showIndicator('MouseIndicator') }
}
const ScrollView_PointerExited = (e: PointerEvent) => {
  if (e.pointerType !== 'touch') { hoveredBar.value = ''; showIndicator('MouseIndicator') }
}
const ignored = (kind: 'Touch' | 'Pen' | 'MouseWheel' | 'Keyboard') => {
  if (!enabled.value) return true
  const flags = property('IgnoredInputKinds')
  return typeof flags === 'number' ? (flags & ({ Touch: 1, Pen: 2, MouseWheel: 4, Keyboard: 8 }[kind])) !== 0 : String(flags).split(/[ ,|]+/).some(value => value === kind || value === 'All')
}
const complete = (interrupted = false) => {
  if (frame) cancelAnimationFrame(frame)
  frame = 0
  void interrupted
  const completed = operation; operation = null; changeState('Idle')
  if (completed) event(completed.Kind === 'Scroll' ? 'ScrollCompleted' : 'ZoomCompleted', { CorrelationId: completed.Id })
}
const begin = (kind: 'Scroll' | 'Zoom', nextState: string) => { complete(true); operation = { Id: ++correlation, Kind: kind }; changeState(nextState); return operation.Id }
const syncOffsets = () => {
  const node = viewport.value
  if (!node) return false
  const horizontal = node.scrollLeft, vertical = node.scrollTop
  const changed = Math.abs(metrics.HorizontalOffset - horizontal) > 0.001 || Math.abs(metrics.VerticalOffset - vertical) > 0.001
  metrics.HorizontalOffset = horizontal; metrics.VerticalOffset = vertical
  return changed
}
const setOffsets = (horizontal: number, vertical: number) => {
  const node = viewport.value
  if (!node) return
  // ScrollBar.Maximum is the browser ScrollPresenter's actual range. Use the
  // same rounded DOM range here so a thumb dragged to its terminal position
  // reaches the exact native end at fractional zoom/viewport sizes.
  const maxHorizontal = Math.max(0, node.scrollWidth - node.clientWidth)
  const maxVertical = Math.max(0, node.scrollHeight - node.clientHeight)
  const clampEnd = (next: number, max: number) => Math.abs(max - next) < 0.5 ? max : Math.max(0, Math.min(max, next))
  node.scrollLeft = clampEnd(Number.isFinite(horizontal) ? horizontal : metrics.HorizontalOffset, maxHorizontal)
  node.scrollTop = clampEnd(Number.isFinite(vertical) ? vertical : metrics.VerticalOffset, maxVertical)
  if (syncOffsets()) { event('ViewChanged'); showIndicator() }
}
const chooseAnchor = () => {
  const bounds = viewport.value?.getBoundingClientRect()
  if (!bounds) return
  const target = { x: bounds.left + bounds.width * Number(property('HorizontalAnchorRatio')), y: bounds.top + bounds.height * Number(property('VerticalAnchorRatio')) }
  const candidates = Array.from(anchorCandidates).filter(node => node.isConnected && content.value?.contains(node))
  let distance = Infinity, selected: Element | null = null
  for (const candidate of candidates) { const rect = candidate.getBoundingClientRect(); const next = (rect.left - target.x) ** 2 + (rect.top - target.y) ** 2; if (next < distance) { selected = candidate; distance = next } }
  const args: Record<string, unknown> = { AnchorCandidates: candidates, AnchorElement: selected }; event('AnchorRequested', args)
  currentAnchor.value = args.AnchorElement instanceof Element ? args.AnchorElement : selected
}
const measure = () => {
  if (!viewport.value || !content.value) return
  const oldWidth = metrics.ExtentWidth, oldHeight = metrics.ExtentHeight
  metrics.ViewportWidth = viewport.value.clientWidth; metrics.ViewportHeight = viewport.value.clientHeight
  metrics.ExtentWidth = content.value.offsetWidth; metrics.ExtentHeight = content.value.offsetHeight
  if (oldWidth !== metrics.ExtentWidth || oldHeight !== metrics.ExtentHeight) { event('ExtentChanged'); chooseAnchor() }
  setOffsets(metrics.HorizontalOffset, metrics.VerticalOffset)
}
const queueMeasure = () => { if (!measureFrame) measureFrame = requestAnimationFrame(() => { measureFrame = 0; measure() }) }
const clampZoom = (value: number) => Math.max(Math.max(0.01, Number(property('MinZoomFactor'))), Math.min(Math.max(Number(property('MinZoomFactor')), Number(property('MaxZoomFactor'))), value))
const setZoom = (value: number, center: Point, startZoom = zoom.value, startOffsets: Point = { x: metrics.HorizontalOffset, y: metrics.VerticalOffset }) => {
  const next = clampZoom(value)
  if (next === zoom.value) return
  zoom.value = next
  if (surface.value) { surface.value.style.width = `${Math.max(metrics.ViewportWidth, metrics.ExtentWidth * next)}px`; surface.value.style.height = `${Math.max(metrics.ViewportHeight, metrics.ExtentHeight * next)}px` }
  if (content.value) content.value.style.transform = `scale(${next})`
  setOffsets((startOffsets.x + center.x) * next / startZoom - center.x, (startOffsets.y + center.y) * next / startZoom - center.y)
  event('ViewChanged')
}
const cubicBezier = (first: Point, second: Point, progress: number) => {
  const sample = (a: number, b: number, t: number) => 3 * a * (1 - t) ** 2 * t + 3 * b * (1 - t) * t ** 2 + t ** 3
  let low = 0, high = 1, parameter = progress
  for (let step = 0; step < 16; step++) { const x = sample(first.x, second.x, parameter); if (Math.abs(x - progress) < 0.00001) break; if (x < progress) low = parameter; else high = parameter; parameter = (low + high) / 2 }
  return sample(first.y, second.y, parameter)
}
const compositionEase = (progress: number, easing?: Easing) => easing?.Type === 'Step' ? Math.floor(progress * easing.StepCount) / easing.StepCount : cubicBezier(easing?.ControlPoint1 ?? { x: 0.1, y: 0.9 }, easing?.ControlPoint2 ?? { x: 0.2, y: 1 }, progress)
const compositor = {
  CreateVector3KeyFrameAnimation: () => createAnimation(), CreateScalarKeyFrameAnimation: () => createAnimation(),
  CreateCubicBezierEasingFunction: (ControlPoint1: Point, ControlPoint2: Point): Easing => ({ Type: 'CubicBezier', ControlPoint1, ControlPoint2 }),
  CreateStepEasingFunction: (StepCount = 1): Easing => ({ Type: 'Step', StepCount })
}
const createAnimation = (): CompositionAnimation => ({ Duration: 250, KeyFrames: [], Compositor: compositor, InsertKeyFrame(progress, value, easing) { this.KeyFrames.push({ Progress: progress, Value: value, EasingFunction: easing }); this.KeyFrames.sort((a, b) => a.Progress - b.Progress) } })
const evaluateAnimation = (animation: CompositionAnimation, progress: number, initial: Vector | number): Vector | number => {
  const frames: KeyFrame[] = [{ Progress: 0, Value: initial }, ...animation.KeyFrames]
  const index = frames.findIndex(item => item.Progress >= progress)
  const last = frames[index < 0 ? frames.length - 1 : Math.max(1, index)]!, previous = frames[index < 0 ? frames.length - 1 : Math.max(0, index - 1)]!
  const easing = compositionEase(Math.min(1, Math.max(0, (progress - previous.Progress) / Math.max(0.000001, last.Progress - previous.Progress))), last.EasingFunction)
  if (typeof last.Value === 'number' && typeof previous.Value === 'number') return previous.Value + (last.Value - previous.Value) * easing
  const from = previous.Value as Vector, to = last.Value as Vector
  return { x: from.x + (to.x - from.x) * easing, y: from.y + (to.y - from.y) * easing }
}
const animated = (options?: ScrollOptions) => options?.AnimationMode !== 'Disabled' && (options?.AnimationMode === 'Enabled' || !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
const ScrollTo = (horizontal: number, vertical: number, options?: ScrollOptions) => {
  if (!viewport.value || !Number.isFinite(horizontal) || !Number.isFinite(vertical)) return -1
  const start = { x: metrics.HorizontalOffset, y: metrics.VerticalOffset }, target = { x: Math.max(0, Math.min(scrollableWidth.value, horizontal)), y: Math.max(0, Math.min(scrollableHeight.value, vertical)) }
  const id = begin('Scroll', animated(options) ? 'Animation' : 'Idle')
  event('ScrollStarting', { CorrelationId: id, HorizontalOffset: target.x, VerticalOffset: target.y })
  if (!animated(options) || start.x === target.x && start.y === target.y) { setOffsets(target.x, target.y); queueMicrotask(() => { if (operation?.Id === id) complete() }); return id }
  const animation = createAnimation(); animation.Duration = Math.min(1000, Math.max(50, Math.hypot(target.x - start.x, target.y - start.y) * 5)); animation.InsertKeyFrame(1, target)
  const args = { CorrelationId: id, StartPosition: start, EndPosition: target, Animation: animation }; event('ScrollAnimationStarting', args)
  const started = performance.now()
  const tick = (timestamp: number) => { if (operation?.Id !== id) return; const progress = Math.min(1, (timestamp - started) / Math.max(1, Number(args.Animation.Duration))); const position = evaluateAnimation(args.Animation, progress, start) as Vector; setOffsets(position.x, position.y); if (progress < 1) frame = requestAnimationFrame(tick); else { setOffsets(target.x, target.y); complete() } }
  frame = requestAnimationFrame(tick); return id
}
const ScrollBy = (horizontal: number, vertical: number, options?: ScrollOptions) => ScrollTo(metrics.HorizontalOffset + horizontal, metrics.VerticalOffset + vertical, options)
const ZoomTo = (factor: number, centerPoint?: Point | null, options?: ScrollOptions) => {
  if (!viewport.value || !Number.isFinite(factor)) return -1
  const center = centerPoint ?? { x: metrics.ViewportWidth / 2, y: metrics.ViewportHeight / 2 }, start = zoom.value, target = clampZoom(factor), offsets = { x: metrics.HorizontalOffset, y: metrics.VerticalOffset }
  const id = begin('Zoom', animated(options) ? 'Animation' : 'Idle'); event('ZoomStarting', { CorrelationId: id, ZoomFactor: target, CenterPoint: center })
  if (!animated(options) || target === start) { setZoom(target, center, start, offsets); queueMicrotask(() => { if (operation?.Id === id) complete() }); return id }
  const animation = createAnimation(); animation.Duration = Math.min(1000, Math.max(50, Math.abs(target - start) * 250)); animation.InsertKeyFrame(1, target)
  const args = { CorrelationId: id, CenterPoint: center, StartZoomFactor: start, EndZoomFactor: target, Animation: animation }; event('ZoomAnimationStarting', args)
  const started = performance.now()
  const tick = (timestamp: number) => { if (operation?.Id !== id) return; const progress = Math.min(1, (timestamp - started) / Math.max(1, Number(args.Animation.Duration))); setZoom(evaluateAnimation(args.Animation, progress, start) as number, center, start, offsets); if (progress < 1) frame = requestAnimationFrame(tick); else complete() }
  frame = requestAnimationFrame(tick); return id
}
const ZoomBy = (delta: number, center?: Point | null, options?: ScrollOptions) => ZoomTo(zoom.value + delta, center, options)
const vector = (value: Point | [number, number]): Point => Array.isArray(value) ? { x: value[0], y: value[1] } : value
const AddScrollVelocity = (offsetsVelocity: Point | [number, number], inertiaDecayRate?: Point | [number, number] | null) => {
  if (!viewport.value) return -1
  const velocity = vector(offsetsVelocity), rate = inertiaDecayRate ? vector(inertiaDecayRate) : { x: 0.9995, y: 0.9995 }
  // The controller velocity includes the 30 units/s InteractionTracker baseline.
  // A zero decay vector is the Gallery's request for constant velocity.
  let vx = Math.sign(velocity.x) * Math.max(0, Math.abs(velocity.x) - 30), vy = Math.sign(velocity.y) * Math.max(0, Math.abs(velocity.y) - 30)
  const id = begin('Scroll', 'Inertia'); let previousTime = performance.now()
  const tick = (timestamp: number) => {
    if (operation?.Id !== id) return
    const elapsed = Math.min(50, timestamp - previousTime); previousTime = timestamp
    const x = metrics.HorizontalOffset, y = metrics.VerticalOffset
    setOffsets(x + vx * elapsed / 1000, y + vy * elapsed / 1000)
    vx *= rate.x === 0 ? 1 : Math.pow(rate.x, elapsed); vy *= rate.y === 0 ? 1 : Math.pow(rate.y, elapsed)
    if (Math.abs(vx) < 0.1 && Math.abs(vy) < 0.1 || metrics.HorizontalOffset === x && metrics.VerticalOffset === y) complete()
    else frame = requestAnimationFrame(tick)
  }
  frame = requestAnimationFrame(tick); return id
}
const AddZoomVelocity = (velocity: number, center?: Point | null, inertiaDecayRate = 0.995) => {
  const point = center ?? { x: metrics.ViewportWidth / 2, y: metrics.ViewportHeight / 2 }, id = begin('Zoom', 'Inertia')
  let speed = velocity, previousTime = performance.now()
  const tick = (timestamp: number) => { if (operation?.Id !== id) return; const elapsed = Math.min(50, timestamp - previousTime); previousTime = timestamp; const before = zoom.value; setZoom(before + speed * elapsed / 1000, point); speed *= Math.pow(inertiaDecayRate, elapsed); if (Math.abs(speed) < 0.001 || zoom.value === before) complete(); else frame = requestAnimationFrame(tick) }
  frame = requestAnimationFrame(tick); return id
}
const settle = () => { if (settleTimer) clearTimeout(settleTimer); settleTimer = setTimeout(() => { if (!operation && !pointers.size && !pressedBar.value) changeState('Idle') }, 120) }
const onScroll = () => { if (syncOffsets()) { if (!operation) changeState('Interaction'); event('ViewChanged'); showIndicator(); settle() } }
const onWheel = (e: WheelEvent) => {
  if (ignored('MouseWheel')) { e.preventDefault(); return }
  lastPointerKind = 'mouse'
  const rect = viewport.value?.getBoundingClientRect()
  if (e.ctrlKey && property('ZoomMode') === 'Enabled' && rect) { complete(true); changeState('Interaction'); setZoom(zoom.value * Math.exp(-e.deltaY / 300), { x: e.clientX - rect.left, y: e.clientY - rect.top }); showIndicator(); e.preventDefault(); settle(); return }
  complete(true)
  const multiplier = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? metrics.ViewportHeight : 1
  const horizontal = computedMode('Horizontal') === 'Enabled' ? (e.shiftKey ? e.deltaY : e.deltaX) * multiplier : 0, vertical = computedMode('Vertical') === 'Enabled' ? (e.shiftKey ? 0 : e.deltaY) * multiplier : 0
  const before = { x: metrics.HorizontalOffset, y: metrics.VerticalOffset }
  changeState('Interaction'); setOffsets(before.x + horizontal, before.y + vertical); settle()
  if (before.x !== metrics.HorizontalOffset || before.y !== metrics.VerticalOffset || horizontal !== 0 && property('HorizontalScrollChainMode') === 'Never' || vertical !== 0 && property('VerticalScrollChainMode') === 'Never') e.preventDefault()
}
const pointers = new Map<number, Point>()
const setPointerCaptureSafe = (node: HTMLElement | null, pointerId: number) => { try { node?.setPointerCapture(pointerId) } catch { /* synthetic/cancelled pointer */ } }
let lastPointer: Point | null = null
let rail: 'Horizontal' | 'Vertical' | null = null
let pinch: { distance: number; zoom: number; offsets: Point; center: Point } | null = null
const onPointerDown = (e: PointerEvent) => {
  lastPointerKind = e.pointerType || 'mouse'
  if (e.pointerType === 'touch') hoveredBar.value = ''
  showIndicator()
  if (e.pointerType !== 'touch' && e.pointerType !== 'pen' || ignored(e.pointerType === 'pen' ? 'Pen' : 'Touch')) return
  complete(true); pointers.set(e.pointerId, { x: e.clientX, y: e.clientY }); lastPointer = { x: e.clientX, y: e.clientY }; rail = null; changeState('Interaction'); showIndicator()
  setPointerCaptureSafe(viewport.value, e.pointerId)
  if (pointers.size === 2 && property('ZoomMode') === 'Enabled') { const [first, second] = Array.from(pointers.values()) as [Point, Point]; const rect = viewport.value!.getBoundingClientRect(); pinch = { distance: Math.hypot(second.x - first.x, second.y - first.y), zoom: zoom.value, offsets: { x: metrics.HorizontalOffset, y: metrics.VerticalOffset }, center: { x: (first.x + second.x) / 2 - rect.left, y: (first.y + second.y) / 2 - rect.top } } }
  e.preventDefault()
}
const onPointerMove = (e: PointerEvent) => {
  if (!pointers.has(e.pointerId)) return
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
  if (pinch && pointers.size === 2) { const [first, second] = Array.from(pointers.values()) as [Point, Point]; setZoom(pinch.zoom * Math.hypot(second.x - first.x, second.y - first.y) / Math.max(1, pinch.distance), pinch.center, pinch.zoom, pinch.offsets) }
  else if (lastPointer) { const dx = lastPointer.x - e.clientX, dy = lastPointer.y - e.clientY; if (!rail && Math.hypot(dx, dy) > 3) rail = Math.abs(dx) > Math.abs(dy) ? 'Horizontal' : 'Vertical'; setOffsets(metrics.HorizontalOffset + (computedMode('Horizontal') === 'Enabled' && !(rail === 'Vertical' && property('HorizontalScrollRailMode') === 'Enabled') ? dx : 0), metrics.VerticalOffset + (computedMode('Vertical') === 'Enabled' && !(rail === 'Horizontal' && property('VerticalScrollRailMode') === 'Enabled') ? dy : 0)); lastPointer = { x: e.clientX, y: e.clientY } }
  e.preventDefault()
}
const onPointerEnd = (e?: PointerEvent) => { if (e) { if (!pointers.has(e.pointerId)) return; pointers.delete(e.pointerId); if (viewport.value?.hasPointerCapture(e.pointerId)) viewport.value.releasePointerCapture(e.pointerId) } else pointers.clear(); pinch = null; lastPointer = pointers.size ? Array.from(pointers.values())[0]! : null; if (!pointers.size) { changeState('Idle'); showIndicator() } }
const onKeyDown = (e: KeyboardEvent) => {
  if (ignored('Keyboard') || e.target !== viewport.value) return
  const horizontal = metrics.HorizontalOffset, vertical = metrics.VerticalOffset
  let x = horizontal, y = vertical
  if (e.ctrlKey && property('ZoomMode') === 'Enabled' && ['+', '=', '-', '0'].includes(e.key)) { ZoomTo(e.key === '0' ? 1 : zoom.value * (e.key === '-' ? 0.9 : 1.1)); e.preventDefault(); return }
  if (e.key === 'ArrowDown') y += 16; else if (e.key === 'ArrowUp') y -= 16; else if (e.key === 'ArrowRight') x += 16; else if (e.key === 'ArrowLeft') x -= 16; else if (e.key === 'PageDown') y += metrics.ViewportHeight; else if (e.key === 'PageUp') y -= metrics.ViewportHeight; else if (e.key === 'Home') { y = 0; if (e.ctrlKey) x = 0 } else if (e.key === 'End') { y = scrollableHeight.value; if (e.ctrlKey) x = scrollableWidth.value } else return
  ScrollTo(computedMode('Horizontal') === 'Enabled' ? x : horizontal, computedMode('Vertical') === 'Enabled' ? y : vertical); e.preventDefault()
}
const onFocusIn = (e: FocusEvent) => {
  if (!(e.target instanceof HTMLElement) || e.target === viewport.value || !viewport.value) return
  const target = e.target.getBoundingClientRect(), view = viewport.value.getBoundingClientRect()
  const args = { TargetElement: e.target, Cancel: false, HorizontalOffset: metrics.HorizontalOffset + (target.left < view.left ? target.left - view.left : target.right > view.right ? target.right - view.right : 0), VerticalOffset: metrics.VerticalOffset + (target.top < view.top ? target.top - view.top : target.bottom > view.bottom ? target.bottom - view.bottom : 0) }
  event('BringingIntoView', args); if (!args.Cancel) setOffsets(args.HorizontalOffset, args.VerticalOffset)
}
// ScrollPresenter measures a vertical content tree with a finite width. The
// image decoder then preserves its aspect ratio, as XAML Image.Measure does.
const measureContentNodes = (nodes: VNode[]): VNode[] => nodes.map(node => {
  if (!node || typeof node !== 'object') return node
  const vertical = ['Vertical', 'Both'].includes(String(property('ContentOrientation')))
  const type = node.type as { __name?: string; name?: string }
  const clone = vertical && metrics.ViewportWidth > 0 && (type?.__name === 'Image' || type?.name === 'Image') && !node.props?.Width
    ? cloneVNode(node, { MaxWidth: Math.min(metrics.ViewportWidth, Number(node.props?.MaxWidth) || Infinity) }) : cloneVNode(node)
  if (node.type === Fragment && Array.isArray(node.children)) clone.children = measureContentNodes(node.children as VNode[])
  else if (node.children && typeof node.children === 'object' && !Array.isArray(node.children)) {
    const slotChildren = node.children as Record<string, any>
    clone.children = { ...slotChildren, ...(typeof slotChildren.default === 'function' ? { default: (...args: unknown[]) => measureContentNodes(slotChildren.default(...args)) } : {}) }
  }
  return clone
})
const ScrollPresenter = defineComponent({
  name: 'ScrollPresenter', inheritAttrs: false,
  setup(_, { attrs: partAttrs }) {
    const backgroundStyle = useAcrylicBrushStyle(() => property('Background'), instance)
    return () => withDirectives(h('div', { ref: viewport, class: ['win-scroll-presenter', `content-orientation-${String(property('ContentOrientation')).toLowerCase()}`], 'data-template-part': 'PART_ScrollPresenter', 'Grid.ColumnSpan': 2, 'Grid.RowSpan': 2, 'data-xaml-ref': partAttrs['data-xaml-ref'], tabindex: enabled.value && boolValue(property('IsTabStop')) ? 0 : -1, style: { ...backgroundStyle.value, margin: xamlThickness(property('Padding')), touchAction: ignored('Touch') ? 'auto' : 'none' } as CSSProperties, onScroll, onWheel, onPointerdown: onPointerDown, onPointermove: onPointerMove, onPointerup: onPointerEnd, onPointercancel: onPointerEnd, onLostpointercapture: onPointerEnd, onKeydown: onKeyDown, onFocusin: onFocusIn }, [h('div', { ref: surface, class: 'scroll-surface', style: { width: `${Math.max(metrics.ViewportWidth, metrics.ExtentWidth * zoom.value)}px`, height: `${Math.max(metrics.ViewportHeight, metrics.ExtentHeight * zoom.value)}px` } }, [h('div', { ref: content, class: 'scroll-content', style: { transform: `scale(${zoom.value})`, width: ['Vertical', 'Both'].includes(String(property('ContentOrientation'))) ? `${metrics.ViewportWidth}px` : 'max-content', minWidth: `${metrics.ViewportWidth}px`, minHeight: `${metrics.ViewportHeight}px` } }, measureContentNodes(slots.default?.() ?? []))])]), [[vAcrylicBrush, backgroundStyle.value]])
  }
})
// Run the official Storyboard targets independently. Interruptions preserve
// the current visual value; a quick press never removes the hover delay.
const storyboard = () => {
  const running = new Map<HTMLElement, Map<string, Animation>>()
  const animate = (node: HTMLElement | null, key: string, to: Record<string, string>, duration: number, delay = 0, easing = 'linear') => {
    if (!node) return
    const properties = Object.keys(to), computedStyle = getComputedStyle(node)
    const from = Object.fromEntries(properties.map(property => [property, computedStyle[property as keyof CSSStyleDeclaration]])) as Record<string, string>
    const animations = running.get(node) ?? new Map<string, Animation>()
    animations.get(key)?.cancel()
    Object.assign(node.style, from)
    const animation = node.animate([from, to], { duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : duration, delay, easing, fill: 'both' })
    animations.set(key, animation); running.set(node, animations)
    animation.onfinish = () => { if (animations.get(key) !== animation) return; Object.assign(node.style, to); animations.delete(key); animation.cancel() }
  }
  const clear = () => { for (const animations of running.values()) for (const animation of animations.values()) animation.cancel(); running.clear() }
  return { animate, clear }
}
const ScrollBarsSeparator = defineComponent({
  name: 'ScrollBarsSeparator', inheritAttrs: false,
  setup(_, { attrs: partAttrs }) {
    const node = ref<HTMLElement | null>(null), animation = storyboard()
    const visible = computed(() => horizontalVisibility.value === 'Visible' && verticalVisibility.value === 'Visible')
    const expanded = computed(() => visible.value && (!uiSettings.AutoHideScrollBars || enabled.value && indicator.value === 'MouseIndicator' && !!(hoveredBar.value || pressedBar.value)))
    watch([expanded, enabled], ([next]) => animation.animate(node.value, 'separator', { opacity: next ? '1' : '0' }, 100, !uiSettings.AutoHideScrollBars || !enabled.value ? 0 : next ? 400 : 2000), { flush: 'post', immediate: true })
    onBeforeUnmount(animation.clear)
    return () => h('div', { ...partAttrs, ref: node, class: ['scrollbar-separator', { expanded: expanded.value }], 'Grid.Row': 1, 'Grid.Column': 1, 'data-template-part': 'PART_ScrollBarsSeparator', style: { display: visible.value ? undefined : 'none', opacity: !uiSettings.AutoHideScrollBars ? 1 : undefined } })
  }
})
provide(xamlScopeKey, { ...inheritedScope, properties, enabled, ScrollBars, VerticalScrollBar_Scroll, HorizontalScrollBar_Scroll, horizontalVisibility, verticalVisibility, ScrollView_PointerEntered, ScrollView_PointerMoved, ScrollView_PointerExited })
provide(xamlNameScopeKey, shallowReactive<Record<string, unknown>>({}))
const exposed = { ScrollTo, ScrollBy, ZoomTo, ZoomBy, AddScrollVelocity, AddZoomVelocity,
  RegisterAnchorCandidate: (element: Element) => { anchorCandidates.add(element); chooseAnchor() }, UnregisterAnchorCandidate: (element: Element) => { anchorCandidates.delete(element); chooseAnchor() },
  CurrentAnchor: computed(() => currentAnchor.value), State: computed(() => state.value), ZoomFactor: computed(() => zoom.value),
  HorizontalOffset: computed(() => metrics.HorizontalOffset), VerticalOffset: computed(() => metrics.VerticalOffset),
  ExtentWidth: computed(() => metrics.ExtentWidth), ExtentHeight: computed(() => metrics.ExtentHeight), ViewportWidth: computed(() => metrics.ViewportWidth), ViewportHeight: computed(() => metrics.ViewportHeight), ScrollableWidth: scrollableWidth, ScrollableHeight: scrollableHeight,
  ComputedHorizontalScrollMode: computed(() => computedMode('Horizontal')), ComputedVerticalScrollMode: computed(() => computedMode('Vertical')),
  ComputedHorizontalScrollBarVisibility: horizontalVisibility, ComputedVerticalScrollBarVisibility: verticalVisibility,
  ScrollPresenter: computed(() => viewport.value), ExpressionAnimationSources: computed(() => ({ Extent: { x: metrics.ExtentWidth, y: metrics.ExtentHeight }, Viewport: { x: metrics.ViewportWidth, y: metrics.ViewportHeight }, Offset: { x: metrics.HorizontalOffset, y: metrics.VerticalOffset }, ZoomFactor: zoom.value }))
} as Record<string, unknown>
for (const name of Object.keys(props)) exposed[name] = computed({ get: () => property(name), set: next => { overrides[name] = next; updateXamlBinding(props[name as keyof typeof props], next, instance) } })
defineExpose(exposed)
watch(() => [property('ContentOrientation'), property('Width'), property('Height')], () => void nextTick(queueMeasure))
watch(enabled, next => { if (!next) { hoveredBar.value = ''; onPointerEnd(); complete(true); if (indicatorTimer) clearTimeout(indicatorTimer); indicator.value = 'NoIndicator' } })
watch(() => uiSettings.AutoHideScrollBars, () => {
  if (indicatorTimer) clearTimeout(indicatorTimer)
  indicatorTimer = undefined
  if (!uiSettings.AutoHideScrollBars || hoveredBar.value || pressedBar.value) showIndicator()
  else indicator.value = 'NoIndicator'
})
watch(() => [property('MinZoomFactor'), property('MaxZoomFactor')], () => { if (zoom.value !== clampZoom(zoom.value)) setZoom(clampZoom(zoom.value), { x: 0, y: 0 }) })
const onWindowBlur = () => { hoveredBar.value = ''; onPointerEnd(); complete(true); showIndicator() }
let rootElement: HTMLElement | null = null
onMounted(() => {
  void nextTick(() => { measure(); observer = new ResizeObserver(queueMeasure); if (viewport.value) observer.observe(viewport.value); if (content.value) observer.observe(content.value); mutationObserver = new MutationObserver(queueMeasure); if (content.value) mutationObserver.observe(content.value, { childList: true, subtree: true });
    rootElement = viewport.value?.closest('.win-scroll-view') as HTMLElement | null
    rootElement?.addEventListener('pointerenter', ScrollView_PointerEntered)
    rootElement?.addEventListener('pointermove', ScrollView_PointerMoved)
    rootElement?.addEventListener('pointerleave', ScrollView_PointerExited)
    event('Loaded') })
  window.addEventListener('blur', onWindowBlur)
})
onBeforeUnmount(() => { complete(true); observer?.disconnect(); mutationObserver?.disconnect(); if (measureFrame) cancelAnimationFrame(measureFrame); if (indicatorTimer) clearTimeout(indicatorTimer); if (settleTimer) clearTimeout(settleTimer); window.removeEventListener('blur', onWindowBlur);
  rootElement?.removeEventListener('pointerenter', ScrollView_PointerEntered)
  rootElement?.removeEventListener('pointermove', ScrollView_PointerMoved)
  rootElement?.removeEventListener('pointerleave', ScrollView_PointerExited)
})
</script>

<style scoped>
.win-scroll-view { --ScrollViewScrollBarsMargin: 1px; position: relative; min-width: 0; min-height: 0; max-width: 100%; overflow: hidden; box-sizing: border-box; }
.win-scroll-view :deep(.win-scroll-presenter) { min-width: 0; min-height: 0; overflow: auto; scrollbar-width: none; position: relative; box-sizing: border-box; }
.win-scroll-view :deep(.win-scroll-presenter::-webkit-scrollbar) { display: none; }
.win-scroll-view :deep(.win-scroll-presenter:focus-visible) { outline: 2px solid var(--ControlFocusBorderBrush, var(--accent-base)); outline-offset: -2px; }
.win-scroll-view :deep(.scroll-surface) { position: relative; min-width: 100%; min-height: 100%; overflow: clip; }
.win-scroll-view :deep(.scroll-content) { position: absolute; inset: 0 auto auto 0; transform-origin: 0 0; display: flex; flex-direction: column; height: max-content; box-sizing: border-box; }
.win-scroll-view :deep(.content-orientation-none .scroll-content) { width: max-content; }
.win-scroll-view :deep(.content-orientation-horizontal .scroll-content) { height: 100%; min-height: 0 !important; }
.win-scroll-view :deep(.scroll-content > .win-image-host) { flex: 0 0 auto; }
.win-scroll-view :deep(.content-orientation-vertical .scroll-content > .win-stack-panel) { width: 100%; min-width: 0; }
.win-scroll-view :deep(.content-orientation-vertical .scroll-content > .win-stack-panel > .win-image-host) { width: 100%; max-width: 100%; flex: 0 0 auto; }
.win-scroll-view :deep(.content-orientation-vertical .scroll-content > .win-stack-panel > .win-image-host > .win-image.stretch-uniform) { width: 100%; height: auto; max-width: 100%; }
.win-scroll-view :deep(.horizontal-scrollbar-host), .win-scroll-view :deep(.vertical-scrollbar-host) { position: relative; z-index: 2; min-width: 0; min-height: 0; pointer-events: auto; padding: 1px; }
/* Auto tracks measure the official 12px bar plus the two 1px margins.
   The visual surfaces are absolute, so animation cannot resize the Grid. */
.win-scroll-view :deep(.horizontal-scrollbar-host) { height: 14px; }
.win-scroll-view :deep(.vertical-scrollbar-host) { width: 14px; }
.win-scroll-view :deep(.scrollbar-separator) { width: 14px; height: 14px; opacity: 0; background: var(--ScrollViewScrollBarsSeparatorBackground, var(--ControlFillColorTransparentBrush)); }
</style>
