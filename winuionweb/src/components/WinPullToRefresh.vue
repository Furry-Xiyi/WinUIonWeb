<!-- components/WinPullToRefresh.vue -->
<template>
  <div class="win-pull-to-refresh" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
    <div class="ptr-indicator" :style="indicatorStyle">
      <span class="ptr-icon-wrapper" :style="iconStyle" :class="{ 'is-refreshing': isRefreshing }">
        {{ icon }}
      </span>
    </div>
    <div class="ptr-content" :style="contentStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  icon: {
    type: String,
    // 使用 \u 前缀确保 JS 正确识别 Unicode 字符
    default: '\uE72C'
  }
});

const emit = defineEmits(['refresh']);
const startY = ref(0);
const currentY = ref(0);
const isPulling = ref(false);
const isRefreshing = ref(false);

const threshold = 100;
const distance = computed(() => Math.max(0, currentY.value - startY.value));
const progress = computed(() => Math.min(distance.value / threshold, 1));
const isReady = computed(() => distance.value >= threshold);

const pullDist = computed(() => {
  if (isRefreshing.value) return 50;
  if (!isPulling.value) return 0;
  return distance.value <= threshold
    ? distance.value * 0.5
    : (threshold * 0.5) + (distance.value - threshold) * 0.15;
});

const indicatorStyle = computed(() => ({
  transform: `translateY(${pullDist.value - 40}px)`,
  transition: isPulling.value ? 'none' : 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
}));

const contentStyle = computed(() => ({
  transform: `translateY(${pullDist.value}px)`,
  transition: isPulling.value ? 'none' : 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
}));

const iconStyle = computed(() => {
  if (isRefreshing.value) {
    return {
      opacity: 1,
      transform: 'scale(1.0)',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    };
  }

  const rotation = -180 + (progress.value * 180);
  const scale = isReady.value ? 1.2 : 1.0;
  const opacity = 0.3 + (progress.value * 0.7);

  return {
    // 合并 transform 解决浏览器 origin 偏移问题
    transform: `rotate(${rotation}deg) scale(${scale})`,
    opacity: opacity,
    transition: isPulling.value
      ? 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      : 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
  };
});

const onTouchStart = (e) => {
  if (e.currentTarget.scrollTop === 0 && !isRefreshing.value) {
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
    if (isReady.value) {
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

<style>
  /* styles/pulltorefresh.css */
  .win-pull-to-refresh {
    position: relative;
    overflow: hidden;
  }

  .ptr-indicator {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    pointer-events: none;
  }

  .ptr-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    font-family: "Segoe Fluent Icons", "Segoe MDL2 Assets", sans-serif;
    font-size: 20px;
    line-height: 0;
    color: var(--text-color);
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
    will-change: transform, opacity;
    transform-origin: center center;
  }

    .ptr-icon-wrapper.is-refreshing {
      animation: ptr-spin 0.8s linear infinite;
    }

  @keyframes ptr-spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .ptr-content {
    will-change: transform;
  }
</style>
