<template>
  <div ref="rootRef" class="win-flyout-animation" :class="{ 'is-playing': isPlaying }">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch, type PropType } from 'vue';
import {
  useFlyoutAnimation,
  type FlyoutAnimationDirection,
  type FlyoutAnimationOrigin,
  type FlyoutAnimationOriginElement,
  type FlyoutAnimationRect,
  type Resolvable
} from './useFlyoutAnimation';

const props = defineProps({
  Open: { type: Boolean, default: undefined },
  Autoplay: { type: Boolean, default: true },
  Origin: { type: String as PropType<FlyoutAnimationOrigin>, default: 'edge' },
  Direction: { type: String as PropType<FlyoutAnimationDirection>, default: 'top' },
  OriginElement: { type: [String, Object, Function] as PropType<Resolvable<FlyoutAnimationOriginElement>>, default: null },
  StartRect: {
    type: [Object, Function] as PropType<
      Resolvable<FlyoutAnimationRect | null> | ((targetRect: DOMRect) => FlyoutAnimationRect | null)
    >,
    default: null
  },
  Duration: { type: Number, default: 750 },
  Easing: { type: String, default: 'cubic-bezier(0.102, 0.700, 0.000, 1.007)' },
  Margin: { type: Number, default: 15 },
  StripSize: { type: Number, default: 36 },
  RespectReducedMotion: { type: Boolean, default: true }
});

const rootRef = ref<HTMLElement | null>(null);
const { play, cancel, isPlaying } = useFlyoutAnimation(rootRef, props);

onMounted(async () => {
  await nextTick();
  if (props.Autoplay && (props.Open === undefined || props.Open === true)) play();
});

watch(() => props.Open, (value) => {
  if (value === undefined) return;
  if (value) play();
  else cancel();
});

defineExpose({ play, cancel, isPlaying });
</script>

<style>
.win-flyout-animation {
  will-change: clip-path;
}
</style>
