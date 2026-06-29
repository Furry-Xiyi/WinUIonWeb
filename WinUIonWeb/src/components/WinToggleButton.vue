<template>
  <button class="win-btn" :class="{ primary: modelValue }" :disabled="disabled" @click="handleClick">
    <slot></slot>
  </button>
</template>
<script setup>
const props = defineProps({ modelValue: Boolean, disabled: Boolean });
const emit = defineEmits(['update:modelValue']);
const handleClick = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue);
  }
};
</script>
