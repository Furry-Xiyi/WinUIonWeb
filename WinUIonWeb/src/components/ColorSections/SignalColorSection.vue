<template>
  <ColorBrushSection :brushes="brushes" />
</template>

<script setup lang="ts">
import ColorBrushSection from './ColorBrushSection.vue';

const brushes = [
  { name: 'SystemFillColorAttentionBrush', variable: '--SystemFillColorAttentionBrush' },
  { name: 'SystemFillColorSuccessBrush', variable: '--SystemFillColorSuccessBrush' },
  { name: 'SystemFillColorCautionBrush', variable: '--SystemFillColorCautionBrush' },
  { name: 'SystemFillColorCriticalBrush', variable: '--SystemFillColorCriticalBrush' },
  { name: 'SystemFillColorSolidNeutralBrush', variable: '--SystemFillColorSolidNeutralBrush' },
  { name: 'SystemFillColorAttentionBackgroundBrush', variable: '--SystemFillColorAttentionBackgroundBrush' },
  { name: 'SystemFillColorSuccessBackgroundBrush', variable: '--SystemFillColorSuccessBackgroundBrush' },
  { name: 'SystemFillColorCautionBackgroundBrush', variable: '--SystemFillColorCautionBackgroundBrush' },
  { name: 'SystemFillColorCriticalBackgroundBrush', variable: '--SystemFillColorCriticalBackgroundBrush' },
  { name: 'SystemFillColorSolidNeutralBackgroundBrush', variable: '--SystemFillColorSolidNeutralBackgroundBrush' }
];
</script>
