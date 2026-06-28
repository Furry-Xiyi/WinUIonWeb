<!-- components/WinFlipView.vue -->
<template>
  <div class="win-flip-view" :class="orientation"
       @mouseenter="hover = true" @mouseleave="hover = false"
       @wheel.prevent="onWheel"
       @touchstart="onTouchStart" @touchend="onTouchEnd">
    <div class="flip-view-track" :style="trackStyle">
      <div v-for="(item, index) in items" :key="index" class="flip-view-item">
        <slot name="item" :item="item"></slot>
      </div>
    </div>
    <button v-show="hover && currentIndex > 0" class="flip-btn prev" @click="prev">
      <span class="icon flip-arrow">{{ orientation === 'vertical' ? '\uF090' : '\uF08D' }}</span>
    </button>
    <button v-show="hover && currentIndex < items.length - 1" class="flip-btn next" @click="next">
      <span class="icon flip-arrow">{{ orientation === 'vertical' ? '\uF08E' : '\uF08F' }}</span>
    </button>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  items: { type: Array, default: () => [] },
  orientation: { type: String, default: 'horizontal' }
});

const hover = ref(false);
const currentIndex = ref(0);
let touchStart = 0;

function prev() { if (currentIndex.value > 0) currentIndex.value--; }
function next() { if (currentIndex.value < props.items.length - 1) currentIndex.value++; }

function onWheel(e) {
  const delta = props.orientation === 'vertical' ? e.deltaY : (e.deltaX || e.deltaY);
  if (delta > 0) next();
  else if (delta < 0) prev();
}

function onTouchStart(e) {
  const touch = e.touches[0];
  touchStart = props.orientation === 'vertical' ? touch.clientY : touch.clientX;
}

function onTouchEnd(e) {
  const touch = e.changedTouches[0];
  const end = props.orientation === 'vertical' ? touch.clientY : touch.clientX;
  const diff = touchStart - end;
  if (diff > 30) next();
  else if (diff < -30) prev();
}

const trackStyle = computed(() => {
  if (props.orientation === 'vertical') {
    return { transform: `translateY(-${currentIndex.value * 100}%)` };
  }
  return { transform: `translateX(-${currentIndex.value * 100}%)` };
});
</script>
<style>
  /* styles/flipview.css */
  .win-flip-view {
    position: relative;
    overflow: hidden;
    border-radius: 0;
    display: flex;
    width: 100%;
    height: 100%;
    touch-action: none;
  }

  .flip-view-track {
    display: flex;
    width: 100%;
    height: 100%;
    transition: transform var(--normal-duration) var(--fast-out-slow-in);
  }

  .win-flip-view.vertical .flip-view-track {
    flex-direction: column;
  }

  .flip-view-item {
    flex: 0 0 100%;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .flip-btn {
    position: absolute;
    background: var(--flyout-bg);
    backdrop-filter: var(--flyout-backdrop);
    -webkit-backdrop-filter: var(--flyout-backdrop);
    border: 1px solid var(--card-stroke);
    border-radius: 4px;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    transition: background var(--fast-duration);
  }

    .flip-btn .flip-arrow {
      font-size: 8px;
      transition: transform 0.1s ease, color var(--fast-duration);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .flip-btn:hover {
      background: var(--flyout-bg);
      backdrop-filter: var(--flyout-backdrop);
    }

      .flip-btn:hover .flip-arrow {
        color: var(--text-primary);
      }

    .flip-btn:active {
      background: var(--flyout-bg);
      backdrop-filter: var(--flyout-backdrop);
    }

      .flip-btn:active .flip-arrow {
        color: var(--text-secondary);
        transform: scale(0.85);
      }

  .win-flip-view.horizontal .flip-btn {
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 40px;
  }

    .win-flip-view.horizontal .flip-btn.prev {
      left: 4px;
    }

    .win-flip-view.horizontal .flip-btn.next {
      right: 4px;
    }

  .win-flip-view.vertical .flip-btn {
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 16px;
  }

    .win-flip-view.vertical .flip-btn.prev {
      top: 4px;
    }

    .win-flip-view.vertical .flip-btn.next {
      bottom: 4px;
    }
</style>
