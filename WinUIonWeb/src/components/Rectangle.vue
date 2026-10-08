<template>
  <div ref="root" class="win-rectangle" v-acrylic-brush="rectangleStyle" :style="rectangleStyle" v-bind="forwardedAttrs">
    <OutlineVisual v-if="usesOutline" />
    <RadialGradientVisual v-else-if="radialFill" :Brush="radialFill" />
  </div>
</template>

<script lang="ts">
import { brushProperty } from './brushProperties'
export default { Fill: brushProperty('Rectangle', 'Fill'), Stroke: brushProperty('Rectangle', 'Stroke') }
</script>

<script setup lang="ts">
import { computed, defineComponent, getCurrentInstance, h, ref, useAttrs, useSlots, watch } from 'vue'
import { useBrushProperty } from './brushProperties'
import { vAcrylicBrush } from './acrylicBrushVisual'
import { resolveXamlValue, updateXamlBinding } from './xamlRuntime'
import { resolveBrushStyle } from './AcrylicBrush'
import { alignment, xamlThickness } from './layout'
import { useLayoutObserver } from './layout'
import RadialGradientVisual, { isRadialGradientBrush, radialGradientPaint } from './RadialGradientVisual'
import { cssColor, isAcrylicBrush, isSolidColorBrush } from './brushCore'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  Fill: { type: [String, Object], default: '' },
  Stroke: { type: [String, Object], default: '' },
  StrokeThickness: { type: [String, Number], default: '' },
  Stretch: { type: String, default: 'Fill' },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' }, MinHeight: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: 'Stretch' }, VerticalAlignment: { type: String, default: 'Stretch' },
  RadiusX: { type: [String, Number], default: '' },
  RadiusY: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' }
})
const attrs = useAttrs()
const instance = getCurrentInstance()
const root = ref<HTMLElement | null>(null)
const actualSize = ref({ X: 0, Y: 0 })
useLayoutObserver(root, () => {
  if (!root.value) return
  const X = root.value.offsetWidth, Y = root.value.offsetHeight
  if (X !== actualSize.value.X || Y !== actualSize.value.Y) actualSize.value = { X, Y }
})
const slots = useSlots()
const fillBrush = useBrushProperty('Fill', () => props.Fill, () => slots.default?.() ?? [], instance)
const strokeBrush = useBrushProperty('Stroke', () => props.Stroke, () => slots.default?.() ?? [], instance)
const emit = defineEmits(['update:Fill', 'update:Stroke'])
const currentFill = ref(fillBrush.value.value)
const currentStroke = ref(strokeBrush.value.value)
watch(fillBrush.value, value => { currentFill.value = value })
watch(strokeBrush.value, value => { currentStroke.value = value })
const Fill = computed({
  get: () => currentFill.value,
  set: value => {
    currentFill.value = resolveXamlValue(value, instance)
    updateXamlBinding(props.Fill, value, instance)
    emit('update:Fill', value)
  }
})
const Stroke = computed({
  get: () => currentStroke.value,
  set: value => {
    currentStroke.value = resolveXamlValue(value, instance)
    updateXamlBinding(props.Stroke, value, instance)
    emit('update:Stroke', value)
  }
})
defineExpose({ Fill, Stroke, Element: root, ActualSize: actualSize,
  ActualWidth: computed(() => actualSize.value.X), ActualHeight: computed(() => actualSize.value.Y) })
