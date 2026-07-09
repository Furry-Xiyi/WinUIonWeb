<template>
  <h1 class="page-header">{{ $t('text.listview') }}</h1>
  <p class="page-description">{{ $t('text.a-listview-displays-data-in-a-vertical-list-with') }}</p>

  <WinTextBlock class="control-example-description" :Text="$t('text.basic-listview-with-selection-modes')" />

  <WinControlExample>
    <template #example>
      <div class="listview-demo-scroll">
        <WinListView :items="contacts" :selectionMode="basicMode" v-model:selectedItems="singleSel">
          <template #item="{ item }">
            <span>{{ item.firstName }} {{ item.lastName }} — {{ item.company }}</span>
          </template>
        </WinListView>
      </div>
    </template>
    <template #options>
      <div class="option-row">
        <span class="option-label">Selection Mode:</span>
        <WinComboBox :options="selModeOptions" v-model="basicModeIdx" style="width: 150px;" />
      </div>
    </template>
  </WinControlExample>

  <WinTextBlock class="control-example-description" Text="Grouped Data with Sticky Headers" />

  <WinControlExample>
    <template #example>
      <div class="listview-demo-scroll">
        <WinListView :items="groups" isGrouped showHeader :stickyHeader="stickyOn" selectionMode="Single" v-model:selectedItems="groupSel">
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

      <div class="option-row">
        <span class="option-label">Sticky Headers:</span>
        <WinToggleSwitch :modelValue="stickyOn" @update:modelValue="stickyOn = $event" onContent="On" offContent="Off" />
      </div>
    </template>
  </WinControlExample>

  <WinTextBlock class="control-example-description" Text="Drag to Reorder" />

  <WinControlExample>
    <template #example>
      <div class="listview-demo-scroll">
        <WinListView v-model:items="dragList" selectionMode="Single" v-model:selectedItems="dragSel" canDragItems canReorderItems allowDrop>
          <template #item="{ item }">
            <span>{{ item.firstName }} {{ item.lastName }}</span>
          </template>
        </WinListView>
      </div>
    </template>
  </WinControlExample>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import WinListView from '../../components/WinListView.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinComboBox from '../../components/WinComboBox.vue';
import WinToggleSwitch from '../../components/WinToggleSwitch.vue';

import { useI18n } from '../../components/i18n/index';

const { t } = useI18n();
const selModeOptions = [
  { label: t('text.single') },
  { label: t('text.multiple') },
  { label: t('text.extended') },
  { label: t('text.none') }
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
const dragSel = ref([]);
</script>

<style scoped>
.option-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.option-label {
  font-size: 14px;
  color: var(--text-primary);
}

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
