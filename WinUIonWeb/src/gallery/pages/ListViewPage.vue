<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.listview')" />
          <WinTextBlock class="page-description" :Text="$t('text.a-listview-displays-data-in-a-vertical-list-with')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon">&#xE793;</span></WinButton>
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
                        <WinTextBlock :Text="item.Name" Margin="0,5" />
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
                          <div class="contact-text">
                            <WinTextBlock class="contact-name" :Text="item.Name" />
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
                  <WinGrid class="drag-list-grid" ColumnDefinitions="*,*" ColumnSpacing="12">
                    <WinListView
                      v-model:ItemsSource="dragListLeft"
                      v-model:SelectedItems="dragSelectionLeft"
                      Height="400"
                      MinWidth="350"
                      Margin="12"
                      BorderBrush="var(--ControlStrongStrokeColorDefaultBrush, var(--ctrl-strong-stroke))"
                      BorderThickness="1"
                      SelectionMode="Single"
                      CanDragItems
                      CanReorderItems
                      AllowDrop
                      @DragItemsStarting="beginListDrag($event, 'Left')"
                      @DragItemsCompleted="activeListDrag = null"
                      @Drop="completeListDrop($event, 'Left')">
                      <template #item="{ item }">
                        <WinTextBlock :Text="item.Name" />
                      </template>
                    </WinListView>
                    <WinListView
                      v-model:ItemsSource="dragListRight"
                      v-model:SelectedItems="dragSelectionRight"
                      Height="400"
                      MinWidth="350"
                      BorderBrush="var(--ControlStrongStrokeColorDefaultBrush, var(--ctrl-strong-stroke))"
                      BorderThickness="1"
                      SelectionMode="Single"
                      CanDragItems
                      CanReorderItems
                      AllowDrop
                      @DragItemsStarting="beginListDrag($event, 'Right')"
                      @DragItemsCompleted="activeListDrag = null"
                      @Drop="completeListDrop($event, 'Right')">
                      <template #item="{ item }">
                        <WinTextBlock :Text="item.Name" />
                      </template>
                    </WinListView>
                  </WinGrid>
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
                        <WinTextBlock class="group-header" :Text="group.Key" />
                      </template>
                      <template #item="{ item }">
                        <div class="contact-template">
                          <div class="contact-avatar" />
                          <div class="contact-text">
                            <WinTextBlock class="contact-name" :Text="item.Name" />
                            <WinTextBlock class="caption-text" :Text="item.Company" />
                          </div>
                        </div>
                      </template>
                    </WinListView>
                  </div>
                </div>
              </template>
              <template #options>
                <WinToggleSwitch :Header="$t('sample.sticky-headers')" v-model:IsOn="stickyOn" />
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
import WinGrid from '../../components/WinGrid.vue';
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
  { Key: 'A', Items: contacts.filter(item => item.LastName.startsWith('S')) },
  { Key: 'B', Items: contacts.filter(item => item.LastName.startsWith('G')) },
  { Key: 'C', Items: contacts.filter(item => item.LastName.startsWith('O') || item.LastName.startsWith('C')) },
  { Key: 'D', Items: contacts.filter(item => item.LastName.startsWith('T') || item.LastName.startsWith('W')) },
  { Key: 'F', Items: contacts.filter(item => item.LastName.startsWith('F') || item.LastName.startsWith('H')) }
].filter(group => group.Items.length > 0);

const dragListLeft = ref(contacts.slice(0, 4));
const dragListRight = ref(contacts.slice(4));
const selectionSelected = ref([]);
const groupSel = ref([]);
const dragSelectionLeft = ref([]);
const dragSelectionRight = ref([]);
const activeListDrag = ref(null);

const beginListDrag = (args, Source) => {
  activeListDrag.value = { Source, Items: args.Items };
};

const completeListDrop = (args, target) => {
  const drag = activeListDrag.value;
  if (!drag || drag.Source === target) return;

  const source = drag.Source === 'Left' ? dragListLeft : dragListRight;
  const destination = target === 'Left' ? dragListLeft : dragListRight;
  const insertion = Math.max(0, Math.min(args.InsertIndex, destination.value.length));
  const moved = drag.Items.filter(item => source.value.includes(item));
  source.value = source.value.filter(item => !moved.includes(item));
  destination.value = [
    ...destination.value.slice(0, insertion),
    ...moved,
    ...destination.value.slice(insertion)
  ];
  dragSelectionLeft.value = dragSelectionLeft.value.filter(item => !moved.includes(item));
  dragSelectionRight.value = dragSelectionRight.value.filter(item => !moved.includes(item));
  activeListDrag.value = null;
};

