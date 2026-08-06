<template>
  <span class="win-flyout-anchor" ref="anchorRef">
    <slot name="trigger"></slot>
    <Teleport :to="teleportTarget">
      <div v-if="effectiveIsOpen" class="win-flyout-dismiss-layer" @pointerdown="onLightDismiss"></div>
      <div
        v-if="effectiveIsOpen"
        ref="flyoutRef"
        class="win-flyout"
        :class="[themeClass, openDirection === 'up' ? 'opens-up' : 'opens-down']"
        :style="flyoutStyle"
        @pointerdown.stop>
        <WinScrollViewer
          class="win-flyout-scroll"
          VerticalScrollMode="Auto"
          VerticalScrollBarVisibility="Auto"
          HorizontalScrollMode="Disabled"
          HorizontalScrollBarVisibility="Disabled">
          <slot></slot>
        </WinScrollViewer>
      </div>
    </Teleport>
  </span>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import WinScrollViewer from './WinScrollViewer.vue';

const props = defineProps({
  IsOpen: { type: Boolean, default: undefined },
  Placement: { type: String, default: 'Bottom' },
  ShowMode: { type: String, default: 'Standard' },
  IsLightDismissEnabled: { type: Boolean, default: true },
  LightDismissOverlayMode: { type: String, default: 'Auto' },
  Theme: { type: String, default: '' },
  placement: { type: String, default: '' },
  direction: { type: String, default: '' },
  align: { type: String, default: '' }
});

const emit = defineEmits(['update:IsOpen', 'Opened', 'Closed', 'Opening', 'Closing']);

const anchorRef = ref<HTMLElement | null>(null);
const flyoutRef = ref<HTMLElement | null>(null);
const localIsOpen = ref(false);
const position = ref({ top: 0, left: 0, maxHeight: 0, minWidth: 0 });
const openDirection = ref('down');
const teleportTarget = ref<string | HTMLElement>('body');

const effectiveIsOpen = computed(() => props.IsOpen ?? localIsOpen.value);
const themeClass = computed(() => props.Theme === 'light' || props.Theme === 'dark' ? `win-theme-scope theme-${props.Theme}` : '');
const requestedPlacement = computed(() => props.Placement || props.placement || 'Bottom');

const flyoutStyle = computed(() => ({
  top: `${position.value.top}px`,
  left: `${position.value.left}px`,
  minWidth: position.value.minWidth ? `${position.value.minWidth}px` : undefined,
  maxHeight: position.value.maxHeight ? `${position.value.maxHeight}px` : undefined
}));

const setOpen = (value: boolean) => {
  if (value === effectiveIsOpen.value && props.IsOpen !== undefined) return;
  localIsOpen.value = value;
  emit('update:IsOpen', value);
  if (value) emit('Opening');
  else emit('Closing');
};

const updatePosition = async () => {
  const anchor = anchorRef.value;
  if (!anchor) return;
  const rect = anchor.getBoundingClientRect();
  const margin = 8;
  const gap = 6;
  const placement = requestedPlacement.value;
  const preferTop = placement.includes('Top') || props.direction === 'up';
  const preferRight = placement.includes('Right');
  const preferCenter = props.align === 'center';
  const preferEnd = placement.includes('Right') || props.align === 'right';

  let top = preferTop ? rect.top - gap : rect.bottom + gap;
  let left = preferRight ? rect.right : rect.left;
  position.value = {
    top,
    left,
    maxHeight: Math.max(120, window.innerHeight - margin * 2),
    minWidth: rect.width
  };

  await nextTick();
  const flyout = flyoutRef.value;
  if (!flyout) return;
  const flyoutRect = flyout.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom - gap - margin;
  const spaceAbove = rect.top - gap - margin;
  const shouldOpenUp = preferTop || (spaceBelow < flyoutRect.height && spaceAbove > spaceBelow);
  openDirection.value = shouldOpenUp ? 'up' : 'down';

  top = shouldOpenUp ? rect.top - gap - flyoutRect.height : rect.bottom + gap;
  if (preferCenter) left = rect.left + rect.width / 2 - flyoutRect.width / 2;
  else if (preferEnd) left = rect.right - flyoutRect.width;
  else left = rect.left;

  left = Math.max(margin, Math.min(window.innerWidth - flyoutRect.width - margin, left));
  top = Math.max(margin, Math.min(window.innerHeight - flyoutRect.height - margin, top));

  position.value = {
    top,
    left,
    maxHeight: Math.max(120, shouldOpenUp ? spaceAbove : spaceBelow),
    minWidth: rect.width
  };
};

