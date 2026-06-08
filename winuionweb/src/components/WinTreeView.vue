<template>
  <div class="win-tree-view"
       :class="{ 'is-root': depth === 0 }"
       @dragover.prevent="onDragOverRoot"
       @drop.stop="onDropRoot">
    <div v-for="(node, idx) in items" :key="idx" class="win-tree-node">
      <div class="tree-item"
           :class="[
             { selected: isNodeSelected(node) },
             hoverState.idx === idx ? `drop-${hoverState.pos}` : ''
           ]"
           :style="{ paddingLeft: `${depth * 16 + 8}px` }"
           :draggable="canDragItems"
           @dragstart.stop="onDragStart($event, node, items, idx)"
           @dragover.prevent="onDragOverNode($event, idx)"
           @dragleave="onDragLeaveNode(idx)"
           @drop.stop="onDropNode($event, node, idx)"
           @click="toggleSelect(node)">

        <span class="icon tree-chevron"
              :class="{ expanded: node.expanded, hidden: !hasChildren(node) }"
              @click.stop="toggleExpand(node)">&#xE76C;</span>

        <div v-if="selectionMode === 'Multiple' || selectionMode === 'Extended'" class="tree-checkbox" @click.stop>
          <WinCheckBox :modelValue="getCheckValue(node) === true"
                       :indeterminate="getCheckValue(node) === null"
                       @update:modelValue="onCheck(node, $event)" />
        </div>

        <div class="tree-item-content">
          <slot name="item" :item="node"></slot>
        </div>
      </div>

      <div v-if="node.expanded && hasChildren(node)" class="tree-children">
        <WinTreeView v-model:items="node.children"
                     :selectionMode="selectionMode"
                     :canDragItems="canDragItems"
                     :allowDrop="allowDrop"
                     :depth="depth + 1"
                     :rootItems="rootRef">
          <template #item="{ item }">
            <slot name="item" :item="item"></slot>
          </template>
        </WinTreeView>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, defineProps, defineEmits } from 'vue';
import WinCheckBox from './WinCheckBox.vue';

const props = defineProps({
  items: { type: Array, default: () => [] },
  selectionMode: { type: String, default: 'Single' },
  canDragItems: { type: Boolean, default: false },
  allowDrop: { type: Boolean, default: false },
  depth: { type: Number, default: 0 },
  rootItems: { type: Array, default: null }
});

const emit = defineEmits(['update:items']);
const rootRef = computed(() => props.rootItems || props.items);
const hoverState = ref({ idx: -1, pos: null });

/* --- 复选与多级联动逻辑 --- */
const hasChildren = (node) => node.children && node.children.length > 0;

const isAllSelected = (node) => {
  if (!hasChildren(node)) return !!node.selected;
  return node.children.every(c => isAllSelected(c));
};

const isAnySelected = (node) => {
  if (!hasChildren(node)) return !!node.selected;
  return node.children.some(c => isAnySelected(c));
};

const getCheckValue = (node) => {
  if (!hasChildren(node)) return !!node.selected;
  if (isAllSelected(node)) return true;
  if (isAnySelected(node)) return null;
  return false;
};

const setAll = (n, state) => {
  n.selected = state;
  if (n.children) n.children.forEach(c => setAll(c, state));
};

const onCheck = (node, val) => {
  if (getCheckValue(node) === null) setAll(node, false);
  else setAll(node, val);
  emit('update:items', [...props.items]);
};

/* --- 选中及点击逻辑 --- */
const isNodeSelected = (node) => {
  if (props.selectionMode === 'Multiple') return getCheckValue(node) === true;
  return node.selected;
};

const clearSelection = (itemsArray) => {
  for (const item of itemsArray) {
    item.selected = false;
    if (item.children) clearSelection(item.children);
  }
};

const toggleSelect = (node) => {
  if (props.selectionMode === 'Single') {
    clearSelection(rootRef.value);
    node.selected = true;
  } else if (props.selectionMode === 'Multiple') {
    const current = getCheckValue(node);
    onCheck(node, current !== true);
  }
  emit('update:items', [...props.items]);
};

const toggleExpand = (node) => {
  node.expanded = !node.expanded;
  emit('update:items', [...props.items]);
};

/* --- 智能吸附与拖拽逻辑 --- */
const onDragStart = (e, node, parentArr, idx) => {
  if (!props.canDragItems) return;
  window.__treeDrag = { node, parentArr, idx };
  e.dataTransfer.effectAllowed = 'move';
};

const onDragOverNode = (e, idx) => {
  if (!props.allowDrop) return;
  e.preventDefault();
  e.stopPropagation();
  e.dataTransfer.dropEffect = 'move';

  // 计算鼠标在节点元素内的相对位置
  const rect = e.currentTarget.getBoundingClientRect();
  const y = e.clientY - rect.top;
  let pos = 'inside';
  if (y < rect.height * 0.25) pos = 'top';
  else if (y > rect.height * 0.75) pos = 'bottom';

  hoverState.value = { idx, pos };
};

const onDragLeaveNode = (idx) => {
  if (hoverState.value.idx === idx) {
    hoverState.value = { idx: -1, pos: null };
  }
};

const removeFromSource = () => {
  const drag = window.__treeDrag;
  if (!drag) return;
  const idx = drag.parentArr.indexOf(drag.node);
  if (idx > -1) drag.parentArr.splice(idx, 1);
};

const isDescendant = (parent, child) => {
  if (!parent.children) return false;
  for (const c of parent.children) {
    if (c === child || isDescendant(c, child)) return true;
  }
  return false;
};

const onDropNode = (e, targetNode, idx) => {
  if (!props.allowDrop) return;
  e.stopPropagation();
  const pos = hoverState.value.pos || 'inside';
  hoverState.value = { idx: -1, pos: null };

  const drag = window.__treeDrag;
  if (!drag || drag.node === targetNode || isDescendant(drag.node, targetNode)) return;

  removeFromSource();
  let newIdx = props.items.indexOf(targetNode);
  if (newIdx === -1) newIdx = idx;

  if (pos === 'top') {
    props.items.splice(newIdx, 0, drag.node);
  } else if (pos === 'bottom') {
    props.items.splice(newIdx + 1, 0, drag.node);
  } else {
    if (!targetNode.children) targetNode.children = [];
    targetNode.children.push(drag.node);
    targetNode.expanded = true;
  }

  window.__treeDrag = null;
  emit('update:items', [...props.items]);
};

const onDragOverRoot = (e) => {
  if (!props.allowDrop) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
};

const onDropRoot = (e) => {
  if (!props.allowDrop) return;
  e.stopPropagation();
  const drag = window.__treeDrag;
  if (!drag) return;
  removeFromSource();
  props.items.push(drag.node);
  window.__treeDrag = null;
  emit('update:items', [...props.items]);
};
</script>

<style src="../styles/treeview.css"></style>
