<template>
  <WinTextBlock class="page-header" :Text="$t('text.listview')" />
  <WinTextBlock class="page-description" :Text="$t('text.a-listview-displays-data-in-a-vertical-list-with')" TextWrapping="WrapWholeWords" />

  <WinTextBlock class="control-example-description" :Text="$t('text.basic-listview-with-selection-modes')" />

  <WinControlExample>
    <template #example>
      <div class="listview-demo-scroll">
        <WinListView :ItemsSource="contacts" :SelectionMode="basicMode" v-model:SelectedItems="singleSel">
          <template #item="{ item }">
            <WinTextBlock :Text="`${item.firstName} ${item.lastName} - ${item.company}`" />
          </template>
        </WinListView>
      </div>
    </template>
    <template #options>
      <div class="option-row">
        <WinTextBlock class="option-label" Text="Selection Mode:" />
        <WinComboBox :options="selModeOptions" v-model="basicModeIdx" style="width: 150px;" />
      </div>
    </template>
  </WinControlExample>

  <WinTextBlock class="control-example-description" Text="Grouped Data with Sticky Headers" />

  <WinControlExample>
    <template #example>
      <div class="listview-demo-scroll">
        <WinListView :ItemsSource="groups" IsGrouped showHeader :stickyHeader="stickyOn" SelectionMode="Single" v-model:SelectedItems="groupSel">
          <template #header="{ group }">
            {{ group.key }}
          </template>
          <template #item="{ item }">
            <div style="display: flex; flex-direction: column;">
              <WinTextBlock :Text="`${item.firstName} ${item.lastName}`" />
              <WinTextBlock style="font-size: 12px; color: var(--text-secondary);" :Text="item.company" />
            </div>
          </template>
        </WinListView>
      </div>

      <div class="option-row">
        <WinTextBlock class="option-label" Text="Sticky Headers:" />
        <WinToggleSwitch :modelValue="stickyOn" @update:modelValue="stickyOn = $event" onContent="On" offContent="Off" />
      </div>
    </template>
  </WinControlExample>

  <WinTextBlock class="control-example-description" Text="Drag to Reorder" />

  <WinControlExample>
    <template #example>
      <div class="listview-demo-scroll">
        <WinListView v-model:ItemsSource="dragList" SelectionMode="Single" v-model:SelectedItems="dragSel" CanDragItems CanReorderItems AllowDrop>
          <template #item="{ item }">
            <WinTextBlock :Text="`${item.firstName} ${item.lastName}`" />
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
import WinTextBlock from '../../components/WinTextBlock.vue';
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
.control-example-description {
  margin-top: 16px;
  font-weight: 600;
}
</style>
