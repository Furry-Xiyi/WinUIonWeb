<template>
  <div
    class="example-theme-wrapper"
    :class="themeClass"
    :data-theme="resolvedTheme">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  theme?: 'light' | 'dark' | 'system';
}>();

const resolvedTheme = computed(() => {
  if (!props.theme || props.theme === 'system') {
    // 使用全局主题
    const html = document.documentElement;
    if (html.classList.contains('theme-dark')) return 'dark';
    if (html.classList.contains('theme-light')) return 'light';
    // 检查系统偏好
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }
  return props.theme;
});

const themeClass = computed(() => {
  return `theme-${resolvedTheme.value}`;
});
</script>

<style>
/* 主题包装器为子组件提供独立的主题上下文 */
.example-theme-wrapper {
  display: contents;
}

/* Light theme overrides */
.example-theme-wrapper.theme-light,
.win-theme-scope.theme-light {
  --text-primary: rgba(0, 0, 0, 0.8956);
  --text-secondary: rgba(0, 0, 0, 0.6063);
  --text-tertiary: rgba(0, 0, 0, 0.4458);
  --text-disabled: rgba(0, 0, 0, 0.3614);

  --ctrl-fill-default: rgba(255, 255, 255, 0.7);
  --ctrl-fill-secondary: rgba(249, 249, 249, 0.5);
  --ctrl-fill-tertiary: rgba(249, 249, 249, 0.3);
  --ctrl-fill-disabled: rgba(249, 249, 249, 0.3);
  --ctrl-fill-input-active: #FFFFFF;
  --control-fill-color-input-active: var(--ctrl-fill-input-active);
  --control-fill-input-active: var(--ctrl-fill-input-active);

  --ctrl-stroke-default: rgba(0, 0, 0, 0.0578);
  --ctrl-strong-stroke: rgba(0, 0, 0, 0.6555);
  --ctrl-strong-stroke-disabled: rgba(0, 0, 0, 0.3665);

  --subtle-secondary: rgba(0, 0, 0, 0.0373);
  --subtle-tertiary: rgba(0, 0, 0, 0.0241);
  --subtle-fill-color-secondary: var(--subtle-secondary);
  --subtle-fill-color-tertiary: var(--subtle-tertiary);

  --card-bg-default: rgba(255, 255, 255, 0.7);
  --card-bg-secondary: rgba(246, 246, 246, 0.5);
  --card-bg: var(--card-bg-default);
  --card-stroke: rgba(0, 0, 0, 0.06);
  --stroke-divider: rgba(0, 0, 0, 0.06);
  --stroke-surface-flyout: rgba(0, 0, 0, 0.06);
  --flyout-border: rgba(0, 0, 0, 0.06);
  --flyout-bg: rgba(252, 252, 252, 0.78);
  --flyout-background: var(--flyout-bg);
  --flyout-backdrop: blur(30px) saturate(160%) brightness(1.02);
  --flyout-material-overlay: linear-gradient(135deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.06));
  --layer-default: rgba(255, 255, 255, 0.50);
  --layer-fill-color-default: var(--layer-default);
  --surface-stroke-color-flyout: var(--stroke-surface-flyout);
  --divider-stroke: var(--stroke-divider);
}

/* Dark theme overrides */
.example-theme-wrapper.theme-dark,
.win-theme-scope.theme-dark {
  --text-primary: rgba(255, 255, 255, 1);
  --text-secondary: rgba(255, 255, 255, 0.786);
  --text-tertiary: rgba(255, 255, 255, 0.5442);
  --text-disabled: rgba(255, 255, 255, 0.3628);

  --ctrl-fill-default: rgba(255, 255, 255, 0.0605);
  --ctrl-fill-secondary: rgba(255, 255, 255, 0.0837);
  --ctrl-fill-tertiary: rgba(255, 255, 255, 0.0326);
  --ctrl-fill-disabled: rgba(255, 255, 255, 0.0419);
  --ctrl-fill-input-active: rgba(30, 30, 30, 0.70);
  --control-fill-color-input-active: var(--ctrl-fill-input-active);
  --control-fill-input-active: var(--ctrl-fill-input-active);

  --ctrl-stroke-default: rgba(255, 255, 255, 0.0698);
  --ctrl-strong-stroke: rgba(255, 255, 255, 0.5442);
  --ctrl-strong-stroke-disabled: rgba(255, 255, 255, 0.1581);

  --subtle-secondary: rgba(255, 255, 255, 0.0605);
  --subtle-tertiary: rgba(255, 255, 255, 0.0419);
  --subtle-fill-color-secondary: var(--subtle-secondary);
  --subtle-fill-color-tertiary: var(--subtle-tertiary);

  --card-bg-default: rgba(255, 255, 255, 0.0512);
  --card-bg-secondary: rgba(255, 255, 255, 0.0326);
  --card-bg: #2B2B2B;
  --card-stroke: rgba(0, 0, 0, 0.10);
  --stroke-divider: rgba(255, 255, 255, 0.08);
  --stroke-surface-flyout: rgba(0, 0, 0, 0.20);
  --flyout-border: rgba(0, 0, 0, 0.20);
  --flyout-bg: rgba(44, 44, 44, 0.58);
  --flyout-background: var(--flyout-bg);
  --flyout-backdrop: blur(44px) saturate(190%) brightness(1.22) contrast(1.05);
  --flyout-material-overlay: linear-gradient(135deg, rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.025) 45%, rgba(0, 0, 0, 0.12));
  --layer-default: rgba(58, 58, 58, 0.50);
  --layer-fill-color-default: var(--layer-default);
  --surface-stroke-color-flyout: var(--stroke-surface-flyout);
  --divider-stroke: var(--stroke-divider);
}
</style>
