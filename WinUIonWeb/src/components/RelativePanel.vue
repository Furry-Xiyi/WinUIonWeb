<template>
  <div ref="root" class="win-relative-panel" :style="rootStyle">
    <ChildrenOutlet />
  </div>
</template>

<script lang="ts">
export const RelativePanelResources = defineComponent({ name: 'RelativePanel.Resources', __relativePanelResources: true, setup: () => () => null })
export default { Resources: RelativePanelResources }
</script>

<script setup lang="ts">
import { computed, defineComponent, Fragment, getCurrentInstance, h, inject, nextTick, onBeforeUnmount, onMounted, onUpdated, provide, ref, useSlots } from 'vue'
import { alignment, cssLength, xamlThickness } from './layout'
import { arrangeRelativePanel, relativePanelStyleChanged } from './relativePanelLayout'
import { normalizeXamlNodes, resolveXamlValue } from './xamlRuntime'
import { layoutResourceChildren } from './layoutResources'
import { getVNodeChildren } from './CollectionProperties'
import { primitiveResourceScope, xamlPrimitiveResourceKey } from './xamlPrimitives'

const rawProps = defineProps({
  Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' }, MinHeight: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' },
  Background: { type: String, default: '' }, BackgroundSizing: { type: String, default: 'InnerBorderEdge' },
  BorderBrush: { type: String, default: '' }, BorderThickness: { type: [String, Number], default: 0 },
  CornerRadius: { type: [String, Number], default: 0 }, Padding: { type: [String, Number], default: 0 },
  Margin: { type: [String, Number], default: 0 }, HorizontalAlignment: { type: String, default: 'Stretch' },
  VerticalAlignment: { type: String, default: 'Stretch' }, Visibility: { type: String, default: 'Visible' }
})

const instance = getCurrentInstance()
const slots = useSlots()
provide(xamlPrimitiveResourceKey, primitiveResourceScope(() => slots.default?.() ?? [], inject(xamlPrimitiveResourceKey, null)))
const resourceChildren = () => (slots.default?.() ?? []).map(node => {
  if (!(node.type as { __relativePanelResources?: boolean })?.__relativePanelResources) return node
  const flatten = (nodes: ReturnType<typeof getVNodeChildren>): ReturnType<typeof getVNodeChildren> => nodes.flatMap(child =>
    (child.type as { __xamlResourceDictionary?: boolean })?.__xamlResourceDictionary ? flatten(getVNodeChildren(child)) : [child])
  return h(RelativePanelResources, null, { default: () => flatten(getVNodeChildren(node)) })
})
const ChildrenOutlet = defineComponent({
  name: 'RelativePanelChildrenOutlet',
  setup() { return () => h(Fragment, normalizeXamlNodes(layoutResourceChildren(resourceChildren(), '__relativePanelResources'), instance)) }
})
const props = computed(() => Object.fromEntries(Object.entries(rawProps).map(([name, value]) => [name, resolveXamlValue(value, instance)])) as typeof rawProps)
const root = ref<HTMLElement | null>(null)
const desiredSize = ref({ width: 0, height: 0 })
const hasLength = (value: unknown) => value !== '' && value !== undefined && !/^(auto|nan)$/i.test(String(value))
const cornerRadius = (value: string | number) => {
  const parts = String(value).split(',').map((part) => cssLength(part.trim()))
  return parts.length === 4 ? parts.join(' ') : cssLength(value)
}
const rootStyle = computed(() => {
  const style: Record<string, string> = {}
  const values = props.value
  if (hasLength(values.Width)) style.flex = '0 0 auto'
  for (const [key, value] of Object.entries({ Width: values.Width, Height: values.Height, MinWidth: values.MinWidth, MinHeight: values.MinHeight, MaxWidth: values.MaxWidth, MaxHeight: values.MaxHeight })) {
    if (hasLength(value)) style[key.charAt(0).toLowerCase() + key.slice(1)] = cssLength(value)
  }
  if (!hasLength(values.Height)) style.minHeight = `${Math.max(Number(values.MinHeight) || 0, desiredSize.value.height)}px`
  if (!hasLength(values.Width) && values.HorizontalAlignment !== 'Stretch') style.width = `${desiredSize.value.width}px`
  style.background = values.Background || 'transparent'
  style.backgroundClip = values.BackgroundSizing === 'OuterBorderEdge' ? 'border-box' : 'padding-box'
  style.borderColor = values.BorderBrush || 'transparent'
  style.borderWidth = xamlThickness(values.BorderThickness)
  style.borderStyle = 'solid'
  style.borderRadius = cornerRadius(values.CornerRadius)
  style.padding = xamlThickness(values.Padding)
  style.margin = xamlThickness(values.Margin)
  style.justifySelf = alignment(values.HorizontalAlignment, 'horizontal')
  style.alignSelf = alignment(values.VerticalAlignment, 'vertical')
  if (values.HorizontalAlignment === 'Center') style.marginInline = 'auto'
  else if (values.HorizontalAlignment === 'Right') style.marginLeft = 'auto'
  if (values.Visibility === 'Collapsed') style.display = 'none'
  return style
})

let mutationObserver: MutationObserver | undefined
let resizeObserver: ResizeObserver | undefined
let queued = false
let disposed = false
const update = () => {
  if (queued || disposed) return
  queued = true
  void nextTick(() => {
    queued = false
    if (!root.value || disposed) return
    if (resizeObserver) for (const child of Array.from(root.value.children)) resizeObserver.observe(child)
    const size = arrangeRelativePanel(root.value, {
      autoWidth: !hasLength(props.value.Width) && props.value.HorizontalAlignment !== 'Stretch',
      autoHeight: !hasLength(props.value.Height),
      minimumHeight: Math.max(0, Number(props.value.MinHeight) || 0)
    })
    if (Math.abs(size.width - desiredSize.value.width) > 0.01 || Math.abs(size.height - desiredSize.value.height) > 0.01) desiredSize.value = size
  })
}
onMounted(() => {
  if (!root.value) return
  mutationObserver = new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.type !== 'attributes' || mutation.attributeName !== 'style' || (mutation.target !== root.value && relativePanelStyleChanged(mutation.target as HTMLElement)))) update()
  })
  mutationObserver.observe(root.value, { childList: true, subtree: true, attributes: true, characterData: true })
  resizeObserver = new ResizeObserver(update)
  resizeObserver.observe(root.value)
  for (const child of Array.from(root.value.children)) resizeObserver.observe(child)
  update()
})
onUpdated(() => {
  if (root.value && resizeObserver) for (const child of Array.from(root.value.children)) resizeObserver.observe(child)
  update()
})
onBeforeUnmount(() => {
  disposed = true
  mutationObserver?.disconnect()
  resizeObserver?.disconnect()
})
</script>

<style scoped>
.win-relative-panel {
  position: relative;
  display: block;
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
}
</style>
