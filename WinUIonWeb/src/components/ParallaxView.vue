<template>
  <div class="win-parallax-view" ref="containerRef">
    <!-- Child (background layer) is arranged larger than the ParallaxView by the
         shift amounts, then translated as the Source scrolls. This mirrors the
         official MeasureOverride/ArrangeOverride behavior. -->
    <div class="parallax-child" :style="childStyle" ref="childRef">
      <slot name="child"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';

const props = defineProps({
  // The scrollable element this ParallaxView tracks. Accepts a CSS selector
  // string, an HTMLElement, a Vue ref, a component instance (e.g. a
  // ScrollViewer / ListView whose inner viewport is located automatically),
  // or a getter function returning any of the above (resolved lazily so a
  // sibling ref that is still null at render time works).
  Source: { type: [String, Object, Function], default: null },

  HorizontalShift: { type: Number, default: 0 },
  VerticalShift: { type: Number, default: 0 },

  HorizontalSourceStartOffset: { type: Number, default: 0 },
  HorizontalSourceEndOffset: { type: Number, default: 0 },
  VerticalSourceStartOffset: { type: Number, default: 0 },
  VerticalSourceEndOffset: { type: Number, default: 0 },

  HorizontalSourceOffsetKind: { type: String, default: 'Relative' },
  VerticalSourceOffsetKind: { type: String, default: 'Relative' },

  IsHorizontalShiftClamped: { type: Boolean, default: true },
  IsVerticalShiftClamped: { type: Boolean, default: true },

  MaxHorizontalShiftRatio: { type: Number, default: 1.0 },
  MaxVerticalShiftRatio: { type: Number, default: 1.0 }
});

const containerRef = ref(null);
const childRef = ref(null);
const scrollElement = ref(null);
const parallaxX = ref(0);
const parallaxY = ref(0);
let rafId = null;

const unwrap = (value) => {
  if (value && typeof value === 'object' && !(value instanceof HTMLElement) && 'value' in value) {
    return value.value;
  }
  return value;
};

// Resolve the actual scrollable element from the Source prop. ScrollViewer /
// ListView expose their scrolling viewport as `.win-scroll-viewer-viewport`.
const resolveScrollElement = (source) => {
  if (typeof source === 'function') {
    source = source();
  }
  if (!source) return null;
  let el = unwrap(source);

  if (typeof el === 'string') {
    el = document.querySelector(el);
  } else if (el && typeof el === 'object' && !(el instanceof HTMLElement) && '$el' in el) {
    const viewport = unwrap(el.scrollViewerRef);
    if (viewport instanceof HTMLElement) return viewport;
    el = el.$el;
  }

  if (!(el instanceof HTMLElement)) return null;
  if (el.classList.contains('win-scroll-viewer-viewport')) return el;
  return el.querySelector('.win-scroll-viewer-viewport') || el;
};

// Faithful port of the official parallax expression (clamped case).
// For shift > 0: P(X) = -Min(maxRatio, shift / range) * (X - startOffset),
// clamped to [-shift, 0]. For shift < 0 the direction is reversed.
const computeAxis = (scrollPos, scrollable, shift, startOffset, endOffset, maxRatio, clamped) => {
  if (!shift || scrollable <= 0) return 0;
  const range = endOffset - startOffset;
  if (range <= 0) return 0;

  const x = scrollPos;
  let translate;

  if (shift > 0) {
    const rate = Math.min(Math.max(0, maxRatio), shift / range);
    translate = -rate * (x - startOffset);
    if (clamped) translate = Math.max(-shift, Math.min(0, translate));
  } else {
    const rate = Math.min(Math.max(0, maxRatio), -shift / range);
    translate = rate * (x - endOffset);
    if (clamped) translate = Math.max(shift, Math.min(0, translate));
  }

  return translate;
};

