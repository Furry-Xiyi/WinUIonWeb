<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.gridview')" />
          <WinTextBlock class="page-description" :Text="$t('text.the-gridview-lets-people-browse-and-select-from')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @click="toggleTheme"><span class="icon">&#xE793;</span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.gridview.basic-simple-datatemplate')" :theme="pageTheme" :vue="basicGridViewVue">
            <template #example>
              <div class="sample-stack">
                <WinTextBlock :Text="$t('sample.gridview.basic-note')" TextWrapping="WrapWholeWords" />
                <WinGridView
                  class="basic-grid-view"
                  :ItemsSource="items"
                  IsItemClickEnabled
                  SelectionMode="Single"
                  v-model:SelectedItems="basicSelected"
                  @ItemClick="onBasicItemClick">
                  <template #item="{ item }">
                    <img class="image-template" :src="item.ImageLocation" :alt="item.Title" />
                  </template>
                </WinGridView>
                <WinTextBlock class="output-text" :Text="basicOutput" />
              </div>
            </template>
          </WinControlExample>

          <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.gridview.layout-customization')" :theme="pageTheme" :vue="layoutGridViewVue">
            <template #example>
              <div class="sample-stack">
                <WinTextBlock :Text="$t('sample.gridview.layout-note')" TextWrapping="WrapWholeWords" />
                <WinGridView
                  class="overlay-grid-view"
                  :ItemsSource="items"
                  :style="{ '--grid-column-margin': `${columnSpace}px`, '--grid-row-margin': `${rowSpace}px`, '--grid-max-rows': wrapItemCount }">
                  <template #item="{ item }">
                    <div class="overlay-template">
                      <img :src="item.ImageLocation" :alt="item.Title" />
                      <div class="overlay-caption">
                        <WinTextBlock :Text="item.Title" />
                        <WinTextBlock class="caption-text" :Text="`${item.Likes} Likes`" />
                      </div>
                    </div>
                  </template>
                </WinGridView>
              </div>
            </template>
            <template #options>
              <div class="options-stack">
                <WinNumberBox :Header="$t('sample.space-between-columns')" :Minimum="0" :Maximum="100" SpinButtonPlacementMode="Inline" v-model:Value="columnSpace" />
                <WinNumberBox :Header="$t('sample.space-between-rows')" :Minimum="0" :Maximum="100" SpinButtonPlacementMode="Inline" v-model:Value="rowSpace" />
                <WinNumberBox :Header="$t('sample.maximum-items-before-wrapping')" :Minimum="1" :Maximum="8" SpinButtonPlacementMode="Inline" v-model:Value="wrapItemCount" />
              </div>
            </template>
          </WinControlExample>

          <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.gridview.content-inside')" :theme="pageTheme" :vue="contentGridViewVue">
            <template #example>
              <div class="sample-stack">
                <WinGridView
                  class="content-grid-view"
                  :ItemsSource="contentItems"
                  :SelectionMode="selectionMode"
                  :IsItemClickEnabled="isItemClickEnabled"
                  :CanDragItems="canDragItems"
                  :CanReorderItems="canReorderItems"
                  :AllowDrop="allowDrop"
                  v-model:SelectedItems="contentSelected"
                  @ItemClick="onContentItemClick"
                  @SelectionChanged="onContentSelectionChanged"
                  @reorder="items => contentItems = items">
                  <template #item="{ item }">
                    <component :is="currentTemplate" :item="item" />
                  </template>
                </WinGridView>
                <WinTextBlock class="output-text" :Text="clickOutput" />
                <WinTextBlock class="output-text" :Text="selectionOutput" />
              </div>
            </template>
            <template #options>
              <div class="options-stack">
                <WinTextBlock Text="ItemTemplate" />
                <div class="radio-stack">
                  <WinRadioButton name="template" value="Image" v-model="itemTemplate"><WinTextBlock :Text="$t('sample.image')" /></WinRadioButton>
                  <WinRadioButton name="template" value="IconText" v-model="itemTemplate"><WinTextBlock Text="Icon/Text" /></WinRadioButton>
                  <WinRadioButton name="template" value="ImageText" v-model="itemTemplate"><WinTextBlock Text="Image/Text" /></WinRadioButton>
                  <WinRadioButton name="template" value="Text" v-model="itemTemplate"><WinTextBlock :Text="$t('text.text')" /></WinRadioButton>
                </div>
                <WinToggleButton @Click="reverseFlowDirection"><WinTextBlock :Text="$t('sample.reverse-flowdirection')" /></WinToggleButton>
                <WinTextBlock :Text="$t('sample.gridview.properties')" />
                <WinTextBlock class="caption-text" :Text="$t('sample.gridview.drag-drop-note')" TextWrapping="WrapWholeWords" />
                <WinTextBlock class="caption-text" :Text="$t('sample.gridview.item-click-note')" TextWrapping="WrapWholeWords" />
                <WinCheckBox v-model="isItemClickEnabled"><WinTextBlock Text="IsItemClickEnabled" /></WinCheckBox>
                <WinCheckBox v-model="canDragItems"><WinTextBlock Text="CanDragItems" /></WinCheckBox>
                <WinCheckBox v-model="canReorderItems"><WinTextBlock Text="CanReorderItems" /></WinCheckBox>
                <WinCheckBox v-model="allowDrop"><WinTextBlock Text="AllowDrop" /></WinCheckBox>
                <WinComboBox Header="SelectionMode" :ItemsSource="selectionModeOptions" v-model:SelectedIndex="selectionModeIndex" />
              </div>
            </template>
          </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, h, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinCheckBox from '../../components/WinCheckBox.vue';
