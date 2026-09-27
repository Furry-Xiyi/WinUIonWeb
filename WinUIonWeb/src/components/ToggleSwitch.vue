<template>
  <div class="win-switch-root" :style="rootStyle">
    <div v-if="resolvedHeader" :id="headerId" class="win-switch-header">
      <TextBlock Text="{x:Bind ToggleSwitchHeader}" />
    </div>
    <div
      ref="wrapRef"
      class="win-switch-wrap"
      :class="{ 'is-disabled': !IsEnabledResolved }"
      role="switch"
      :tabindex="IsEnabledResolved ? 0 : -1"
      :aria-checked="isOnValue ? 'true' : 'false'"
      :aria-disabled="IsEnabledResolved ? undefined : 'true'"
      :aria-labelledby="resolvedHeader ? headerId : undefined"
      :aria-label="resolvedHeader ? undefined : String(ToggleSwitchContent)"
      @pointerdown="onWrapPointerDown"
      @click="onWrapClick"
      @keydown="onKeyDown"
      @keyup="onKeyUp"
      @blur="onBlur">
    <div class="win-switch"
         :class="{ 'is-on': isOnValue, 'dragging': isDragging, 'is-pressed': isPressed, 'is-disabled': !IsEnabledResolved }"
         @pointerdown.stop="onDown" @pointermove="onMove" @pointerup="onUp" @pointercancel="onCancel" @lostpointercapture="onLostPointerCapture">
      <div class="track"></div>
      <div class="knob" :style="knobStyle">
        <div class="thumb"></div>
      </div>
    </div>
      <TextBlock v-if="$slots.default" class="win-switch-label"><slot></slot></TextBlock>
      <TextBlock v-else class="win-switch-label" Text="{x:Bind ToggleSwitchContent}" />
    </div>
  </div>
</template>
<script setup>
import { ref, computed, getCurrentInstance, provide, useAttrs, watch, onBeforeUnmount } from 'vue';
import { useI18n } from './i18n/index';
import TextBlock from './TextBlock.vue';
import { resolveXamlHandler, resolveXamlValue, updateXamlBinding, xamlScopeKey } from './xamlRuntime';

const { t } = useI18n();
const instance = getCurrentInstance();
const attrs = useAttrs();
const props = defineProps({
  IsOn: { type: [Boolean, String], default: undefined },
  Header: { type: [String, Number], default: '' },
  OnContent: { type: [String, Number], default: '' },
  OffContent: { type: [String, Number], default: '' },
  IsEnabled: { type: [Boolean, String], default: true },
  FlowDirection: { type: String, default: '' },
  Width: { type: [String, Number], default: '' },
  MinWidth: { type: [String, Number], default: '' },
  Margin: { type: [String, Number], default: '' },
  modelValue: { type: Boolean, default: undefined },
  onContent: { type: String, default: '' },
  offContent: { type: String, default: '' },
  disabled: Boolean
});
const emit = defineEmits(['update:IsOn', 'Toggled', 'update:modelValue']);
const isDragging = ref(false);
const isPressed = ref(false);
const currentTx = ref(0);
const wrapRef = ref(null);
const resolvedIsOn = computed(() => resolveXamlValue(props.IsOn, instance));
const resolvedModelValue = computed(() => resolveXamlValue(props.modelValue, instance));
const internalIsOn = ref(resolvedIsOn.value ?? resolvedModelValue.value ?? false);
const isOnValue = computed(() => internalIsOn.value);
const sourceIsEnabled = computed(() => resolveXamlValue(props.IsEnabled, instance) !== false && !props.disabled);
const localIsEnabled = ref(undefined);
const IsEnabledResolved = computed(() => localIsEnabled.value ?? sourceIsEnabled.value);
watch([resolvedIsOn, resolvedModelValue], ([value, modelValue]) => {
  internalIsOn.value = value ?? modelValue ?? internalIsOn.value;
});
watch(sourceIsEnabled, () => { localIsEnabled.value = undefined; });
const resolvedHeader = computed(() => resolveXamlValue(props.Header, instance));
const resolvedOnContent = computed(() => resolveXamlValue(props.OnContent || props.onContent || t('text.on'), instance));
const resolvedOffContent = computed(() => resolveXamlValue(props.OffContent || props.offContent || t('text.off'), instance));
const ToggleSwitchHeader = computed(() => resolvedHeader.value);
const ToggleSwitchContent = computed(() => isOnValue.value ? resolvedOnContent.value : resolvedOffContent.value);
const headerId = `toggle-switch-header-${instance?.uid ?? 'control'}`;
const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) return `${Number(value.trim())}px`;
  return typeof value === 'number' ? `${value}px` : value;
};
const rootStyle = computed(() => {
  const margin = String(resolveXamlValue(props.Margin, instance) ?? '').split(',').map((part) => cssLength(part.trim()));
  return {
    width: props.Width !== '' ? cssLength(resolveXamlValue(props.Width, instance)) : undefined,
    minWidth: props.MinWidth !== '' ? cssLength(resolveXamlValue(props.MinWidth, instance)) : undefined,
    margin: props.Margin !== '' ? margin.length === 4 ? `${margin[1]} ${margin[2]} ${margin[3]} ${margin[0]}` : margin.length === 2 ? `${margin[1]} ${margin[0]}` : margin[0] : undefined
  };
});
let startX = 0, initialChecked = false, moved = false, didToggle = false;
let activePointerId = null;
let pointerTarget = null;
let handledKey = null;
const minKnobTranslation = 0;
const maxKnobTranslation = 20;
const movementThreshold = 3;

