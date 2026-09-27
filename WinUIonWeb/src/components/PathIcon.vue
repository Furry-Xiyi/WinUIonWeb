<template>
  <span ref="Element" v-bind="rootAttrs" class="win-icon-element win-path-icon" :class="attrs.class" :style="[attrs.style, iconStyle]">
    <Grid class="win-icon-grid" data-icon-part="LayoutRoot" Background="Transparent">
      <svg class="win-path-icon-path" data-icon-part="Path" :width="naturalSize.width" :height="naturalSize.height" aria-hidden="true">
        <path ref="pathElement" :d="geometry.path" :fill-rule="geometry.fillRule" />
      </svg>
    </Grid>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export const PathIconData = defineComponent({ name: 'PathIcon.Data', __iconGeometryProperty: true, setup() { return () => null } })
export default { Data: PathIconData }
</script>

<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onMounted, ref, useAttrs, useSlots, watch } from 'vue'
import { iconElementProps, useIconElement } from './iconElementRuntime'
import { resolveIconGeometry } from './iconGeometry'
import Grid from './Grid.vue'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  Data: { type: [String, Object], default: null },
  ...iconElementProps
})
const attrs = useAttrs()
const slots = useSlots()
const instance = getCurrentInstance()
const { Element, read, layoutStyle, rootAttrs, api } = useIconElement(props, attrs, instance, ['Data'])
defineExpose(api)
const pathElement = ref<SVGPathElement>()
const naturalSize = ref({ width: 0, height: 0 })
const geometry = computed(() => {
  const resolved = read('Data')
  return resolveIconGeometry(resolved === '' || resolved === null ? slots.default?.() ?? [] : resolved, instance)
})
const measureGeometry = async () => {
  await nextTick()
  if (!geometry.value.path) { naturalSize.value = { width: 0, height: 0 }; return }
  try {
    const bounds = pathElement.value?.getBBox()
    // The default Path Stretch is None: preserve its coordinate origin.
    naturalSize.value = bounds ? { width: Math.max(0, bounds.x + bounds.width), height: Math.max(0, bounds.y + bounds.height) } : { width: 0, height: 0 }
  } catch {
    naturalSize.value = { width: 0, height: 0 }
  }
}
watch(geometry, measureGeometry)
onMounted(measureGeometry)
const iconStyle = computed(() => ({ width: `${naturalSize.value.width}px`, height: `${naturalSize.value.height}px`, ...layoutStyle.value }))
</script>

<style scoped>
.win-path-icon-path { display: block; width: 100%; height: 100%; min-width: 0; min-height: 0; overflow: hidden; fill: currentColor; }
</style>
