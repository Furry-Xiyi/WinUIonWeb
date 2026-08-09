<template>
  <WinScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <WinTextBlock class="page-header" :Text="$t('text.menubar')" />
          <WinTextBlock class="page-description" :Text="$t('text.the-menubar-simplifies-the-creation-of-basic-men')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <WinButton class="header-action" @Click="toggleTheme"><span class="icon"></span></WinButton>
            <WinToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </WinToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <WinControlExample class="basic-input-example-theme" :headerText="$t('text.a-simple-menubar')" :theme="pageTheme" :vue="simpleCode">
              <template #example>
                <div class="sample-stack">
                  <WinTextBlock :Text="simpleOutput" TextWrapping="WrapWholeWords" />
                  <WinMenuBar :Items="simpleItems" :Theme="pageTheme" @ItemClick="simpleOutput = itemClickText($event.Item)" />
                </div>
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.menubar.keyboard')" :theme="pageTheme" :vue="acceleratorCode">
              <template #example>
                <div class="sample-stack">
                  <WinTextBlock :Text="acceleratorOutput" TextWrapping="WrapWholeWords" />
                  <WinMenuBar :Items="acceleratorItems" :Theme="pageTheme" @ItemClick="acceleratorOutput = itemClickText($event.Item)" />
                </div>
              </template>
            </WinControlExample>

            <WinControlExample class="basic-input-example-theme" :headerText="$t('sample.menubar.submenus')" :theme="pageTheme" :vue="submenuCode">
              <template #example>
                <div class="sample-stack">
                  <WinTextBlock :Text="submenuOutput" TextWrapping="WrapWholeWords" />
                  <WinMenuBar :Items="submenuItems" :Theme="pageTheme" @ItemClick="submenuOutput = itemClickText($event.Item)" />
                </div>
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

const simpleOutput = ref('');
const acceleratorOutput = ref('');
const submenuOutput = ref('');
const itemClickText = (item) => t('sample.you-clicked', { name: item.Text });

const baseMenus = [
  { Title: t('text.file'), Items: [{ Text: t('sample.standarduicommand.new') }, { Text: t('sample.standarduicommand.open') }, { Text: t('text.save') }, { Text: t('sample.standarduicommand.exit') }] },
  { Title: t('text.edit'), Items: [{ Text: t('sample.menubar.undo') }, { Text: t('sample.menubar.cut') }, { Text: t('sample.copy') }, { Text: t('sample.menubar.paste') }] },
  { Title: t('text.help'), Items: [{ Text: t('text.about') }] }
];

