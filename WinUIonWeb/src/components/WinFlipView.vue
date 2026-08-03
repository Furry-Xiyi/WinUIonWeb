<!-- components/WinFlipView.vue -->
<template>
  <div class="win-flip-view" :class="orientationClass"
       @mouseenter="hover = true" @mouseleave="hover = false"
       @wheel.prevent="onWheel"
       @touchstart="onTouchStart" @touchend="onTouchEnd">
    <div class="flip-view-track" :style="trackStyle">
      <div v-for="(item, index) in items" :key="getItemKey(item, index)" class="flip-view-item">
        <slot name="item" :item="item"></slot>
      </div>
    </div>
    <button v-show="hover && selectedIndex > 0" class="flip-btn prev" @click="prev">
      <span class="icon flip-arrow">{{ orientationClass === 'vertical' ? '\uEDDB' : '\uEDD9' }}</span>
    </button>
    <button v-show="hover && selectedIndex < items.length - 1" class="flip-btn next" @click="next">
      <span class="icon flip-arrow">{{ orientationClass === 'vertical' ? '\uEDDC' : '\uEDDA' }}</span>
    </button>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  ItemsSource: { type: Array, default: null },
  SelectedIndex: { type: Number, default: undefined },
  SelectedItem: { type: [Object, String, Number, Boolean], default: undefined },
  Orientation: { type: String, default: undefined },
  IsEnabled: { type: Boolean, default: true },
  items: { type: Array, default: () => [] },
  orientation: { type: String, default: 'horizontal' }
});
const emit = defineEmits(['SelectionChanged', 'update:SelectedIndex', 'update:SelectedItem']);

const hover = ref(false);
const currentIndex = ref(0);
let touchStart = 0;

const items = computed(() => props.ItemsSource ?? props.items);
const orientation = computed(() => props.Orientation ?? props.orientation);
const orientationClass = computed(() => String(orientation.value).toLowerCase());
const selectedIndex = computed(() => props.SelectedIndex ?? currentIndex.value);

function getItemKey(item, index) { return item?.id ?? item?.title ?? item?.alt ?? index; }

function setSelectedIndex(index) {
  const bounded = Math.max(0, Math.min(items.value.length - 1, index));
  if (bounded === selectedIndex.value) return;
  const oldItem = items.value[selectedIndex.value];
  const selectedItem = items.value[bounded];
  currentIndex.value = bounded;
  emit('update:SelectedIndex', bounded);
  emit('update:SelectedItem', selectedItem);
  emit('SelectionChanged', { AddedItems: selectedItem === undefined ? [] : [selectedItem], RemovedItems: oldItem === undefined ? [] : [oldItem], SelectedIndex: bounded, SelectedItem: selectedItem });
}

function prev() { if (props.IsEnabled && selectedIndex.value > 0) setSelectedIndex(selectedIndex.value - 1); }
function next() { if (props.IsEnabled && selectedIndex.value < items.value.length - 1) setSelectedIndex(selectedIndex.value + 1); }

function onWheel(e) {
  if (!props.IsEnabled) return;
  const delta = orientationClass.value === 'vertical' ? e.deltaY : (e.deltaX || e.deltaY);
  if (delta > 0) next();
  else if (delta < 0) prev();
}

function onTouchStart(e) {
  const touch = e.touches[0];
  if (!props.IsEnabled) return;
  touchStart = orientationClass.value === 'vertical' ? touch.clientY : touch.clientX;
}

function onTouchEnd(e) {
  const touch = e.changedTouches[0];
  if (!props.IsEnabled) return;
  const end = orientationClass.value === 'vertical' ? touch.clientY : touch.clientX;
  const diff = touchStart - end;
  if (diff > 30) next();
  else if (diff < -30) prev();
}

const trackStyle = computed(() => {
  if (orientationClass.value === 'vertical') {
    return { transform: `translateY(-${selectedIndex.value * 100}%)` };
  }
  return { transform: `translateX(-${selectedIndex.value * 100}%)` };
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
    isolation: isolate;
    background: transparent;
    -webkit-backdrop-filter: var(--flyout-backdrop);
    backdrop-filter: var(--flyout-backdrop);
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

    .flip-btn::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      border-radius: inherit;
      background: var(--flyout-bg);
    }

    .flip-btn .flip-arrow {
      font-size: 8px;
      transition: transform 0.1s ease, color var(--fast-duration);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .flip-btn:hover {
      background: transparent;
    }

      .flip-btn:hover .flip-arrow {
        color: var(--text-primary);
      }

    .flip-btn:active {
      background: transparent;
    }

      .flip-btn:active .flip-arrow {
        color: var(--text-secondary);
        transform: scale(0.85);
      }

  .win-flip-view.horizontal .flip-btn {
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 38px;
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
