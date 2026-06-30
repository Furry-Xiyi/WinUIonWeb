<template>
  <div
    class="win-progress-bar"
    :class="{
      'is-indeterminate': isIndeterminate,
      'is-paused': showPaused,
      'is-error': showError
    }"
    :style="progressBarStyle"
    role="progressbar"
    :aria-valuenow="isIndeterminate ? undefined : value"
    :aria-valuemin="isIndeterminate ? undefined : 0"
    :aria-valuemax="isIndeterminate ? undefined : maximum">
    <div class="progress-track">
      <div class="progress-indicator" :style="indicatorStyle"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  // 官方属性：Value - 当前进度值（0-100）
  value: {
    type: Number,
    default: 0
  },
  // 官方属性：Maximum - 最大值
  maximum: {
    type: Number,
    default: 100
  },
  // 官方属性：IsIndeterminate - 不确定状态（循环动画）
  isIndeterminate: {
    type: Boolean,
    default: false
  },
  // 官方属性：ShowPaused - 显示暂停状态
  showPaused: {
    type: Boolean,
    default: false
  },
  // 官方属性：ShowError - 显示错误状态
  showError: {
    type: Boolean,
    default: false
  },
  // 宽度（可选）
  width: {
    type: [Number, String],
    default: '100%'
  }
});

const progressBarStyle = computed(() => {
  const widthValue = typeof props.width === 'number' ? `${props.width}px` : props.width;
  return {
    width: widthValue
  };
});

const indicatorStyle = computed(() => {
  if (props.isIndeterminate) {
    return {};
  }
  const percentage = Math.min(100, Math.max(0, (props.value / props.maximum) * 100));
  return {
    width: `${percentage}%`
  };
});
</script>

<style scoped>
.win-progress-bar {
  display: inline-block;
  height: 4px;
  position: relative;
}

.progress-track {
  width: 100%;
  height: 100%;
  background: var(--control-fill-secondary);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

.progress-indicator {
  height: 100%;
  background: var(--accent-base);
  border-radius: 2px;
  transition: width 0.2s ease;
}

/* Indeterminate animation */
.win-progress-bar.is-indeterminate .progress-indicator {
  width: 30%;
  animation: indeterminate 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes indeterminate {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
}

/* Paused state */
.win-progress-bar.is-paused .progress-indicator {
  background: var(--system-attention);
  animation-play-state: paused;
}

/* Error state */
.win-progress-bar.is-error .progress-indicator {
  background: var(--system-error-default);
  animation-play-state: paused;
}

/* 主题适配 */
@media (prefers-color-scheme: dark) {
  .progress-track {
    background: rgba(255, 255, 255, 0.08);
  }
}
</style>
