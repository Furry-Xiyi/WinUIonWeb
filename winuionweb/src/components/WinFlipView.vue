<!-- components/WinFlipView.vue -->
<template>
  <div class="win-flip-view" :class="orientation" @mouseenter="hover = true" @mouseleave="hover = false">
    <div class="flip-view-track" :style="trackStyle">
      <div v-for="(item, index) in items" :key="index" class="flip-view-item">
        <slot name="item" :item="item"></slot>
      </div>
    </div>
    <button v-show="hover && currentIndex > 0" class="flip-btn prev" @click="currentIndex--">
      <span class="icon">{{ orientation === 'vertical' ? '\uF090' : '\uF08D' }}</span>
    </button>
    <button v-show="hover && currentIndex < items.length - 1" class="flip-btn next" @click="currentIndex++">
      <span class="icon">{{ orientation === 'vertical' ? '\uF08E' : '\uF08F' }}</span>
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

const trackStyle = computed(() => {
  if (props.orientation === 'vertical') {
    return { transform: `translateY(-${currentIndex.value * 100}%)` };
  }
  return { transform: `translateX(-${currentIndex.value * 100}%)` };
});
</script>
<style src="../styles/flipview.css"></style>
