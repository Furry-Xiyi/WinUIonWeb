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
<style src="../styles/flipview.css"></style>
