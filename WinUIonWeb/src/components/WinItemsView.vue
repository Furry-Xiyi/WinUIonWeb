<!-- components/WinItemsView.vue -->
<template>
  <div class="win-items-view" ref="containerRef">
    <div
      class="win-items-viewport"
      ref="viewportRef"
      :class="{ 'layout-stack': layout === 'Stack', 'layout-grid': layout === 'Grid' }"
    >
      <div
        v-for="(item, idx) in internalItems"
        :key="getItemKey(item, idx)"
        ref="itemEls"
        class="win-items-container"
        :class="{
          selected: isSelected(item),
          'can-invoke': isItemInvokedEnabled,
          'pointer-over': hoverIndex === idx
        }"
        :style="getItemStyle(idx)"
        @click="onItemClick($event, item, idx)"
        @dblclick="onItemDoubleClick(item, idx)"
        @mouseenter="hoverIndex = idx"
        @mouseleave="hoverIndex = -1"
        @keydown.enter="onItemEnterKey(item, idx)"
        :tabindex="0"
      >
        <div v-if="(selectionMode === 'Multiple' || selectionMode === 'Extended') && layout === 'Grid'"
             class="items-checkbox">
          <WinCheckBox
            :modelValue="isSelected(item)"
            @update:modelValue="onCheckboxToggle($event, item, idx)"
            @click.stop
            @mousedown.stop
          />
        </div>

        <slot name="item" :item="item" :index="idx">
          <div class="default-item-template">
            {{ item }}
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, toRaw } from 'vue';
import WinCheckBox from './WinCheckBox.vue';

const props = defineProps({
  itemsSource: { type: Array, default: () => [] },
  layout: { type: String, default: 'Stack' }, // 'Stack' | 'Grid'
  selectionMode: { type: String, default: 'None' }, // 'None' | 'Single' | 'Multiple' | 'Extended'
  isItemInvokedEnabled: { type: Boolean, default: false },
  selectedItems: { type: Array, default: () => [] }
});

const emit = defineEmits([
  'itemInvoked',
  'selectionChanged',
  'update:selectedItems'
]);

const containerRef = ref(null);
const viewportRef = ref(null);
const itemEls = ref([]);
const internalItems = ref([...props.itemsSource]);
const hoverIndex = ref(-1);
let anchorIndex = null;

watch(() => props.itemsSource, (val) => {
  internalItems.value = [...val];
}, { deep: true });

const getItemKey = (item, index) => {
  if (item && typeof item === 'object') {
    return item.id ?? item.key ?? item.name ?? index;
  }
  return index;
};

const isSelected = (item) => {
  const rawTarget = toRaw(item);
  return props.selectedItems.some(i => toRaw(i) === rawTarget);
};

const emitSelection = (newSel) => {
  emit('update:selectedItems', newSel);
  emit('selectionChanged', newSel);
};

const onCheckboxToggle = (val, item, idx) => {
  let newSel = [...props.selectedItems];
  const rawTarget = toRaw(item);
  const pos = newSel.findIndex(i => toRaw(i) === rawTarget);
  if (val && pos === -1) newSel.push(rawTarget);
  else if (!val && pos > -1) newSel.splice(pos, 1);
  anchorIndex = idx;
  emitSelection(newSel);
};

const onItemClick = (event, item, idx) => {
  if (props.selectionMode === 'None') return;

  const rawTarget = toRaw(item);
  let newSel = [...props.selectedItems];

  if (props.selectionMode === 'Single') {
    newSel = [rawTarget];
    anchorIndex = idx;
  } else if (props.selectionMode === 'Multiple') {
    const pos = newSel.findIndex(i => toRaw(i) === rawTarget);
    if (pos > -1) newSel.splice(pos, 1);
    else newSel.push(rawTarget);
    anchorIndex = idx;
  } else if (props.selectionMode === 'Extended') {
    if (event.ctrlKey) {
      const pos = newSel.findIndex(i => toRaw(i) === rawTarget);
      if (pos > -1) newSel.splice(pos, 1);
      else newSel.push(rawTarget);
      anchorIndex = idx;
    } else if (event.shiftKey && anchorIndex !== null) {
      const start = Math.min(anchorIndex, idx);
      const end = Math.max(anchorIndex, idx);
      newSel = internalItems.value.slice(start, end + 1).map(i => toRaw(i));
    } else {
      newSel = [rawTarget];
      anchorIndex = idx;
    }
  }

  emitSelection(newSel);
};

const onItemDoubleClick = (item, idx) => {
  if (props.isItemInvokedEnabled) {
    emit('itemInvoked', { item, index: idx });
  }
};

const onItemEnterKey = (item, idx) => {
  if (props.isItemInvokedEnabled) {
    emit('itemInvoked', { item, index: idx });
  }
};

const getItemStyle = (idx) => {
  return undefined;
};
</script>

<style scoped>
.win-items-view {
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.win-items-viewport {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  position: relative;
}

.win-items-viewport.layout-stack {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.win-items-viewport.layout-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
  padding: 8px;
}

.win-items-container {
  position: relative;
  box-sizing: border-box;
  border-radius: 4px;
  transition: background var(--fast-duration), border-color var(--fast-duration), transform 0.1s ease;
  outline: none;
}

.layout-stack .win-items-container {
  padding: 8px 12px;
  min-height: 40px;
  display: flex;
  align-items: center;
  border: 1px solid transparent;
}

.layout-grid .win-items-container {
  padding: 12px;
  min-height: 100px;
  border: 2px solid transparent;
}

.win-items-container.can-invoke {
  cursor: pointer;
}

.win-items-container.pointer-over {
  background: var(--subtle-secondary);
}

.win-items-container.selected {
  background: var(--subtle-secondary);
}

.layout-stack .win-items-container.selected {
  border-left: 3px solid var(--accent-base);
  padding-left: 9px;
}

.layout-grid .win-items-container.selected {
  border-color: var(--accent-base);
}

.win-items-container:focus-visible {
  outline: 2px solid var(--accent-base);
  outline-offset: 1px;
}

.win-items-container.selected:hover {
  background: var(--subtle-tertiary);
}

.items-checkbox {
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 2;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--layer-subtle, rgba(255, 255, 255, 0.8));
  border-radius: 2px;
  padding: 2px;
}

.default-item-template {
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--text-primary);
}

/* Smooth scrolling */
.win-items-viewport {
  scroll-behavior: smooth;
}

/* Visual states */
.win-items-container:active {
  transform: scale(0.98);
}

.layout-grid .win-items-container:active {
  transform: scale(0.97);
}

/* Disabled state */
.win-items-container:disabled,
.win-items-container[aria-disabled="true"] {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>




