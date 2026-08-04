<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.itemsview')" />
          <WinTextBlock class="page-description" :Text="$t('text.itemsview-description')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @click="toggleTheme"><span class="icon">&#xE793;</span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.itemsview.basic')" :theme="pageTheme" :vue="basicItemsViewVue">
              <template #example>
                <div class="sample-stack">
                  <WinTextBlock Margin="0,0,0,15" :Text="$t('sample.itemsview.basic-note')" TextWrapping="WrapWholeWords" />
                  <WinItemsView
                    class="basic-items-view"
                    :ItemsSource="items"
                    :IsItemInvokedEnabled="true"
                    @ItemInvoked="BasicItemsView_ItemInvoked">
                    <template #item="{ item }">
                      <div class="image-template" :aria-label="item.Title">
                        <img :src="item.ImageLocation" :alt="item.Title" />
                      </div>
                    </template>
                  </WinItemsView>
                  <WinTextBlock class="output-text" :Text="basicInvokeOutput" />
                </div>
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.itemsview.swappable-layouts')" :theme="pageTheme" :vue="swappableLayoutsVue">
              <template #example>
                <div class="sample-stack">
                  <WinTextBlock Margin="0,0,0,15" :Text="$t('sample.itemsview.layout-note')" TextWrapping="WrapWholeWords" />
                  <WinItemsView
                    class="swappable-items-view"
                    :class="layoutClass"
                    :ItemsSource="items"
                    :Layout="itemsViewLayout">
                    <template #item="{ item }">
                      <div class="layout-template" :class="layoutClass" :aria-label="item.Title">
                        <img :src="item.ImageLocation" :alt="item.Title" />
                        <div class="item-overlay">
                          <WinTextBlock class="overlay-title" :Text="item.Title" />
                          <div class="overlay-row">
                            <WinTextBlock class="overlay-caption" :Text="String(item.Likes)" />
                            <WinTextBlock class="overlay-caption" :Text="$t('sample.likes-suffix')" />
                          </div>
                        </div>
                        <div class="stack-text">
                          <WinTextBlock class="stack-title" :Text="item.Title" />
                          <WinTextBlock class="stack-description" :Text="item.Description" TextWrapping="WrapWholeWords" />
                        </div>
                      </div>
                    </template>
                  </WinItemsView>
                </div>
              </template>
              <template #options>
                <div class="options-stack">
                  <WinRadioButtons :Header="$t('sample.layout')" :ItemsSource="layoutOptions" :SelectedIndex="layoutSelectedIndex" @SelectionChanged="RbLayout_Checked" />

                  <div v-if="layoutSelection === 'LinedFlowLayout'" class="options-stack">
                    <WinTextBlock class="options-heading" :Text="$t('sample.itemsview.linedflow-settings')" />
                    <WinNumberBox v-model:Value="lineSpacing" :Header="$t('sample.space-between-lines')" :Minimum="0" :Maximum="100" SpinButtonPlacementMode="Inline" />
                    <WinNumberBox v-model:Value="minItemSpacing" :Header="$t('sample.minimum-space-between-items-on-line')" :Minimum="0" :Maximum="100" SpinButtonPlacementMode="Inline" />
                    <WinRadioButtons :Header="$t('sample.line-height')" :ItemsSource="lineHeightOptions" :SelectedIndex="lineHeightSelectedIndex" @SelectionChanged="RbLineHeight_Checked" />
                  </div>

                  <div v-else-if="layoutSelection === 'StackLayout'" class="options-stack">
                    <WinTextBlock class="options-heading" :Text="$t('sample.itemsview.stack-settings')" />
                    <WinNumberBox v-model:Value="stackSpacing" :Header="$t('sample.space-between-rows')" :Minimum="0" :Maximum="100" SpinButtonPlacementMode="Inline" />
                  </div>

                  <div v-else class="options-stack">
                    <WinTextBlock class="options-heading" :Text="$t('sample.itemsview.uniformgrid-settings')" />
                    <WinNumberBox v-model:Value="minColumnSpacing" :Header="$t('sample.minimum-space-between-columns')" :Minimum="0" :Maximum="100" SpinButtonPlacementMode="Inline" />
                    <WinNumberBox v-model:Value="minRowSpacing" :Header="$t('sample.minimum-space-between-rows')" :Minimum="0" :Maximum="100" SpinButtonPlacementMode="Inline" />
                    <WinNumberBox v-model:Value="maximumRowsOrColumns" :Header="$t('sample.maximum-items-per-row-before-wrapping')" :Minimum="1" :Maximum="8" SpinButtonPlacementMode="Inline" />
                  </div>
                </div>
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.itemsview.item-invocation-selection')" :theme="pageTheme" :vue="selectionItemsViewVue">
              <template #example>
                <div class="sample-stack">
                  <div class="selection-note">
                    <WinTextBlock :Text="$t('sample.itemsview.selection-note-1')" TextWrapping="WrapWholeWords" />
                    <WinTextBlock :Text="$t('sample.itemsview.selection-note-none')" TextWrapping="WrapWholeWords" />
                    <WinTextBlock :Text="$t('sample.itemsview.selection-note-single')" TextWrapping="WrapWholeWords" />
                    <WinTextBlock :Text="$t('sample.itemsview.selection-note-multiple')" TextWrapping="WrapWholeWords" />
                    <WinTextBlock :Text="$t('sample.itemsview.selection-note-extended')" TextWrapping="WrapWholeWords" />
                  </div>
                  <WinItemsView
                    class="selection-items-view"
                    :ItemsSource="items"
                    :Layout="selectionLayout"
                    :SelectionMode="selectionMode"
                    :IsItemInvokedEnabled="isItemInvokedEnabled"
                    v-model:SelectedItems="selectedItems"
                    @ItemInvoked="SwappableSelectionModesItemsView_ItemInvoked"
                    @SelectionChanged="SwappableSelectionModesItemsView_SelectionChanged">
                    <template #item="{ item }">
                      <div class="layout-template uniform-grid-layout" :aria-label="item.Title">
                        <img :src="item.ImageLocation" :alt="item.Title" />
                        <div class="item-overlay">
                          <WinTextBlock class="overlay-title" :Text="item.Title" />
                          <div class="overlay-row">
                            <WinTextBlock class="overlay-caption" :Text="String(item.Likes)" />
                            <WinTextBlock class="overlay-caption" :Text="$t('sample.likes-suffix')" />
                          </div>
                        </div>
                      </div>
                    </template>
                  </WinItemsView>
                  <WinTextBlock class="output-text" :Text="invocationOutput" />
                  <WinTextBlock class="output-text" :Text="selectionOutput" />
                </div>
              </template>
              <template #options>
                <div class="selection-options">
                  <WinTextBlock :Text="$t('sample.selection-mode')" />
                  <WinComboBox v-model:SelectedIndex="selectionModeSelectedIndex" :ItemsSource="selectionModeOptions" DisplayMemberPath="Text" />
                  <WinTextBlock :Text="$t('sample.is-item-invoked-enabled')" />
                  <WinCheckBox v-model:IsChecked="isItemInvokedEnabled" />
                </div>
              </template>
            </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, ref, watch } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinCheckBox from '../../components/WinCheckBox.vue';
