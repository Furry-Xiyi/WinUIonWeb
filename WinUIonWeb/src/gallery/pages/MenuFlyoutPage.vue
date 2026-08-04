<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.menuflyout')" />
          <WinTextBlock class="page-description" :Text="$t('text.a-menuflyout-displays-a-lightweight-menu-of-comm')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :headerText="$t('text.a-menuflyout-attached-to-an-appbarbutton')" :theme="pageTheme" :vue="appBarCode">
              <template #example>
                <div class="sample-row">
                  <WinAppBarButton icon="Sort" :label="$t('sample.sort')" :isCompact="true" :ariaLabel="$t('sample.sort')" @click="openMenu($event, sortMenu)" />
                  <WinTextBlock class="output-text" :Text="sortOutput" />
                </div>
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.menuflyout.toggle-items')" :theme="pageTheme" :vue="toggleCode">
              <template #example>
                <WinButton @click="openMenu($event, toggleMenu)">
                  <WinTextBlock :Text="$t('sample.options')" />
                </WinButton>
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.menuflyout.cascading')" :theme="pageTheme" :vue="cascadeCode">
              <template #example>
                <WinButton @click="openMenu($event, cascadeMenu)">
                  <WinTextBlock :Text="$t('sample.file-options')" />
                </WinButton>
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.menuflyout.split-items')" :theme="pageTheme" :vue="splitCode">
              <template #example>
                <div class="sample-row">
                  <WinButton @click="openMenu($event, splitMenu)">
                    <WinTextBlock :Text="$t('sample.file-options')" />
                  </WinButton>
                  <WinTextBlock class="output-text" :Text="splitOutput" />
                </div>
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.menuflyout.icons')" :theme="pageTheme" :vue="iconsCode">
              <template #example>
                <WinButton @click="openMenu($event, iconsMenu)">
                  <WinTextBlock :Text="$t('sample.edit-options')" />
                </WinButton>
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.menuflyout.keyboard')" :theme="pageTheme" :vue="keyboardCode">
              <template #example>
                <WinButton @click="openMenu($event, keyboardMenu)">
                  <WinTextBlock :Text="$t('sample.edit-options')" />
                </WinButton>
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.menuflyout.radio')" :theme="pageTheme" :vue="radioCode">
              <template #example>
                <WinButton @click="openMenu($event, radioMenu)">
                  <WinTextBlock :Text="$t('sample.options')" />
                </WinButton>
              </template>
            </WinControlExample>

            <WinMenuFlyout :Open="sortMenu.open" :AnchorRect="sortMenu.anchor" :Items="sortItems" :Theme="pageTheme" @Close="sortMenu.open = false" @Select="onSortSelect" />
            <WinMenuFlyout :Open="toggleMenu.open" :AnchorRect="toggleMenu.anchor" :Items="toggleItems" :Theme="pageTheme" @Close="toggleMenu.open = false" />
            <WinMenuFlyout :Open="cascadeMenu.open" :AnchorRect="cascadeMenu.anchor" :Items="cascadeItems" :Theme="pageTheme" @Close="cascadeMenu.open = false" />
            <WinMenuFlyout :Open="splitMenu.open" :AnchorRect="splitMenu.anchor" :Items="splitItems" :Theme="pageTheme" @Close="splitMenu.open = false" @Select="onSplitSelect" />
            <WinMenuFlyout :Open="iconsMenu.open" :AnchorRect="iconsMenu.anchor" :Items="iconItems" :Theme="pageTheme" @Close="iconsMenu.open = false" />
            <WinMenuFlyout :Open="keyboardMenu.open" :AnchorRect="keyboardMenu.anchor" :Items="keyboardItems" :Theme="pageTheme" @Close="keyboardMenu.open = false" />
            <WinMenuFlyout :Open="radioMenu.open" :AnchorRect="radioMenu.anchor" :Items="radioItems" :Theme="pageTheme" @Close="radioMenu.open = false" />
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, reactive, ref } from 'vue';
import WinAppBarButton from '../../components/WinAppBarButton.vue';
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinMenuFlyout from '../../components/WinMenuFlyout.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'menuflyout');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const makeMenu = () => reactive({ open: false, anchor: null });
const sortMenu = makeMenu();
const toggleMenu = makeMenu();
const cascadeMenu = makeMenu();
const splitMenu = makeMenu();
const iconsMenu = makeMenu();
const keyboardMenu = makeMenu();
const radioMenu = makeMenu();
const allMenus = [sortMenu, toggleMenu, cascadeMenu, splitMenu, iconsMenu, keyboardMenu, radioMenu];

