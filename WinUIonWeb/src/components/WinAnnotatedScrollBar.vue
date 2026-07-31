<template>
  <div
    class="win-annotated-scrollbar"
    :class="stateClasses"
    :style="containerStyle"
    ref="containerRef"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 滚动轨道 -->
    <div
      class="scrollbar-rail"
      ref="railRef"
      @click="handleRailClick"
      @mousemove="handleRailMove"
    >
      <!-- 标签层 -->
      <div class="scrollbar-labels" ref="labelsRef">
        <div
          v-for="(label, index) in visibleLabels"
          :key="index"
          class="scrollbar-label"
          :style="getLabelStyle(label)"
          @click.stop="handleLabelClick(label)"
        >
          {{ label.text }}
        </div>
      </div>

      <!-- 滚动滑块 -->
      <div
        class="scrollbar-thumb"
        :style="thumbStyle"
        ref="thumbRef"
        @mousedown="handleThumbMouseDown"
      ></div>
    </div>

    <!-- 详细标签提示框 -->
    <Transition name="detail-fade">
      <div
        v-if="showDetailLabel && detailLabelContent"
        class="detail-label"
        :style="detailLabelStyle"
      >
        {{ detailLabelContent }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  // 标签集合 - 对齐官方API: Labels (IVector<AnnotatedScrollBarLabel>)
  Labels: {
    type: Array,
    default: () => []
    // 每个label: { text: string, offset: number }
  },
  // 滚动控制器 - 对齐官方API: ScrollController (IScrollController)
  ScrollController: {
    type: Object,
    default: null
    // { scrollOffset: number, maxScrollOffset: number, viewport: number }
  },
  // 最大高度 - 对齐官方API: MaxHeight
  MaxHeight: {
    type: Number,
    default: NaN
  },
  // 水平对齐 - 对齐官方API: HorizontalAlignment
  HorizontalAlignment: {
    type: String,
    default: 'Stretch',
    validator: (val) => ['Left', 'Center', 'Right', 'Stretch'].includes(val)
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  'DetailLabelRequested', // 对齐官方事件: DetailLabelRequested
  'scrollOffsetChanged'
]);

// 状态管理
const containerRef = ref(null);
const railRef = ref(null);
const labelsRef = ref(null);
const thumbRef = ref(null);

const isPointerOver = ref(false);
const isPressed = ref(false);
const showDetailLabel = ref(false);
const detailLabelContent = ref('');
const detailLabelOffset = ref(0);

const dragState = ref({
  isDragging: false,
  startY: 0,
  startScrollOffset: 0
});

// 视觉状态类 - 对齐官方VisualStates
const stateClasses = computed(() => ({
  'is-disabled': props.disabled,
  'is-pointer-over': isPointerOver.value && !props.disabled,
  'is-pressed': isPressed.value && !props.disabled
}));

// 容器样式
const containerStyle = computed(() => {
  const styles = {};

  if (!isNaN(props.MaxHeight)) {
    styles.maxHeight = `${props.MaxHeight}px`;
  }

  switch (props.HorizontalAlignment) {
    case 'Left':
      styles.alignSelf = 'flex-start';
      break;
    case 'Center':
      styles.alignSelf = 'center';
      break;
    case 'Right':
      styles.alignSelf = 'flex-end';
      break;
    case 'Stretch':
    default:
      styles.alignSelf = 'stretch';
      break;
  }

  return styles;
});

// 计算滚动比例
const scrollRatio = computed(() => {
  if (!props.ScrollController) return 0;
  const { scrollOffset = 0, maxScrollOffset = 1 } = props.ScrollController;
  if (maxScrollOffset === 0) return 0;
  return Math.max(0, Math.min(1, scrollOffset / maxScrollOffset));
});

// 计算滑块大小和位置
const thumbStyle = computed(() => {
  if (!props.ScrollController || !railRef.value) {
    return { height: '0px', transform: 'translateY(0px)' };
  }

  const { viewport = 100, maxScrollOffset = 0 } = props.ScrollController;
  const contentSize = viewport + maxScrollOffset;
  const railHeight = railRef.value.clientHeight;

  // 滑块高度 = (视口高度 / 内容总高度) * 轨道高度
  const thumbHeight = Math.max(40, (viewport / contentSize) * railHeight);

  // 滑块位置 = 滚动比例 * (轨道高度 - 滑块高度)
  const maxThumbOffset = railHeight - thumbHeight;
  const thumbOffset = scrollRatio.value * maxThumbOffset;

  return {
    height: `${thumbHeight}px`,
    transform: `translateY(${thumbOffset}px)`
  };
});

// 可见标签（处理碰撞隐藏）
const visibleLabels = computed(() => {
  if (!props.Labels || props.Labels.length === 0) return [];

  const railHeight = railRef.value?.clientHeight || 0;
  if (railHeight === 0) return props.Labels;

  // 当高度受限时，计算标签碰撞
  if (!isNaN(props.MaxHeight) && railHeight < props.MaxHeight) {
    return calculateVisibleLabels(props.Labels, railHeight);
  }

  return props.Labels;
});

