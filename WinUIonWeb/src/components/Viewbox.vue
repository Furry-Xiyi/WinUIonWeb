<template>
  <div ref="rootRef" v-bind="forwardedAttrs" class="win-viewbox" :class="attrs.class" :style="rootStyle">
    <div ref="contentRef" class="win-viewbox-container" :style="containerStyle">
      <ChildPresenter />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

const ViewboxChild = defineComponent({
  name: 'Viewbox.Child',
  __viewboxChildProperty: true,
  setup: () => () => null
})

export default { Child: ViewboxChild }
</script>

<script setup lang="ts">
import { Comment, computed, Fragment, getCurrentInstance, isVNode, nextTick, onBeforeUnmount, onMounted, onUpdated, ref, shallowRef, Text, useAttrs, useSlots, watch, type VNode } from 'vue'
import { alignment, cssLength, xamlThickness } from './layout'
import { resolveXamlValue, updateXamlBinding } from './xamlRuntime'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  Child: { type: null, default: undefined },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: 0 },
  MinHeight: { type: [String, Number], default: 0 },
  MaxWidth: { type: [String, Number], default: '' },
  MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' },
  Visibility: { type: String, default: 'Visible' },
  Stretch: { type: String, default: 'Uniform' },
  StretchDirection: { type: String, default: 'Both' },
  HorizontalAlignment: { type: String, default: 'Stretch' },
  VerticalAlignment: { type: String, default: 'Stretch' }
})
const emit = defineEmits(['update:Child', 'update:Stretch', 'update:StretchDirection'])
const attrs = useAttrs()
const slots = useSlots()
const instance = getCurrentInstance()
const rootRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const naturalSize = ref({ width: 0, height: 0 })
const parentSize = ref({ width: Infinity, height: Infinity })
const arrangedSize = ref({ width: 0, height: 0 })
const stretchOverride = ref<string | undefined>()
const directionOverride = ref<string | undefined>()
const childOverride = shallowRef<VNode | null | undefined>()
const resolved = computed(() => Object.fromEntries(
  Object.entries(props).map(([name, value]) => [name, resolveXamlValue(value, instance)])
))
const stretch = computed(() => stretchOverride.value ?? String(resolved.value.Stretch ?? 'Uniform'))
const stretchDirection = computed(() => directionOverride.value ?? String(resolved.value.StretchDirection ?? 'Both'))
const visualChildren = (nodes: VNode[]): VNode[] => nodes.flatMap((node) => {
  if (node.type === Comment || (node.type === Text && !String(node.children ?? '').trim())) return []
  if (node.type === Fragment) return visualChildren((node.children as VNode[]) ?? [])
  if ((node.type as { __viewboxChildProperty?: boolean })?.__viewboxChildProperty) {
    const children = node.children as { default?: () => VNode[] } | null
    return visualChildren(children?.default?.() ?? [])
  }
  return [node]
})
const ChildPresenter = () => {
  if (childOverride.value !== undefined) return childOverride.value
  if (isVNode(resolved.value.Child)) return resolved.value.Child
  const children = visualChildren(slots.default?.() ?? [])
  if (children.length > 1) throw new Error('Viewbox can contain only one child.')
  return children[0] ?? null
}
const forwardedAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

const numericLength = (value: unknown, fallback = Infinity): number => {
  if (value === '' || value === null || value === undefined || String(value) === 'Auto') return fallback
  const number = Number(String(value).replace(/px$/, ''))
  return Number.isFinite(number) ? Math.max(0, number) : fallback
}
const constrainedLength = (value: number, minimum: unknown, maximum: unknown) =>
  Math.max(numericLength(minimum, 0), Math.min(numericLength(maximum), value))

