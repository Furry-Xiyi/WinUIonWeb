<template><span class="win-definition" aria-hidden="true" /></template>

<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted } from 'vue'
import { gridDefinitionContextKey } from './layout'

const props = defineProps({ Width: { type: [String, Number], default: '*' }, MinWidth: { type: [String, Number], default: '' }, MaxWidth: { type: [String, Number], default: '' } })
const context = inject<{ registerDefinition: (axis: 'columns' | 'rows', definition: Record<string, unknown>) => () => void } | null>(gridDefinitionContextKey, null)
const definition = { Width: props.Width, MinWidth: props.MinWidth, MaxWidth: props.MaxWidth }
let unregister: (() => void) | undefined
onMounted(() => { unregister = context?.registerDefinition('columns', definition) })
onBeforeUnmount(() => unregister?.())
</script>

<style scoped>.win-definition { display: none; }</style>
