<template>
  <label class="win-checkbox" :class="{ 'is-disabled': disabled }">
    <input type="checkbox"
           :checked="modelValue"
           :disabled="disabled"
           @change="handleChange"
           style="display:none">
    <div class="checkbox-box" :class="{ 'is-indeterminate': indeterminate }"></div>
    <slot></slot>
  </label>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  indeterminate: Boolean,
  disabled: Boolean
});

const emit = defineEmits(['update:modelValue', 'change']);

const handleChange = (e) => {
  if (props.disabled) return;

  let targetValue = e.target.checked;

  if (props.indeterminate) {
    targetValue = false;
  }

  e.target.checked = targetValue;
  emit('update:modelValue', targetValue);
  emit('change', targetValue);
};
</script>

<style>
  .win-checkbox {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 14px;
    color: var(--text-primary);
    user-select: none;
  }

    .win-checkbox.is-disabled {
      cursor: default;
      color: var(--text-disabled);
    }

  .checkbox-box {
    width: 20px;
    height: 20px;
    border: 1px solid var(--ctrl-strong-stroke);
    border-radius: 4px;
    background: var(--ctrl-fill-default);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--fast-duration) var(--fast-out-slow-in);
  }

  .win-checkbox:not(.is-disabled):hover .checkbox-box {
    background: var(--ctrl-fill-secondary);
  }

  .win-checkbox:not(.is-disabled):active .checkbox-box {
    background: var(--ctrl-fill-tertiary);
    border-color: var(--ctrl-border-rest);
  }

  .win-checkbox input:checked + .checkbox-box,
  .checkbox-box.is-indeterminate {
    background: var(--accent-base);
    border-color: transparent;
  }

  .win-checkbox:not(.is-disabled):hover input:checked + .checkbox-box,
  .win-checkbox:not(.is-disabled):hover .checkbox-box.is-indeterminate {
    background: var(--accent-hover);
  }

  .win-checkbox:not(.is-disabled):active input:checked + .checkbox-box,
  .win-checkbox:not(.is-disabled):active .checkbox-box.is-indeterminate {
    background: var(--accent-pressed);
  }

  .win-checkbox input:checked + .checkbox-box:not(.is-indeterminate):after {
    content: "";
    width: 9px;
    height: 4px;
    border-left: 1.5px solid var(--accent-text);
    border-bottom: 1.5px solid var(--accent-text);
    transform: translateY(-1px) rotate(-45deg);
  }

  .checkbox-box.is-indeterminate:after {
    content: "\e73c";
    font-family: 'Segoe Fluent Icons', 'Segoe MDL2 Assets';
    font-size: 10px;
    color: var(--accent-text);
  }

  .win-checkbox:not(.is-disabled):active .checkbox-box:after {
    opacity: 0.7;
  }

  .win-checkbox.is-disabled .checkbox-box {
    background: var(--ctrl-fill-disabled);
    border-color: var(--ctrl-strong-stroke-disabled);
  }

    .win-checkbox.is-disabled input:checked + .checkbox-box,
    .win-checkbox.is-disabled .checkbox-box.is-indeterminate {
      background: var(--accent-fill-disabled);
      border-color: transparent;
    }

    .win-checkbox.is-disabled .checkbox-box:after {
      border-color: var(--text-disabled) !important;
      color: var(--text-disabled) !important;
    }
</style>
