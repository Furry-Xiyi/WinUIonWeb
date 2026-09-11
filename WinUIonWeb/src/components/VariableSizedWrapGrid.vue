<template>
  <div class="win-variable-sized-wrap-grid" :class="orientationClass" :style="rootStyle">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { alignment, applyVariableSizedChildren, cssLength, useLayoutObserver, xamlThickness } from './layout'

const props = defineProps({
  Orientation: { type: String, default: 'Vertical' }, ItemWidth: { type: [String, Number], default: 44 },
  ItemHeight: { type: [String, Number], default: 44 }, MaximumRowsOrColumns: { type: [String, Number], default: -1 },
  Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' }, MinHeight: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' },
  Background: { type: String, default: '' }, Padding: { type: [String, Number], default: '' }, Margin: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: '' }, VerticalAlignment: { type: String, default: '' },
  HorizontalChildrenAlignment: { type: String, default: 'Stretch' }, VerticalChildrenAlignment: { type: String, default: 'Stretch' }
})
const root = ref<HTMLElement | null>(null)
const orientationClass = computed(() => props.Orientation === 'Horizontal' ? 'orientation-horizontal' : 'orientation-vertical')
const rootStyle = computed(() => {
  const maximum = Number(props.MaximumRowsOrColumns)
  const hasMaximum = Number.isFinite(maximum) && maximum > 0
  const horizontal = props.Orientation === 'Horizontal'
  const style: Record<string, string> = { '--vsg-item-width': cssLength(props.ItemWidth), '--vsg-item-height': cssLength(props.ItemHeight) }
  for (const [key, value] of Object.entries({ Width: props.Width, Height: props.Height, MinWidth: props.MinWidth, MinHeight: props.MinHeight, MaxWidth: props.MaxWidth, MaxHeight: props.MaxHeight })) {
    if (value !== '') style[key.charAt(0).toLowerCase() + key.slice(1)] = cssLength(value)
  }
  if (props.Background) style.background = props.Background
  if (props.Padding !== '') style.padding = xamlThickness(props.Padding)
  if (props.Margin !== '') style.margin = xamlThickness(props.Margin)
  if (props.HorizontalAlignment) style.justifySelf = alignment(props.HorizontalAlignment, 'horizontal')
  if (props.VerticalAlignment) style.alignSelf = alignment(props.VerticalAlignment, 'vertical')
  if (horizontal) {
    style.gridAutoFlow = 'row'; style.gridAutoColumns = 'var(--vsg-item-width)'
    if (hasMaximum) style.gridTemplateColumns = `repeat(${maximum}, var(--vsg-item-width))`
  } else {
    style.gridAutoFlow = 'column'; style.gridAutoRows = 'var(--vsg-item-height)'
    if (hasMaximum) style.gridTemplateRows = `repeat(${maximum}, var(--vsg-item-height))`
  }
  return style
})
useLayoutObserver(root, () => { if (root.value) applyVariableSizedChildren(root.value) })
</script>

<style scoped>
.win-variable-sized-wrap-grid {
  display: grid;
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
  grid-auto-rows: var(--vsg-item-height);
  grid-auto-columns: var(--vsg-item-width);
}
</style>
