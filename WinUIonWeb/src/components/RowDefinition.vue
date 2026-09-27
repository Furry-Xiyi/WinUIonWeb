<template><span class="win-definition" aria-hidden="true" /></template>

<script setup lang="ts">
import { getCurrentInstance, inject, onBeforeUnmount, reactive, watchEffect } from 'vue'
import { gridDefinitionContextKey } from './layout'
import { resolveXamlValue } from './xamlRuntime'

const props = defineProps({ Height: { type: [String, Number], default: '*' }, MinHeight: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' } })
const context = inject<{ registerDefinition: (axis: 'columns' | 'rows', definition: Record<string, unknown>) => () => void } | null>(gridDefinitionContextKey, null)
const instance = getCurrentInstance()
const definition = reactive<Record<string, unknown>>({})
watchEffect(() => {
  definition.Height = resolveXamlValue(props.Height, instance) ?? '*'
  definition.MinHeight = resolveXamlValue(props.MinHeight, instance)
  definition.MaxHeight = resolveXamlValue(props.MaxHeight, instance)
})
const unregister = context?.registerDefinition('rows', definition)
onBeforeUnmount(() => unregister?.())
</script>

<style scoped>.win-definition { display: none; }</style>
