<template>
  <ScrollViewer class="gallery-page-scroll" VerticalScrollBarVisibility="Auto" VerticalScrollMode="Auto">
    <div class="gallery-item-page">
      <div class="page-heading">
          <TextBlock class="page-header" :Text="$t('text.menuflyout')" />
          <TextBlock class="page-description" :Text="$t('text.a-menuflyout-displays-a-lightweight-menu-of-comm')" TextWrapping="WrapWholeWords" />
          <div class="page-header-actions">
            <Button class="header-action" @Click="toggleTheme"><span class="icon"></span></Button>
            <ToggleButton :IsChecked="isFavoriteState" class="header-action" @update:IsChecked="toggleFavorite">
              <span class="icon">{{ isFavoriteState ? '&#xE735;' : '&#xE734;' }}</span>
            </ToggleButton>
          </div>
        </div>
      <div class="gallery-page-content">
        <ControlExample class="basic-input-example-theme" :headerText="$t('text.a-menuflyout-attached-to-an-appbarbutton')" :theme="pageTheme" :vue="appBarCode">
              <template #example>
                <div class="sample-row">
                  <AppBarButton
                    Icon="Sort"
                    :IsCompact="true"
                    v-bind="{
                      'ToolTipService.ToolTip': $t('sample.sort'),
                      'AutomationProperties.Name': $t('sample.sort')
                    }"
                    :Flyout="sortFlyout"
                    @Select="onSortSelect" />
                  <TextBlock class="output-text" :Text="sortOutput" />
                </div>
              </template>
            </ControlExample>

            <ControlExample class="basic-input-example-theme" :headerText="$t('sample.menuflyout.toggle-items')" :theme="pageTheme" :vue="toggleCode">
              <template #example>
                <Button @Click="openMenu($event, toggleMenu)">
                  <TextBlock :Text="$t('sample.options')" />
                </Button>
                <MenuFlyout
                  :Open="toggleMenu.open"
                  :AnchorRect="toggleMenu.anchor"
                  :Items="toggleItems"
                  :Theme="pageTheme"
                  @Close="toggleMenu.open = false" />
              </template>
            </ControlExample>

            <ControlExample class="basic-input-example-theme" :headerText="$t('sample.menuflyout.cascading')" :theme="pageTheme" :vue="cascadeCode">
              <template #example>
                <Button @Click="openMenu($event, cascadeMenu)">
                  <TextBlock :Text="$t('sample.file-options')" />
                </Button>
                <MenuFlyout
                  :Open="cascadeMenu.open"
                  :AnchorRect="cascadeMenu.anchor"
                  :Items="cascadeItems"
                  :Theme="pageTheme"
                  @Close="cascadeMenu.open = false" />
              </template>
            </ControlExample>

            <ControlExample class="basic-input-example-theme" :headerText="$t('sample.menuflyout.split-items')" :theme="pageTheme" :vue="splitCode">
              <template #example>
                <div class="sample-row">
                  <Button @Click="openMenu($event, splitMenu)">
                    <TextBlock :Text="$t('sample.file-options')" />
                  </Button>
                  <TextBlock class="output-text" :Text="splitOutput" />
                </div>
                <MenuFlyout
                  :Open="splitMenu.open"
                  :AnchorRect="splitMenu.anchor"
                  :Items="splitItems"
                  :Theme="pageTheme"
                  @Close="splitMenu.open = false"
                  @Select="onSplitSelect" />
              </template>
            </ControlExample>

            <ControlExample class="basic-input-example-theme" :headerText="$t('sample.menuflyout.icons')" :theme="pageTheme" :vue="iconsCode">
              <template #example>
                <Button @Click="openMenu($event, iconsMenu)">
                  <TextBlock :Text="$t('sample.edit-options')" />
                </Button>
                <MenuFlyout
                  :Open="iconsMenu.open"
                  :AnchorRect="iconsMenu.anchor"
                  :Items="iconItems"
                  :Theme="pageTheme"
                  @Close="iconsMenu.open = false" />
              </template>
            </ControlExample>

            <ControlExample class="basic-input-example-theme" :headerText="$t('sample.menuflyout.keyboard')" :theme="pageTheme" :vue="keyboardCode">
              <template #example>
                <Button @Click="openMenu($event, keyboardMenu)">
                  <TextBlock :Text="$t('sample.edit-options')" />
                </Button>
                <MenuFlyout
                  :Open="keyboardMenu.open"
                  :AnchorRect="keyboardMenu.anchor"
                  :Items="keyboardItems"
                  :Theme="pageTheme"
                  @Close="keyboardMenu.open = false" />
              </template>
            </ControlExample>

            <ControlExample class="basic-input-example-theme" :headerText="$t('sample.menuflyout.radio')" :theme="pageTheme" :vue="radioCode">
              <template #example>
                <Button @Click="openMenu($event, radioMenu)">
                  <TextBlock :Text="$t('sample.options')" />
                </Button>
                <MenuFlyout
                  :Open="radioMenu.open"
                  :AnchorRect="radioMenu.anchor"
                  :Items="radioItems"
                  :Theme="pageTheme"
                  @Close="radioMenu.open = false" />
              </template>
            </ControlExample>
      </div>
    </div>
  </ScrollViewer>