import WinComboBox from '../../components/WinComboBox.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinItemsView from '../../components/WinItemsView.vue';
import WinNumberBox from '../../components/WinNumberBox.vue';
import WinRadioButtons from '../../components/WinRadioButtons.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';
import { useI18n } from '../../components/i18n/index';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'itemsview');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const mediaBase = 'https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia';
const items = [
  { Title: 'Cliff', ImageLocation: `${mediaBase}/cliff.jpg`, Likes: 12, Description: 'A cliff by the sea.' },
  { Title: 'Grapes', ImageLocation: `${mediaBase}/grapes.jpg`, Likes: 18, Description: 'A bunch of grapes.' },
  { Title: 'Rainier', ImageLocation: `${mediaBase}/rainier.jpg`, Likes: 27, Description: 'Mount Rainier.' },
  { Title: 'Sunset', ImageLocation: `${mediaBase}/sunset.jpg`, Likes: 31, Description: 'A sunset over water.' },
  { Title: 'Valley', ImageLocation: `${mediaBase}/valley.jpg`, Likes: 44, Description: 'A green valley.' },
  { Title: 'Cliff 2', ImageLocation: `${mediaBase}/cliff.jpg`, Likes: 52, Description: 'Another cliff.' },
  { Title: 'Grapes 2', ImageLocation: `${mediaBase}/grapes.jpg`, Likes: 67, Description: 'More grapes.' },
  { Title: 'Rainier 2', ImageLocation: `${mediaBase}/rainier.jpg`, Likes: 73, Description: 'Another mountain view.' }
];

