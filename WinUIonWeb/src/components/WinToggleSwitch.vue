<template>
  <div class="win-switch-root" :style="rootStyle">
    <WinTextBlock v-if="Header" class="win-switch-header" :Text="Header" />
    <div class="win-switch-wrap" :class="{ 'is-disabled': !IsEnabledResolved }" @click="onWrapClick">
    <div class="win-switch"
         :class="{ 'is-on': isOnValue, 'dragging': isDragging, 'is-pressed': isPressed, 'is-disabled': !IsEnabledResolved }"
         @pointerdown.stop="onDown" @pointermove="onMove" @pointerup="onUp" @pointercancel="onUp">
      <div class="track"></div>
      <div class="knob" :style="knobStyle">
        <div class="thumb"></div>
      </div>
    </div>
      <WinTextBlock v-if="$slots.default" class="win-switch-label"><slot></slot></WinTextBlock>
      <WinTextBlock v-else class="win-switch-label" :Text="isOnValue ? resolvedOnContent : resolvedOffContent" />
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from './i18n/index';
import WinTextBlock from './WinTextBlock.vue';

const { t } = useI18n();
const props = defineProps({
  IsOn: { type: Boolean, default: undefined },
  Header: { type: String, default: '' },
  OnContent: { type: String, default: '' },
  OffContent: { type: String, default: '' },
  IsEnabled: { type: Boolean, default: true },
  Width: { type: [String, Number], default: '' },
  modelValue: { type: Boolean, default: undefined },
  onContent: { type: String, default: '' },
  offContent: { type: String, default: '' },
  disabled: Boolean
});
const emit = defineEmits(['update:IsOn', 'Toggled', 'update:modelValue']);
const isDragging = ref(false);
const isPressed = ref(false);
const currentTx = ref(0);
const internalIsOn = ref(props.IsOn ?? props.modelValue ?? false);
const isOnValue = computed(() => props.IsOn ?? props.modelValue ?? internalIsOn.value);
const IsEnabledResolved = computed(() => props.IsEnabled && !props.disabled);
const resolvedOnContent = computed(() => props.OnContent || props.onContent || t('text.on'));
const resolvedOffContent = computed(() => props.OffContent || props.offContent || t('text.off'));
const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) return `${Number(value.trim())}px`;
  return typeof value === 'number' ? `${value}px` : value;
};
const rootStyle = computed(() => props.Width !== '' ? { width: cssLength(props.Width) } : {});
let startX = 0, initialChecked = false, moved = false, didToggle = false;
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

const onWrapClick = () => {
  if (!IsEnabledResolved.value) return;
  if (didToggle) { didToggle = false; return; }
  setIsOn(!isOnValue.value);
};

const setIsOn = (value) => {
  internalIsOn.value = value;
  emit('update:IsOn', value);
  emit('update:modelValue', value);
  emit('Toggled', { IsOn: value });
};

const onDown = (e) => {
  if (!IsEnabledResolved.value) return;
  isPressed.value = true; isDragging.value = true; moved = false; didToggle = false;
  startX = e.clientX; initialChecked = isOnValue.value;
  currentTx.value = initialChecked ? maxKnobTranslation : minKnobTranslation;
  e.currentTarget.setPointerCapture(e.pointerId);
};
const onMove = (e) => {
  if (!isDragging.value) return;
  const delta = e.clientX - startX;
  if (Math.abs(delta) > movementThreshold) moved = true;
  const nextTranslation = initialChecked ? maxKnobTranslation + delta : minKnobTranslation + delta;
  currentTx.value = Math.max(minKnobTranslation, Math.min(maxKnobTranslation, nextTranslation));
};
const onUp = (e) => {
  if (!isDragging.value) return;
  isDragging.value = false; isPressed.value = false;
  if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
    e.currentTarget.releasePointerCapture(e.pointerId);
  }
  didToggle = true;
  if (moved) {
    const halfOfTranslationRange = (maxKnobTranslation - minKnobTranslation) / 2;
    const shouldToggle = initialChecked
      ? currentTx.value <= halfOfTranslationRange
      : currentTx.value >= halfOfTranslationRange;
    setIsOn(shouldToggle ? !initialChecked : initialChecked);
  }
  else setIsOn(!initialChecked);
};
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