watch(isOnValue, v => {
  if (!isDragging.value) currentTx.value = v ? maxKnobTranslation : minKnobTranslation;
}, { immediate: true });

const knobStyle = computed(() => {
  if (isDragging.value || isPressed.value) return { '--tx': currentTx.value + 'px' };
  return {};
});

const onWrapPointerDown = () => {
  didToggle = false;
  if (IsEnabledResolved.value) wrapRef.value?.focus({ preventScroll: true });
};

const onWrapClick = () => {
  if (!IsEnabledResolved.value) return;
  if (didToggle) { didToggle = false; return; }
  setIsOn(!isOnValue.value);
};

const setIsOn = (value, programmatic = false) => {
  value = Boolean(value);
  if ((!programmatic && !IsEnabledResolved.value) || value === Boolean(isOnValue.value)) return;
  internalIsOn.value = value;
  emit('update:IsOn', value);
  updateXamlBinding(props.IsOn, value, instance);
  emit('update:modelValue', value);
  const args = { IsOn: value };
  const toggled = instance?.vnode.props?.onToggled;
  if (typeof toggled === 'function') toggled(args);
  else if (Array.isArray(toggled)) toggled.forEach((handler) => handler(args));
  else resolveXamlHandler(attrs.Toggled, instance)?.(args);
};

// x:Name references expose the dependency property itself so official
// bindings such as `IsLightDismissEnabledToggleSwitch.IsOn` stay writable.
const exposedIsOn = computed({
  get: () => Boolean(isOnValue.value),
  set: (value) => setIsOn(value, true)
});
const exposedIsEnabled = computed({
  get: () => Boolean(IsEnabledResolved.value),
  set: (value) => {
    localIsEnabled.value = Boolean(value);
    updateXamlBinding(props.IsEnabled, Boolean(value), instance);
  }
});
defineExpose({ IsOn: exposedIsOn, IsEnabled: exposedIsEnabled, Element: wrapRef });

provide(xamlScopeKey, { ToggleSwitchHeader, ToggleSwitchContent });

const onDown = (e) => {
  if (!IsEnabledResolved.value || activePointerId !== null || e.isPrimary === false || (e.pointerType === 'mouse' && e.button !== 0)) return;
  handledKey = null;
  wrapRef.value?.focus({ preventScroll: true });
  isPressed.value = true; isDragging.value = true; moved = false; didToggle = false;
  activePointerId = e.pointerId;
  pointerTarget = e.currentTarget;
  startX = e.clientX; initialChecked = Boolean(isOnValue.value);
  currentTx.value = initialChecked ? maxKnobTranslation : minKnobTranslation;
  try { pointerTarget.setPointerCapture?.(e.pointerId); } catch { /* The pointer may already have been canceled. */ }
};
const onMove = (e) => {
  if (!isDragging.value || e.pointerId !== activePointerId) return;
  const delta = e.clientX - startX;
  if (Math.abs(delta) > movementThreshold) moved = true;
  const nextTranslation = initialChecked ? maxKnobTranslation + delta : minKnobTranslation + delta;
  currentTx.value = Math.max(minKnobTranslation, Math.min(maxKnobTranslation, nextTranslation));
};
const onUp = (e) => {
  if (!isDragging.value || e.pointerId !== activePointerId) return;
  const wasMoved = moved;
  const wasChecked = initialChecked;
  const translation = currentTx.value;
  clearPointerState();
  didToggle = true;
  if (wasMoved) {
    const halfOfTranslationRange = (maxKnobTranslation - minKnobTranslation) / 2;
    const shouldToggle = wasChecked ? translation <= halfOfTranslationRange : translation >= halfOfTranslationRange;
    setIsOn(shouldToggle ? !wasChecked : wasChecked);
  }
  else setIsOn(!wasChecked);
};

