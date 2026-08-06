<template>
  <ColorBrushSection :brushes="brushes" />
</template>

<script setup lang="ts">
import ColorBrushSection from './ColorBrushSection.vue';

const brushes = [
  { name: 'AccentFillColorDefaultBrush', variable: '--AccentFillColorDefaultBrush' },
  { name: 'AccentFillColorSecondaryBrush', variable: '--AccentFillColorSecondaryBrush' },
  { name: 'AccentFillColorTertiaryBrush', variable: '--AccentFillColorTertiaryBrush' },
  { name: 'AccentFillColorDisabledBrush', variable: '--AccentFillColorDisabledBrush' },
  { name: 'ControlFillColorTransparentBrush', variable: '--ControlFillColorTransparentBrush' },
  { name: 'ControlStrongFillColorDefaultBrush', variable: '--ControlStrongFillColorDefaultBrush' },
  { name: 'ControlStrongFillColorDisabledBrush', variable: '--ControlStrongFillColorDisabledBrush' },
  { name: 'SubtleFillColorSecondaryBrush', variable: '--SubtleFillColorSecondaryBrush' },
  { name: 'SubtleFillColorTransparentBrush', variable: '--SubtleFillColorTransparentBrush' },
  { name: 'AcrylicInAppFillColorDefaultBrush', variable: '--AcrylicInAppFillColorDefaultBrush' }
];
</script>
