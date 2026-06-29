<template>
  <img class="win-image" :class="stretchClass" :src="src" :alt="alt" :style="imageStyle" />
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  width: [String, Number],
  height: [String, Number],
  stretch: { type: String, default: 'Uniform' },
  radius: { type: Number, default: 0 }
});

const toCssSize = value => typeof value === 'number' ? `${value}px` : value;

const imageStyle = computed(() => ({
  width: toCssSize(props.width),
  height: toCssSize(props.height),
  borderRadius: `${props.radius}px`
}));

const stretchClass = computed(() => `stretch-${props.stretch.toLowerCase()}`);
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
