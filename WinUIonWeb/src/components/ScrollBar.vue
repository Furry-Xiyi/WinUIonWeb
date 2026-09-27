<template>
  <div ref="root" v-bind="forwardedAttrs" class="win-scrollbar scrollbar" :class="[vertical ? 'scrollbar-vertical' : 'scrollbar-horizontal', { expanded: expanded, dragging: dragging, 'no-auto-hide': noAutoHide, 'no-indicator': indicator === 'None', 'touch-indicator': indicator === 'TouchIndicator', disabled: !enabled }]" :style="layoutStyle" role="scrollbar" :aria-orientation="vertical ? 'vertical' : 'horizontal'" :aria-valuemin="minimum" :aria-valuemax="maximum" :aria-valuenow="value" :aria-disabled="!enabled" :data-indicator-state="indicator" :data-conscious-state="expanded ? 'Expanded' : 'Collapsed'" @pointerenter="enter" @pointermove="activity" @pointerleave="leave" @wheel="wheel">
    <div class="scrollbar-mouse-root">
      <div class="scrollbar-track" :style="trackBackgroundStyle" v-acrylic-brush="trackBackgroundStyle" @pointerdown="startTrack" />
      <button ref="decrease" class="scrollbar-button decrease" :class="{ 'is-pressed': pressed === -1 }" type="button" tabindex="-1" aria-hidden="true" :disabled="!enabled" @pointerdown="startArrow(-1, $event)">
        <FontIcon Glyph="{x:Bind DecreaseGlyph, Mode=OneWay}" FontFamily="{ThemeResource SymbolThemeFontFamily}" FontSize="{ThemeResource ScrollBarButtonArrowIconFontSize}" HorizontalAlignment="Center" VerticalAlignment="Center" />
      </button>
      <div ref="thumb" class="scrollbar-thumb" :style="thumbStyle" @pointerdown="startDrag"><div class="scrollbar-thumb-visual" /></div>
      <button ref="increase" class="scrollbar-button increase" :class="{ 'is-pressed': pressed === 1 }" type="button" tabindex="-1" aria-hidden="true" :disabled="!enabled" @pointerdown="startArrow(1, $event)">
        <FontIcon Glyph="{x:Bind IncreaseGlyph, Mode=OneWay}" FontFamily="{ThemeResource SymbolThemeFontFamily}" FontSize="{ThemeResource ScrollBarButtonArrowIconFontSize}" HorizontalAlignment="Center" VerticalAlignment="Center" />
      </button>
    </div>
    <div class="scrollbar-panning-root"><div class="scrollbar-panning-thumb" :style="panningStyle" /></div>
  </div>
