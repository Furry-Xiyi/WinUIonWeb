<template>
  <div
    ref="root"
    class="win-grid"
    v-acrylic-brush="resolveRootStyle()"
    v-radial-gradient-brush="backgroundBrush.value.value"
    v-theme-shadow="{ Shadow, Translation }"
    :data-horizontal-alignment="resolveProp(props.HorizontalAlignment) || undefined"
    :style="resolveRootStyle()"
    @contextmenu="onContextMenu">
    <ChildrenOutlet />
    <ContextFlyoutOutlet />
  </div>
</template>

<script lang="ts">
import { Fragment, defineComponent, h } from 'vue'
import GridColumnDefinitions from './GridColumnDefinitions.vue'
import GridRowDefinitions from './GridRowDefinitions.vue'
import { GridResources } from './gridResources'
import { brushProperty } from './brushProperties'

// XAML property element used by collection item templates.  It is kept as a
// structural node so materialized DataTemplates can safely contain
// <Grid.ContextFlyout> without producing an undefined VNode.  The owning Grid
// can consume this marker when context-menu interaction is implemented.
export const GridContextFlyout = defineComponent({
  name: 'Grid.ContextFlyout',
  __contextFlyoutProperty: true,
  setup(_, { slots }) {
    return () => h(Fragment, slots.default?.())
  }
})

// Support XAML property elements when Grid is imported locally, like Expander.
export default {
  ColumnDefinitions: GridColumnDefinitions,
  RowDefinitions: GridRowDefinitions,
  Resources: GridResources,
  Background: brushProperty('Grid', 'Background'),
  Shadow: brushProperty('Grid', 'Shadow'),
  ContextFlyout: GridContextFlyout
}
</script>

<script setup lang="ts">
import { cloneVNode, computed, defineComponent, Fragment, getCurrentInstance, h, inject, onBeforeUnmount, provide, ref, shallowRef, useSlots, watch, type VNode } from 'vue'
import { alignment, applyGridChildren, attachedValue, cssLength, useLayoutObserver, xamlThickness } from './layout'
import { gridDefinitionContextKey } from './layout'

import { normalizeXamlNodes, resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlItemContextKey } from './xamlRuntime'
import { constrainedStarSizes, gridTrackCss, parseGridTracks } from './gridTracks'
import { layoutResourceChildren } from './layoutResources'
import { primitiveResourceScope, xamlPrimitiveResourceKey } from './xamlPrimitives'
import { resolveBrushStyle } from './AcrylicBrush'
import { isBrushProperty, useBrushProperty } from './brushProperties'
import { vAcrylicBrush } from './acrylicBrushVisual'
import { collectXamlResources, useXamlBrushResources } from './xamlBrushResources'
import { vRadialGradientBrush } from './RadialGradientVisual'
import { vThemeShadow } from './themeShadowVisual'

const props = defineProps({
  Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' }, MinHeight: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' },
  Background: { type: [String, Object], default: '' }, BackgroundSizing: { type: String, default: '' },
  BorderBrush: { type: String, default: '' }, BorderThickness: { type: [String, Number], default: 0 },
  CornerRadius: { type: [String, Number], default: '' }, Padding: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' },
  ColumnDefinitions: { type: [String, Array, Object], default: '' }, RowDefinitions: { type: [String, Array, Object], default: '' },
  ColumnSpacing: { type: [String, Number], default: 0 }, RowSpacing: { type: [String, Number], default: 0 },
  HorizontalAlignment: { type: String, default: '' }, VerticalAlignment: { type: String, default: '' }
  , Visibility: { type: String, default: 'Visible' }
  , Shadow: { type: [String, Object], default: null }
  , Translation: { type: [String, Object], default: () => ({ X: 0, Y: 0, Z: 0 }) }
})

