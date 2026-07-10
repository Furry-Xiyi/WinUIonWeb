<template>
  <div class="win-pips-pager" :class="[
    `orientation-${effectiveOrientation.toLowerCase()}`,
    { 'is-disabled': effectiveDisabled }
  ]">
    <!-- Previous Button -->
    <button
      v-if="shouldShowPreviousButton"
      class="nav-button previous-button"
      :class="{ 'pointer-over-only': effectivePreviousButtonVisibility === 'VisibleOnPointerOver' }"
      :disabled="effectiveDisabled || effectiveSelectedPageIndex <= 0"
      @click="previousPage"
      :aria-label="previousButtonLabel"
    >
      <span class="icon" v-html="effectiveOrientation === 'Horizontal' ? '&#xE76B;' : '&#xE70E;'"></span>
    </button>

    <!-- Pips Container -->
    <div class="pips-container" ref="pipsContainerRef">
      <div class="pips-track" :style="pipsTrackStyle">
        <button
          v-for="(page, index) in visiblePages"
          :key="page.index"
          class="pip"
          :class="{
            'is-selected': page.index === effectiveSelectedPageIndex,
            'is-compressed': page.isCompressed
          }"
          :disabled="effectiveDisabled"
          @click="selectPage(page.index)"
          :aria-label="`Page ${page.index + 1}`"
          :aria-current="page.index === effectiveSelectedPageIndex ? 'page' : undefined"
        >
          <span class="pip-dot"></span>
        </button>
      </div>
    </div>

    <!-- Next Button -->
    <button
      v-if="shouldShowNextButton"
      class="nav-button next-button"
      :class="{ 'pointer-over-only': effectiveNextButtonVisibility === 'VisibleOnPointerOver' }"
      :disabled="effectiveDisabled || effectiveSelectedPageIndex >= effectiveNumberOfPages - 1"
      @click="nextPage"
      :aria-label="nextButtonLabel"
    >
      <span class="icon" v-html="effectiveOrientation === 'Horizontal' ? '&#xE76C;' : '&#xE70D;'"></span>
    </button>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  // 官方属性：NumberOfPages
  numberOfPages: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0
  },
  NumberOfPages: {
    type: Number,
    default: undefined,
    validator: (value) => value === undefined || value >= 0
  },
  // 官方属性：SelectedPageIndex（双向绑定）
  selectedPageIndex: {
    type: Number,
    default: 0
  },
  SelectedPageIndex: {
    type: Number,
    default: undefined
  },
  // 官方属性：Orientation
  orientation: {
    type: String,
    default: 'Horizontal',
    validator: (value) => ['Horizontal', 'Vertical'].includes(value)
  },
  Orientation: {
    type: String,
    default: '',
    validator: (value) => !value || ['Horizontal', 'Vertical'].includes(value)
  },
  // 官方属性：PreviousButtonVisibility
  previousButtonVisibility: {
    type: String,
    default: 'Visible',
    validator: (value) => ['Visible', 'VisibleOnPointerOver', 'Collapsed'].includes(value)
  },
  PreviousButtonVisibility: {
    type: String,
    default: '',
    validator: (value) => !value || ['Visible', 'VisibleOnPointerOver', 'Collapsed'].includes(value)
  },
  // 官方属性：NextButtonVisibility
  nextButtonVisibility: {
    type: String,
    default: 'Visible',
    validator: (value) => ['Visible', 'VisibleOnPointerOver', 'Collapsed'].includes(value)
  },
  NextButtonVisibility: {
    type: String,
    default: '',
    validator: (value) => !value || ['Visible', 'VisibleOnPointerOver', 'Collapsed'].includes(value)
  },
  // 附加属性
  disabled: {
    type: Boolean,
    default: false
  },
  IsEnabled: {
    type: Boolean,
    default: true
  },
  previousButtonLabel: {
    type: String,
    default: 'Previous'
  },
  nextButtonLabel: {
    type: String,
    default: 'Next'
  },
  // 最大可见pip数量（超出时压缩显示）
  maxVisiblePips: {
    type: Number,
    default: 7
  }
});

// 官方事件：SelectedIndexChanged
const emit = defineEmits(['update:selectedPageIndex', 'update:SelectedPageIndex', 'selectedIndexChanged', 'SelectedIndexChanged']);

const pipsContainerRef = ref(null);
const effectiveNumberOfPages = computed(() => props.NumberOfPages ?? props.numberOfPages);
const effectiveSelectedPageIndex = computed(() => props.SelectedPageIndex ?? props.selectedPageIndex);
const effectiveOrientation = computed(() => props.Orientation || props.orientation);
const effectivePreviousButtonVisibility = computed(() => props.PreviousButtonVisibility || props.previousButtonVisibility);
const effectiveNextButtonVisibility = computed(() => props.NextButtonVisibility || props.nextButtonVisibility);
const effectiveDisabled = computed(() => props.disabled || props.IsEnabled === false);

