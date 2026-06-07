<!-- components/WinGridView.vue -->
<template>
  <div class="win-grid-view">
    <div v-for="(item, index) in items" :key="index"
         class="win-grid-item"
         :class="{ selected: isSelected(item), clickEnabled: isItemClickEnabled }"
         :draggable="canDragItems"
         @click="onItemClick(item)"
         @dragstart="onDragStart($event, index)"
         @dragover="onDragOver"
         @drop="onDrop($event, index)">
      <div v-if="selectionMode === 'Multiple' || selectionMode === 'Extended'" class="grid-checkbox">
        <WinCheckBox :modelValue="isSelected(item)" @update:modelValue="toggleSelect(item)" />
      </div>
      <slot name="item" :item="item"></slot>
    </div>
  </div>
</template>
<script setup>
import WinCheckBox from './WinCheckBox.vue';

const props = defineProps({
  items: { type: Array, default: () => [] },
  isItemClickEnabled: { type: Boolean, default: true },
  canDragItems: { type: Boolean, default: false },
  canReorderItems: { type: Boolean, default: false },
  allowDrop: { type: Boolean, default: false },
  selectionMode: { type: String, default: 'Single' },
  selectedItems: { type: Array, default: () => [] }
});

const emit = defineEmits(['itemClick', 'selectionChanged', 'update:selectedItems', 'reorder']);

const isSelected = (item) => props.selectedItems.includes(item);

const toggleSelect = (item) => {
  let newSelection = [...props.selectedItems];
  if (props.selectionMode === 'Single') {
    newSelection = [item];
  } else {
    const idx = newSelection.indexOf(item);
    if (idx > -1) newSelection.splice(idx, 1);
    else newSelection.push(item);
  }
  emit('update:selectedItems', newSelection);
  emit('selectionChanged', newSelection);
};

const onItemClick = (item) => {
  if (props.isItemClickEnabled) emit('itemClick', item);
  if (props.selectionMode !== 'None' && props.selectionMode !== 'Multiple') {
    toggleSelect(item);
  }
};

let draggedIndex = null;
const onDragStart = (e, index) => { if (props.canDragItems) draggedIndex = index; };
const onDragOver = (e) => { if (props.allowDrop || props.canReorderItems) e.preventDefault(); };
const onDrop = (e, index) => {
  if (props.canReorderItems && draggedIndex !== null && draggedIndex !== index) {
    const newItems = [...props.items];
    const [removed] = newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, removed);
    emit('reorder', newItems);
  }
  draggedIndex = null;
};
</script>
<style src="../styles/gridview.css"></style>
