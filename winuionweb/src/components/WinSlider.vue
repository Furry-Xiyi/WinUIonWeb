<template>
  <div class="win-slider" ref="slider" @pointerdown="onDown">
    <div class="win-slider-track"><div class="win-slider-fill" :style="{ width: percent + '%' }"></div></div>
    <div class="win-slider-thumb" :style="{ left: percent + '%' }"></div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
const props = defineProps({ modelValue: Number, min: { type: Number, default: 0 }, max: { type: Number, default: 100 } });
const emit = defineEmits(['update:modelValue']); const slider = ref(null);
const percent = computed(() => ((props.modelValue - props.min) / (props.max - props.min)) * 100);
const onDown = (e) => {
  const el = slider.value; el.setPointerCapture(e.pointerId);
  const update = (evt) => {
    const rect = el.getBoundingClientRect();
    let p = Math.max(0, Math.min(1, (evt.clientX - rect.left) / rect.width));
    emit('update:modelValue', Math.round(props.min + p * (props.max - props.min)));
  };
  update(e); el.onpointermove = update;
  el.onpointerup = () => { el.onpointermove = null; el.releasePointerCapture(e.pointerId); };
};
</script>
<style src="../styles/slider.css"></style>
