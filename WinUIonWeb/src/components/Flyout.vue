<template>
  <span class="flyout-anchor" ref="anchorRef">
    <slot name="trigger" :Flyout="flyoutController"></slot>
    <Teleport :to="teleportTarget">
      <div v-if="effectiveIsOpen" class="flyout-dismiss-layer" @pointerdown="onLightDismiss"></div>
      <Transition :name="openDirection === 'up' ? 'flyout-up' : 'flyout-down'">
        <div
          v-if="effectiveIsOpen"
          ref="flyoutRef"
          class="flyout"
          :class="[themeClass, openDirection === 'up' ? 'opens-up' : 'opens-down']"
          :style="flyoutStyle"
          @pointerdown.stop>
          <ScrollViewer
            class="flyout-scroll"
            VerticalScrollMode="Auto"
            VerticalScrollBarVisibility="Auto"
            HorizontalScrollMode="Disabled"
            HorizontalScrollBarVisibility="Disabled">
            <slot v-if="slots.default"></slot>
            <template v-else>{{ resolvedContent }}</template>
          </ScrollViewer>
        </div>
      </Transition>
    </Teleport>
  </span>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, inject, nextTick, onBeforeUnmount, onMounted, ref, unref, useAttrs, useSlots, watch } from 'vue';
import ScrollViewer from './ScrollViewer.vue';
import { resolveXamlHandler, resolveXamlValue } from './xamlRuntime';

defineOptions({ name: 'Flyout' });

const props = defineProps({
  Content: { default: undefined },
  IsOpen: { type: [Boolean, String], default: undefined },
  Placement: { type: String, default: 'Bottom' },
  ShowMode: { type: String, default: 'Standard' },
  IsLightDismissEnabled: { type: [Boolean, String], default: true },
  LightDismissOverlayMode: { type: String, default: 'Auto' },
  Theme: { type: String, default: '' }
});

const emit = defineEmits(['update:IsOpen', 'Opened', 'Closed', 'Opening', 'Closing']);

const anchorRef = ref<HTMLElement | null>(null);
const buttonFlyoutAnchor = inject<{ value: HTMLElement | null } | null>('buttonFlyoutAnchor', null);
const flyoutRef = ref<HTMLElement | null>(null);
const localIsOpen = ref(false);
const position = ref({ top: 0, left: 0, maxHeight: 0, minWidth: 0 });
const openDirection = ref('down');
const teleportTarget = ref<string | HTMLElement>('body');
const attrs = useAttrs();
const slots = useSlots();
const inheritedTheme = inject<string | { value?: string } | null>('winuiTheme', null);
const instance = getCurrentInstance();
const resolve = (value: unknown) => resolveXamlValue(value, instance);

const resolvedIsOpen = computed(() => {
  const value = resolve(props.IsOpen);
  return value === undefined || value === null ? undefined : value === true || value === 'True';
});
const effectiveIsOpen = computed(() => localIsOpen.value);
const resolvedContent = computed(() => resolve(props.Content));
const themeClass = computed(() => {
  const explicit = String(resolve(props.Theme) || '').toLowerCase();
  const provided = String(unref(inheritedTheme as never) || '').toLowerCase();
  const theme = explicit === 'light' || explicit === 'dark' ? explicit : provided;
  return theme === 'light' || theme === 'dark' ? `win-theme-scope theme-${theme}` : '';
});
const requestedPlacement = computed(() => String(resolve(props.Placement) || 'Bottom'));
const lightDismissEnabled = computed(() => resolve(props.IsLightDismissEnabled) !== false);

const flyoutStyle = computed(() => ({
  top: `${position.value.top}px`,
  left: `${position.value.left}px`,
  minWidth: position.value.minWidth ? `${position.value.minWidth}px` : undefined,
  maxHeight: position.value.maxHeight ? `${position.value.maxHeight}px` : undefined
}));

const setOpen = (value: boolean) => {
  if (value === effectiveIsOpen.value) return;
  emit('update:IsOpen', value);
  const binding = typeof props.IsOpen === 'string'
    ? props.IsOpen.match(/^\{(?:x:Bind|Binding)\s+([\s\S]*?)\}$/)
    : null;
  if (binding) {
    const expression = binding[1]
      .replace(/,\s*Mode\s*=\s*(?:OneWay|TwoWay|OneTime)\s*$/, '')
      .trim();
    resolveXamlHandler(`${expression} = $event`, instance)?.(value);
  }
  localIsOpen.value = value;
};

const updatePosition = async () => {
  const anchor = buttonFlyoutAnchor?.value || anchorRef.value;
  if (!anchor) return;
  const rect = anchor.getBoundingClientRect();
  const margin = 8;
  const gap = 6;
  const placement = requestedPlacement.value;
  const preferTop = placement.startsWith('Top');
  const preferCenter = placement === 'Top' || placement === 'Bottom';
  const preferEnd = placement.endsWith('EdgeAlignedRight');

  let top = preferTop ? rect.top - gap : rect.bottom + gap;
  let left = rect.left;
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
};

const hide = () => {
  if (!effectiveIsOpen.value) return;
  setOpen(false);
};

const toggle = () => {
  if (effectiveIsOpen.value) hide();
  else void show();
};

const flyoutController = {
  ShowAt: () => { void show(); },
  Hide: hide,
  Toggle: toggle,
  get IsOpen() { return effectiveIsOpen.value; }
};

const onLightDismiss = () => {
  if (lightDismissEnabled.value) hide();
};
const onGlobalHide = () => hide();

watch(resolvedIsOpen, (value) => {
  if (value !== undefined) localIsOpen.value = value;
}, { immediate: true, flush: 'sync' });