watch(selectionMode, () => { selectionSelected.value = []; });

const basicListViewVue = `<WinListView ItemsSource="contacts" SelectionMode="Single">
  <WinListView.ItemTemplate>
    <WinDataTemplate>
      <WinTextBlock Text="item.Name" />
    </WinDataTemplate>
  </WinListView.ItemTemplate>
</WinListView>`;

const selectionListViewVue = `<WinListView ItemsSource="contacts" SelectionMode="selectionMode" SelectedItems="selectionSelected">
  <WinListView.ItemTemplate>
    <WinDataTemplate>
      <WinTextBlock Text="item.Name" />
    </WinDataTemplate>
  </WinListView.ItemTemplate>
</WinListView>`;

const dragDropListViewVue = `<WinGrid ColumnDefinitions="*,*" ColumnSpacing="12">
  <WinListView
    ItemsSource="dragListLeft"
    Height="400"
    MinWidth="350"
    Margin="12"
    BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}"
    BorderThickness="1"
    SelectionMode="Single"
    CanDragItems="True"
    CanReorderItems="True"
    AllowDrop="True"
    DragItemsStarting="ListView_DragItemsStarting"
    DragItemsCompleted="ListView_DragItemsCompleted"
    Drop="ListView_Drop" />

  <WinListView
    ItemsSource="dragListRight"
    Height="400"
    MinWidth="350"
    BorderBrush="{ThemeResource ControlStrongStrokeColorDefaultBrush}"
    BorderThickness="1"
    SelectionMode="Single"
    CanDragItems="True"
    CanReorderItems="True"
    AllowDrop="True"
    DragItemsStarting="ListView_DragItemsStarting"
    DragItemsCompleted="ListView_DragItemsCompleted"
    Drop="ListView_Drop" />
</WinGrid>`;

const groupedListViewVue = `<WinListView ItemsSource="groups" IsGrouped="True" AreStickyGroupHeadersEnabled="stickyOn" SelectionMode="Single">
  <WinListView.GroupHeaderTemplate>
    <WinDataTemplate>
      <WinTextBlock Text="group.Key" />
    </WinDataTemplate>
  </WinListView.GroupHeaderTemplate>
  <WinListView.ItemTemplate>
    <WinDataTemplate>
      <WinTextBlock Text="item.Name" />
    </WinDataTemplate>
  </WinListView.ItemTemplate>
</WinListView>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.sample-stack { display: flex; flex-direction: column; gap: 15px; width: 100%; }
.listview-demo-scroll { width: 400px; max-width: 100%; height: 400px; border: 1px solid var(--ControlStrongStrokeColorDefaultBrush, var(--ctrl-strong-stroke)); background: transparent; }
.listview-demo-scroll.narrow { width: 350px; }
.listview-demo-scroll .win-list-view { width: 100%; height: 100%; }
.contact-template { display: grid; grid-template-columns: auto 1fr; grid-template-rows: 1fr 1fr; min-width: 0; }
.contact-avatar { grid-row: 1 / 3; width: 32px; height: 32px; margin: 6px; place-self: center; border-radius: 50%; background: var(--ControlStrongFillColorDefaultBrush, var(--ctrl-strong-fill)); }
.contact-text { display: contents; }
.contact-name { grid-column: 2; grid-row: 1; margin: 6px 0 0 12px; }
.caption-text { grid-column: 2; grid-row: 2; margin: 0 0 6px 12px; color: var(--TextFillColorPrimaryBrush, var(--text-primary)); font-size: 14px; }
.group-header { font-size: 20px; font-weight: 600; }
@media (max-width: 820px) {
  .drag-list-grid { grid-template-columns: minmax(0, 1fr) !important; }
  .drag-list-grid :deep(.win-list-view) { min-width: 0 !important; margin: 6px 0 !important; }
}
</style>