// 计算可见标签（碰撞检测）
const calculateVisibleLabels = (labels, railHeight) => {
  const LABEL_HEIGHT = 20; // 标签高度
  const LABEL_SPACING = 4; // 最小间距

  const sorted = [...labels].sort((a, b) => a.offset - b.offset);
  const visible = [];
  let lastPosition = -LABEL_HEIGHT;

  for (const label of sorted) {
    const position = (label.offset / 100) * railHeight;

    // 检查是否与上一个标签碰撞
    if (position - lastPosition >= LABEL_HEIGHT + LABEL_SPACING) {
      visible.push(label);
      lastPosition = position;
    }
  }

  return visible;
};

// 获取标签样式
const getLabelStyle = (label) => {
  const railHeight = railRef.value?.clientHeight || 0;
  const position = (label.offset / 100) * railHeight;

  return {
    top: `${position}px`
  };
};

// 详细标签样式
const detailLabelStyle = computed(() => {
  const railHeight = railRef.value?.clientHeight || 0;
  const position = (detailLabelOffset.value / 100) * railHeight;

  return {
    top: `${Math.max(10, Math.min(railHeight - 30, position))}px`
  };
});

// 鼠标进入/离开
const handleMouseEnter = () => {
  if (!props.disabled) {
    isPointerOver.value = true;
  }
};

const handleMouseLeave = () => {
  isPointerOver.value = false;
  showDetailLabel.value = false;
};

// 轨道移动 - 触发DetailLabelRequested事件
const handleRailMove = (e) => {
  if (props.disabled || !railRef.value) return;

  const rect = railRef.value.getBoundingClientRect();
  const railHeight = rect.height;
  const offsetY = e.clientY - rect.top;
  const ratio = Math.max(0, Math.min(1, offsetY / railHeight));

  // 计算滚动偏移
  const maxScrollOffset = props.ScrollController?.maxScrollOffset || 0;
  const scrollOffset = ratio * maxScrollOffset;

  // 触发DetailLabelRequested事件
  const eventArgs = {
    ScrollOffset: scrollOffset,
    Content: null
  };

  emit('DetailLabelRequested', eventArgs);

  // 如果事件处理器设置了Content，显示详细标签
  if (eventArgs.Content) {
    detailLabelContent.value = eventArgs.Content;
    detailLabelOffset.value = ratio * 100;
    showDetailLabel.value = true;
  } else {
    showDetailLabel.value = false;
  }
};

// 轨道点击 - 跳转到位置
const handleRailClick = (e) => {
  if (props.disabled || !railRef.value || !props.ScrollController) return;

  const rect = railRef.value.getBoundingClientRect();
  const railHeight = rect.height;
  const offsetY = e.clientY - rect.top;
  const ratio = Math.max(0, Math.min(1, offsetY / railHeight));

  const maxScrollOffset = props.ScrollController.maxScrollOffset || 0;
  const newScrollOffset = ratio * maxScrollOffset;

  emit('scrollOffsetChanged', newScrollOffset);
};

// 标签点击 - 跳转到标签位置
const handleLabelClick = (label) => {
  if (props.disabled || !props.ScrollController) return;

  const maxScrollOffset = props.ScrollController.maxScrollOffset || 0;
  const newScrollOffset = (label.offset / 100) * maxScrollOffset;

  emit('scrollOffsetChanged', newScrollOffset);
};

// 滑块拖拽开始
const handleThumbMouseDown = (e) => {
  if (props.disabled || !props.ScrollController) return;

  e.preventDefault();
  isPressed.value = true;

  dragState.value = {
    isDragging: true,
    startY: e.clientY,
    startScrollOffset: props.ScrollController.scrollOffset || 0
  };

  document.addEventListener('mousemove', handleThumbMouseMove);
  document.addEventListener('mouseup', handleThumbMouseUp);
};

// 滑块拖拽中
const handleThumbMouseMove = (e) => {
  if (!dragState.value.isDragging || !railRef.value || !props.ScrollController) return;

  const deltaY = e.clientY - dragState.value.startY;
  const railHeight = railRef.value.clientHeight;
  const thumbHeight = thumbRef.value?.clientHeight || 0;
  const maxThumbOffset = railHeight - thumbHeight;

  const maxScrollOffset = props.ScrollController.maxScrollOffset || 0;
  const deltaRatio = deltaY / maxThumbOffset;
  const deltaScrollOffset = deltaRatio * maxScrollOffset;

  const newScrollOffset = Math.max(0, Math.min(maxScrollOffset,
    dragState.value.startScrollOffset + deltaScrollOffset));

  emit('scrollOffsetChanged', newScrollOffset);
};

