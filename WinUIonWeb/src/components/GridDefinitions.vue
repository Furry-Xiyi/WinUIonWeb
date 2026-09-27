<template>
  <span class="win-grid-definitions" aria-hidden="true"><slot /></span>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { gridDefinitionTargetKey } from './layout'
const props = defineProps<{ axis: 'columns' | 'rows' }>()
provide(gridDefinitionTargetKey, props.axis)
</script>

<style scoped>
.win-grid-definitions { display: none; }
</style>
