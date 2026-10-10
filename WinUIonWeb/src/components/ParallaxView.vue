<template>
  <div ref="rootRef" class="win-parallax-view" :style="rootStyle">
    <div ref="childHostRef" class="parallax-child" :style="childStyle"><ChildOutlet /></div>
  </div>
</template>

<script lang="ts">
import { h } from 'vue'
export const ParallaxViewChild = defineComponent({
  name: 'ParallaxView.Child', __parallaxChild: true,
  setup(_, { slots }) { return () => h(Fragment, slots.default?.()) }
})
export default { Child: ParallaxViewChild }
</script>

<script setup lang="ts">
import { cloneVNode, Comment, computed, defineComponent, Fragment, getCurrentInstance, inject, isRef, isVNode, nextTick, onBeforeUnmount, onMounted, onUpdated, provide, ref, shallowReactive, shallowRef, Text, toRaw, useSlots, watch, type VNode } from 'vue'
import { frameworkLayoutStyle } from './frameworkLayout'
import { boolValue } from './layout'
import { arrangeParallaxChild, computeParallaxTranslation, measureParallaxAxis, parallaxChildLayoutKey, resolveParallaxOffsets, type ParallaxSize } from './parallaxRuntime'
import { normalizeXamlNodes, resolveXamlValue, updateXamlBinding, xamlNameScopeKey } from './xamlRuntime'

