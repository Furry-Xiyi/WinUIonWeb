<template>
  <Teleport to="body">
    <div v-if="visible" class="win-menu-flyout-overlay" @pointerdown="close"></div>
    <div v-if="visible" class="win-menu-flyout-wrap"
         :class="[isClosing ? 'is-closing' : '', openDirection === 'up' ? 'from-bottom' : '', alignmentClass, shadowVisible ? 'shadow-visible' : '']"
         :style="posStyle">
      <div class="win-menu-flyout"
           @animationend="onAnimEnd">
        <div class="win-menu-flyout-scroll">
          <div v-for="(item, i) in items" :key="i"
               class="win-menu-flyout-item"
               @click="onItemClick(item, i)">
            <span v-if="item.icon" class="icon win-menu-flyout-icon">{{ item.icon }}</span>
            <span>{{ item.label || item }}</span>
          </div>
          <slot></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
const props = defineProps({
  open: Boolean,
  anchorRect: Object,
  items: { type: Array, default: () => [] },
  alignment: { type: String, default: 'center' }
});
const emit = defineEmits(['close', 'select']);
const shadowVisible = ref(false);
const visible = ref(false);
const isClosing = ref(false);
const openDirection = ref('down');
const windowHeight = ref(typeof window === 'undefined' ? 600 : window.innerHeight);

const alignmentClass = computed(() => props.alignment === 'right' ? 'align-right' : '');

const updateWindowHeight = () => {
  windowHeight.value = window.innerHeight;
};

onMounted(() => {
  updateWindowHeight();
  window.addEventListener('resize', updateWindowHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWindowHeight);
});

watch(() => props.open, (val) => {
  if (val) {
    visible.value = true;
    isClosing.value = false;
    shadowVisible.value = false;
  } else if (visible.value) {
    isClosing.value = true;
    setTimeout(() => {
      visible.value = false;
      isClosing.value = false;
    }, 150);
  }
}, { immediate: true });

const close = () => { emit('close'); };
const onItemClick = (item, index) => { emit('select', item, index); };
const onAnimEnd = () => { if (!isClosing.value) shadowVisible.value = true; };

