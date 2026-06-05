<template>
  <div class="win-switch"
       :class="{ 'is-on': modelValue, 'dragging': isDragging, 'is-pressed': isPressed }"
       @pointerdown="onDown" @pointermove="onMove" @pointerup="onUp" @pointercancel="onUp">
    <div class="track"></div>
    <div class="thumb" :style="thumbStyle"></div>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue';
const props = defineProps({ modelValue: Boolean });
const emit = defineEmits(['update:modelValue']);
const isDragging = ref(false);
const isPressed = ref(false);
const currentTx = ref(0);
let startX = 0, initialChecked = false, moved = false;

watch(() => props.modelValue, v => {
  if (!isDragging.value) currentTx.value = v ? 20 : 0;
}, { immediate: true });

const thumbStyle = computed(() => {
  if (isDragging.value || isPressed.value) return { '--tx': currentTx.value + 'px' };
  return {};
});

const onDown = (e) => {
  isPressed.value = true; isDragging.value = true; moved = false;
  startX = e.clientX; initialChecked = props.modelValue;
  currentTx.value = initialChecked ? 16 : 0;
  e.currentTarget.setPointerCapture(e.pointerId);
};
const onMove = (e) => {
  if (!isDragging.value) return;
  moved = true;
  const delta = e.clientX - startX;
  currentTx.value = Math.max(0, Math.min(16, initialChecked ? 16 + delta : delta));
};
const onUp = (e) => {
  if (!isDragging.value) return;
  isDragging.value = false; isPressed.value = false;
  e.currentTarget.releasePointerCapture(e.pointerId);
  if (moved && Math.abs(e.clientX - startX) > 3) emit('update:modelValue', currentTx.value > 8);
  else emit('update:modelValue', !initialChecked);
};
</script>
<style src="../styles/toggleswitch.css"></style>
