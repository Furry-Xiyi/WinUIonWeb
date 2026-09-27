<template>
  <span ref="Element" v-bind="rootAttrs" class="win-icon-element win-bitmap-icon" :class="attrs.class" :style="[attrs.style, iconStyle]">
    <Grid class="win-icon-grid" data-icon-part="LayoutRoot" Background="Transparent">
      <span v-if="loaded && monochrome" class="win-bitmap-icon-image win-bitmap-icon-mask" data-icon-part="Image" :style="maskStyle" aria-hidden="true" />
      <img v-else-if="loaded" class="win-bitmap-icon-image" data-icon-part="Image" :src="source" alt="" draggable="false" aria-hidden="true" />
    </Grid>
  </span>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'
import { iconBoolean, iconElementProps, useIconElement } from './iconElementRuntime'
import { isSolidColorBrush } from './brushCore'
import { imageStretchSize } from './imageSource'
import Grid from './Grid.vue'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  UriSource: { type: String, default: null },
  ShowAsMonochrome: { type: [Boolean, String], default: true },
  ...iconElementProps
})
const attrs = useAttrs()
const instance = getCurrentInstance()
const { Element, read, layoutStyle, rootAttrs, api } = useIconElement(props, attrs, instance, ['UriSource', 'ShowAsMonochrome'])
defineExpose(api)
const source = computed(() => {
  const resolved = read('UriSource')
  return typeof resolved === 'string' ? resolved : ''
})
const monochrome = computed(() => iconBoolean(read('ShowAsMonochrome'), true))
const loaded = ref(false)
const naturalSize = ref({ width: 0, height: 0 })
let loader: HTMLImageElement | null = null
let loadGeneration = 0
let mounted = false
const cancelLoad = () => {
  ++loadGeneration
  if (loader) { loader.onload = null; loader.onerror = null; loader.src = ''; loader = null }
}
const loadSource = () => {
  cancelLoad()
  loaded.value = false
  naturalSize.value = { width: 0, height: 0 }
  if (!mounted || !source.value) return
  const generation = loadGeneration
  const image = new window.Image()
  loader = image
  image.onload = () => {
    if (generation !== loadGeneration) return
    naturalSize.value = { width: image.naturalWidth, height: image.naturalHeight }
    loaded.value = image.naturalWidth > 0 && image.naturalHeight > 0
    image.onload = null; image.onerror = null; loader = null
  }
  image.onerror = () => {
    if (generation !== loadGeneration) return
    loaded.value = false
    naturalSize.value = { width: 0, height: 0 }
    image.onload = null; image.onerror = null; loader = null
  }
  image.src = source.value
}
watch(source, loadSource)
onMounted(() => { mounted = true; loadSource() })
onBeforeUnmount(() => { mounted = false; cancelLoad() })
const desiredSize = computed(() => {
  const dimension = (name: string) => {
    const value = read(name)
    if (value === '' || value === null || value === undefined || value === 'Auto') return Infinity
    const number = Number(value)
    return Number.isFinite(number) && number >= 0 ? number : Infinity
  }
  const size = naturalSize.value
  return imageStretchSize(size.width, size.height, Math.min(dimension('Width'), dimension('MaxWidth')),
    Math.min(dimension('Height'), dimension('MaxHeight')), 'Uniform')
})
const iconStyle = computed(() => ({
  width: `${desiredSize.value.width}px`, height: `${desiredSize.value.height}px`,
  ...layoutStyle.value
}))
const maskStyle = computed(() => ({
  backgroundColor: read('Foreground') && typeof read('Foreground') === 'object' && !isSolidColorBrush(read('Foreground')) ? 'white' : 'currentColor',
  maskImage: `url(${JSON.stringify(source.value)})`,
  WebkitMaskImage: `url(${JSON.stringify(source.value)})`
}))
</script>

<style scoped>
.win-bitmap-icon-image { display: block; width: 100%; height: 100%; min-width: 0; min-height: 0; object-fit: contain; }
.win-bitmap-icon-mask { mask-mode: alpha; mask-size: contain; mask-repeat: no-repeat; mask-position: center; -webkit-mask-size: contain; -webkit-mask-repeat: no-repeat; -webkit-mask-position: center; }
</style>
