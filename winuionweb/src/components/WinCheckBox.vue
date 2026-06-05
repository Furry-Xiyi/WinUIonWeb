<template>
  <label class="win-checkbox">
    <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" style="display:none">
    <div class="checkbox-box"></div><slot></slot>
  </label>
</template>
<script setup>defineProps({ modelValue: Boolean }); defineEmits(['update:modelValue']);</script>
<style src="../styles/checkbox.css"></style>