</template>
<script setup lang="ts">
import { computed, getCurrentInstance, inject, onBeforeUnmount, onMounted, provide, ref, useAttrs, watch } from 'vue'
import FontIcon from './FontIcon.vue'
import { boolValue } from './layout'
import { frameworkLayoutStyle } from './frameworkLayout'
import { resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlScopeKey } from './xamlRuntime'
import { scrollBarOwnerKey, type ScrollBarScrollEventArgs } from './scrollBarOwner'
import { uiSettings } from './uiSettings'
import { useAcrylicBrushStyle } from './AcrylicBrush'
import { vAcrylicBrush } from './acrylicBrushVisual'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ Value?: number | string; Minimum?: number | string; Maximum?: number | string; ViewportSize?: number | string; SmallChange?: number | string; LargeChange?: number | string; Orientation?: string; IndicatorMode?: string; IsEnabled?: boolean | string; Width?: number | string; Height?: number | string; Margin?: number | string; HorizontalAlignment?: string; VerticalAlignment?: string }>(), { Value: 0, Minimum: 0, Maximum: 1, ViewportSize: 0, SmallChange: 1, LargeChange: 10, Orientation: 'Vertical', IndicatorMode: 'None', IsEnabled: true })
const emit = defineEmits<{ Scroll: [sender: Record<string, unknown>, args: ScrollBarScrollEventArgs]; ValueChanged: [sender: Record<string, unknown>, args: { OldValue: number; NewValue: number }] }>()
const instance = getCurrentInstance(), attrs = useAttrs(), owner = inject(scrollBarOwnerKey, {})
const root = ref<HTMLElement>(), thumb = ref<HTMLElement>(), decrease = ref<HTMLElement>(), increase = ref<HTMLElement>()
const resolve = (v: unknown) => resolveXamlValue(v, instance)
const number = (v: unknown, fallback = 0) => Number.isFinite(Number(resolve(v))) ? Number(resolve(v)) : fallback
const vertical = computed(() => resolve(props.Orientation) !== 'Horizontal')
const orientation = computed(() => vertical.value ? 'Vertical' : 'Horizontal')
const minimum = computed(() => number(props.Minimum)), maximum = computed(() => Math.max(minimum.value, number(props.Maximum, 1)))
const viewportSize = computed(() => Math.max(0, number(props.ViewportSize)))
const enabled = computed(() => boolValue(resolve(props.IsEnabled)))
const indicator = computed(() => {
  const mode = String(resolve(props.IndicatorMode) || 'None')
  // AutoHideScrollBars is the official conscious-state setting. Standalone
  // controls consult it too; ownership is not a substitute for that setting.
  return mode === 'None' && noAutoHide.value ? 'MouseIndicator' : mode
})
const value = ref(0), over = ref(false), pressed = ref(0), length = ref(0)
const interacting = ref(false), dragging = ref(false)
const trackBackgroundStyle = useAcrylicBrushStyle(() => `{ThemeResource ScrollBarTrackFill${!enabled.value ? 'Disabled' : dragging.value || interacting.value ? 'Pressed' : over.value ? 'PointerOver' : ''}}`, instance)
let capture: { id: number; node: HTMLElement } | null = null
let drag: { start: number; value: number; travel: number; range: number } | null = null
const noAutoHide = computed(() => !(owner.autoHide?.() ?? uiSettings.AutoHideScrollBars))
const expanded = computed(() => enabled.value && indicator.value === 'MouseIndicator' && (noAutoHide.value || over.value || interacting.value))
const layoutStyle = computed(() => frameworkLayoutStyle(props, instance))
const forwardedAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => !['Scroll', 'ValueChanged'].includes(key))))
const DecreaseGlyph = computed(() => vertical.value ? '\uEDDB' : '\uEDD9'), IncreaseGlyph = computed(() => vertical.value ? '\uEDDC' : '\uEDDA')
provide(xamlScopeKey, { ...inject(xamlScopeKey, {}), DecreaseGlyph, IncreaseGlyph })
const clamp = (v: number) => Math.max(minimum.value, Math.min(maximum.value, v))
watch(() => [number(props.Value), minimum.value, maximum.value], ([v]) => { if (!drag) value.value = clamp(v!) }, { immediate: true })
const trackLength = computed(() => Math.max(0, length.value - 24))
const thumbLength = computed(() => Math.min(trackLength.value, Math.max(30, viewportSize.value / Math.max(1, maximum.value - minimum.value + viewportSize.value) * trackLength.value)))
const travel = computed(() => Math.max(0, trackLength.value - thumbLength.value))
const ratio = computed(() => maximum.value > minimum.value ? (clamp(value.value) - minimum.value) / (maximum.value - minimum.value) : 0)
const position = computed(() => 12 + ratio.value * travel.value)
const thumbStyle = computed(() => vertical.value ? { top: `${position.value}px`, height: `${thumbLength.value}px` } : { left: `${position.value}px`, width: `${thumbLength.value}px` })
const panningLength = computed(() => Math.min(length.value, Math.max(32, viewportSize.value / Math.max(1, maximum.value - minimum.value + viewportSize.value) * length.value)))
const panningStyle = computed(() => vertical.value ? { top: `${ratio.value * (length.value - panningLength.value)}px`, height: `${panningLength.value}px` } : { left: `${ratio.value * (length.value - panningLength.value)}px`, width: `${panningLength.value}px` })
const publicValue = computed({ get: () => value.value, set: next => { value.value = clamp(Number(next)); updateXamlBinding(props.Value, value.value, instance) } })
const sender = { get Value() { return value.value }, get Minimum() { return minimum.value }, get Maximum() { return maximum.value }, get ViewportSize() { return viewportSize.value }, get Orientation() { return orientation.value } }
function dispatch(name: 'Scroll', args: ScrollBarScrollEventArgs): void
function dispatch(name: 'ValueChanged', args: { OldValue: number; NewValue: number }): void
function dispatch(name: 'Scroll' | 'ValueChanged', args: ScrollBarScrollEventArgs | { OldValue: number; NewValue: number }) {
  ;(emit as (...args: unknown[]) => void)(name, sender, args)
  if (!instance?.vnode.props?.[`on${name}`]) resolveXamlHandler(attrs[name], instance)?.(sender, args)
}
const change = (v: number, type: ScrollBarScrollEventArgs['ScrollEventType']) => {
  const old = value.value, next = clamp(v)
  value.value = next
  updateXamlBinding(props.Value, next, instance)
  if (old !== next) dispatch('ValueChanged', { OldValue: old, NewValue: next })
  dispatch('Scroll', { ScrollEventType: type, NewValue: next })
  return old !== next
}
let repeat: ReturnType<typeof setTimeout> | undefined, observer: ResizeObserver | undefined
const activity = (e: PointerEvent) => { if (enabled.value) owner.onPointerActivity?.(e.pointerType || 'mouse') }
const enter = (e: PointerEvent) => { if (e.pointerType === 'touch') return; over.value = true; owner.onHover?.(orientation.value, true); activity(e) }
const leave = () => { over.value = false; owner.onHover?.(orientation.value, false) }
const begin = (e: PointerEvent) => {
  if (!enabled.value || e.button !== 0) return false
  stop(); activity(e); interacting.value = true; capture = { id: e.pointerId, node: e.currentTarget as HTMLElement }
  try { capture.node.setPointerCapture(e.pointerId) } catch { /* Cancellation ends the interaction below. */ }
  document.addEventListener('pointermove', move); document.addEventListener('pointerup', stop); document.addEventListener('pointercancel', stop)
  capture.node.addEventListener('lostpointercapture', stop); owner.onInteraction?.(orientation.value, true); e.preventDefault(); return true
}
const startArrow = (direction: number, e: PointerEvent) => {
  if (!begin(e)) return
  pressed.value = direction
  const step = () => change(value.value + direction * Math.max(0, number(props.SmallChange, 16)), direction < 0 ? 'SmallDecrement' : 'SmallIncrement')
  step()
  const run = () => { if (!capture) return; step(); repeat = setTimeout(run, 50) }
  repeat = setTimeout(run, 250)
}
const startTrack = (e: PointerEvent) => {
  if (!begin(e)) return
  const rect = root.value!.getBoundingClientRect(), location = vertical.value ? e.clientY - rect.top : e.clientX - rect.left
  const direction = location < position.value ? -1 : 1
  const step = () => { if (direction < 0 && location >= position.value || direction > 0 && location <= position.value + thumbLength.value) return false; return change(value.value + direction * Math.max(1, number(props.LargeChange) || viewportSize.value), direction < 0 ? 'LargeDecrement' : 'LargeIncrement') }
  step(); const run = () => { if (capture && step()) repeat = setTimeout(run, 50) }; repeat = setTimeout(run, 250)
}
const startDrag = (e: PointerEvent) => { if (!begin(e)) return; dragging.value = true; drag = { start: vertical.value ? e.clientY : e.clientX, value: value.value, travel: travel.value, range: maximum.value - minimum.value } }
const move = (e: PointerEvent) => { if (!capture || capture.id !== e.pointerId || !drag) return; change(drag.value + ((vertical.value ? e.clientY : e.clientX) - drag.start) / Math.max(1, drag.travel) * drag.range, 'ThumbTrack'); e.preventDefault() }
function stop(e?: PointerEvent | Event) {
  if (e && 'pointerId' in e && capture && e.pointerId !== capture.id) return
  const current = capture, wasDrag = !!drag
  capture = null; drag = null; pressed.value = 0; interacting.value = false; dragging.value = false
  if (repeat) clearTimeout(repeat); repeat = undefined
  document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', stop); document.removeEventListener('pointercancel', stop)
  if (current) { current.node.removeEventListener('lostpointercapture', stop); try { if (current.node.hasPointerCapture(current.id)) current.node.releasePointerCapture(current.id) } catch {} }
  if (!current) return
  if (wasDrag) dispatch('Scroll', { ScrollEventType: 'ThumbPosition', NewValue: value.value })
  dispatch('Scroll', { ScrollEventType: 'EndScroll', NewValue: value.value }); owner.onInteraction?.(orientation.value, false)
}
const wheel = (e: WheelEvent) => { if (!enabled.value) return; const delta = vertical.value ? e.deltaY : e.deltaX || e.deltaY; if (change(value.value + delta, delta < 0 ? 'SmallDecrement' : 'SmallIncrement')) { e.preventDefault(); e.stopPropagation() } }
const onWindowBlur = () => { leave(); stop() }
onMounted(() => {
  // ResizeObserver reports the fractional layout size. clientWidth and
  // clientHeight round it, which can place the terminal thumb past its track.
  observer = new ResizeObserver(([entry]) => { length.value = vertical.value ? entry?.contentRect.height ?? 0 : entry?.contentRect.width ?? 0 })
  observer.observe(root.value!); window.addEventListener('blur', onWindowBlur)
})
watch(enabled, next => { if (!next) stop() })
onBeforeUnmount(() => { stop(); observer?.disconnect(); window.removeEventListener('blur', onWindowBlur) })
defineExpose({ Value: publicValue, Minimum: minimum, Maximum: maximum, ViewportSize: viewportSize, Orientation: orientation })
</script>
<style scoped>
.win-scrollbar { position: absolute; grid-area: 1 / 1; width: 12px; height: 12px; min-width: 0; min-height: 0; touch-action: none; user-select: none; z-index: 2; }
.scrollbar-vertical { top: 0; right: 0; bottom: 0; height: auto; }
.scrollbar-horizontal { left: 0; right: 0; bottom: 0; width: auto; }
.scrollbar-mouse-root,.scrollbar-panning-root { position: absolute; inset: 0; }
.scrollbar-mouse-root { visibility: visible; transition: visibility 0s; }
.scrollbar-track { position: absolute; inset: 0; box-sizing: border-box; opacity: 0; border: var(--ScrollBarTrackBorderThemeThickness,0px) solid var(--ScrollBarTrackStroke,var(--AcrylicInAppFillColorDefaultBrush)); border-radius: 6px; transition: opacity 83ms linear; }
.scrollbar-thumb { position: absolute; width: 12px; height: 12px; touch-action: none; }
.scrollbar-vertical .scrollbar-thumb { right: 0; }
.scrollbar-horizontal .scrollbar-thumb { bottom: 0; }
.scrollbar-thumb-visual { position: absolute; background: transparent; opacity: 1; transition: width 167ms cubic-bezier(0,0,0,1),height 167ms cubic-bezier(0,0,0,1),transform 167ms cubic-bezier(0,0,0,1), opacity 83ms linear; }
.scrollbar-thumb-visual::before { content: ''; position: absolute; inset: 3px; border-radius: var(--ScrollBarCornerRadius,3px); background: var(--ScrollBarPanningThumbBackground,var(--ControlStrongFillColorDefaultBrush)); }
.scrollbar-vertical .scrollbar-thumb-visual { width: 8px; height: 100%; right: 0; }
.scrollbar-horizontal .scrollbar-thumb-visual { width: 100%; height: 8px; bottom: 0; }
.scrollbar-thumb:hover .scrollbar-thumb-visual::before { background: var(--ScrollBarThumbFillPointerOver,var(--ControlStrongFillColorDefaultBrush)); }
.dragging .scrollbar-thumb-visual::before { background: var(--ScrollBarThumbFillPressed,var(--ControlStrongFillColorDefaultBrush)); }
.scrollbar-button { position: absolute; display: grid; place-items: center; border: 0; padding: 0; width: 12px; height: 12px; min-width: 12px; min-height: 12px; background: var(--ScrollBarButtonBackground,transparent); color: var(--ScrollBarButtonArrowForeground,var(--ControlStrongFillColorDefaultBrush)); opacity: 0; transition: opacity 83ms linear; touch-action: none; }
.scrollbar-button.decrease { top: 0; left: 0; }
.scrollbar-button.increase { bottom: 0; right: 0; }
.scrollbar-vertical .decrease { padding-top: 4px; }
.scrollbar-vertical .increase { padding-bottom: 4px; }
.scrollbar-horizontal .decrease { padding-left: 4px; }
.scrollbar-horizontal .increase { padding-right: 4px; }
.scrollbar-button:hover { color: var(--ScrollBarButtonArrowForegroundPointerOver,var(--TextFillColorSecondaryBrush)); }
.scrollbar-button.is-pressed { color: var(--ScrollBarButtonArrowForegroundPressed,var(--TextFillColorSecondaryBrush)); }
.scrollbar-button :deep(.win-font-icon) { transform-origin: center; }
.scrollbar-button.is-pressed :deep(.win-font-icon) { animation: scroll-arrow-pressed 16ms steps(1,end) forwards; }
@keyframes scroll-arrow-pressed { to { transform: scale(var(--ScrollBarButtonArrowScalePressed,0.875)); } }
.expanded .scrollbar-track,.expanded .scrollbar-button { opacity: 1; transition-delay: 400ms; }
.expanded.scrollbar-vertical .scrollbar-thumb-visual { width: 12px; transition-delay: 400ms; }
.expanded.scrollbar-horizontal .scrollbar-thumb-visual { height: 12px; transition-delay: 400ms; }
.win-scrollbar:not(.expanded) .scrollbar-track,.win-scrollbar:not(.expanded) .scrollbar-button,.win-scrollbar:not(.expanded) .scrollbar-thumb-visual { transition-delay: 500ms; }
.no-auto-hide .scrollbar-track,.no-auto-hide .scrollbar-button { transition: none; }
.no-auto-hide .scrollbar-thumb-visual { transition: opacity 83ms linear; }
.scrollbar-panning-root { visibility: hidden; opacity: 0; transition: opacity 83ms linear, visibility 0s linear 167ms; }
.scrollbar-panning-thumb { position: absolute; background: var(--ScrollBarPanningThumbBackground,var(--ControlStrongFillColorDefaultBrush)); }
.scrollbar-vertical .scrollbar-panning-thumb { width: 2px; right: 2px; }
.scrollbar-horizontal .scrollbar-panning-thumb { height: 2px; bottom: 2px; }
.touch-indicator .scrollbar-mouse-root { visibility: hidden; }
.touch-indicator .scrollbar-panning-root { visibility: visible; opacity: 1; transition: none; }
.no-indicator .scrollbar-mouse-root { visibility: hidden; transition-delay: 83ms; pointer-events: none; }
.win-scrollbar.no-indicator .scrollbar-track,.win-scrollbar.no-indicator .scrollbar-button { opacity: 0; transition-delay: 0ms; }
.win-scrollbar.no-indicator .scrollbar-thumb-visual { opacity: 0; transition-delay: 0ms; }
.no-indicator.scrollbar-vertical .scrollbar-thumb-visual { width: 8px; }
.no-indicator.scrollbar-horizontal .scrollbar-thumb-visual { height: 8px; }
.no-indicator .scrollbar-panning-root { opacity: 0; pointer-events: none; }
.disabled { pointer-events: none; }
.disabled .scrollbar-mouse-root,.disabled .scrollbar-panning-root { opacity: 0.5; }
.disabled .scrollbar-track { border-color: var(--ScrollBarTrackStrokeDisabled,var(--AcrylicInAppFillColorDefaultBrush)); }
.disabled .scrollbar-panning-thumb { background: var(--ScrollBarPanningThumbBackgroundDisabled,var(--ControlStrongFillColorDisabledBrush)); }
.disabled .scrollbar-thumb-visual { opacity: 0; }
.disabled .scrollbar-thumb-visual::before { background: var(--ScrollBarThumbFillDisabled,var(--ControlStrongFillColorDisabledBrush)); }
.scrollbar-button:disabled { color: var(--ScrollBarButtonArrowForegroundDisabled,var(--ControlStrongFillColorDisabledBrush)); }
@media (prefers-reduced-motion: reduce) { .scrollbar-thumb-visual,.scrollbar-track,.scrollbar-button { transition-duration: 0ms; } }
</style>