export interface Props {
  Child?: unknown; Source?: object | string | null; HorizontalShift?: number | string; VerticalShift?: number | string
  HorizontalSourceStartOffset?: number | string; HorizontalSourceEndOffset?: number | string; VerticalSourceStartOffset?: number | string; VerticalSourceEndOffset?: number | string
  HorizontalSourceOffsetKind?: string | number; VerticalSourceOffsetKind?: string | number; IsHorizontalShiftClamped?: boolean | string; IsVerticalShiftClamped?: boolean | string
  MaxHorizontalShiftRatio?: number | string; MaxVerticalShiftRatio?: number | string; Width?: number | string; Height?: number | string; MinWidth?: number | string; MinHeight?: number | string; MaxWidth?: number | string; MaxHeight?: number | string; Margin?: number | string; HorizontalAlignment?: string; VerticalAlignment?: string; Visibility?: string; IsHitTestVisible?: boolean | string; Opacity?: number | string
}
const props = withDefaults(defineProps<Props>(), {
  Source: null, HorizontalShift: 0, VerticalShift: 0, HorizontalSourceStartOffset: 0, HorizontalSourceEndOffset: 0, VerticalSourceStartOffset: 0, VerticalSourceEndOffset: 0,
  HorizontalSourceOffsetKind: 'Relative', VerticalSourceOffsetKind: 'Relative', IsHorizontalShiftClamped: true, IsVerticalShiftClamped: true, MaxHorizontalShiftRatio: 1, MaxVerticalShiftRatio: 1,
  HorizontalAlignment: 'Stretch', VerticalAlignment: 'Stretch', Visibility: 'Visible', IsHitTestVisible: true, Opacity: 1
})
const instance = getCurrentInstance()
const names = inject<Record<string, unknown>>(xamlNameScopeKey, {})
const slots = useSlots()
const overrides = shallowReactive<Record<string, unknown>>({})
const property = (name: keyof Props) => name in overrides ? overrides[name] : resolveXamlValue(props[name], instance)
const number = (name: keyof Props) => { const value = Number(property(name)); return Number.isFinite(value) ? value : 0 }
const effectiveProps = computed(() => Object.fromEntries(Object.keys(props).map(name => [name, property(name as keyof Props)])))
const rootStyle = computed(() => {
  const style = frameworkLayoutStyle(effectiveProps.value, instance)
  if (infiniteAxes.value.horizontal) style.width = `${measuredDesiredSize.value.width}px`
  if (infiniteAxes.value.vertical) style.height = `${measuredDesiredSize.value.height}px`
  return style
})
const rootRef = ref<HTMLElement | null>(null)
const childHostRef = ref<HTMLElement | null>(null)
const childControl = shallowRef<unknown>(null)
const actualSize = ref<ParallaxSize>({ width: 0, height: 0 })
const desiredSize = ref<ParallaxSize | null>(null)
const arrangedSize = ref<ParallaxSize | null>(null)
const childRect = ref({ x: 0, y: 0, width: 0, height: 0 })
const translation = ref({ x: 0, y: 0 })
const infiniteAxes = ref({ horizontal: false, vertical: false })
const measuredDesiredSize = ref<ParallaxSize>({ width: 0, height: 0 })
const measureAxis = (horizontal: boolean, desired: number) => {
  const minValue = Number(property(horizontal ? 'MinWidth' : 'MinHeight'))
  const maxValue = property(horizontal ? 'MaxWidth' : 'MaxHeight')
  const maximum = !autoSize(maxValue) ? Number(maxValue) : Infinity
  const unconstrained = horizontal ? infiniteAxes.value.horizontal : infiniteAxes.value.vertical
  return measureParallaxAxis(unconstrained ? Infinity : horizontal ? actualSize.value.width : actualSize.value.height, desired, Number.isFinite(minValue) ? minValue : 0, maximum)
}
const availableSize = computed(() => ({
  width: measureAxis(true, 0).availableSize + Math.abs(number('HorizontalShift')),
  height: measureAxis(false, 0).availableSize + Math.abs(number('VerticalShift'))
}))
const childNode = shallowRef<VNode | null>(null)
let renderedChildNode: VNode | null = null
const resolveChildNode = () => {
  const content: VNode[] = []
  let explicitChild: VNode[] | undefined
  const collect = (nodes: VNode[]) => {
    for (const node of nodes) {
      if (node.type === Fragment && Array.isArray(node.children)) collect(node.children as VNode[])
      else if ((node.type as { __parallaxChild?: boolean })?.__parallaxChild || node.type === 'ParallaxView.Child') {
        explicitChild = Array.isArray(node.children) ? node.children as VNode[] : (node.children as { default?: () => VNode[] })?.default?.() ?? []
      } else if (node.type !== Comment && !(node.type === Text && !String(node.children ?? '').trim())) content.push(node)
    }
  }
  if ('Child' in overrides || props.Child !== undefined) {
    const child = property('Child') as { $?: { vnode?: VNode } } | undefined
    if (isVNode(child)) content.push(child)
    else if (child?.$?.vnode) content.push(child.$.vnode)
    else if (child) {
      const element = findNamedElement(child) as (HTMLElement & { __vueParentComponent?: { vnode?: VNode } }) | null
      if (element?.__vueParentComponent?.vnode) content.push(element.__vueParentComponent.vnode)
    }
  } else collect(slots.default?.() ?? [])
  return normalizeXamlNodes(explicitChild ?? content, instance).find(node => node.type !== Comment && !(node.type === Text && !String(node.children ?? '').trim())) ?? null
}
const ChildOutlet = defineComponent({
  name: 'ParallaxViewChildOutlet',
  setup: () => () => {
    const node = resolveChildNode()
    if (node?.type !== renderedChildNode?.type || node?.key !== renderedChildNode?.key) {
      desiredSize.value = null
      arrangedSize.value = null
    }
    renderedChildNode = node
    childNode.value = node
    return node ? cloneVNode(node, { ref: (control: unknown) => { childControl.value = control } }, true) : null
  }
})
provide(parallaxChildLayoutKey, {
  availableSize, arrangedSize,
  isDirectChild: child => child?.parent?.type === ChildOutlet,
  reportDesiredSize: size => {
    if (desiredSize.value?.width === size.width && desiredSize.value?.height === size.height) return
    desiredSize.value = size
    queueLayout()
  }
})
const childStyle = computed(() => ({ left: `${childRect.value.x}px`, top: `${childRect.value.y}px`, width: `${childRect.value.width}px`, height: `${childRect.value.height}px`, transform: `translate3d(${translation.value.x}px, ${translation.value.y}px, 0)` }))
const childProperty = (name: string, fallback: unknown) => resolveXamlValue(childNode.value?.props?.[name] ?? fallback, instance)
const autoSize = (value: unknown) => value === undefined || value === null || value === '' || value === 'Auto' || !Number.isFinite(Number(value))
const measureInfiniteAxes = (root: HTMLElement) => {
  const parent = root.parentElement
  const parentStyle = parent ? getComputedStyle(parent) : null
  const stacking = parent?.classList.contains('win-stack-panel')
  const stackingHorizontal = stacking && parentStyle?.flexDirection === 'row'
  const infinite = { horizontal: false, vertical: false }
  for (const axis of ['horizontal', 'vertical'] as const) {
    const propertyName = axis === 'horizontal' ? 'Width' : 'Height'
    if (!autoSize(property(propertyName))) continue
    if (stacking && (axis === 'horizontal' ? stackingHorizontal : !stackingHorizontal)) {
      infinite[axis] = true
      continue
    }
    // A percentage in normal flow resolves to zero under an indefinite slot.
    // Probe that value while removing our own previously measured auto size.
    const cssProperty = axis === 'horizontal' ? 'width' : 'height'
    const minProperty = axis === 'horizontal' ? 'minWidth' : 'minHeight'
    const maxProperty = axis === 'horizontal' ? 'maxWidth' : 'maxHeight'
    const previous = [root.style[cssProperty], root.style[minProperty], root.style[maxProperty]]
    root.style[cssProperty] = '100%'
    root.style[minProperty] = '0'
    root.style[maxProperty] = 'none'
    const parentLength = parent?.style[cssProperty]
    const finiteZeroSlot = Boolean(parentLength && parentLength !== 'auto' && /^0(?:px|%)?$/.test(parentLength))
    infinite[axis] = !finiteZeroSlot && (axis === 'horizontal' ? root.clientWidth : root.clientHeight) === 0
    root.style[cssProperty] = previous[0]!
    root.style[minProperty] = previous[1]!
    root.style[maxProperty] = previous[2]!
  }
  return infinite
}
const updateLayout = () => {
  const root = rootRef.value
  if (!root || disposed) return
  const infinite = measureInfiniteAxes(root)
  if (infinite.horizontal !== infiniteAxes.value.horizontal || infinite.vertical !== infiniteAxes.value.vertical) infiniteAxes.value = infinite
  const size = { width: root.clientWidth, height: root.clientHeight }
  if (size.width !== actualSize.value.width || size.height !== actualSize.value.height) actualSize.value = { ...size }
  const element = childHostRef.value?.firstElementChild as HTMLElement | null
  if (element !== observedChild) {
    if (observedChild) layoutObserver?.unobserve(observedChild)
    observedChild = element
    if (element) layoutObserver?.observe(element)
  }
  if (desiredSize.value === null && childHostRef.value) {
    childHostRef.value.style.width = Number.isFinite(availableSize.value.width) ? `${availableSize.value.width}px` : 'max-content'
    childHostRef.value.style.height = Number.isFinite(availableSize.value.height) ? `${availableSize.value.height}px` : 'auto'
  }
  const desired = desiredSize.value ?? {
    width: autoSize(childProperty('Width', undefined)) ? element?.offsetWidth || (Number.isFinite(availableSize.value.width) ? availableSize.value.width : 0) : Number(childProperty('Width', 0)),
    height: autoSize(childProperty('Height', undefined)) ? element?.offsetHeight || (Number.isFinite(availableSize.value.height) ? availableSize.value.height : 0) : Number(childProperty('Height', 0))
  }
  const measured = { width: measureAxis(true, desired.width).desiredSize, height: measureAxis(false, desired.height).desiredSize }
  if (measured.width !== measuredDesiredSize.value.width || measured.height !== measuredDesiredSize.value.height) measuredDesiredSize.value = measured
  if (autoSize(property('Width'))) root.style.width = infinite.horizontal ? `${measured.width}px` : '100%'
  if (autoSize(property('Height'))) root.style.height = infinite.vertical ? `${measured.height}px` : '100%'
  size.width = root.clientWidth
  size.height = root.clientHeight
  if (size.width !== actualSize.value.width || size.height !== actualSize.value.height) actualSize.value = { ...size }
  const rect = arrangeParallaxChild({
    width: size.width, height: size.height, desiredWidth: desired.width, desiredHeight: desired.height,
    horizontalShift: number('HorizontalShift'), verticalShift: number('VerticalShift'),
    horizontalAlignment: String(childProperty('HorizontalAlignment', 'Stretch')),
    verticalAlignment: String(childProperty('VerticalAlignment', 'Stretch')),
    autoWidth: autoSize(childProperty('Width', undefined)), autoHeight: autoSize(childProperty('Height', undefined))
  })
  if (Object.keys(rect).some(key => rect[key as keyof typeof rect] !== childRect.value[key as keyof typeof rect])) childRect.value = rect
  if (arrangedSize.value?.width !== rect.width || arrangedSize.value?.height !== rect.height) arrangedSize.value = { width: rect.width, height: rect.height }
  if (childHostRef.value) {
    childHostRef.value.style.width = `${rect.width}px`
    childHostRef.value.style.height = `${rect.height}px`
  }
  updateParallax()
}

