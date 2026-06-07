<!-- components/WinTreeView.vue -->
<template>
  <div class="win-tree-view">
    <WinTreeViewNode v-for="(node, idx) in items" :key="idx"
                     :node="node" :depth="0"
                     :selectionMode="selectionMode"
                     :canDragItems="canDragItems"
                     :allowDrop="allowDrop"
                     @update-tree="onUpdate"
                     @drag-node="onDragStartNode">
      <template #item="{ item }">
        <slot name="item" :item="item"></slot>
      </template>
    </WinTreeViewNode>
  </div>
</template>
<script setup>
import WinTreeViewNode from './WinTreeViewNode.vue';

const props = defineProps({
  items: { type: Array, default: () => [] },
  selectionMode: { type: String, default: 'Single' },
  canDragItems: { type: Boolean, default: true },
  allowDrop: { type: Boolean, default: true }
});

const emit = defineEmits(['update:items']);

const onUpdate = (payload) => {
  if (payload && payload.action === 'move') {
    const removeNode = (arr, n) => {
      const idx = arr.indexOf(n);
      if (idx > -1) { arr.splice(idx, 1); return true; }
      for (const child of arr) {
        if (child.children && removeNode(child.children, n)) return true;
      }
      return false;
    };
    removeNode(props.items, payload.node);
  }
  emit('update:items', [...props.items]);
};

const onDragStartNode = (node) => {
  window.__treeDragNode = node;
};
</script>
<style src="../styles/treeview.css"></style>
