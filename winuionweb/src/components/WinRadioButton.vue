<template>
  <label class="win-radio" :class="{ 'is-checked': checked }">
    <input type="radio" :checked="checked" @change="$emit('update:modelValue', value)" style="display:none">
    <div class="win-radio-circle"><div class="win-radio-dot"></div></div><slot></slot>
  </label>
</template>
<script setup>
import { computed } from 'vue';
const props = defineProps({ modelValue: [String, Number], value: [String, Number] });
defineEmits(['update:modelValue']);
const checked = computed(() => props.modelValue === props.value);
</script>
<style src="../styles/radio.css"></style>
