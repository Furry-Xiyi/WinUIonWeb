<!-- components/WinListBox.vue -->
<template>
  <WinScrollViewer
    class="win-list-box"
    VerticalScrollMode="Auto"
    VerticalScrollBarVisibility="Auto"
    HorizontalScrollMode="Disabled"
    HorizontalScrollBarVisibility="Disabled">
    <div class="win-list-box-items">
      <div v-for="(item, index) in items" :key="index"
           class="win-list-box-item"
           :class="{ selected: isSelected(item, index) }"
           @click="select(index)">
        <slot name="item" :item="item"><WinTextBlock :Text="String(item)" /></slot>
      </div>
    </div>
  </WinScrollViewer>
</template>
<script setup>
import { computed, ref, toRaw } from 'vue';
import WinScrollViewer from './WinScrollViewer.vue';
import WinTextBlock from './WinTextBlock.vue';

const props = defineProps({
  ItemsSource: { type: Array, default: null },
  SelectedIndex: { type: Number, default: undefined },
  SelectedItem: { type: [Object, String, Number, Boolean], default: undefined },
  SelectedItems: { type: Array, default: null },
  SelectionMode: { type: String, default: undefined },
  items: { type: Array, default: () => [] },
  selectedIndex: { type: Number, default: -1 },
  selectionMode: { type: String, default: 'Single' }
});

const emit = defineEmits(['update:SelectedIndex', 'update:SelectedItem', 'update:SelectedItems', 'SelectionChanged', 'update:selectedIndex', 'selectionChanged']);

const internalSelectedItems = ref([]);
const items = computed(() => props.ItemsSource ?? props.items);
const selectionMode = computed(() => props.SelectionMode ?? props.selectionMode);
const selectedIndex = computed(() => props.SelectedIndex ?? props.selectedIndex);
const selectedItems = computed(() => props.SelectedItems ?? internalSelectedItems.value);

const isSame = (a, b) => toRaw(a) === toRaw(b);

const isSelected = (item, index) => {
  if (selectionMode.value === 'Multiple' || selectionMode.value === 'Extended') {
    return selectedItems.value.some((selected) => isSame(selected, item));
  }
  return selectedIndex.value === index || isSame(props.SelectedItem, item);
};

const select = (index) => {
  const item = items.value[index];
  if (selectionMode.value === 'None') return;
  if (selectionMode.value === 'Multiple' || selectionMode.value === 'Extended') {
    const next = [...selectedItems.value];
    const existing = next.findIndex((selected) => isSame(selected, item));
    if (existing >= 0) next.splice(existing, 1);
    else next.push(item);
    internalSelectedItems.value = next;
    emit('update:SelectedItems', next);
    emit('SelectionChanged', { AddedItems: existing >= 0 ? [] : [item], RemovedItems: existing >= 0 ? [item] : [], SelectedItems: next });
    emit('selectionChanged', next);
    return;
  }
  emit('update:SelectedIndex', index);
  emit('update:SelectedItem', item);
  emit('update:selectedIndex', index);
  emit('SelectionChanged', { AddedItems: [item], RemovedItems: [], SelectedIndex: index, SelectedItem: item });
  emit('selectionChanged', index);
};
</script>
<style>
  /* styles/listbox.css */
  .win-list-box {
    position: relative;
    isolation: isolate;
    background: transparent;
    border: 1px solid var(--card-stroke);
    border-radius: 0;
    -webkit-backdrop-filter: var(--flyout-backdrop, blur(30px));
    backdrop-filter: var(--flyout-backdrop, blur(30px));
  }

  .win-list-box::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    border-radius: inherit;
    background: var(--card-bg);
  }

  .win-list-box-items {
    display: flex;
    flex-direction: column;
  }

  .win-list-box-item {
    padding: 8px 12px;
    border-radius: 0;
    cursor: pointer;
    transition: background var(--fast-duration);
  }

    .win-list-box-item:hover {
      background: var(--subtle-secondary);
    }

    .win-list-box-item.selected {
      background: var(--accent-base);
      color: var(--accent-text);
    }
</style>
