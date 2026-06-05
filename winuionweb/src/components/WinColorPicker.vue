<template>
  <button class="win-btn" @click="$refs.colorInput.click()">
    <div :style="{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: modelValue }"></div>
    Pick Color
    <input ref="colorInput" type="color" style="opacity:0; position:absolute; pointer-events:none;"
           :value="modelValue" @input="$emit('update:modelValue', $event.target.value)">
  </button>
</template>
<script setup>
defineProps({ modelValue: String });
defineEmits(['update:modelValue']);
</script>