// 计算是否显示按钮
const shouldShowPreviousButton = computed(() => {
  return effectivePreviousButtonVisibility.value !== 'Collapsed' && effectiveNumberOfPages.value > 1;
});

const shouldShowNextButton = computed(() => {
  return effectiveNextButtonVisibility.value !== 'Collapsed' && effectiveNumberOfPages.value > 1;
});

// 虚拟化滚动：计算可见的pips（当页数过多时压缩显示）
const visiblePages = computed(() => {
  if (effectiveNumberOfPages.value <= props.maxVisiblePips) {
    // 页数较少，全部显示
    return Array.from({ length: effectiveNumberOfPages.value }, (_, i) => ({
      index: i,
      isCompressed: false
    }));
  }

  // 页数较多，使用压缩显示策略
  const result = [];
  const current = effectiveSelectedPageIndex.value;
  const total = effectiveNumberOfPages.value;
  const maxVisible = props.maxVisiblePips;

  // 策略：始终显示首尾页 + 当前页附近的页
  // 例如：0 ... 3 4 [5] 6 7 ... 9

  const sideCount = Math.floor((maxVisible - 3) / 2); // 当前页两侧各显示的数量

  // 计算显示范围
  let rangeStart = Math.max(1, current - sideCount);
  let rangeEnd = Math.min(total - 2, current + sideCount);

  // 调整范围以保持总数
  const rangeSize = rangeEnd - rangeStart + 1;
  const targetRangeSize = maxVisible - 2; // 减去首尾两页

  if (rangeSize < targetRangeSize) {
    if (rangeStart === 1) {
      rangeEnd = Math.min(total - 2, rangeStart + targetRangeSize - 1);
    } else if (rangeEnd === total - 2) {
      rangeStart = Math.max(1, rangeEnd - targetRangeSize + 1);
    }
  }

  // 首页
  result.push({ index: 0, isCompressed: false });

  // 首页和范围之间的间隔
  if (rangeStart > 1) {
    result.push({ index: -1, isCompressed: true }); // -1表示省略号
  }

  // 中间范围
  for (let i = rangeStart; i <= rangeEnd; i++) {
    result.push({ index: i, isCompressed: false });
  }

  // 范围和尾页之间的间隔
  if (rangeEnd < total - 2) {
    result.push({ index: -2, isCompressed: true }); // -2表示省略号
  }

  // 尾页
  if (total > 1) {
    result.push({ index: total - 1, isCompressed: false });
  }

  return result;
});

// 计算pips轨道的平移样式（用于滚动动画）
const pipsTrackStyle = computed(() => {
  // 这里可以添加平滑滚动动画
  return {};
});

// 选择页面
const selectPage = (index) => {
  if (effectiveDisabled.value || index < 0 || index >= effectiveNumberOfPages.value || index === effectiveSelectedPageIndex.value) {
    return;
  }

  const oldIndex = effectiveSelectedPageIndex.value;

  emit('update:selectedPageIndex', index);
  emit('update:SelectedPageIndex', index);

  // 官方事件：SelectedIndexChanged，传递事件参数
  const args = {
    oldIndex,
    newIndex: index
  };
  emit('selectedIndexChanged', args);
  emit('SelectedIndexChanged', args);
};

// 上一页
const previousPage = () => {
  if (effectiveSelectedPageIndex.value > 0) {
    selectPage(effectiveSelectedPageIndex.value - 1);
  }
};

// 下一页
const nextPage = () => {
  if (effectiveSelectedPageIndex.value < effectiveNumberOfPages.value - 1) {
    selectPage(effectiveSelectedPageIndex.value + 1);
  }
};

// 键盘导航
const handleKeyDown = (event) => {
  if (effectiveDisabled.value) return;

  const isHorizontal = effectiveOrientation.value === 'Horizontal';

  if ((isHorizontal && event.key === 'ArrowLeft') || (!isHorizontal && event.key === 'ArrowUp')) {
    event.preventDefault();
    previousPage();
  } else if ((isHorizontal && event.key === 'ArrowRight') || (!isHorizontal && event.key === 'ArrowDown')) {
    event.preventDefault();
    nextPage();
  } else if (event.key === 'Home') {
    event.preventDefault();
    selectPage(0);
  } else if (event.key === 'End') {
    event.preventDefault();
    selectPage(effectiveNumberOfPages.value - 1);
  }
};

// 手势支持（触摸滑动）
const touchStartX = ref(0);
const touchStartY = ref(0);
const MIN_SWIPE_DISTANCE = 50;

const handleTouchStart = (event) => {
  if (effectiveDisabled.value) return;

  const touch = event.touches[0];
  touchStartX.value = touch.clientX;
  touchStartY.value = touch.clientY;
};