const simpleItems = baseMenus;
const acceleratorItems = [
  { Title: t('text.file'), Items: [{ Text: t('sample.standarduicommand.new'), KeyboardAccelerators: [{ Key: 'N', Modifiers: ['Control'] }] }, { Text: t('sample.open'), KeyboardAccelerators: [{ Key: 'O', Modifiers: ['Control'] }] }, { Text: t('text.save'), KeyboardAccelerators: [{ Key: 'S', Modifiers: ['Control'] }] }, { Text: t('sample.standarduicommand.exit'), KeyboardAccelerators: [{ Key: 'E', Modifiers: ['Control'] }] }] },
  { Title: t('text.edit'), Items: [{ Text: t('sample.menubar.undo'), KeyboardAccelerators: [{ Key: 'Z', Modifiers: ['Control'] }] }, { Text: t('sample.menubar.cut'), KeyboardAccelerators: [{ Key: 'X', Modifiers: ['Control'] }] }, { Text: t('sample.copy'), KeyboardAccelerators: [{ Key: 'C', Modifiers: ['Control'] }] }, { Text: t('sample.menubar.paste'), KeyboardAccelerators: [{ Key: 'V', Modifiers: ['Control'] }] }] },
  { Title: t('text.help'), Items: [{ Text: t('text.about'), KeyboardAccelerators: [{ Key: 'I', Modifiers: ['Control'] }] }] }
];
const submenuItems = ref([
  {
    Title: t('text.file'),
    Items: [
      { Kind: 'MenuFlyoutSubItem', Text: t('sample.standarduicommand.new'), Items: [{ Text: t('sample.menubar.plain-text') }, { Text: t('sample.menubar.rich-text') }, { Text: t('sample.menubar.other-formats') }] },
      { Text: t('sample.open') },
      { Text: t('text.save') },
      { Kind: 'MenuFlyoutSeparator' },
      { Text: t('sample.standarduicommand.exit') }
    ]
  },
  { Title: t('text.edit'), Items: [{ Text: t('sample.menubar.undo') }, { Text: t('sample.menubar.cut') }, { Text: t('sample.copy') }, { Text: t('sample.menubar.paste') }] },
  {
    Title: t('text.view'),
    Items: [
      { Text: t('sample.menubar.output') },
      { Kind: 'MenuFlyoutSeparator' },
      { Kind: 'RadioMenuFlyoutItem', Text: t('sample.landscape'), GroupName: 'OrientationGroup', IsChecked: false },
      { Kind: 'RadioMenuFlyoutItem', Text: t('sample.portrait'), GroupName: 'OrientationGroup', IsChecked: true },
      { Kind: 'MenuFlyoutSeparator' },
      { Kind: 'RadioMenuFlyoutItem', Text: t('sample.small-icons'), GroupName: 'SizeGroup', IsChecked: false },
      { Kind: 'RadioMenuFlyoutItem', Text: t('sample.medium-icons'), GroupName: 'SizeGroup', IsChecked: true },
      { Kind: 'RadioMenuFlyoutItem', Text: t('sample.large-icons'), GroupName: 'SizeGroup', IsChecked: false }
    ]
  },
  { Title: t('text.help'), Items: [{ Text: t('text.about') }] }
]);

