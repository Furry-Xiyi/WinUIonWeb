<template>
  <div ref="root" class="win-grid" :style="rootStyle">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { alignment, applyGridChildren, cssLength, useLayoutObserver, xamlThickness } from './layout'
import { gridDefinitionContextKey } from './layout'

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
})

const root = ref<HTMLElement | null>(null)
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
  return style
})
useLayoutObserver(root, () => { if (root.value) applyGridChildren(root.value) })
</script>

<style scoped>
.win-grid { display: grid; min-width: 0; min-height: 0; box-sizing: border-box; }
</style>
