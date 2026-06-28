<template>
  <div class="win-split-button" ref="wrap">
    <button class="win-btn" @click="$emit('click')"><slot></slot></button>
    <div class="win-btn-separator"></div>
    <button class="win-btn win-btn-chevron"
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
const props = defineProps({ options: { type: Array, default: () => [] } });
const emit = defineEmits(['click', 'select']);
const wrap = ref(null);
const isOpen = ref(false);
const anchorRect = ref(null);
const chevronClass = ref('');
let chevronPressed = false;
let chevronPressDone = false;

const flyoutItems = computed(() => props.options.map(item => ({ label: item, value: item })));

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
const onSelect = (item) => { emit('select', item.value); isOpen.value = false; };
</script>
<style>
  .win-split-button {
    position: relative;
    display: inline-flex;
    border-radius: 4px;
    overflow: hidden;
    border: none;
    height: 32px;
    background: var(--ctrl-fill-default);
  }

    .win-split-button::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 4px;
      border: 1px solid var(--ctrl-border);
      border-bottom: 1px solid var(--ctrl-border-accent);
      pointer-events: none;
    }

    .win-split-button .win-btn {
      border: none;
      border-radius: 0;
      background: transparent;
      height: 100%;
      position: static;
    }

      .win-split-button .win-btn::after {
        display: none;
      }

      .win-split-button .win-btn:hover {
        background: var(--ctrl-fill-secondary);
      }

      .win-split-button .win-btn:active {
        background: var(--ctrl-fill-tertiary);
      }

    .win-split-button .win-btn-separator {
      width: 1px;
      background: var(--ctrl-border);
      margin: 0;
    }

    .win-split-button .win-btn-chevron {
      padding: 0 8px;
    }

      .win-split-button .win-btn-chevron .icon {
        font-size: 12px;
        display: inline-block;
      }

      .win-split-button .win-btn-chevron:active .icon {
        transform: translateY(1px);
      }

  html.theme-dark .win-split-button::after {
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-top: 1px solid rgba(255, 255, 255, 0.09);
  }

  @media (prefers-color-scheme: dark) {
    html:not(.theme-light) .win-split-button::after {
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-top: 1px solid rgba(255, 255, 255, 0.09);
    }
  }
</style>
