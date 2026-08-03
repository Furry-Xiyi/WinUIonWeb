<template>
  <div
    class="win-selector-bar-item-host"
    :aria-disabled="IsEnabled ? undefined : 'true'">
    <slot />
  </div>
</template>

<script setup>
defineOptions({
  name: 'WinSelectorBarItem'
});

const props = defineProps({
  Text: { type: [String, Number], default: '' },
  Icon: { type: [String, Object], default: '' },
  IsSelected: { type: [Boolean, String], default: false },
  IsEnabled: { type: Boolean, default: true },
  Padding: { type: [String, Number], default: undefined },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' },
  HorizontalContentAlignment: { type: String, default: 'Center' },
  VerticalContentAlignment: { type: String, default: 'Center' }
});

defineExpose({
  get Text() {
    return props.Text;
  },
  get Icon() {
    return props.Icon;
  },
  get IsSelected() {
    return props.IsSelected;
  },
  get IsEnabled() {
    return props.IsEnabled;
  }
});
</script>

<style scoped>
.win-selector-bar-item-host {
  display: contents;
}
</style>