const basicInvokeOutput = ref('');
const BasicItemsView_ItemInvoked = ({ InvokedItem }) => {
  basicInvokeOutput.value = t('sample.itemsview.invoked-output', { item: InvokedItem.Title });
};

const layoutOptions = computed(() => [
  { Text: 'LinedFlowLayout', Value: 'LinedFlowLayout' },
  { Text: 'UniformGridLayout', Value: 'UniformGridLayout' },
  { Text: 'StackLayout', Value: 'StackLayout' }
]);
const layoutValues = ['LinedFlowLayout', 'UniformGridLayout', 'StackLayout'];
const layoutSelectedIndex = ref(0);
const layoutSelection = computed(() => layoutValues[layoutSelectedIndex.value]);
const layoutClass = computed(() => layoutSelection.value.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase());
const lineSpacing = ref(5);
const minItemSpacing = ref(5);
const lineHeightOptions = computed(() => [
  { Text: t('sample.small'), Value: 'Small' },
  { Text: t('sample.large'), Value: 'Large' }
]);
const lineHeightSelectedIndex = ref(1);
const stackSpacing = ref(5);
const minColumnSpacing = ref(5);
const minRowSpacing = ref(5);
const maximumRowsOrColumns = ref(3);
const itemsViewLayout = computed(() => {
  if (layoutSelection.value === 'LinedFlowLayout') {
    return { Type: 'LinedFlowLayout', MinItemWidth: 70, LineHeight: lineHeightSelectedIndex.value === 0 ? 80 : 160, LineSpacing: lineSpacing.value, MinItemSpacing: minItemSpacing.value };
  }
  if (layoutSelection.value === 'StackLayout') {
    return { Type: 'StackLayout', Spacing: stackSpacing.value };
  }
  return { Type: 'UniformGridLayout', MinItemWidth: 150, MinItemHeight: 150, MinColumnSpacing: minColumnSpacing.value, MinRowSpacing: minRowSpacing.value, MaximumRowsOrColumns: maximumRowsOrColumns.value };
});
const RbLayout_Checked = ({ SelectedIndex }) => { layoutSelectedIndex.value = SelectedIndex; };
const RbLineHeight_Checked = ({ SelectedIndex }) => { lineHeightSelectedIndex.value = SelectedIndex; };

const selectionModeOptions = computed(() => [
  { Text: t('text.none'), Value: 'None' },
  { Text: t('text.single'), Value: 'Single' },
  { Text: t('text.multiple'), Value: 'Multiple' },
  { Text: t('text.extended'), Value: 'Extended' }
]);
const selectionModeValues = ['None', 'Single', 'Multiple', 'Extended'];
const selectionModeSelectedIndex = ref(2);
const selectionMode = computed(() => selectionModeValues[selectionModeSelectedIndex.value]);
const selectionLayout = { Type: 'UniformGridLayout', MinItemWidth: 150, MinItemHeight: 150, MaximumRowsOrColumns: 3, MinColumnSpacing: 5, MinRowSpacing: 5 };
const isItemInvokedEnabled = ref(false);
const selectedItems = ref([]);
const invocationOutput = ref('');
const selectionOutput = ref('');
const SwappableSelectionModesItemsView_ItemInvoked = ({ InvokedItem }) => {
  invocationOutput.value = t('sample.itemsview.invoked-output', { item: InvokedItem.Title });
};
const SwappableSelectionModesItemsView_SelectionChanged = () => {
  selectionOutput.value = t('sample.itemsview.selection-output', { count: selectedItems.value.length });
};
watch(selectionModeSelectedIndex, () => {
  selectedItems.value = [];
  selectionOutput.value = '';
  invocationOutput.value = '';
});

