<template>
  <h1 class="page-header">ListView</h1>
  <WinSettingsCard contentPlacement="bottom">
    <template #header>
      Single Selection
    </template>
    <template #description>
      Select one contact from the list.
    </template>
    <WinListView :items="contacts" selectionMode="Single" v-model:selectedItems="singleSel">
      <template #item="{ item }">
        <span>{{ item.firstName }} {{ item.lastName }} — {{ item.company }}</span>
      </template>
    </WinListView>
  </WinSettingsCard>
  <WinSettingsCard contentPlacement="bottom">
    <template #header>
      Grouped Data
    </template>
    <template #description>
      Contacts grouped by first letter with sticky headers.
    </template>
    <WinListView :items="groups" isGrouped showHeader stickyHeader selectionMode="Single" v-model:selectedItems="groupSel">
      <template #header="{ group }">
        {{ group.key }}
      </template>
      <template #item="{ item }">
        <div style="display: flex; flex-direction: column;">
          <span>{{ item.firstName }} {{ item.lastName }}</span>
          <span style="font-size: 12px; color: var(--text-secondary);">{{ item.company }}</span>
        </div>
      </template>
    </WinListView>
  </WinSettingsCard>
  <WinSettingsCard contentPlacement="bottom">
    <template #header>
      Drag to Reorder
    </template>
    <template #description>
      Drag items up and down to change order.
    </template>
    <WinListView :items="dragList" selectionMode="None" canDragItems canReorderItems @reorder="onReorder">
      <template #item="{ item }">
        <span>{{ item.firstName }} {{ item.lastName }}</span>
      </template>
    </WinListView>
  </WinSettingsCard>
</template>

<script setup>
import { ref } from 'vue';
import WinListView from '../components/WinListView.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';

const contacts = [
  { firstName: 'Adam', lastName: 'Smith', company: 'Microsoft' },
  { firstName: 'Bill', lastName: 'Gates', company: 'TerraPower' },
  { firstName: 'Clara', lastName: 'Oswald', company: 'UNIT' }
];

const groups = [
  { key: 'A', items: [{ firstName: 'Adam', lastName: 'Smith', company: 'Microsoft' }, { firstName: 'Alfred', lastName: 'Nobel', company: 'Stockholm' }] },
  { key: 'B', items: [{ firstName: 'Bill', lastName: 'Gates', company: 'TerraPower' }] },
  { key: 'C', items: [{ firstName: 'Clara', lastName: 'Oswald', company: 'UNIT' }] }
];

const dragList = ref([
  { firstName: 'Adam', lastName: 'Smith' },
  { firstName: 'Bill', lastName: 'Gates' },
  { firstName: 'Clara', lastName: 'Oswald' }
]);

const singleSel = ref([]);
const groupSel = ref([]);

const onReorder = ({ from, to }) => {
  const arr = [...dragList.value];
  const [removed] = arr.splice(from, 1);
  arr.splice(to, 0, removed);
  dragList.value = arr;
};
</script>