const sortOutput = ref('');
const splitOutput = ref('');

const openMenu = (event, menu) => {
  allMenus.forEach((candidate) => { if (candidate !== menu) candidate.open = false; });
  menu.anchor = event.currentTarget.getBoundingClientRect();
  menu.open = !menu.open;
};

const sortItems = reactive([
  { Text: t('sample.by-rating'), Tag: 'rating' },
  { Text: t('sample.by-match'), Tag: 'match' },
  { Text: t('sample.by-distance'), Tag: 'distance' }
]);

const toggleItems = reactive([
  { Text: t('sample.reset') },
  { Kind: 'MenuFlyoutSeparator' },
  { Kind: 'ToggleMenuFlyoutItem', Text: t('sample.repeat'), IsChecked: true },
  { Kind: 'ToggleMenuFlyoutItem', Text: t('sample.shuffle'), IsChecked: true }
]);

const cascadeItems = reactive([
  { Text: t('sample.open') },
  {
    Kind: 'MenuFlyoutSubItem',
    Text: t('sample.send-to'),
    Items: [
      { Text: t('sample.bluetooth') },
      { Text: t('sample.desktop-shortcut') },
      {
        Kind: 'MenuFlyoutSubItem',
        Text: t('sample.compressed-file'),
        Items: [
          { Text: t('sample.compress-email') },
          { Text: t('sample.compress-7z') },
          { Text: t('sample.compress-zip') }
        ]
      }
    ]
  }
]);

const splitItems = reactive([
  {
    Kind: 'SplitMenuFlyoutItem',
    Text: t('sample.save'),
    Icon: '\uE74E',
    Items: [
      { Text: t('sample.save-docx') },
      { Text: t('sample.save-pdf') },
      { Text: t('sample.save-txt') }
    ]
  },
  {
    Kind: 'SplitMenuFlyoutItem',
    Text: t('sample.share'),
    Icon: '\uE72D',
    Items: [
      { Text: t('sample.share-email') },
      { Text: t('sample.share-link') }
    ]
  }
]);

const iconItems = reactive([
  { Text: t('sample.share'), Icon: '\uE72D' },
  { Text: t('sample.copy'), Icon: '\uE8C8' },
  { Text: t('sample.delete'), Icon: '\uE74D' },
  { Kind: 'MenuFlyoutSeparator' },
  { Text: t('sample.rename') },
  { Text: t('sample.select') }
]);

const keyboardItems = reactive([
  { Text: t('sample.share'), Icon: '\uE72D', KeyboardAccelerators: [{ Key: 'S', Modifiers: ['Control'] }], KeyboardAcceleratorTextOverride: 'Ctrl+S' },
  { Text: t('sample.copy'), Icon: '\uE8C8', KeyboardAccelerators: [{ Key: 'C', Modifiers: ['Control'] }], KeyboardAcceleratorTextOverride: 'Ctrl+C' },
  { Text: t('sample.delete'), Icon: '\uE74D', KeyboardAccelerators: [{ Key: 'Delete' }], KeyboardAcceleratorTextOverride: 'Delete' },
  { Kind: 'MenuFlyoutSeparator' },
  { Text: t('sample.rename') },
  { Text: t('sample.select') }
]);

const radioItems = reactive([
  { Kind: 'RadioMenuFlyoutItem', GroupName: 'OrientationGroup', Text: t('sample.landscape') },
  { Kind: 'RadioMenuFlyoutItem', GroupName: 'OrientationGroup', Text: t('sample.portrait'), IsChecked: true },
  { Kind: 'MenuFlyoutSeparator' },
  { Kind: 'RadioMenuFlyoutItem', GroupName: 'SizeGroup', Text: t('sample.small-icons') },
  { Kind: 'RadioMenuFlyoutItem', GroupName: 'SizeGroup', Text: t('sample.medium-icons'), IsChecked: true },
  { Kind: 'RadioMenuFlyoutItem', GroupName: 'SizeGroup', Text: t('sample.large-icons') }
]);

