<template>
  <div class="win-grid-view" ref="containerRef"
       @dragover.prevent="onContainerDragOver"
       @drop="onContainerDrop"
       @dragleave="onContainerDragLeave">
    <TransitionGroup name="grid-flip" tag="div" class="win-grid-view-inner" ref="innerRef">
      <div v-for="entry in flatList" :key="entry.key"
           :class="entry.type === 'placeholder' ? 'win-grid-drop-placeholder' : {
             'win-grid-item': true,
             selected: isSelected(entry.item),
             clickEnabled: isItemClickEnabled && !isDragging,
             'drag-shrink': isDragging && !dragIndices.includes(entry.index),
             'dragging-source': isDragging && dragIndices.includes(entry.index)
           }"
           :style="entry.type === 'placeholder' ? { width: dragItemWidth + 'px', height: dragItemHeight + 'px' } : undefined"
           :draggable="entry.type === 'item' ? canDragItems : false"
           @click="entry.type === 'item' ? onItemClick($event, entry.item, entry.index) : null"
           @dragstart="entry.type === 'item' ? onDragStart($event, entry.index) : null"
           @dragend="entry.type === 'item' ? onDragEnd() : null">

        <template v-if="entry.type === 'item'">
          <div v-if="selectionMode === 'Multiple' || selectionMode === 'Extended'"
               class="grid-checkbox" @click.stop @mousedown.stop>
            <WinCheckBox :modelValue="isSelected(entry.item)" @update:modelValue="onCheckboxToggle($event, entry.item)" />
          </div>

          <div class="grid-item-inner">
            <slot name="item" :item="entry.item" :index="entry.index"></slot>
          </div>

          <div v-if="isDragging && entry.index === dragOriginIndex && dragIndices.length > 1"
               class="drag-count-badge">
            {{ dragIndices.length }}
          </div>
        </template>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import WinCheckBox from './WinCheckBox.vue';

const props = defineProps({
  ItemsSource: { type: Array, default: null },
  IsItemClickEnabled: { type: Boolean, default: undefined },
  CanDragItems: { type: Boolean, default: undefined },
  CanReorderItems: { type: Boolean, default: undefined },
  AllowDrop: { type: Boolean, default: undefined },
  SelectionMode: { type: String, default: undefined },
  SelectedItems: { type: Array, default: null },
  items: { type: Array, default: () => [] },
  isItemClickEnabled: { type: Boolean, default: true },
  canDragItems: { type: Boolean, default: false },
  canReorderItems: { type: Boolean, default: false },
  allowDrop: { type: Boolean, default: false },
  selectionMode: { type: String, default: 'Single' },
  selectedItems: { type: Array, default: () => [] }
});

const emit = defineEmits(['ItemClick', 'SelectionChanged', 'DragItemsStarting', 'DragItemsCompleted', 'itemClick', 'selectionChanged', 'update:SelectedItems', 'update:selectedItems', 'reorder']);

const containerRef = ref(null);
const innerRef = ref(null);
const isDragging = ref(false);
const dragIndices = ref([]);
const dragOriginIndex = ref(-1);
const insertSlotIndex = ref(-1);
const dragItemWidth = ref(0);
const dragItemHeight = ref(0);
let anchorIndex = null;
let lastSlotUpdateTime = 0;
let cachedRects = [];

const items = computed(() => props.ItemsSource ?? props.items);
const isItemClickEnabled = computed(() => props.IsItemClickEnabled ?? props.isItemClickEnabled);
const canDragItems = computed(() => props.CanDragItems ?? props.canDragItems);
const canReorderItems = computed(() => props.CanReorderItems ?? props.canReorderItems);
const allowDrop = computed(() => props.AllowDrop ?? props.allowDrop);
const selectionMode = computed(() => props.SelectionMode ?? props.selectionMode);
const selectedItems = computed(() => props.SelectedItems ?? props.selectedItems);

const getItemKey = (item, index) => item.id || item.title || index;
const isSelected = (item) => selectedItems.value.includes(item);

const emitSelection = (newSel) => {
  emit('update:SelectedItems', newSel);
  emit('update:selectedItems', newSel);
  emit('SelectionChanged', { AddedItems: newSel, RemovedItems: [], SelectedItems: newSel });
  emit('selectionChanged', newSel);
};

const onCheckboxToggle = (val, item) => {
  let newSel = [...selectedItems.value];
  const pos = newSel.indexOf(item);
  if (val && pos === -1) newSel.push(item);
  else if (!val && pos > -1) newSel.splice(pos, 1);
  emitSelection(newSel);
};

