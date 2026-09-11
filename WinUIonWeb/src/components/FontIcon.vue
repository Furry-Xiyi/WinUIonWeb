<template><span v-bind="attrs" class="win-font-icon" :style="iconStyle">{{ glyph }}</span></template>
<script setup lang="ts">
import { computed, getCurrentInstance, useAttrs } from 'vue'
import { resolveXamlValue } from './xamlRuntime'
defineOptions({ inheritAttrs: false })
const props = defineProps({ Glyph: { type: [String, Number], default: '' }, FontSize: { type: [String, Number], default: '' }, Foreground: { type: String, default: '' } })
const attrs = useAttrs(); const instance = getCurrentInstance()
const glyph = computed(() => String(resolveXamlValue(props.Glyph, instance) ?? ''))
const iconStyle = computed(() => ({ fontSize: props.FontSize ? `${resolveXamlValue(props.FontSize, instance)}px` : undefined, color: resolveXamlValue(props.Foreground, instance) || undefined }))
</script>
<style>.win-font-icon { display: inline-flex; align-items: center; justify-content: center; font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets', sans-serif; line-height: 1; }</style>