const simpleCode = `<WinMenuBar>
  <WinMenuBarItem Title="File">
    <WinMenuFlyoutItem Text="New" />
    <WinMenuFlyoutItem Text="Open..." />
    <WinMenuFlyoutItem Text="Save" />
    <WinMenuFlyoutItem Text="Exit" />
  </WinMenuBarItem>
  <WinMenuBarItem Title="Edit">
    <WinMenuFlyoutItem Text="Undo" />
    <WinMenuFlyoutItem Text="Cut" />
    <WinMenuFlyoutItem Text="Copy" />
    <WinMenuFlyoutItem Text="Paste" />
  </WinMenuBarItem>
  <WinMenuBarItem Title="Help">
    <WinMenuFlyoutItem Text="About" />
  </WinMenuBarItem>
</WinMenuBar>`;
const acceleratorCode = `<WinMenuBar>
  <WinMenuBarItem Title="File">
    <WinMenuFlyoutItem Text="New">
      <WinMenuFlyoutItem.KeyboardAccelerators>
        <WinKeyboardAccelerator Key="N" Modifiers="Control" />
      </WinMenuFlyoutItem.KeyboardAccelerators>
    </WinMenuFlyoutItem>
    <WinMenuFlyoutItem Text="Open...">
      <WinMenuFlyoutItem.KeyboardAccelerators>
        <WinKeyboardAccelerator Key="O" Modifiers="Control" />
      </WinMenuFlyoutItem.KeyboardAccelerators>
    </WinMenuFlyoutItem>
    <WinMenuFlyoutItem Text="Save">
      <WinMenuFlyoutItem.KeyboardAccelerators>
        <WinKeyboardAccelerator Key="S" Modifiers="Control" />
      </WinMenuFlyoutItem.KeyboardAccelerators>
    </WinMenuFlyoutItem>
    <WinMenuFlyoutItem Text="Exit">
      <WinMenuFlyoutItem.KeyboardAccelerators>
        <WinKeyboardAccelerator Key="E" Modifiers="Control" />
      </WinMenuFlyoutItem.KeyboardAccelerators>
    </WinMenuFlyoutItem>
  </WinMenuBarItem>
  <WinMenuBarItem Title="Edit">
    <WinMenuFlyoutItem Text="Undo">
      <WinMenuFlyoutItem.KeyboardAccelerators>
        <WinKeyboardAccelerator Key="Z" Modifiers="Control" />
      </WinMenuFlyoutItem.KeyboardAccelerators>
    </WinMenuFlyoutItem>
    <WinMenuFlyoutItem Text="Cut">
      <WinMenuFlyoutItem.KeyboardAccelerators>
        <WinKeyboardAccelerator Key="X" Modifiers="Control" />
      </WinMenuFlyoutItem.KeyboardAccelerators>
    </WinMenuFlyoutItem>
    <WinMenuFlyoutItem Text="Copy">
      <WinMenuFlyoutItem.KeyboardAccelerators>
        <WinKeyboardAccelerator Key="C" Modifiers="Control" />
      </WinMenuFlyoutItem.KeyboardAccelerators>
    </WinMenuFlyoutItem>
    <WinMenuFlyoutItem Text="Paste">
      <WinMenuFlyoutItem.KeyboardAccelerators>
        <WinKeyboardAccelerator Key="V" Modifiers="Control" />
      </WinMenuFlyoutItem.KeyboardAccelerators>
    </WinMenuFlyoutItem>
  </WinMenuBarItem>
  <WinMenuBarItem Title="Help">
    <WinMenuFlyoutItem Text="About">
      <WinMenuFlyoutItem.KeyboardAccelerators>
        <WinKeyboardAccelerator Key="I" Modifiers="Control" />
      </WinMenuFlyoutItem.KeyboardAccelerators>
    </WinMenuFlyoutItem>
  </WinMenuBarItem>
</WinMenuBar>`;
const submenuCode = `<WinMenuBar>
  <WinMenuBarItem Title="File">
    <WinMenuFlyoutSubItem Text="New">
      <WinMenuFlyoutItem Text="Plain Text Document" />
      <WinMenuFlyoutItem Text="Rich Text Document" />
      <WinMenuFlyoutItem Text="Other Formats..." />
    </WinMenuFlyoutSubItem>
    <WinMenuFlyoutItem Text="Open..." />
    <WinMenuFlyoutItem Text="Save" />
    <WinMenuFlyoutSeparator />
    <WinMenuFlyoutItem Text="Exit" />
  </WinMenuBarItem>
  <WinMenuBarItem Title="Edit">
    <WinMenuFlyoutItem Text="Undo" />
    <WinMenuFlyoutItem Text="Cut" />
    <WinMenuFlyoutItem Text="Copy" />
    <WinMenuFlyoutItem Text="Paste" />
  </WinMenuBarItem>
  <WinMenuBarItem Title="View">
    <WinMenuFlyoutItem Text="Output" />
    <WinMenuFlyoutSeparator />
    <WinRadioMenuFlyoutItem Text="Landscape" GroupName="OrientationGroup" />
    <WinRadioMenuFlyoutItem Text="Portrait" GroupName="OrientationGroup" IsChecked="True" />
    <WinMenuFlyoutSeparator />
    <WinRadioMenuFlyoutItem Text="Small icons" GroupName="SizeGroup" />
    <WinRadioMenuFlyoutItem Text="Medium icons" GroupName="SizeGroup" IsChecked="True" />
    <WinRadioMenuFlyoutItem Text="Large icons" GroupName="SizeGroup" />
  </WinMenuBarItem>
  <WinMenuBarItem Title="Help">
    <WinMenuFlyoutItem Text="About" />
  </WinMenuBarItem>
</WinMenuBar>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.sample-stack { width: 100%; display: flex; flex-direction: column; }
</style>