let transitionVersion = 0;
watch(effectiveIsOpen, async (value, previous) => {
  if (value === previous) return;
  const version = ++transitionVersion;
  emit(value ? 'Opening' : 'Closing');
  resolveXamlHandler(value ? attrs.Opening : attrs.Closing, instance)?.();
  if (value) {
    await nextTick();
    await updatePosition();
    if (version === transitionVersion && effectiveIsOpen.value) {
      emit('Opened');
      resolveXamlHandler(attrs.Opened, instance)?.();
    }
  } else {
    await nextTick();
    if (version === transitionVersion && !effectiveIsOpen.value) {
      emit('Closed');
      resolveXamlHandler(attrs.Closed, instance)?.();
    }
  }
}, { flush: 'sync' });

const onViewportChanged = () => {
  if (effectiveIsOpen.value) void updatePosition();
};
const onWindowBlur = () => {
  if (effectiveIsOpen.value && lightDismissEnabled.value) hide();
};
const onKeyDown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape' || !effectiveIsOpen.value) return;
  event.preventDefault();
  hide();
};

const onFullscreenChanged = () => {
  teleportTarget.value = (document.fullscreenElement as HTMLElement | null) || 'body';
  if (effectiveIsOpen.value) void updatePosition();
};

onMounted(() => {
  teleportTarget.value = (document.fullscreenElement as HTMLElement | null) || 'body';
  window.addEventListener('resize', onViewportChanged);
  window.addEventListener('scroll', onViewportChanged, true);
  window.addEventListener('blur', onWindowBlur);
  document.addEventListener('keydown', onKeyDown, true);
  document.addEventListener('fullscreenchange', onFullscreenChanged);
  window.addEventListener('winui-flyout-hide', onGlobalHide);
  const button = buttonFlyoutAnchor?.value;
  if (!slots.trigger) button?.addEventListener('click', toggle);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onViewportChanged);
  window.removeEventListener('scroll', onViewportChanged, true);
  window.removeEventListener('blur', onWindowBlur);
  document.removeEventListener('keydown', onKeyDown, true);
  document.removeEventListener('fullscreenchange', onFullscreenChanged);
  window.removeEventListener('winui-flyout-hide', onGlobalHide);
  if (!slots.trigger) buttonFlyoutAnchor?.value?.removeEventListener('click', toggle);
});

defineExpose({ show, hide, toggle, IsOpen: effectiveIsOpen });
</script>

<style>
.flyout-anchor {
  display: inline-flex;
}

.flyout-dismiss-layer {
  position: fixed;
  inset: 0;
  z-index: 989;
}

.flyout {
  position: fixed;
  z-index: 990;
  min-width: var(--FlyoutThemeMinWidth, 96px);
  max-width: min(var(--FlyoutThemeMaxWidth, 456px), calc(100vw - 16px));
  min-height: var(--FlyoutThemeMinHeight, 40px);
  max-height: min(var(--FlyoutThemeMaxHeight, 758px), calc(100vh - 16px));
  /* DefaultFlyoutPresenterStyle: FlyoutContentPadding = 16,15,16,17. */
  padding: var(--FlyoutContentPadding, 15px 16px 17px 16px);
  overflow: hidden;
  color: var(--TextFillColorPrimaryBrush, var(--text-primary));
  --win-acrylic-fill: var(--AcrylicInAppFillColorDefaultBrush, var(--flyout-background, var(--flyout-bg)));
  isolation: isolate;
  background: var(--AcrylicInAppFillColorDefaultBrush, var(--flyout-background, var(--flyout-bg)));
  border: var(--FlyoutBorderThemeThickness, 1px) solid var(--SurfaceStrokeColorFlyoutBrush, var(--surface-stroke-color-flyout, var(--flyout-border)));
  border-radius: var(--OverlayCornerRadius, 8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  --flyout-shadow-bleed: 32px;
  -webkit-backdrop-filter: var(--flyout-backdrop);
  backdrop-filter: var(--flyout-backdrop);
}

.flyout-scroll {
  width: 100%;
  max-height: inherit;
}

.flyout-scroll :deep(.win-scroll-viewer-viewport) {
  height: auto;
  max-height: inherit;
}

.flyout.opens-down {
  animation: flyout-open-down 250ms cubic-bezier(0.1, 0.9, 0.2, 1) both, flyout-opacity 83ms linear both;
}

.flyout.opens-up {
  animation: flyout-open-up 250ms cubic-bezier(0.1, 0.9, 0.2, 1) both, flyout-opacity 83ms linear both;
}

.flyout.flyout-down-leave-active,
.flyout.flyout-up-leave-active {
  animation: flyout-exit 167ms cubic-bezier(0.7, 0, 1, 0.5) both;
  pointer-events: none;
}

@keyframes flyout-exit {
  from {
    opacity: 1;
    transform: translateY(0);
  }

  to {
    opacity: 0;
    transform: translateY(-4px);
  }
}

@keyframes flyout-opacity {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes flyout-open-down {
  from {
    clip-path: inset(0 0 calc(100% - 1px) 0);
    transform: translateY(-16px);
  }
  to {
    clip-path: inset(calc(-1 * var(--flyout-shadow-bleed)));
    transform: translateY(0);
  }
}

@keyframes flyout-open-up {
  from {
    clip-path: inset(calc(100% - 1px) 0 0 0);
    transform: translateY(16px);
  }
  to {
    clip-path: inset(calc(-1 * var(--flyout-shadow-bleed)));
    transform: translateY(0);
  }
}
</style>