const clearPointerState = () => {
  const target = pointerTarget;
  const pointerId = activePointerId;
  activePointerId = null;
  pointerTarget = null;
  isDragging.value = false;
  isPressed.value = false;
  currentTx.value = isOnValue.value ? maxKnobTranslation : minKnobTranslation;
  moved = false;
  if (target && pointerId !== null && target.hasPointerCapture?.(pointerId)) {
    try { target.releasePointerCapture(pointerId); } catch { /* Capture may be gone after pointercancel. */ }
  }
};

const onCancel = (e) => {
  if (!isDragging.value || e.pointerId !== activePointerId) return;
  clearPointerState();
  didToggle = true;
};

const onLostPointerCapture = (e) => {
  if (!isDragging.value || e.pointerId !== activePointerId) return;
  clearPointerState();
  didToggle = true;
};

const keyName = (e) => e.key === 'Spacebar' ? ' ' : e.key;
const handledKeys = new Set([' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']);
const onKeyDown = (e) => {
  const key = keyName(e);
  if (!IsEnabledResolved.value || !handledKeys.has(key)) return;
  e.preventDefault();
  if (e.repeat || handledKey !== null || isDragging.value) return;
  handledKey = key;
  didToggle = false;
};

const onKeyUp = (e) => {
  const key = keyName(e);
  if (!handledKeys.has(key)) return;
  e.preventDefault();
  const accepted = key === handledKey;
  handledKey = null;
  if (!accepted || !IsEnabledResolved.value || isDragging.value) return;
  if (key === ' ') setIsOn(!isOnValue.value);
  else {
    const flowDirection = String(resolveXamlValue(props.FlowDirection, instance));
    const isRtl = flowDirection === 'RightToLeft' || (!flowDirection && wrapRef.value && getComputedStyle(wrapRef.value).direction === 'rtl');
    setIsOn(key === 'ArrowUp' || key === 'End' || (isRtl ? key === 'ArrowLeft' : key === 'ArrowRight'));
  }
};

const onBlur = () => {
  handledKey = null;
  if (!isDragging.value) isPressed.value = false;
};

watch(IsEnabledResolved, enabled => {
  if (enabled) return;
  handledKey = null;
  clearPointerState();
  didToggle = true;
});

