<template>
  <span
    ref="rootElement"
    v-bind="elementAttrs"
    class="win-animated-icon"
    :style="iconStyle"
    :data-animated-icon-state="currentState"
    :data-animated-icon-progress="progress"
    :data-animated-icon-playing="isPlaying"
    :data-animated-icon-source="visualSource?.name"
    aria-hidden="true">
    <DeclarationOutlet />
    <span class="win-animated-icon-grid" :class="{ 'has-animated-visual': visualSource }">
      <svg class="win-animated-icon-collapsed-path"><path /></svg>
      <svg
        v-if="visualSource"
        class="win-animated-icon-visual"
        :viewBox="viewBox"
        preserveAspectRatio="xMidYMid meet"
        :style="visualStyle"
        v-html="visualMarkup"></svg>
      <FallbackOutlet v-else />
    </span>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { GetState, SetState } from './animatedIconRuntime'

const Source = defineComponent({
  name: 'AnimatedIcon.Source',
  __animatedIconProperty: 'Source',
  setup() { return () => null }
})
const FallbackIconSource = defineComponent({
  name: 'AnimatedIcon.FallbackIconSource',
  __animatedIconProperty: 'FallbackIconSource',
  setup() { return () => null }
})

export default { Source, FallbackIconSource, SetState, GetState }
</script>

<script setup lang="ts">
import { computed, Fragment, getCurrentInstance, h, isVNode, onBeforeUnmount, onMounted, ref, shallowReactive, shallowRef, useAttrs, useSlots, watch, type Component, type CSSProperties, type PropType, type VNode } from 'vue'
import BitmapIcon from './BitmapIcon.vue'
import FontIcon from './FontIcon.vue'
import PathIcon from './PathIcon.vue'
import SymbolIcon from './SymbolIcon.vue'
import { frameworkLayoutStyle } from './frameworkLayout'
import { getAnimatedIconVisualSource } from './animatedIconVisuals'
import { findAnimatedIconStateAncestor, subscribeAnimatedIconState } from './animatedIconRuntime'
import { resolveXamlValue, updateXamlBinding } from './xamlRuntime'

defineOptions({ name: 'AnimatedIcon', inheritAttrs: false })
const props = defineProps({
  Source: { type: null as unknown as PropType<unknown>, default: undefined as unknown },
  FallbackIconSource: { type: null as unknown as PropType<unknown>, default: undefined as unknown },
  Foreground: { type: String, default: '' },
  MirroredWhenRightToLeft: { type: [Boolean, String], default: false },
  FlowDirection: { type: String, default: '' },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' },
  MinHeight: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' },
  MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: 'Stretch' },
  VerticalAlignment: { type: String, default: 'Stretch' },
  Visibility: { type: String, default: 'Visible' },
  IsHitTestVisible: { type: [Boolean, String], default: true },
  Opacity: { type: [String, Number], default: 1 }
})
const emit = defineEmits(['update:Source', 'update:FallbackIconSource', 'update:Foreground', 'update:MirroredWhenRightToLeft'])
const attrs = useAttrs()
const slots = useSlots()
const instance = getCurrentInstance()
const rootElement = ref<HTMLElement | null>(null)
const resolve = (value: unknown) => resolveXamlValue(value, instance)
const overrides = shallowReactive<Record<string, unknown>>({})
const propertyValue = (name: keyof typeof props): unknown => name in overrides ? overrides[name] : resolve(props[name])
const dependencyProperty = (name: 'Source' | 'FallbackIconSource' | 'Foreground' | 'MirroredWhenRightToLeft') => computed({
  get: () => name === 'Source' ? visualSource.value : name === 'FallbackIconSource'
    ? fallbackSource.value && { kind: fallbackSource.value.kind, ...fallbackSource.value.props }
    : propertyValue(name),
  set: value => {
    overrides[name] = value
    updateXamlBinding(props[name], value, instance)
    emit(`update:${name}`, value)
  }
})
for (const name of ['Source', 'FallbackIconSource', 'Foreground', 'MirroredWhenRightToLeft'] as const) {
  watch(() => resolve(props[name]), () => { delete overrides[name] })
}

