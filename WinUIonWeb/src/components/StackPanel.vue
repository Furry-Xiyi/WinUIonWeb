<template>
  <div ref="root" class="win-stack-panel" v-acrylic-brush="rootStyle" v-radial-gradient-brush="backgroundBrush.value.value" :style="rootStyle" :HorizontalAlignment="resolve(HorizontalAlignment) || 'Stretch'" :VerticalAlignment="resolve(VerticalAlignment) || 'Stretch'">
    <ContentOutlet />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { brushProperty } from './brushProperties'

const StackPanelResources = defineComponent({
  name: 'StackPanel.Resources',
  __xamlResourceProperty: 'resources',
  setup() { return () => null }
})

export default { Resources: StackPanelResources, Background: brushProperty('StackPanel', 'Background') }
</script>

<script setup lang="ts">
import { cloneVNode, computed, defineComponent, Fragment, getCurrentInstance, h, inject, nextTick, onMounted, onUpdated, provide, ref, unref, useSlots, watch, type ComputedRef, type VNode } from 'vue'
import { alignment, applyStackChildren, cssLength, useLayoutObserver, xamlThickness } from './layout'
import { normalizeXamlNodes, resolveXamlValue, updateXamlBinding, xamlItemContextKey } from './xamlRuntime'
import { resolveBrushStyle } from './AcrylicBrush'
import { isBrushProperty, useBrushProperty } from './brushProperties'
import { vAcrylicBrush } from './acrylicBrushVisual'
import { collectXamlResources, useXamlBrushResources } from './xamlBrushResources'
import { vRadialGradientBrush } from './RadialGradientVisual'
import { primitiveResourceScope, primitiveResourceStyles, xamlPrimitiveResourceKey } from './xamlPrimitives'

