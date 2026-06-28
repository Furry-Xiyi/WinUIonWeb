<template>
  <div class="win-split-button" :class="{ 'toggled-on': modelValue }" ref="wrap">
    <button class="win-btn win-tsb-main" :class="{ 'toggled-on': modelValue }" @click="toggle">
      <slot></slot>
    </button>
    <div class="win-btn-separator"></div>
    <button class="win-btn win-btn-chevron" :class="{ 'toggled-on': modelValue }"
            @click="toggleFlyout"
            @mousedown="onChevronDown"
            @mouseup="onChevronUp"
            @mouseleave="onChevronLeave">
      <span class="icon chevron-animate"
            :class="chevronClass"
            @animationend="onChevronAnimEnd">&#xE70D;</span>
    </button>
    <WinMenuFlyout :open="isOpen" :anchorRect="anchorRect" :items="flyoutItems" @close="isOpen = false" @select="onSelect" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import WinMenuFlyout from './WinMenuFlyout.vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  options: { type: Array, default: () => [] }
});

const emit = defineEmits(['update:modelValue', 'click', 'optionClick']);

const wrap = ref(null);
const isOpen = ref(false);
const anchorRect = ref(null);
const chevronClass = ref('');
let chevronPressed = false;
let chevronPressDone = false;

const flyoutItems = computed(() => props.options.map((item, idx) => ({
  label: typeof item === 'string' ? item : item.label,
  value: idx
})));

const toggle = () => {
  emit('update:modelValue', !props.modelValue);
  emit('click');
};

const onChevronDown = () => {
  chevronPressed = true;
  chevronPressDone = false;
  chevronClass.value = 'pressing';
};
const onChevronUp = () => {
  if (!chevronPressed) return;
  chevronPressed = false;
  if (chevronPressDone) chevronClass.value = 'releasing';
};
const onChevronLeave = () => { chevronPressed = false; };
const onChevronAnimEnd = () => {
  if (chevronClass.value === 'pressing') {
    chevronPressDone = true;
    if (!chevronPressed) chevronClass.value = 'releasing';
  } else if (chevronClass.value === 'releasing') {
    chevronClass.value = '';
    chevronPressDone = false;
  }
};

const toggleFlyout = () => {
  if (isOpen.value) { isOpen.value = false; return; }
  const r = wrap.value.getBoundingClientRect();
  anchorRect.value = { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width, height: r.height };
  isOpen.value = true;
};

const onSelect = (item) => {
  emit('optionClick', item.value);
  isOpen.value = false;
};
</script>

<style scoped>
  .win-split-button.toggled-on {
    background: var(--accent-base);
  }

    .win-split-button.toggled-on::after {
      border-color: var(--accent-border);
      border-bottom-color: var(--accent-border-accent);
    }

  .win-tsb-main.toggled-on,
  .win-btn-chevron.toggled-on {
    color: var(--accent-text);
  }

    .win-tsb-main.toggled-on:hover,
    .win-btn-chevron.toggled-on:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    .win-tsb-main.toggled-on:active,
    .win-btn-chevron.toggled-on:active {
      background: rgba(255, 255, 255, 0.04);
      color: var(--accent-text-secondary);
    }

  .win-split-button.toggled-on .win-btn-separator {
    background: var(--accent-text-secondary);
  }
</style>
