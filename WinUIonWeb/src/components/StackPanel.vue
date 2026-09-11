<template>
  <div class="win-stack-panel" :style="rootStyle">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { alignment, applyStackChildren, cssLength, useLayoutObserver, xamlThickness } from './layout'

const props = defineProps({
  Orientation: { type: String, default: 'Vertical' }, Spacing: { type: [String, Number], default: 0 },
  Width: { type: [String, Number], default: '' }, Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' }, MinHeight: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' },
  Background: { type: String, default: '' }, BackgroundSizing: { type: String, default: '' },
  BorderBrush: { type: String, default: '' }, BorderThickness: { type: [String, Number], default: '' },
  CornerRadius: { type: [String, Number], default: '' }, Padding: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' }, HorizontalAlignment: { type: String, default: '' },
  VerticalAlignment: { type: String, default: '' }
})
const root = ref<HTMLElement | null>(null)
const rootStyle = computed(() => {
  const style: Record<string, string> = {
    flexDirection: props.Orientation === 'Horizontal' ? 'row' : 'column',
    gap: cssLength(props.Spacing),
    alignItems: 'stretch'
  }
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
  if (props.HorizontalAlignment) style.justifySelf = alignment(props.HorizontalAlignment, 'horizontal')
  if (props.VerticalAlignment) style.alignSelf = alignment(props.VerticalAlignment, 'vertical')
  return style
})
useLayoutObserver(root, () => { if (root.value) applyStackChildren(root.value, props.Orientation) })
</script>

<style scoped>
.win-stack-panel {
  display: flex;
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
}
</style>