const props = defineProps({
  Orientation: { type: String, default: 'Vertical' }, Spacing: { type: [String, Number], default: 0 },
  Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' }, MinHeight: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' },
  Background: { type: [String, Object], default: '' }, BackgroundSizing: { type: String, default: '' },
  BorderBrush: { type: String, default: '' }, BorderThickness: { type: [String, Number], default: '' },
  CornerRadius: { type: [String, Number], default: '' }, Padding: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' }, HorizontalAlignment: { type: String, default: '' },
  VerticalAlignment: { type: String, default: '' }, Visibility: { type: String, default: 'Visible' },
  Opacity: { type: [String, Number], default: 1 }
})
const emit = defineEmits(['update:Orientation', 'update:Spacing'])
const root = ref<HTMLElement | null>(null)
const instance = getCurrentInstance()
const slots = useSlots()
const backgroundBrush = useBrushProperty('Background', () => props.Background, () => slots.default?.() ?? [], instance)
const resolve = (value: unknown) => resolveXamlValue(value, instance)
const resolvedOrientation = computed(() => resolve(props.Orientation) === 'Horizontal' ? 'Horizontal' : 'Vertical')
const localOrientation = ref(resolvedOrientation.value)
watch(resolvedOrientation, (value) => { localOrientation.value = value })
const Orientation = computed({
  get: () => localOrientation.value,
  set: (value: string) => {
    const next = value === 'Horizontal' ? 'Horizontal' : 'Vertical'
    if (next === localOrientation.value) return
    localOrientation.value = next
    updateXamlBinding(props.Orientation, next, instance)
    emit('update:Orientation', next)
  }
})
const resolvedSpacing = computed(() => Math.max(0, Number(resolve(props.Spacing)) || 0))
const localSpacing = ref(resolvedSpacing.value)
watch(resolvedSpacing, (value) => { localSpacing.value = value })
const Spacing = computed({
  get: () => localSpacing.value,
  set: (value: number) => {
    const next = Math.max(0, Number(value) || 0)
    if (next === localSpacing.value) return
    localSpacing.value = next
    updateXamlBinding(props.Spacing, next, instance)
    emit('update:Spacing', next)
  }
})
const implicitStyleKey = Symbol.for('WinUIonWeb.StackPanel.ImplicitStyles')
type ImplicitStyles = Record<string, Record<string, unknown>>
const inheritedStyles = inject<ComputedRef<ImplicitStyles> | null>(implicitStyleKey, null)
const nodeName = (node: VNode) => {
  const type = node.type as { name?: string; __name?: string } | string
  return typeof type === 'string' ? type : type?.name ?? type?.__name ?? ''
}
const childrenOf = (node: VNode): VNode[] => {
  if (Array.isArray(node.children)) return node.children as VNode[]
  const childSlots = node.children as { default?: () => VNode[] } | null
  return typeof childSlots?.default === 'function' ? childSlots.default() : []
}
const flatten = (nodes: VNode[]): VNode[] => nodes.flatMap((node) => node?.type === Fragment ? flatten(childrenOf(node)) : node ? [node] : [])
const isResources = (node: VNode) => nodeName(node) === 'StackPanel.Resources'
const itemContext = inject(xamlItemContextKey, undefined)
const nodes = computed(() => {
  // DataTemplate hosts are reused by collection controls. Track the current
  // item so materialized bindings are rebuilt when the selected item changes.
  unref(itemContext)
  return flatten(slots.default?.() ?? [])
})
const inheritedPrimitives = inject(xamlPrimitiveResourceKey, null)
const localPrimitives = primitiveResourceScope(() => nodes.value)
provide(xamlPrimitiveResourceKey, primitiveResourceScope(() => nodes.value, inheritedPrimitives))
const brushResources = useXamlBrushResources(instance)
const implicitStyles = computed(() => {
  const result: ImplicitStyles = { ...(inheritedStyles?.value ?? {}) }
  for (const resource of nodes.value.filter(isResources)) {
    for (const style of flatten(childrenOf(resource))) {
      if (nodeName(style) !== 'Style' || style.props?.['x:Key']) continue
      const target = String(resolve(style.props?.TargetType) ?? '').replace(/^\{x:Type\s+|\}$/g, '').split(':').pop() ?? ''
      if (!target) continue
      const setters: Record<string, unknown> = {}
      for (const setter of flatten(childrenOf(style))) {
        if (nodeName(setter) !== 'Setter') continue
        const property = setter.props?.Property
        if (typeof property === 'string' && property) setters[property] = resolve(setter.props?.Value)
      }
      result[target] = setters
    }
  }
  return result
})
provide(implicitStyleKey, implicitStyles)
const applyChildren = () => {
  if (!root.value) return
  applyStackChildren(root.value, Orientation.value)
}
const ContentOutlet = defineComponent({
  name: 'StackPanelContentOutlet',
  setup() {
    onMounted(() => { void nextTick(applyChildren) })
    onUpdated(() => { void nextTick(applyChildren) })
    return () => {
      const declarations: Record<string, VNode> = {}
      for (const resource of nodes.value.filter(isResources)) collectXamlResources(childrenOf(resource), declarations)
      brushResources.sync(declarations)
      const content = nodes.value.filter((node) => !isResources(node) && !isBrushProperty(node)).map((node) => {
        const defaults = implicitStyles.value[nodeName(node)]
        const childProps = { ...defaults, ...(node.props ?? {}) }
        // Controls can set their own FrameworkElement alignment defaults
        // (ComboBox uses Left/Top). The panel must measure with those same
        // defaults instead of writing Stretch back over the child's layout.
        const controlProps = (node.type as { props?: Record<string, { default?: unknown }> })?.props
        const childAlignment = (name: 'HorizontalAlignment' | 'VerticalAlignment') =>
          resolve(childProps[name] ?? controlProps?.[name]?.default) || 'Stretch'
        // Keep refs on the component that declared the slot, rather than
        // normalizing them again against StackPanelContentOutlet.
        delete childProps.ref
        const clone = cloneVNode(node, {
          ...childProps,
          'data-stack-panel-horizontal-alignment': childAlignment('HorizontalAlignment'),
          'data-stack-panel-vertical-alignment': childAlignment('VerticalAlignment'),
          'data-stack-panel-width': resolve(childProps.Width) ?? '',
          'data-stack-panel-height': resolve(childProps.Height) ?? ''
        })
        clone.ref = node.ref
        return clone
      })
      return h(Fragment, normalizeXamlNodes(content, instance))
    }
  }
})
const rootStyle = computed(() => {
  const style: Record<string, string> = {
    ...primitiveResourceStyles(localPrimitives.value),
    flexDirection: Orientation.value === 'Horizontal' ? 'row' : 'column',
    gap: cssLength(Spacing.value),
    alignItems: 'stretch',
    opacity: String(resolve(props.Opacity))
  }
  for (const [key, value] of Object.entries({ Width: props.Width, Height: props.Height, MinWidth: props.MinWidth, MinHeight: props.MinHeight, MaxWidth: props.MaxWidth, MaxHeight: props.MaxHeight })) {
    const resolved = resolve(value)
    if (resolved !== '' && resolved !== undefined && resolved !== null) style[key.charAt(0).toLowerCase() + key.slice(1)] = cssLength(resolved)
  }
  const background = resolve(props.Background)
  const borderBrush = resolve(props.BorderBrush)
  const borderThickness = resolve(props.BorderThickness)
  Object.assign(style, backgroundBrush.style.value)
  if (background) style.backgroundClip = resolve(props.BackgroundSizing) === 'OuterBorderEdge' ? 'border-box' : 'padding-box'
  const hasBorderThickness = borderThickness !== '' && borderThickness !== undefined && borderThickness !== null
  if (borderBrush || hasBorderThickness) {
    style.borderColor = String(borderBrush || 'transparent')
    style.borderWidth = xamlThickness(borderThickness) || '0px'
    style.borderStyle = 'solid'
  }
  const cornerRadius = resolve(props.CornerRadius)
  if (cornerRadius !== '' && cornerRadius !== undefined) style.borderRadius = String(cornerRadius).split(',').map((value) => cssLength(value.trim())).join(' ')
  const padding = resolve(props.Padding)
  const margin = resolve(props.Margin)
  if (padding !== '') style.padding = xamlThickness(padding)
  if (margin !== '') style.margin = xamlThickness(margin)
  const horizontal = resolve(props.HorizontalAlignment)
  const vertical = resolve(props.VerticalAlignment)
  if (horizontal) style.justifySelf = alignment(horizontal, 'horizontal')
  if (vertical) style.alignSelf = alignment(vertical, 'vertical')
  if (resolve(props.Visibility) === 'Collapsed') style.display = 'none'
  return style
})
useLayoutObserver(root, applyChildren)
defineExpose({ Orientation, Spacing })
</script>

<style scoped>
.win-stack-panel {
  display: flex;
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
}
.win-stack-panel > :deep(*) { flex-shrink: 0; }
.win-stack-panel > :deep([data-stack-panel-cross-alignment="start"]) { align-self: flex-start !important; }
.win-stack-panel > :deep([data-stack-panel-cross-alignment="center"]) { align-self: center !important; }
.win-stack-panel > :deep([data-stack-panel-cross-alignment="end"]) { align-self: flex-end !important; }
.win-stack-panel > :deep([data-stack-panel-cross-alignment="stretch"]) { align-self: stretch !important; }
</style>
