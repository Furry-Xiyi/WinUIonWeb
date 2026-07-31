<template>
  <div
    class="win-rating-control"
    :class="stateClasses"
    :style="rootStyle"
    role="slider"
    :aria-valuemin="0"
    :aria-valuemax="effectiveMax"
    :aria-valuenow="ariaValue"
    :aria-readonly="IsReadOnly"
    :aria-disabled="!isEnabled"
    :tabindex="isEnabled ? 0 : -1"
    @keydown="onKeyDown">
    <div class="win-rating-caption-stack">
      <div
        ref="itemsRef"
        class="win-rating-background-stack"
        @pointerenter="onPointerEnter"
        @pointermove="onPointerMove"
        @pointerleave="onPointerLeave"
        @pointercancel="onPointerCancel"
        @lostpointercapture="onPointerCaptureLost"
        @pointerdown="onPointerDown"
        @pointerup="onPointerUp">
        <span
          v-for="index in itemIndexes"
          :key="`background-${index}`"
          class="win-rating-item win-rating-background-item"
          aria-hidden="true">
          <span class="win-rating-glyph">&#xE734;</span>
        </span>
      </div>

      <WinTextBlock
        v-if="Caption"
        class="win-rating-caption"
        :Text="Caption" />
    </div>

    <div class="win-rating-foreground-presenter" aria-hidden="true">
      <div class="win-rating-foreground-outer">
        <div class="win-rating-foreground-stack">
          <span
            v-for="index in itemIndexes"
            :key="`foreground-${index}`"
            class="win-rating-item win-rating-foreground-item"
            :style="foregroundItemStyle(index)">
            <span class="win-rating-glyph">&#xE735;</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import WinTextBlock from './WinTextBlock.vue';

const noValueSetSentinel = -1;

const props = defineProps({
  Value: { type: Number, default: noValueSetSentinel },
  MaxRating: { type: Number, default: 5 },
  PlaceholderValue: { type: Number, default: noValueSetSentinel },
  Caption: { type: String, default: '' },
  InitialSetValue: { type: Number, default: 1 },
  IsClearEnabled: { type: Boolean, default: true },
  IsReadOnly: { type: Boolean, default: false },
  IsEnabled: { type: Boolean, default: true },
  Width: { type: [String, Number], default: '' },
  modelValue: { type: Number, default: undefined },
  max: { type: Number, default: undefined },
  disabled: { type: Boolean, default: false }
});

const emit = defineEmits(['update:Value', 'ValueChanged', 'update:modelValue']);

const itemsRef = ref(null);
const isPointerOver = ref(false);
const isPointerDown = ref(false);
const pointerRating = ref(0);
const internalValue = ref(noValueSetSentinel);

const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) return `${Number(value.trim())}px`;
  return typeof value === 'number' ? `${value}px` : value;
};

const coerceRatingValue = (value) => {
  const number = toNumber(value, noValueSetSentinel);
  if (number < 0) return noValueSetSentinel;
  if (number <= 1) return 1;
  if (number > effectiveMax.value) return effectiveMax.value;
  return number;
};

const effectiveMax = computed(() => Math.max(1, Math.trunc(toNumber(props.max ?? props.MaxRating, 5))));
const isEnabled = computed(() => props.IsEnabled && !props.disabled);
const actualValue = computed(() => internalValue.value);
const placeholderValue = computed(() => coerceRatingValue(props.PlaceholderValue));
const initialSetValue = computed(() => Math.max(1, Math.min(effectiveMax.value, Math.trunc(toNumber(props.InitialSetValue, 1)))));
const itemIndexes = computed(() => Array.from({ length: effectiveMax.value }, (_, index) => index + 1));

watch(
  () => [props.modelValue, props.Value, effectiveMax.value],
  () => {
    internalValue.value = coerceRatingValue(props.modelValue ?? props.Value);
  },
  { immediate: true }
);

const displayedValue = computed(() => {
  if (isPointerOver.value && !props.IsReadOnly && isEnabled.value) return Math.max(0, Math.min(effectiveMax.value, pointerRating.value));
  if (actualValue.value > noValueSetSentinel) return actualValue.value;
  if (placeholderValue.value > noValueSetSentinel) return placeholderValue.value;
  return 0;
});