import WinComboBox from '../../components/WinComboBox.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinGridView from '../../components/WinGridView.vue';
import WinNumberBox from '../../components/WinNumberBox.vue';
import WinRadioButton from '../../components/WinRadioButton.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'gridview');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const media = (name) => `https://raw.githubusercontent.com/microsoft/WinUI-Gallery/main/WinUIGallery/Assets/SampleMedia/${name}`;

const items = ref([
  { Title: 'Cliff', Description: 'A scenic cliff by the sea.', ImageLocation: media('cliff.jpg'), Likes: 12, Views: 461 },
  { Title: 'Grapes', Description: 'Fresh grapes in sunlight.', ImageLocation: media('grapes.jpg'), Likes: 9, Views: 312 },
  { Title: 'Rainier', Description: 'A mountain landscape.', ImageLocation: media('rainier.jpg'), Likes: 18, Views: 784 },
  { Title: 'Sunset', Description: 'A warm sunset sky.', ImageLocation: media('sunset.jpg'), Likes: 23, Views: 921 },
  { Title: 'Valley', Description: 'A green valley view.', ImageLocation: media('valley.jpg'), Likes: 14, Views: 538 }
]);

const basicSelected = ref([]);
const basicOutput = ref('');
const onBasicItemClick = (args) => {
  const clickedItem = args?.ClickedItem ?? args;
  basicOutput.value = clickedItem ? `You clicked ${clickedItem.Title}.` : '';
};

const columnSpace = ref(5);
const rowSpace = ref(5);
const wrapItemCount = ref(3);

const contentItems = ref([...items.value]);
const contentSelected = ref([]);
const itemTemplate = ref('Image');
const isItemClickEnabled = ref(false);
const canDragItems = ref(false);
const canReorderItems = ref(false);
const allowDrop = ref(false);
const isReversed = ref(false);
const clickOutput = ref('');
const selectionOutput = ref('');
const selectionModes = ['None', 'Single', 'Multiple', 'Extended'];
const selectionModeIndex = ref(1);
const selectionMode = computed(() => selectionModes[selectionModeIndex.value]);
const selectionModeOptions = selectionModes;

