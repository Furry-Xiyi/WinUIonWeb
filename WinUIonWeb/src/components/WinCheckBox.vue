<template>
  <label class="win-checkbox" :class="{ 'is-disabled': disabled }">
    <input type="checkbox"
           :checked="isChecked"
           :disabled="disabled"
           :indeterminate.prop="isIndeterminate"
           @change="handleChange"
           ref="inputRef"
           style="display:none">
    <div class="checkbox-box" :class="{ 'is-indeterminate': isIndeterminate }"></div>
    <slot></slot>
  </label>
</template>

<script setup>
import { computed, watch, ref, onMounted } from 'vue';

const props = defineProps({
  modelValue: { type: [Boolean, null], default: false },
  isThreeState: { type: Boolean, default: false },  // 对齐官方命名：IsThreeState
  indeterminate: Boolean,  // 外部控制的indeterminate状态
  disabled: Boolean
});

const emit = defineEmits(['update:modelValue', 'checked', 'unchecked', 'indeterminate']);

const inputRef = ref(null);

// 计算是否为中间态
const isIndeterminate = computed(() => {
  // 优先使用外部传入的indeterminate属性
  if (props.indeterminate !== undefined) {
    return props.indeterminate;
  }
  // IsThreeState模式下，null值表示indeterminate
  if (props.isThreeState && props.modelValue === null) {
    return true;
  }
  return false;
});

// 计算是否选中
const isChecked = computed(() => {
  return props.modelValue === true;
});

// 同步indeterminate属性到DOM元素
watch([isIndeterminate, inputRef], ([indeterminate, input]) => {
  if (input) {
    input.indeterminate = indeterminate;
  }
}, { immediate: true });

onMounted(() => {
  if (inputRef.value) {
    inputRef.value.indeterminate = isIndeterminate.value;
  }
});

const handleChange = (e) => {
  if (props.disabled) return;

  if (props.isThreeState) {
    // 三段式切换: null (indeterminate) -> true (checked) -> false (unchecked) -> null
    if (props.modelValue === null) {
      emit('update:modelValue', true);
      emit('checked', true);
    } else if (props.modelValue === true) {
      emit('update:modelValue', false);
      emit('unchecked', false);
    } else {
      emit('update:modelValue', null);
      emit('indeterminate', null);
    }
  } else {
    // 二段式切换
    const newValue = e.target.checked;
    emit('update:modelValue', newValue);
    if (newValue) {
      emit('checked', newValue);
    } else {
      emit('unchecked', newValue);
    }
  }
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