const root = ref<HTMLElement | null>(null)
const emit = defineEmits(['update:Shadow', 'update:Translation'])
const slots = useSlots()
const instance = getCurrentInstance()
const brushResources = useXamlBrushResources(instance)
const syncBrushResources = () => {
  const declarations: Record<string, VNode> = {}
  const visit = (nodes: VNode[]) => {
    for (const node of nodes) {
      if (node.type === Fragment && Array.isArray(node.children)) visit(node.children as VNode[])
      else if ((node.type as { __gridResourcesProperty?: boolean })?.__gridResourcesProperty) {
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
const shadowProperty = useBrushProperty('Shadow', () => props.Shadow, () => slots.default?.() ?? [], instance)
const localShadow = shallowRef<unknown>()
const Shadow = computed({
  get: () => localShadow.value === undefined ? shadowProperty.value.value : localShadow.value,
  set: value => { localShadow.value = value; updateXamlBinding(props.Shadow, value, instance); emit('update:Shadow', value) }
})
watch(() => resolveXamlValue(props.Shadow, instance), () => { localShadow.value = undefined })
const localTranslation = shallowRef(resolveXamlValue(props.Translation, instance))
const Translation = computed({
  get: () => localTranslation.value,
  set: value => { localTranslation.value = value; updateXamlBinding(props.Translation, value, instance); emit('update:Translation', value) }
})
watch(() => resolveXamlValue(props.Translation, instance), value => { localTranslation.value = value }, { deep: true })
defineExpose({ Element: root, Shadow, Translation })
const primitiveResources = primitiveResourceScope(() => slots.default?.() ?? [], inject(xamlPrimitiveResourceKey, null))
provide(xamlPrimitiveResourceKey, primitiveResources)
const itemContext = inject(xamlItemContextKey, undefined)
const itemScope = () => itemContext && typeof itemContext === 'object'
  ? { Item: itemContext, DataContext: itemContext, ...itemContext as Record<string, unknown> }
  : { Item: itemContext, DataContext: itemContext }
const resolveProp = (value: unknown) => resolveXamlValue(value, instance, itemScope())
const attachedProperties = ['Grid.Row', 'Grid.Column', 'Grid.RowSpan', 'Grid.ColumnSpan', 'Canvas.ZIndex', 'HorizontalAlignment', 'VerticalAlignment']
const normalizeChild = (node: VNode): VNode => {
  if (node.type === Fragment && Array.isArray(node.children)) {
    const clone = cloneVNode(node)
    clone.children = (node.children as VNode[]).map(normalizeChild)
    return clone
  }
  const props = { ...(node.props ?? {}) }
  // A slot VNode's normalized ref belongs to its declaring control. Passing
  // the raw ref through cloneVNode would register it on GridChildrenOutlet.
  delete props.ref
  for (const name of attachedProperties) {
    if (name in props) props[name] = resolveProp(props[name])
  }
  const clone = cloneVNode(node, props)
  clone.ref = node.ref
  return clone
}
const ChildrenOutlet = defineComponent({
  name: 'GridChildrenOutlet',
  setup() {
    return () => h(Fragment, layoutResourceChildren(normalizeXamlNodes(slots.default?.() ?? [], instance), '__gridResourcesProperty').filter(node => !(node.type as any)?.__contextFlyoutProperty && !isBrushProperty(node)).map(normalizeChild))
  }
})
const contextFlyoutRef = ref<any>(null)
const contextNodes = computed(() => {
  const result: VNode[] = []
  const visit = (nodes: VNode[]) => {
    for (const node of nodes) {
      if (node.type === Fragment && Array.isArray(node.children)) visit(node.children as VNode[])
      else if ((node.type as any)?.__contextFlyoutProperty) {
        const children = Array.isArray(node.children) ? node.children : (node.children as any)?.default?.() ?? []
        result.push(...children)
      }
    }
  }
  visit(slots.default?.() ?? [])
  return result
})
const ContextFlyoutOutlet = defineComponent({ setup: () => () => h(Fragment, normalizeXamlNodes(contextNodes.value, instance).map(node => cloneVNode(node, { ref: (control: any) => { contextFlyoutRef.value = control } }, true))) })
const onContextMenu = (event: MouseEvent) => {
  if (!contextNodes.value.length || !root.value) return
  event.preventDefault()
  event.stopPropagation()
  const rect = root.value.getBoundingClientRect()
  void contextFlyoutRef.value?.ShowAt?.(root.value, { Position: { X: event.clientX - rect.left, Y: event.clientY - rect.top } })
}
const closeContextMenu = () => { contextFlyoutRef.value?.Hide?.() }

const columnDefinitions = ref<Record<string, unknown>[]>([])
const rowDefinitions = ref<Record<string, unknown>[]>([])
const registerDefinition = (axis: 'columns' | 'rows', definition: Record<string, unknown>) => {
  const target = axis === 'columns' ? columnDefinitions : rowDefinitions
  target.value = [...target.value, definition]
  return () => { target.value = target.value.filter((entry) => entry !== definition) }
}
provide(gridDefinitionContextKey, { registerDefinition })
const columns = computed(() => parseGridTracks(columnDefinitions.value.length ? columnDefinitions.value : resolveProp(props.ColumnDefinitions), 'Width'))
const rows = computed(() => parseGridTracks(rowDefinitions.value.length ? rowDefinitions.value : resolveProp(props.RowDefinitions), 'Height'))
const spacing = (value: unknown) => Math.max(0, Number(resolveProp(value)) || 0)
const rootStyle = computed(() => {
  const style: Record<string, string> = {}
  const width = resolveProp(props.Width)
  if (width !== '' && width !== undefined && width !== 'Auto') style.flex = '0 0 auto'
  for (const [key, value] of Object.entries({ Width: props.Width, Height: props.Height, MinWidth: props.MinWidth, MinHeight: props.MinHeight, MaxWidth: props.MaxWidth, MaxHeight: props.MaxHeight })) {
    const resolved = resolveProp(value)
    if (resolved !== '' && resolved !== undefined && resolved !== null) style[key.charAt(0).toLowerCase() + key.slice(1)] = cssLength(resolved)
  }
  const background = resolveProp(props.Background)
  const borderBrush = resolveProp(props.BorderBrush)
  const borderThickness = resolveProp(props.BorderThickness)
  const cornerRadius = resolveProp(props.CornerRadius)
  Object.assign(style, backgroundBrush.style.value)
  style.backgroundClip = resolveProp(props.BackgroundSizing) === 'OuterBorderEdge' ? 'border-box' : 'padding-box'
  if (borderBrush) style.borderColor = String(borderBrush)
  if (borderThickness !== '' && borderThickness !== undefined) style.borderWidth = xamlThickness(borderThickness)
  if (borderBrush || borderThickness !== '') style.borderStyle = 'solid'
  if (cornerRadius !== '' && cornerRadius !== undefined) style.borderRadius = String(cornerRadius).split(',').map((value) => cssLength(value.trim())).join(' ')
  style.padding = xamlThickness(resolveProp(props.Padding))
  style.margin = xamlThickness(resolveProp(props.Margin))
  style.gridTemplateColumns = columns.value.map(gridTrackCss).join(' ')
  style.gridTemplateRows = rows.value.map(gridTrackCss).join(' ')
  style.columnGap = cssLength(spacing(props.ColumnSpacing))
  style.rowGap = cssLength(spacing(props.RowSpacing))
  style.justifySelf = alignment(resolveProp(props.HorizontalAlignment), 'horizontal')
  style.alignSelf = alignment(resolveProp(props.VerticalAlignment), 'vertical')
  const translation = Translation.value
  const [x, y] = typeof translation === 'string' ? translation.split(',').map(Number) : [Number(translation?.X), Number(translation?.Y)]
  if (x || y) style.transform = `translate(${x || 0}px, ${y || 0}px)`
  if (resolveProp(props.Visibility) === 'Collapsed') style.display = 'none'
  else if (resolveProp(props.Visibility) === 'Hidden') style.visibility = 'hidden'
  return style
})
const resolveRootStyle = () => {
  syncBrushResources()
  return rootStyle.value
}
const arrangeChildren = () => {
  const element = root.value
  if (!element) return
  applyGridChildren(element)
  const index = (child: HTMLElement, property: string, count: number) => Math.min(count - 1, Math.max(0, Math.floor(Number(attachedValue(child, property)) || 0)))
  const span = (child: HTMLElement, property: string, remaining: number) => Math.min(remaining, Math.max(1, Math.floor(Number(attachedValue(child, property)) || 1)))
  for (const child of Array.from(element.children) as HTMLElement[]) {
    if (child.classList.contains('win-acrylic-visual') || child.classList.contains('win-radial-gradient-background') || child.classList.contains('win-theme-shadow-visual')) continue
    const row = index(child, 'Grid.Row', rows.value.length)
    const column = index(child, 'Grid.Column', columns.value.length)
    child.style.gridRow = `${row + 1} / span ${span(child, 'Grid.RowSpan', rows.value.length - row)}`
    child.style.gridColumn = `${column + 1} / span ${span(child, 'Grid.ColumnSpan', columns.value.length - column)}`
  }
  const style = getComputedStyle(element)
  for (const axis of ['columns', 'rows'] as const) {
    const tracks = axis === 'columns' ? columns.value : rows.value
    if (!tracks.some((track) => track.unit !== 'pixel' && Number.isFinite(track.max))) continue
    const horizontal = axis === 'columns'
    const property = horizontal ? 'gridTemplateColumns' : 'gridTemplateRows'
    element.style[property] = tracks.map(gridTrackCss).join(' ')
    const measured = getComputedStyle(element)[property].split(' ').map((value) => Number.parseFloat(value))
    const padding = horizontal ? Number.parseFloat(style.paddingLeft) + Number.parseFloat(style.paddingRight) : Number.parseFloat(style.paddingTop) + Number.parseFloat(style.paddingBottom)
    const available = (horizontal ? element.clientWidth : element.clientHeight) - padding - (tracks.length - 1) * spacing(horizontal ? props.ColumnSpacing : props.RowSpacing)
    element.style[property] = constrainedStarSizes(tracks, available, measured).map((size) => `${size}px`).join(' ')
  }
}
useLayoutObserver(root, arrangeChildren)
onBeforeUnmount(closeContextMenu)
</script>

<style scoped>
.win-grid { display: grid; min-width: 0; min-height: 0; box-sizing: border-box; justify-content: start; align-content: start; }
.win-grid > :deep(*) { grid-column: 1; grid-row: 1; }
/* Keep each visual subtree in Grid child order without overriding explicit layers. */
:where(.win-grid) > :deep(*) { z-index: 0; }
.win-grid :deep(.menu-flyout-definition) { display: none; }
</style>
