<script setup lang="ts">
// WinPivotItem - 完全对齐官方PivotItem
// 官方属性：Header, Content, Disabled

defineOptions({
  name: 'WinPivotItem'
})

// Props - 完全对齐官方API
const props = defineProps<{
  header: string
  disabled?: boolean
}>()
</script>

<template>
  <div class="win-pivot-item">
    <slot />
  </div>
</template>

<style scoped>
.win-pivot-item {
  display: contents;
}
</style>