const unwrap = (value: unknown): unknown => isRef(value) ? value.value : value
type ScrollSource = { viewport: HTMLElement; content: HTMLElement | null; control: Record<string, unknown> | null; scrollPresenter: boolean; root: HTMLElement }
let scrollSource: ScrollSource | null = null
const resolvedSource = computed(() => unwrap(property('Source')))
const findNamedElement = (source: unknown) => {
  const name = Object.keys(names).find(key => toRaw(unwrap(names[key]) as object) === toRaw(source as object))
  if (!name) return null
  // An official public control object need not expose Vue's $el.
  let scope = rootRef.value?.parentElement
  while (scope) {
    const match = Array.from(scope.querySelectorAll<HTMLElement>('[data-xaml-ref]')).find(element => element.getAttribute('data-xaml-ref') === name)
    if (match) return match
    scope = scope.parentElement
  }
  return null
}
const resolveSource = (source: unknown): ScrollSource | null => {
  source = unwrap(source)
  if (!source || typeof source !== 'object') return null
  const control = source instanceof HTMLElement ? null : source as Record<string, unknown>
  if (control && unwrap(control.ScrollView)) return resolveSource(unwrap(control.ScrollView))
  const element = source instanceof HTMLElement ? source : unwrap(control?.ScrollPresenter) ?? unwrap(control?.scrollViewerRef) ?? control?.$el ?? findNamedElement(source)
  if (!(element instanceof HTMLElement)) return null
  const viewport = element.matches('.win-scroll-viewer-viewport, .win-scroll-presenter') ? element : element.querySelector<HTMLElement>('.win-scroll-viewer-viewport, .win-scroll-presenter')
  if (!viewport) return null
  return {
    viewport, content: viewport.querySelector<HTMLElement>('.scroll-content'), control,
    scrollPresenter: viewport.classList.contains('win-scroll-presenter'),
    root: viewport.closest<HTMLElement>('.win-scroll-viewer, .win-scroll-view') ?? element
  }
}
const zoomFactor = () => {
  const publicZoom = Number(unwrap(scrollSource?.control?.ZoomFactor))
  if (Number.isFinite(publicZoom) && publicZoom > 0) return publicZoom
  const transform = scrollSource?.content ? getComputedStyle(scrollSource.content).transform : ''
  if (transform && transform !== 'none') {
    const scale = new DOMMatrixReadOnly(transform).a
    if (scale > 0) return scale
  }
  return 1
}
const applyTranslation = (x: number, y: number) => {
  if (translation.value.x !== x || translation.value.y !== y) translation.value = { x, y }
  // WinUI uses composition expressions, without a transition or render delay.
  const transform = `translate3d(${x}px, ${y}px, 0)`
  if (childHostRef.value && childHostRef.value.style.transform !== transform) childHostRef.value.style.transform = transform
}
const updateParallax = () => {
  const source = scrollSource
  if (!source || !rootRef.value || !childNode.value) { applyTranslation(0, 0); return }
  const zoom = zoomFactor()
  const insideSource = source.viewport.contains(rootRef.value)
  const rootBounds = rootRef.value.getBoundingClientRect()
  const contentBounds = source.content?.getBoundingClientRect()
  const viewportBounds = source.viewport.getBoundingClientRect()
  const sourceZoomMode = unwrap(source.control?.ZoomMode) ?? source.root.getAttribute('ZoomMode')
  const enabledZoom = sourceZoomMode === 'Enabled' || source.viewport.closest('.zoom-mode-enabled') !== null
  const translateAxis = (axis: 'Horizontal' | 'Vertical') => {
    const horizontal = axis === 'Horizontal'
    const viewportSize = horizontal ? source.viewport.clientWidth : source.viewport.clientHeight
    const contentSize = source.content ? horizontal ? source.content.offsetWidth : source.content.offsetHeight : (horizontal ? source.viewport.scrollWidth : source.viewport.scrollHeight) / zoom
    const pan = viewportSize * (source.scrollPresenter || enabledZoom ? 1 : 0.1)
    const parallaxOffset = contentBounds
      ? (horizontal ? rootBounds.left - contentBounds.left : rootBounds.top - contentBounds.top) / zoom
      : (horizontal ? rootBounds.left - viewportBounds.left + source.viewport.scrollLeft : rootBounds.top - viewportBounds.top + source.viewport.scrollTop) / zoom
    const offsets = resolveParallaxOffsets({
      kind: property(`${axis}SourceOffsetKind`) === 'Absolute' || property(`${axis}SourceOffsetKind`) === 0 ? 'Absolute' : 'Relative',
      startOffset: number(`${axis}SourceStartOffset`), endOffset: number(`${axis}SourceEndOffset`),
      viewportSize, contentSize, zoomFactor: zoom, underpan: pan, overpan: pan, insideSource, parallaxOffset,
      parallaxSize: horizontal ? actualSize.value.width : actualSize.value.height
    })
    return computeParallaxTranslation({
      position: horizontal ? source.viewport.scrollLeft : source.viewport.scrollTop, ...offsets,
      shift: number(`${axis}Shift`), maxRatio: number(`Max${axis}ShiftRatio`), clamped: boolValue(property(`Is${axis}ShiftClamped`))
    })
  }
  applyTranslation(translateAxis('Horizontal'), translateAxis('Vertical'))
}

