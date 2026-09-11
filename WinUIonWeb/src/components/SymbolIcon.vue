<template><span class="win-symbol-icon" v-bind="attrs" :style="iconStyle">{{ glyph }}</span></template>

<script setup lang="ts">
import { computed, getCurrentInstance, useAttrs } from 'vue'
import { resolveXamlValue } from './xamlRuntime'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  Symbol: { type: [String, Number], default: '' },
  FontSize: { type: [String, Number], default: '' },
  Foreground: { type: String, default: '' }
})

const attrs = useAttrs()
const instance = getCurrentInstance()
const symbols: Record<string, string> = {
  List: '\uE14C',
  Bullets: '\uE133',
  Refresh: '\uE72C',
  Find: '\uE721',
  Share: '\uE72D',
  Save: '\uE74E',
  Copy: '\uE8C8',
  Delete: '\uE74D'
}
const glyph = computed(() => {
  const value = String(resolveXamlValue(props.Symbol, instance) ?? '')
  return symbols[value] ?? value
})
const iconStyle = computed(() => ({
  fontSize: props.FontSize ? `${resolveXamlValue(props.FontSize, instance)}px` : undefined,
  color: resolveXamlValue(props.Foreground, instance) || undefined
}))
</script>

<style>.win-symbol-icon { display: inline-flex; align-items: center; justify-content: center; font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets', sans-serif; line-height: 1; }</style>
