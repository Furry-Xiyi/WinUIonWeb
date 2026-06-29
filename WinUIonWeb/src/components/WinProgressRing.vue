<template>
  <div class="win-progress-ring" :style="customStyle" :class="{ 'auto-color': !color }"></div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import loadingRingGif from '../assets/LoadingRing/LoadingRing.gif';

const props = defineProps({
  color: { type: String, default: null }
});

const autoColor = ref('var(--accent-default)');

const updateAutoColor = () => {
  if (!props.color) {
    // 自动检测当前主题并设置合适的颜色
    const computedStyle = getComputedStyle(document.documentElement);
    const accentColor = computedStyle.getPropertyValue('--accent-default').trim() ||
                        computedStyle.getPropertyValue('--accent-base').trim() ||
                        '#0078D4';
    autoColor.value = accentColor;
  }
};

// 监听主题变化
const themeObserver = ref(null);

onMounted(() => {
  updateAutoColor();

  // 创建 MutationObserver 监听主题变化
  themeObserver.value = new MutationObserver(() => {
    updateAutoColor();
  });

  themeObserver.value.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'class']
  });

  // 也监听 CSS 变量变化
  window.addEventListener('storage', updateAutoColor);
});

onUnmounted(() => {
  if (themeObserver.value) {
    themeObserver.value.disconnect();
  }
  window.removeEventListener('storage', updateAutoColor);
});

const customStyle = computed(() => {
  const style = {
    '--ring-mask': `url(${loadingRingGif})`
  };

  // 如果用户指定了颜色则使用用户颜色，否则使用自动颜色
  if (props.color) {
    style['--ring-color'] = props.color;
  } else {
    style['--ring-color'] = autoColor.value;
  }

  return style;
});
</script>

<style scoped>
.win-progress-ring {
  display: inline-block;
  width: 48px;
  height: 48px;
  /* Mask uses the imported base64 or bundled URL to find the single LoadingRing.gif */
  -webkit-mask-image: var(--ring-mask);
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-image: var(--ring-mask);
  mask-size: contain;
  mask-repeat: no-repeat;

  /* 使用自动检测的主题色或用户指定颜色 */
  background-color: var(--ring-color);
  transition: background-color 0.2s ease;
}

/* 自动颜色模式下，确保在不同主题下都有良好的对比度 */
.win-progress-ring.auto-color {
  /* 在浅色主题下使用 accent 色 */
  background-color: var(--ring-color);
}

/* 支持暗色主题 */
@media (prefers-color-scheme: dark) {
  .win-progress-ring.auto-color {
    /* 暗色主题下可能需要稍微调亮一点 */
    filter: brightness(1.1);
  }
}
</style>
