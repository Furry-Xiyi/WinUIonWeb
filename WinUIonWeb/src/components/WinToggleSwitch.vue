<template>
  <div class="win-switch-wrap" :class="{ 'is-disabled': disabled }" @click="onWrapClick">
    <div class="win-switch"
         :class="{ 'is-on': modelValue, 'dragging': isDragging, 'is-pressed': isPressed, 'is-disabled': disabled }"
         @pointerdown.stop="onDown" @pointermove="onMove" @pointerup="onUp" @pointercancel="onUp">
      <div class="track"></div>
      <div class="thumb" :style="thumbStyle"></div>
    </div>
    <span v-if="$slots.default" class="win-switch-label"><slot></slot></span>
    <span v-else class="win-switch-label">{{ modelValue ? onContent : offContent }}</span>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue';
const props = defineProps({
  modelValue: Boolean,
  onContent: { type: String, default: 'On' },
  offContent: { type: String, default: 'Off' },
  disabled: Boolean
});
const emit = defineEmits(['update:modelValue']);
const isDragging = ref(false);
const isPressed = ref(false);
const currentTx = ref(0);
let startX = 0, initialChecked = false, moved = false, didToggle = false;

watch(() => props.modelValue, v => {
  if (!isDragging.value) currentTx.value = v ? 20 : 0;
}, { immediate: true });

const thumbStyle = computed(() => {
  if (isDragging.value || isPressed.value) return { '--tx': currentTx.value + 'px' };
  return {};
});

const onWrapClick = () => {
  if (props.disabled) return;
  if (didToggle) { didToggle = false; return; }
  emit('update:modelValue', !props.modelValue);
};

const onDown = (e) => {
  if (props.disabled) return;
  isPressed.value = true; isDragging.value = true; moved = false; didToggle = false;
  startX = e.clientX; initialChecked = props.modelValue;
  currentTx.value = initialChecked ? 16 : 0;
  e.currentTarget.setPointerCapture(e.pointerId);
};
const onMove = (e) => {
  if (!isDragging.value) return;
  moved = true;
  const delta = e.clientX - startX;
  currentTx.value = Math.max(0, Math.min(16, initialChecked ? 16 + delta : delta));
};
const onUp = (e) => {
  if (!isDragging.value) return;
  isDragging.value = false; isPressed.value = false;
  e.currentTarget.releasePointerCapture(e.pointerId);
  didToggle = true;
  if (moved && Math.abs(e.clientX - startX) > 3) emit('update:modelValue', currentTx.value > 8);
  else emit('update:modelValue', !initialChecked);
};
</script>
<style>
  .win-switch {
    position: relative;
    display: inline-flex;
    align-items: center;
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
      background-color: transparent;
      transition: all var(--fast-duration) var(--fast-out-slow-in);
    }

    .win-switch:hover .track {
      border-color: var(--text-primary);
    }

    .win-switch.is-on .track {
      background-color: var(--accent-base);
      border-color: transparent;
    }

    .win-switch.is-on:hover .track {
      background-color: var(--accent-hover);
    }

    .win-switch .thumb {
      position: absolute;
      top: 50%;
      left: 4px;
      width: 12px;
      height: 12px;
      border-radius: 6px;
      background-color: var(--toggle-thumb);
      transform: translateY(-50%) translateX(var(--tx, 0px)) scale(var(--scale, 1));
      transition: background-color var(--fast-duration), transform 0.2s var(--fast-out-slow-in);
    }

    .win-switch.is-on .thumb {
      --tx: 20px;
      background-color: var(--toggle-on-thumb);
    }

    .win-switch:hover .thumb {
      --scale: 1.167;
      background-color: var(--toggle-thumb-hover);
    }

    .win-switch:hover.is-on .thumb {
      --tx: 20px;
      --scale: 1.167;
      background-color: var(--toggle-on-thumb);
    }

    .win-switch.is-pressed:not(.is-on) .thumb,
    .win-switch.dragging:not(.is-on) .thumb {
      --tx: 0px;
      --scale: 1;
      width: 17px;
      height: 14px;
      border-radius: 7px;
      background-color: var(--toggle-thumb-hover);
      transition: none;
    }

    .win-switch.is-pressed.is-on .thumb,
    .win-switch.dragging.is-on .thumb {
      --tx: 16px;
      --scale: 1;
      width: 17px;
      height: 14px;
      border-radius: 7px;
      background-color: var(--toggle-on-thumb);
      transition: none;
    }

  .win-switch-wrap {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    touch-action: none;
    user-select: none;
  }

  .win-switch-wrap:not(.is-disabled):hover .win-switch:not(.is-on) .track {
    border-color: var(--text-primary);
  }

  .win-switch-wrap:not(.is-disabled):hover .win-switch .thumb {
    --scale: 1.167;
    background-color: var(--toggle-thumb-hover);
  }

  .win-switch-wrap:not(.is-disabled):hover .win-switch.is-on .track {
    background-color: var(--accent-hover);
  }

  .win-switch-wrap:not(.is-disabled):hover .win-switch.is-on .thumb {
    --tx: 20px;
    --scale: 1.167;
    background-color: var(--toggle-on-thumb);
  }

  .win-switch-wrap:not(.is-disabled):active .win-switch:not(.is-on) .thumb {
    --tx: 0px;
    --scale: 1;
    width: 17px;
    height: 14px;
    border-radius: 7px;
    background-color: var(--toggle-thumb-hover);
    transition: none;
  }

  .win-switch-wrap:not(.is-disabled):active .win-switch.is-on .thumb {
    --tx: 16px;
    --scale: 1;
    width: 17px;
    height: 14px;
    border-radius: 7px;
    background-color: var(--toggle-on-thumb);
    transition: none;
  }

  .win-switch-wrap:not(.is-disabled):active .win-switch.is-on .track {
    background-color: var(--accent-pressed);
  }

  .win-switch-label {
    font-size: 13px;
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
      --scale: 1;
      background-color: var(--ctrl-strong-stroke-disabled);
    }

    .win-switch.is-disabled:hover.is-on .track {
      background-color: var(--accent-fill-disabled);
    }

    .win-switch.is-disabled:hover.is-on .thumb {
      --scale: 1;
      background-color: var(--text-disabled);
    }
</style>