const computeParallax = () => {
  const el = scrollElement.value;
  if (!el) return;

  const scrollableW = el.scrollWidth - el.clientWidth;
  const scrollableH = el.scrollHeight - el.clientHeight;

  let startX = props.HorizontalSourceStartOffset;
  let endX = props.HorizontalSourceEndOffset;
  if (props.HorizontalSourceOffsetKind === 'Relative') {
    endX = Math.max(0, scrollableW + props.HorizontalSourceEndOffset);
  }

  let startY = props.VerticalSourceStartOffset;
  let endY = props.VerticalSourceEndOffset;
  if (props.VerticalSourceOffsetKind === 'Relative') {
    endY = Math.max(0, scrollableH + props.VerticalSourceEndOffset);
  }

  const px = computeAxis(
    el.scrollLeft, scrollableW, props.HorizontalShift,
    startX, endX, props.MaxHorizontalShiftRatio, props.IsHorizontalShiftClamped
  );
  const py = computeAxis(
    el.scrollTop, scrollableH, props.VerticalShift,
    startY, endY, props.MaxVerticalShiftRatio, props.IsVerticalShiftClamped
  );

  // Apply the transform directly to the DOM inside the same layout pass that
  // reads scroll offsets. Using refs + a second render cycle leaves the child
  // one frame stale and, under some requestAnimationFrame throttling, never
  // flushes at all — so the background appears frozen even though the source
  // scrolled. Writing the style here keeps the parallax pixel-synchronous with
  // the scroll (matches the native compositor-driven effect).
  const child = childRef.value;
  if (child) {
    const t = `translate3d(${px}px, ${py}px, 0)`;
    if (child.style.transform !== t) child.style.transform = t;
  }
  parallaxX.value = px;
  parallaxY.value = py;
};

const handleScroll = () => {
  if (rafId) cancelAnimationFrame(rafId);
  // computeParallax reads scrollTop and writes the transform in the same tick,
  // so no rAF is needed to stay pixel-synchronous. Keep the callback cheap.
  computeParallax();
};

// The child is sized to 100% + |shift| in each shifted dimension so that the
// parallax translation never reveals empty space (matches official arrange).
const childStyle = computed(() => {
  const style = {
    transform: `translate3d(${parallaxX.value}px, ${parallaxY.value}px, 0)`,
    willChange: 'transform'
  };
  if (props.HorizontalShift !== 0) {
    style.width = `calc(100% + ${Math.abs(props.HorizontalShift)}px)`;
  }
  if (props.VerticalShift !== 0) {
    style.height = `calc(100% + ${Math.abs(props.VerticalShift)}px)`;
  }
  return style;
});

const attach = () => {
  detach();
  scrollElement.value = resolveScrollElement(props.Source);
  if (scrollElement.value) {
    scrollElement.value.addEventListener('scroll', handleScroll, { passive: true });
    computeParallax();
  }
};

const detach = () => {
  if (scrollElement.value) {
    scrollElement.value.removeEventListener('scroll', handleScroll);
  }
  scrollElement.value = null;
};

// Track the resolved source value so a sibling ref that is still null at
// render time (e.g. a ScrollViewer mounted after this component) is picked
// up as soon as it becomes available.
const resolvedSource = computed(() => {
  const source = typeof props.Source === 'function' ? props.Source() : props.Source;
  return unwrap(source);
});

watch(resolvedSource, () => nextTick(attach));
watch(
  () => [
    props.HorizontalShift,
    props.VerticalShift,
    props.HorizontalSourceStartOffset,
    props.HorizontalSourceEndOffset,
    props.VerticalSourceStartOffset,
    props.VerticalSourceEndOffset,
    props.HorizontalSourceOffsetKind,
    props.VerticalSourceOffsetKind,
    props.IsHorizontalShiftClamped,
    props.IsVerticalShiftClamped,
    props.MaxHorizontalShiftRatio,
    props.MaxVerticalShiftRatio
  ],
  computeParallax
);

onMounted(() => nextTick(attach));
onBeforeUnmount(() => {
  detach();
  if (rafId) cancelAnimationFrame(rafId);
});

defineExpose({ refresh: computeParallax });
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
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
}
</style>