onBeforeUnmount(() => {
  clearPointerState();
  handledKey = null;
});
</script>
<style>
  .win-switch-root {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 154px;
  }

  .win-switch-header {
    margin: 0 0 4px;
  }

  .win-switch {
    position: relative;
    display: inline-flex;
    align-items: center;
    --tx: 0px;
    width: 40px;
    height: 20px;
    border-radius: 10px;
    cursor: pointer;
    touch-action: none;
    flex-shrink: 0;
  }

    .win-switch .track {
      position: absolute;
      inset: 0;
      border-radius: 10px;
      border: 1px solid var(--toggle-border);
      background-color: var(--control-alt-fill-color-secondary, var(--subtle-secondary));
      transition: all var(--fast-duration) var(--fast-out-slow-in);
    }

    .win-switch:hover .track {
      border-color: var(--text-primary);
      background-color: var(--control-alt-fill-color-tertiary, var(--subtle-tertiary));
    }

    .win-switch.is-pressed:not(.is-on) .track,
    .win-switch.dragging:not(.is-on) .track {
      border-color: var(--toggle-border);
      background-color: var(--control-alt-fill-color-quarternary, var(--subtle-pressed));
    }

    .win-switch.is-on .track {
      background-color: var(--accent-base);
      border-color: transparent;
    }

    .win-switch.is-on:hover .track {
      background-color: var(--accent-hover);
    }

    .win-switch.is-on.is-pressed .track,
    .win-switch.is-on.dragging .track {
      background-color: var(--accent-pressed);
    }

    .win-switch .knob {
      position: absolute;
      top: 0;
      left: 0;
      width: 20px;
      height: 20px;
      transform: translateX(var(--tx));
      transition: transform var(--fast-duration) var(--fast-out-slow-in);
    }

    .win-switch.is-on .knob {
      --tx: 20px;
    }

    .win-switch .thumb {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 12px;
      height: 12px;
      border-radius: 6px;
      background-color: var(--toggle-thumb);
      transform: translate(-50%, -50%) translateX(-0.5px);
      transition: width var(--fast-duration) var(--fast-out-slow-in), height var(--fast-duration) var(--fast-out-slow-in), background-color var(--fast-duration);
    }

    .win-switch.is-on .thumb {
      background-color: var(--toggle-on-thumb);
      transform: translate(-50%, -50%) translateX(-0.5px);
    }

    .win-switch:hover .thumb {
      width: 14px;
      height: 14px;
      border-radius: 7px;
      background-color: var(--toggle-thumb-hover);
    }

    .win-switch:hover.is-on .thumb {
      background-color: var(--toggle-on-thumb);
    }

    .win-switch.is-pressed .knob,
    .win-switch.dragging .knob {
      transition: none;
    }

    .win-switch.is-pressed:not(.is-on) .thumb,
    .win-switch.dragging:not(.is-on) .thumb {
      width: 17px;
      height: 14px;
      border-radius: 7px;
      background-color: var(--toggle-thumb-hover);
      /* WinUI Pressed: SwitchKnobOff is left-aligned inside the 20px knob with Margin="3,0,0,0". */
      transform: translate(-50%, -50%) translateX(1.5px);
      transition: none;
    }

    .win-switch.is-pressed.is-on .thumb,
    .win-switch.dragging.is-on .thumb {
      width: 17px;
      height: 14px;
      border-radius: 7px;
      background-color: var(--toggle-on-thumb);
      /* WinUI Pressed: SwitchKnobOn is right-aligned inside the 20px knob with Margin="0,0,3,0". */
      transform: translate(-50%, -50%) translateX(-1.5px);
      transition: none;
    }

  .win-switch-wrap {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    min-height: 40px;
    cursor: pointer;
    touch-action: none;
    user-select: none;
  }

  .win-switch-wrap:focus-visible {
    outline: 2px solid var(--FocusVisualPrimaryBrush, var(--text-primary));
    outline-offset: 2px;
  }

  .win-switch-wrap:not(.is-disabled):hover .win-switch:not(.is-on) .track {
    border-color: var(--text-primary);
  }

  .win-switch-wrap:not(.is-disabled):hover .win-switch .thumb {
    width: 14px;
    height: 14px;
    border-radius: 7px;
    background-color: var(--toggle-thumb-hover);
  }

  .win-switch-wrap:not(.is-disabled):hover .win-switch.is-on .track {
    background-color: var(--accent-hover);
  }

  .win-switch-wrap:not(.is-disabled):hover .win-switch.is-on .thumb {
    background-color: var(--toggle-on-thumb);
  }

  .win-switch-wrap:not(.is-disabled):active .win-switch:not(.is-on) .thumb {
    width: 17px;
    height: 14px;
    border-radius: 7px;
    background-color: var(--toggle-thumb-hover);
    transform: translate(-50%, -50%) translateX(1.5px);
    transition: none;
  }

  .win-switch-wrap:not(.is-disabled):active .win-switch.is-on .thumb {
    width: 17px;
    height: 14px;
    border-radius: 7px;
    background-color: var(--toggle-on-thumb);
    transform: translate(-50%, -50%) translateX(-1.5px);
    transition: none;
  }

  .win-switch-wrap:not(.is-disabled):active .win-switch.is-on .track {
    background-color: var(--accent-pressed);
  }

  .win-switch-label {
    color: var(--text-primary);
    user-select: none;
    min-width: 20px;
    cursor: pointer;
  }

  /* --- 禁用状态 --- */
  .win-switch-wrap.is-disabled {
    cursor: default;
  }

    .win-switch-wrap.is-disabled .win-switch-label {
      color: var(--text-disabled);
      cursor: default;
    }

  .win-switch.is-disabled {
    cursor: default;
  }

    .win-switch.is-disabled .track {
      border-color: var(--ctrl-strong-stroke-disabled);
      background-color: transparent;
    }

    .win-switch.is-disabled .thumb {
      background-color: var(--ctrl-strong-stroke-disabled);
    }

    .win-switch.is-disabled.is-on .track {
      background-color: var(--accent-fill-disabled);
      border-color: transparent;
    }

    .win-switch.is-disabled.is-on .thumb {
      background-color: var(--text-disabled);
    }

    .win-switch.is-disabled:hover .track {
      border-color: var(--ctrl-strong-stroke-disabled);
    }

    .win-switch.is-disabled:hover .thumb {
      width: 12px;
      height: 12px;
      border-radius: 6px;
      background-color: var(--ctrl-strong-stroke-disabled);
    }

    .win-switch.is-disabled:hover.is-on .track {
      background-color: var(--accent-fill-disabled);
    }

    .win-switch.is-disabled:hover.is-on .thumb {
      background-color: var(--text-disabled);
    }
</style>
