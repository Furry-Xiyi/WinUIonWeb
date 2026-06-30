<template>
  <div
    ref="swipeContainer"
    class="win-swipe-control"
    :class="{
      'is-swiping': isSwiping,
      'is-revealed': isRevealed,
      [`reveal-${revealDirection}`]: isRevealed
    }"
    @mousedown="handlePointerDown"
    @touchstart="handlePointerDown"
  >
    <!-- Left Swipe Items -->
    <div
      v-if="leftItems && leftItems.length > 0"
      class="swipe-items swipe-items-left"
      :style="{ transform: `translateX(${leftRevealAmount}px)` }"
    >
      <div
        v-for="(item, index) in leftItems"
        :key="`left-${index}`"
        class="swipe-item"
        :class="{
          'swipe-item-execute': item.mode === 'Execute',
          'swipe-item-invoked': invokedItem === item
        }"
        :style="{
          background: item.background || 'var(--control-fill-color-default)',
          color: item.foreground || 'var(--text-fill-color-primary)'
        }"
        @click="() => handleItemInvoked(item, 'Left')"
      >
        <span v-if="item.iconSource" class="swipe-item-icon" v-html="item.iconSource"></span>
        <span v-if="item.text" class="swipe-item-text">{{ item.text }}</span>
      </div>
    </div>

    <!-- Right Swipe Items -->
    <div
      v-if="rightItems && rightItems.length > 0"
      class="swipe-items swipe-items-right"
      :style="{ transform: `translateX(${rightRevealAmount}px)` }"
    >
      <div
        v-for="(item, index) in rightItems"
        :key="`right-${index}`"
        class="swipe-item"
        :class="{
          'swipe-item-execute': item.mode === 'Execute',
          'swipe-item-invoked': invokedItem === item
        }"
        :style="{
          background: item.background || 'var(--control-fill-color-default)',
          color: item.foreground || 'var(--text-fill-color-primary)'
        }"
        @click="() => handleItemInvoked(item, 'Right')"
      >
        <span v-if="item.iconSource" class="swipe-item-icon" v-html="item.iconSource"></span>
        <span v-if="item.text" class="swipe-item-text">{{ item.text }}</span>
      </div>
    </div>

    <!-- Top Swipe Items -->
    <div
      v-if="topItems && topItems.length > 0"
      class="swipe-items swipe-items-top"
      :style="{ transform: `translateY(${topRevealAmount}px)` }"
    >
      <div
        v-for="(item, index) in topItems"
        :key="`top-${index}`"
        class="swipe-item"
        :class="{
          'swipe-item-execute': item.mode === 'Execute',
          'swipe-item-invoked': invokedItem === item
        }"
        :style="{
          background: item.background || 'var(--control-fill-color-default)',
          color: item.foreground || 'var(--text-fill-color-primary)'
        }"
        @click="() => handleItemInvoked(item, 'Top')"
      >
        <span v-if="item.iconSource" class="swipe-item-icon" v-html="item.iconSource"></span>
        <span v-if="item.text" class="swipe-item-text">{{ item.text }}</span>
      </div>
    </div>

    <!-- Bottom Swipe Items -->
    <div
      v-if="bottomItems && bottomItems.length > 0"
      class="swipe-items swipe-items-bottom"
      :style="{ transform: `translateY(${bottomRevealAmount}px)` }"
    >
      <div
        v-for="(item, index) in bottomItems"
        :key="`bottom-${index}`"
        class="swipe-item"
        :class="{
          'swipe-item-execute': item.mode === 'Execute',
          'swipe-item-invoked': invokedItem === item
        }"
        :style="{
          background: item.background || 'var(--control-fill-color-default)',
          color: item.foreground || 'var(--text-fill-color-primary)'
        }"
        @click="() => handleItemInvoked(item, 'Bottom')"
      >
        <span v-if="item.iconSource" class="swipe-item-icon" v-html="item.iconSource"></span>
        <span v-if="item.text" class="swipe-item-text">{{ item.text }}</span>
      </div>
    </div>

    <!-- Content -->
    <div
      class="swipe-content"
      :style="{
        transform: `translate(${contentOffsetX}px, ${contentOffsetY}px)`,
        transition: isSwiping ? 'none' : 'transform 0.3s var(--standard-easing)'
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  leftItems: {
    type: Array,
    default: null
  },
  rightItems: {
    type: Array,
    default: null
  },
  topItems: {
    type: Array,
    default: null
  },
  bottomItems: {
    type: Array,
    default: null
  }
});

const swipeContainer = ref(null);
const isSwiping = ref(false);
const isRevealed = ref(false);
const revealDirection = ref(null);
const contentOffsetX = ref(0);
const contentOffsetY = ref(0);
const startX = ref(0);
const startY = ref(0);
const currentX = ref(0);
const currentY = ref(0);
const swipeDirection = ref(null);
const invokedItem = ref(null);

const SWIPE_THRESHOLD = 50; // Minimum distance to trigger reveal
const EXECUTE_THRESHOLD = 150; // Distance to auto-execute
const ITEM_WIDTH = 80; // Width of each swipe item
const ITEM_HEIGHT = 80; // Height of each swipe item