const posStyle = computed(() => {
  if (!props.anchorRect) return {};
  const r = props.anchorRect;
  const viewH = windowHeight.value;
  const margin = 8;
  const gap = 6;

  if (r.width === 0) {
    const maxH = viewH - r.top - margin;
    openDirection.value = 'down';
    return {
      top: r.top + 'px',
      left: (r.left + gap) + 'px',
      '--flyout-max-height': maxH + 'px'
    };
  }

  const spaceBelow = viewH - r.bottom - gap - margin;
  const spaceAbove = r.top - gap - margin;

  if (spaceBelow >= spaceAbove) {
    openDirection.value = 'down';
    if (props.alignment === 'right') {
      return {
        top: (r.bottom + gap) + 'px',
        left: r.right + 'px',
        transform: 'translateX(-100%)',
        '--flyout-max-height': Math.max(0, spaceBelow) + 'px'
      };
    }
    return {
      top: (r.bottom + gap) + 'px',
      left: (r.left + r.width / 2) + 'px',
      transform: 'translateX(-50%)',
      '--flyout-max-height': Math.max(0, spaceBelow) + 'px'
    };
  } else {
    openDirection.value = 'up';
    if (props.alignment === 'right') {
      return {
        bottom: (viewH - r.top + gap) + 'px',
        left: r.right + 'px',
        transform: 'translateX(-100%)',
        '--flyout-max-height': Math.max(0, spaceAbove) + 'px'
      };
    }
    return {
      bottom: (viewH - r.top + gap) + 'px',
      left: (r.left + r.width / 2) + 'px',
      transform: 'translateX(-50%)',
      '--flyout-max-height': Math.max(0, spaceAbove) + 'px'
    };
  }
});
</script>
<style>
  .win-menu-flyout-wrap {
    position: fixed;
    z-index: 1000;
    border-radius: 8px;
    box-shadow: 0 0 0 rgba(0,0,0,0);
    transition: box-shadow 200ms ease;
  }

    .win-menu-flyout-wrap.shadow-visible {
      box-shadow: 0 8px 24px rgba(0,0,0,0.14);
    }

    .win-menu-flyout-wrap.is-closing {
      animation: flyout-fade-out 100ms ease forwards;
      pointer-events: none;
    }

  @keyframes flyout-fade-out {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }

  .win-menu-flyout {
    position: relative;
    border: 1px solid var(--stroke-surface-flyout);
    border-radius: 8px;
    padding: 4px;
    background: var(--layer-default);
    backdrop-filter: var(--flyout-backdrop);
    -webkit-backdrop-filter: var(--flyout-backdrop);
    min-width: 20px;
    max-height: var(--flyout-max-height, 600px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: flyout-menu-open-down 250ms cubic-bezier(0.1, 0.9, 0.2, 1) both, flyout-menu-opacity 83ms linear both;
  }

  html.winui-webview-host .win-menu-flyout {
    background: var(--host-flyout-bg);
    backdrop-filter: var(--flyout-backdrop);
    -webkit-backdrop-filter: var(--flyout-backdrop);
  }

  .win-menu-flyout-wrap.from-bottom .win-menu-flyout {
    animation-name: flyout-menu-open-up, flyout-menu-opacity;
  }

  .win-menu-flyout-wrap.from-left .win-menu-flyout {
    animation:
      flyout-popin-left 250ms cubic-bezier(0.1, 0.9, 0.2, 1) both,
      flyout-menu-opacity 83ms linear both;
  }

  @keyframes flyout-menu-opacity {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes flyout-menu-open-down {
    from {
      clip-path: inset(0 0 calc(100% - 1px) 0);
      transform: translateY(-16px);
    }

    to {
      clip-path: inset(0 0 0 0);
      transform: translateY(0);
    }
  }

  @keyframes flyout-menu-open-up {
    from {
      clip-path: inset(calc(100% - 1px) 0 0 0);
      transform: translateY(16px);
    }

    to {
      clip-path: inset(0 0 0 0);
      transform: translateY(0);
    }
  }

  @keyframes flyout-popin-left {
    from {
      opacity: 0;
      max-width: 0;
    }

    to {
      opacity: 1;
      max-width: var(--flyout-max-width, 400px);
      overflow: visible;
    }
  }

  .win-menu-flyout-scroll {
    display: flex;
    flex-direction: column;
    gap: 2px;
    max-height: var(--flyout-max-height, 70vh);
    overflow-y: hidden;
    scrollbar-width: thin;
    scrollbar-color: var(--ctrl-strong-stroke) transparent;
    animation: flyout-scroll-reveal 0ms 250ms forwards;
  }

  /* 注释掉 webkit-scrollbar 自定义样式，让 Edge FluentScrollBarStyle 完全接管 */
  /*
  .win-menu-flyout-scroll::-webkit-scrollbar {
  }

  .win-menu-flyout-scroll::-webkit-scrollbar-thumb {
    background-color: color-mix(in srgb, var(--ctrl-strong-stroke) 58%, transparent);
    border: 4px solid transparent;
    border-radius: 8px;
    background-clip: content-box;
  }
  */

  @keyframes flyout-scroll-reveal {
    to {
      overflow-y: auto;
    }
  }

  .win-menu-flyout-item {
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    background: transparent;
    color: var(--text-primary);
    transition: background var(--fast-duration) var(--fast-out-slow-in);
    white-space: nowrap;
    user-select: none;
    font-size: 14px;
    text-align: left;
    display: flex;
    align-items: center;
  }

  .win-menu-flyout-icon {
    width: 16px;
    min-width: 16px;
    margin-right: 12px;
    text-align: center;
    font-size: 16px;
    line-height: 1;
  }

    .win-menu-flyout-item:hover {
      background: var(--subtle-secondary);
    }

    .win-menu-flyout-item:active {
      background: var(--subtle-tertiary);
      color: var(--text-secondary);
    }

  .win-menu-flyout-separator {
    height: 1px;
    background: var(--stroke-divider);
    margin: 4px 0;
  }

  .win-menu-flyout-overlay {
    position: fixed;
    inset: 0;
    z-index: 999;
  }
</style>
