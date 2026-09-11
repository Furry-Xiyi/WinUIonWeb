<template>
  <span class="win-grid-definitions" aria-hidden="true"><slot /></span>
</template>

<script setup lang="ts">
defineProps<{ axis: 'columns' | 'rows' }>()
</script>

<style scoped>
.win-grid-definitions { display: none; }
</style>
