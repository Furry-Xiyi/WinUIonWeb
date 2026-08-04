<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.menubar')" />
          <WinTextBlock class="page-description" :Text="$t('text.the-menubar-simplifies-the-creation-of-basic-men')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :headerText="$t('text.a-simple-menubar')" :theme="pageTheme" :vue="simpleCode">
              <template #example>
                <div class="sample-stack">
                  <WinMenuBar :Items="simpleItems" :Theme="pageTheme" @ItemClick="simpleOutput = `You clicked: ${$event.Item.Text}`" />
                </div>
              </template>
              <template #options>
                <WinTextBlock :Text="simpleOutput" TextWrapping="WrapWholeWords" />
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" headerText="A MenuBar with keyboard accelerators" :theme="pageTheme" :vue="acceleratorCode">
              <template #example>
                <div class="sample-stack">
                  <WinMenuBar :Items="acceleratorItems" :Theme="pageTheme" @ItemClick="acceleratorOutput = `You clicked: ${$event.Item.Text}`" />
                </div>
              </template>
              <template #options>
                <WinTextBlock :Text="acceleratorOutput" TextWrapping="WrapWholeWords" />
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" headerText="A MenuBar with submenus, separators, and radio menu items" :theme="pageTheme" :vue="submenuCode">
              <template #example>
                <div class="sample-stack">
                  <WinMenuBar :Items="submenuItems" :Theme="pageTheme" @ItemClick="submenuOutput = `You clicked: ${$event.Item.Text}`" />
                </div>
              </template>
              <template #options>
                <WinTextBlock :Text="submenuOutput" TextWrapping="WrapWholeWords" />
              </template>
            </WinControlExample>
      </div>
    </div>
  </WinScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import WinButton from '../../components/WinButton.vue';
import WinControlExample from '../../components/WinControlExample.vue';
import WinMenuBar from '../../components/WinMenuBar.vue';
import WinTextBlock from '../../components/WinTextBlock.vue';
import WinToggleButton from '../../components/WinToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import { useI18n } from '../../components/i18n/index';

import WinScrollViewer from '../../components/WinScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'menubar');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const simpleOutput = ref('You clicked:');
const acceleratorOutput = ref('You clicked:');
const submenuOutput = ref('You clicked:');

const baseMenus = [
  { Title: t('text.file'), Items: [{ Text: 'New' }, { Text: 'Open...' }, { Text: 'Save' }, { Text: 'Exit' }] },
  { Title: t('text.edit'), Items: [{ Text: 'Undo' }, { Text: 'Cut' }, { Text: 'Copy' }, { Text: 'Paste' }] },
  { Title: t('text.help'), Items: [{ Text: 'About' }] }
];

const simpleItems = baseMenus;
const acceleratorItems = [
  { Title: t('text.file'), Items: [{ Text: 'New', KeyboardAccelerators: [{ Key: 'N', Modifiers: ['Control'] }] }, { Text: 'Open', KeyboardAccelerators: [{ Key: 'O', Modifiers: ['Control'] }] }, { Text: 'Save', KeyboardAccelerators: [{ Key: 'S', Modifiers: ['Control'] }] }, { Text: 'Exit', KeyboardAccelerators: [{ Key: 'E', Modifiers: ['Control'] }] }] },
  { Title: t('text.edit'), Items: [{ Text: 'Undo', KeyboardAccelerators: [{ Key: 'Z', Modifiers: ['Control'] }] }, { Text: 'Cut', KeyboardAccelerators: [{ Key: 'X', Modifiers: ['Control'] }] }, { Text: 'Copy', KeyboardAccelerators: [{ Key: 'C', Modifiers: ['Control'] }] }, { Text: 'Paste', KeyboardAccelerators: [{ Key: 'V', Modifiers: ['Control'] }] }] },
  { Title: t('text.help'), Items: [{ Text: 'About', KeyboardAccelerators: [{ Key: 'I', Modifiers: ['Control'] }] }] }
];
const submenuItems = ref([
  {
    Title: t('text.file'),
    Items: [
      { Kind: 'MenuFlyoutSubItem', Text: 'New', Items: [{ Text: 'Plain Text Document' }, { Text: 'Rich Text Document' }, { Text: 'Other Formats' }] },
      { Text: 'Open' },
      { Text: 'Save' },
      { Kind: 'MenuFlyoutSeparator' },
      { Text: 'Exit' }
    ]
  },
  { Title: t('text.edit'), Items: [{ Text: 'Undo' }, { Text: 'Cut' }, { Text: 'Copy' }, { Text: 'Paste' }] },
  {
    Title: t('text.view'),
    Items: [
      { Text: 'Output' },
      { Kind: 'MenuFlyoutSeparator' },
      { Text: 'Landscape', GroupName: 'orientation', IsChecked: false },
      { Text: 'Portrait', GroupName: 'orientation', IsChecked: true },
      { Kind: 'MenuFlyoutSeparator' },
      { Text: 'Small icons', GroupName: 'size', IsChecked: false },
      { Text: 'Medium icons', GroupName: 'size', IsChecked: true },
      { Text: 'Large icons', GroupName: 'size', IsChecked: false }
    ]
  },
  { Title: t('text.help'), Items: [{ Text: 'About' }] }
]);

const simpleCode = `<WinMenuBar :Items="[
  {
    Title: 'File',
    Items: [
      { Text: 'New' },
      { Text: 'Open...' },
      { Text: 'Save' },
      { Text: 'Exit' }
    ]
  },
  {
    Title: 'Edit',
    Items: [
      { Text: 'Undo' },
      { Text: 'Cut' },
      { Text: 'Copy' },
      { Text: 'Paste' }
    ]
  },
  {
    Title: 'Help',
    Items: [
      { Text: 'About' }
    ]
  }
]" />`;
const acceleratorCode = `<WinMenuBar :Items="[
  {
    Title: 'File',
    Items: [
      {
        Text: 'New',
        KeyboardAccelerators: [{ Key: 'N', Modifiers: ['Control'] }]
      },
      {
        Text: 'Open',
        KeyboardAccelerators: [{ Key: 'O', Modifiers: ['Control'] }]
      }
    ]
  }
]" />`;
const submenuCode = `<WinMenuBar :Items="[
  {
    Title: 'File',
    Items: [
      {
        Kind: 'MenuFlyoutSubItem',
        Text: 'New',
        Items: [
          { Text: 'Plain Text Document' },
          { Text: 'Rich Text Document' },
          { Text: 'Other Formats' }
        ]
      },
      { Text: 'Open' },
      { Text: 'Save' },
      { Kind: 'MenuFlyoutSeparator' },
      { Text: 'Exit' }
    ]
  },
  {
    Title: 'View',
    Items: [
      { Text: 'Output' },
      { Kind: 'MenuFlyoutSeparator' },
      { Text: 'Landscape', GroupName: 'OrientationGroup' },
      { Text: 'Portrait', GroupName: 'OrientationGroup', IsChecked: true }
    ]
  }
]" />`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.sample-stack { width: 100%; display: flex; flex-direction: column; gap: 8px; }
</style>
