<template>
  <div ref="root" v-bind="attrs" class="win-canvas" v-acrylic-brush="resolveRootStyle()" v-radial-gradient-brush="backgroundBrush.value.value" :style="[attrs.style, resolveRootStyle()]">
    <ChildrenOutlet />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { brushProperty } from './brushProperties'
export const CanvasResources = defineComponent({ name: 'Canvas.Resources', __canvasResources: true, setup() { return () => null } })
export default { Resources: CanvasResources, Background: brushProperty('Canvas', 'Background') }
</script>

<script setup lang="ts">
import { computed, Fragment, getCurrentInstance, h, ref, useAttrs, useSlots, type VNode } from 'vue'
import { attachedValue, cssLength, useLayoutObserver } from './layout'
import { frameworkLayoutStyle } from './frameworkLayout'
import { layoutResourceChildren } from './layoutResources'
import { normalizeXamlNodes } from './xamlRuntime'
import { vAcrylicBrush } from './acrylicBrushVisual'
import { vRadialGradientBrush } from './RadialGradientVisual'
import { isBrushProperty, useBrushProperty } from './brushProperties'
import { collectXamlResources, useXamlBrushResources } from './xamlBrushResources'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: 0 }, MinHeight: { type: [String, Number], default: 0 },
  MaxWidth: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' },
  Background: { type: [String, Object], default: '' },
  Margin: { type: [String, Number], default: 0 },
  HorizontalAlignment: { type: String, default: 'Stretch' }, VerticalAlignment: { type: String, default: 'Stretch' },
  Visibility: { type: String, default: 'Visible' }, IsHitTestVisible: { type: [String, Boolean], default: true },
  Opacity: { type: [String, Number], default: 1 }
})
const root = ref<HTMLElement | null>(null)
const attrs = useAttrs()
const slots = useSlots()
const instance = getCurrentInstance()
const brushResources = useXamlBrushResources(instance)
const syncBrushResources = () => {
  const declarations: Record<string, VNode> = {}
  const visit = (nodes: VNode[]) => {
    for (const node of nodes) {
      if (node.type === Fragment && Array.isArray(node.children)) visit(node.children as VNode[])
      else if ((node.type as { __canvasResources?: boolean })?.__canvasResources) {
        const children = Array.isArray(node.children) ? node.children as VNode[]
          : (node.children as { default?: () => VNode[] } | null)?.default?.() ?? []
        collectXamlResources(children, declarations)
      }
    }
  }
  visit(slots.default?.() ?? [])
  brushResources.sync(declarations)
}
const backgroundBrush = useBrushProperty('Background', () => props.Background, () => slots.default?.() ?? [], instance)
const rootStyle = computed(() => ({ ...frameworkLayoutStyle(props, instance), ...backgroundBrush.style.value }))
const resolveRootStyle = () => {
  syncBrushResources()
  return rootStyle.value
}
const ChildrenOutlet = defineComponent({
  setup() { return () => h(Fragment, normalizeXamlNodes(layoutResourceChildren(slots.default?.() ?? [], '__canvasResources').filter(node => !isBrushProperty(node)), instance)) }
})
useLayoutObserver(root, () => {
  if (!root.value) return
  for (const child of Array.from(root.value.children)) {
    const element = child as HTMLElement
    if (element.classList.contains('win-acrylic-visual') || element.classList.contains('win-radial-gradient-background') || element.classList.contains('win-theme-shadow-visual')) continue
    element.style.position = 'absolute'
    element.style.left = cssLength(attachedValue(element, 'Canvas.Left') ?? 0)
    element.style.top = cssLength(attachedValue(element, 'Canvas.Top') ?? 0)
    element.style.zIndex = String(Number(attachedValue(element, 'Canvas.ZIndex') ?? 0) || 0)
  }
})
</script>

<style scoped>
.win-canvas {
  position: relative;
  display: block;
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  isolation: isolate;
}
</style>
