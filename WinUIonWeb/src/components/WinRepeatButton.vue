<template>
  <button
    class="win-btn"
    :disabled="disabled"
    @pointerdown="start"
    @pointerup="stop"
    @pointerleave="stop"
    @contextmenu.prevent>
    <slot></slot>
  </button>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  disabled: { type: Boolean, default: false },
  delay: { type: Number, default: 250 },      // 初次延迟(ms)
  interval: { type: Number, default: 150 }    // 重复间隔(ms)
});

const emit = defineEmits(['click']);

let delayTimer = null;
let intervalTimer = null;

const start = (e) => {
  if (props.disabled) return;

  e.target.setPointerCapture(e.pointerId);

  // 立即触发第一次
  emit('click');

  // 延迟后开始重复
  delayTimer = setTimeout(() => {
    intervalTimer = setInterval(() => {
      emit('click');
    }, props.interval);
  }, props.delay);
};

const stop = () => {
  if (delayTimer) {
    clearTimeout(delayTimer);
    delayTimer = null;
  }
  if (intervalTimer) {
    clearInterval(intervalTimer);
    intervalTimer = null;
  }
};
</script>
