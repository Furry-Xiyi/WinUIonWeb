<!-- components/WinPullToRefresh.vue -->
<template>
  <div class="win-pull-to-refresh" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
    <div class="ptr-indicator" :style="indicatorStyle">
      <span class="icon">&#xE72C;</span>
    </div>
    <div class="ptr-content" :style="contentStyle">
      <slot></slot>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';

const emit = defineEmits(['refresh']);
const startY = ref(0);
const currentY = ref(0);
const isPulling = ref(false);
const isRefreshing = ref(false);

const distance = computed(() => Math.max(0, currentY.value - startY.value));
const pullDist = computed(() => isRefreshing.value ? 50 : Math.min(distance.value * 0.5, 80));

const indicatorStyle = computed(() => ({
  transform: `translateY(${pullDist.value - 40}px) rotate(${pullDist.value * 5}deg)`,
  opacity: pullDist.value / 50
}));
const contentStyle = computed(() => ({
  transform: `translateY(${pullDist.value}px)`
}));

const onTouchStart = (e) => {
  if (window.scrollY === 0 && !isRefreshing.value) {
    startY.value = e.touches[0].clientY;
    currentY.value = startY.value;
    isPulling.value = true;
  }
};

const onTouchMove = (e) => {
  if (isPulling.value) {
    currentY.value = e.touches[0].clientY;
    if (currentY.value > startY.value) e.preventDefault();
  }
};

const onTouchEnd = () => {
  if (isPulling.value) {
    isPulling.value = false;
    if (distance.value > 100) {
      isRefreshing.value = true;
      emit('refresh', () => {
        isRefreshing.value = false;
        startY.value = 0;
        currentY.value = 0;
      });
    } else {
      startY.value = 0;
      currentY.value = 0;
    }
  }
};
</script>
<style src="../styles/pulltorefresh.css"></style>
