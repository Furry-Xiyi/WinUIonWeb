<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <TextBlock class="page-header" :Text="$t('text.menubar')" />
          <TextBlock class="page-description" :Text="$t('text.the-menubar-simplifies-the-creation-of-basic-men')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button class="header-action" @Click="toggleTheme"><span class="icon"></span></Button>
            <ToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </ToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <ControlExample class="basic-input-example-theme" :headerText="$t('text.a-simple-menubar')" :theme="pageTheme" :vue="simpleCode">
              <template #example>
                <div class="sample-stack">
                  <TextBlock :Text="simpleOutput" TextWrapping="WrapWholeWords" />
                  <MenuBar :Items="simpleItems" :Theme="pageTheme" @ItemClick="simpleOutput = itemClickText($event.Item)" />
                </div>
              </template>
            </ControlExample>

            <ControlExample class="basic-input-example-theme" :headerText="$t('sample.menubar.keyboard')" :theme="pageTheme" :vue="acceleratorCode">
              <template #example>
                <div class="sample-stack">
                  <TextBlock :Text="acceleratorOutput" TextWrapping="WrapWholeWords" />
                  <MenuBar :Items="acceleratorItems" :Theme="pageTheme" @ItemClick="acceleratorOutput = itemClickText($event.Item)" />
                </div>
              </template>
            </ControlExample>

            <ControlExample class="basic-input-example-theme" :headerText="$t('sample.menubar.submenus')" :theme="pageTheme" :vue="submenuCode">
              <template #example>
                <div class="sample-stack">
                  <TextBlock :Text="submenuOutput" TextWrapping="WrapWholeWords" />
                  <MenuBar :Items="submenuItems" :Theme="pageTheme" @ItemClick="submenuOutput = itemClickText($event.Item)" />
                </div>
              </template>
            </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import MenuBar from '../../components/MenuBar.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { createPageState } from '../../utils/pageState';

import { useI18n } from '../../components/i18n/index';

import ScrollViewer from '../../components/ScrollViewer.vue';
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

const simpleCode = `<MenuBar>
  <MenuBarItem Title="File">
    <MenuFlyoutItem Text="New" />
    <MenuFlyoutItem Text="Open..." />
    <MenuFlyoutItem Text="Save" />
    <MenuFlyoutItem Text="Exit" />
  </MenuBarItem>
  <MenuBarItem Title="Edit">
    <MenuFlyoutItem Text="Undo" />
    <MenuFlyoutItem Text="Cut" />
    <MenuFlyoutItem Text="Copy" />
    <MenuFlyoutItem Text="Paste" />
  </MenuBarItem>
  <MenuBarItem Title="Help">
    <MenuFlyoutItem Text="About" />
  </MenuBarItem>
</MenuBar>`;
const acceleratorCode = `<MenuBar>
  <MenuBarItem Title="File">
    <MenuFlyoutItem Text="New">
      <MenuFlyoutItem.KeyboardAccelerators>
        <KeyboardAccelerator Key="N" Modifiers="Control" />
      </MenuFlyoutItem.KeyboardAccelerators>
    </MenuFlyoutItem>
    <MenuFlyoutItem Text="Open...">
      <MenuFlyoutItem.KeyboardAccelerators>
        <KeyboardAccelerator Key="O" Modifiers="Control" />
      </MenuFlyoutItem.KeyboardAccelerators>
    </MenuFlyoutItem>
    <MenuFlyoutItem Text="Save">
      <MenuFlyoutItem.KeyboardAccelerators>
        <KeyboardAccelerator Key="S" Modifiers="Control" />
      </MenuFlyoutItem.KeyboardAccelerators>
    </MenuFlyoutItem>
    <MenuFlyoutItem Text="Exit">
      <MenuFlyoutItem.KeyboardAccelerators>
        <KeyboardAccelerator Key="E" Modifiers="Control" />
      </MenuFlyoutItem.KeyboardAccelerators>
    </MenuFlyoutItem>
  </MenuBarItem>
  <MenuBarItem Title="Edit">
    <MenuFlyoutItem Text="Undo">
      <MenuFlyoutItem.KeyboardAccelerators>
        <KeyboardAccelerator Key="Z" Modifiers="Control" />
      </MenuFlyoutItem.KeyboardAccelerators>
    </MenuFlyoutItem>
    <MenuFlyoutItem Text="Cut">
      <MenuFlyoutItem.KeyboardAccelerators>
        <KeyboardAccelerator Key="X" Modifiers="Control" />
      </MenuFlyoutItem.KeyboardAccelerators>
    </MenuFlyoutItem>
    <MenuFlyoutItem Text="Copy">
      <MenuFlyoutItem.KeyboardAccelerators>
        <KeyboardAccelerator Key="C" Modifiers="Control" />
      </MenuFlyoutItem.KeyboardAccelerators>
    </MenuFlyoutItem>
    <MenuFlyoutItem Text="Paste">
      <MenuFlyoutItem.KeyboardAccelerators>
        <KeyboardAccelerator Key="V" Modifiers="Control" />
      </MenuFlyoutItem.KeyboardAccelerators>
    </MenuFlyoutItem>
  </MenuBarItem>
  <MenuBarItem Title="Help">
    <MenuFlyoutItem Text="About">
      <MenuFlyoutItem.KeyboardAccelerators>
        <KeyboardAccelerator Key="I" Modifiers="Control" />
      </MenuFlyoutItem.KeyboardAccelerators>
    </MenuFlyoutItem>
  </MenuBarItem>
</MenuBar>`;
const submenuCode = `<MenuBar>
  <MenuBarItem Title="File">
    <MenuFlyoutSubItem Text="New">
      <MenuFlyoutItem Text="Plain Text Document" />
      <MenuFlyoutItem Text="Rich Text Document" />
      <MenuFlyoutItem Text="Other Formats..." />
    </MenuFlyoutSubItem>
    <MenuFlyoutItem Text="Open..." />
    <MenuFlyoutItem Text="Save" />
    <MenuFlyoutSeparator />
    <MenuFlyoutItem Text="Exit" />
  </MenuBarItem>
  <MenuBarItem Title="Edit">
    <MenuFlyoutItem Text="Undo" />
    <MenuFlyoutItem Text="Cut" />
    <MenuFlyoutItem Text="Copy" />
    <MenuFlyoutItem Text="Paste" />
  </MenuBarItem>
  <MenuBarItem Title="View">
    <MenuFlyoutItem Text="Output" />
    <MenuFlyoutSeparator />
    <RadioMenuFlyoutItem Text="Landscape" GroupName="OrientationGroup" />
    <RadioMenuFlyoutItem Text="Portrait" GroupName="OrientationGroup" IsChecked="True" />
    <MenuFlyoutSeparator />
    <RadioMenuFlyoutItem Text="Small icons" GroupName="SizeGroup" />
    <RadioMenuFlyoutItem Text="Medium icons" GroupName="SizeGroup" IsChecked="True" />
    <RadioMenuFlyoutItem Text="Large icons" GroupName="SizeGroup" />
  </MenuBarItem>
  <MenuBarItem Title="Help">
    <MenuFlyoutItem Text="About" />
  </MenuBarItem>
</MenuBar>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.sample-stack { width: 100%; display: flex; flex-direction: column; }
</style>
