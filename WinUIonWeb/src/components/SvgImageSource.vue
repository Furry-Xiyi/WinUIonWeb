<script setup lang="ts">
import { getCurrentInstance, inject, onBeforeUnmount, useAttrs, watch, type VNode } from 'vue'
import { createImageSourceModel, imageNumber, imageSourceContextKey, imageUri, type ImageEventArgs } from './imageSource'
import { xamlResourceDictionaryKey } from './Page.vue'
import { resolveXamlHandler, resolveXamlValue } from './xamlRuntime'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  UriSource: { type: [String, Object], default: '' },
  RasterizePixelWidth: { type: [Number, String], default: 0 },
  RasterizePixelHeight: { type: [Number, String], default: 0 }
})
const emit = defineEmits<{ Opened: [sender: unknown, args: ImageEventArgs]; OpenFailed: [sender: unknown, args: ImageEventArgs] }>()
const instance = getCurrentInstance()
const attrs = useAttrs()
const register = inject(imageSourceContextKey, null)
const resources = inject<Record<string, VNode> | null>(xamlResourceDictionaryKey, null)
const model = createImageSourceModel('SvgImageSource')
watch(() => [imageUri(props.UriSource, instance, resources), ...[props.RasterizePixelWidth, props.RasterizePixelHeight].map(value => resolveXamlValue(value, instance))], values => {
  model.UriSource = typeof values[0] === 'string' ? values[0] : ''
  model.RasterizePixelWidth = imageNumber(values[1])
  model.RasterizePixelHeight = imageNumber(values[2])
}, { immediate: true })
register?.({
  model,
  opened: args => { emit('Opened', model, args); resolveXamlHandler(attrs.Opened, instance)?.(model, args) },
  failed: args => { emit('OpenFailed', model, args); resolveXamlHandler(attrs.OpenFailed, instance)?.(model, args) }
})
defineExpose(model)
onBeforeUnmount(() => register?.(null))
</script>

<template />
