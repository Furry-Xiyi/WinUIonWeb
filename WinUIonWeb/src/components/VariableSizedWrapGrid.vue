<template>
  <div class="win-variable-sized-wrap-grid" :class="orientationClass" :style="rootStyle">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  Orientation: { type: String, default: 'Vertical' },
  ItemWidth: { type: [String, Number], default: 44 },
  ItemHeight: { type: [String, Number], default: 44 },
  MaximumRowsOrColumns: { type: [String, Number], default: 3 },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' }
});

const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) return `${Number(value.trim())}px`;
  return typeof value === 'number' ? `${value}px` : value;
};

const orientationClass = computed(() => props.Orientation === 'Horizontal' ? 'orientation-horizontal' : 'orientation-vertical');
const rootStyle = computed(() => {
  const itemWidth = cssLength(props.ItemWidth);
  const itemHeight = cssLength(props.ItemHeight);
  const maximum = Math.max(1, Number(props.MaximumRowsOrColumns) || 1);
  const style = {
    '--vsg-item-width': itemWidth,
    '--vsg-item-height': itemHeight
  };
  if (props.Width !== '') style.width = cssLength(props.Width);
  if (props.Height !== '') style.height = cssLength(props.Height);
  if (props.Orientation === 'Horizontal') {
    style.gridTemplateRows = `repeat(${maximum}, var(--vsg-item-height))`;
    style.gridAutoColumns = 'var(--vsg-item-width)';
  } else {
    style.gridTemplateColumns = `repeat(${maximum}, var(--vsg-item-width))`;
    style.gridAutoRows = 'var(--vsg-item-height)';
  }
  return style;
});
</script>

<style scoped>
.win-variable-sized-wrap-grid {
  display: grid;
  gap: 0;
}

.win-variable-sized-wrap-grid.orientation-horizontal {
  grid-auto-flow: column;
}

.win-variable-sized-wrap-grid.orientation-vertical {
  grid-auto-flow: row;
}
</style>