interface VisualSource {
  name: string
  duration: number
  size: { width: number; height: number }
  markers: Record<string, number>
  render: (progress: number, foreground?: string) => string
}
interface FallbackSource { kind: string; props: Record<string, unknown> }
const declaration = shallowRef<{ sourceName: string; fallback: FallbackSource | null }>({ sourceName: '', fallback: null })
const childrenOf = (node: VNode): VNode[] => {
  const children = Array.isArray(node.children) ? node.children : (node.children as { default?: () => VNode | VNode[] } | null)?.default?.()
  return Array.isArray(children) ? children.filter(isVNode) : isVNode(children) ? [children] : []
}
const flatten = (nodes: VNode[]): VNode[] => nodes.flatMap(node => node.type === Fragment ? flatten(childrenOf(node)) : [node])
const localTypeName = (value: unknown) => typeName(value).replace(/^.*:/, '')
const typeName = (value: unknown): string => {
  if (typeof value === 'string') return value
  if (!value || typeof value !== 'object') return ''
  const object = value as Record<string, unknown>
  return String(object.__animatedIconVisualSourceName ?? object.__animatedVisualSourceName ?? object.name ?? object.type ?? object.$type ?? object.__name ?? '')
}
const sameFallback = (a: FallbackSource | null, b: FallbackSource | null) => {
  if (!a || !b) return a === b
  const keys = Object.keys(a.props)
  return a.kind === b.kind && keys.length === Object.keys(b.props).length && keys.every(key => a.props[key] === b.props[key])
}
const DeclarationOutlet = defineComponent({
  name: 'AnimatedIconDeclarationOutlet',
  setup() {
    return () => {
      let sourceName = ''
      let fallback: FallbackSource | null = null
      for (const node of flatten(slots.default?.() ?? [])) {
        const name = localTypeName(node.type)
        const property = (node.type as { __animatedIconProperty?: string })?.__animatedIconProperty
          ?? (name === 'AnimatedIcon.Source' ? 'Source' : name === 'AnimatedIcon.FallbackIconSource' ? 'FallbackIconSource' : undefined)
        const child = flatten(childrenOf(node))[0]
        if (/^Animated.*VisualSource$/.test(name)) sourceName = name
        if (property === 'Source' && child) sourceName = localTypeName(child.type)
        if (property === 'FallbackIconSource' && child) {
          const kind = (child.type as { __iconSourceKind?: string })?.__iconSourceKind ?? typeName(child.type).replace(/Source$/, '')
          fallback = { kind, props: { ...child.props } }
        }
      }
      if (sourceName !== declaration.value.sourceName || !sameFallback(fallback, declaration.value.fallback)) declaration.value = { sourceName, fallback }
      return null
    }
  }
})
const visualSource = computed<VisualSource | null>(() => {
  const value = 'Source' in overrides || props.Source !== undefined ? propertyValue('Source') : declaration.value.sourceName
  if (value && typeof value === 'object' && typeof (value as VisualSource).render === 'function') return value as VisualSource
  const name = typeName(value).replace(/^.*:/, '')
  if (!/^Animated(?:Accept|Back|ChevronDownSmall|ChevronRightDownSmall|ChevronUpDownSmall|Find|GlobalNavigationButton|Settings)VisualSource$/.test(name)) return null
  try { return getAnimatedIconVisualSource(name as Parameters<typeof getAnimatedIconVisualSource>[0]) ?? null } catch { return null }
})
const fallbackSource = computed<FallbackSource | null>(() => {
  if (!('FallbackIconSource' in overrides) && props.FallbackIconSource === undefined) return declaration.value.fallback
  const value = propertyValue('FallbackIconSource')
  if (!value || typeof value !== 'object') return null
  const object = value as Record<string, unknown>
  return { kind: String(object.__iconSourceKind ?? object.kind ?? typeName(object).replace(/Source$/, '')), props: object }
})
const FallbackOutlet = defineComponent({
  name: 'AnimatedIconFallbackOutlet',
  setup() {
    return () => {
      const source = fallbackSource.value
      if (!source) return null
      const types = { SymbolIcon, FontIcon, PathIcon, BitmapIcon } as Record<string, Component>
      const type = types[source.kind]
      if (!type) return null
      const values = Object.fromEntries(Object.entries(source.props).map(([key, value]) => [key, resolve(value)]))
      return h(type, values)
    }
  }
})