const onItemClick = (e, item, index) => {
  if (selectionMode.value === 'None') {
    if (isItemClickEnabled.value) {
      emit('ItemClick', { ClickedItem: item, OriginalSource: e.target });
      emit('itemClick', { ClickedItem: item, OriginalSource: e.target });
    }
    return;
  }
  if (selectionMode.value === 'Single') {
    if (isItemClickEnabled.value) {
      emit('ItemClick', { ClickedItem: item, OriginalSource: e.target });
      emit('itemClick', { ClickedItem: item, OriginalSource: e.target });
    }
    emitSelection([item]);
    anchorIndex = index;
    return;
  }
  if (selectionMode.value === 'Multiple') {
    let newSel = [...selectedItems.value];
    const pos = newSel.indexOf(item);
    if (pos > -1) newSel.splice(pos, 1);
    else newSel.push(item);
    emitSelection(newSel);
    if (isItemClickEnabled.value) {
      emit('ItemClick', { ClickedItem: item, OriginalSource: e.target });
      emit('itemClick', { ClickedItem: item, OriginalSource: e.target });
    }
    return;
  }
  if (selectionMode.value === 'Extended') {
    let newSel = [...selectedItems.value];
    if (e.ctrlKey) {
      const pos = newSel.indexOf(item);
      if (pos > -1) newSel.splice(pos, 1);
      else newSel.push(item);
      anchorIndex = index;
    } else if (e.shiftKey && anchorIndex !== null) {
      const start = Math.min(anchorIndex, index);
      const end = Math.max(anchorIndex, index);
      newSel = items.value.slice(start, end + 1);
    } else {
      newSel = [item];
      anchorIndex = index;
    }
    emitSelection(newSel);
    if (isItemClickEnabled.value) {
      emit('ItemClick', { ClickedItem: item, OriginalSource: e.target });
      emit('itemClick', { ClickedItem: item, OriginalSource: e.target });
    }
  }
};

const cacheNonDragRects = () => {
  const container = innerRef.value?.$el || innerRef.value;
  if (!container) return;
  const els = Array.from(container.querySelectorAll('.win-grid-item:not(.dragging-source)'));
  const nonDragIndices = [];
  for (let i = 0; i < items.value.length; i++) {
    if (!dragIndices.value.includes(i)) nonDragIndices.push(i);
  }
  cachedRects = [];
  for (let k = 0; k < Math.min(nonDragIndices.length, els.length); k++) {
    cachedRects.push({ itemIndex: nonDragIndices[k], rect: els[k].getBoundingClientRect() });
  }
};

const calcInsertSlot = (mouseX, mouseY) => {
  if (cachedRects.length === 0) return -1;

  const entries = cachedRects;
  const rows = [];
  let currentRowTop = -Infinity;
  for (const entry of entries) {
    if (Math.abs(entry.rect.top - currentRowTop) > entry.rect.height * 0.4) {
      rows.push([]);
      currentRowTop = entry.rect.top;
    }
    rows[rows.length - 1].push(entry);
  }

  let targetRow = null;
  for (const row of rows) {
    const rowTop = Math.min(...row.map(e => e.rect.top));
    const rowBottom = Math.max(...row.map(e => e.rect.bottom));
    if (mouseY >= rowTop && mouseY <= rowBottom) {
      targetRow = row;
      break;
    }
  }
  if (!targetRow) {
    if (rows.length > 0 && mouseY < rows[0][0].rect.top) {
      targetRow = rows[0];
    } else if (rows.length > 0) {
      targetRow = rows[rows.length - 1];
    } else {
      return -1;
    }
  }

  for (let k = 0; k < targetRow.length; k++) {
    const entry = targetRow[k];
    const itemCenter = entry.rect.left + entry.rect.width / 2;
    if (mouseX < itemCenter) {
      return entry.itemIndex;
    }
  }

  return items.value.length;
};

const showPlaceholderBefore = (index) => {
  if (!isDragging.value || insertSlotIndex.value === -1) return false;
  if (dragIndices.value.includes(index)) return false;

  if (insertSlotIndex.value >= items.value.length) return false;

  let nonDragPos = 0;
  for (let i = 0; i < index; i++) {
    if (!dragIndices.value.includes(i)) nonDragPos++;
  }

  let targetPos = 0;
  for (let i = 0; i < insertSlotIndex.value; i++) {
    if (!dragIndices.value.includes(i)) targetPos++;
  }

  return nonDragPos === targetPos && !dragIndices.value.includes(index);
};

const flatList = computed(() => {
  const list = [];
  for (let i = 0; i < items.value.length; i++) {
    if (showPlaceholderBefore(i)) {
      list.push({ type: 'placeholder', key: 'ph' });
    }
    list.push({ type: 'item', key: 'item-' + getItemKey(items.value[i], i), item: items.value[i], index: i });
  }
  if (isDragging.value && insertSlotIndex.value !== -1 && insertSlotIndex.value >= items.value.length) {
    list.push({ type: 'placeholder', key: 'ph' });
  }
  return list;
});

const onDragStart = (e, index) => {
  if (!canDragItems.value) return;
  const el = e.currentTarget;
  if (el) {
    dragItemWidth.value = el.offsetWidth;
    dragItemHeight.value = el.offsetHeight;
  }
  if (isSelected(items.value[index]) && selectedItems.value.length > 1) {
    dragIndices.value = items.value
      .map((it, i) => selectedItems.value.includes(it) ? i : -1)
      .filter(i => i !== -1);
  } else {
    dragIndices.value = [index];
  }
  dragOriginIndex.value = index;
  insertSlotIndex.value = -1;
  emit('DragItemsStarting', { Items: dragIndices.value.map(i => items.value[i]) });
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', '');

  requestAnimationFrame(() => {
    isDragging.value = true;
    nextTick(() => {
      cacheNonDragRects();
    });
  });
};