</template>

<script setup>
import { computed, inject, reactive, ref } from 'vue';
import AppBarButton from '../../components/AppBarButton.vue';
import Button from '../../components/Button.vue';
import ControlExample from '../../components/ControlExample.vue';
import MenuFlyout from '../../components/MenuFlyout.vue';
import TextBlock from '../../components/TextBlock.vue';
import ToggleButton from '../../components/ToggleButton.vue';
import { useI18n } from '../../components/i18n/index';
import { createPageState } from '../../utils/pageState';

import ScrollViewer from '../../components/ScrollViewer.vue';
const { t } = useI18n();
const currentPage = inject('currentPage');
const pageKey = computed(() => currentPage?.value || 'menuflyout');
const { isFavoriteState, pageTheme, toggleTheme, toggleFavorite } = createPageState(pageKey.value);

const makeMenu = () => reactive({ open: false, anchor: null });
const toggleMenu = makeMenu();
const cascadeMenu = makeMenu();
const splitMenu = makeMenu();
const iconsMenu = makeMenu();
const keyboardMenu = makeMenu();
const radioMenu = makeMenu();
const allMenus = [toggleMenu, cascadeMenu, splitMenu, iconsMenu, keyboardMenu, radioMenu];

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
const sortFlyout = computed(() => ({ Items: sortItems, Theme: pageTheme.value }));

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
};

const onSplitSelect = (item) => {
  splitOutput.value = t('sample.clicked', { value: item.Text });
  splitMenu.open = false;
};