const handleTouchEnd = (event) => {
  if (effectiveDisabled.value) return;

  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - touchStartX.value;
  const deltaY = touch.clientY - touchStartY.value;

  const isHorizontal = effectiveOrientation.value === 'Horizontal';

  if (isHorizontal) {
    if (Math.abs(deltaX) > MIN_SWIPE_DISTANCE && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        previousPage();
      } else {
        nextPage();
      }
    }
  } else {
    if (Math.abs(deltaY) > MIN_SWIPE_DISTANCE && Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY > 0) {
        previousPage();
      } else {
        nextPage();
      }
    }
  }
};

// 暴露方法（用于外部调用）
defineExpose({
  previousPage,
  nextPage,
  selectPage
});
</script>

<style scoped>
.win-pips-pager {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  user-select: none;
  position: relative;
}

.win-pips-pager.orientation-vertical {
  flex-direction: column;
}

/* 导航按钮 */
.nav-button {
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
  transition: all var(--fast-duration) var(--fast-out-slow-in);
  flex-shrink: 0;
}

.nav-button .icon {
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
  font-size: 12px;
  display: block;
}

.nav-button:hover:not(:disabled) {
  background: var(--control-fill-color-secondary);
}

.nav-button:active:not(:disabled) {
  background: var(--control-fill-color-tertiary);
  transform: scale(0.95);
}

.nav-button:disabled {
  background: var(--control-fill-color-disabled);
  color: var(--text-fill-color-disabled);
  cursor: not-allowed;
  opacity: 0.5;
}

/* VisibleOnPointerOver 行为 */
.nav-button.pointer-over-only {
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--medium-duration) var(--fast-out-slow-in);
}

.win-pips-pager:hover .nav-button.pointer-over-only:not(:disabled),
.win-pips-pager:focus-within .nav-button.pointer-over-only:not(:disabled) {
  opacity: 1;
  pointer-events: auto;
}

/* Pips 容器 */
.pips-container {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.orientation-vertical .pips-container {
  flex-direction: column;
}

.pips-track {
  display: flex;
  align-items: center;
  gap: 6px;
  transition: transform var(--medium-duration) var(--fast-out-slow-in);
}

.orientation-vertical .pips-track {
  flex-direction: column;
}

/* Pip 按钮 */
.pip {
  width: 8px;
  height: 8px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--fast-duration) var(--fast-out-slow-in);
  flex-shrink: 0;
  position: relative;
}

.pip:disabled {
  cursor: not-allowed;
}

.pip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--control-stroke-color-default);
  transition: all var(--fast-duration) var(--fast-out-slow-in);
  display: block;
}

/* Pip 状态 */
.pip:hover:not(:disabled) .pip-dot {
  background: var(--subtle-fill-color-secondary);
  transform: scale(1.2);
}

.pip:active:not(:disabled) .pip-dot {
  transform: scale(1.1);
}

.pip.is-selected .pip-dot {
  width: 12px;
  height: 12px;
  background: var(--accent-fill-color-default);
}

.orientation-vertical .pip.is-selected .pip-dot {
  width: 12px;
  height: 12px;
}

.pip.is-selected:hover:not(:disabled) .pip-dot {
  background: var(--accent-hover);
  transform: scale(1.1);
}

.pip.is-selected:active:not(:disabled) .pip-dot {
  background: var(--accent-pressed);
}

/* 压缩显示的pip（省略号） */
.pip.is-compressed {
  pointer-events: none;
  cursor: default;
}

.pip.is-compressed .pip-dot {
  width: 4px;
  height: 4px;
  background: var(--control-stroke-color-default);
  opacity: 0.5;
}

/* 禁用状态 */
.win-pips-pager.is-disabled .pip {
  cursor: not-allowed;
}

.win-pips-pager.is-disabled .pip-dot {
  background: var(--control-fill-color-disabled);
}

.win-pips-pager.is-disabled .pip.is-selected .pip-dot {
  background: var(--accent-fill-disabled);
}

/* 焦点样式 */
.pip:focus-visible {
  outline: 2px solid var(--accent-fill-color-default);
  outline-offset: 2px;
  border-radius: 50%;
}

.nav-button:focus-visible {
  outline: 2px solid var(--accent-fill-color-default);
  outline-offset: 2px;
}

/* 动画效果 */
@keyframes pip-select {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

.pip.is-selected .pip-dot {
  animation: pip-select var(--medium-duration) var(--fast-out-slow-in);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .nav-button {
    width: 28px;
    height: 28px;
  }

  .pips-track {
    gap: 4px;
  }

  .pip {
    width: 6px;
    height: 6px;
  }

  .pip-dot {
    width: 6px;
    height: 6px;
  }

  .pip.is-selected .pip-dot {
    width: 10px;
    height: 10px;
  }
}

/* 高对比度主题支持 */
@media (prefers-contrast: high) {
  .pip-dot {
    border: 1px solid currentColor;
  }

  .nav-button {
    border: 1px solid currentColor;
  }
}
</style>
