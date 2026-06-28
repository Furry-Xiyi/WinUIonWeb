<template>
  <!--
    WinTitleBar - PWA 扩展标题栏组件

    启用方法：
    1. manifest.json 中添加 "display_override": ["window-controls-overlay"]
    2. index.html 中添加 <meta name="theme-color" content="#f3f3f3">
    3. 以 PWA 形式安装后，浏览器将把标题栏让出给网页
    4. 将此组件放在 App.vue 的 WinNavigationView 之前即可

    Props:
      title  - 标题栏文字
      icon   - 图标路径
      theme  - 'system' | 'light' | 'dark'，同步系统按钮区域背景色
  -->
  <div class="win-titlebar" v-if="visible">
    <img :src="finalIcon" class="win-titlebar-icon" />
    <span class="win-titlebar-title" :class="{ 'is-inactive': !windowFocused }">{{ title }}</span>
  </div>
</template>

<script setup>
import { ref, watch, inject, onMounted, onUnmounted, computed } from 'vue';

const windowFocused = ref(document.hasFocus());

let onFocus = null;
let onBlur = null;

// 在 onMounted 里追加：
onFocus = () => { windowFocused.value = true; };
onBlur = () => { windowFocused.value = false; };
window.addEventListener('focus', onFocus);
window.addEventListener('blur', onBlur);

const props = defineProps({
  title: { type: String, default: '' },
  icon: { type: String, default: '' },
  theme: { type: String, default: 'system' }
});

const finalIcon = computed(() => {
  if (props.icon) return props.icon;
  return import.meta.env.BASE_URL + 'AppIcon.ico';
});

const parentVisible = inject('winTitleBarVisible', null);
const visible = ref(false);

let onGeometryChange = null;
let mediaQuery = null;
let mediaHandler = null;

function syncVisible(val) {
  visible.value = val;
  if (parentVisible) parentVisible.value = val;
}

function updateThemeColor(mode) {
  let isDark;
  if (mode === 'dark') isDark = true;
  else if (mode === 'light') isDark = false;
  else isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const color = isDark ? '#202020' : '#f3f3f3';
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', color);
}

onMounted(() => {
  if ('windowControlsOverlay' in navigator) {
    syncVisible(navigator.windowControlsOverlay.visible);
    onGeometryChange = () => {
      syncVisible(navigator.windowControlsOverlay.visible);
    };
    navigator.windowControlsOverlay.addEventListener('geometrychange', onGeometryChange);
  }

  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaHandler = () => {
    if (props.theme === 'system') updateThemeColor('system');
  };
  mediaQuery.addEventListener('change', mediaHandler);
  updateThemeColor(props.theme);
});

onUnmounted(() => {
  if (onFocus) window.removeEventListener('focus', onFocus);
  if (onBlur) window.removeEventListener('blur', onBlur);
  if (onGeometryChange && 'windowControlsOverlay' in navigator) {
    navigator.windowControlsOverlay.removeEventListener('geometrychange', onGeometryChange);
  }
  if (mediaQuery && mediaHandler) {
    mediaQuery.removeEventListener('change', mediaHandler);
  }
});

watch(() => props.theme, (val) => updateThemeColor(val));
</script>

<style>
  .win-titlebar {
    position: fixed;
    top: env(titlebar-area-y, 0);
    left: env(titlebar-area-x, 0);
    width: env(titlebar-area-width, 100%);
    height: env(titlebar-area-height, 32px);
    display: flex;
    align-items: center;
    gap: 8px;
    padding-left: 12px;
    background: var(--app-bg);
    app-region: drag;
    -webkit-app-region: drag;
    user-select: none;
    z-index: 9999;
    transition: background var(--normal-duration) var(--fast-out-slow-in);
  }

  .win-titlebar-icon {
    width: 16px;
    height: 16px;
    margin-left: 4px;
  }

  .win-titlebar-title {
    font-size: 12px;
    color: var(--text-primary);
  }

    .win-titlebar-title.is-inactive {
      color: var(--text-disabled);
    }
</style>
