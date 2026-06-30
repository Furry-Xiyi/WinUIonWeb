<template>
  <div class="win-parallax-view" ref="containerRef">
    <!-- Child element (background layer with parallax effect) -->
    <div
      class="parallax-child"
      :style="childStyle"
      ref="childRef"
    >
      <slot name="child"></slot>
    </div>

    <!-- Source element (foreground scrollable element) -->
    <div
      class="parallax-source"
      ref="sourceRef"
      @scroll="handleScroll"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
  // Source - the scrollable foreground element (handled via default slot)
  // Child - the background element with parallax effect (handled via child slot)

  // 官方属性：HorizontalShift
  horizontalShift: {
    type: Number,
    default: 0
  },

  // 官方属性：VerticalShift
  verticalShift: {
    type: Number,
    default: 0
  },

  // 官方属性：IsHorizontalShiftClamped
  isHorizontalShiftClamped: {
    type: Boolean,
    default: true
  },

  // 官方属性：IsVerticalShiftClamped
  isVerticalShiftClamped: {
    type: Boolean,
    default: true
  },

  // 官方属性：MaxHorizontalShiftRatio
  maxHorizontalShiftRatio: {
    type: Number,
    default: 1.0
  },

  // 官方属性：MaxVerticalShiftRatio
  maxVerticalShiftRatio: {
    type: Number,
    default: 1.0
  },

  // 官方属性：HorizontalSourceStartOffset
  horizontalSourceStartOffset: {
    type: Number,
    default: 0
  },

  // 官方属性：HorizontalSourceEndOffset
  horizontalSourceEndOffset: {
    type: Number,
    default: 0
  },

  // 官方属性：VerticalSourceStartOffset
  verticalSourceStartOffset: {
    type: Number,
    default: 0
  },

  // 官方属性：VerticalSourceEndOffset
  verticalSourceEndOffset: {
    type: Number,
    default: 0
  }
});

const containerRef = ref(null);
const sourceRef = ref(null);
const childRef = ref(null);

// Current scroll position
const scrollX = ref(0);
const scrollY = ref(0);

// Calculated parallax transform
const parallaxX = ref(0);
const parallaxY = ref(0);

// Calculate parallax offset based on scroll position
const calculateParallax = () => {
  if (!sourceRef.value) return;

  const source = sourceRef.value;
  const scrollWidth = source.scrollWidth - source.clientWidth;
  const scrollHeight = source.scrollHeight - source.clientHeight;

  // Calculate scroll progress (0 to 1)
  let horizontalProgress = scrollWidth > 0 ? scrollX.value / scrollWidth : 0;
  let verticalProgress = scrollHeight > 0 ? scrollY.value / scrollHeight : 0;

  // Apply source offsets to adjust when parallax starts/ends
  // Offsets shift the effective scroll range
  if (scrollWidth > 0) {
    const effectiveScrollWidth = scrollWidth - props.horizontalSourceStartOffset - props.horizontalSourceEndOffset;
    const adjustedScrollX = Math.max(0, scrollX.value - props.horizontalSourceStartOffset);
    horizontalProgress = effectiveScrollWidth > 0 ? adjustedScrollX / effectiveScrollWidth : 0;
  }

  if (scrollHeight > 0) {
    const effectiveScrollHeight = scrollHeight - props.verticalSourceStartOffset - props.verticalSourceEndOffset;
    const adjustedScrollY = Math.max(0, scrollY.value - props.verticalSourceStartOffset);
    verticalProgress = effectiveScrollHeight > 0 ? adjustedScrollY / effectiveScrollHeight : 0;
  }

  // Clamp progress to [0, 1]
  horizontalProgress = Math.max(0, Math.min(1, horizontalProgress));
  verticalProgress = Math.max(0, Math.min(1, verticalProgress));

  // Calculate shift amounts
  let calculatedHorizontalShift = props.horizontalShift * horizontalProgress * props.maxHorizontalShiftRatio;
  let calculatedVerticalShift = props.verticalShift * verticalProgress * props.maxVerticalShiftRatio;

  // Apply clamping if enabled
  if (props.isHorizontalShiftClamped) {
    const maxShift = Math.abs(props.horizontalShift * props.maxHorizontalShiftRatio);
    calculatedHorizontalShift = Math.max(-maxShift, Math.min(maxShift, calculatedHorizontalShift));
  }

  if (props.isVerticalShiftClamped) {
    const maxShift = Math.abs(props.verticalShift * props.maxVerticalShiftRatio);
    calculatedVerticalShift = Math.max(-maxShift, Math.min(maxShift, calculatedVerticalShift));
  }

  parallaxX.value = calculatedHorizontalShift;
  parallaxY.value = calculatedVerticalShift;
};

// Handle scroll event with performance optimization (requestAnimationFrame)
let rafId = null;
const handleScroll = (e) => {
  scrollX.value = e.target.scrollLeft;
  scrollY.value = e.target.scrollTop;

  // Use requestAnimationFrame for smooth performance
  if (rafId) {
    cancelAnimationFrame(rafId);
  }

  rafId = requestAnimationFrame(() => {
    calculateParallax();
  });
};

// Computed style for child element
const childStyle = computed(() => {
  return {
    transform: `translate3d(${parallaxX.value}px, ${parallaxY.value}px, 0)`,
    willChange: 'transform' // Performance optimization hint
  };
});

// Watch for property changes and recalculate
watch([
  () => props.horizontalShift,
  () => props.verticalShift,
  () => props.maxHorizontalShiftRatio,
  () => props.maxVerticalShiftRatio,
  () => props.horizontalSourceStartOffset,
  () => props.horizontalSourceEndOffset,
  () => props.verticalSourceStartOffset,
  () => props.verticalSourceEndOffset,
  () => props.isHorizontalShiftClamped,
  () => props.isVerticalShiftClamped
], () => {
  calculateParallax();
});

// Initialize
onMounted(() => {
  calculateParallax();
});

onBeforeUnmount(() => {
  if (rafId) {
    cancelAnimationFrame(rafId);
  }
});

// Expose methods if needed
defineExpose({
  refresh: calculateParallax
});
</script>

<style scoped>
.win-parallax-view {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.parallax-child {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  /* Use GPU acceleration for smooth parallax */
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

.parallax-source {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  z-index: 1;
  /* Enable smooth scrolling on iOS */
  -webkit-overflow-scrolling: touch;
}

/* Optional: Hide scrollbar for cleaner look while maintaining functionality */
.parallax-source::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

.parallax-source::-webkit-scrollbar-track {
  background: transparent;
}

.parallax-source::-webkit-scrollbar-thumb {
  background: var(--ctrl-strong-fill-default, rgba(0, 0, 0, 0.3));
  border-radius: 6px;
  border: 3px solid transparent;
  background-clip: padding-box;
}

.parallax-source::-webkit-scrollbar-thumb:hover {
  background: var(--ctrl-strong-fill-hover, rgba(0, 0, 0, 0.5));
  background-clip: padding-box;
}
</style>
