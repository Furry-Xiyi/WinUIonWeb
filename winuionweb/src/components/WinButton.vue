<template>
  <button class="win-btn" :class="{ primary, subtle, wrap }" :disabled="disabled">
    <slot></slot>
  </button>
</template>
<script setup>
defineProps({
  primary: Boolean,
  subtle: Boolean,
  disabled: Boolean,
  wrap: Boolean
});
</script>
<style src="../styles/button.css"></style>
