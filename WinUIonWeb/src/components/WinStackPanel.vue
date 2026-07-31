<template>
  <div class="win-stack-panel" :style="rootStyle">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  Orientation: { type: String, default: 'Vertical' },
  Spacing: { type: [String, Number], default: 0 },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  Background: { type: String, default: '' },
  Padding: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' },
  HorizontalAlignment: { type: String, default: '' },
  VerticalAlignment: { type: String, default: '' }
});

const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) return `${Number(value.trim())}px`;
  return typeof value === 'number' ? `${value}px` : value;
};

const xamlThickness = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  const parts = String(value).split(',').map((part) => cssLength(Number.isNaN(Number(part.trim())) ? part.trim() : Number(part.trim())));
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;
  return String(value);
};

const rootStyle = computed(() => {
  const style = {
    flexDirection: props.Orientation === 'Horizontal' ? 'row' : 'column',
    gap: cssLength(props.Spacing)
  };
  if (props.Width !== '') style.width = cssLength(props.Width);
  if (props.Height !== '') style.height = cssLength(props.Height);
  if (props.Background) style.background = props.Background;
  if (props.Padding !== '') style.padding = xamlThickness(props.Padding);
  if (props.Margin !== '') style.margin = xamlThickness(props.Margin);
  if (props.HorizontalAlignment) style.justifySelf = props.HorizontalAlignment.toLowerCase();
  if (props.VerticalAlignment) style.alignSelf = props.VerticalAlignment.toLowerCase();
  return style;
});
</script>

<style scoped>
.win-stack-panel {
  display: flex;
  align-items: flex-start;
}
</style>
