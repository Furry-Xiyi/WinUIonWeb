<template>
  <div class="win-combo-box" ref="comboRef">
    <button class="win-btn win-combo-btn"
            @click="toggle"
            @mousedown="onChevronDown"
            @mouseup="onChevronUp"
            @mouseleave="onChevronLeave">
      <span>{{ selectedLabel }}</span>
      <span class="icon chevron chevron-animate"
            :class="chevronClass"
            @animationend="onChevronAnimEnd">&#xE70D;</span>
    </button>
    <Teleport to="body">
      <div v-if="isOpen" class="win-combo-overlay" @click.stop="close" @contextmenu.prevent="close"></div>
      <div v-if="isOpen" class="win-combo-flyout" :style="flyoutStyle">
        <div class="win-flyout-item" v-for="(opt, i) in options" :key="i" :class="{ selected: selectedIndex === i }" @click="select(i)">
          <div v-if="selectedIndex === i" class="flyout-indicator"></div>
          {{ opt.label }}
        </div>
      </div>
    </Teleport>
  </div>
</template>
<script setup>import { ref, computed, nextTick } from 'vue';
const props = defineProps({ options: Array, modelValue: Number });
const emit = defineEmits(['update:modelValue']);
const isOpen = ref(false); const comboRef = ref(null); const flyoutStyle = ref({}); const flyoutOrigin = ref('center');
const selectedIndex = computed({ get: () => props.modelValue, set: (val) => emit('update:modelValue', val) });
const selectedLabel = computed(() => props.options[selectedIndex.value]?.label || 'Select...');
const chevronClass = ref('');
let chevronPressed = false;
let chevronPressDone = false;

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
const toggle = async () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    await nextTick();
    const rect = comboRef.value.getBoundingClientRect();
    const itemH = 34;
    const topOffset = rect.top - (selectedIndex.value * itemH) - 4;
    let origin = 'center center';
    if (selectedIndex.value === 0) {
      origin = 'top center';
    } else if (selectedIndex.value === props.options.length - 1) {
      origin = 'bottom center';
    }
    flyoutOrigin.value = origin;
    flyoutStyle.value = { top: `${Math.max(10, topOffset)}px`, left: `${rect.left}px`, minWidth: `${rect.width}px`, transformOrigin: origin };
  }
};
const select = (idx) => { selectedIndex.value = idx; isOpen.value = false; };
const close = () => { isOpen.value = false; };</script>
<style>
  .win-combo-box {
    position: relative;
    display: inline-block;
  }

  .win-combo-btn {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 120px;
  }

  .win-combo-overlay {
    position: fixed;
    inset: 0;
    z-index: 999;
  }

  .win-combo-flyout {
    position: absolute;
    border: 1px solid var(--stroke-surface-flyout);
    border-radius: 6px;
    padding: 4px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.14);
    background: var(--flyout-bg);
    backdrop-filter: var(--flyout-backdrop);
    -webkit-backdrop-filter: var(--flyout-backdrop);
    display: flex;
    flex-direction: column;
    gap: 2px;
    animation: picker-flyout-enter var(--fast-duration) var(--fast-out-slow-in);
    transform-origin: center center;
    min-width: 100%;
    width: max-content;
    z-index: 1000;
  }

    .win-combo-flyout .win-flyout-item {
      position: relative;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      background: transparent;
      color: var(--text-primary);
      transition: background var(--fast-duration) var(--fast-out-slow-in);
    }

      .win-combo-flyout .win-flyout-item:hover {
        background: var(--subtle-secondary);
      }

      .win-combo-flyout .win-flyout-item:active {
        background: var(--subtle-tertiary);
        color: var(--text-secondary);
      }

      .win-combo-flyout .win-flyout-item.selected {
        background: var(--subtle-secondary);
      }

        .win-combo-flyout .win-flyout-item.selected:hover {
          background: var(--subtle-tertiary);
        }

      .win-combo-flyout .win-flyout-item .flyout-indicator {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 16px;
        background: var(--accent-base);
        border-radius: 3px;
        transition: height var(--fast-duration) var(--fast-out-slow-in);
      }

      .win-combo-flyout .win-flyout-item.selected:active .flyout-indicator {
        height: 10px;
      }
</style>
