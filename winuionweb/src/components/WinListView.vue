<!-- components/WinListView.vue -->
<template>
  <div class="win-list-view">
    <template v-if="isGrouped">
      <div v-for="(group, gIdx) in items" :key="gIdx" class="win-list-group">
        <div v-if="showHeader" class="win-list-header" :class="{ sticky: stickyHeader }">
          <slot name="header" :group="group">{{ group.key }}</slot>
        </div>
        <div v-for="(item, idx) in group.items" :key="idx"
             class="win-list-item"
             :class="{ selected: isSelected(item), clickEnabled: isItemClickEnabled }"
             :draggable="canDragItems"
             @click="onItemClick(item)"
             @dragstart="onDragStart($event, {gIdx, idx})"
             @dragover="onDragOver"
             @drop="onDrop($event, {gIdx, idx})">
          <div v-if="isSelected(item)" class="list-indicator"></div>
          <div v-if="selectionMode === 'Multiple' || selectionMode === 'Extended'" class="list-checkbox">
            <WinCheckBox :modelValue="isSelected(item)" @update:modelValue="toggleSelect(item)" />
          </div>
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
           @click="onItemClick(item)"
           @dragstart="onDragStart($event, idx)"
           @dragover="onDragOver"
           @drop="onDrop($event, idx)">
        <div v-if="isSelected(item)" class="list-indicator"></div>
        <div v-if="selectionMode === 'Multiple' || selectionMode === 'Extended'" class="list-checkbox">
          <WinCheckBox :modelValue="isSelected(item)" @update:modelValue="toggleSelect(item)" />
        </div>
        <slot name="item" :item="item"></slot>
      </div>
    </template>
  </div>
</template>
<script setup>
import WinCheckBox from './WinCheckBox.vue';

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

const isSelected = (item) => props.selectedItems.includes(item);

const toggleSelect = (item) => {
  let newSel = [...props.selectedItems];
  if (props.selectionMode === 'Single') {
    newSel = [item];
  } else {
    const i = newSel.indexOf(item);
    if (i > -1) newSel.splice(i, 1); else newSel.push(item);
  }
  emit('update:selectedItems', newSel);
  emit('selectionChanged', newSel);
};

const onItemClick = (item) => {
  if (props.isItemClickEnabled) emit('itemClick', item);
  if (props.selectionMode !== 'None' && props.selectionMode !== 'Multiple') {
    toggleSelect(item);
  }
};

let dragTarget = null;
const onDragStart = (e, target) => { if (props.canDragItems) dragTarget = target; };
const onDragOver = (e) => { if (props.canReorderItems) e.preventDefault(); };
const onDrop = (e, dropTarget) => {
  if (props.canReorderItems && dragTarget !== null) emit('reorder', { from: dragTarget, to: dropTarget });
  dragTarget = null;
};
</script>
<style src="../styles/listview.css"></style>
