<template>
  <button class="win-btn" @pointerdown="start" @pointerup="stop" @pointerleave="stop" @contextmenu.prevent>
    <slot></slot>
  </button>
</template>
<script setup>
let timer = null; const emit = defineEmits(['click']);
const start = (e) => { e.target.setPointerCapture(e.pointerId); emit('click'); timer = setInterval(() => emit('click'), 150); };
const stop = () => { clearInterval(timer); };
</script>
