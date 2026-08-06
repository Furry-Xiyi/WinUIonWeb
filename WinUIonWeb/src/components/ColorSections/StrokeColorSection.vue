<template>
  <ColorBrushSection :brushes="brushes" />
</template>

<script setup lang="ts">
import ColorBrushSection from './ColorBrushSection.vue';

const brushes = [
  { name: 'ControlStrokeColorDefaultBrush', variable: '--ControlStrokeColorDefaultBrush' },
  { name: 'DividerStrokeColorDefaultBrush', variable: '--DividerStrokeColorDefaultBrush' },
  { name: 'CardStrokeColorDefaultBrush', variable: '--CardStrokeColorDefaultBrush' },
  { name: 'SurfaceStrokeColorFlyoutBrush', variable: '--SurfaceStrokeColorFlyoutBrush' },
  { name: 'ControlElevationBorderBrush', variable: '--ControlElevationBorderBrush' },
  { name: 'AccentControlElevationBorderBrush', variable: '--AccentControlElevationBorderBrush' },
  { name: 'ButtonBorderBrush', variable: '--ButtonBorderBrush' },
  { name: 'ToolTipBorderBrush', variable: '--ToolTipBorderBrush' }
];
</script>
