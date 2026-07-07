<template>
  <div class="win-horizontal-scroll-container">
    <div
      ref="scroller"
      class="win-horizontal-scroll-scroller"
      @scroll="updateScrollButtonsVisibility"
      @wheel="onWheel">
      <div class="win-horizontal-scroll-content">
        <slot></slot>
      </div>
    </div>

    <button
      v-show="canScrollBack"
      ref="scrollBackButton"
      class="win-horizontal-scroll-button scroll-back"
      type="button"
      :aria-label="t('text.scroll-left')"
      :title="t('text.scroll-left')"
      @click="scrollBack">
      <span class="icon win-horizontal-scroll-arrow"></span>
    </button>

    <button
      v-show="canScrollForward"
      ref="scrollForwardButton"
      class="win-horizontal-scroll-button scroll-forward"
      type="button"
      :aria-label="t('text.scroll-right')"
      :title="t('text.scroll-right')"
      @click="scrollForward">
      <span class="icon win-horizontal-scroll-arrow"></span>
    </button>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from './i18n/index';

const { t } = useI18n();

const scroller = ref(null);
const scrollBackButton = ref(null);
const scrollForwardButton = ref(null);
const canScrollBack = ref(false);
const canScrollForward = ref(false);
let resizeObserver = null;
let animationFrame = 0;
let targetScrollLeft = 0;
const edgeTolerance = 2;

const getScrollableWidth = () => {
  const el = scroller.value;
  if (!el) return 0;
  return Math.max(0, el.scrollWidth - el.clientWidth);
};

const updateScrollButtonsVisibility = () => {
  const el = scroller.value;
  if (!el) {
    canScrollBack.value = false;
    canScrollForward.value = false;
    return;
  }

  const scrollableWidth = getScrollableWidth();
  const horizontalOffset = animationFrame ? targetScrollLeft : el.scrollLeft;
  canScrollBack.value = horizontalOffset > edgeTolerance;
  canScrollForward.value = scrollableWidth > edgeTolerance && horizontalOffset < scrollableWidth - edgeTolerance;
};

const changeView = (offset) => {
  const el = scroller.value;
  if (!el) return;

  setTargetScrollLeft(el.scrollLeft + offset);
};

const cancelSmoothWheelScroll = () => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  }
};

const setTargetScrollLeft = (value) => {
  targetScrollLeft = Math.max(0, Math.min(getScrollableWidth(), value));
  updateScrollButtonsVisibility();

  if (!animationFrame) {
    animateScroll();
  }
};

const scrollBack = () => {
  const el = scroller.value;
  if (!el) return;

  changeView(-el.clientWidth);
  nextTick(() => scrollForwardButton.value?.focus());
};

const scrollForward = () => {
  const el = scroller.value;
  if (!el) return;

  changeView(el.clientWidth);
  nextTick(() => scrollBackButton.value?.focus());
};

const onWheel = (event) => {
  const el = scroller.value;
  if (!el || getScrollableWidth() <= 0) return;

  let delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
  if (delta === 0) return;

  event.preventDefault();

  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    delta *= 16;
  } else if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    delta *= el.clientWidth;
  }

  setTargetScrollLeft((animationFrame ? targetScrollLeft : el.scrollLeft) + delta);
};

const animateScroll = () => {
  const el = scroller.value;
  if (!el) {
    animationFrame = 0;
    return;
  }

  const distance = targetScrollLeft - el.scrollLeft;
  if (Math.abs(distance) < 0.5) {
    el.scrollLeft = targetScrollLeft;
    animationFrame = 0;
    updateScrollButtonsVisibility();
    return;
  }

  el.scrollLeft += distance * 0.22;
  updateScrollButtonsVisibility();
  animationFrame = requestAnimationFrame(animateScroll);
};

onMounted(() => {
  nextTick(updateScrollButtonsVisibility);

  resizeObserver = new ResizeObserver(updateScrollButtonsVisibility);
  if (scroller.value) {
    resizeObserver.observe(scroller.value);
    if (scroller.value.firstElementChild) {
      resizeObserver.observe(scroller.value.firstElementChild);
    }
  }
});

onBeforeUnmount(() => {
  cancelSmoothWheelScroll();
  resizeObserver?.disconnect();
});
</script>

<style scoped>
.win-horizontal-scroll-container {
  position: relative;
  min-width: 0;
}

.win-horizontal-scroll-scroller {
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  overscroll-behavior-x: contain;
  overscroll-behavior-y: auto;
}

.win-horizontal-scroll-scroller::-webkit-scrollbar {
  display: none;
}

.win-horizontal-scroll-content {
  display: grid;
  margin: 0 36px;
  width: max-content;
}

.win-horizontal-scroll-button {
  position: absolute;
  top: 50%;
  width: 16px;
  height: 38px;
  margin: -16px 0 0 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  background: var(--flyout-bg);
  background-clip: padding-box;
  border: 1px solid var(--flyout-border, var(--card-stroke));
  border-radius: var(--ControlCornerRadius, 4px);
  backdrop-filter: var(--flyout-backdrop);
  -webkit-backdrop-filter: var(--flyout-backdrop);
  cursor: pointer;
  z-index: 2;
  transition: background var(--fast-duration), border-color var(--fast-duration), color var(--fast-duration);
}

.win-horizontal-scroll-button:hover {
  background: var(--flyout-bg);
  border-color: var(--control-stroke-color-default, var(--flyout-border, var(--card-stroke)));
}

.win-horizontal-scroll-button:active {
  color: var(--text-secondary);
  background: var(--flyout-bg);
}

.win-horizontal-scroll-button.scroll-back {
  left: 8px;
}

.win-horizontal-scroll-button.scroll-forward {
  right: 8px;
}

.win-horizontal-scroll-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  line-height: 1;
  transition: transform 0.1s ease, color var(--fast-duration);
}

.win-horizontal-scroll-button:active .win-horizontal-scroll-arrow {
  transform: scale(0.85);
}
</style>
