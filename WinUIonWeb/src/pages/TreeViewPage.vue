<template>
  <h1 class="page-header">TreeView</h1>
  <WinSettingsCard contentPlacement="bottom">
    <template #header>
      Basic TreeView
    </template>
    <template #description>
      Expand, collapse, and select nodes.
    </template>
    <WinTreeView v-model:items="basicTree" selectionMode="Single">
      <template #item="{ item }">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="icon">{{ item.children?.length ? '\uE8B7' : '\uE719' }}</span>
          {{ item.label }}
        </div>
      </template>
    </WinTreeView>
  </WinSettingsCard>

  <WinSettingsCard contentPlacement="bottom">
    <template #header>
      Multi-select with Checkboxes
    </template>
    <template #description>
      Select multiple items. Parent shows indeterminate state when partially selected. Drag supported!
    </template>
    <WinTreeView v-model:items="multiTree" selectionMode="Multiple" canDragItems allowDrop>
      <template #item="{ item }">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="icon">{{ item.children?.length ? '\uE8B7' : '\uE719' }}</span>
          {{ item.label }}
        </div>
      </template>
    </WinTreeView>
  </WinSettingsCard>

  <WinSettingsCard contentPlacement="bottom">
    <template #header>
      Drag & Drop Grouping
    </template>
    <template #description>
      Drag up/down edges to reorder as siblings. Drag to center to group. Drag to bottom blank area to ungroup to root.
    </template>
    <WinTreeView v-model:items="dragTree" selectionMode="Single" canDragItems allowDrop>
      <template #item="{ item }">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="icon">{{ item.children?.length ? '\uE8B7' : '\uE719' }}</span>
          {{ item.label }}
        </div>
      </template>
    </WinTreeView>
  </WinSettingsCard>
</template>

<script setup>
import { ref } from 'vue';
import WinTreeView from '../components/WinTreeView.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';

const basicTree = ref([
  { label: 'Documents', expanded: true, selected: false, children: [
    { label: 'Project Alpha', selected: false },
    { label: 'Budget.xlsx', selected: false }
  ]},
  { label: 'Music', expanded: false, selected: false, children: [
    { label: 'Track 1.mp3', selected: false }
  ]}
]);

const multiTree = ref([
  { label: 'Photos', expanded: true, selected: false, children: [
    { label: 'Vacation', selected: false },
    { label: 'Family', selected: false },
    { label: 'Work', selected: false }
  ]},
  { label: 'Videos', expanded: false, selected: false, children: [
    { label: 'Tutorial.mp4', selected: false }
  ]}
]);

const dragTree = ref([
  { label: 'File A', selected: false },
  { label: 'File B', selected: false },
  { label: 'File C', selected: false },
  { label: 'File D', selected: false }
]);
</script>