const onSortSelect = (item) => {
  sortOutput.value = t('sample.sort-by', { value: item.Tag });
  sortMenu.open = false;
};

const onSplitSelect = (item) => {
  splitOutput.value = t('sample.clicked', { value: item.Text });
  splitMenu.open = false;
};

const appBarCode = `<WinAppBarButton Icon="Sort" Label="Sort" IsCompact ToolTipService.ToolTip="Sort">
  <MenuFlyout>
    <MenuFlyoutItem Text="By rating" />
    <MenuFlyoutItem Text="By match" />
    <MenuFlyoutItem Text="By distance" />
  </MenuFlyout>
</WinAppBarButton>`;
const toggleCode = `<WinButton>
  <WinTextBlock Text="Options" />
</WinButton>
<WinMenuFlyout :Items="[
  { Text: 'Reset' },
  { Kind: 'MenuFlyoutSeparator' },
  { Kind: 'ToggleMenuFlyoutItem', Text: 'Repeat', IsChecked: true },
  { Kind: 'ToggleMenuFlyoutItem', Text: 'Shuffle', IsChecked: true }
]" />`;
const cascadeCode = `<WinButton>
  <WinTextBlock Text="File Options" />
</WinButton>
<WinMenuFlyout :Items="[
  { Text: 'Open' },
  { Kind: 'MenuFlyoutSubItem', Text: 'Send to', Items: [
    { Text: 'Bluetooth' },
    { Text: 'Desktop (shortcut)' },
    { Kind: 'MenuFlyoutSubItem', Text: 'Compressed file', Items: [
      { Text: 'Compress and email' },
      { Text: 'Compress to .7z' },
      { Text: 'Compress to .zip' }
    ]}
  ]}
]" />`;
const splitCode = `<WinMenuFlyout :Items="[
  { Kind: 'SplitMenuFlyoutItem', Text: 'Save', Icon: '\\uE74E', Items: [
    { Text: 'Save as .docx' },
    { Text: 'Save as .pdf' },
    { Text: 'Save as .txt' }
  ]},
  { Kind: 'SplitMenuFlyoutItem', Text: 'Share', Icon: '\\uE72D', Items: [
    { Text: 'Share via email' },
    { Text: 'Share via link' }
  ]}
]" />`;
const iconsCode = `<WinMenuFlyout :Items="[
  { Text: 'Share', Icon: '\\uE72D' },
  { Text: 'Copy', Icon: '\\uE8C8' },
  { Text: 'Delete', Icon: '\\uE74D' },
  { Kind: 'MenuFlyoutSeparator' },
  { Text: 'Rename' },
  { Text: 'Select' }
]" />`;
const keyboardCode = `<WinMenuFlyout :Items="[
  { Text: 'Share', Icon: '\\uE72D', KeyboardAcceleratorTextOverride: 'Ctrl+S' },
  { Text: 'Copy', Icon: '\\uE8C8', KeyboardAcceleratorTextOverride: 'Ctrl+C' },
  { Text: 'Delete', Icon: '\\uE74D', KeyboardAcceleratorTextOverride: 'Delete' }
]" />`;
const radioCode = `<WinMenuFlyout :Items="[
  { Kind: 'RadioMenuFlyoutItem', GroupName: 'OrientationGroup', Text: 'Landscape' },
  { Kind: 'RadioMenuFlyoutItem', GroupName: 'OrientationGroup', Text: 'Portrait', IsChecked: true },
  { Kind: 'MenuFlyoutSeparator' },
  { Kind: 'RadioMenuFlyoutItem', GroupName: 'SizeGroup', Text: 'Small icons' },
  { Kind: 'RadioMenuFlyoutItem', GroupName: 'SizeGroup', Text: 'Medium icons', IsChecked: true },
  { Kind: 'RadioMenuFlyoutItem', GroupName: 'SizeGroup', Text: 'Large icons' }
]" />`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.sample-row { display: flex; align-items: center; gap: 16px; }
.output-text { color: var(--text-secondary); }
</style>
