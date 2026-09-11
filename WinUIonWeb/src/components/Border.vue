<template>
  <div v-bind="forwardedAttrs" class="win-border" :class="attrs.class" :style="borderStyle"><slot /></div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, useAttrs } from 'vue'
import { resolveXamlValue } from './xamlRuntime'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  Background: { type: [String, Object], default: '' },
  BorderBrush: { type: [String, Object], default: '' },
  BorderThickness: { type: [String, Number], default: '' },
  CornerRadius: { type: [String, Number], default: '' },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' },
  MinHeight: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' },
  MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' },
  Padding: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: '' },
  VerticalAlignment: { type: String, default: '' }
})
const attrs = useAttrs()
const instance = getCurrentInstance()
const cssLength = (value: unknown) => {
  const resolved = resolveXamlValue(value, instance)
  if (resolved === '' || resolved === undefined || resolved === null) return ''
  if (typeof resolved === 'number' || /^-?\d+(?:\.\d+)?$/.test(String(resolved).trim())) return `${resolved}px`
  return String(resolved)
}
const thickness = (value: unknown) => {
  const resolved = resolveXamlValue(value, instance)
  if (resolved === '' || resolved === undefined || resolved === null) return ''
  const values = String(resolved).split(',').map((part) => cssLength(part.trim()))
  if (values.length === 1) return values[0]
  if (values.length === 2) return `${values[1]} ${values[0]}`
  if (values.length === 4) return `${values[1]} ${values[2]} ${values[3]} ${values[0]}`
  return String(resolved)
}
const cornerRadius = (value: unknown) => {
  const resolved = resolveXamlValue(value, instance)
  if (resolved === '' || resolved === undefined || resolved === null) return ''
  const parts = String(resolved).split(',').map((part) => cssLength(part.trim()))
  return parts.length > 1 ? parts.join(' ') : parts[0]
}
const align = (value: unknown, axis: 'horizontal' | 'vertical') => {
  const resolved = String(resolveXamlValue(value, instance) || '')
  const map = axis === 'horizontal'
    ? { Left: 'flex-start', Center: 'center', Right: 'flex-end', Stretch: 'stretch' }
    : { Top: 'flex-start', Center: 'center', Bottom: 'flex-end', Stretch: 'stretch' }
  return map[resolved as keyof typeof map] || ''
}
const forwardedAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})
const borderStyle = computed(() => {
  const style: Record<string, string> = {}
  const background = resolveXamlValue(props.Background, instance)
  const brush = resolveXamlValue(props.BorderBrush, instance)
  if (background) style.background = String(background)
  if (brush) { style.borderColor = String(brush); style.borderStyle = 'solid' }
  if (props.BorderThickness !== '') { style.borderWidth = cssLength(props.BorderThickness); style.borderStyle = 'solid' }
  if (props.CornerRadius !== '') style.borderRadius = cornerRadius(props.CornerRadius)
  for (const [key, value] of Object.entries({ Width: props.Width, Height: props.Height, MinWidth: props.MinWidth, MinHeight: props.MinHeight, MaxWidth: props.MaxWidth, MaxHeight: props.MaxHeight })) {
    const resolved = cssLength(value)
    if (resolved) style[key.charAt(0).toLowerCase() + key.slice(1)] = resolved
  }
  if (props.Margin !== '') style.margin = thickness(props.Margin)
  if (props.Padding !== '') style.padding = thickness(props.Padding)
  if (props.HorizontalAlignment) style.alignSelf = align(props.HorizontalAlignment, 'horizontal')
  if (props.VerticalAlignment) style.alignSelf = align(props.VerticalAlignment, 'vertical')
  return [attrs.style, style]
})
</script>

<style>
.win-border { box-sizing: border-box; min-width: 0; min-height: 0; }
</style>
