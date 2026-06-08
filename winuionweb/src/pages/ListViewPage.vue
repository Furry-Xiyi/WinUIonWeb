<template>
  <h1 class="page-header">ListView</h1>
  <WinSettingsCard contentPlacement="bottom">
    <template #header>
      Basic ListView
    </template>
    <template #description>
      Select contacts from the list.
    </template>
    <template #headerAction>
      <WinComboBox :options="selModeOptions" v-model="basicModeIdx" />
    </template>
    <div class="listview-demo-scroll">
      <WinListView :items="contacts" :selectionMode="basicMode" v-model:selectedItems="singleSel">
        <template #item="{ item }">
          <span>{{ item.firstName }} {{ item.lastName }} — {{ item.company }}</span>
        </template>
      </WinListView>
    </div>
  </WinSettingsCard>
  <WinSettingsCard contentPlacement="bottom">
    <template #header>
      Grouped Data
    </template>
    <template #description>
      Contacts grouped by first letter.
    </template>
    <template #headerAction>
      <WinToggleSwitch :modelValue="stickyOn" @update:modelValue="stickyOn = $event" onContent="Sticky" offContent="Static" />
    </template>
    <div class="listview-demo-scroll">
      <WinListView :items="groups" isGrouped showHeader :stickyHeader="stickyOn" selectionMode="Multiple" v-model:selectedItems="groupSel">
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
    </div>
  </WinSettingsCard>
  <WinSettingsCard contentPlacement="bottom">
    <template #header>
      Drag to Reorder
    </template>
    <template #description>
      Drag items up and down to change order.
    </template>
    <div class="listview-demo-scroll">
      <WinListView v-model:items="dragList" selectionMode="Single" v-model:selectedItems="dragSel" canDragItems canReorderItems allowDrop>
        <template #item="{ item }">
          <span>{{ item.firstName }} {{ item.lastName }}</span>
        </template>
      </WinListView>
    </div>
  </WinSettingsCard>
</template>

<script setup>import { ref, computed, watch } from 'vue';
import WinListView from '../components/WinListView.vue';
import WinSettingsCard from '../components/WinSettingsCard.vue';
import WinComboBox from '../components/WinComboBox.vue';
import WinToggleSwitch from '../components/WinToggleSwitch.vue';

const selModeOptions = [
  { label: 'Single' },
  { label: 'Multiple' },
  { label: 'Extended' },
  { label: 'None' }
];
const basicModeIdx = ref(0);
const basicMode = computed(() => selModeOptions[basicModeIdx.value].label);
const stickyOn = ref(false);

watch(basicMode, () => { singleSel.value = []; });

const contacts = [
  { firstName: 'Adam', lastName: 'Smith', company: 'Microsoft' },
  { firstName: 'Bill', lastName: 'Gates', company: 'TerraPower' },
  { firstName: 'Clara', lastName: 'Oswald', company: 'UNIT' },
  { firstName: 'David', lastName: 'Chen', company: 'Apple' },
  { firstName: 'Eve', lastName: 'Torres', company: 'Google' },
  { firstName: 'Frank', lastName: 'Wright', company: 'Adobe' },
  { firstName: 'Grace', lastName: 'Hopper', company: 'Navy' },
  { firstName: 'Henry', lastName: 'Ford', company: 'Ford' }
];

const groups = [
  { key: 'A', items: [{ firstName: 'Adam', lastName: 'Smith', company: 'Microsoft' }, { firstName: 'Alfred', lastName: 'Nobel', company: 'Stockholm' }] },
  { key: 'B', items: [{ firstName: 'Bill', lastName: 'Gates', company: 'TerraPower' }] },
  { key: 'C', items: [{ firstName: 'Clara', lastName: 'Oswald', company: 'UNIT' }] },
  { key: 'D', items: [{ firstName: 'David', lastName: 'Chen', company: 'Apple' }] },
  { key: 'E', items: [{ firstName: 'Eve', lastName: 'Torres', company: 'Google' }] }
];

const dragList = ref([
  { firstName: 'Adam', lastName: 'Smith' },
  { firstName: 'Bill', lastName: 'Gates' },
  { firstName: 'Clara', lastName: 'Oswald' },
  { firstName: 'David', lastName: 'Chen' },
  { firstName: 'Eve', lastName: 'Torres' }
]);

const singleSel = ref([]);
const groupSel = ref([]);
const dragSel = ref([]);</script>

<style scoped>
  .listview-demo-scroll {
    width: 100%;
    height: 300px;
    border: 1px solid var(--card-stroke);
    border-radius: 8px;
    background: var(--card-bg);
    display: block;
    position: relative;
    overflow: visible;
  }

    .listview-demo-scroll .win-list-view {
      width: 100%;
      height: 100%;
      border-radius: 7px;
      padding: 0;
    }
</style>