let layoutFrame: number | undefined
let disposed = false
let layoutObserver: ResizeObserver | undefined
let sourceObserver: ResizeObserver | undefined
let sourceMutationObserver: MutationObserver | undefined
let childObserver: MutationObserver | undefined
let observedChild: HTMLElement | null = null
function queueLayout() {
  if (disposed || layoutFrame !== undefined) return
  layoutFrame = requestAnimationFrame(() => { layoutFrame = undefined; updateLayout() })
}
const detachSource = () => { scrollSource?.viewport.removeEventListener('scroll', updateParallax); sourceObserver?.disconnect(); sourceMutationObserver?.disconnect(); scrollSource = null; applyTranslation(0, 0) }
const attachSource = () => {
  if (disposed) return
  detachSource()
  scrollSource = resolveSource(resolvedSource.value)
  if (!scrollSource) return
  scrollSource.viewport.addEventListener('scroll', updateParallax, { passive: true })
  if (typeof ResizeObserver !== 'undefined') {
    sourceObserver = new ResizeObserver(queueLayout)
    for (const element of new Set([scrollSource.root, scrollSource.viewport, scrollSource.content])) if (element) sourceObserver.observe(element)
  }
  sourceMutationObserver = new MutationObserver(records => {
    if (records.every(record => record.target === rootRef.value || childHostRef.value?.contains(record.target))) return
    const next = resolveSource(resolvedSource.value)
    if (next?.viewport !== scrollSource?.viewport || next?.content !== scrollSource?.content) attachSource()
    queueLayout()
  })
  sourceMutationObserver.observe(scrollSource.root, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class', 'ZoomMode'] })
  updateLayout()
}
function RefreshAutomaticHorizontalOffsets() {
  if (property('HorizontalSourceOffsetKind') !== 'Absolute' && number('HorizontalShift') !== 0) updateParallax()
}
function RefreshAutomaticVerticalOffsets() {
  if (property('VerticalSourceOffsetKind') !== 'Absolute' && number('VerticalShift') !== 0) updateParallax()
}
const publicProperties: Record<string, unknown> = {
  RefreshAutomaticHorizontalOffsets, RefreshAutomaticVerticalOffsets,
  ActualWidth: computed(() => actualSize.value.width), ActualHeight: computed(() => actualSize.value.height)
}
for (const name of Object.keys(props) as (keyof Props)[]) publicProperties[name] = computed({
  get: () => name === 'Child' && props.Child === undefined && !('Child' in overrides) ? childControl.value : property(name),
  set: value => { overrides[name] = value; updateXamlBinding(props[name], value, instance) }
})
defineExpose(publicProperties)
watch(() => ({ ...props }), (next, previous) => {
  for (const name of Object.keys(next)) if (next[name as keyof Props] !== previous?.[name as keyof Props]) delete overrides[name]
})
watch(resolvedSource, () => { detachSource(); void nextTick(attachSource) }, { flush: 'post' })
watch(effectiveProps, queueLayout, { deep: false })
watch(() => [unwrap((resolvedSource.value as Record<string, unknown> | null)?.ZoomFactor), unwrap((resolvedSource.value as Record<string, unknown> | null)?.ZoomMode)], updateParallax)
watch(childNode, () => { void nextTick(queueLayout) })
onMounted(() => {
  if (typeof ResizeObserver !== 'undefined') {
    layoutObserver = new ResizeObserver(queueLayout)
    if (rootRef.value) layoutObserver.observe(rootRef.value)
  }
  childObserver = new MutationObserver(queueLayout)
  if (childHostRef.value) childObserver.observe(childHostRef.value, { childList: true, subtree: true, attributes: true, attributeFilter: ['HorizontalAlignment', 'VerticalAlignment', 'Width', 'Height'] })
  window.addEventListener('resize', queueLayout)
  void nextTick(() => { updateLayout(); attachSource() })
})
onUpdated(queueLayout)
onBeforeUnmount(() => { disposed = true; detachSource(); layoutObserver?.disconnect(); childObserver?.disconnect(); window.removeEventListener('resize', queueLayout); if (layoutFrame !== undefined) cancelAnimationFrame(layoutFrame) })
</script>

<style scoped>
.win-parallax-view { position: relative; box-sizing: border-box; width: 100%; height: 100%; min-width: 0; min-height: 0; overflow: hidden }
.parallax-child { position: absolute; will-change: transform; transform: translate3d(0, 0, 0) }
</style>
