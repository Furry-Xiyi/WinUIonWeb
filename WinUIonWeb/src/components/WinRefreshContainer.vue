<template>
  <div
    ref="containerRef"
    class="win-refresh-container"
    :class="{ 'refreshing': isRefreshing }"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @mousedown="handleMouseDown"
  >
    <!-- RefreshVisualizer slot -->
    <div
      class="refresh-visualizer-host"
      :style="visualizerStyle"
    >
      <slot name="visualizer">
        <WinRefreshVisualizer
          :refreshState="currentRefreshState"
          @refreshStateChanged="handleRefreshStateChanged"
        />
      </slot>
    </div>

    <!-- Scrollable content -->
    <div
      ref="contentRef"
      class="refresh-container-content"
      :style="contentStyle"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import WinRefreshVisualizer from './WinRefreshVisualizer.vue'

// Props - 对齐官方 RefreshContainer API
interface Props {
  // 官方属性：拉取阈值
  pullThreshold?: number
  // 官方属性：RefreshVisualizer 实例（通过 slot 实现）
  visualizer?: any
}

const props = withDefaults(defineProps<Props>(), {
  pullThreshold: 100
})

// Events - 对齐官方事件
const emit = defineEmits<{
  // 官方事件：RefreshRequested - 当用户触发刷新时
  refreshRequested: [args: RefreshRequestedEventArgs]
}>()

// 官方 RefreshRequestedEventArgs 接口
interface RefreshRequestedEventArgs {
  // 获取延迟完成对象
  getDeferral(): Deferral
}

// 官方 Deferral 接口
interface Deferral {
  // 标记异步操作完成
  complete(): void
}

// Refresh states - 对齐官方 RefreshVisualizerState 枚举
enum RefreshVisualizerState {
  Idle = 0,           // 空闲状态
  Peeking = 1,        // 开始拉取
  Interacting = 2,    // 用户正在拉取
  Pending = 3,        // 达到阈值，等待释放
  Refreshing = 4      // 正在刷新
}

// State
const containerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const currentRefreshState = ref<RefreshVisualizerState>(RefreshVisualizerState.Idle)
const isRefreshing = ref(false)
const pullDistance = ref(0)
const startY = ref(0)
const isDragging = ref(false)
const deferralCallbacks = ref<(() => void)[]>([])

// Computed styles
const visualizerStyle = computed(() => ({
  height: `${Math.min(pullDistance.value, props.pullThreshold * 1.5)}px`,
  opacity: pullDistance.value > 0 ? 1 : 0,
  transform: `translateY(${Math.max(0, pullDistance.value - props.pullThreshold)}px)`
}))

const contentStyle = computed(() => ({
  transform: `translateY(${pullDistance.value}px)`,
  transition: isDragging.value ? 'none' : 'transform 0.3s ease-out'
}))

// Touch/Mouse handlers
const handleTouchStart = (e: TouchEvent) => {
  if (isRefreshing.value) return

  const scrollTop = contentRef.value?.scrollTop || 0
  if (scrollTop === 0) {
    startY.value = e.touches[0].clientY
    isDragging.value = true
    currentRefreshState.value = RefreshVisualizerState.Peeking
  }
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value || isRefreshing.value) return

  const currentY = e.touches[0].clientY
  const diff = currentY - startY.value

  if (diff > 0) {
    e.preventDefault()
    pullDistance.value = Math.min(diff * 0.5, props.pullThreshold * 1.5)

    if (pullDistance.value >= props.pullThreshold) {
      currentRefreshState.value = RefreshVisualizerState.Pending
    } else if (pullDistance.value > 0) {
      currentRefreshState.value = RefreshVisualizerState.Interacting
    }
  }
}

const handleTouchEnd = () => {
  if (!isDragging.value || isRefreshing.value) return

  isDragging.value = false

  if (pullDistance.value >= props.pullThreshold) {
    // 触发刷新
    triggerRefresh()
  } else {
    // 未达到阈值，重置
    resetPull()
  }
}

const handleMouseDown = (e: MouseEvent) => {
  if (isRefreshing.value) return

  const scrollTop = contentRef.value?.scrollTop || 0
  if (scrollTop === 0) {
    startY.value = e.clientY
    isDragging.value = true
    currentRefreshState.value = RefreshVisualizerState.Peeking

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging.value) return

      const diff = moveEvent.clientY - startY.value
      if (diff > 0) {
        pullDistance.value = Math.min(diff * 0.5, props.pullThreshold * 1.5)

        if (pullDistance.value >= props.pullThreshold) {
          currentRefreshState.value = RefreshVisualizerState.Pending
        } else if (pullDistance.value > 0) {
          currentRefreshState.value = RefreshVisualizerState.Interacting
        }
      }
    }

    const handleMouseUp = () => {
      if (!isDragging.value) return

      isDragging.value = false

      if (pullDistance.value >= props.pullThreshold) {
        triggerRefresh()
      } else {
        resetPull()
      }

      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }
}

// 官方 Deferral 模式实现
const triggerRefresh = () => {
  isRefreshing.value = true
  currentRefreshState.value = RefreshVisualizerState.Refreshing
  pullDistance.value = props.pullThreshold

  let deferralCompleted = false

  const deferral: Deferral = {
    complete: () => {
      if (deferralCompleted) return
      deferralCompleted = true

      // 执行所有回调
      deferralCallbacks.value.forEach(cb => cb())
      deferralCallbacks.value = []

      // 重置状态
      setTimeout(() => {
        isRefreshing.value = false
        resetPull()
      }, 300)
    }
  }

  const args: RefreshRequestedEventArgs = {
    getDeferral: () => deferral
  }

  // 触发官方 RefreshRequested 事件
  emit('refreshRequested', args)

  // 如果 3 秒内未调用 Complete，自动完成
  setTimeout(() => {
    if (!deferralCompleted) {
      deferral.complete()
    }
  }, 3000)
}

const resetPull = () => {
  pullDistance.value = 0
  currentRefreshState.value = RefreshVisualizerState.Idle
}

// RefreshStateChanged 事件处理
interface RefreshStateChangedEventArgs {
  oldState: RefreshVisualizerState
  newState: RefreshVisualizerState
}

const handleRefreshStateChanged = (args: RefreshStateChangedEventArgs) => {
  currentRefreshState.value = args.newState
  // 可以在这里添加额外的状态变更逻辑
}

// Lifecycle
onMounted(() => {
  // 初始化
})

onUnmounted(() => {
  // 清理
})

// 暴露方法（官方 RefreshContainer 的公共方法）
defineExpose({
  // 官方方法：请求刷新
  requestRefresh: () => {
    if (!isRefreshing.value) {
      triggerRefresh()
    }
  }
})
</script>

<style scoped>
.win-refresh-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
}

.refresh-visualizer-host {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  pointer-events: none;
  transition: opacity 0.2s ease-out;
  z-index: 10;
}

.refresh-container-content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  will-change: transform;
}

.win-refresh-container.refreshing .refresh-container-content {
  transition: transform 0.3s ease-out;
}
</style>