const imageTemplate = ({ item }) => h('img', { class: 'image-template', src: item.ImageLocation, alt: item.Title });
const iconTextTemplate = ({ item }) => h('div', { class: 'icon-text-template' }, [
  h('img', { src: item.ImageLocation, alt: '', 'aria-hidden': 'true' }),
  h(WinTextBlock, { Text: item.Title }),
  h(WinTextBlock, { class: 'caption-text', Text: item.Description, TextWrapping: 'WrapWholeWords' })
]);
const imageTextTemplate = ({ item }) => h('div', { class: 'image-text-template' }, [
  h('img', { src: item.ImageLocation, alt: item.Title }),
  h('div', {}, [
    h(WinTextBlock, { style: 'font-weight: 600; margin-bottom: 8px;', Text: item.Title }),
    h(WinTextBlock, { class: 'caption-text', Text: `${item.Views} Views` }),
    h(WinTextBlock, { class: 'caption-text', Text: `${item.Likes} Likes` })
  ])
]);
const textTemplate = ({ item }) => h('div', { class: 'text-template' }, [h(WinTextBlock, { Text: item.Title })]);
const currentTemplate = computed(() => ({
  Image: imageTemplate,
  IconText: iconTextTemplate,
  ImageText: imageTextTemplate,
  Text: textTemplate
}[itemTemplate.value]));

const reverseFlowDirection = () => { isReversed.value = !isReversed.value; contentItems.value = [...contentItems.value].reverse(); };
const onContentItemClick = (args) => {
  const clickedItem = args?.ClickedItem ?? args;
  clickOutput.value = clickedItem ? `Clicked: ${clickedItem.Title}` : '';
};
const onContentSelectionChanged = ({ SelectedItems }) => {
  selectionOutput.value = `Selected: ${SelectedItems?.map(item => item.Title).join(', ') || 'None'}`;
};

const basicGridViewVue = `<WinGridView ItemsSource="{items}" IsItemClickEnabled SelectionMode="Single" />`;
const layoutGridViewVue = `<WinGridView ItemsSource="{items}">
  <!-- Use NumberBox options to change row/column spacing and wrap count. -->
</WinGridView>`;
const contentGridViewVue = `<WinGridView
  ItemsSource="{items}"
  IsItemClickEnabled="{value}"
  CanDragItems="{value}"
  CanReorderItems="{value}"
  AllowDrop="{value}"
  SelectionMode="{value}" />`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.sample-stack { display: flex; flex-direction: column; gap: 15px; width: 100%; }
.basic-grid-view, .overlay-grid-view, .content-grid-view { max-width: 650px; }
.overlay-grid-view :deep(.win-grid-view-inner) {
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(var(--grid-max-rows), max-content);
  grid-auto-columns: max-content;
  gap: 0;
  align-items: start;
  justify-content: start;
}
.overlay-grid-view :deep(.win-grid-item) {
  margin: var(--grid-row-margin) var(--grid-column-margin);
}
.image-template { width: 190px; height: 130px; object-fit: cover; display: block; }
.overlay-template { position: relative; width: 100px; height: 100px; overflow: hidden; }
.overlay-template img { width: 100%; height: 100%; object-fit: cover; }
.overlay-caption { position: absolute; left: 0; right: 0; bottom: 0; height: 40px; padding: 2px 5px; background: rgba(255,255,255,.75); color: #000; }
.icon-text-template { width: 280px; min-height: 160px; padding: 4px 8px; display: grid; grid-template-columns: 18px 1fr; gap: 4px 8px; }
.icon-text-template img { width: 18px; margin-top: 4px; }
.icon-text-template .caption-text { grid-column: 1 / -1; }
.image-text-template { width: 280px; display: grid; grid-template-columns: auto 1fr; gap: 8px; }
.image-text-template img { height: 100px; width: 150px; object-fit: cover; }
.text-template { width: 240px; padding-left: 8px; }
.caption-text { font-size: 12px; color: var(--text-secondary); }
.output-text { color: var(--text-secondary); }
.options-stack { display: flex; flex-direction: column; gap: 12px; width: 220px; }
.radio-stack { display: flex; flex-direction: column; gap: 6px; }
</style>
