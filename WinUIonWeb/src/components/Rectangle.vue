<template>
  <div class="win-rectangle" :style="rectangleStyle" v-bind="forwardedAttrs" />
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, useAttrs } from 'vue'
import { resolveXamlValue } from './xamlRuntime'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  Fill: { type: [String, Object], default: '' },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  RadiusX: { type: [String, Number], default: '' },
  RadiusY: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' }
})
const attrs = useAttrs()
const instance = getCurrentInstance()
const cssLength = (value: unknown) => {
  const resolved = resolveXamlValue(value, instance)
  if (resolved === '' || resolved === undefined || resolved === null) return ''
  return /^-?\d+(?:\.\d+)?$/.test(String(resolved).trim()) ? `${resolved}px` : String(resolved)
}
const forwardedAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})
const rectangleStyle = computed(() => {
  const fill = resolveXamlValue(props.Fill, instance)
  const rx = cssLength(props.RadiusX)
  const ry = cssLength(props.RadiusY)
  return [attrs.style, {
    width: cssLength(props.Width) || undefined,
    height: cssLength(props.Height) || undefined,
    margin: cssLength(props.Margin) || undefined,
    background: fill ? String(fill) : undefined,
    borderRadius: rx || ry ? `${rx || ry} ${ry || rx}` : undefined
  }]
})
</script>

<style>
.win-rectangle { display: block; box-sizing: border-box; min-width: 0; min-height: 0; }
</style>
