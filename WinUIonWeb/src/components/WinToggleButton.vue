<template>
  <button class="win-btn" :class="{ primary: modelValue }" @click="$emit('update:modelValue', !modelValue)">
    <slot></slot>
  </button>
</template>
<script setup>defineProps({ modelValue: Boolean }); defineEmits(['update:modelValue']);</script>
