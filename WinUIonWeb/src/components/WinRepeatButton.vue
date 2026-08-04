<template>
  <button
    v-bind="buttonAttrs"
    class="win-btn DefaultButtonStyle"
    :class="attrs.class"
    :style="buttonStyle"
    :disabled="isDisabled"
    @pointerdown="start"
    @pointerup="stop"
    @pointerleave="stop"
    @pointercancel="stop"
    @contextmenu.prevent>
    <slot>{{ Content }}</slot>
  </button>
</template>

<script setup>
import { computed, onBeforeUnmount, useAttrs } from 'vue';

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  Content: { type: [String, Number], default: '' },
  IsEnabled: { type: Boolean, default: true },
  Delay: { type: Number, default: 250 },
  Interval: { type: Number, default: 150 },
  Width: { type: [String, Number], default: '' },
  Height: { type: [String, Number], default: '' },
  Margin: { type: String, default: '' },
  Padding: { type: String, default: '' },
  HorizontalAlignment: { type: String, default: '' },
  VerticalAlignment: { type: String, default: '' }
});

const emit = defineEmits(['Click']);
const attrs = useAttrs();

let delayTimer = null;
let intervalTimer = null;

const buttonAttrs = computed(() => {
  const { class: _class, style: _style, disabled: _disabled, ...rest } = attrs;
  return rest;
});

const isDisabled = computed(() => props.IsEnabled === false);

const cssLength = (value) => {
  if (value === '' || value === undefined || value === null) return '';
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value.trim()))) {
    return `${Number(value.trim())}px`;
  }
  return typeof value === 'number' ? `${value}px` : value;
};

const xamlThickness = (value) => {
  if (!value) return '';
  const parts = String(value).split(',').map((part) => cssLength(Number.isNaN(Number(part.trim())) ? part.trim() : Number(part.trim())));
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  if (parts.length === 4) return `${parts[1]} ${parts[2]} ${parts[3]} ${parts[0]}`;
  return value;
};

const buttonStyle = computed(() => {
  const style = {};
  if (props.Width !== '') style.width = cssLength(props.Width);
  if (props.Height !== '') style.height = cssLength(props.Height);
  if (props.Margin) style.margin = xamlThickness(props.Margin);
  if (props.Padding) style.padding = xamlThickness(props.Padding);
  if (props.HorizontalAlignment) style.justifySelf = props.HorizontalAlignment.toLowerCase();
  if (props.VerticalAlignment) style.alignSelf = props.VerticalAlignment.toLowerCase();
  return [attrs.style, style];
});

const start = (e) => {
  if (isDisabled.value) return;

  e.currentTarget.setPointerCapture(e.pointerId);

  emit('Click');

  delayTimer = setTimeout(() => {
    intervalTimer = setInterval(() => {
      emit('Click');
    }, props.Interval);
  }, props.Delay);
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

onBeforeUnmount(stop);
</script>
