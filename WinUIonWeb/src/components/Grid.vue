<template>
  <div
    ref="root"
    class="win-grid"
    :data-horizontal-alignment="props.HorizontalAlignment || undefined"
    :style="rootStyle"
    @contextmenu="onContextMenu">
    <slot></slot>
    <RuntimeMenuFlyout
      :Open="contextOpen"
      :AnchorRect="contextAnchor"
      :Items="contextItems"
      Placement="Right"
      @Close="closeContextMenu" />
  </div>
</template>

<script lang="ts">
import { Fragment, defineComponent, h } from 'vue'
import GridColumnDefinitions from './GridColumnDefinitions.vue'
import GridRowDefinitions from './GridRowDefinitions.vue'

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
  ContextFlyout: GridContextFlyout
}
</script>

<script setup lang="ts">
import { computed, getCurrentInstance, inject, onBeforeUnmount, provide, ref, useSlots } from 'vue'
import { alignment, applyGridChildren, cssLength, useLayoutObserver, xamlThickness } from './layout'
import { gridDefinitionContextKey } from './layout'
import RuntimeMenuFlyout from './MenuFlyout.vue'
import { resolveXamlHandler, resolveXamlValue, xamlItemContextKey } from './xamlRuntime'

const props = defineProps({
  Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' }, MinHeight: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' },
  Background: { type: String, default: '' }, BackgroundSizing: { type: String, default: '' },
  BorderBrush: { type: String, default: '' }, BorderThickness: { type: [String, Number], default: '' },
  CornerRadius: { type: [String, Number], default: '' }, Padding: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' },
  ColumnDefinitions: { type: [String, Array, Object], default: '' }, RowDefinitions: { type: [String, Array, Object], default: '' },
  ColumnSpacing: { type: [String, Number], default: 0 }, RowSpacing: { type: [String, Number], default: 0 },
  HorizontalAlignment: { type: String, default: '' }, VerticalAlignment: { type: String, default: '' }
  , Visibility: { type: String, default: 'Visible' }
})

const root = ref<HTMLElement | null>(null)
const slots = useSlots()
const instance = getCurrentInstance()
const itemContext = inject(xamlItemContextKey, undefined)
const contextOpen = ref(false)
const contextAnchor = ref<DOMRect | null>(null)

const childrenOf = (node: any): any[] => {
  if (!node) return []
  if (Array.isArray(node.children)) return node.children
  if (node.children && typeof node.children === 'object' && typeof node.children.default === 'function') {
    return node.children.default() ?? []
  }
  return []
}

const marker = (node: any, key: string) => Boolean(node?.type?.[key])
const contextMenuItemNodes = computed(() => {
  const result: any[] = []
  const visit = (nodes: any[]) => {
    for (const node of nodes) {
      if (!node) continue
      if (marker(node, '__contextFlyoutProperty') || marker(node, '__menuFlyoutDefinition')) {
        visit(childrenOf(node))
        continue
      }
      if (marker(node, '__menuFlyoutItem')) {
        result.push(node)
        continue
      }
      const children = childrenOf(node)
      if (children.length) visit(children)
    }
  }
  visit(slots.default?.() ?? [])
  return result
})

const contextItems = computed(() => contextMenuItemNodes.value.map((node) => {
  const props = node.props ?? {}
  const text = resolveXamlValue(props.Text, instance) ?? props.Text ?? ''
  const handler = typeof props.onClick === 'function'
    ? props.onClick
    : resolveXamlHandler(props.Click, instance, { Item: itemContext, DataContext: itemContext })
  return {
    Text: String(text),
    IsEnabled: props.IsEnabled !== false && props.IsEnabled !== 'False',
    Click: (event: unknown) => {
      handler?.({
        ClickedItem: itemContext,
        DataContext: itemContext,
        OriginalSource: (event as { target?: unknown } | undefined)?.target ?? root.value
      })
      closeContextMenu()
    }
  }
}))

const onContextMenu = (event: MouseEvent) => {
  if (!contextItems.value.length) return
  event.preventDefault()
  event.stopPropagation()
  contextAnchor.value = root.value?.getBoundingClientRect() ?? null
  contextOpen.value = true
}
const closeContextMenu = () => {
  contextOpen.value = false
  contextAnchor.value = null
}