const radialFill = computed(() => isRadialGradientBrush(Fill.value) ? Fill.value : null)
const usesOutline = computed(() => Boolean(Stroke.value) || resolveXamlValue(props.Stretch, instance) !== 'Fill')
const number = (value: unknown, fallback = 0) => {
  const resolved = resolveXamlValue(value, instance)
  return resolved === '' || resolved === undefined || resolved === null || !Number.isFinite(Number(resolved)) ? fallback : Number(resolved)
}
// CShape::GetOutlineRect measures the actual arranged size and reserves half
// the stroke on each edge. The drawing layer never participates in layout.
const outline = computed(() => {
  const { X: width, Y: height } = actualSize.value
  const thickness = Math.abs(number(props.StrokeThickness, 1))
  const insetStroke = Stroke.value && thickness < width && thickness < height ? thickness : 0
  let w = Math.max(0, width - insetStroke), h = Math.max(0, height - insetStroke)
  const stretch = resolveXamlValue(props.Stretch, instance)
  if (stretch === 'Uniform') w = h = Math.min(w, h)
  else if (stretch === 'UniformToFill') w = h = Math.max(w, h)
  else if (stretch === 'None') w = h = 0
  return { x: insetStroke / 2, y: insetStroke / 2, width: w, height: h,
    rx: Math.min(w / 2, Math.abs(number(props.RadiusX))), ry: Math.min(h / 2, Math.abs(number(props.RadiusY))), thickness }
})
const OutlineVisual = defineComponent({ setup: () => () => {
  const defs: import('vue').VNode[] = []
  const paint = (brush: unknown, property: string) => {
    if (isRadialGradientBrush(brush)) {
      const geometry = outline.value
      const halfStroke = property === 'stroke' ? geometry.thickness / 2 : 0
      const radial = radialGradientPaint(brush, `rectangle-${instance?.uid}-${property}`, {
        X: geometry.x - halfStroke, Y: geometry.y - halfStroke,
        Width: geometry.width + halfStroke * 2, Height: geometry.height + halfStroke * 2
      })
      defs.push(radial.definition)
      return { color: radial.paint, opacity: radial.opacity }
    }
    if (isSolidColorBrush(brush)) return { color: cssColor(brush.Color), opacity: brush.Opacity }
    return { color: !brush || isAcrylicBrush(brush) ? 'none' : cssColor(brush), opacity: 1 }
  }
  const fill = paint(Fill.value, 'fill'), stroke = paint(Stroke.value, 'stroke')
  const { thickness, ...bounds } = outline.value
  return h('svg', { class: 'win-rectangle-outline', width: '100%', height: '100%', 'aria-hidden': 'true', focusable: 'false' }, [
    h('defs', defs), h('rect', { ...bounds, fill: fill.color, 'fill-opacity': fill.opacity,
      stroke: stroke.color, 'stroke-opacity': stroke.opacity, 'stroke-width': thickness })
  ])
} })
const cssLength = (value: unknown) => {
  const resolved = resolveXamlValue(value, instance)
  if (resolved === '' || resolved === undefined || resolved === null) return ''
  return /^-?\d+(?:\.\d+)?$/.test(String(resolved).trim()) ? `${resolved}px` : String(resolved)
}
const forwardedAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})
const rectangleStyle = computed(() => {
  const rx = Math.abs(number(props.RadiusX)), ry = Math.abs(number(props.RadiusY))
  const style = {
    width: cssLength(props.Width) || undefined,
    height: cssLength(props.Height) || undefined,
    margin: xamlThickness(resolveXamlValue(props.Margin, instance)) || undefined,
    ...(usesOutline.value && !isAcrylicBrush(Fill.value) ? { background: 'transparent' }
      : radialFill.value ? { background: 'transparent' } : resolveBrushStyle(Fill.value, instance)),
    position: 'relative' as const, overflow: 'hidden' as const,
    minWidth: cssLength(props.MinWidth) || undefined, minHeight: cssLength(props.MinHeight) || undefined,
    maxWidth: cssLength(props.MaxWidth) || undefined, maxHeight: cssLength(props.MaxHeight) || undefined,
    justifySelf: alignment(props.HorizontalAlignment, 'horizontal'), alignSelf: alignment(props.VerticalAlignment, 'vertical'),
    borderRadius: rx && ry ? `${rx}px / ${ry}px` : undefined
  }
  return [attrs.style, style as import('vue').CSSProperties]
})
</script>

<style>
.win-rectangle { display: block; box-sizing: border-box; min-width: 0; min-height: 0; }
.win-rectangle-outline { position: absolute; inset: 0; display: block; overflow: hidden; pointer-events: none; }
</style>