const onContainerDragOver = (e) => {
  if (!canReorderItems.value || !allowDrop.value) return;
  e.dataTransfer.dropEffect = 'move';

  const now = Date.now();
  if (now - lastSlotUpdateTime < 50) return;
  lastSlotUpdateTime = now;

  const slot = calcInsertSlot(e.clientX, e.clientY);
  if (slot === insertSlotIndex.value) return;
  if (slot === -1) return;

  const sorted = [...dragIndices.value].sort((a, b) => a - b);
  const minDrag = sorted[0];
  const maxDrag = sorted[sorted.length - 1];
  let contiguous = true;
  for (let i = minDrag; i <= maxDrag; i++) {
    if (!dragIndices.value.includes(i)) { contiguous = false; break; }
  }
  if (contiguous && slot >= minDrag && slot <= maxDrag + 1) {
    if (insertSlotIndex.value !== -1) insertSlotIndex.value = -1;
    return;
  }

  insertSlotIndex.value = slot;
};

const onContainerDragLeave = (e) => {
  if (!containerRef.value) return;
  const related = e.relatedTarget;
  if (related && containerRef.value.contains(related)) return;
  insertSlotIndex.value = -1;
};

const onContainerDrop = (e) => {
  if (!canReorderItems.value || !isDragging.value) return;
  e.preventDefault();
  performReorder();
};

const performReorder = () => {
  if (dragIndices.value.length === 0 || insertSlotIndex.value === -1) {
    resetDrag();
    return;
  }

  const draggedItems = dragIndices.value.map(i => items.value[i]);
  const remaining = items.value.filter((_, i) => !dragIndices.value.includes(i));

  let insertAt;
  if (insertSlotIndex.value >= items.value.length) {
    insertAt = remaining.length;
  } else {
    const targetItem = items.value[insertSlotIndex.value];
    insertAt = remaining.indexOf(targetItem);
    if (insertAt === -1) insertAt = remaining.length;
  }

  const newItems = [...remaining];
  newItems.splice(insertAt, 0, ...draggedItems);

  resetDrag();
  emit('DragItemsCompleted', { Items: draggedItems, DropResult: 'Move' });
  emit('reorder', newItems);
};

const resetDrag = () => {
  isDragging.value = false;
  dragIndices.value = [];
  dragOriginIndex.value = -1;
  insertSlotIndex.value = -1;
  cachedRects = [];
};

const onDragEnd = () => {
  resetDrag();
};
</script>

<style>
  .win-grid-view {
    display: flex;
    flex-direction: column;
  }

  .win-grid-view-inner {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    position: relative;
  }

  .win-grid-item {
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    border: 2px solid transparent;
    box-sizing: border-box;
    cursor: default;
    transition: transform 0.3s cubic-bezier(0.1, 0.9, 0.2, 1), filter 0.2s ease, opacity 0.2s ease, border-color 0.1s ease;
  }

    .win-grid-item.clickEnabled {
      cursor: pointer;
    }

      .win-grid-item.clickEnabled:hover {
        border-color: var(--stroke-divider, rgba(150, 150, 150, 0.4));
      }

      .win-grid-item.clickEnabled:active {
        border-color: transparent;
      }

    .win-grid-item.selected {
      border-color: var(--accent-base);
    }

      .win-grid-item.selected:hover {
        border-color: var(--accent-base);
      }

      .win-grid-item.selected:active {
        border-color: transparent;
      }

    .win-grid-item.dragging-source {
      visibility: hidden;
      pointer-events: none;
    }

    .win-grid-item.drag-shrink {
      transform: scale(0.95);
      filter: grayscale(0.15) brightness(0.92);
      opacity: 0.7;
    }

      .win-grid-item.drag-shrink::after {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.08);
        border-radius: 4px;
        pointer-events: none;
      }

  .grid-flip-move {
    transition: transform 0.3s cubic-bezier(0.1, 0.9, 0.2, 1);
  }

  .grid-flip-enter-active,
  .grid-flip-leave-active {
    transition: opacity 0.15s ease;
  }

  .grid-flip-enter-from,
  .grid-flip-leave-to {
    opacity: 0;
  }

  .grid-flip-leave-active {
    position: absolute;
  }

  .win-grid-drop-placeholder {
    border-radius: 4px;
    background: var(--accent-base, #0078d4);
    opacity: 0.15;
    flex-shrink: 0;
  }

  .grid-item-inner {
    width: 100%;
    height: 100%;
  }

  .grid-checkbox {
    position: absolute;
    top: 6px;
    right: 6px;
    z-index: 2;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .drag-count-badge {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--accent-base);
    color: #fff;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    z-index: 3;
    pointer-events: none;
  }
</style>
