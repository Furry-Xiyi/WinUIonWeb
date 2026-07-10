<template>
  <div class="win-semantic-zoom"
       :class="{ 'zoomed-out': !effectiveIsZoomedInViewActive }"
       ref="containerRef">
    <!-- Zoom Out Button -->
    <button v-if="effectiveIsZoomOutButtonEnabled && effectiveIsZoomedInViewActive && effectiveCanChangeViews"
            class="zoom-out-button"
            @click="toggleZoom"
            :aria-label="'Switch to zoomed out view'">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2 2h5v1H3v4H2V2zm7 0h5v5h-1V3H9V2zM2 14h5v-1H3v-4H2v5zm12 0h-5v-1h4v-4h1v5z"/>
      </svg>
    </button>

    <!-- Zoomed In View -->
    <Transition name="zoom-fade">
      <div v-show="effectiveIsZoomedInViewActive"
           class="zoom-view zoomed-in-view"
           @click="handleZoomedInClick"
           @wheel="handleWheel">
        <slot name="zoomedInView"></slot>
      </div>
    </Transition>

    <!-- Zoomed Out View -->
    <Transition name="zoom-fade">
      <div v-show="!effectiveIsZoomedInViewActive"
           class="zoom-view zoomed-out-view"
           @click="handleZoomedOutClick">
        <slot name="zoomedOutView"></slot>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

// 对齐官方属性命名
const props = defineProps({
  // IsZoomedInViewActive - 控制当前显示哪个视图
  isZoomedInViewActive: { type: Boolean, default: true },
  IsZoomedInViewActive: { type: Boolean, default: undefined },
  // CanChangeViews - 是否允许切换视图
  canChangeViews: { type: Boolean, default: true },
  CanChangeViews: { type: Boolean, default: undefined },
  // IsZoomOutButtonEnabled - 是否显示缩小按钮
  isZoomOutButtonEnabled: { type: Boolean, default: true },
  IsZoomOutButtonEnabled: { type: Boolean, default: undefined }
});

// 对齐官方事件命名
const emit = defineEmits([
  'update:isZoomedInViewActive',
  'update:IsZoomedInViewActive',
  'viewChangeStarted',
  'ViewChangeStarted',
  'viewChangeCompleted',
  'ViewChangeCompleted'
]);

const containerRef = ref(null);
const isAnimating = ref(false);
const effectiveIsZoomedInViewActive = computed(() => props.IsZoomedInViewActive ?? props.isZoomedInViewActive);
const effectiveCanChangeViews = computed(() => props.CanChangeViews ?? props.canChangeViews);
const effectiveIsZoomOutButtonEnabled = computed(() => props.IsZoomOutButtonEnabled ?? props.isZoomOutButtonEnabled);

// 切换缩放状态
const toggleZoom = () => {
  if (!effectiveCanChangeViews.value || isAnimating.value) return;

  const newState = !effectiveIsZoomedInViewActive.value;

  // 触发ViewChangeStarted事件
  const startedArgs = {
    sourceIsZoomedInView: effectiveIsZoomedInViewActive.value,
    targetIsZoomedInView: newState
  };
  emit('viewChangeStarted', startedArgs);
  emit('ViewChangeStarted', startedArgs);

  isAnimating.value = true;
  emit('update:isZoomedInViewActive', newState);
  emit('update:IsZoomedInViewActive', newState);

  // 动画完成后触发ViewChangeCompleted事件
  setTimeout(() => {
    isAnimating.value = false;
    const completedArgs = {
      sourceIsZoomedInView: !newState,
      targetIsZoomedInView: newState
    };
    emit('viewChangeCompleted', completedArgs);
    emit('ViewChangeCompleted', completedArgs);
  }, 300); // 与CSS transition时间匹配
};

// ZoomedInView点击处理（双击缩小）
const handleZoomedInClick = (e) => {
  // 检测双击
  if (e.detail === 2 && effectiveCanChangeViews.value) {
    toggleZoom();
  }
};

// ZoomedOutView点击处理（单击放大）
const handleZoomedOutClick = () => {
  if (effectiveCanChangeViews.value && !isAnimating.value) {
    toggleZoom();
  }
};