const leftRevealAmount = computed(() => {
  if (revealDirection.value === 'Left' && isRevealed.value) {
    return 0;
  }
  return Math.min(0, contentOffsetX.value);
});

const rightRevealAmount = computed(() => {
  if (revealDirection.value === 'Right' && isRevealed.value) {
    return 0;
  }
  return Math.max(0, contentOffsetX.value);
});

const topRevealAmount = computed(() => {
  if (revealDirection.value === 'Top' && isRevealed.value) {
    return 0;
  }
  return Math.min(0, contentOffsetY.value);
});

const bottomRevealAmount = computed(() => {
  if (revealDirection.value === 'Bottom' && isRevealed.value) {
    return 0;
  }
  return Math.max(0, contentOffsetY.value);
});

function handlePointerDown(e) {
  if (isRevealed.value) {
    closeSwipe();
    return;
  }

  isSwiping.value = true;

  const point = e.touches ? e.touches[0] : e;
  startX.value = point.clientX;
  startY.value = point.clientY;
  currentX.value = point.clientX;
  currentY.value = point.clientY;
  swipeDirection.value = null;

  document.addEventListener('mousemove', handlePointerMove);
  document.addEventListener('mouseup', handlePointerUp);
  document.addEventListener('touchmove', handlePointerMove);
  document.addEventListener('touchend', handlePointerUp);
}

function handlePointerMove(e) {
  if (!isSwiping.value) return;

  const point = e.touches ? e.touches[0] : e;
  currentX.value = point.clientX;
  currentY.value = point.clientY;

  const deltaX = currentX.value - startX.value;
  const deltaY = currentY.value - startY.value;

  // Determine swipe direction on first significant movement
  if (!swipeDirection.value && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      swipeDirection.value = deltaX > 0 ? 'Right' : 'Left';
    } else {
      swipeDirection.value = deltaY > 0 ? 'Bottom' : 'Top';
    }
  }

  // Apply movement based on direction
  if (swipeDirection.value === 'Left' && props.leftItems && props.leftItems.length > 0) {
    contentOffsetX.value = Math.max(deltaX, -(ITEM_WIDTH * props.leftItems.length));
    contentOffsetY.value = 0;
  } else if (swipeDirection.value === 'Right' && props.rightItems && props.rightItems.length > 0) {
    contentOffsetX.value = Math.min(deltaX, ITEM_WIDTH * props.rightItems.length);
    contentOffsetY.value = 0;
  } else if (swipeDirection.value === 'Top' && props.topItems && props.topItems.length > 0) {
    contentOffsetY.value = Math.max(deltaY, -(ITEM_HEIGHT * props.topItems.length));
    contentOffsetX.value = 0;
  } else if (swipeDirection.value === 'Bottom' && props.bottomItems && props.bottomItems.length > 0) {
    contentOffsetY.value = Math.min(deltaY, ITEM_HEIGHT * props.bottomItems.length);
    contentOffsetX.value = 0;
  }
}

function handlePointerUp() {
  if (!isSwiping.value) return;

  document.removeEventListener('mousemove', handlePointerMove);
  document.removeEventListener('mouseup', handlePointerUp);
  document.removeEventListener('touchmove', handlePointerMove);
  document.removeEventListener('touchend', handlePointerUp);

  const deltaX = Math.abs(contentOffsetX.value);
  const deltaY = Math.abs(contentOffsetY.value);

  // Check if swipe should trigger reveal or execute
  if (swipeDirection.value === 'Left' || swipeDirection.value === 'Right') {
    const items = swipeDirection.value === 'Left' ? props.leftItems : props.rightItems;
    const executeMode = items && items.length > 0 && items[0].mode === 'Execute';

    if (deltaX >= EXECUTE_THRESHOLD && executeMode) {
      // Auto-execute on full swipe
      handleItemInvoked(items[0], swipeDirection.value);
    } else if (deltaX >= SWIPE_THRESHOLD) {
      // Reveal items
      revealSwipe(swipeDirection.value, items);
    } else {
      // Reset
      closeSwipe();
    }
  } else if (swipeDirection.value === 'Top' || swipeDirection.value === 'Bottom') {
    const items = swipeDirection.value === 'Top' ? props.topItems : props.bottomItems;
    const executeMode = items && items.length > 0 && items[0].mode === 'Execute';

    if (deltaY >= EXECUTE_THRESHOLD && executeMode) {
      // Auto-execute on full swipe
      handleItemInvoked(items[0], swipeDirection.value);
    } else if (deltaY >= SWIPE_THRESHOLD) {
      // Reveal items
      revealSwipe(swipeDirection.value, items);
    } else {
      // Reset
      closeSwipe();
    }
  } else {
    closeSwipe();
  }

  isSwiping.value = false;
}

