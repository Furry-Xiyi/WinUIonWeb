<template>
  <Teleport to="body">
    <div v-if="visible" class="win-menu-flyout-overlay" @pointerdown="close"></div>
    <div v-if="visible" class="win-menu-flyout-wrap"
         :class="[isClosing ? 'is-closing' : '', openDirection === 'up' ? 'from-bottom' : '', shadowVisible ? 'shadow-visible' : '']"
         :style="posStyle">
      <div class="win-menu-flyout"
           @animationend="onAnimEnd">
        <div class="win-menu-flyout-scroll">
          <div v-for="(item, i) in items" :key="i"
               class="win-menu-flyout-item"
               @click="onItemClick(item, i)">{{ item.label || item }}</div>
          <slot></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<script setup>
import { computed, ref, watch } from 'vue';
const props = defineProps({
  open: Boolean,
  anchorRect: Object,
  items: { type: Array, default: () => [] }
});
const emit = defineEmits(['close', 'select']);
const shadowVisible = ref(false);
const visible = ref(false);
const isClosing = ref(false);
const openDirection = ref('down');

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
  const viewH = window.innerHeight;
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
    return {
      top: (r.bottom + gap) + 'px',
      left: (r.left + r.width / 2) + 'px',
      transform: 'translateX(-50%)',
      '--flyout-max-height': spaceBelow + 'px'
    };
  } else {
    openDirection.value = 'up';
    return {
      bottom: (viewH - r.top + gap) + 'px',
      left: (r.left + r.width / 2) + 'px',
      transform: 'translateX(-50%)',
      '--flyout-max-height': spaceAbove + 'px'
    };
  }
});
</script>
<style>
  .win-menu-flyout-wrap {
    position: fixed;
    z-index: 1000;
    border-radius: 4px;
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
    border-radius: 4px;
    padding: 4px;
    background: var(--flyout-bg);
    backdrop-filter: var(--flyout-backdrop);
    -webkit-backdrop-filter: var(--flyout-backdrop);
    min-width: 20px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: flyout-popin-down 150ms cubic-bezier(0, 0, 1, 1) forwards;
  }

  .win-menu-flyout-wrap.from-bottom .win-menu-flyout {
    animation-name: flyout-popin-up;
  }

  .win-menu-flyout-wrap.from-left .win-menu-flyout {
    animation-name: flyout-popin-left;
  }

  @keyframes flyout-popin-down {
    from {
      opacity: 0;
      max-height: 0;
      transform: translateY(-16px);
    }

    to {
      opacity: 1;
      max-height: var(--flyout-max-height, 600px);
      transform: translateY(0);
      overflow: visible;
    }
  }

  @keyframes flyout-popin-up {
    from {
      opacity: 0;
      max-height: 0;
      transform: translateY(16px);
    }

    to {
      opacity: 1;
      max-height: var(--flyout-max-height, 600px);
      transform: translateY(0);
      overflow: visible;
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
    animation: flyout-scroll-reveal 0ms 250ms forwards;
  }

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
