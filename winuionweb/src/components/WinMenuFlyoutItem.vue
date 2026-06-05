<template>
  <div class="win-menu-flyout-item" @click="$emit('click')"><slot></slot></div>
</template>
<script setup>
defineEmits(['click']);
</script>