const visualState = computed(() => {
  if (!isEnabled.value) return 'disabled';
  if (isPointerOver.value && !props.IsReadOnly) {
    return actualValue.value > noValueSetSentinel ? 'pointer-over-set' : 'pointer-over-placeholder';
  }
  if (actualValue.value > noValueSetSentinel) return 'set';
  if (placeholderValue.value > noValueSetSentinel) return 'placeholder';
  return 'unset';
});

const stateClasses = computed(() => ({
  'is-readonly': props.IsReadOnly,
  'is-disabled': !isEnabled.value,
  [`state-${visualState.value}`]: true
}));

const ariaValue = computed(() => Math.max(0, actualValue.value));
const rootStyle = computed(() => (props.Width !== '' ? { width: cssLength(props.Width) } : {}));

const foregroundItemStyle = (index) => {
  const amount = Math.max(0, Math.min(1, displayedValue.value - (index - 1)));
  return { clipPath: `inset(0 ${100 - amount * 100}% 0 0)` };
};

const pointerRatingFromEvent = (event) => {
  const rect = itemsRef.value?.getBoundingClientRect();
  if (!rect || rect.width <= 0) return 0;
  const ratio = (event.clientX - rect.left) / rect.width;
  return Math.max(0, Math.min(effectiveMax.value, Math.ceil(ratio * effectiveMax.value)));
};

const updatePointerRating = (event) => {
  pointerRating.value = pointerRatingFromEvent(event);
};

const commitRating = (newRating, originatedFromMouse = false) => {
  const oldValue = actualValue.value;
  const boundedRating = Math.max(0, Math.min(effectiveMax.value, newRating));
  let nextValue = oldValue;

  if (oldValue > noValueSetSentinel || boundedRating !== 0) {
    if (!props.IsClearEnabled && boundedRating <= 0) {
      nextValue = 1;
    } else if (boundedRating === oldValue && props.IsClearEnabled && (boundedRating !== effectiveMax.value || originatedFromMouse)) {
      nextValue = noValueSetSentinel;
    } else if (boundedRating > 0) {
      nextValue = boundedRating;
    } else {
      nextValue = noValueSetSentinel;
    }
  }

  if (nextValue !== oldValue) {
    internalValue.value = nextValue;
    emit('update:Value', nextValue);
    emit('update:modelValue', nextValue);
    emit('ValueChanged', { OldValue: oldValue, NewValue: nextValue });
  }
};

const changeRatingBy = (change, originatedFromMouse = false) => {
  if (change === 0) return;

  let ratingValue;
  if (actualValue.value !== noValueSetSentinel) {
    if (Math.trunc(actualValue.value) !== actualValue.value) {
      ratingValue = change === -1 ? Math.trunc(actualValue.value) : Math.trunc(actualValue.value) + change;
    } else {
      ratingValue = actualValue.value + change;
    }
  } else {
    ratingValue = initialSetValue.value;
  }

  commitRating(ratingValue, originatedFromMouse);
};

const onPointerEnter = (event) => {
  if (!isEnabled.value || props.IsReadOnly) return;
  isPointerOver.value = true;
  updatePointerRating(event);
};

const onPointerMove = (event) => {
  if (!isEnabled.value || props.IsReadOnly) return;
  updatePointerRating(event);
};

const onPointerLeave = () => {
  if (isPointerDown.value) return;
  isPointerOver.value = false;
};

const onPointerCancel = (event) => {
  isPointerDown.value = false;
  if (itemsRef.value?.hasPointerCapture?.(event.pointerId)) {
    itemsRef.value.releasePointerCapture(event.pointerId);
  }
  isPointerOver.value = false;
};

const onPointerCaptureLost = () => {
  isPointerDown.value = false;
};

const onPointerDown = (event) => {
  if (!isEnabled.value || props.IsReadOnly) return;
  isPointerDown.value = true;
  itemsRef.value?.setPointerCapture?.(event.pointerId);
};

