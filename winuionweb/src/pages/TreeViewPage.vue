<template>
  <h1 class="page-header">TreeView</h1>
  <WinSettingsCard>
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
  <WinSettingsCard>
    <template #header>
      Multi-select with Checkboxes
    </template>
    <template #description>
      Select multiple items. Parent shows indeterminate state when partially selected.
    </template>
    <WinTreeView v-model:items="multiTree" selectionMode="Multiple">
      <template #item="{ item }">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="icon">{{ item.children?.length ? '\uE8B7' : '\uE719' }}</span>
          {{ item.label }}
        </div>
      </template>
    </WinTreeView>
  </WinSettingsCard>
  <WinSettingsCard>
    <template #header>
      Drag & Drop Grouping
    </template>
    <template #description>
      Drag items onto others to form groups. Drag children out to ungroup.
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