const basicItemsViewVue = `<WinItemsView
  :ItemsSource="items"
  :IsItemInvokedEnabled="true"
  @ItemInvoked="BasicItemsView_ItemInvoked">
  <template #item="{ item }">
    <img :src="item.ImageLocation" :alt="item.Title" />
  </template>
</WinItemsView>`;

const swappableLayoutsVue = `<WinItemsView :ItemsSource="items" :Layout="itemsViewLayout">
  <template #item="{ item }">
    <img :src="item.ImageLocation" :alt="item.Title" />
    <WinTextBlock :Text="item.Title" />
  </template>
</WinItemsView>`;

const selectionItemsViewVue = `<WinItemsView
  :ItemsSource="items"
  :Layout="{ Type: 'UniformGridLayout', MaximumRowsOrColumns: 3 }"
  :SelectionMode="selectionMode"
  :IsItemInvokedEnabled="isItemInvokedEnabled"
  v-model:SelectedItems="selectedItems">
  <template #item="{ item }">
    <img :src="item.ImageLocation" :alt="item.Title" />
    <WinTextBlock :Text="item.Title" />
  </template>
</WinItemsView>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.sample-stack { display: flex; flex-direction: column; min-width: 0; }
.basic-items-view { width: 220px; height: 400px; }
.swappable-items-view,
.selection-items-view { width: 500px; height: 400px; max-width: 100%; }
.image-template { width: 200px; height: 140px; padding: 4px; box-sizing: border-box; }
.image-template img,
.layout-template img { width: 100%; height: 100%; object-fit: cover; display: block; }
.layout-template { position: relative; overflow: hidden; min-height: 100%; background: var(--ctrl-fill-default); }
.layout-template.uniform-grid-layout { width: 150px; height: 150px; }
.layout-template.stack-layout { width: 480px; min-height: 80px; max-height: 100px; display: grid; grid-template-columns: 24px 1fr; grid-template-rows: auto 1fr; column-gap: 8px; padding: 0; box-sizing: border-box; }
.layout-template.stack-layout img { width: 24px; height: 16px; margin-top: 4px; align-self: start; }
.stack-text { display: none; }
.stack-layout .stack-text { display: flex; flex-direction: column; min-width: 0; }
.stack-title { font-size: 14px; }
.stack-description { grid-column: 1 / -1; margin: 4px 8px 4px 0; color: var(--text-secondary); font-size: 12px; line-height: 16px; }
.item-overlay { position: absolute; left: 0; right: 0; bottom: 0; height: 40px; padding: 1px 5px; box-sizing: border-box; background: rgba(0, 0, 0, 0.55); }
.stack-layout .item-overlay { display: none; }
.overlay-title { color: #fff; font-size: 14px; line-height: 18px; }
.overlay-row { display: flex; align-items: center; height: 16px; }
.overlay-caption { color: #fff; font-size: 12px; line-height: 14px; }
.output-text { min-height: 20px; margin-top: 8px; }
.options-stack { display: flex; flex-direction: column; gap: 12px; min-width: 260px; }
.options-heading { margin-top: 4px; font-weight: 600; }
.selection-note { display: flex; flex-direction: column; gap: 4px; margin-bottom: 15px; }
.selection-options { min-width: 220px; display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 12px; }
</style>