// 触控板/鼠标缩放手势支持（Ctrl+滚轮）
const handleWheel = (e) => {
  if (e.ctrlKey && effectiveCanChangeViews.value && !isAnimating.value) {
    e.preventDefault();
    // 向上滚动（放大）或向下滚动（缩小）
    if (e.deltaY < 0 && !effectiveIsZoomedInViewActive.value) {
      toggleZoom(); // 放大
    } else if (e.deltaY > 0 && effectiveIsZoomedInViewActive.value) {
      toggleZoom(); // 缩小
    }
  }
};

// 触控板双指缩放支持
let lastTouchDistance = 0;

const handleTouchStart = (e) => {
  if (e.touches.length === 2) {
    lastTouchDistance = getTouchDistance(e.touches);
  }
};

const handleTouchMove = (e) => {
  if (e.touches.length === 2 && effectiveCanChangeViews.value && !isAnimating.value) {
    const currentDistance = getTouchDistance(e.touches);
    const distanceChange = currentDistance - lastTouchDistance;

    // 双指张开（放大）
    if (distanceChange > 30 && !effectiveIsZoomedInViewActive.value) {
      e.preventDefault();
      toggleZoom();
      lastTouchDistance = currentDistance;
    }
    // 双指捏合（缩小）
    else if (distanceChange < -30 && effectiveIsZoomedInViewActive.value) {
      e.preventDefault();
      toggleZoom();
      lastTouchDistance = currentDistance;
    }
  }
};

const getTouchDistance = (touches) => {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

// 监听容器以添加触控事件
watch(containerRef, (el) => {
  if (el) {
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
  }
}, { immediate: true });
</script>

<style scoped>
.win-semantic-zoom {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--layer-fill-default);
}

.zoom-view {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.zoomed-in-view {
  z-index: 2;
}

.zoomed-out-view {
  z-index: 1;
  background: var(--layer-fill-alt);
}

/* 缩小按钮样式 */
.zoom-out-button {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  background: var(--control-fill-color-default);
  color: var(--text-fill-color-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--fast-duration) var(--fast-out-slow-in);
  box-shadow: var(--elevation-shadow-4);
}

.zoom-out-button:hover {
  background: var(--control-fill-color-secondary);
}

.zoom-out-button:active {
  background: var(--control-fill-color-tertiary);
}

/* 视图切换动画 */
.zoom-fade-enter-active,
.zoom-fade-leave-active {
  transition: opacity 300ms cubic-bezier(0.1, 0.9, 0.2, 1),
              transform 300ms cubic-bezier(0.1, 0.9, 0.2, 1);
}

/* ZoomedIn → ZoomedOut：缩小淡出 */
.win-semantic-zoom:not(.zoomed-out) .zoomed-in-view.zoom-fade-leave-active {
  transform-origin: center;
}

.win-semantic-zoom:not(.zoomed-out) .zoomed-in-view.zoom-fade-leave-to {
  opacity: 0;
  transform: scale(0.85);
}

/* ZoomedOut → ZoomedIn：放大淡入 */
.win-semantic-zoom:not(.zoomed-out) .zoomed-in-view.zoom-fade-enter-from {
  opacity: 0;
  transform: scale(1.15);
}

/* ZoomedIn → ZoomedOut：放大淡入 */
.win-semantic-zoom.zoomed-out .zoomed-out-view.zoom-fade-enter-from {
  opacity: 0;
  transform: scale(0.85);
}

/* ZoomedOut → ZoomedIn：缩小淡出 */
.win-semantic-zoom.zoomed-out .zoomed-out-view.zoom-fade-leave-to {
  opacity: 0;
  transform: scale(1.15);
}

/* 滚动条样式 */
.zoom-view::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

.zoom-view::-webkit-scrollbar-track {
  background: transparent;
}

.zoom-view::-webkit-scrollbar-thumb {
  background: var(--ctrl-strong-stroke);
  border-radius: 6px;
  border: 3px solid transparent;
  background-clip: padding-box;
}

.zoom-view::-webkit-scrollbar-thumb:hover {
  background: var(--text-fill-color-secondary);
  background-clip: padding-box;
}

/* 禁用状态 */
.win-semantic-zoom:has([disabled]) .zoom-out-button {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
