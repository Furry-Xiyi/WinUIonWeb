<template>
  <ColorBrushSection :brushes="brushes" />
</template>

<script setup lang="ts">
import ColorBrushSection from './ColorBrushSection.vue';

const brushes = [
  { name: 'SolidBackgroundFillColorBaseBrush', variable: '--SolidBackgroundFillColorBaseBrush' },
  { name: 'CardBackgroundFillColorDefaultBrush', variable: '--CardBackgroundFillColorDefaultBrush' },
  { name: 'CardBackgroundFillColorSecondaryBrush', variable: '--CardBackgroundFillColorSecondaryBrush' },
  { name: 'AcrylicInAppFillColorDefaultBrush', variable: '--AcrylicInAppFillColorDefaultBrush' },
  { name: 'ToolTipBackgroundBrush', variable: '--ToolTipBackgroundBrush' },
  { name: 'TeachingTipBackgroundBrush', variable: '--TeachingTipBackgroundBrush' }
];
</script>