// CViewbox measures its internal Border at infinity, then applies exactly
// the same scale calculation when measuring and arranging that visual.
const computeScale = (available: { width: number; height: number }, content: { width: number; height: number }) => {
  let x = 1
  let y = 1
  const constrainedWidth = Number.isFinite(available.width)
  const constrainedHeight = Number.isFinite(available.height)
  if (stretch.value !== 'None' && (constrainedWidth || constrainedHeight)) {
    x = content.width === 0 ? 0 : available.width / content.width
    y = content.height === 0 ? 0 : available.height / content.height
    if (!constrainedWidth) x = y
    else if (!constrainedHeight) y = x
    else if (stretch.value === 'Uniform') x = y = Math.min(x, y)
    else if (stretch.value === 'UniformToFill') x = y = Math.max(x, y)
    if (stretchDirection.value === 'UpOnly') {
      x = Math.max(1, x)
      y = Math.max(1, y)
    } else if (stretchDirection.value === 'DownOnly') {
      x = Math.min(1, x)
      y = Math.min(1, y)
    }
  }
  return { x, y }
}
const availableSize = computed(() => ({
  width: constrainedLength(numericLength(resolved.value.Width, parentSize.value.width), resolved.value.MinWidth, resolved.value.MaxWidth),
  height: constrainedLength(numericLength(resolved.value.Height, parentSize.value.height), resolved.value.MinHeight, resolved.value.MaxHeight)
}))
const desiredSize = computed(() => {
  const scale = computeScale(availableSize.value, naturalSize.value)
  return { width: scale.x * naturalSize.value.width, height: scale.y * naturalSize.value.height }
})
const rootStyle = computed(() => {
  const style: Record<string, string> = {
    display: resolved.value.Visibility === 'Collapsed' ? 'none' : '',
    width: cssLength(resolved.value.Width) || `${desiredSize.value.width}px`,
    height: cssLength(resolved.value.Height) || `${desiredSize.value.height}px`,
    minWidth: cssLength(resolved.value.MinWidth),
    minHeight: cssLength(resolved.value.MinHeight),
    maxWidth: cssLength(resolved.value.MaxWidth),
    maxHeight: cssLength(resolved.value.MaxHeight),
    margin: xamlThickness(resolved.value.Margin),
    justifySelf: alignment(resolved.value.HorizontalAlignment, 'horizontal'),
    alignSelf: alignment(resolved.value.VerticalAlignment, 'vertical')
  }
  return [attrs.style, style]
})
const layoutOffset = (space: number, renderSize: number, value: unknown) => {
  if (value === 'Left' || value === 'Top') return 0
  if (value === 'Right' || value === 'Bottom') return space - renderSize
  if (value === 'Stretch' && renderSize > space) return 0
  return (space - renderSize) / 2
}
const containerStyle = computed(() => {
  const finalSize = {
    width: arrangedSize.value.width || numericLength(resolved.value.Width, desiredSize.value.width),
    height: arrangedSize.value.height || numericLength(resolved.value.Height, desiredSize.value.height)
  }
  const scale = computeScale(finalSize, naturalSize.value)
  return {
    left: `${layoutOffset(finalSize.width, naturalSize.value.width * scale.x, resolved.value.HorizontalAlignment)}px`,
    top: `${layoutOffset(finalSize.height, naturalSize.value.height * scale.y, resolved.value.VerticalAlignment)}px`,
    transform: `scale(${scale.x}, ${scale.y})`
  }
})