const appBarCode = `<AppBarButton
  Icon="Sort"
  IsCompact="True"
  ToolTipService.ToolTip="Sort"
  AutomationProperties.Name="Sort">
  <AppBarButton.Flyout>
    <MenuFlyout>
      <MenuFlyoutItem Text="By rating" Tag="rating" Click="MenuFlyoutItem_Click" />
      <MenuFlyoutItem Text="By match" Tag="match" Click="MenuFlyoutItem_Click" />
      <MenuFlyoutItem Text="By distance" Tag="distance" Click="MenuFlyoutItem_Click" />
    </MenuFlyout>
  </AppBarButton.Flyout>
</AppBarButton>`;
const toggleCode = `<Button Content="Options" Click="Control2_Click">
  <Button.Flyout>
    <MenuFlyout>
      <MenuFlyoutItem Text="Reset" />
      <MenuFlyoutSeparator />
      <ToggleMenuFlyoutItem Text="Repeat" IsChecked="True" />
      <ToggleMenuFlyoutItem Text="Shuffle" IsChecked="True" />
    </MenuFlyout>
  </Button.Flyout>
</Button>`;
const cascadeCode = `<Button Content="File Options" Click="Control3_Click">
  <Button.Flyout>
    <MenuFlyout>
      <MenuFlyoutItem Text="Open" />
      <MenuFlyoutSubItem Text="Send to">
        <MenuFlyoutItem Text="Bluetooth" />
        <MenuFlyoutItem Text="Desktop (shortcut)" />
        <MenuFlyoutSubItem Text="Compressed file">
          <MenuFlyoutItem Text="Compress and email" />
          <MenuFlyoutItem Text="Compress to .7z" />
          <MenuFlyoutItem Text="Compress to .zip" />
        </MenuFlyoutSubItem>
      </MenuFlyoutSubItem>
    </MenuFlyout>
  </Button.Flyout>
</Button>`;
const splitCode = `<Button Content="File Options" Click="Control3b_Click">
  <Button.Flyout>
    <MenuFlyout>
      <SplitMenuFlyoutItem Text="Save" Icon="Save" Click="SplitMenuFlyoutItem_Click">
        <MenuFlyoutItem Text="Save as .docx" Click="SplitMenuFlyoutItem_Click" />
        <MenuFlyoutItem Text="Save as .pdf" Click="SplitMenuFlyoutItem_Click" />
        <MenuFlyoutItem Text="Save as .txt" Click="SplitMenuFlyoutItem_Click" />
      </SplitMenuFlyoutItem>
      <SplitMenuFlyoutItem Text="Share" Icon="Share" Click="SplitMenuFlyoutItem_Click">
        <MenuFlyoutItem Text="Share via email" Click="SplitMenuFlyoutItem_Click" />
        <MenuFlyoutItem Text="Share via link" Click="SplitMenuFlyoutItem_Click" />
      </SplitMenuFlyoutItem>
    </MenuFlyout>
  </Button.Flyout>
</Button>`;
const iconsCode = `<Button Content="Edit Options" Click="Control4_Click">
  <Button.Flyout>
    <MenuFlyout>
      <MenuFlyoutItem Text="Share" Icon="Share" />
      <MenuFlyoutItem Text="Copy" Icon="Copy" />
      <MenuFlyoutItem Text="Delete" Icon="Delete" />
      <MenuFlyoutSeparator />
      <MenuFlyoutItem Text="Rename" />
      <MenuFlyoutItem Text="Select" />
    </MenuFlyout>
  </Button.Flyout>
</Button>`;
const keyboardCode = `<Button Content="Edit Options" Click="Control5_Click">
  <Button.Flyout>
    <MenuFlyout>
      <MenuFlyoutItem Text="Share" Icon="Share">
        <MenuFlyoutItem.KeyboardAccelerators>
          <KeyboardAccelerator Key="S" Modifiers="Control" />
        </MenuFlyoutItem.KeyboardAccelerators>
      </MenuFlyoutItem>
      <MenuFlyoutItem Text="Copy" Icon="Copy" FontFamily="Consolas">
        <MenuFlyoutItem.KeyboardAccelerators>
          <KeyboardAccelerator Key="C" Modifiers="Control" />
        </MenuFlyoutItem.KeyboardAccelerators>
      </MenuFlyoutItem>
      <MenuFlyoutItem Text="Delete" Icon="Delete" FontFamily="Segoe UI">
        <MenuFlyoutItem.KeyboardAccelerators>
          <KeyboardAccelerator Key="Delete" />
        </MenuFlyoutItem.KeyboardAccelerators>
      </MenuFlyoutItem>
      <MenuFlyoutSeparator />
      <MenuFlyoutItem Text="Rename" />
      <MenuFlyoutItem Text="Select" />
    </MenuFlyout>
  </Button.Flyout>
</Button>`;
const radioCode = `<Button Content="Options" Click="Control6_Click">
  <Button.Flyout>
    <MenuFlyout>
      <RadioMenuFlyoutItem GroupName="OrientationGroup" Text="Landscape" />
      <RadioMenuFlyoutItem GroupName="OrientationGroup" IsChecked="True" Text="Portrait" />
      <MenuFlyoutSeparator />
      <RadioMenuFlyoutItem GroupName="SizeGroup" Text="Small icons" />
      <RadioMenuFlyoutItem GroupName="SizeGroup" IsChecked="True" Text="Medium icons" />
      <RadioMenuFlyoutItem GroupName="SizeGroup" Text="Large icons" />
    </MenuFlyout>
  </Button.Flyout>
</Button>`;
</script>

<style scoped>
.page-heading { position: relative; }
.page-header { font-size: 28px; font-weight: 600; margin: 0 0 8px; color: var(--text-primary); }
.page-description { color: var(--text-secondary); margin: 0 72px 16px 0; line-height: 20px; }
.page-header-actions { position: absolute; top: 0; right: 0; display: flex; gap: 4px; }
.icon { font-size: 16px; }
.sample-row { display: flex; align-items: flex-start; }
.output-text { margin: 8px 0 0 8px; color: var(--text-secondary); }
</style>