function revealSwipe(direction, items) {
  isRevealed.value = true;
  revealDirection.value = direction;

  if (direction === 'Left') {
    contentOffsetX.value = -(ITEM_WIDTH * items.length);
    contentOffsetY.value = 0;
  } else if (direction === 'Right') {
    contentOffsetX.value = ITEM_WIDTH * items.length;
    contentOffsetY.value = 0;
  } else if (direction === 'Top') {
    contentOffsetY.value = -(ITEM_HEIGHT * items.length);
    contentOffsetX.value = 0;
  } else if (direction === 'Bottom') {
    contentOffsetY.value = ITEM_HEIGHT * items.length;
    contentOffsetX.value = 0;
  }
}

function closeSwipe() {
  isRevealed.value = false;
  revealDirection.value = null;
  contentOffsetX.value = 0;
  contentOffsetY.value = 0;
  swipeDirection.value = null;
  invokedItem.value = null;
}

function handleItemInvoked(item, direction) {
  invokedItem.value = item;

  // Emit invoked event
  if (item.invoked) {
    item.invoked({ swipeControl: swipeContainer.value });
  }

  // Handle BehaviorOnInvoked
  const behavior = item.behaviorOnInvoked || 'Auto';

  if (behavior === 'Close') {
    setTimeout(() => closeSwipe(), 200);
  } else if (behavior === 'RemainOpen') {
    // Keep items visible
    setTimeout(() => {
      invokedItem.value = null;
    }, 300);
  } else {
    // Auto - close for Execute mode, remain open for Reveal mode
    if (item.mode === 'Execute') {
      setTimeout(() => closeSwipe(), 200);
    } else {
      setTimeout(() => {
        invokedItem.value = null;
      }, 300);
    }
  }
}

// Close swipe when clicking outside
function handleClickOutside(e) {
  if (isRevealed.value && swipeContainer.value && !swipeContainer.value.contains(e.target)) {
    closeSwipe();
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('mousemove', handlePointerMove);
  document.removeEventListener('mouseup', handlePointerUp);
  document.removeEventListener('touchmove', handlePointerMove);
  document.removeEventListener('touchend', handlePointerUp);
});

defineExpose({
  close: closeSwipe
});
</script>

<style scoped>
.win-swipe-control {
  position: relative;
  overflow: hidden;
  touch-action: pan-y;
  user-select: none;
}

.win-swipe-control.is-swiping {
  touch-action: none;
}

.swipe-items {
  position: absolute;
  display: flex;
  z-index: 1;
}

.swipe-items-left {
  left: 0;
  top: 0;
  bottom: 0;
  flex-direction: row;
  transform: translateX(-100%);
}

.swipe-items-right {
  right: 0;
  top: 0;
  bottom: 0;
  flex-direction: row;
  transform: translateX(100%);
}

.swipe-items-top {
  left: 0;
  right: 0;
  top: 0;
  flex-direction: column;
  transform: translateY(-100%);
}

.swipe-items-bottom {
  left: 0;
  right: 0;
  bottom: 0;
  flex-direction: column;
  transform: translateY(100%);
}

.swipe-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 80px;
  min-height: 80px;
  padding: 12px;
  cursor: pointer;
  transition: background 0.1s var(--fast-out-slow-in), opacity 0.2s;
  border: 1px solid var(--control-stroke-color-default);
}

.swipe-items-left .swipe-item,
.swipe-items-right .swipe-item {
  width: 80px;
  height: 100%;
}

.swipe-items-top .swipe-item,
.swipe-items-bottom .swipe-item {
  width: 100%;
  height: 80px;
  flex-direction: row;
}

.swipe-item:hover {
  filter: brightness(1.1);
}

.swipe-item:active {
  filter: brightness(0.9);
}

.swipe-item-icon {
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.swipe-item-text {
  font-size: 12px;
  text-align: center;
  word-break: break-word;
}

.swipe-items-top .swipe-item-text,
.swipe-items-bottom .swipe-item-text {
  font-size: 14px;
}

.swipe-item-execute {
  opacity: 0.9;
}

.swipe-item-invoked {
  animation: swipe-item-invoke 0.3s var(--standard-easing);
}

@keyframes swipe-item-invoke {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}

.swipe-content {
  position: relative;
  z-index: 2;
  background: var(--layer-fill-default);
  will-change: transform;
}

.win-swipe-control.is-swiping .swipe-content {
  transition: none;
}

/* Reveal animations */
.win-swipe-control.is-revealed.reveal-Left .swipe-items-left,
.win-swipe-control.is-revealed.reveal-Right .swipe-items-right {
  transition: transform 0.3s var(--standard-easing);
}

.win-swipe-control.is-revealed.reveal-Top .swipe-items-top,
.win-swipe-control.is-revealed.reveal-Bottom .swipe-items-bottom {
  transition: transform 0.3s var(--standard-easing);
}

/* Ensure content covers swipe items when not revealed */
.win-swipe-control:not(.is-revealed) .swipe-content {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}

/* Dark theme adjustments */
html.theme-dark .swipe-item {
  border-color: rgba(255, 255, 255, 0.08);
}

@media (prefers-color-scheme: dark) {
  html:not(.theme-light) .swipe-item {
    border-color: rgba(255, 255, 255, 0.08);
  }
}
</style>