let resizeObserver: ResizeObserver | undefined
let mutationObserver: MutationObserver | undefined
let frame = 0
let disposed = false
const setSize = (target: typeof naturalSize, width: number, height: number) => {
  if (target.value.width !== width || target.value.height !== height) target.value = { width, height }
}
const measure = () => {
  frame = 0
  const root = rootRef.value
  const content = contentRef.value
  if (!root || !content) return
  // offset sizes are unaffected by RenderTransform. The content wrapper's
  // max-content size never depends on its own previously measured size.
  setSize(naturalSize, content.offsetWidth, content.offsetHeight)
  setSize(arrangedSize, root.clientWidth, root.clientHeight)
  const parent = root.parentElement
  if (!parent) return
  // A Viewbox measures its child at infinity. Reading the max-content
  // wrapper's current zero size here makes nested Viewboxes stay at scale 0.
  if (parent.classList.contains('win-viewbox-container')) {
    setSize(parentSize, Infinity, Infinity)
    return
  }
  const style = getComputedStyle(parent)
  const rootComputedStyle = getComputedStyle(root)
  const horizontalStack = style.display.includes('flex') && style.flexDirection.startsWith('row')
  const verticalStack = style.display.includes('flex') && style.flexDirection.startsWith('column')
  const width = horizontalStack ? Infinity : Math.max(0, parent.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0) - (parseFloat(rootComputedStyle.marginLeft) || 0) - (parseFloat(rootComputedStyle.marginRight) || 0))
  const definiteHeight = parent.style.height !== '' || parent.style.minHeight !== '' || parent.classList.contains('win-grid')
  const height = verticalStack || !definiteHeight ? Infinity : Math.max(0, parent.clientHeight - (parseFloat(style.paddingTop) || 0) - (parseFloat(style.paddingBottom) || 0) - (parseFloat(rootComputedStyle.marginTop) || 0) - (parseFloat(rootComputedStyle.marginBottom) || 0))
  setSize(parentSize, width, height)
}
const scheduleMeasure = () => {
  if (disposed || frame) return
  frame = requestAnimationFrame(measure)
}
onMounted(async () => {
  await nextTick()
  if (disposed) return
  measure()
  contentRef.value?.addEventListener('load', scheduleMeasure, true)
  contentRef.value?.addEventListener('error', scheduleMeasure, true)
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(scheduleMeasure)
    if (rootRef.value) resizeObserver.observe(rootRef.value)
    if (contentRef.value) resizeObserver.observe(contentRef.value)
    if (rootRef.value?.parentElement) resizeObserver.observe(rootRef.value.parentElement)
  }
  mutationObserver = new MutationObserver((records) => {
    if (records.some((record) => record.target !== contentRef.value || record.type !== 'attributes')) scheduleMeasure()
  })
  if (contentRef.value) mutationObserver.observe(contentRef.value, {
    childList: true, subtree: true, characterData: true, attributes: true,
    attributeFilter: ['src', 'width', 'height', 'style', 'class']
  })
  document.fonts?.addEventListener('loadingdone', scheduleMeasure)
})
onUpdated(scheduleMeasure)
onBeforeUnmount(() => {
  disposed = true
  if (frame) cancelAnimationFrame(frame)
  resizeObserver?.disconnect()
  mutationObserver?.disconnect()
  contentRef.value?.removeEventListener('load', scheduleMeasure, true)
  contentRef.value?.removeEventListener('error', scheduleMeasure, true)
  document.fonts?.removeEventListener('loadingdone', scheduleMeasure)
})
watch(resolved, scheduleMeasure)
watch(() => resolved.value.Child, () => { childOverride.value = undefined })
watch(() => resolved.value.Stretch, () => { stretchOverride.value = undefined })
watch(() => resolved.value.StretchDirection, () => { directionOverride.value = undefined })
const Stretch = computed({
  get: () => stretch.value,
  set: (value: string) => {
    stretchOverride.value = value
    updateXamlBinding(props.Stretch, value, instance)
    emit('update:Stretch', value)
  }
})
const StretchDirection = computed({
  get: () => stretchDirection.value,
  set: (value: string) => {
    directionOverride.value = value
    updateXamlBinding(props.StretchDirection, value, instance)
    emit('update:StretchDirection', value)
  }
})
const Child = computed({
  get: () => childOverride.value !== undefined ? childOverride.value : isVNode(resolved.value.Child) ? resolved.value.Child : visualChildren(slots.default?.() ?? [])[0] ?? null,
  set: (value: VNode | null) => {
    childOverride.value = value
    updateXamlBinding(props.Child, value, instance)
    emit('update:Child', value)
  }
})
defineExpose({ Child, Stretch, StretchDirection, DesiredSize: desiredSize, RenderSize: arrangedSize, rootRef })
</script>

<style scoped>
.win-viewbox {
  position: relative;
  display: block;
  box-sizing: border-box;
  flex: 0 0 auto;
  overflow: hidden;
}

.win-viewbox-container {
  position: absolute;
  display: grid;
  width: max-content;
  height: max-content;
  max-width: none;
  max-height: none;
  transform-origin: 0 0;
}
</style>
