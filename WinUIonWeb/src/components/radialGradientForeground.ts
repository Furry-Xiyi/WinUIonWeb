import { h, render, shallowRef, watchEffect, type Directive } from 'vue'
import { isRadialGradientBrush, radialGradientPaint } from './RadialGradientVisual'

type ForegroundState = { brush: ReturnType<typeof shallowRef<unknown>>; dispose: () => void }
const foregrounds = new WeakMap<HTMLElement, ForegroundState>()
let nextId = 0

const updateForeground = (element: HTMLElement, value: unknown) => {
  const current = foregrounds.get(element)
  if (current) {
    if (isRadialGradientBrush(value)) current.brush.value = value
    else { current.dispose(); foregrounds.delete(element) }
    return
  }
  if (!isRadialGradientBrush(value)) return
  const brush = shallowRef<unknown>(value)
  const size = shallowRef({ width: element.clientWidth, height: element.clientHeight })
  const container = document.createElement('div')
  const id = `radial-foreground-${++nextId}`
  const properties = ['background-image', 'background-size', 'background-repeat', 'background-origin', 'background-clip', '-webkit-background-clip', '-webkit-text-fill-color']
  const previous = properties.map(property => [property, element.style.getPropertyValue(property)] as const)
  const measure = () => {
    const width = element.clientWidth, height = element.clientHeight
    if (width !== size.value.width || height !== size.value.height) size.value = { width, height }
  }
  const observer = new ResizeObserver(measure)
  observer.observe(element)
  const stop = watchEffect(() => {
    if (!isRadialGradientBrush(brush.value)) return
    const { definition, paint, opacity } = radialGradientPaint(brush.value, id)
    const width = Math.max(1, size.value.width), height = Math.max(1, size.value.height)
    // Keep native text layout, hit testing, selection and accessibility. SVG
    // supplies the same focal ellipse, mapping and spread as shape brushes;
    // the browser clips this paint to the native glyphs.
    render(h('svg', { xmlns: 'http://www.w3.org/2000/svg', width, height }, [
      h('defs', [definition]), h('rect', { width, height, fill: paint, opacity })
    ]), container)
    const svg = new XMLSerializer().serializeToString(container.firstElementChild!)
    element.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
    element.style.backgroundSize = '100% 100%'
    element.style.backgroundRepeat = 'no-repeat'
    element.style.backgroundOrigin = 'padding-box'
    element.style.backgroundClip = 'text'
    element.style.setProperty('-webkit-background-clip', 'text')
    element.style.setProperty('-webkit-text-fill-color', 'transparent')
  })
  foregrounds.set(element, { brush, dispose: () => {
    stop(); observer.disconnect(); render(null, container)
    for (const [property, oldValue] of previous) {
      if (oldValue) element.style.setProperty(property, oldValue)
      else element.style.removeProperty(property)
    }
  } })
}

export const vRadialGradientForeground: Directive<HTMLElement, unknown> = {
  mounted: (element, binding) => updateForeground(element, binding.value),
  updated: (element, binding) => updateForeground(element, binding.value),
  beforeUnmount: element => { foregrounds.get(element)?.dispose(); foregrounds.delete(element) }
}