const onPointerUp = (event) => {
  if (!isEnabled.value || props.IsReadOnly) return;
  const rating = pointerRatingFromEvent(event);
  commitRating(rating, true);
  isPointerDown.value = false;
  if (itemsRef.value?.hasPointerCapture?.(event.pointerId)) {
    itemsRef.value.releasePointerCapture(event.pointerId);
  }
  isPointerOver.value = itemsRef.value?.matches(':hover') ?? false;
  if (isPointerOver.value) updatePointerRating(event);
};

const onKeyDown = (event) => {
  if (!isEnabled.value || props.IsReadOnly) return;

  let handled = true;
  switch (event.key) {
    case 'ArrowLeft':
    case 'ArrowDown':
      changeRatingBy(-1);
      break;
    case 'ArrowRight':
    case 'ArrowUp':
      changeRatingBy(1);
      break;
    case 'Home':
      commitRating(0);
      break;
    case 'End':
      commitRating(effectiveMax.value);
      break;
    default:
      handled = false;
      break;
  }

  if (handled) event.preventDefault();
};
</script>

<style>
.win-rating-control {
  --rating-font-size: 32px;
  --rating-actual-size: 16px;
  --rating-item-spacing: 8px;
  --rating-unselected-foreground: var(--text-secondary);
  --rating-selected-foreground: var(--accent-base);
  --rating-placeholder-foreground: var(--text-primary);
  --rating-pointer-placeholder-foreground: var(--control-alt-fill-color-tertiary, rgba(0, 0, 0, 0.0578));
  --rating-disabled-selected-foreground: var(--text-disabled);

  position: relative;
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  height: 32px;
  color: var(--text-primary);
  user-select: none;
  outline: none;
}

.win-rating-caption-stack {
  display: flex;
  align-items: center;
  height: 32px;
}

.win-rating-background-stack,
.win-rating-foreground-stack {
  display: flex;
  align-items: flex-start;
  gap: var(--rating-item-spacing);
}

.win-rating-background-stack {
  height: var(--rating-actual-size);
  background: transparent;
  cursor: pointer;
  touch-action: none;
}

.win-rating-item {
  position: relative;
  display: block;
  flex: 0 0 var(--rating-actual-size);
  width: var(--rating-actual-size);
  height: var(--rating-actual-size);
  overflow: hidden;
  color: currentColor;
  pointer-events: none;
}

.win-rating-glyph {
  position: absolute;
  top: -8px;
  left: -8px;
  display: block;
  width: var(--rating-font-size);
  height: var(--rating-font-size);
  font-size: var(--rating-font-size);
  line-height: var(--rating-font-size);
  font-weight: 400;
  transform: scale(0.5);
  transform-origin: center center;
}

.win-rating-background-item {
  color: var(--rating-unselected-foreground);
}

.win-rating-foreground-presenter {
  position: absolute;
  top: 8px;
  left: 0;
  height: var(--rating-actual-size);
  pointer-events: none;
}

.win-rating-foreground-outer {
  overflow: visible;
}

.win-rating-foreground-stack {
  margin: 0;
}

.win-rating-foreground-item {
  color: var(--rating-selected-foreground);
}

.win-rating-caption {
  margin: 0 0 0 12px;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 16px;
  min-height: 16px;
  align-self: center;
}

.win-rating-control.state-placeholder .win-rating-foreground-item {
  color: var(--rating-placeholder-foreground);
}

.win-rating-control.state-pointer-over-placeholder .win-rating-foreground-item,
.win-rating-control.state-unset .win-rating-foreground-item {
  color: var(--rating-pointer-placeholder-foreground);
}

.win-rating-control.state-disabled .win-rating-foreground-item {
  color: var(--rating-disabled-selected-foreground);
}

.win-rating-control.is-readonly .win-rating-background-stack,
.win-rating-control.is-disabled .win-rating-background-stack {
  cursor: default;
}

.win-rating-control.is-disabled {
  pointer-events: none;
}

.example-theme-wrapper.theme-dark .win-rating-control,
.win-theme-scope.theme-dark .win-rating-control {
  --rating-pointer-placeholder-foreground: var(--control-alt-fill-color-tertiary, rgba(255, 255, 255, 0.0419));
}

</style>
