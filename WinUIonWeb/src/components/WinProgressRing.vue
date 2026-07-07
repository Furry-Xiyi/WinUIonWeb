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
import loadingRingGif from '../assets/LoadingRing/LoadingRing.gif';

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

const customStyle = computed(() => {
  const style = {
    '--ring-mask': `url(${loadingRingGif})`,
    '--ring-color': props.color || 'var(--accent-base)'
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
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-image: var(--ring-mask);
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
}
</style>
