<template>
  <div
    class="win-pivot-item"
    :aria-disabled="IsEnabled ? undefined : 'true'">
    <slot />
  </div>
</template>

<script setup>
defineOptions({
  name: 'WinPivotItem'
});

const props = defineProps({
  Header: { type: [String, Number, Object], default: '' },
  IsEnabled: { type: Boolean, default: true }
});

defineExpose({
  get Header() {
    return props.Header;
  },
  get IsEnabled() {
    return props.IsEnabled;
  }
});
</script>

<style scoped>
.win-pivot-item {
  display: contents;
}
</style>
