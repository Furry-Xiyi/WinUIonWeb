<template>
  <span class="popup-anchor" ref="anchorRef">
    <slot name="trigger"></slot>
    <Teleport to="body">
      <Transition name="popup">
        <div
          v-if="effectiveIsOpen"
          ref="popupRef"
          class="popup"
          :class="themeClass"
          :style="popupStyle"
          @pointerdown.stop>
          <slot></slot>
        </div>
      </Transition>
    </Teleport>
  </span>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, inject, nextTick, onBeforeUnmount, onMounted, ref, unref, useAttrs, watch } from 'vue';
import { resolveXamlHandler, resolveXamlValue } from './xamlRuntime';

const props = defineProps({
  IsOpen: { type: [Boolean, String], default: undefined },
  HorizontalOffset: { type: [Number, String], default: 0 },
  VerticalOffset: { type: [Number, String], default: 0 },
  IsLightDismissEnabled: { type: [Boolean, String], default: true },
  Theme: { type: String, default: '' }
});

defineOptions({ name: 'Popup' });
const emit = defineEmits(['update:IsOpen', 'Opened', 'Closed']);

const anchorRef = ref(null);
const popupRef = ref(null);
const localIsOpen = ref(false);
const position = ref({ top: 0, left: 0 });
const attrs = useAttrs();
const inheritedTheme = inject<string | { value?: string } | null>('winuiTheme', null);
const instance = getCurrentInstance();
const resolve = (value: unknown) => resolveXamlValue(value, instance);

const resolvedIsOpen = computed(() => {
  const value = resolve(props.IsOpen);
  return value === undefined || value === null ? undefined : value === true || value === 'True';
});
const effectiveIsOpen = computed(() => localIsOpen.value);
const HorizontalOffset = computed(() => Number(resolve(props.HorizontalOffset) ?? 0));
const VerticalOffset = computed(() => Number(resolve(props.VerticalOffset) ?? 0));
const IsLightDismissEnabled = computed(() => resolve(props.IsLightDismissEnabled) !== false);
const themeClass = computed(() => {
  const explicit = String(resolve(props.Theme) || '').toLowerCase();
  const provided = String(unref(inheritedTheme as never) || '').toLowerCase();
  const theme = explicit === 'light' || explicit === 'dark' ? explicit : provided;
  return theme === 'light' || theme === 'dark' ? `win-theme-scope theme-${theme}` : '';
});
const popupStyle = computed(() => ({
  top: `${position.value.top}px`,
  left: `${position.value.left}px`
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
  await nextTick();
  const anchor = anchorRef.value;
  const popup = popupRef.value;
  if (!anchor || !popup) return;
  const trigger = anchor.querySelector('[data-popup-trigger]') || anchor.firstElementChild || anchor.parentElement || anchor;
  const rect = trigger.getBoundingClientRect();
  const popupRect = popup.getBoundingClientRect();
  const margin = 8;
  const left = Math.max(margin, Math.min(window.innerWidth - popupRect.width - margin, rect.left + HorizontalOffset.value));
  const top = Math.max(margin, Math.min(window.innerHeight - popupRect.height - margin, rect.top + VerticalOffset.value));
  position.value = { top, left };
};

const open = async () => {
  setOpen(true);
  await updatePosition();
};

const close = () => {
  if (effectiveIsOpen.value) setOpen(false);
};

const onDocumentPointerDown = (event: PointerEvent) => {
  if (!effectiveIsOpen.value || !IsLightDismissEnabled.value) return;
  const target = event.target;
  if (target instanceof Node && (popupRef.value?.contains(target) || anchorRef.value?.contains(target))) return;
  close();
};

watch(resolvedIsOpen, (value) => {
  if (value !== undefined) localIsOpen.value = value;
}, { immediate: true, flush: 'sync' });

let transitionVersion = 0;
watch(effectiveIsOpen, async (value, previous) => {
  if (value === previous) return;
  const version = ++transitionVersion;
  if (value) {
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

watch([HorizontalOffset, VerticalOffset], () => {
  if (effectiveIsOpen.value) void updatePosition();
});

onMounted(() => document.addEventListener('pointerdown', onDocumentPointerDown, true));
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocumentPointerDown, true));

defineExpose({ open, close });
</script>

<style>
.popup-anchor {
  display: inline-flex;
}

.popup {
  position: fixed;
  z-index: 950;
  /* Popup has no presenter chrome in WinUI; its child supplies the visual. */
  color: var(--TextFillColorPrimaryBrush, var(--text-primary));
}

.popup-enter-active {
  animation: popup-enter 250ms cubic-bezier(0.1, 0.9, 0.2, 1) both;
}

.popup-leave-active {
  animation: popup-exit 167ms cubic-bezier(0.7, 0, 1, 0.5) both;
}

@keyframes popup-enter {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes popup-exit {
  from { opacity: 1; }
  to { opacity: 0; }
}
</style>
