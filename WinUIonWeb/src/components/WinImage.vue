<template>
  <img class="win-image" :class="stretchClass" :src="resolvedSource" :alt="alt" :style="imageStyle" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';

const props = defineProps({
  Source: { type: String, default: '' },
  UriSource: { type: String, default: '' },
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  Stretch: { type: String, default: '' },
  NineGrid: { type: String, default: '' },
  DecodePixelHeight: { type: [String, Number], default: '' },
  AutoPlay: { type: Boolean, default: true },
  HorizontalAlignment: { type: String, default: '' },
  width: { type: [String, Number], default: '' },
  height: { type: [String, Number], default: '' },
  stretch: { type: String, default: 'Uniform' },
  radius: { type: Number, default: 0 }
});

const toCssSize = (value: string | number) => (
  typeof value === 'number' || (typeof value === 'string' && /^-?\d+(\.\d+)?$/.test(value.trim()))
    ? `${value}px`
    : value
);
const resolvedSource = computed(() => props.Source || props.UriSource || props.src);
const resolvedStretch = computed(() => props.Stretch || props.stretch || 'Uniform');

const horizontalAlignments: Record<string, CSSProperties['alignSelf']> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
  stretch: 'stretch'
};

const imageStyle = computed<CSSProperties>(() => ({
  width: toCssSize(props.Width || props.width),
  height: toCssSize(props.Height || props.height),
  borderRadius: `${props.radius}px`,
  alignSelf: props.HorizontalAlignment
    ? horizontalAlignments[props.HorizontalAlignment.toLowerCase()]
    : undefined
}));

const stretchClass = computed(() => `stretch-${resolvedStretch.value.toLowerCase()}`);
</script>

<style>
  .win-image {
    display: block;
    background: var(--card-bg-secondary);
  }

  .win-image.stretch-none {
    object-fit: none;
  }

  .win-image.stretch-fill {
    object-fit: fill;
  }

  .win-image.stretch-uniform {
    object-fit: contain;
  }

  .win-image.stretch-uniformtofill {
    object-fit: cover;
  }
</style>