// 滑块拖拽结束
const handleThumbMouseUp = () => {
  isPressed.value = false;
  dragState.value.isDragging = false;

  document.removeEventListener('mousemove', handleThumbMouseMove);
  document.removeEventListener('mouseup', handleThumbMouseUp);
};

// 清理事件监听器
onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleThumbMouseMove);
  document.removeEventListener('mouseup', handleThumbMouseUp);
});

// 暴露ScrollController接口供外部使用
defineExpose({
  scrollTo: (offset) => {
    emit('scrollOffsetChanged', offset);
  },
  getScrollOffset: () => props.ScrollController?.scrollOffset || 0,
  getMaxScrollOffset: () => props.ScrollController?.maxScrollOffset || 0
});
</script>

<style scoped>
.win-annotated-scrollbar {
  position: relative;
  width: 18px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
}

/* 滚动轨道 */
.scrollbar-rail {
  position: relative;
  width: 100%;
  height: 100%;
  background: var(--subtle-fill-color-transparent);
  border-radius: 9px;
  overflow: hidden;
  transition: background var(--fast-duration) var(--fast-out-slow-in);
}

.win-annotated-scrollbar.is-pointer-over .scrollbar-rail {
  background: var(--subtle-fill-color-secondary);
}

.win-annotated-scrollbar.is-disabled .scrollbar-rail {
  background: var(--subtle-fill-color-disabled);
  opacity: 0.5;
}

/* 标签层 */
.scrollbar-labels {
  position: absolute;
  left: -40px;
  top: 0;
  width: 36px;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.scrollbar-label {
  position: absolute;
  right: 0;
  transform: translateY(-50%);
  padding: 2px 6px;
  background: var(--layer-on-acrylic-fill-color-default);
  border: 1px solid var(--card-stroke-color-default);
  border-radius: 4px;
  font-size: 11px;
  line-height: 16px;
  color: var(--text-fill-color-secondary);
  white-space: nowrap;
  pointer-events: auto;
  cursor: pointer;
  transition: all var(--fast-duration) var(--fast-out-slow-in);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
}

.scrollbar-label:hover {
  background: var(--subtle-fill-color-secondary);
  border-color: var(--control-stroke-color-default);
  color: var(--text-fill-color-primary);
  transform: translateY(-50%) scale(1.05);
}

.scrollbar-label:active {
  transform: translateY(-50%) scale(0.98);
}

.win-annotated-scrollbar.is-disabled .scrollbar-label {
  opacity: 0.5;
  pointer-events: none;
}

/* 滚动滑块 */
.scrollbar-thumb {
  position: absolute;
  left: 3px;
  right: 3px;
  width: 12px;
  min-height: 40px;
  background: var(--control-strong-fill-color-default);
  border-radius: 6px;
  cursor: pointer;
  transition: background var(--fast-duration) var(--fast-out-slow-in);
  will-change: transform;
}

.win-annotated-scrollbar.is-pointer-over .scrollbar-thumb {
  background: var(--control-strong-fill-color-default);
}

.scrollbar-thumb:hover,
.win-annotated-scrollbar.is-pressed .scrollbar-thumb {
  background: var(--text-fill-color-secondary);
}

.scrollbar-thumb:active,
.win-annotated-scrollbar.is-pressed .scrollbar-thumb:active {
  background: var(--text-fill-color-tertiary);
}

.win-annotated-scrollbar.is-disabled .scrollbar-thumb {
  background: var(--control-strong-fill-color-disabled);
  cursor: default;
}

/* 详细标签提示框 */
.detail-label {
  position: absolute;
  left: -120px;
  width: 100px;
  padding: 6px 10px;
  background: var(--layer-fill-color-default);
  border: 1px solid var(--surface-stroke-color-flyout);
  border-radius: 6px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.14);
  font-size: 12px;
  line-height: 16px;
  color: var(--text-fill-color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
  z-index: 100;
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
}

.detail-label::after {
  content: '';
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 4px 0 4px 6px;
  border-color: transparent transparent transparent var(--surface-stroke-color-flyout);
}

/* 过渡动画 */
.detail-fade-enter-active,
.detail-fade-leave-active {
  transition: opacity 0.15s var(--fast-out-slow-in),
              transform 0.15s var(--fast-out-slow-in);
}

.detail-fade-enter-from,
.detail-fade-leave-to {
  opacity: 0;
  transform: translateX(8px);
}

/* 性能优化 */
.scrollbar-thumb,
.scrollbar-label {
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* 响应式 - 触摸设备 */
@media (hover: none) and (pointer: coarse) {
  .win-annotated-scrollbar {
    width: 24px;
  }

  .scrollbar-thumb {
    left: 4px;
    right: 4px;
    width: 16px;
  }

  .scrollbar-label {
    font-size: 12px;
    padding: 4px 8px;
  }
}
</style>
