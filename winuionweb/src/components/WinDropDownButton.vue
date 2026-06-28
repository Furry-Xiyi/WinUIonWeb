<template>
  <div class="win-dropdown-btn-wrap" ref="wrap">
    <button class="win-btn win-dropdown-btn"
            @click="toggle"
            @mousedown="onChevronDown"
            @mouseup="onChevronUp"
            @mouseleave="onChevronLeave">
      <span><slot></slot></span>
      <span class="icon win-dd-chevron chevron-animate"
            :class="[chevronClass, { open: isOpen }]"
            @animationend="onChevronAnimEnd">&#xE70D;</span>
    </button>
    <WinMenuFlyout :open="isOpen" :anchorRect="anchorRect" :items="flyoutItems" @close="isOpen = false" @select="onSelect" />
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import WinMenuFlyout from './WinMenuFlyout.vue';
const props = defineProps({ items: { type: Array, default: () => [] } });
const emit = defineEmits(['select']);
const wrap = ref(null);
const isOpen = ref(false);
const anchorRect = ref(null);
const chevronClass = ref('');
let chevronPressed = false;
let chevronPressDone = false;

const flyoutItems = computed(() => props.items.map(item => ({ label: item, value: item })));

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

const toggle = () => {
  if (isOpen.value) { isOpen.value = false; return; }
  const r = wrap.value.getBoundingClientRect();
  anchorRect.value = { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width, height: r.height };
  isOpen.value = true;
};
const onSelect = (item) => { emit('select', item.value); isOpen.value = false; };
</script>
<style>
  .win-dd-chevron {
    font-size: 12px;
    display: inline-block;
  }

  .win-dropdown-btn-wrap {
    position: relative;
    display: inline-flex;
  }

  .win-dropdown-btn {
    gap: 8px;
  }
</style>
