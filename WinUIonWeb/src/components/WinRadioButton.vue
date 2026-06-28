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
<style>
  .win-radio {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
    flex-shrink: 0;
  }

  .win-radio-circle {
    width: 20px;
    height: 20px;
    border: 1px solid var(--radio-border);
    border-radius: 50%;
    position: relative;
    background: transparent;
    transition: all var(--fast-duration) var(--fast-out-slow-in);
    flex-shrink: 0;
  }

  .win-radio:hover .win-radio-circle {
    background: var(--subtle-secondary);
  }

  .win-radio:active .win-radio-circle {
    background: var(--subtle-tertiary);
  }

  .win-radio.is-checked .win-radio-circle {
    border: none;
    background: var(--accent-base);
  }

  .win-radio.is-checked:hover .win-radio-circle {
    background: var(--accent-hover);
  }

  .win-radio.is-checked:active .win-radio-circle {
    background: var(--accent-pressed);
  }

  .win-radio-dot {
    position: absolute;
    inset: 0;
    margin: auto;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--accent-text);
    transform: scale(0);
    transition: transform var(--fast-duration) var(--fast-out-slow-in);
  }

  .win-radio.is-checked .win-radio-dot {
    transform: scale(1);
  }

  .win-radio.is-checked:hover .win-radio-dot {
    transform: scale(1.15);
  }

  .win-radio.is-checked:active .win-radio-dot {
    transform: scale(0.85);
  }
</style>
