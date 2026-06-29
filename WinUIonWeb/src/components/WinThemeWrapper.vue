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
.example-theme-wrapper.theme-light {
  --text-primary: rgba(0, 0, 0, 0.8956);
  --text-secondary: rgba(0, 0, 0, 0.6063);
  --text-tertiary: rgba(0, 0, 0, 0.4458);
  --text-disabled: rgba(0, 0, 0, 0.3614);

  --ctrl-fill-default: rgba(255, 255, 255, 0.7);
  --ctrl-fill-secondary: rgba(249, 249, 249, 0.5);
  --ctrl-fill-tertiary: rgba(249, 249, 249, 0.3);
  --ctrl-fill-disabled: rgba(249, 249, 249, 0.3);

  --ctrl-stroke-default: rgba(0, 0, 0, 0.0578);
  --ctrl-strong-stroke: rgba(0, 0, 0, 0.6555);
  --ctrl-strong-stroke-disabled: rgba(0, 0, 0, 0.3665);

  --subtle-secondary: rgba(0, 0, 0, 0.0373);
  --subtle-tertiary: rgba(0, 0, 0, 0.0241);

  --card-bg-default: rgba(255, 255, 255, 0.7);
  --card-bg-secondary: rgba(246, 246, 246, 0.5);
}

/* Dark theme overrides */
.example-theme-wrapper.theme-dark {
  --text-primary: rgba(255, 255, 255, 1);
  --text-secondary: rgba(255, 255, 255, 0.786);
  --text-tertiary: rgba(255, 255, 255, 0.5442);
  --text-disabled: rgba(255, 255, 255, 0.3628);

  --ctrl-fill-default: rgba(255, 255, 255, 0.0605);
  --ctrl-fill-secondary: rgba(255, 255, 255, 0.0837);
  --ctrl-fill-tertiary: rgba(255, 255, 255, 0.0326);
  --ctrl-fill-disabled: rgba(255, 255, 255, 0.0419);

  --ctrl-stroke-default: rgba(255, 255, 255, 0.0698);
  --ctrl-strong-stroke: rgba(255, 255, 255, 0.5442);
  --ctrl-strong-stroke-disabled: rgba(255, 255, 255, 0.1581);

  --subtle-secondary: rgba(255, 255, 255, 0.0605);
  --subtle-tertiary: rgba(255, 255, 255, 0.0419);

  --card-bg-default: rgba(255, 255, 255, 0.0512);
  --card-bg-secondary: rgba(255, 255, 255, 0.0326);
}
</style>
