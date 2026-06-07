<!-- components/WinTreeViewNode.vue -->
<template>
  <div class="win-tree-node" :draggable="canDragItems" @dragstart.stop="onDragStart" @dragover.prevent @drop.stop="onDrop">
    <div class="tree-item win-list-item" :class="{ selected: isSelected }" @click="toggleSelect">
      <span class="icon tree-chevron" :class="{ expanded: node.expanded, hidden: !hasChildren }" @click.stop="toggleExpand">&#xE76C;</span>
      <div v-if="selectionMode === 'Multiple' || selectionMode === 'Extended'" class="list-checkbox">
        <WinCheckBox :modelValue="checkState" @update:modelValue="onCheck" :isChild="depth > 0" />
      </div>
      <slot name="item" :item="node"></slot>
    </div>
    <div v-if="node.expanded && hasChildren" class="tree-children">
      <WinTreeViewNode v-for="(child, idx) in node.children" :key="idx"
                       :node="child" :depth="depth + 1"
                       :selectionMode="selectionMode"
                       :canDragItems="canDragItems"
                       :allowDrop="allowDrop"
                       @update-tree="$emit('update-tree', $event)"
                       @drag-node="$emit('drag-node', $event)">
        <template #item="{ item }">
          <slot name="item" :item="item"></slot>
        </template>
      </WinTreeViewNode>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import WinCheckBox from './WinCheckBox.vue';

const props = defineProps({
  node: Object, depth: { type: Number, default: 0 },
  selectionMode: String, canDragItems: Boolean, allowDrop: Boolean
});
const emit = defineEmits(['update-tree', 'drag-node']);

const hasChildren = computed(() => props.node.children && props.node.children.length > 0);
const isSelected = computed(() => props.node.selected);

const checkState = computed(() => {
  if (!hasChildren.value) return !!props.node.selected;
  const selectedCount = props.node.children.filter(c => c.selected).length;
  if (selectedCount === 0) return false;
  if (selectedCount === props.node.children.length) return true;
  return null;
});

const onCheck = (val) => {
  const setAll = (n, state) => { n.selected = state; if (n.children) n.children.forEach(c => setAll(c, state)); };
  if (checkState.value === null) setAll(props.node, false);
  else setAll(props.node, val);
  emit('update-tree');
};

const toggleExpand = () => {
  props.node.expanded = !props.node.expanded;
  emit('update-tree');
};

const toggleSelect = () => {
  if (props.selectionMode === 'Single') {
    props.node.selected = true;
  }
  emit('update-tree');
};

const onDragStart = () => { if (props.canDragItems) emit('drag-node', props.node); };

const onDrop = () => {
  if (props.allowDrop) {
    const dragged = window.__treeDragNode;
    if (dragged && dragged !== props.node) {
      if (!props.node.children) props.node.children = [];
      props.node.children.push(dragged);
      props.node.expanded = true;
      emit('update-tree', { action: 'move', node: dragged, target: props.node });
    }
  }
};
</script>
