<template>
  <div
    class="win-checkbox"
    :class="stateClasses"
    :style="checkboxStyle"
    :tabindex="isDisabled ? -1 : 0"
    role="checkbox"
    :aria-checked="ariaChecked"
    :aria-disabled="isDisabled"
    @click="toggle"
    @keydown.space.prevent="toggle"
    @keydown.enter.prevent="toggle">
    <span class="checkbox-box" aria-hidden="true">
      <span class="checkbox-glyph check-glyph" :class="{ checked: isChecked, hidden: isIndeterminate }">&#xE73E;</span>
      <span v-if="isIndeterminate" class="checkbox-glyph indeterminate-glyph">{{ indeterminateGlyph }}</span>
    </span>
    <span class="checkbox-content">
      <slot>{{ Content }}</slot>
    </span>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  Content: { type: [String, Number], default: '' },
  IsChecked: { type: [Boolean, null], default: undefined },
  IsThreeState: { type: Boolean, default: undefined },
  IsEnabled: { type: Boolean, default: true },
  Margin: { type: String, default: '' },
  modelValue: { type: [Boolean, null], default: undefined },
  isThreeState: { type: Boolean, default: false },
  indeterminate: { type: Boolean, default: undefined },
  disabled: Boolean
});

const emit = defineEmits([
  'update:modelValue',
  'update:IsChecked',
  'Checked',
  'Unchecked',
  'Indeterminate',
  'checked',
  'unchecked',
  'indeterminate'
]);

const localChecked = ref(false);
const isControlled = computed(() => props.IsChecked !== undefined || props.modelValue !== undefined || props.indeterminate !== undefined);
const isThreeState = computed(() => props.IsThreeState ?? props.isThreeState);
const isDisabled = computed(() => props.disabled || props.IsEnabled === false);

const currentValue = computed(() => {
  if (props.indeterminate === true) return null;
  if (props.IsChecked !== undefined) return props.IsChecked;
  if (props.modelValue !== undefined) return props.modelValue;
  return localChecked.value;
});

watch(() => props.modelValue, (value) => {
  if (value !== undefined) localChecked.value = value;
}, { immediate: true });

const isChecked = computed(() => currentValue.value === true);
const isIndeterminate = computed(() => isThreeState.value && currentValue.value === null);
const indeterminateGlyph = '\uE73C';
const ariaChecked = computed(() => isIndeterminate.value ? 'mixed' : String(isChecked.value));

const stateClasses = computed(() => ({
  'is-checked': isChecked.value,
  'is-unchecked': !isChecked.value && !isIndeterminate.value,
  'is-indeterminate': isIndeterminate.value,
  'is-disabled': isDisabled.value
}));

const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) return `${Number(value.trim())}px`;
  return typeof value === 'number' ? `${value}px` : value;
};

const xamlThickness = (value) => {
  if (!value) return '';
  const parts = String(value).split(',').map((part) => cssLength(Number.isNaN(Number(part.trim())) ? part.trim() : Number(part.trim())));
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;
  return value;
};

const checkboxStyle = computed(() => props.Margin ? { margin: xamlThickness(props.Margin) } : {});

const emitState = (value) => {
  if (!isControlled.value) localChecked.value = value;
  emit('update:modelValue', value);
  emit('update:IsChecked', value);

  if (value === true) {
    emit('Checked', value);
    emit('checked', value);
  } else if (value === null) {
    emit('Indeterminate', value);
    emit('indeterminate', value);
  } else {
    emit('Unchecked', value);
    emit('unchecked', value);
  }
};

const toggle = () => {
  if (isDisabled.value) return;
  if (isThreeState.value) {
    if (currentValue.value === false) emitState(true);
    else if (currentValue.value === true) emitState(null);
    else emitState(false);
    return;
  }
  emitState(!isChecked.value);
};
</script>

<style>
.win-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  padding: 0;
  width: fit-content;
  align-self: flex-start;
  color: var(--CheckBoxForeground, var(--text-primary));
  background: transparent;
  border: 0;
  font-family: var(--ContentControlThemeFontFamily, 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif);
  font-size: 14px;
  line-height: 20px;
  text-align: left;
  cursor: pointer;
  user-select: none;
}

.win-checkbox:focus-visible {
  outline: 2px solid var(--focus-stroke-outer, var(--text-primary));
  outline-offset: 2px;
  border-radius: 2px;
}

.checkbox-box {
  width: 20px;
  height: 20px;
  min-width: 20px;
  position: relative;
  box-sizing: border-box;
  border: 1px solid var(--CheckBoxCheckBackgroundStroke, var(--ctrl-strong-stroke));
  border-radius: 4px;
  background: var(--CheckBoxCheckBackgroundFill, var(--ctrl-fill-default));
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.checkbox-glyph {
  font-size: 12px;
  line-height: 1;
  color: var(--CheckBoxCheckGlyphForeground, var(--accent-text));
}

.indeterminate-glyph {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.check-glyph {
  font-weight: bold;
  animation: glyph-close 0.2s ease-in-out forwards;
}

.check-glyph.checked {
  animation: glyph-open 0.2s ease-in-out forwards;
}

.check-glyph.hidden {
  visibility: hidden;
}

@keyframes glyph-open {
  0% {
    clip-path: polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%);
  }

  100% {
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  }
}

@keyframes glyph-close {
  0% {
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  }

  100% {
    clip-path: polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%);
  }
}

.checkbox-content {
  display: inline-flex;
  align-items: center;
  min-width: 0;
}

.win-checkbox.is-unchecked {
  --CheckBoxCheckBackgroundFill: var(--ctrl-fill-default);
  --CheckBoxCheckBackgroundStroke: var(--ctrl-strong-stroke);
}

.win-checkbox.is-unchecked:hover {
  --CheckBoxCheckBackgroundFill: var(--ctrl-fill-secondary);
  --CheckBoxCheckBackgroundStroke: var(--ctrl-strong-stroke);
}

.win-checkbox.is-unchecked:active {
  --CheckBoxCheckBackgroundFill: var(--ctrl-fill-tertiary);
  --CheckBoxCheckBackgroundStroke: var(--ctrl-strong-stroke-disabled);
}

.win-checkbox.is-checked,
.win-checkbox.is-indeterminate {
  --CheckBoxCheckBackgroundFill: var(--accent-base);
  --CheckBoxCheckBackgroundStroke: var(--accent-base);
  --CheckBoxCheckGlyphForeground: var(--accent-text);
}

.win-checkbox.is-checked:hover,
.win-checkbox.is-indeterminate:hover {
  --CheckBoxCheckBackgroundFill: var(--accent-hover);
  --CheckBoxCheckBackgroundStroke: var(--accent-hover);
}

.win-checkbox.is-checked:active,
.win-checkbox.is-indeterminate:active {
  --CheckBoxCheckBackgroundFill: var(--accent-pressed);
  --CheckBoxCheckBackgroundStroke: var(--accent-pressed);
  --CheckBoxCheckGlyphForeground: var(--accent-text-secondary);
}

.win-checkbox.is-disabled {
  pointer-events: none;
  cursor: default;
  color: var(--text-disabled);
}

.win-checkbox.is-disabled .checkbox-box {
  background: var(--ctrl-fill-disabled);
  border-color: var(--ctrl-strong-stroke-disabled);
}

.win-checkbox.is-disabled.is-checked .checkbox-box,
.win-checkbox.is-disabled.is-indeterminate .checkbox-box {
  background: var(--accent-fill-disabled);
  border-color: var(--accent-fill-disabled);
}

.win-checkbox.is-disabled .checkbox-glyph {
  color: var(--text-disabled);
}
</style>
