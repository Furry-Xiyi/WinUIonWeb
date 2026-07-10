<template>
  <div
    v-if="IsActive"
    class="win-progress-ring"
    :style="customStyle"
    aria-hidden="true">
  </div>
</template>

<script setup>
import { computed } from 'vue';
import loadingRingSprite from '../assets/LoadingRing/LoadingRingSprite.png';

const props = defineProps({
  color: { type: String, default: '' },
  IsActive: { type: Boolean, default: true },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' }
});

const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) return `${Number(value.trim())}px`;
  return typeof value === 'number' ? `${value}px` : value;
};

const cssNumber = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) return Number(value.trim());
  return undefined;
};

const customStyle = computed(() => {
  const ringBase = props.Width || props.Height || 32;
  const ringSize = cssLength(ringBase);
  const numericRingSize = cssNumber(ringBase) ?? 32;
  const style = {
    '--ring-mask': `url(${loadingRingSprite})`,
    '--ring-color': props.color || 'var(--accent-base)',
    '--ring-size': ringSize,
    '--ring-offset-end': `${numericRingSize * -120}px`
  };

  if (props.Width !== '') style.width = cssLength(props.Width);
  if (props.Height !== '') style.height = cssLength(props.Height);

  return style;
});
</script>

<style scoped>
.win-progress-ring {
  display: inline-block;
  width: 32px;
  height: 32px;
  min-width: 16px;
  min-height: 16px;
  pointer-events: none;
  vertical-align: middle;
  background-color: var(--ring-color);
  -webkit-mask-image: var(--ring-mask);
  -webkit-mask-size: auto var(--ring-size);
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: 0 0;
  mask-image: var(--ring-mask);
  mask-size: auto var(--ring-size);
  mask-repeat: no-repeat;
  mask-position: 0 0;
  animation: win-progress-ring-sprite 1.6s steps(120, end) infinite;
  will-change: -webkit-mask-position, mask-position;
}

@keyframes win-progress-ring-sprite {
  from {
    -webkit-mask-position: 0 0;
    mask-position: 0 0;
  }
  to {
    -webkit-mask-position: var(--ring-offset-end) 0;
    mask-position: var(--ring-offset-end) 0;
  }
}
</style>
