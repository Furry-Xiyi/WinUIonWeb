<template><span class="win-definition" aria-hidden="true" /></template>

<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted } from 'vue'
import { gridDefinitionContextKey } from './layout'

const props = defineProps({ Height: { type: [String, Number], default: '*' }, MinHeight: { type: [String, Number], default: '' }, MaxHeight: { type: [String, Number], default: '' } })
const context = inject<{ registerDefinition: (axis: 'columns' | 'rows', definition: Record<string, unknown>) => () => void } | null>(gridDefinitionContextKey, null)
const definition = { Height: props.Height, MinHeight: props.MinHeight, MaxHeight: props.MaxHeight }
let unregister: (() => void) | undefined
onMounted(() => { unregister = context?.registerDefinition('rows', definition) })
onBeforeUnmount(() => unregister?.())
</script>

<style scoped>.win-definition { display: none; }</style>
