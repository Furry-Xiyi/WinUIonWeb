<!-- components/WinListView.vue -->
<template>
  <div class="win-list-view" ref="containerRef">
    <div class="win-list-viewport" ref="listRef"
         @dragover.prevent="onViewportDragOver"
         @drop.prevent="onViewportDrop"
         @dragleave="onViewportDragLeave">
      <template v-if="isGrouped">
        <div v-for="(group, gIdx) in items" :key="gIdx" class="win-list-group">
          <div v-if="showHeader" class="win-list-header" :class="{ sticky: stickyHeader }">
            <slot name="header" :group="group">{{ group.key }}</slot>
          </div>
          <div v-for="(item, idx) in group.items" :key="idx"
               class="win-list-item"
               :class="{ selected: isSelected(item), clickEnabled: isItemClickEnabled }"
               :draggable="canDragItems"
               @click="onItemClick($event, item)"
               @dragstart="onDragStartGrouped($event, {gIdx, idx})"
               @dragover.prevent
               @drop.prevent>
            <div class="list-indicator" :class="{ active: isSelected(item) }"></div>
            <slot name="item" :item="item"></slot>
          </div>
        </div>
      </template>
      <template v-else>
        <div v-if="showHeader" class="win-list-header" :class="{ sticky: stickyHeader }">
          <slot name="header"></slot>
        </div>
        <div v-for="(item, idx) in internalItems" :key="idx"
             ref="itemEls"
             class="win-list-item"
             :class="{
       selected: isSelected(item),
       clickEnabled: isItemClickEnabled && !isDragging,
       'drag-shrink': isDragging && !dragIndices.includes(idx),
       'dragging-source': isDragging && dragIndices.includes(idx)
     }"
             :style="getItemStyle(idx)"
             :draggable="canDragItems"
             @click="onItemClick($event, item)"
             @dragstart="onDragStart($event, idx)"
             @dragend="onDragEnd">
          <div class="list-indicator" :class="{ active: isSelected(item) }"></div>
          <slot name="item" :item="item"></slot>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, toRaw, nextTick, watch } from 'vue';

const props = defineProps({
  items: { type: Array, default: () => [] },
  isGrouped: { type: Boolean, default: false },
  showHeader: { type: Boolean, default: false },
  stickyHeader: { type: Boolean, default: false },
  isItemClickEnabled: { type: Boolean, default: true },
  canDragItems: { type: Boolean, default: false },
  canReorderItems: { type: Boolean, default: false },
  allowDrop: { type: Boolean, default: false },
  selectionMode: { type: String, default: 'Single' },
  selectedItems: { type: Array, default: () => [] }
});

const emit = defineEmits(['itemClick', 'selectionChanged', 'update:selectedItems', 'update:items']);

const internalItems = ref([...props.items]);

watch(() => props.items, (val) => {
  if (!isDragging.value) internalItems.value = [...val];
}, { deep: true });

const containerRef = ref(null);
const listRef = ref(null);
const itemEls = ref([]);
const isDragging = ref(false);
const dragIndices = ref([]);
const insertBeforeIndex = ref(-1);
let dragItemHeight = 0;
let anchorIndex = null;
let lastCalcTime = 0;
let cachedMidpoints = [];

const isSelected = (item) => {
  const rawTarget = toRaw(item);
  return props.selectedItems.some(i => toRaw(i) === rawTarget);
};

const emitSelection = (newSel) => {
  emit('update:selectedItems', newSel);
  emit('selectionChanged', newSel);
};

const onItemClick = (event, item) => {
  if (isDragging.value) return;
  const rawTarget = toRaw(item);
  if (props.isItemClickEnabled) emit('itemClick', item);
  if (props.selectionMode === 'None') return;

  let newSel = [...props.selectedItems];
  if (props.selectionMode === 'Single') {
    newSel = [rawTarget];
    anchorIndex = internalItems.value.indexOf(item);
  } else if (props.selectionMode === 'Multiple') {
    const idx = newSel.findIndex(i => toRaw(i) === rawTarget);
    if (idx > -1) newSel.splice(idx, 1);
    else newSel.push(rawTarget);
  } else if (props.selectionMode === 'Extended') {
    if (event.ctrlKey) {
      const idx = newSel.findIndex(i => toRaw(i) === rawTarget);
      if (idx > -1) newSel.splice(idx, 1);
      else newSel.push(rawTarget);
      anchorIndex = internalItems.value.indexOf(item);
    } else if (event.shiftKey && anchorIndex !== null) {
      const currentIdx = internalItems.value.indexOf(item);
      const start = Math.min(anchorIndex, currentIdx);
      const end = Math.max(anchorIndex, currentIdx);
      newSel = internalItems.value.slice(start, end + 1).map(i => toRaw(i));
    } else {
      newSel = [rawTarget];
      anchorIndex = internalItems.value.indexOf(item);
    }
  }
  emitSelection(newSel);
};

const getItemStyle = (idx) => {
  if (!isDragging.value) return undefined;
  if (dragIndices.value.includes(idx)) return undefined;

  const shrinkScale = 'scale(0.99)';

  if (insertBeforeIndex.value === -1) {
    return { transform: shrinkScale };
  }

  let nonDragPos = 0;
  for (let i = 0; i < idx; i++) {
    if (!dragIndices.value.includes(i)) nonDragPos++;
  }

  let insertNonDragPos;
  if (insertBeforeIndex.value >= props.items.length) {
    insertNonDragPos = props.items.length - dragIndices.value.length;
  } else {
    insertNonDragPos = 0;
    for (let i = 0; i < insertBeforeIndex.value; i++) {
      if (!dragIndices.value.includes(i)) insertNonDragPos++;
    }
  }

  if (nonDragPos >= insertNonDragPos) {
    return { transform: `${shrinkScale} translateY(${dragItemHeight}px)` };
  }
  return { transform: shrinkScale };
};