const show = async () => {
  setOpen(true);
  await nextTick();
  await updatePosition();
  emit('Opened');
};

const hide = () => {
  if (!effectiveIsOpen.value) return;
  setOpen(false);
  emit('Closed');
};

const toggle = () => {
  if (effectiveIsOpen.value) hide();
  else void show();
};

const onLightDismiss = () => {
  if (props.IsLightDismissEnabled) hide();
};

watch(() => props.IsOpen, async (value: boolean | undefined) => {
  if (value) {
    await nextTick();
    await updatePosition();
    emit('Opened');
  }
});

const onViewportChanged = () => {
  if (effectiveIsOpen.value) void updatePosition();
};

const onFullscreenChanged = () => {
  teleportTarget.value = (document.fullscreenElement as HTMLElement | null) || 'body';
  if (effectiveIsOpen.value) void updatePosition();
};

onMounted(() => {
  teleportTarget.value = (document.fullscreenElement as HTMLElement | null) || 'body';
  window.addEventListener('resize', onViewportChanged);
  window.addEventListener('scroll', onViewportChanged, true);
  document.addEventListener('fullscreenchange', onFullscreenChanged);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onViewportChanged);
  window.removeEventListener('scroll', onViewportChanged, true);
  document.removeEventListener('fullscreenchange', onFullscreenChanged);
});

defineExpose({ show, hide, toggle, IsOpen: effectiveIsOpen });
</script>

<style>
.win-flyout-anchor {
  display: inline-flex;
}

.win-flyout-dismiss-layer {
  position: fixed;
  inset: 0;
  z-index: 989;
}

.win-flyout {
  position: fixed;
  z-index: 990;
  min-width: 20px;
  max-width: min(420px, calc(100vw - 16px));
  padding: 16px;
  overflow: hidden;
  color: var(--text-primary);
  --win-acrylic-fill: var(--flyout-background, var(--flyout-bg));
  isolation: isolate;
  background: transparent;
  border: 1px solid var(--surface-stroke-color-flyout, var(--flyout-border));
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  --win-flyout-shadow-bleed: 32px;
  -webkit-backdrop-filter: var(--flyout-backdrop);
  backdrop-filter: var(--flyout-backdrop);
}

.win-flyout-scroll {
  width: 100%;
  max-height: inherit;
}

.win-flyout-scroll :deep(.win-scroll-viewer-viewport) {
  height: auto;
  max-height: inherit;
}

.win-flyout.opens-down {
  animation: win-flyout-open-down 250ms cubic-bezier(0.1, 0.9, 0.2, 1) both, win-flyout-opacity 83ms linear both;
}

.win-flyout.opens-up {
  animation: win-flyout-open-up 250ms cubic-bezier(0.1, 0.9, 0.2, 1) both, win-flyout-opacity 83ms linear both;
}

@keyframes win-flyout-opacity {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes win-flyout-open-down {
  from {
    clip-path: inset(0 0 calc(100% - 1px) 0);
    transform: translateY(-16px);
  }
  to {
    clip-path: inset(calc(-1 * var(--win-flyout-shadow-bleed)));
    transform: translateY(0);
  }
}

@keyframes win-flyout-open-up {
  from {
    clip-path: inset(calc(100% - 1px) 0 0 0);
    transform: translateY(16px);
  }
  to {
    clip-path: inset(calc(-1 * var(--win-flyout-shadow-bleed)));
    transform: translateY(0);
  }
}
</style>
