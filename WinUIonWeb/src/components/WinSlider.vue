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
    const newValue = props.min + p * (props.max - props.min);
    emit('update:modelValue', newValue);
  };
  update(e); el.onpointermove = update;
  el.onpointerup = () => { el.onpointermove = null; el.releasePointerCapture(e.pointerId); };
};
</script>
<style>
  .win-slider {
    position: relative;
    width: 200px;
    height: 24px;
    display: flex;
    align-items: center;
    touch-action: none;
    cursor: pointer;
    flex-shrink: 0;
  }

  .win-slider-track {
    width: 100%;
    height: 4px;
    background: var(--ctrl-strong-fill);
    border-radius: 2px;
    overflow: hidden;
    position: relative;
  }

  .win-slider-fill {
    height: 100%;
    background: var(--accent-base);
    border-radius: 2px;
  }

  .win-slider-thumb {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--ctrl-solid-fill);
    border: 1px solid var(--ctrl-elevation-bottom);
    border-top-color: var(--ctrl-elevation-top);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    flex-shrink: 0;
  }

    .win-slider-thumb::after {
      content: "";
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--accent-base);
      transition: transform var(--fast-duration) var(--fast-out-slow-in);
    }

    .win-slider-thumb:hover::after {
      transform: scale(1.5);
    }

  .win-slider:active .win-slider-thumb::after {
    transform: scale(0.9);
  }
</style>