const cacheMidpoints = () => {
  const viewport = listRef.value;
  if (!viewport) return;
  const els = viewport.querySelectorAll('.win-list-item');
  cachedMidpoints = [];
  els.forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    cachedMidpoints.push({ index: i, midY: rect.top + rect.height / 2 });
  });
};

const onDragStart = (e, index) => {
  if (!props.canDragItems || props.isGrouped) return;

  const el = e.currentTarget;
  if (el) dragItemHeight = el.offsetHeight;

  if (isSelected(props.items[index]) && props.selectedItems.length > 1) {
    dragIndices.value = props.items
      .map((it, i) => props.selectedItems.some(s => toRaw(s) === toRaw(it)) ? i : -1)
      .filter(i => i !== -1);
  } else {
    dragIndices.value = [index];
  }

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', '');

  requestAnimationFrame(() => {
    isDragging.value = true;
    nextTick(() => { cacheMidpoints(); });
  });
};

const onDragStartGrouped = (e, target) => {
  if (!props.canDragItems) return;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', '');
};

const onViewportDragOver = (e) => {
  if (!props.canReorderItems || !props.allowDrop || !isDragging.value || props.isGrouped) return;
  e.dataTransfer.dropEffect = 'move';

  const now = Date.now();
  if (now - lastCalcTime < 40) return;
  lastCalcTime = now;

  const mouseY = e.clientY;

  const nonDragMidpoints = cachedMidpoints.filter(m => !dragIndices.value.includes(m.index));
  if (nonDragMidpoints.length === 0) return;

  let slot = props.items.length;
  for (let k = 0; k < nonDragMidpoints.length; k++) {
    if (mouseY < nonDragMidpoints[k].midY) {
      slot = nonDragMidpoints[k].index;
      break;
    }
  }

  const sorted = [...dragIndices.value].sort((a, b) => a - b);
  const minD = sorted[0];
  const maxD = sorted[sorted.length - 1];
  let contiguous = (maxD - minD + 1) === sorted.length;
  if (contiguous && slot >= minD && slot <= maxD + 1) {
    if (insertBeforeIndex.value !== -1) insertBeforeIndex.value = -1;
    return;
  }

  if (slot !== insertBeforeIndex.value) {
    insertBeforeIndex.value = slot;
  }
};

const onViewportDragLeave = (e) => {
  const viewport = listRef.value;
  if (!viewport) return;
  const related = e.relatedTarget;
  if (related && viewport.contains(related)) return;
  insertBeforeIndex.value = -1;
};

const onViewportDrop = () => {
  if (!props.canReorderItems || !isDragging.value || insertBeforeIndex.value === -1) {
    resetDrag();
    return;
  }

  const draggedItems = dragIndices.value.sort((a, b) => a - b).map(i => internalItems.value[i]);
  const remaining = internalItems.value.filter((_, i) => !dragIndices.value.includes(i));

  let actualInsert;
  if (insertBeforeIndex.value >= internalItems.value.length) {
    actualInsert = remaining.length;
  } else {
    actualInsert = 0;
    for (let i = 0; i < insertBeforeIndex.value; i++) {
      if (!dragIndices.value.includes(i)) actualInsert++;
    }
  }

  const newItems = [...remaining];
  newItems.splice(actualInsert, 0, ...draggedItems);
  internalItems.value = newItems;
  emit('update:items', newItems);
  resetDrag();
};

const resetDrag = () => {
  isDragging.value = false;
  dragIndices.value = [];
  insertBeforeIndex.value = -1;
  cachedMidpoints = [];
};

const onDragEnd = () => { resetDrag(); };
</script>

<style>
  /* styles/listview.css */
  .win-list-view {
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    animation: win-list-root-reveal 0ms 250ms forwards;
  }

  @keyframes win-list-root-reveal {
    to {
      overflow: visible;
    }
  }

  .win-list-viewport {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow-y: hidden;
    overflow-x: clip;
    scrollbar-width: thin;
    position: relative;
    animation: win-list-scroll-reveal 0ms 300ms forwards;
  }

  @keyframes win-list-scroll-reveal {
    to {
      overflow-y: auto;
    }
  }

  .win-list-group {
    display: block;
    width: 100%;
  }

  .win-list-header {
    padding: 8px 12px;
    font-weight: 600;
    font-size: 16px;
    background: var(--app-bg);
    z-index: 5;
  }

    .win-list-header.sticky {
      position: sticky;
      top: 0;
    }

  .win-list-item {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    padding: 8px 12px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 36px;
    transition: background var(--fast-duration), transform 0.25s cubic-bezier(0.1, 0.9, 0.2, 1), opacity 0.2s ease;
  }

    .win-list-item.clickEnabled {
      cursor: pointer;
    }

      .win-list-item.clickEnabled:hover {
        background: var(--subtle-secondary);
      }

    .win-list-item.selected {
      background: var(--subtle-secondary);
    }

      .win-list-item.selected:hover {
        background: var(--subtle-tertiary);
      }

    .win-list-item.dragging-source {
      opacity: 0.3;
      pointer-events: none;
    }

    .win-list-item.drag-shrink {
      padding-top: 6px;
      padding-bottom: 6px;
    }

      .win-list-item.drag-shrink::after {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(128, 128, 128, 0.08);
        border-radius: 4px;
        pointer-events: none;
      }

  .list-indicator {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 0;
    background: var(--accent-base);
    border-radius: 3px;
    transition: height var(--fast-duration) var(--fast-out-slow-in);
  }

    .list-indicator.active {
      height: 16px;
    }

  .win-list-item:active .list-indicator.active {
    height: 10px;
  }
</style>
