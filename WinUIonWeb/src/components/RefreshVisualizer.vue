<template>
  <div
    class="win-refresh-visualizer"
    :class="stateClass"
    :style="visualizerStyle"
  >
    <!-- Content slot - 允许完全自定义可视化内容 -->
    <slot>
      <!-- 默认可视化：旋转图标 -->
      <div class="default-visualizer">
        <svg
          class="refresh-icon"
          :class="{ 'spinning': isRefreshing }"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
            :fill="iconColor"
          />
        </svg>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// RefreshVisualizerState 枚举 - 对齐官方
enum RefreshVisualizerState {
  Idle = 0,
  Peeking = 1,
  Interacting = 2,
  Pending = 3,
  Refreshing = 4
}

// Props - 对齐官方 RefreshVisualizer API
interface Props {
  // 官方属性：刷新状态
  refreshState?: RefreshVisualizerState
  // 官方属性：方向（官方支持 Top/Bottom/Left/Right）
  orientation?: 'Top' | 'Bottom' | 'Left' | 'Right'
  // 官方属性：Content（通过 slot 实现）
  content?: any
}

const props = withDefaults(defineProps<Props>(), {
  refreshState: RefreshVisualizerState.Idle,
  orientation: 'Top'
})

// Events - 对齐官方事件
const emit = defineEmits<{
  // 官方事件：RefreshStateChanged
  refreshStateChanged: [args: RefreshStateChangedEventArgs]
}>()

// 官方 RefreshStateChangedEventArgs 接口
interface RefreshStateChangedEventArgs {
  oldState: RefreshVisualizerState
  newState: RefreshVisualizerState
}

// Computed
const isRefreshing = computed(() => props.refreshState === RefreshVisualizerState.Refreshing)

const stateClass = computed(() => {
  switch (props.refreshState) {
    case RefreshVisualizerState.Idle:
      return 'state-idle'
    case RefreshVisualizerState.Peeking:
      return 'state-peeking'
    case RefreshVisualizerState.Interacting:
      return 'state-interacting'
    case RefreshVisualizerState.Pending:
      return 'state-pending'
    case RefreshVisualizerState.Refreshing:
      return 'state-refreshing'
    default:
      return 'state-idle'
  }
})

const visualizerStyle = computed(() => {
  const opacity = props.refreshState === RefreshVisualizerState.Idle ? 0 : 1
  const scale = props.refreshState === RefreshVisualizerState.Peeking ? 0.8 : 1

  return {
    opacity,
    transform: `scale(${scale})`,
    transition: props.refreshState === RefreshVisualizerState.Idle
      ? 'opacity 0.2s ease-out, transform 0.2s ease-out'
      : 'transform 0.2s ease-out'
  }
})

const iconColor = computed(() => {
  // 根据状态改变颜色
  switch (props.refreshState) {
    case RefreshVisualizerState.Pending:
      return 'var(--win-accent-color, #0078d4)'
    case RefreshVisualizerState.Refreshing:
      return 'var(--win-accent-color, #0078d4)'
    default:
      return 'var(--win-text-secondary, #605e5c)'
  }
})

// Watch state changes and emit RefreshStateChanged
let previousState = props.refreshState

const emitStateChanged = (newState: RefreshVisualizerState) => {
  if (previousState !== newState) {
    const args: RefreshStateChangedEventArgs = {
      oldState: previousState,
      newState: newState
    }
    emit('refreshStateChanged', args)
    previousState = newState
  }
}

// Watch props.refreshState
import { watch } from 'vue'
watch(() => props.refreshState, (newState) => {
  emitStateChanged(newState)
})
</script>

<style scoped>
.win-refresh-visualizer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  will-change: opacity, transform;
}

.default-visualizer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.refresh-icon {
  transition: transform 0.3s ease-out;
}

.refresh-icon.spinning {
  animation: spin 1s linear infinite;
}

/* 状态特定样式 */
.state-idle .refresh-icon {
  opacity: 0;
}

.state-peeking .refresh-icon {
  transform: rotate(0deg);
}

.state-interacting .refresh-icon {
  transform: rotate(var(--pull-rotation, 0deg));
}

.state-pending .refresh-icon {
  transform: rotate(180deg);
}

.state-refreshing .refresh-icon {
  /* 动画在 .spinning class 中定义 */
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 方向支持（官方支持 4 个方向） */
.win-refresh-visualizer[data-orientation="Bottom"] {
  transform: rotate(180deg);
}

.win-refresh-visualizer[data-orientation="Left"] {
  transform: rotate(-90deg);
}

.win-refresh-visualizer[data-orientation="Right"] {
  transform: rotate(90deg);
}
</style>