const progress = ref(0)
const currentState = ref('')
const previousState = ref('')
const isPlaying = ref(false)
let pendingState: string | null = null
let pendingFrame: number | null = null
let playbackFrame: number | null = null
let playbackGeneration = 0
let previousSegmentLength = 1
let segmentEnd = 0
const queuedStates: string[] = []
let disposed = false
const reducedMotion = ref(false)
let motionQuery: MediaQueryList | null = null
let watchedAncestor: Element | null = null
let unsubscribeState: (() => void) | null = null
let directionObserver: MutationObserver | null = null
const directionRevision = ref(0)
const clampProgress = (value: number) => Math.max(0, Math.min(1, value))
const cancelPlayback = () => {
  playbackGeneration += 1
  if (playbackFrame !== null) cancelAnimationFrame(playbackFrame)
  playbackFrame = null
  isPlaying.value = false
}
const completePlayback = () => {
  playbackFrame = null
  isPlaying.value = false
  const next = queuedStates.shift()
  if (next !== undefined) transitionTo(next)
}
const playSegment = (from: number | null, to: number) => {
  cancelPlayback()
  const start = from === null ? progress.value : clampProgress(from)
  const end = clampProgress(to)
  segmentEnd = end
  if (from !== null) previousSegmentLength = Math.abs(to - from)
  const duration = (visualSource.value?.duration ?? 0) * previousSegmentLength * 1000
  if (from !== null) progress.value = start
  if (duration < 20 || reducedMotion.value) {
    progress.value = end
    completePlayback()
    return
  }
  isPlaying.value = true
  const generation = playbackGeneration
  const started = performance.now()
  const tick = (time: number) => {
    if (disposed || generation !== playbackGeneration) return
    const fraction = Math.min(1, Math.max(0, (time - started) / duration))
    progress.value = start + (end - start) * fraction
    if (fraction < 1) playbackFrame = requestAnimationFrame(tick)
    else completePlayback()
  }
  playbackFrame = requestAnimationFrame(tick)
}
const jumpTo = (value: number) => {
  cancelPlayback()
  progress.value = clampProgress(value)
  segmentEnd = progress.value
  completePlayback()
}
function transitionTo(toState: string) {
  const fromState = currentState.value
  previousState.value = fromState
  currentState.value = toState
  const source = visualSource.value
  if (!source) { cancelPlayback(); completePlayback(); return }
  const markers = source.markers
  const transition = `${fromState}To${toState}`
  const start = markers[`${transition}_Start`]
  const end = markers[`${transition}_End`]
  if (start !== undefined && end !== undefined) { playSegment(start, end); return }
  if (end !== undefined) { jumpTo(end); return }
  if (start !== undefined) { jumpTo(start); return }
  if (markers[transition] !== undefined) { jumpTo(markers[transition]); return }
  if (markers[toState] !== undefined) { jumpTo(markers[toState]); return }
  const compatibleEnd = Object.keys(markers).sort().find(key => key.includes(`To${toState}_End`))
  if (compatibleEnd) { jumpTo(markers[compatibleEnd]); return }
  const numeric = toState.trim()
  if (numeric && /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(numeric)) playSegment(null, Number(numeric))
  else jumpTo(0)
}
const requestState = (state: string) => {
  pendingState = state
  if (pendingFrame !== null || disposed) return
  pendingFrame = requestAnimationFrame(() => {
    pendingFrame = null
    const next = pendingState
    pendingState = null
    if (next === null || disposed) return
    if (isPlaying.value) {
      if (queuedStates.length >= 4) {
        const first = queuedStates.shift()
        queuedStates.push(next)
        if (first !== undefined) transitionTo(first)
      } else queuedStates.push(next)
    } else transitionTo(next)
  })
}

const elementAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([name]) => name !== 'AnimatedIcon.State')))
const viewBox = computed(() => `0 0 ${visualSource.value?.size.width ?? 48} ${visualSource.value?.size.height ?? 48}`)
const visualMarkup = computed(() => visualSource.value?.render(progress.value, String(propertyValue('Foreground') || 'currentColor')) ?? '')
const explicitLength = (value: unknown) => value !== undefined && value !== null && value !== '' && value !== 'Auto'
const numericLength = (value: unknown) => {
  const text = String(value ?? '').trim()
  return /^\d+(?:\.\d+)?(?:px)?$/.test(text) ? Number.parseFloat(text) : null
}
const iconStyle = computed<CSSProperties>(() => {
  const source = visualSource.value
  const width = resolve(props.Width)
  const height = resolve(props.Height)
  const numericWidth = numericLength(width)
  const numericHeight = numericLength(height)
  return {
    ...(source ? {
      width: !explicitLength(width) && numericHeight !== null ? `${numericHeight * source.size.width / source.size.height}px` : `${source.size.width}px`,
      height: !explicitLength(height) && numericWidth !== null
        ? `${numericWidth * source.size.height / source.size.width}px`
        : !explicitLength(width) ? `${source.size.height}px` : 'auto',
      aspectRatio: `${source.size.width} / ${source.size.height}`
    } : {}),
    ...frameworkLayoutStyle(props, instance),
    pointerEvents: resolve(props.IsHitTestVisible) === false || resolve(props.IsHitTestVisible) === 'False' ? 'none' : undefined,
    color: propertyValue('Foreground') ? String(propertyValue('Foreground')) : undefined,
    direction: propertyValue('FlowDirection') === 'RightToLeft' ? 'rtl' : propertyValue('FlowDirection') === 'LeftToRight' ? 'ltr' : undefined
  }
})
const visualStyle = computed(() => {
  directionRevision.value
  const direction = propertyValue('FlowDirection') || (rootElement.value && getComputedStyle(rootElement.value).direction === 'rtl' ? 'RightToLeft' : 'LeftToRight')
  const mirrored = propertyValue('MirroredWhenRightToLeft')
  return { transform: direction === 'RightToLeft' && mirrored !== true && mirrored !== 'True' ? 'scaleX(-1)' : undefined }
})
watch(() => resolve(attrs['AnimatedIcon.State']), state => {
  if (state !== undefined && rootElement.value) SetState(rootElement.value, state)
})
const onReducedMotion = () => {
  reducedMotion.value = motionQuery?.matches ?? false
  if (reducedMotion.value && isPlaying.value) {
    cancelPlayback()
    progress.value = segmentEnd
    completePlayback()
  }
}
watch(visualSource, (next, previous) => {
  if (next === previous) return
  cancelPlayback()
  queuedStates.length = 0
  if (next && currentState.value) transitionTo(currentState.value)
  else if (!next) progress.value = 0
})
onMounted(() => {
  const root = rootElement.value
  if (!root) return
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.value = motionQuery.matches
  motionQuery.addEventListener('change', onReducedMotion)
  const declaredState = resolve(attrs['AnimatedIcon.State'])
  if (declaredState !== undefined) SetState(root, declaredState)
  watchedAncestor = findAnimatedIconStateAncestor(root)
  if (!GetState(root) && watchedAncestor) SetState(root, GetState(watchedAncestor))
  currentState.value = GetState(root)
  unsubscribeState = subscribeAnimatedIconState(root, change => {
    if (change.Target === root) requestState(change.State)
    else {
      if (!watchedAncestor) watchedAncestor = findAnimatedIconStateAncestor(root)
      if (change.Target === watchedAncestor) SetState(root, change.State)
    }
  })
  if (currentState.value) requestState(currentState.value)
  directionObserver = new MutationObserver(() => { directionRevision.value += 1 })
  let ancestor: Element | null = root
  while (ancestor) {
    directionObserver.observe(ancestor, { attributes: true, attributeFilter: ['dir', 'class', 'style'] })
    ancestor = ancestor.parentElement
  }
  directionRevision.value += 1
})
onBeforeUnmount(() => {
  disposed = true
  if (pendingFrame !== null) cancelAnimationFrame(pendingFrame)
  cancelPlayback()
  queuedStates.length = 0
  unsubscribeState?.()
  directionObserver?.disconnect()
  motionQuery?.removeEventListener('change', onReducedMotion)
})
defineExpose({
  Source: dependencyProperty('Source'),
  FallbackIconSource: dependencyProperty('FallbackIconSource'),
  Foreground: dependencyProperty('Foreground'),
  MirroredWhenRightToLeft: dependencyProperty('MirroredWhenRightToLeft'),
  Element: computed(() => rootElement.value),
  $el: computed(() => rootElement.value)
})
</script>

<style scoped>
/* A composition visual fills the measured icon independently of the host's
   flex/grid alignment. Fallback content still participates in measurement. */
.win-animated-icon { display: inline-grid; position: relative; grid-template-columns: minmax(0, 1fr); grid-template-rows: minmax(0, 1fr); box-sizing: border-box; flex: 0 0 auto; max-width: 100%; min-width: 0; min-height: 0; overflow: hidden; vertical-align: middle; line-height: 1; }
.win-animated-icon-grid { display: grid; position: relative; min-width: 0; min-height: 0; width: 100%; height: 100%; align-items: center; justify-items: center; }
.win-animated-icon-grid.has-animated-visual { position: absolute; inset: 0; }
.win-animated-icon-collapsed-path { display: none; }
.win-animated-icon-visual { position: absolute; inset: 0; display: block; width: 100%; height: 100%; overflow: hidden; fill: currentColor; transform-origin: center; }
</style>