const columnDefinitions = ref<Record<string, unknown>[]>([])
const rowDefinitions = ref<Record<string, unknown>[]>([])
const registerDefinition = (axis: 'columns' | 'rows', definition: Record<string, unknown>) => {
  const target = axis === 'columns' ? columnDefinitions : rowDefinitions
  target.value = [...target.value, definition]
  return () => { target.value = target.value.filter((entry) => entry !== definition) }
}
provide(gridDefinitionContextKey, { registerDefinition })
const definitionValue = (definition: unknown, dimension: 'Width' | 'Height') => {
  if (typeof definition === 'object' && definition !== null) {
    const value = (definition as Record<string, unknown>)[dimension]
    return value === undefined || value === '' ? 'auto' : String(value)
  }
  return String(definition ?? 'auto')
}
const definitions = (value: unknown, dimension: 'Width' | 'Height') => {
  const values = Array.isArray(value)
    ? value
    : value && typeof value === 'object'
      ? [value]
      : String(value ?? '').split(/[;,]/).map((part) => part.trim()).filter(Boolean)
  return values.map((entry) => {
    const objectEntry = typeof entry === 'object' && entry !== null ? entry as Record<string, unknown> : null
    const minDimension = dimension === 'Width' ? 'MinWidth' : 'MinHeight'
    const maxDimension = dimension === 'Width' ? 'MaxWidth' : 'MaxHeight'
    const min = objectEntry?.[minDimension] ? cssLength(objectEntry[minDimension]) : '0px'
    const max = objectEntry?.[maxDimension] ? cssLength(objectEntry[maxDimension]) : ''
    const size = definitionValue(entry, dimension).trim()
    if (!size || size.toLowerCase() === 'auto') {
      return min !== '0px' || max ? `minmax(${min}, ${max || 'auto'})` : 'auto'
    }
    if (size === '*') return `minmax(${min}, ${max || '1fr'})`
    const star = size.match(/^([0-9]+(?:\.[0-9]+)?)\s*\*$/)
    if (star) return `minmax(${min}, ${max || `${star[1]}fr`})`
    const fixed = cssLength(size)
    return min !== '0px' || max ? `minmax(${min}, ${max || fixed})` : fixed
  }).join(' ')
}
const rootStyle = computed(() => {
  const style: Record<string, string> = {}
  for (const [key, value] of Object.entries({ Width: props.Width, Height: props.Height, MinWidth: props.MinWidth, MinHeight: props.MinHeight, MaxWidth: props.MaxWidth, MaxHeight: props.MaxHeight })) {
    if (value !== '') style[key.charAt(0).toLowerCase() + key.slice(1)] = cssLength(value)
  }
  if (props.Background) style.background = props.Background
  if (props.BorderBrush) style.borderColor = props.BorderBrush
  if (props.BorderThickness !== '') style.borderWidth = cssLength(props.BorderThickness)
  if (props.BorderBrush || props.BorderThickness !== '') style.borderStyle = 'solid'
  if (props.CornerRadius !== '') style.borderRadius = cssLength(props.CornerRadius)
  if (props.Padding !== '') style.padding = xamlThickness(props.Padding)
  if (props.Margin !== '') style.margin = xamlThickness(props.Margin)
  const columns = columnDefinitions.value.length ? definitions(columnDefinitions.value, 'Width') : definitions(props.ColumnDefinitions, 'Width')
  const rows = rowDefinitions.value.length ? definitions(rowDefinitions.value, 'Height') : definitions(props.RowDefinitions, 'Height')
  if (columns) style.gridTemplateColumns = columns
  if (rows) style.gridTemplateRows = rows
  if (props.ColumnSpacing !== '') style.columnGap = cssLength(props.ColumnSpacing)
  if (props.RowSpacing !== '') style.rowGap = cssLength(props.RowSpacing)
  if (props.HorizontalAlignment) style.justifySelf = alignment(props.HorizontalAlignment, 'horizontal')
  if (props.VerticalAlignment) style.alignSelf = alignment(props.VerticalAlignment, 'vertical')
  if (props.Visibility === 'Collapsed') style.display = 'none'
  else if (props.Visibility === 'Hidden') style.visibility = 'hidden'
  return style
})
useLayoutObserver(root, () => { if (root.value) applyGridChildren(root.value) })
onBeforeUnmount(closeContextMenu)
</script>

<style scoped>
.win-grid { display: grid; min-width: 0; min-height: 0; box-sizing: border-box; }
.win-grid :deep(.menu-flyout-definition) { display: none; }
</style>
