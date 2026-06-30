<template>
  <div
    class="win-infobadge"
    :class="badgeClasses"
    :style="badgeStyles"
    role="status"
    :aria-label="ariaLabel"
  >
    <!-- Icon mode -->
    <span v-if="displayMode === 'icon' && iconGlyph" class="infobadge-icon">
      {{ iconGlyph }}
    </span>
    <!-- Value mode -->
    <span v-else-if="displayMode === 'value'" class="infobadge-value">
      {{ displayValue }}
    </span>
    <!-- Dot mode - no content, just the styled element -->
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  // 对齐官方属性命名：Value（PascalCase）
  value: {
    type: Number,
    default: -1  // -1 displays as dot
  },
  // IconSource - 简化为iconGlyph字符串
  iconSource: {
    type: String,
    default: null
  },
  // Opacity
  opacity: {
    type: Number,
    default: 1.0
  },
  // Background - CSS color string
  background: {
    type: String,
    default: null
  },
  // Style variant: Attention/Informational/Success/Critical + Icon/Value/Dot
  styleVariant: {
    type: String,
    default: 'attention', // attention, informational, success, critical
    validator: (value) => ['attention', 'informational', 'success', 'critical'].includes(value.toLowerCase())
  },
  // Horizontal/Vertical alignment
  horizontalAlignment: {
    type: String,
    default: 'stretch',
    validator: (value) => ['left', 'center', 'right', 'stretch'].includes(value.toLowerCase())
  },
  verticalAlignment: {
    type: String,
    default: 'stretch',
    validator: (value) => ['top', 'center', 'bottom', 'stretch'].includes(value.toLowerCase())
  }
});

// 确定显示模式：icon/value/dot
const displayMode = computed(() => {
  if (props.iconSource) {
    return 'icon';
  } else if (props.value >= 0) {
    return 'value';
  } else {
    return 'dot';
  }
});

// Icon字形（从iconSource提取或使用Segoe图标）
const iconGlyph = computed(() => {
  if (props.iconSource) {
    // 如果是Unicode字符（如 ），直接返回
    if (props.iconSource.startsWith('\\u')) {
      return String.fromCharCode(parseInt(props.iconSource.slice(2), 16));
    }
    // 如果是十六进制（如 0xE13C 或 E13C）
    if (props.iconSource.startsWith('0x') || /^[0-9A-Fa-f]{4}$/.test(props.iconSource)) {
      const code = props.iconSource.startsWith('0x')
        ? parseInt(props.iconSource, 16)
        : parseInt(props.iconSource, 16);
      return String.fromCharCode(code);
    }
    // 否则视为纯文本图标
    return props.iconSource;
  }
  return null;
});

// 显示的数值
const displayValue = computed(() => {
  return props.value >= 0 ? props.value : '';
});

// CSS classes
const badgeClasses = computed(() => {
  return {
    [`infobadge-${props.styleVariant.toLowerCase()}`]: true,
    [`infobadge-${displayMode.value}`]: true,
    [`align-h-${props.horizontalAlignment.toLowerCase()}`]: props.horizontalAlignment !== 'stretch',
    [`align-v-${props.verticalAlignment.toLowerCase()}`]: props.verticalAlignment !== 'stretch'
  };
});

// 动态样式
const badgeStyles = computed(() => {
  const styles = {};

  if (props.opacity !== 1.0) {
    styles.opacity = props.opacity;
  }

  if (props.background) {
    styles.backgroundColor = props.background;
  }

  return styles;
});

// Accessibility label
const ariaLabel = computed(() => {
  if (displayMode.value === 'value') {
    return `${props.value} notification${props.value !== 1 ? 's' : ''}`;
  } else if (displayMode.value === 'icon') {
    return 'Notification';
  } else {
    return 'New notification';
  }
});
</script>

<style scoped>
.win-infobadge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'Segoe UI Variable', 'Segoe UI', sans-serif;
  font-weight: 600;
  box-sizing: border-box;
  flex-shrink: 0;
  transition: all var(--fast-duration) var(--fast-out-slow-in);
}

/* Display modes */
.infobadge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  min-width: 6px;
  min-height: 6px;
}

.infobadge-value {
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  font-size: 11px;
  line-height: 16px;
}

.infobadge-icon {
  width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.infobadge-icon .infobadge-icon {
  font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
  font-size: 10px;
}

.infobadge-value .infobadge-value {
  font-size: 11px;
  font-weight: 600;
}

/* Style variants - Attention (default blue accent) */
.infobadge-attention.infobadge-dot,
.infobadge-attention.infobadge-value,
.infobadge-attention.infobadge-icon {
  background-color: var(--accent-base, #0078D4);
  color: #FFFFFF;
}

/* Informational (neutral gray) */
.infobadge-informational.infobadge-dot,
.infobadge-informational.infobadge-value,
.infobadge-informational.infobadge-icon {
  background-color: var(--ctrl-solid-fill-default, #8A8A8A);
  color: #FFFFFF;
}

/* Success (green) */
.infobadge-success.infobadge-dot,
.infobadge-success.infobadge-value,
.infobadge-success.infobadge-icon {
  background-color: #107C10;
  color: #FFFFFF;
}

/* Critical (red) */
.infobadge-critical.infobadge-dot,
.infobadge-critical.infobadge-value,
.infobadge-critical.infobadge-icon {
  background-color: #C42B1C;
  color: #FFFFFF;
}

/* Alignment utilities */
.align-h-left {
  align-self: flex-start;
}

.align-h-center {
  align-self: center;
}

.align-h-right {
  align-self: flex-end;
}

.align-v-top {
  align-self: flex-start;
}

.align-v-center {
  align-self: center;
}

.align-v-bottom {
  align-self: flex-end;
}

/* For display: flex containers */
.win-infobadge[style*="opacity: 0"] {
  visibility: hidden;
}
</style>
