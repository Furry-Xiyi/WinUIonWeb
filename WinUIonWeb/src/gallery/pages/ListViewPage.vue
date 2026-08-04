<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.listview')" />
          <WinTextBlock class="page-description" :Text="$t('text.a-listview-displays-data-in-a-vertical-list-with')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @click="toggleTheme"><span class="icon">&#xE793;</span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.listview.basic-simple-datatemplate')" :theme="pageTheme" :vue="basicListViewVue">
              <template #example>
                <div class="sample-stack">
                  <WinTextBlock :Text="$t('sample.listview.basic-note')" TextWrapping="WrapWholeWords" />
                  <div class="listview-demo-scroll narrow">
                    <WinListView :ItemsSource="contacts" SelectionMode="Single">
                      <template #item="{ item }">
                        <WinTextBlock :Text="item.Name" />
                      </template>
                    </WinListView>
                  </div>
                </div>
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.listview.selection-support')" :theme="pageTheme" :vue="selectionListViewVue">
              <template #example>
                <div class="sample-stack">
                  <WinTextBlock
                    :Text="$t('sample.listview.selection-note')"
                    TextWrapping="WrapWholeWords" />
                  <div class="listview-demo-scroll">
                    <WinListView :ItemsSource="contacts" :SelectionMode="selectionMode" v-model:SelectedItems="selectionSelected">
                      <template #item="{ item }">
                        <div class="contact-template">
                          <div class="contact-avatar" />
                          <div>
                            <WinTextBlock :Text="item.Name" />
                            <WinTextBlock class="caption-text" :Text="item.Company" />
                          </div>
                        </div>
                      </template>
                    </WinListView>
                  </div>
                </div>
              </template>
              <template #options>
                <WinComboBox Header="SelectionMode" :ItemsSource="selectionModeOptions" v-model:SelectedIndex="selectionModeIndex" />
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.listview.drag-drop-reordering')" :theme="pageTheme" :vue="dragDropListViewVue">
              <template #example>
                <div class="sample-stack">
                  <WinTextBlock :Text="$t('sample.listview.drag-drop-note')" TextWrapping="WrapWholeWords" />
                  <div class="listview-demo-scroll">
                    <WinListView v-model:ItemsSource="dragList" SelectionMode="Single" v-model:SelectedItems="dragSel" CanDragItems CanReorderItems AllowDrop>
                      <template #item="{ item }">
                        <WinTextBlock :Text="item.Name" />
                      </template>
                    </WinListView>
                  </div>
                </div>
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.listview.grouped-headers')" :theme="pageTheme" :vue="groupedListViewVue">
              <template #example>
                <div class="sample-stack">
                  <WinTextBlock :Text="$t('sample.listview.grouped-note')" TextWrapping="WrapWholeWords" />
                  <div class="listview-demo-scroll">
                    <WinListView :ItemsSource="groups" IsGrouped :AreStickyGroupHeadersEnabled="stickyOn" SelectionMode="Single" v-model:SelectedItems="groupSel">
                      <template #header="{ group }">
                        <WinTextBlock class="group-header" :Text="group.key" />
                      </template>
                      <template #item="{ item }">
                        <div class="contact-template">
                          <div class="contact-avatar" />
                          <div>
                            <WinTextBlock :Text="item.Name" />
                            <WinTextBlock class="caption-text" :Text="item.Company" />
                          </div>
                        </div>
                      </template>
                    </WinListView>
                  </div>
                </div>
              </template>
              <template #options>
                <WinToggleSwitch :Header="$t('sample.sticky-headers')" v-model="stickyOn" />
              </template>
            </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, ref, watch } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinComboBox from '../../components/WinComboBox.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinListView from '../../components/WinListView.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleSwitch from '../../components/WinToggleSwitch.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'listview');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);
const selectionModeOptions = ['None', 'Single', 'Multiple', 'Extended'];
const selectionModeIndex = ref(1);
const selectionMode = computed(() => selectionModeOptions[selectionModeIndex.value]);
const stickyOn = ref(false);

const contacts = [
  { FirstName: 'Adam', LastName: 'Smith', Company: 'Microsoft', Name: 'Adam Smith' },
  { FirstName: 'Bill', LastName: 'Gates', Company: 'TerraPower', Name: 'Bill Gates' },
  { FirstName: 'Clara', LastName: 'Oswald', Company: 'UNIT', Name: 'Clara Oswald' },
  { FirstName: 'David', LastName: 'Chen', Company: 'Apple', Name: 'David Chen' },
  { FirstName: 'Eve', LastName: 'Torres', Company: 'Google', Name: 'Eve Torres' },
  { FirstName: 'Frank', LastName: 'Wright', Company: 'Adobe', Name: 'Frank Wright' },
  { FirstName: 'Grace', LastName: 'Hopper', Company: 'Navy', Name: 'Grace Hopper' },
  { FirstName: 'Henry', LastName: 'Ford', Company: 'Ford', Name: 'Henry Ford' }
];

const groups = [
  { key: 'A', items: contacts.filter(item => item.LastName.startsWith('S')) },
  { key: 'B', items: contacts.filter(item => item.LastName.startsWith('G')) },
  { key: 'C', items: contacts.filter(item => item.LastName.startsWith('O') || item.LastName.startsWith('C')) },
  { key: 'D', items: contacts.filter(item => item.LastName.startsWith('T') || item.LastName.startsWith('W')) },
  { key: 'F', items: contacts.filter(item => item.LastName.startsWith('F') || item.LastName.startsWith('H')) }
].filter(group => group.items.length > 0);

const dragList = ref(contacts.slice(0, 5));
const selectionSelected = ref([]);
const groupSel = ref([]);
const dragSel = ref([]);

watch(selectionMode, () => { selectionSelected.value = []; });

const basicListViewVue = `<WinListView :ItemsSource="contacts" SelectionMode="Single">
  <template #item="{ item }">
    <WinTextBlock :Text="item.Name" />
  </template>
</WinListView>`;

const selectionListViewVue = `<WinListView :ItemsSource="contacts" :SelectionMode="selectionMode" v-model:SelectedItems="selectionSelected">
  <template #item="{ item }">
    <WinTextBlock :Text="item.Name" />
  </template>
</WinListView>`;

const dragDropListViewVue = `<WinListView v-model:ItemsSource="dragList" SelectionMode="Single" CanDragItems CanReorderItems AllowDrop>
  <template #item="{ item }">
    <WinTextBlock :Text="item.Name" />
  </template>
</WinListView>`;

const groupedListViewVue = `<WinListView :ItemsSource="groups" IsGrouped :AreStickyGroupHeadersEnabled="stickyOn" SelectionMode="Single">
  <template #header="{ group }">
    <WinTextBlock :Text="group.key" />
  </template>
  <template #item="{ item }">
    <WinTextBlock :Text="item.Name" />
  </template>
</WinListView>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.sample-stack { display: flex; flex-direction: column; gap: 15px; width: 100%; }
.listview-demo-scroll { width: 400px; max-width: 100%; height: 400px; border: 1px solid var(--card-stroke); background: var(--card-bg); }
.listview-demo-scroll.narrow { width: 350px; }
.listview-demo-scroll .win-list-view { width: 100%; height: 100%; }
.contact-template { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 12px; min-width: 0; }
.contact-avatar { width: 32px; height: 32px; margin: 6px; border-radius: 50%; background: var(--ctrl-strong-stroke-default); }
.caption-text { color: var(--text-secondary); font-size: 12px; }
.group-header { font-size: 20px; font-weight: 600; }
</style>
