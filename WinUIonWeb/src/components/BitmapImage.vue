<script setup lang="ts">
import { getCurrentInstance, inject, onBeforeUnmount, useAttrs, watch, type VNode } from 'vue'
import { createImageSourceModel, imageBoolean, imageNumber, imageSourceContextKey, imageUri, type ImageEventArgs } from './imageSource'
import { xamlResourceDictionaryKey } from './Page.vue'
import { resolveXamlHandler, resolveXamlValue } from './xamlRuntime'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  UriSource: { type: [String, Object], default: '' },
  AutoPlay: { type: [Boolean, String], default: true },
  DecodePixelWidth: { type: [Number, String], default: 0 },
  DecodePixelHeight: { type: [Number, String], default: 0 },
  DecodePixelType: { type: String, default: 'Physical' }
})
const emit = defineEmits<{ ImageOpened: [sender: unknown, args: ImageEventArgs]; ImageFailed: [sender: unknown, args: ImageEventArgs] }>()
const instance = getCurrentInstance()
const attrs = useAttrs()
const register = inject(imageSourceContextKey, null)
const resources = inject<Record<string, VNode> | null>(xamlResourceDictionaryKey, null)
const model = createImageSourceModel('BitmapImage')
watch(() => [imageUri(props.UriSource, instance, resources), ...[props.AutoPlay, props.DecodePixelWidth, props.DecodePixelHeight, props.DecodePixelType].map(value => resolveXamlValue(value, instance))], values => {
  model.UriSource = typeof values[0] === 'string' ? values[0] : ''
  model.AutoPlay = imageBoolean(values[1])
  model.DecodePixelWidth = Math.floor(imageNumber(values[2]))
  model.DecodePixelHeight = Math.floor(imageNumber(values[3]))
  model.DecodePixelType = values[4] === 'Logical' ? 'Logical' : 'Physical'
}, { immediate: true })
register?.({
  model,
  opened: args => { emit('ImageOpened', model, args); resolveXamlHandler(attrs.ImageOpened, instance)?.(model, args) },
  failed: args => { emit('ImageFailed', model, args); resolveXamlHandler(attrs.ImageFailed, instance)?.(model, args) }
})
defineExpose(model)
onBeforeUnmount(() => register?.(null))
</script>

<template />
