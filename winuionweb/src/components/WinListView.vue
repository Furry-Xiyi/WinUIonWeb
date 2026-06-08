<!-- components/WinListView.vue -->
<template>
  <div class="win-list-view">
    <div class="win-list-viewport" ref="listRef">
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
               @dragstart="onDragStart($event, {gIdx, idx})"
               @dragover="onDragOver"
               @drop="onDrop($event, {gIdx, idx})">
            <div class="list-indicator" :class="{ active: isSelected(item) }"></div>
            <slot name="item" :item="item"></slot>
          </div>
        </div>
      </template>
      <template v-else>
        <div v-if="showHeader" class="win-list-header" :class="{ sticky: stickyHeader }">
          <slot name="header"></slot>
        </div>
        <div v-for="(item, idx) in items" :key="idx"
             class="win-list-item"
             :class="{ selected: isSelected(item), clickEnabled: isItemClickEnabled }"
             :draggable="canDragItems"
             @click="onItemClick($event, item)"
             @dragstart="onDragStart($event, idx)"
             @dragover="onDragOver"
             @drop="onDrop($event, idx)">
          <div class="list-indicator" :class="{ active: isSelected(item) }"></div>
          <slot name="item" :item="item"></slot>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup>import { ref, toRaw } from 'vue';

const props = defineProps({
  items: { type: Array, default: () => [] },
  isGrouped: { type: Boolean, default: false },
  showHeader: { type: Boolean, default: false },
  stickyHeader: { type: Boolean, default: false },
  isItemClickEnabled: { type: Boolean, default: true },
  canDragItems: { type: Boolean, default: false },
  canReorderItems: { type: Boolean, default: false },
  selectionMode: { type: String, default: 'Single' },
  selectedItems: { type: Array, default: () => [] }
});

const emit = defineEmits(['itemClick', 'selectionChanged', 'update:selectedItems', 'reorder']);
const listRef = ref(null);

const isSelected = (item) => {
  const rawTarget = toRaw(item);
  return props.selectedItems.some(i => toRaw(i) === rawTarget);
};

const toggleSelect = (event, item) => {
  const rawTarget = toRaw(item);
  let newSel = [...props.selectedItems];
  if (props.selectionMode === 'None') return;

  if (props.selectionMode === 'Single') {
    newSel = [rawTarget];
  } else if (props.selectionMode === 'Multiple') {
    const idx = newSel.findIndex(i => toRaw(i) === rawTarget);
    if (idx > -1) newSel.splice(idx, 1);
    else newSel.push(rawTarget);
  } else if (props.selectionMode === 'Extended') {
    if (event && event.ctrlKey) {
      const idx = newSel.findIndex(i => toRaw(i) === rawTarget);
      if (idx > -1) newSel.splice(idx, 1);
      else newSel.push(rawTarget);
    } else {
      newSel = [rawTarget];
    }
  }

  emit('update:selectedItems', newSel);
  emit('selectionChanged', newSel);
};

const onItemClick = (event, item) => {
  if (props.isItemClickEnabled) emit('itemClick', item);
  if (props.selectionMode !== 'None') {
    toggleSelect(event, item);
  }
};

let dragTarget = null;
const onDragStart = (e, target) => { if (props.canDragItems) dragTarget = target; };
const onDragOver = (e) => { if (props.canReorderItems) e.preventDefault(); };
const onDrop = (e, dropTarget) => {
  if (props.canReorderItems && dragTarget !== null) emit('reorder', { from: dragTarget, to: dropTarget });
  dragTarget = null;
};</script>
<style src="../styles/listview.css"></style>
