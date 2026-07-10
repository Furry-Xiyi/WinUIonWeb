<template>
  <div class="win-grid" :style="rootStyle">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' },
  MaxWidth: { type: [String, Number], default: '' },
  Background: { type: String, default: '' },
  ColumnDefinitions: { type: String, default: '' },
  RowDefinitions: { type: String, default: '' },
  ColumnSpacing: { type: [String, Number], default: 0 },
  RowSpacing: { type: [String, Number], default: 0 },
  HorizontalAlignment: { type: String, default: '' },
  VerticalAlignment: { type: String, default: '' }
});

const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) return `${Number(value.trim())}px`;
  return typeof value === 'number' ? `${value}px` : value;
};

const gridDefinition = (value) => String(value || '')
  .split(',')
  .map((part) => part.trim())
  .filter(Boolean)
  .map((part) => {
    if (part === '*') return '1fr';
    if (/^\d+(\.\d+)?\*$/.test(part)) return `${Number(part.slice(0, -1))}fr`;
    if (!Number.isNaN(Number(part))) return `${Number(part)}px`;
    return part;
  })
  .join(' ');

const rootStyle = computed(() => {
  const style = {};
  if (props.Width !== '') style.width = cssLength(props.Width);
  if (props.Height !== '') style.height = cssLength(props.Height);
  if (props.MinWidth !== '') style.minWidth = cssLength(props.MinWidth);
  if (props.MaxWidth !== '') style.maxWidth = cssLength(props.MaxWidth);
  if (props.Background) style.background = props.Background;
  if (props.ColumnDefinitions) style.gridTemplateColumns = gridDefinition(props.ColumnDefinitions);
  if (props.RowDefinitions) style.gridTemplateRows = gridDefinition(props.RowDefinitions);
  if (props.ColumnSpacing !== '') style.columnGap = cssLength(props.ColumnSpacing);
  if (props.RowSpacing !== '') style.rowGap = cssLength(props.RowSpacing);
  if (props.HorizontalAlignment) style.justifySelf = props.HorizontalAlignment.toLowerCase();
  if (props.VerticalAlignment) style.alignSelf = props.VerticalAlignment.toLowerCase();
  return style;
});
</script>

<style scoped>
.win-grid {
  display: grid;
}
</style>
