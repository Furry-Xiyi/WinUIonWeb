<template>
  <ColorBrushSection :brushes="brushes" />
</template>

<script setup lang="ts">
import ColorBrushSection from './ColorBrushSection.vue';

const brushes = [
  { name: 'TextFillColorPrimaryBrush', variable: '--TextFillColorPrimaryBrush' },
  { name: 'TextFillColorSecondaryBrush', variable: '--TextFillColorSecondaryBrush' },
  { name: 'TextFillColorDisabledBrush', variable: '--TextFillColorDisabledBrush' },
  { name: 'TextFillColorInverseBrush', variable: '--TextFillColorInverseBrush' },
  { name: 'TextOnAccentFillColorPrimaryBrush', variable: '--TextOnAccentFillColorPrimaryBrush' },
  { name: 'TextOnAccentFillColorSecondaryBrush', variable: '--TextOnAccentFillColorSecondaryBrush' },
  { name: 'TextOnAccentFillColorDisabledBrush', variable: '--TextOnAccentFillColorDisabledBrush' }
];
</script>
