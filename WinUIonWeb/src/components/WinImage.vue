<template>
  <img class="win-image" :class="stretchClass" :src="resolvedSource" :alt="alt" :style="imageStyle" />
</template>

<script setup>
import { computed } from 'vue';

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

const toCssSize = value => typeof value === 'number' ? `${value}px` : value;
const resolvedSource = computed(() => props.Source || props.UriSource || props.src);
const resolvedStretch = computed(() => props.Stretch || props.stretch || 'Uniform');

const imageStyle = computed(() => ({
  width: toCssSize(props.Width || props.width),
  height: toCssSize(props.Height || props.height),
  borderRadius: `${props.radius}px`,
  alignSelf: props.HorizontalAlignment ? props.HorizontalAlignment.toLowerCase() : undefined
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
