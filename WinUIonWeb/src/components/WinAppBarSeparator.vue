<template>
  <div
    v-show="visibility === 'Visible'"
    class="win-appbar-separator"
    :class="{
      'is-compact': isCompact,
      'is-disabled': !isEnabled
    }"
    role="separator"
    aria-orientation="vertical"
  >
    <div class="separator-line"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  // 官方属性：IsCompact - 控制紧凑模式下的显示
  isCompact: {
    type: Boolean,
    default: false
  },

  // 官方属性：Visibility - 控制可见性
  visibility: {
    type: String,
    default: 'Visible',
    validator: (value) => ['Visible', 'Collapsed', 'Hidden'].includes(value)
  },

  // 继承自Control的通用属性
  isEnabled: {
    type: Boolean,
    default: true
  }
});

// AppBarSeparator没有交互事件，无需emit
</script>

<style scoped>
.win-appbar-separator {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  /* 默认竖直分隔线，用于横向CommandBar */
  width: 1px;
  height: 40px;
  margin: 8px 12px;
  transition: opacity var(--fast-duration) var(--fast-out-slow-in);
}

/* 紧凑模式：更小的高度和边距 */
.win-appbar-separator.is-compact {
  height: 32px;
  margin: 4px 8px;
}

/* 分隔线本身 */
.separator-line {
  width: 100%;
  height: 100%;
  background: var(--divider-stroke-color-default);
  opacity: 0.6;
  transition: background var(--fast-duration) var(--fast-out-slow-in);
}

/* 禁用状态 */
.win-appbar-separator.is-disabled .separator-line {
  background: var(--control-strong-stroke-color-disabled);
  opacity: 0.3;
}

/* CommandBar溢出菜单中的横向分隔线 */
.win-appbar-separator.is-horizontal {
  width: auto;
  height: 1px;
  min-width: 200px;
  margin: 4px 0;
}

.win-appbar-separator.is-horizontal .separator-line {
  width: 100%;
  height: 1px;
}

/* 浅色主题微调 */
@media (prefers-color-scheme: light) {
  .separator-line {
    opacity: 0.5;
  }
}

/* 深色主题微调 */
@media (prefers-color-scheme: dark) {
  .separator-line {
    opacity: 0.4;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .separator-line {
    background: var(--text-fill-color-primary);
    opacity: 1;
  }

  .win-appbar-separator.is-disabled .separator-line {
    background: var(--text-fill-color-disabled);
  }
}

/* 动画性能优化 */
@media (prefers-reduced-motion: reduce) {
  .win-appbar-separator,
  .separator-line {
    transition: none;
  }
}
</style>
