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

  // 逻辑修正：如果当前是横杠状态，点击后必须变为空框（false）
  if (props.indeterminate) {
    targetValue = false;
  }

  // 同步 DOM 状态并提交
  e.target.checked = targetValue;
  emit('update:modelValue', targetValue);
  emit('change', targetValue);
};
</script>

<style src="../styles/checkbox.css"></style>
