<template><span class="win-definition" aria-hidden="true" /></template>

<script setup lang="ts">
import { getCurrentInstance, inject, onBeforeUnmount, reactive, watchEffect } from 'vue'
import { gridDefinitionContextKey } from './layout'
import { resolveXamlValue } from './xamlRuntime'

const props = defineProps({ Width: { type: [String, Number], default: '*' }, MinWidth: { type: [String, Number], default: '' }, MaxWidth: { type: [String, Number], default: '' } })
const context = inject<{ registerDefinition: (axis: 'columns' | 'rows', definition: Record<string, unknown>) => () => void } | null>(gridDefinitionContextKey, null)
const instance = getCurrentInstance()
const definition = reactive<Record<string, unknown>>({})
watchEffect(() => {
  definition.Width = resolveXamlValue(props.Width, instance) ?? '*'
  definition.MinWidth = resolveXamlValue(props.MinWidth, instance)
  definition.MaxWidth = resolveXamlValue(props.MaxWidth, instance)
})
const unregister = context?.registerDefinition('columns', definition)
onBeforeUnmount(() => unregister?.())
</script>

<style scoped>.win-definition { display: none; }</style>
