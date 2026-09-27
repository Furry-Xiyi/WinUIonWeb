<template>
  <div class="win-capture-element" :style="elementStyle">
    <video ref="video" class="win-capture-video" autoplay muted playsinline :style="videoStyle" />
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { alignment, cssLength, xamlThickness } from './layout'
import { resolveXamlValue } from './xamlRuntime'

const props = defineProps({
  Source: { type: [String, Object], default: null },
  Stretch: { type: String, default: 'Uniform' },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' },
  MinHeight: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' },
  MaxHeight: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: 'Stretch' },
  VerticalAlignment: { type: String, default: 'Stretch' },
  Visibility: { type: String, default: 'Visible' },
  Opacity: { type: [String, Number], default: 1 }
})
const emit = defineEmits(['PreviewFailed'])
const instance = getCurrentInstance()
const video = ref<HTMLVideoElement | null>(null)
const source = computed(() => resolveXamlValue(props.Source, instance) as MediaStream | null)
const elementStyle = computed(() => {
  const style: Record<string, string> = {}
  for (const property of ['Width', 'Height', 'MinWidth', 'MinHeight', 'MaxWidth', 'MaxHeight'] as const) {
    const value = resolveXamlValue(props[property], instance)
    if (value !== '' && value !== undefined && value !== null) style[property[0].toLowerCase() + property.slice(1)] = cssLength(value)
  }
  style.margin = xamlThickness(resolveXamlValue(props.Margin, instance))
  style.justifySelf = alignment(String(resolveXamlValue(props.HorizontalAlignment, instance)), 'horizontal')
  style.alignSelf = alignment(String(resolveXamlValue(props.VerticalAlignment, instance)), 'vertical')
  style.opacity = String(resolveXamlValue(props.Opacity, instance))
  const visibility = resolveXamlValue(props.Visibility, instance)
  if (visibility === 'Collapsed') style.display = 'none'
  else if (visibility === 'Hidden') style.visibility = 'hidden'
  return style
})
const videoStyle = computed(() => ({
  objectFit: ({ None: 'none', Fill: 'fill', Uniform: 'contain', UniformToFill: 'cover' } as Record<string, 'none' | 'fill' | 'contain' | 'cover'>)[String(resolveXamlValue(props.Stretch, instance))] || 'contain'
}))

let sourceVersion = 0
const attachSource = async () => {
  const element = video.value
  if (!element) return
  const version = ++sourceVersion
  try {
    element.pause()
    if (source.value && typeof source.value.getVideoTracks !== 'function') throw new TypeError('InvalidCaptureSource')
    element.srcObject = source.value || null
    if (!source.value) return
    await element.play()
  } catch (error) {
    if (version !== sourceVersion) return
    element.srcObject = null
    emit('PreviewFailed', { Code: error instanceof DOMException ? error.name : 'PreviewFailed', Message: error instanceof Error ? error.message : '', Handled: false })
  }
}
watch(source, attachSource, { flush: 'post' })
onMounted(attachSource)
onBeforeUnmount(() => {
  ++sourceVersion
  if (video.value) {
    video.value.pause()
    video.value.srcObject = null
  }
})
defineExpose({ Source: source })
</script>

<style scoped>
.win-capture-element { position: relative; min-width: 0; min-height: 0; overflow: hidden; box-sizing: border-box; }
.win-capture-video { display: block; width: 100%; height: 100%; min-width: 0; min-height: 0; background: transparent; }
</style>
