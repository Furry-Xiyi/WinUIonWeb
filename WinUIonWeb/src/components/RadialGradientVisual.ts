import { defineComponent, h, render, shallowRef, useId, watchEffect, type Directive, type PropType } from 'vue'
import { cssColor } from './brushCore'
import type { RadialGradientBrushValue } from './RadialGradientBrush.vue'

export const isRadialGradientBrush = (value: unknown): value is RadialGradientBrushValue =>
  Boolean(value && typeof value === 'object' && (value as RadialGradientBrushValue).__radialGradient)

export interface RadialGradientPaintBounds { X: number; Y: number; Width: number; Height: number }

export const radialGradientPaint = (brush: RadialGradientBrushValue, id: string, bounds?: RadialGradientPaintBounds) => {
  const { X: cx, Y: cy } = brush.Center
  const { X: fx, Y: fy } = brush.GradientOrigin
  const rx = Math.max(0, brush.RadiusX), ry = Math.max(0, brush.RadiusY)
  const stops = Array.from(brush.GradientStops).sort((a, b) => a.Offset - b.Offset)
  const paint = stops.length === 0 ? 'transparent'
    : stops.length === 1 || rx === 0 || ry === 0 ? cssColor(stops.at(-1)!.Color) : `url(#${id})`
  // The composition origin is bounds-relative in both mapping modes.
  // SVG's transform maps its unit circle to the same focal ellipse.
  const definition = h('radialGradient', {
    // SVG's objectBoundingBox uses the un-stroked geometry and becomes empty for
    // horizontal/vertical lines. Shape hosts supply the official paint bounds.
    id, gradientUnits: bounds || brush.MappingMode === 'Absolute' ? 'userSpaceOnUse' : 'objectBoundingBox', r: 1,
    cx: cx / (rx || 1), cy: cy / (ry || 1), fx: fx / (rx || 1), fy: fy / (ry || 1),
    gradientTransform: bounds
      ? `translate(${bounds.X} ${bounds.Y}) scale(${rx * (brush.MappingMode === 'Absolute' ? 1 : bounds.Width)} ${ry * (brush.MappingMode === 'Absolute' ? 1 : bounds.Height)})`
      : `scale(${rx} ${ry})`, spreadMethod: brush.SpreadMethod.toLowerCase(),
    'color-interpolation': brush.InterpolationSpace === 'RgbLinear' ? 'linearRGB' : 'sRGB'
  }, stops.map(stop => h('stop', { offset: Math.max(0, Math.min(1, stop.Offset)), 'stop-color': cssColor(stop.Color) })))
  return { definition, paint, opacity: brush.Opacity }
}

const radialVisual = (brush: RadialGradientBrushValue, id: string) => {
  const { definition, paint, opacity } = radialGradientPaint(brush, id)
  return h('svg', {
    class: 'win-radial-gradient-visual', width: '100%', height: '100%',
    viewBox: brush.MappingMode === 'Absolute' ? undefined : '0 0 1 1', preserveAspectRatio: 'none',
    'aria-hidden': 'true', focusable: 'false',
    style: { position: 'absolute', inset: '0', display: 'block', pointerEvents: 'none', overflow: 'hidden', opacity }
  }, [
    h('defs', [definition]),
    h('rect', { width: '100%', height: '100%', fill: paint })
  ])
}

export default defineComponent({
  name: 'RadialGradientVisual',
  props: { Brush: { type: Object as PropType<RadialGradientBrushValue>, required: true } },
  setup(props) {
    const id = `radial-${useId().replace(/[^\w-]/g, '')}`
    return () => radialVisual(props.Brush, id)
  }
})

type BackgroundState = { brush: ReturnType<typeof shallowRef<unknown>>; dispose: () => void }
const backgrounds = new WeakMap<HTMLElement, BackgroundState>()
let backgroundId = 0
const updateBackground = (element: HTMLElement, value: unknown) => {
  const current = backgrounds.get(element)
  if (current) {
    if (isRadialGradientBrush(value)) current.brush.value = value
    else { current.dispose(); backgrounds.delete(element) }
    return
  }
  if (!isRadialGradientBrush(value)) return
  const layer = document.createElement('span')
  layer.className = 'win-radial-gradient-background'
  const previousPosition = element.style.position, previousIsolation = element.style.isolation
  const appliedPosition = getComputedStyle(element).position === 'static'
  if (appliedPosition) element.style.position = 'relative'
  element.style.isolation = 'isolate'
  layer.setAttribute('aria-hidden', 'true')
  Object.assign(layer.style, { position: 'absolute', inset: '0', pointerEvents: 'none', overflow: 'hidden', borderRadius: 'inherit', zIndex: '-1' })
  element.insertBefore(layer, element.firstChild)
  const brush = shallowRef<unknown>(value), id = `radial-background-${++backgroundId}`
  const stop = watchEffect(() => { if (isRadialGradientBrush(brush.value)) render(radialVisual(brush.value, id), layer) })
  backgrounds.set(element, { brush, dispose: () => {
    stop(); render(null, layer); layer.remove()
    if (appliedPosition && element.style.position === 'relative') element.style.position = previousPosition
    if (element.style.isolation === 'isolate') element.style.isolation = previousIsolation
  } })
}

export const vRadialGradientBrush: Directive<HTMLElement, unknown> = {
  mounted: (element, binding) => updateBackground(element, binding.value),
  updated: (element, binding) => updateBackground(element, binding.value),
  beforeUnmount: element => { backgrounds.get(element)?.dispose(); backgrounds.delete(element) }
}
